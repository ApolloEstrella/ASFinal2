using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using AccountingSystem.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AccountingSystem.Models;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services
{
    public class ChartOfAccountService : IChartOfAccountService
    {
        private readonly accounting_systemContext _serverContext;
        public ChartOfAccountService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }

        public List<ChartOfAccountModel> GetChartOfAccount()
        {
            return (from a in _serverContext.ChartOfAccounts
                    join b in _serverContext.ChartOfAccountsTypes
                    on a.AccountTypeId equals b.Id
                    join c in _serverContext.ChartOfAccountsCategories
                    on b.CategoryId equals c.Id
                    select new { a.Id, b.Type, a.Title, Category_Id = c.Id, a.Description, a.Code, a.AccountTypeId}).ToList()
                     .Select(x => new ChartOfAccountModel { Id = x.Id, Type = x.Type, Title = x.Title, Description = x.Description, Code = x.Code, AccountTypeId = x.AccountTypeId }).OrderBy(x => x.Type).ToList();
        }

        public List<ChartOfAccountsType> GetChartOfAccountsTypes()
        {
            return _serverContext.ChartOfAccountsTypes.OrderBy(x => x.Id).ToList();
        }

        public int AddAccount(ChartOfAccount account)
        {
            _serverContext.ChartOfAccounts.Add(account);
            _serverContext.SaveChanges();
            return 1;
        }

        public int DeleteAccount(int id)
        {
            _serverContext.ChartOfAccounts.Remove(_serverContext.ChartOfAccounts.Find(id));
            _serverContext.SaveChanges();
            return id;
        }

        public int EditAccount(ChartOfAccount account)
        {
            _serverContext.ChartOfAccounts.Update(account);
            _serverContext.SaveChanges();
            return account.Id;
        }

    }
}

