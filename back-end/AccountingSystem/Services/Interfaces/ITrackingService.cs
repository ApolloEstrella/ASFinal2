using System.Collections.Generic;
using AccountingSystem.Data.Entities;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface ITrackingService
    {
        List<TrackingModel> GetTracking();
        int AddAccount(Tracking account);
    }
}
