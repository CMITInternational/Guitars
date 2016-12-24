using System.Drawing;
using System.IO;
using System.Linq;
using Common.Converters;
using Common.Providers;
using Data.Models;
using Data.Providers;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using NSubstitute;
using NUnit.Core;
using NUnit.Framework;

namespace Data.Tests.Providers
{
    [TestFixture]
    public class MongoDbProviderTest
    {
        private MongoDbProvider _providerUnderTest;
        private IConfigProvider _configProvider;
        private ImageToByteArrayToByteArrayConverer _imageConverter;

        [SetUp]
        public void Setup()
        {
            _configProvider = Substitute.For<IConfigProvider>();
            _configProvider.Get("mongo.host").Returns("ds063150.mongolab.com");
            _configProvider.Get("mongo.port").Returns("63150");
            _configProvider.Get("mongo.database").Returns("phillipjbuttrose");
            _configProvider.Get("mongo.user").Returns("pjb");
            _configProvider.Get("mongo.password").Returns("pjb");
            _providerUnderTest = new MongoDbProvider(_configProvider);
            _imageConverter = new ImageToByteArrayToByteArrayConverer();
        }

        [Test]
        public void ShouldRetrieveDataModelFromMongoLab()
        {
            // Arrange

            // Act
            var result = _providerUnderTest.Get<AboutDataModel>("about");

            // Assert
            Assert.That(result.Title, Is.EqualTo("Phillip J Buttrose Pty Ltd"));
            Assert.That(result.SubTitle, Is.EqualTo("Phillip Buttrose - Luthier"));
            Assert.That(result.Description[0], Is.EqualTo("Phillip has recently retired from a working life of farming, the military and the construction industry."));
            Assert.That(result.Description[1], Is.EqualTo("He has settled in the hills above Perth in Western Australia, and working alone in his small workshop builds just a handful of handcrafted classical guitars a year."));
            Assert.That(result.Description[2], Is.EqualTo("Inspired by the Ignacio Feta\u2019s 1962-67 guitars and handcrafted from Australian native tone woods, these guitars have brilliant bell like trebles and balanced clear deep base tones.  The guitars require a gentle action to achieve excellent volume with exceptional sustain."));
            Assert.That(result.TwitterUrl, Is.EqualTo("https://twitter.com/PhillipButtrose"));
            Assert.That(result.FacebookUrl, Is.EqualTo("https://www.facebook.com/pages/Phillip-J-Buttrose/355734807900191"));
            Assert.That(result.LinkedInUrl, Is.EqualTo("http://www.linkedin.com/profile/view?id=327250818&locale=en_US&trk=tyah&trkInfo=tas%3Aphillip%2Cidx%3A2-3-4"));
            Assert.That(result.GooglePlusUrl, Is.EqualTo("https://plus.google.com/113144916347440280117/posts"));
        }

        [Test]
        public void ShouldRetrieveDataFromMongoLab()
        {
            // Arrange

            // Act
            var result = _providerUnderTest.Get("about");

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result[1].AsString, Is.EqualTo("Phillip J Buttrose Pty Ltd"));
            Assert.That(result[2].AsString, Is.EqualTo("Phillip Buttrose - Luthier"));
            Assert.That(result[4].AsBsonArray[0].AsString, Is.EqualTo("Phillip has recently retired from a working life of farming, the military and the construction industry."));
            Assert.That(result[4].AsBsonArray[1].AsString, Is.EqualTo("He has settled in the hills above Perth in Western Australia, and working alone in his small workshop builds just a handful of handcrafted classical guitars a year."));
            Assert.That(result[4].AsBsonArray[2].AsString, Is.EqualTo("Inspired by the Ignacio Feta\u2019s 1962-67 guitars and handcrafted from Australian native tone woods, these guitars have brilliant bell like trebles and balanced clear deep base tones.  The guitars require a gentle action to achieve excellent volume with exceptional sustain."));
            Assert.That(result[5].AsString, Is.EqualTo("https://twitter.com/PhillipButtrose"));
            Assert.That(result[6].AsString, Is.EqualTo("https://www.facebook.com/pages/Phillip-J-Buttrose/355734807900191"));
            Assert.That(result[7].AsString, Is.EqualTo("http://www.linkedin.com/profile/view?id=327250818&locale=en_US&trk=tyah&trkInfo=tas%3Aphillip%2Cidx%3A2-3-4"));
            Assert.That(result[8].AsString, Is.EqualTo("https://plus.google.com/113144916347440280117/posts"));
        }

        [Test]
        public void ShouldWriteDataModelToMongoLab()
        {
            // Arrange
            var collection = _providerUnderTest.Database.GetCollection<AboutDataModel>("about");
            var original = collection.FindAll().FirstOrDefault();
            if (original != null)
            {
                var clone = original.Clone();
                clone.Title = "bodgy";

                // Act
                var result = _providerUnderTest.Update<AboutDataModel>("about", clone);

                var altered = collection.FindAll().FirstOrDefault();
                if (altered != null)
                {
                    // Assert
                    Assert.That(result, Is.Not.Null);
                    Assert.That(result.Title, Is.EqualTo("bodgy"));
                }

                // Reset
                var updQuery = new QueryDocument { { "_id", original._id } };
                var updDoc = new UpdateDocument { { "$set", new BsonDocument( "Title", original.Title) } };
                collection.Update(updQuery, updDoc);
            }
        }

        [Test]
        public void ShouldRerieveDataModelById()
        {
            // Act
            var query = new QueryDocument { { "Title", new BsonDocument { { "$eq", "Phillip J Buttrose Pty Ltd" } } } };
            var result = _providerUnderTest.Get<AboutDataModel>("about", query);

            Assert.That(result.Title, Is.EqualTo("Phillip J Buttrose Pty Ltd"));
        }
    }
}
