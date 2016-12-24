using System.Collections.Generic;
using MongoDB.Bson;

namespace Data.Models
{
    public class ContactDataModel
    {
        public ObjectId _id { get; set; }
        public string Header1 { get; set; }
        public string Header2 { get; set; }
        public List<string> Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public List<BusinessHourDataModel> BusinessHours { get; set; }
        public BsonValue Map { get; set; }
        public string GoogleMap { get; set; }
        public SpotDataModel Spot { get; set; }
    }
}