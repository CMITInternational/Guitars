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
    class ContactSetup : SetupBase
    {
        [Test]
        public void ShouldSetupContact()
        {
            var contactRepository = new ContactRepository(_mongoDbProvider);
            const string dataBaseDir = "C:/dev/Phillip Buttrose/Guitars/Web/assets/contact";

            Console.WriteLine("MigrateContact - purge");

            contactRepository.Purge();

            Console.WriteLine("MigrateContact - load");

            var jsonData = File.ReadAllText(Path.Combine(dataBaseDir, "data.json"));
            var contactViewModel = JsonConvert.DeserializeObject<ContactViewModel>(jsonData);
            var adoutDataModel = new ContactDataModel
            {
                _id = new ObjectId(),
                Header1 = contactViewModel.Header1,
                Header2 = contactViewModel.Header2,
                Address = contactViewModel.Address,
                BusinessHours = contactViewModel.BusinessHours.ConvertAll((b) => new BusinessHourDataModel { Day = b.Day, Hours = b.Hours }),
                Email = contactViewModel.Email,
                GoogleMap = contactViewModel.GoogleMap,
                Phone = contactViewModel.Phone,
                Spot = new SpotDataModel { Left = contactViewModel.Spot.Left, Top = contactViewModel.Spot.Top },
                Map = contactRepository.UploadFiles(dataBaseDir, new List<string> { contactViewModel.Map }).FirstOrDefault()
            };

            Console.WriteLine("MigrateContact - save");

            contactRepository.Save(adoutDataModel);
        }
    }
}
