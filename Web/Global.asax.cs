using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using Autofac;
using Autofac.Integration.WebApi;
using Common.Providers;
using Data.Models;
using Data.Providers;
using Data.Repositories;

namespace Web
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            // Create the container builder.
            var builder = new ContainerBuilder();

            // Register the Web API controllers.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // Register other dependancies
            //builder.RegisterType<AboutRepository>().As<IMongoDbRepository<AboutDataModel>>();
            //builder.RegisterType<ContactRepository>().As<IMongoDbRepository<ContactDataModel>>();
            //builder.RegisterType<PortfolioRepository>().As<IMongoDbRepository<PortfolioDataModel>>();
            //builder.RegisterType<ConfigProvider>().As<IConfigProvider>();
            //builder.RegisterType<IMongoDbProvider>().As<IMongoDbProvider>();

            // Build the container.
            var container = builder.Build();

            // Create the depenedency resolver.
            var resolver = new AutofacWebApiDependencyResolver(container);

            // Configure Web API with the dependency resolver.
            GlobalConfiguration.Configuration.DependencyResolver = resolver;

            GlobalConfiguration.Configure(WebApiConfig.Register);

            AutoMapperConfig.Configure();
        }
    }
}