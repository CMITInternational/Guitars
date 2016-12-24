using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using NUnit.Framework;

namespace Services.Tests.Mail
{
    [TestFixture]
    public class SmtpClientTests
    {
        private SmtpClient serviceUnderTest;

        [SetUp]
        public void setup()
        {
            serviceUnderTest = new SmtpClient("mail.iinet.net.au", 587)
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("phillip.buttrose@iinet.net.au", "1Dkunxob8"),
                EnableSsl = true
            };
        }

        [Test]
        public void ShouldConnectAndSendEmail()
        {
            serviceUnderTest.Send("phillip.buttrose@iinet.net.au", "darcy.buttrose@gmail.com", "test", "test");
        }
    }
}
