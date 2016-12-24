using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Data.Repositories
{
    public interface IMongoDbRepository<T> where T : class
    {
        T Get();
        T Save(T dataModel);
        void Purge();
        T Get(QueryDocument query);
        List<BsonValue> UploadFiles(string dirName, List<string> fileNames);
    }
}