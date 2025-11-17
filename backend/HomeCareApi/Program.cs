using HomeCareApi.DAL;
using HomeCareApi.Models;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;

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

            // Repositories (DI)
            builder.Services.AddScoped<IAvailableDayRepository, AvailableDayRepository>();
            builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            builder.Services.AddScoped<IPatientRepository, PatientRepository>();
            builder.Services.AddScoped<IPersonnelRepository, PersonnelRepository>();

            // Swagger (API documentation)
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

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

            app.Run();
        }
    }
}
