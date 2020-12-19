using System;
using System.Collections.Generic;
using AccountingSystem.Data.Entities;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface IChartOfAccountService
    {
        List<ChartOfAccountModel> GetChartOfAccount();
        List<ChartOfAccountSelectModel> GetChartOfAccountSelect();
        List<ChartOfAccountsType> GetChartOfAccountsTypes();
        int AddAccount(ChartOfAccount account);
        int DeleteAccount(int id);
        int EditAccount(ChartOfAccount account);

    }
}
