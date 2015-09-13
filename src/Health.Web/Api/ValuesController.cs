using Health.Core;
using Health.Core.Models;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;

namespace Health.Web.Api
{
    //[Route("[controller]")]
    public class ValuesController : Controller
    {
        private readonly IBusinessService _businessLayer;
        private readonly EfBusinessLayer _efBusinessLayer;

        public ValuesController(IBusinessService businessLayer, EfBusinessLayer efBusinessLayer)
        {
            _businessLayer = businessLayer;
            _efBusinessLayer = efBusinessLayer;
        }

        [HttpGet]
        public ActionResult GetManufacturers()
        {
            var manufacturers = _efBusinessLayer.GetData();
            return Ok(manufacturers);
        }

        [HttpGet]
        [Authorize]
        public ActionResult GetSecuredData()
        {
            var data = "this is secured data, congratulations";
            return Ok(data);
        }
    }
}
