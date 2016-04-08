using Health.Core;
using Health.Core.EF;
using Health.Core.Models;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.PlatformAbstractions;

namespace Health.Web
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; set; }

        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("config.json").AddEnvironmentVariables()
                .AddJsonFile($"config.{env.EnvironmentName}.json", optional: true);
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            HealthContext.ConnectionString = Configuration["Data:DefaultConnection:ConnectionString"];
            services.AddMvc();
            services.AddTransient<IBusinessService, EfBusinessLayer>();
            services.AddTransient<ILoggerFactory, CustomLoggerFactory>();
            services.AddLogging();
        }


        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory, IRuntimeEnvironment env)
        {
#if !DEBUG
            app.UseForceSSL();
#endif
            //loggerFactory.AddConsole();
            app.UseIISPlatformHandler();
            app.UseDeveloperExceptionPage();
            app.UseMvc(builder =>
            {
                builder.MapRoute(name: "defaultApi", template: "api/{controller}/{action}");
            });
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}