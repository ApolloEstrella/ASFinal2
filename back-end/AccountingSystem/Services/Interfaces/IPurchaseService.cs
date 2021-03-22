using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface IPurchaseService
    {
        List<PurchaseModel> GetAll();
    }
}
