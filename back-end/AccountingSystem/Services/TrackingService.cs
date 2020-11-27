using AccountingSystem.Data.Entities;
using AccountingSystem.Models;
using System;
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
            serverContext = _serverContext;
        }
        public List<Tracking> GetTracking()
        {
           return _serverContext.Trackings.OrderBy(x => x.Description).ToList();
        }
        public int AddAccount(Tracking account)
        {
            _serverContext.Trackings.Add(account);
            _serverContext.SaveChanges();
            return account.Id;
        }
    }
}
