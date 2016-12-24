using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Models;
using Data.Repositories;
using MongoDB.Bson;
using Newtonsoft.Json;
using NUnit.Framework;
using Web.Models;

namespace Data.Setup.Tests
{
    class PortfolioSetup : SetupBase
    {
        [Test]
        public void ShouldSetupPortfolio()
        {
            var portfolioRepository = new PortfolioRepository(_mongoDbProvider);
            const string dataBaseDir = "C:/dev/Phillip Buttrose/Guitars/Web/assets/projects";

            Console.WriteLine("MigratePortfolio - purge");

            portfolioRepository.Purge();

            foreach (var directory in Directory.GetDirectories(dataBaseDir))
            {
                Console.WriteLine(string.Format("MigratePortfolio - load {0}",directory));

                var jsonData = File.ReadAllText(Path.Combine(directory, "data.json"));
                var portfolio = JsonConvert.DeserializeObject<Portfolio>(jsonData);
                var adoutDataModel = new PortfolioDataModel
                {
                    _id = new ObjectId(),
                    Category = portfolio.Category,
                    Classes = portfolio.Classes,
                    Client = portfolio.Client,
                    Date = portfolio.Date,
                    Description = portfolio.Description,
                    Ref = portfolio.Id,
                    Register = portfolio.Register,
                    Title = portfolio.Title,
                    SubTitle = portfolio.SubTitle,
                    Thumb = portfolioRepository.UploadFiles(directory, new List<string> { portfolio.Thumb }).FirstOrDefault(),
                    Images = portfolioRepository.UploadFiles(directory, portfolio.Images)
                };

                Console.WriteLine(string.Format("MigratePortfolio - save {0}", directory));

                portfolioRepository.Save(adoutDataModel);
            }
        }
    }
}
