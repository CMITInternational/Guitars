using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using Web.Models;

namespace Web.Controllers
{
    [Route("api/register")]
    public class RegistryController : ApiControllerBase
    {
        [Route("api/register")]
        [HttpGet]
        public RegisterViewModel Get()
        {
            return GetRegistry();
        }
    }
}
