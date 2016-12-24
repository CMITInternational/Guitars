using System.Collections.Generic;
using System.IO;
using Data.Models;
using Data.Providers;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Data.Repositories
{
    public class MongoDbRepository<T> : IMongoDbRepository<T> where T : class
    {
        private readonly string _collectionName;
        private readonly IMongoDbProvider _mongoDbProvider;

        public MongoDbRepository(IMongoDbProvider mongoDbProvider, string collectionName)
        {
            _mongoDbProvider = mongoDbProvider;
            _collectionName = collectionName;
        } 

        public T Get()
        {
            return _mongoDbProvider.Get<T>(_collectionName);
        }

        public T Save(T dataModel)
        {
            return _mongoDbProvider.Update(_collectionName,dataModel);
        }

        public void Purge()
        {
            _mongoDbProvider.Purge(_collectionName);
        }

        public T Get(QueryDocument query)
        {
            return _mongoDbProvider.Get<T>(_collectionName,query);
        }

        public List<BsonValue> UploadFiles(string dirName, List<string> fileNames)
        {
            return _mongoDbProvider.UploadImages(dirName, fileNames);
        }
    }
}