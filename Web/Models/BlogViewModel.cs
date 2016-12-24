using System.Collections.Generic;

namespace Web.Models
{
    public class BlogViewModel
    {
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string Description { get; set; }
        public List<string> Lines { get; set; }
    }
}