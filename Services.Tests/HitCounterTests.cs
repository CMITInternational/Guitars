using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace Services.Tests
{
    [TestFixture]
    public class HitCounterTests
    {
        [Test]
        public void HitsShouldBeCorrect()
        {
            var result = new HitCounter(@"D:\dev\Phillip Buttrose\Guitars\deploy\logs\svc17230_ex1403.log", 4, 3, ' ').Calculate().SiteHits;
        }
    }
}
