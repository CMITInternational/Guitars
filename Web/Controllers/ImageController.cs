using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Autofac.Integration.WebApi;
using Data.Models;
using Data.Providers;
using Data.Repositories;

namespace Web.Controllers
{
    [Route("api/image")]
    [AutofacControllerConfiguration]
    public class ImageController : ApiControllerBase
    {
        private readonly IMongoDbProvider _mongoProvider;

        public ImageController(IMongoDbProvider mongoProvider)
        {
            _mongoProvider = mongoProvider;
        }
    }
}
