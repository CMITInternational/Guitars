using Common.Converters;
using Common.Providers;
using Data.Providers;
using NUnit.Framework;

namespace Data.Setup.Tests
{
    public class SetupBase
    {
        protected MongoDbProvider _mongoDbProvider;
        protected ConfigProvider _configProvider;
        protected ImageToByteArrayToByteArrayConverer _imageConverter;

        [SetUp]
        public void Setup()
        {
            _configProvider = new ConfigProvider();
            _mongoDbProvider = new MongoDbProvider(_configProvider);
            _imageConverter = new ImageToByteArrayToByteArrayConverer();
        }
    }
}