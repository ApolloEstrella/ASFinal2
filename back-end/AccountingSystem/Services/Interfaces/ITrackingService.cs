using System.Collections.Generic;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services.Interfaces
{
    public interface ITrackingService
    {
        List<Tracking> GetTracking();
        int AddAccount(Tracking account);
    }
}
