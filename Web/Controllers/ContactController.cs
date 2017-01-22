using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using Autofac.Integration.WebApi;
using Data.Models;
using Data.Repositories;
using Newtonsoft.Json;
using Web.Models;

namespace Web.Controllers
{
    [Route("api/contact")]
    public class ContactController : ApiController
    {
        private readonly string _dataFileName;

        public ContactController()
        {
            var abboutDataDirectory = HttpContext.Current.Server.MapPath("~/assets/contact");
            _dataFileName = Path.Combine(abboutDataDirectory, "data.json");           
        }

        [HttpGet]
        public ContactViewModel Get()
        {
            if (File.Exists(_dataFileName))
            {
                var jsonData = File.ReadAllText(_dataFileName);
                var contactViewModel = JsonConvert.DeserializeObject<ContactViewModel>(jsonData);
                return contactViewModel;
            }
            return new ContactViewModel();
        }

        [HttpPost]
        public ContactViewModel Post(ContactViewModel data)
        {
            var jsonData = JsonConvert.SerializeObject(data);
            File.WriteAllText(_dataFileName,jsonData);
            return Get();
        }

        // PUT api/<controller>/5
        [Route("api/contact/{id}")]
        [HttpPost]
        public void Post(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        [Route("api/contact/{id}")]
        [HttpDelete]
        public void Delete(int id)
        {
        }

        // POST api/<controller>
        [Route("api/contact/email")]
        [HttpPost]
        public Boolean Post([FromBody] Contact value)
        {
            var settings = ConfigurationManager.AppSettings;
            var message = new System.Net.Mail.MailMessage();
            message.To.Add(settings["Smtp.To"]);
            message.CC.Add(settings["Smtp.CC"]);
            message.Subject = value.Subject;
            message.From = new System.Net.Mail.MailAddress(value.From);
            message.Body = value.Message;
            var smtp = new System.Net.Mail.SmtpClient(settings["Smtp.Host"], int.Parse(settings["Smtp.Port"]))
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(settings["Smtp.User"], settings["Smtp.Password"]),
                EnableSsl = bool.Parse(settings["Smtp.EnableSSL"])
            };
            smtp.Send(message);
            return true;
        }
    }
}