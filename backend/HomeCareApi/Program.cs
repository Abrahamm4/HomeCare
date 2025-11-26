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

namespace HomeCareApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ===============================
            // ?? Logging (Serilog)
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
            // ?? Services
            // ===============================
            builder.Services.AddControllers().AddNewtonsoftJson(options =>
            {
                // Example: configure serializer settings
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
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

            // Swagger (API documentation)
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "HomeCare API", Version = "v1" });

                // Add Bearer token support in Swagger
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


            // CORS (Cross-Origin Resource Sharing)
            builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:5173") // Allow requests from the React frontend
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

            var app = builder.Build();

            // ===============================
            // ?? Test database connection
            // ===============================
            try
            {
                using var scope = app.Services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<HomeCareDbContext>();
                db.Database.CanConnect();
                Console.WriteLine("? Database connection established!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"? Database connection failed: {ex.Message}");
            }

            // ===============================
            // ?? Middleware pipeline
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
            // ?? Optional: seed database (dev)
            // ===============================
            if (app.Environment.IsDevelopment())
            {
                using var scope = app.Services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<HomeCareDbContext>();
                if (!db.Patients.Any())
                {
                    DBInit.Seed(app);
                    Console.WriteLine("?? Database seeded.");
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
            }


            app.Run();
        }
    }
}
