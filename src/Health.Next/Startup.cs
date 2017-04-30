using AutoMapper;
using Health.Core.Next.DataAccess;
using Health.Core.Next.Services;
using Health.Core.Next.Tools;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.IO;

namespace Health.Next
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
            .SetBasePath(env.ContentRootPath)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
            .AddEnvironmentVariables();
            _configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient(factory =>
                new MapperConfiguration(cfg =>
                    cfg.AddProfile<MappingProfile>()).CreateMapper()
            );
            services.AddMvc();
            services.AddScoped<HealthContext>();
            services.AddScoped<HealthService>();
            services.AddScoped<FoodService>();
            services.AddDbContext<HealthContext>(options =>
                options.UseSqlServer(_configuration.GetConnectionString("DefaultConnection")));
            services.AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<HealthContext>()
                .AddDefaultTokenProviders();
            services.AddCors();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseCors(builder => builder.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            loggerFactory.AddConsole();

            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

            //app.UseOtherDirectory(env, "node_modules");
            app.UseMvc(builder =>
            {
                builder.MapRoute(name: "defaultApi", template: "api/{controller}/{action}/{id?}");
            });
            app.UseFileServer();
        }

        public static void Main(string[] args)
        {
            new WebHostBuilder().UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration().UseStartup<Startup>()
                .UseApplicationInsights().Build().Run();
        }
    }
}