using System.Collections.Generic;
using System.Drawing;
using Common.Converters;
using Data.Models;
using Data.Providers;
using Data.Repositories;
using Data.Tests.Providers;
using MongoDB.Bson;
using NSubstitute;
using NUnit.Framework;

namespace Data.Tests.Repositories
{
    [TestFixture]
    public class AboutRepositoryTest
    {
        private AboutRepository _repositoryUnderTest;
        private IMongoDbProvider _mongoDbProvider;
        private ImageToByteArrayToByteArrayConverer _imageConverter;

        [SetUp]
        public void Setup()
        {
            _mongoDbProvider = Substitute.For<IMongoDbProvider>();
            _repositoryUnderTest = new AboutRepository(_mongoDbProvider);
            _imageConverter = new ImageToByteArrayToByteArrayConverer();
        }

        [Test]
        public void ShouldRetrieveDataFromMongoLab()
        {
            // Arrange

            var bsonBinaryData = new BsonBinaryData(_imageConverter.Convert(Image.FromFile("C:\\dev\\Phillip Buttrose\\Guitars\\Web\\assets\\about\\images\\DSC_0168.JPG")));
            _mongoDbProvider.Get<AboutDataModel>("about").Returns(
                new AboutDataModel
                {
                    Title = "Phillip J Buttrose Pty Ltd",
                    SubTitle = "Phillip Buttrose - Luthier",
                    Image = bsonBinaryData,
                    Description = new List<string>{
                        "Phillip has recently retired from a working life of farming, the military and the construction industry.",
                        "He has settled in the hills above Perth in Western Australia, and working alone in his small workshop builds just a handful of handcrafted classical guitars a year.",
                        "Inspired by the Ignacio Feta\u2019s 1962-67 guitars and handcrafted from Australian native tone woods, these guitars have brilliant bell like trebles and balanced clear deep base tones.  The guitars require a gentle action to achieve excellent volume with exceptional sustain."
                      },
                    TwitterUrl = "https://twitter.com/PhillipButtrose",
                    FacebookUrl = "https://www.facebook.com/pages/Phillip-J-Buttrose/355734807900191",
                    LinkedInUrl = "http://www.linkedin.com/profile/view?id=327250818&locale=en_US&trk=tyah&trkInfo=tas%3Aphillip%2Cidx%3A2-3-4",
                    GooglePlusUrl = "https://plus.google.com/113144916347440280117/posts"
                });

            // Act
            var result = _repositoryUnderTest.Get();

            // Assert
            Assert.That(result.Title, Is.EqualTo("Phillip J Buttrose Pty Ltd"));
            Assert.That(result.SubTitle, Is.EqualTo("Phillip Buttrose - Luthier"));
            Assert.That(result.Image, Is.EqualTo(bsonBinaryData));
            Assert.That(result.Description[0], Is.EqualTo("Phillip has recently retired from a working life of farming, the military and the construction industry."));
            Assert.That(result.Description[1], Is.EqualTo("He has settled in the hills above Perth in Western Australia, and working alone in his small workshop builds just a handful of handcrafted classical guitars a year."));
            Assert.That(result.Description[2], Is.EqualTo("Inspired by the Ignacio Feta\u2019s 1962-67 guitars and handcrafted from Australian native tone woods, these guitars have brilliant bell like trebles and balanced clear deep base tones.  The guitars require a gentle action to achieve excellent volume with exceptional sustain."));
            Assert.That(result.TwitterUrl, Is.EqualTo("https://twitter.com/PhillipButtrose"));
            Assert.That(result.FacebookUrl, Is.EqualTo("https://www.facebook.com/pages/Phillip-J-Buttrose/355734807900191"));
            Assert.That(result.LinkedInUrl, Is.EqualTo("http://www.linkedin.com/profile/view?id=327250818&locale=en_US&trk=tyah&trkInfo=tas%3Aphillip%2Cidx%3A2-3-4"));
            Assert.That(result.GooglePlusUrl, Is.EqualTo("https://plus.google.com/113144916347440280117/posts"));
        }

        [Test]
        public void ShouldSaveDataModelToMongoLab()
        {
            // Arrage
            var bsonBinaryData = new BsonBinaryData(_imageConverter.Convert(Image.FromFile("C:\\dev\\Phillip Buttrose\\Guitars\\Web\\assets\\about\\images\\DSC_0168.JPG")));
            var dataModel = new AboutDataModel
            {
                Title = "Phillip J Buttrose Pty Ltd",
                SubTitle = "Phillip Buttrose - Luthier",
                Image = bsonBinaryData,
                Description = new List<string>
                {
                    "Phillip has recently retired from a working life of farming, the military and the construction industry.",
                    "He has settled in the hills above Perth in Western Australia, and working alone in his small workshop builds just a handful of handcrafted classical guitars a year.",
                    "Inspired by the Ignacio Feta\u2019s 1962-67 guitars and handcrafted from Australian native tone woods, these guitars have brilliant bell like trebles and balanced clear deep base tones.  The guitars require a gentle action to achieve excellent volume with exceptional sustain."
                },
                TwitterUrl = "https://twitter.com/PhillipButtrose",
                FacebookUrl = "https://www.facebook.com/pages/Phillip-J-Buttrose/355734807900191",
                LinkedInUrl =
                    "http://www.linkedin.com/profile/view?id=327250818&locale=en_US&trk=tyah&trkInfo=tas%3Aphillip%2Cidx%3A2-3-4",
                GooglePlusUrl = "https://plus.google.com/113144916347440280117/posts"
            };
            var savedDataModel = dataModel.Clone();
            savedDataModel._id = new ObjectId();
            _mongoDbProvider.Update("about", dataModel).Returns(dataModel);

            // Act
            var updatedModel = _repositoryUnderTest.Save(dataModel);

            // Assert
            Assert.That(updatedModel._id, Is.EqualTo(savedDataModel._id));
            Assert.That(updatedModel.Title, Is.EqualTo(dataModel.Title));
        }
    }
}
