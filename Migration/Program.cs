using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Common.Converters;
using Common.Providers;
using Data.Models;
using Data.Providers;
using Data.Repositories;
using MongoDB.Bson;
using Newtonsoft.Json;
using Web.Controllers;
using Web.Models;

namespace Migration
{
    class Program
    {
        private static MongoDbProvider _mongoDbProvider;
        private static ConfigProvider _configProvider;
        private static ImageToByteArrayToByteArrayConverer _imageConverter;

        static void Main(string[] args)
        {
            _configProvider = new ConfigProvider();
            _mongoDbProvider = new MongoDbProvider(_configProvider);
            _imageConverter = new ImageToByteArrayToByteArrayConverer();
            MigrateAbout();
            MigrateContaqct();
        }

        private static void MigrateContaqct()
        {
            var contactRepository = new ContactRepository(_mongoDbProvider);
            var dataBaseDir = "C:\\dev\\Phillip Buttrose\\Guitars\\Web\\assets\\contact";

            var jsonData = File.ReadAllText(Path.Combine(dataBaseDir, "data.json"));
            var contactViewModel = JsonConvert.DeserializeObject<ContactViewModel>(jsonData);
            var adoutDataModel = new ContactDataModel
            {
                _id = new ObjectId(),
                Header1 = contactViewModel.Header1,
                Header2 = contactViewModel.Header2,
                Address = contactViewModel.Address,
                BusinessHours = contactViewModel.BusinessHours.ConvertAll((b) => new BusinessHourDataModel{Day = b.Day,Hours = b.Hours}),
                Email = contactViewModel.Email,
                GoogleMap = contactViewModel.GoogleMap,
                Phone = contactViewModel.Phone,
                Spot = new SpotDataModel { Left = contactViewModel.Spot.Left, Top = contactViewModel.Spot.Top },
                Map = _imageConverter.Convert(Image.FromFile(Path.Combine(dataBaseDir, contactViewModel.Map)))
            };

            contactRepository.Purge();
            contactRepository.Save(adoutDataModel);
        }

        private static void MigrateAbout()
        {
            var aboutRepository = new AboutRepository(_mongoDbProvider);
            var dataBaseDir = "C:\\dev\\Phillip Buttrose\\Guitars\\Web\\assets\\about";

            var jsonData = File.ReadAllText(Path.Combine(dataBaseDir, "data.json"));
            var aboutViewModel = JsonConvert.DeserializeObject<AboutViewModel>(jsonData);
            var adoutDataModel = new AboutDataModel
            {
                _id = new ObjectId(),
                Title = aboutViewModel.Title,
                SubTitle = aboutViewModel.SubTitle,
                Description = aboutViewModel.Description,
                Image =
                    _imageConverter.Convert(
                        Image.FromFile(Path.Combine(dataBaseDir,aboutViewModel.Image))),
                FacebookUrl = aboutViewModel.FacebookUrl,
                GooglePlusUrl = aboutViewModel.GooglePlusUrl,
                LinkedInUrl = aboutViewModel.LinkedInUrl,
                TwitterUrl = aboutViewModel.TwitterUrl
            };

            aboutRepository.Purge();
            aboutRepository.Save(adoutDataModel);
        }
    }
}
