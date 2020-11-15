using System;
using System.Collections.Generic;
using System.Linq;
using AccountingSystem.Data.Entities;
using AccountingSystem.Services.Interfaces;

namespace AccountingSystem.Services
{
    public class IncomeItemService : IIncomeItemService
    {
        private readonly accounting_systemContext _serverContext;

        public IncomeItemService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public List<IncomeItem> GetIncomeItem()
        {
            return _serverContext.IncomeItems.OrderBy(x => x.Name).ToList();
        }
        public int AddAccount(IncomeItem account)
        {
            _serverContext.IncomeItems.Add(account);
            _serverContext.SaveChanges();
            return account.Id;
        }
    }
}
