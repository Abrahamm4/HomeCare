using HomeCareApi.DAL;
using HomeCareApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using System.Text;
using Microsoft.AspNetCore.Mvc; // for ApiBehaviorOptions
using System.Diagnostics;
using HomeCareApi.Services;

namespace HomeCareApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ===============================
            // Logging (Serilog)
            // ===============================
            var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.File($"Logs/app_{timestamp}.log")
                .Filter.ByExcluding(e =>
                    e.Properties.TryGetValue("SourceContext", out var value) &&
                    e.Level == LogEventLevel.Information &&
                    e.MessageTemplate.Text.Contains("Executed DbCommand"))
                .CreateLogger();

            builder.Logging.ClearProviders();
            builder.Logging.AddSerilog(logger: Log.Logger, dispose: true);

            if (builder.Environment.IsDevelopment())
            {
                builder.Logging.AddConsole();
            }

            // ===============================
            // Services
            // ===============================
            builder.Services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            // Validation errors uniform (will map to ValidationProblemDetails automatically)
            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var problem = new ValidationProblemDetails(context.ModelState)
                    {
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Validation Failed",
                        Instance = context.HttpContext.Request.Path
                    };
                    Enrich(problem, context.HttpContext);
                    return new ObjectResult(problem) { StatusCode = problem.Status };
                };
            });

            // Database (SQLite)
            builder.Services.AddDbContext<HomeCareDbContext>(options =>
                options.UseSqlite(builder.Configuration["ConnectionStrings:HomeCareDbContextConnection"]));

            // Database (Authentication) 
            builder.Services.AddDbContext<AuthDbContext>(options =>
            {
                options.UseSqlite(builder.Configuration["ConnectionStrings:AuthDbContextConnection"]);
            });

            builder.Services.AddIdentity<AuthUser, IdentityRole>()
                .AddEntityFrameworkStores<AuthDbContext>()
                .AddDefaultTokenProviders();

            // CORS (Frontend access control)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // Authentication: JWT Bearer
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
                    )
                };
            });

            builder.Services.AddAuthorization();

            // Repositories (DI)
            builder.Services.AddScoped<IAvailableDayRepository, AvailableDayRepository>();
            builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            builder.Services.AddScoped<IPatientRepository, PatientRepository>();
            builder.Services.AddScoped<IPersonnelRepository, PersonnelRepository>();

            // App services
            builder.Services.AddScoped<UserLinkingService>();

            // Swagger (API documentation)
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "HomeCare API", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer <your-token>'"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
           {
                {
                    new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
                  new string[] {}
                }
             });
            });

            // Secondary CORS policy (not used) retained for backward compatibility if referenced elsewhere
            builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", b =>
    {
        b.WithOrigins("http://localhost:5173")
         .AllowAnyMethod()
         .AllowAnyHeader()
         .AllowCredentials();
    });
});

            var app = builder.Build();

            // ===============================
            // Central exception handler
            // ===============================
            app.Use(async (context, next) =>
            {
                try
                {
                    await next();
                }
                catch (Exception ex)
                {
                    var traceId = Activity.Current?.Id ?? context.TraceIdentifier;
                    Log.Error(ex, "Unhandled exception {TraceId}: {Message}", traceId, ex.Message);
                    var problem = new ProblemDetails
                    {
                        Status = StatusCodes.Status500InternalServerError,
                        Title = "Internal Server Error",
                        Detail = app.Environment.IsDevelopment() ? ex.Message : null,
                        Instance = context.Request.Path
                    };
                    problem.Extensions["traceId"] = traceId;
                    problem.Extensions["errorCode"] = problem.Status;
                    problem.Extensions["method"] = context.Request.Method;
                    context.Response.StatusCode = problem.Status.Value;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsJsonAsync(problem);
                }
            });

            // Convert non-success status codes (like404 for unknown routes) into ProblemDetails
            app.UseStatusCodePages(async statusCtx =>
            {
                var resp = statusCtx.HttpContext.Response;
                if (resp.StatusCode >=400 && !resp.HasStarted)
                {
                    var problem = new ProblemDetails
                    {
                        Status = resp.StatusCode,
                        Title = resp.StatusCode ==404 ? "Not Found" : "Error",
                        Instance = statusCtx.HttpContext.Request.Path
                    };
                    Enrich(problem, statusCtx.HttpContext);
                    resp.ContentType = "application/json";
                    await resp.WriteAsJsonAsync(problem);
                }
            });

            // ===============================
            // Test database connection
            // ===============================
            try
            {
                using var scope = app.Services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<HomeCareDbContext>();
                db.Database.CanConnect();
                Console.WriteLine("Database connection established.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database connection failed: {ex.Message}");
            }

            // ===============================
            // Middleware pipeline
            // ===============================
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowFrontend");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            // ===============================
            // Optional: seed database (dev)
            // ===============================
            if (app.Environment.IsDevelopment())
            {
                using var scope = app.Services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<HomeCareDbContext>();
                if (!db.Patients.Any())
                {
                    DBInit.Seed(app);
                    Console.WriteLine("Database seeded.");
                }
            }
            // ===============================
            // Seed Roles and Users
            // ===============================
            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                DbSeedAuth.SeedRoles(roleManager).Wait();

                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AuthUser>>();
                DbSeedAuth.SeedUsers(userManager).Wait();

                // Link seeded users to domain profiles
                var db = scope.ServiceProvider.GetRequiredService<HomeCareDbContext>();
                DbSeedAuth.SeedLinkedProfiles(userManager, db).Wait();
            }

            app.Run();
        }

        private static void Enrich(ProblemDetails problem, HttpContext httpContext)
        {
            var traceId = Activity.Current?.Id ?? httpContext.TraceIdentifier;
            problem.Extensions["traceId"] = traceId;
            problem.Extensions["method"] = httpContext.Request.Method;
            if (!problem.Extensions.ContainsKey("errorCode"))
                problem.Extensions["errorCode"] = problem.Status;
        }
    }
}
