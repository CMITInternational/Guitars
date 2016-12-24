using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Models;
using Data.Providers;
using Data.Repositories;
using NSubstitute;
using NUnit.Framework;

namespace Data.Tests.Repositories
{
    [TestFixture]
    public class ContactRepositoryTest
    {
        private ContactRepository _repositoryUnderTest;
        private IMongoDbProvider _mongoDbProvider;

        [SetUp]
        public void Setup()
        {
            _mongoDbProvider = Substitute.For<IMongoDbProvider>();
            _repositoryUnderTest = new ContactRepository(_mongoDbProvider);
        }

        [Test]
        public void ShouldRetrieveDataModelFromMongoLab()
        {
            // Arrange
            var contactDataModel = new ContactDataModel();
            _mongoDbProvider.Get<ContactDataModel>("contact").Returns(contactDataModel);

            // Act
            var result = _repositoryUnderTest.Get();

            // Assert
            Assert.That(result, Is.EqualTo(contactDataModel));
        }

        [Test]
        public void ShouldSaveDataModelToMongoLab()
        {
            // Arrange
            var contactDataModel = new ContactDataModel();
            _mongoDbProvider.Update<ContactDataModel>("contact",contactDataModel).Returns(contactDataModel);

            // Act
            var result = _repositoryUnderTest.Save(contactDataModel);

            // Assert
            Assert.That(result, Is.EqualTo(contactDataModel));
        }
    }
}
