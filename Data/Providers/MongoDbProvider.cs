using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using Common.Providers;
using Data.Models;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Data.Providers
{
    public class MongoDbProvider : IMongoDbProvider
    {
        private readonly IConfigProvider _configProvider;
        private readonly MongoDatabase _db;

        public MongoDbProvider(IConfigProvider configProvider)
        {
            _configProvider = configProvider;
            var user = _configProvider.Get("mongo.user");
            var password = _configProvider.Get("mongo.password");
            var host = _configProvider.Get("mongo.host");
            var port = _configProvider.Get("mongo.port");
            var database = _configProvider.Get("mongo.database");
            var uri = String.Format("mongodb://{0}:{1}@{2}:{3}/{4}",user,password,host,port,database);

            var url = new MongoUrl(uri);
            var client = new MongoClient(url);
            var server = client.GetServer();
            _db = server.GetDatabase(url.DatabaseName);
        }

        public MongoDatabase Database
        {
            get { return _db; }
        }

        public T Get<T>(string collectionName) where T : class
        {
            var collection = _db.GetCollection<T>(collectionName);

            return collection.FindAll().FirstOrDefault();
        }

        public BsonDocument Get(string collectionName)
        {
            var collection = _db.GetCollection<BsonDocument>(collectionName);
            return collection.FindAll().FirstOrDefault();
        }

        public T Update<T>(string collectionName, T model) where T : class
        {
            var collection = _db.GetCollection<T>(collectionName);

            var result = collection.Save(model);
            return collection.FindAll().FirstOrDefault();
        }

        public void Purge(string collectionName)
        {
            var collection = _db.GetCollection<BsonDocument>(collectionName);
            collection.RemoveAll();
        }

        public T Get<T>(string collectionName, QueryDocument query) where T : class
        {
            var collection = _db.GetCollection<T>(collectionName);
            return collection.Find(query).FirstOrDefault();
        }

        public List<BsonValue> UploadImages(string dir, List<string> images)
        {
            var refs = new List<BsonValue>();
            foreach (var image in images)
            {
                var fileName = Path.Combine(dir, image).Replace("\\","/");
                Console.WriteLine(String.Format("UploadImages - save {0}", fileName));
                using (var fs = new FileStream(fileName, FileMode.Open))
                {
                    var gridFsInfo = _db.GridFS.Upload(fs, fileName);
                    refs.Add(gridFsInfo.Id);
                    Console.WriteLine(String.Format("UploadImages - done {0} -> {1}", fileName, gridFsInfo.Id));
                }
            }
            return refs;
        }
    }
}