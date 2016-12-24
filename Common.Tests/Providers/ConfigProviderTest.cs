using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Providers;
using NUnit.Framework;

namespace Common.Tests.Providers
{
    [TestFixture]
    public class ConfigProviderTest
    {
        private ConfigProvider _providerUnderTest;

        [SetUp]
        public void Setup()
        {
            _providerUnderTest = new ConfigProvider();
        }

        [Test]
        public void ShouldReadValueFromConfig()
        {
            Assert.That(_providerUnderTest.Get("test.value"), Is.EqualTo("TestValue"));
        }
    }
}
