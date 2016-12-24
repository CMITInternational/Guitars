using System.Collections.Generic;

namespace Web.Models
{
    public class RegisterViewModel
    {
        public List<string> Headings { get; set; }
        public List<RegisterColumnViewModel> Columns { get; set; }
    }
}