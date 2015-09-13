using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Builder.Internal;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Http.Extensions;
using Microsoft.AspNet.Mvc;

namespace Health.Web.Middleware
{
    public class ForceSsl
    {
        private readonly RequestDelegate _next;
        private readonly PathString whiteListPath = new PathString("/.well-known");

        public ForceSsl(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext context)
        {
            if (context.Request.IsHttps || context.Request.Path.StartsWithSegments(whiteListPath))
                return _next.Invoke(context);
            var url = context.Request.GetEncodedUrl();
            var redirectUrl = url.Replace("http", "https");
            context.Response.Redirect(redirectUrl);
            return Task.FromResult(0);
        }
    }
}
