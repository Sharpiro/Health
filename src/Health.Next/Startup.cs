using AutoMapper;
using Health.Core.Next.DataAccess;
using Health.Core.Next.Services;
using Health.Core.Next.Tools;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading.Tasks;

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
            //https://github.com/aspnet/Identity/issues/1082#issuecomment-273514725
            services.AddIdentity<IdentityUser<int>, IdentityRole<int>>()
                //.AddEntityFrameworkStores<HealthContext>()
                .AddDefaultTokenProviders();
            services.AddCors();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseExceptionHandler(builder =>
            {
                builder.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
                builder.Run(async context =>
                {
                    await Task.Yield();
                    context.Response.ContentType = "application/json";
                    var error = context.Features.Get<IExceptionHandlerFeature>();
                    if (error != null)
                    {
                        var errorDto = new { Message = error.Error?.Message };
                        var errorDtoJson = JsonConvert.SerializeObject(errorDto);
                        await context.Response.WriteAsync(errorDtoJson).ConfigureAwait(false);
                    }
                });
            });
            loggerFactory.AddConsole();

            //if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

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