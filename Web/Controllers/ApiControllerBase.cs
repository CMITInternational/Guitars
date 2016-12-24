using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using Web.Models;

namespace Web.Controllers
{
    public class ApiControllerBase : ApiController
    {
        public string PortfolioBase { get; private set; }
        public string RelativeBase { get; private set; }

        public ApiControllerBase()
        {
            RelativeBase = ConfigurationManager.AppSettings["Portfolio.Base"];
            PortfolioBase = HttpContext.Current.Server.MapPath(RelativeBase);
        }

        protected RegisterViewModel GetRegistry()
        {
            var headings = new List<string>();
            var columns = new List<RegisterColumnViewModel>();

            if (!Directory.Exists(PortfolioBase))
            {
                return new RegisterViewModel
                {
                    Headings = headings,
                    Columns = columns
                };
            }

            foreach (var directory in Directory.GetDirectories(PortfolioBase))
            {
                var path = Path.Combine(directory, "data.json");
                if (!File.Exists(path)) continue;
                var jsonText = File.ReadAllText(path);
                var model = JsonConvert.DeserializeObject<Portfolio>(jsonText);

                if (model.Register == null) continue;

                columns.Add(new RegisterColumnViewModel
                {
                    Title = model.Title,
                    RegisterItems = model.Register.ToDictionary(r => r[0], r => r[1])
                });
                foreach (
                    var header in
                        model.Register.Select(r => r[0])
                            .Where(header => !headings.Contains(header, StringComparer.OrdinalIgnoreCase)))
                {
                    headings.Add(header);
                }
            }

            return new RegisterViewModel
            {
                Headings = headings,
                Columns = columns.OrderBy(c => c.Title).ToList()
            };
        }
    }
}