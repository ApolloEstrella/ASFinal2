using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using AccountingSystem.Data.Models;
using Microsoft.AspNetCore.Mvc;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface IChartOfAccountService
    {
        List<ChartOfAccountModel> GetChartOfAccount();
        List<ChartOfAccountsType> GetChartOfAccountsTypes();
        int AddAccount(ChartOfAccount account);
        int DeleteAccount(int id);
        int EditAccount(ChartOfAccount account);

    }
}
