using Health.Core;
using Health.Core.EF;
using Health.Core.Models;
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
        public IConfiguration Configuration { get; set; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("config.json").AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            HealthContext.ConnectionString = Configuration["Data:DefaultConnection:ConnectionString"];
            services.AddMvc();
            services.AddTransient<IBusinessService, EfBusinessLayer>();
            //services.AddTransient<ILoggerFactory, CustomLoggerFactory>();
            services.AddLogging();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory logFactory)
        {
#if !DEBUG
            app.UseForceSSL();
#endif
            logFactory.AddConsole();
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
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
