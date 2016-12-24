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
    class AboutSetup : SetupBase
    {
        [Test]
        public void ShouldMigrateExistingData()
        {
            var aboutRepository = new AboutRepository(_mongoDbProvider);
            const string dataBaseDir = "C:/dev/Phillip Buttrose/Guitars/Web/assets/about";

            Console.WriteLine("MigrateAbout - purge");

            aboutRepository.Purge();

            Console.WriteLine("MigrateAbout - load");

            var jsonData = File.ReadAllText(Path.Combine(dataBaseDir, "data.json"));
            var aboutViewModel = JsonConvert.DeserializeObject<AboutViewModel>(jsonData);
            var adoutDataModel = new AboutDataModel
            {
                _id = new ObjectId(),
                Title = aboutViewModel.Title,
                SubTitle = aboutViewModel.SubTitle,
                Description = aboutViewModel.Description,
                Image = aboutRepository.UploadFiles(dataBaseDir, new List<string>{aboutViewModel.Image}).FirstOrDefault(),
                FacebookUrl = aboutViewModel.FacebookUrl,
                GooglePlusUrl = aboutViewModel.GooglePlusUrl,
                LinkedInUrl = aboutViewModel.LinkedInUrl,
                TwitterUrl = aboutViewModel.TwitterUrl
            };

            Console.WriteLine("MigrateAbout - save");

            aboutRepository.Save(adoutDataModel);
        }
    }
}
