using System.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Web
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            string origins = ConfigurationManager.AppSettings["Access-Control-Allow-Origin"] ?? "*";
            config.EnableCors(new EnableCorsAttribute(origins: origins, headers: "*", methods: "*") { SupportsCredentials = true });

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}