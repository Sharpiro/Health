using Health.Core.EF;
using Health.Core.Models;
using Microsoft.AspNet.Builder;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.IO;

namespace Health.Web
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IHostingEnvironment env)
        {
            _configuration = new ConfigurationBuilder().SetBasePath(env.ContentRootPath)
                .AddJsonFile("config.json", true).AddEnvironmentVariables().Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var conn = _configuration.GetConnectionString("DefaultConnection");
            HealthContext.ConnectionString = conn;
            services.AddMvc();
            services.AddTransient<IBusinessService, EfBusinessLayer>();
            ////services.AddTransient<ILoggerFactory, CustomLoggerFactory>();
            //services.AddLogging();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory logFactory)
        {
            logFactory.AddConsole();
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            app.UseForceApi();
            app.UseMvc(builder =>
            {
                builder.MapRoute(name: "defaultApi", template: "api/{controller}/{action}");
            });
            app.UseFileServer();
        }

        public static void Main(string[] args)
        {
            new WebHostBuilder().UseKestrel().UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration().UseStartup<Startup>().Build().Run();
        }
    }
}
