using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Health.Web.Api.Extensions
{
    public class ErrorObjectResult : ObjectResult
    {
        public ErrorObjectResult() : base("Internal Server Error")
        {
            StatusCode = StatusCodes.Status500InternalServerError;
        }

        public ErrorObjectResult(object value) : base(value)
        {
            StatusCode = StatusCodes.Status500InternalServerError;
        }
    }

    public static class ControllerExtensions
    {
        public static ErrorObjectResult Error(this Controller controller)
        {
            return new ErrorObjectResult();
        }

        public static ErrorObjectResult Error(this Controller controller, object value)
        {
            return new ErrorObjectResult(value);
        }
    }
}
