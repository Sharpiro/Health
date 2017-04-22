using Microsoft.AspNetCore.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System;

namespace Health.Core
{
    public class RedirectMiddleware
    {
        private readonly RequestDelegate _next;
        private const string _flag = "X-Unauthorized";

        public RedirectMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            context.Response.OnStarting(async () =>
            {
                if (context.Response.StatusCode == StatusCodes.Status401Unauthorized
                && context.Response.ContentType == null)
                {
                    context.Response.ContentType = "application/json";
                    var response = Get401Result("Authorization has been denied for this request");
                    var jsonString = JsonConvert.SerializeObject(response);
                    var buffer = Encoding.UTF8.GetBytes(jsonString);
                    //context.Response.Body = new MemoryStream();
                    await context.Response.Body.WriteAsync(buffer, 0, buffer.Length);
                }
            });
            await _next.Invoke(context);
        }

        //public async Task Invoke(HttpContext context)
        //{
        //    StringValues header;
        //    context.Response.OnStarting(() =>
        //    {
        //        Debug.WriteLine("Call back was done");
        //        if (context.Response.Headers.TryGetValue(_flag, out header))
        //        {
        //            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        //            Debug.WriteLine("status code updated");
        //        }
        //        return Task.FromResult(0);
        //    });
        //    await _next.Invoke(context);
        //    try
        //    {
        //        if (context.Response.StatusCode != StatusCodes.Status302Found)
        //            return;
        //        context.Response.Headers.TryGetValue("Location", out header);
        //        if (!header.ToString().ToLower().Contains("account/login"))
        //            return;
        //        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        //        context.Response.Headers.Remove("Location");
        //        context.Response.Headers.Append("Content-Type", "application/json");
        //        var returnObj = new { Error = "Authroization has been denied for this request" };
        //        var jsonString = JsonConvert.SerializeObject(returnObj);
        //        var buffer = Encoding.UTF8.GetBytes(jsonString);
        //        context.Response.Body.Write(buffer, 0, buffer.Length);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}

        public static void SetUnauthorizedFlag(IHeaderDictionary headers)
        {
            headers.Append(_flag, "true");
        }

        public static object Get200Result(string data = null, int statusCode = 200)
        {
            var response = new
            {
                status = statusCode,
                statusText = "Ok",
                data = data
            };
            return response;
        }

        public static object Get401Result(string data = null, int statusCode = 401)
        {
            var response = new
            {
                status = statusCode,
                statusText = "Unauthorized",
                data = data
            };
            return response;
        }
    }
}
