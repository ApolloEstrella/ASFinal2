using AccountingSystem.Data.Entities;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using AccountingSystem.Services.Interfaces;

namespace AccountingSystem.Services
{
    public class SubsdiaryLedgerService : ISubsdiaryLedgerService
    {
        private readonly accounting_systemContext _serverContext;
        public SubsdiaryLedgerService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public List<SubsidiaryLedgerModel> GetSubsidiaryLedger()
        {
            return (from a in _serverContext.SubsidiaryLedgerAccountNames
                    select new { a.Id, a.Name}).ToList()
                     .Select(x => new SubsidiaryLedgerModel { value = x.Id, label = x.Name  }).OrderBy(x => x.label).ToList();
        }
 
        public int AddAccount(SubsidiaryLedgerAccountName account)
        {
            _serverContext.SubsidiaryLedgerAccountNames.Add(account);
            _serverContext.SaveChanges();
            return account.Id;
        }

        public int DeleteAccount(int id)
        {
            _serverContext.SubsidiaryLedgerAccountNames.Remove(_serverContext.SubsidiaryLedgerAccountNames.Find(id));
            _serverContext.SaveChanges();
            return id;
        }

        public int EditAccount(SubsidiaryLedgerAccountName account)
        {
            _serverContext.SubsidiaryLedgerAccountNames.Update(account);
            _serverContext.SaveChanges();
            return account.Id;
        }
    }
}
