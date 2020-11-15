using System.Collections.Generic;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services.Interfaces
{
   public interface IIncomeItemService
    {
        List<IncomeItem> GetIncomeItem();
        int AddAccount(IncomeItem account);
    }
}
