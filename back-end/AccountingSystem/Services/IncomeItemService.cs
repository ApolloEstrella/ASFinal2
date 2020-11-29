using AccountingSystem.Data.Entities;
using AccountingSystem.Models;
using System.Collections.Generic;
using System.Linq;
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
        public List<IncomeItemModel> GetIncomeItem()
        {
            return (from a in _serverContext.IncomeItems
                    select new { a.Id, a.Name }).ToList()
                     .Select(x => new IncomeItemModel { value = x.Id, label = x.Name }).OrderBy(x => x.label).ToList();
        }
        public int AddAccount(IncomeItem account)
        {
            _serverContext.IncomeItems.Add(account);
            _serverContext.SaveChanges();
            return account.Id;
        }
    }
}
