using Health.Core.Next.DataAccess;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.IO;

namespace Health.Next
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<HealthContext>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
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