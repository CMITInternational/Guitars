using MongoDB.Bson;

namespace Data.Models
{
    public interface IBsonDataModel
    {
        ObjectId _id { get; set; }
    }

    public class BsonDataModel : IBsonDataModel
    {
        public ObjectId _id { get; set; }
    }
}