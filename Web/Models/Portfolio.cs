using System.Collections.Generic;

namespace Web.Models
{
    public class Portfolio
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public string Client { get; set; }
        public string Category { get; set; }
        public List<List<string>> Register { get; set; }
        public string Thumb { get; set; }
        public List<string> Classes { get; set; }
        public List<string> Images { get; set; }
        public string Path { get; set; }
    }
}