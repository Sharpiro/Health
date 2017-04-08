using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace Microsoft.AspNetCore.Builder
{
    public static class StaticFileExtensions
    {
        public static IApplicationBuilder UseOtherDirectory(this IApplicationBuilder app, IHostingEnvironment env, string otherDirectory)
        {
            var path = Path.Combine(env.ContentRootPath, otherDirectory);
            var options = new StaticFileOptions { FileProvider = new PhysicalFileProvider(path), RequestPath = new PathString($"/{otherDirectory}") };
            app.UseStaticFiles(options);
            return app;
        }
    }
}