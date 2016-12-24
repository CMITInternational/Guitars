using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Autofac.Integration.WebApi;
using Data.Models;
using Data.Repositories;
using Newtonsoft.Json;
using Web.Models;

namespace Web.Controllers
{
    [Route("api/about")]
    public class AboutController : ApiControllerBase
    {
        private readonly string _dataFileName;
        private readonly string _aboutDataDirectory;

        public AboutController()
        {
            _aboutDataDirectory = HttpContext.Current.Server.MapPath("~/assets/about");
            _dataFileName = Path.Combine(_aboutDataDirectory, "data.json");           
        }

        [HttpGet]
        public AboutViewModel Get()
        {
            if (File.Exists(_dataFileName))
            {
                var jsonData = File.ReadAllText(_dataFileName);
                var aboutViewModel = JsonConvert.DeserializeObject<AboutViewModel>(jsonData);
                return aboutViewModel;
            }
            return new AboutViewModel();
        }

        [HttpPost]
        public AboutViewModel Post(AboutViewModel data)
        {
            var jsonData = JsonConvert.SerializeObject(data);
            File.WriteAllText(_dataFileName,jsonData);
            return Get();
        }

        [Route("api/about/uploadfile")]
        [HttpPost]
        public async Task<HttpResponseMessage> UploadFile()
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var imgRootPath = PortfolioBase;
            var bodyPartTempDir = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(bodyPartTempDir);

            try
            {
                var sb = new StringBuilder(); // Holds the response body
                var postedProject = String.Empty;

                await Request.Content.ReadAsMultipartAsync(provider);

                foreach (var file in provider.FileData)
                {
                    var postedFile = new FileInfo(file.LocalFileName);

                    var viewModel = Get();
                    var fileName = Path.Combine("images", file.Headers.ContentDisposition.FileName.Replace("\"", ""));
                    var fileSavePath = Path.Combine(_aboutDataDirectory, fileName);
                    var webFileName = fileName.Replace("\\", "/");

                    if (File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    File.Copy(postedFile.FullName, fileSavePath, true);

                    viewModel.Image = webFileName;

                    Post(viewModel);
                    sb.Append(string.Format("Uploaded file: {0} ({1} bytes)\n", webFileName, postedFile.Length));
                }

                return new HttpResponseMessage()
                {
                    Content = new StringContent(sb.ToString())
                };
            }
            catch (System.Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [Route("api/about/removeImage")]
        [HttpPost]
        public bool RemoveImage(RemoveImageViewmodel removeImageViewmodel)
        {
            try
            {
                var fileName = removeImageViewmodel.FileName;
                var fullFileName = Path.Combine(_aboutDataDirectory, fileName.Replace("/", "\\"));

                var viewModel = Get();
                if (File.Exists(fullFileName))
                {
                    File.Delete(fullFileName);
                    viewModel.Image = null;
                }
                Post(viewModel);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
