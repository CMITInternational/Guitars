using System.Collections.Generic;
using Data.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Data.Providers
{
    public interface IMongoDbProvider
    {
        MongoDatabase Database { get; }

        T Get<T>(string collectionName) where T : class;
        T Get<T>(string collectionName, QueryDocument query) where T : class;
        BsonDocument Get(string collectionName);
        T Update<T>(string collectionName, T model) where T : class;
        void Purge(string collectionName);
        List<BsonValue> UploadImages(string dir, List<string> images);
    }
}