using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Security.Cryptography;
using AspNet.Security.OpenIdConnect.Server;
using Health.Core;
using Health.Web.Middleware;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.Dnx.Runtime;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.DependencyInjection;
using System.Reflection;
using Health.Core.Models;
using Health.Core.Providers;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

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
            var connectionString = Configuration["Data:DefaultConnection:ConnectionString"];
            services.AddTransient<IBusinessService, EfBusinessLayer>();
            HealthContext.ConnectionString = connectionString;
            services.AddAuthentication();
            services.AddCaching();
            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IRuntimeEnvironment env)
        {
#if !DEBUG
            app.UseForceSSL();
#endif
            app.Map("/api", api =>
            {
                api.UseOAuthBearerAuthentication(options =>
                {
                    options.AutomaticAuthentication = true;
                    options.Authority = Configuration["Data:TokenAuthority:http"];
                    //options.Audience = Configuration["Data:TokenAuthority"];
                    //TODO: avoid errors in the futre? github.com/aspnet-contrib/AspNet.Security.OpenIdConnect.Server/issues/94#issuecomment-118359248
                    options.TokenValidationParameters.ValidateAudience = false;
                });
                api.UseMvc(builder =>
                {
                    builder.MapRoute(name: "defaultApi", template: "{controller}/{action}");
                });
            });

            app.UseOpenIdConnectServer(options =>
            {
                options.AuthenticationScheme = OpenIdConnectDefaults.AuthenticationScheme;

                if (string.Equals(env.RuntimeType, "Mono", StringComparison.OrdinalIgnoreCase))
                {
                    var rsaCryptoServiceProvider = new RSACryptoServiceProvider(2048);
                    var rsaParameters = rsaCryptoServiceProvider.ExportParameters(true);

                    options.UseKey(new RsaSecurityKey(rsaParameters));
                }
                else
                {
                    options.UseCertificate(typeof(Startup).GetTypeInfo().Assembly, "Health.Web.Certificate.pfx", "Owin.Security.OpenIdConnect.Server");
                }

                options.ApplicationCanDisplayErrors = true;
                options.AllowInsecureHttp = true;
                options.Issuer = new Uri(Configuration["Data:TokenAuthority:http"]);
                options.TokenEndpointPath = new PathString("/token");
                options.AuthorizationEndpointPath = PathString.Empty;
                options.AccessTokenLifetime = new TimeSpan(0, 1, 0);
                options.ValidationEndpointPath = PathString.Empty;
                options.Provider = new DefaultAuthorizationProvider();
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}
