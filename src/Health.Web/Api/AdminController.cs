using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Health.Web.Api
{
    [Authorize]
    public class AdminController : Controller
    {
        public ActionResult GetData()
        {
            return Ok("this is secured data, congratulations");
        }
    }
}
