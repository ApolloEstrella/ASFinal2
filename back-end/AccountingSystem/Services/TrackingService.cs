using AccountingSystem.Data.Entities;
using AccountingSystem.Models;
using System.Collections.Generic;
using System.Linq;
using AccountingSystem.Services.Interfaces;

namespace AccountingSystem.Services
{
    public class TrackingService : ITrackingService
    {
        private readonly accounting_systemContext _serverContext;
        public TrackingService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public List<TrackingModel> GetTracking()
        {
            return (from a in _serverContext.Trackings
                    select new { a.Id, a.Description }).ToList()
                      .Select(x => new TrackingModel { value = x.Id, label = x.Description }).OrderBy(x => x.label).ToList();

        }
        public int AddAccount(Tracking account)
        {
            _serverContext.Trackings.Add(account);
            _serverContext.SaveChanges();
            return account.Id;
        }
    }
}
