using Health.Core.EF;
using Health.Core.Models;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Dnx.Runtime;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.DependencyInjection;

namespace Health.Web
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; set; }

        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            var builder = new ConfigurationBuilder(appEnv.ApplicationBasePath)
                .AddJsonFile("config.json").AddEnvironmentVariables()
                .AddJsonFile($"config.{env.EnvironmentName}.json", optional: true);
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            HealthContext.ConnectionString = Configuration["Data:DefaultConnection:ConnectionString"];
            services.AddMvc();
            services.AddTransient<IBusinessService, EfBusinessLayer>();
        }

        public void Configure(IApplicationBuilder app, IRuntimeEnvironment env)
        {
#if !DEBUG
            //app.UseForceSSL();
#endif
            app.UseMvc(builder =>
            {
                builder.MapRoute(name: "defaultApi", template: "api/{controller}/{action}");
            });
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}
