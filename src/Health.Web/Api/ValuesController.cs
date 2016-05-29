using Health.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Health.Web.Api
{
    public class ValuesController : Controller
    {
        private readonly IBusinessService _businessLayer;
        private readonly ILogger _logger;

        public ValuesController(IBusinessService businessLayer, ILogger<ValuesController> logger)
        {
            _businessLayer = businessLayer;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult GetManufacturers()
        {
            var manufacturers = _businessLayer.GetData();
            return Ok(manufacturers);
        }

        [HttpGet]
        public string GetData()
        {
            const string data = "data";
            _logger.LogInformation("we logged something");
            return data;
        }

        [HttpGet]
        [Authorize]
        public ActionResult GetSecuredData()
        {
            const string data = "this is secured data, congratulations";
            return Ok(data);
        }
    }
}
