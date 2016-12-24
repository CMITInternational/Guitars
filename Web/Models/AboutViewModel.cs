using System.Collections.Generic;

namespace Web.Models
{
    public class AboutViewModel
    {
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string Image { get; set; }
        public List<string> Description { get; set; }
        public string TwitterUrl { get; set; }
        public string FacebookUrl { get; set; }
        public string LinkedInUrl { get; set; }
        public string GooglePlusUrl { get; set; }
    }
}