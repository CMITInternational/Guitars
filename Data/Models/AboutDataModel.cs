using System;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;

namespace Data.Models
{
    public class AboutDataModel
    {
        public ObjectId _id { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public BsonValue Image { get; set; }
        public List<string> Description { get; set; }
        public string TwitterUrl { get; set; }
        public string FacebookUrl { get; set; }
        public string LinkedInUrl { get; set; }
        public string GooglePlusUrl { get; set; }

        public AboutDataModel Clone()
        {
            return new AboutDataModel
            {
                _id = _id,
                Title = (string) Title.Clone(),
                SubTitle = (string) SubTitle.Clone(),
                Description = Description.Select(d => d.Clone()).Cast<string>().ToList(),
                FacebookUrl = (string) FacebookUrl.Clone(),
                GooglePlusUrl = (string) GooglePlusUrl.Clone(),
                Image = Image.Clone(),
                LinkedInUrl = (string) LinkedInUrl.Clone(),
                TwitterUrl = (string) TwitterUrl.Clone()
            };
        }
    }
}