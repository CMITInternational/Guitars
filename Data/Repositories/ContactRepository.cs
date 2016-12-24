using Data.Models;
using Data.Providers;

namespace Data.Repositories
{
    public class ContactRepository : MongoDbRepository<ContactDataModel>
    {
        public ContactRepository(IMongoDbProvider mongoDbProvider) : base(mongoDbProvider,"contact")
        {
        }
    }
}