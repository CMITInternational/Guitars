using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Models;
using Data.Providers;
using Data.Repositories;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;
using NSubstitute;
using NUnit.Framework;

namespace Data.Tests.Repositories
{
    [TestFixture]
    public class PortfolioRepositoryTest
    {
        private PortfolioRepository _repositoryUnderTest;
        private IMongoDbProvider _mongoDbProvider;

        [SetUp]
        public void Setup()
        {
            _mongoDbProvider = Substitute.For<IMongoDbProvider>();
            _repositoryUnderTest = new PortfolioRepository(_mongoDbProvider);
        }

        [Test]
        public void ShouldRetrieveDataModelFromMongoLab()
        {
            // Arrange
            var newGuid = Guid.NewGuid().ToString().ToUpper();
            var query = new QueryDocument{{"Ref",new BsonDocument{{"$eq",newGuid}}}};
            var portfolioDataModel = new PortfolioDataModel();
            _mongoDbProvider.Get<PortfolioDataModel>("portfolio", query).Returns(portfolioDataModel);

            // Act
            var result = _repositoryUnderTest.Get(new QueryDocument { { "Ref", new BsonDocument { { "$eq", newGuid } } } });

            // Assert
            Assert.That(result, Is.EqualTo(portfolioDataModel));
        }

        [Test]
        public void ShouldSaveDataModelToMongoLab()
        {
            // Arrange
            var portfolioDataModel = new PortfolioDataModel();
            _mongoDbProvider.Update<PortfolioDataModel>("portfolio", portfolioDataModel).Returns(portfolioDataModel);

            // Act
            var result = _repositoryUnderTest.Save(portfolioDataModel);

            // Assert
            Assert.That(result, Is.EqualTo(portfolioDataModel));
        }
    }
}
