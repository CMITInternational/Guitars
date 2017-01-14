using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Autofac.Integration.WebApi;
using AutoMapper;
using Data.Models;
using Data.Repositories;
using Newtonsoft.Json;
using Web.Models;

namespace Web.Controllers
{
    [Route("api/portfolio")]
    public class PortfolioController : ApiControllerBase
    {
        [Route("api/portfolio/{mustHaveImages:bool=false}")]
        [HttpGet]
        public List<PortfolioViewModel> Get(bool mustHaveImages)
        {
            var portfolios = new List<PortfolioViewModel>();

            if (Directory.Exists(PortfolioBase))
            {
                foreach (var directory in Directory.GetDirectories(PortfolioBase))
                {
                    var path = Path.Combine(directory, "data.json");
                    if (!File.Exists(path)) continue;
                    var jsonText = File.ReadAllText(path);
                    var model = JsonConvert.DeserializeObject<Portfolio>(jsonText);
                    model.Id = RelativeName(directory);
                    var viewModel = Mapper.Map<PortfolioViewModel>(model);
                    viewModel.Path = string.Format("{0}/{1}",RelativeBase.Replace("~/",""),RelativeName(directory));
                    if (mustHaveImages == false || (!string.IsNullOrEmpty(viewModel.Thumb) && viewModel.Images.Any()))
                    {
                        portfolios.Add(viewModel);
                    }
                }
            }

            return portfolios.OrderBy(p => p.Title).ToList();
        }

        [Route("api/portfolio/{id}")]
        [HttpGet]
        public Portfolio Get(string id)
        {
            return GetPortfolio(id);
        }

        private Portfolio GetPortfolio(string id)
        {
            var dataFileName = Path.Combine(PortfolioBase, id, "data.json");
            if (File.Exists(dataFileName))
            {
                var jsonText = File.ReadAllText(dataFileName);
                var model = JsonConvert.DeserializeObject<Portfolio>(jsonText);
                model.Path = string.Format("{0}/{1}", RelativeBase.Replace("~/", ""), id);
                model.Id = id;
                return model;
            }
            return new Portfolio();
        }

        private Portfolio PopulateNewPortfolio(Portfolio portfolio)
        {
            portfolio.Id = Guid.NewGuid().ToString().ToUpper();
            portfolio.Register =
                GetRegistry().Headings.Select(heading => new List<string> {heading, string.Empty}).ToList();
            return portfolio;
        }

        [Route("api/portfolio")]
        [HttpPost]
        public Portfolio Post(Portfolio portfolio)
        {
            if (string.IsNullOrEmpty(portfolio.Id))
            {
                portfolio = PopulateNewPortfolio(portfolio);
            }
            var jsonText = JsonConvert.SerializeObject(portfolio);
            var dataFileDirectory = Path.Combine(PortfolioBase, portfolio.Id);
            if (!Directory.Exists(dataFileDirectory))
            {
                Directory.CreateDirectory(dataFileDirectory);
            }
            var dataFileName = Path.Combine(PortfolioBase, portfolio.Id, "data.json");
            File.Delete(dataFileName);
            File.WriteAllText(dataFileName,jsonText);
            return GetPortfolio(portfolio.Id);
        }

        [Route("api/portfolio/{id}/remove")]
        [HttpPost]
        public bool Remove(string id)
        {
            var dataFileDirectory = Path.Combine(PortfolioBase, id);
            if (Directory.Exists(dataFileDirectory))
            {
                Directory.Delete(dataFileDirectory, true);
            }
            return true;
        }

        [Route("api/portfolio/uploadfile")]
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
                var isThumbNail = false;

                // Read the form data and return an async task.
                await Request.Content.ReadAsMultipartAsync(provider);

                // This illustrates how to get the form data.
                if (provider.FormData.AllKeys.Any(key => key.Equals("Project")))
                {
                    postedProject = provider.FormData.GetValues("Project").FirstOrDefault();
                }
                if (provider.FormData.AllKeys.Any(key => key.Equals("IsThumbNail")))
                {
                    isThumbNail = bool.Parse(provider.FormData.GetValues("IsThumbNail").FirstOrDefault());
                }

                if (string.IsNullOrEmpty(postedProject)) throw new HttpResponseException(HttpStatusCode.BadRequest);

                // This illustrates how to get the file names for uploaded files.
                foreach (var file in provider.FileData)
                {
                    var postedFile = new FileInfo(file.LocalFileName);

                    var portfolio = GetPortfolio(postedProject);
                    var fileName = Path.Combine("images",file.Headers.ContentDisposition.FileName.Replace("\"",""));
                    var portfolioStore = Path.Combine(imgRootPath, postedProject);
                    var fileSavePath = Path.Combine(portfolioStore, fileName);
                    var webFileName = fileName.Replace("\\", "/");

                    var portfolioImageStore = Path.Combine(portfolioStore, "images");
                    if (!Directory.Exists(portfolioImageStore))
                    {
                        Directory.CreateDirectory(portfolioImageStore);
                    }

                    if (File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    File.Copy(postedFile.FullName, fileSavePath);

                    if (isThumbNail)
                    {
                        portfolio.Thumb = webFileName;
                    }
                    else
                    {
                        if (!portfolio.Images.Contains(webFileName))
                        {
                            portfolio.Images.Add(webFileName);
                        }
                    }
                    Post(portfolio);
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

        [Route("api/portfolio/removeImage")]
        [HttpPost]
        public bool RemoveImage(RemoveImageViewmodel removeImageViewmodel)
        {
            try
            {
                var portfolioId = removeImageViewmodel.Portfolio;
                var fileName = removeImageViewmodel.FileName;
                var fullFileName = Path.Combine(PortfolioBase, portfolioId, fileName.Replace("/","\\"));

                var portfolio = GetPortfolio(portfolioId);
                if (File.Exists(fullFileName))
                {
                    File.Delete(fullFileName);
                    if (portfolio.Images.Any(img => img.Equals(fileName)))
                    {
                        portfolio.Images.Remove(fileName);
                    }
                    if (portfolio.Thumb.Equals(fileName)) {
                        portfolio.Thumb = null;
                    }
                }
                Post(portfolio);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private string RelativeName(string input)
        {
            var baseSegs = PortfolioBase.Split('\\').ToList();
            var inputSegs = input.Split('\\').ToList();

            var rem = string.Join("\\",inputSegs.Skip(baseSegs.Count));

            return rem;
        }
    }

    public class RemoveImageViewmodel
    {
        public string Portfolio { get; set; }
        public string FileName { get; set; }
    }
}
