using Data.Models;
using Data.Providers;
using Newtonsoft.Json;

namespace Data.Repositories
{
    public class AboutRepository : MongoDbRepository<AboutDataModel>
    {
        public AboutRepository(IMongoDbProvider mongoDbProvider) : base(mongoDbProvider,"about")
        {
        }
    }
}