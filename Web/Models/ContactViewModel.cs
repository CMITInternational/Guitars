using System.Collections.Generic;

namespace Web.Models
{
    public class ContactViewModel
    {
        public string Header1 { get; set; }
        public string Header2 { get; set; }
        public List<string> Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public List<BusinessHourViewModel> BusinessHours { get; set; }
        public string Map { get; set; }
        public string GoogleMap { get; set; }
        public SpotViewModel Spot { get; set; }
    }
}