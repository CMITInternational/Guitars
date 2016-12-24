using System;
using Data.Models;
using Data.Providers;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Data.Repositories
{
    public class PortfolioRepository : MongoDbRepository<PortfolioDataModel>
    {
        public PortfolioRepository(IMongoDbProvider mongoDbProvider) : base(mongoDbProvider, "portfolio")
        {
        }
    }
}