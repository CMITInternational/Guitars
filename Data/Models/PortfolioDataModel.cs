using System.Collections.Generic;
using MongoDB.Bson;

namespace Data.Models
{
    public class PortfolioDataModel
    {
        public ObjectId _id { get; set; }
        public string Ref { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public string Client { get; set; }
        public string Category { get; set; }
        public List<List<string>> Register { get; set; }
        public BsonValue Thumb { get; set; }
        public List<string> Classes { get; set; }
        public List<BsonValue> Images { get; set; }
    }
}