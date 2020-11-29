using System.Collections.Generic;
using AccountingSystem.Data.Entities;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
   public interface IIncomeItemService
    {
        List<IncomeItemModel> GetIncomeItem();
        int AddAccount(IncomeItem account);
    }
}
