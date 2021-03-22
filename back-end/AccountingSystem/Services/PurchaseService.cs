using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Models;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly accounting_systemContext _serverContext;

        public PurchaseService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public List<PurchaseModel> GetAll()
        {
            List<PurchaseModel> list = (from a in _serverContext.Purchases
                                        join b in _serverContext.SubsidiaryLedgerAccountNames
                                        on a.SubsidiaryLedgerAccountId equals b.Id
                                        select new
                                        {
                                            a.Id,
                                            b.Name,
                                            a.SubsidiaryLedgerAccountId,
                                            a.PurchaseReferenceNo,
                                            a.PurchaseDate,
                                            a.PurchaseDueDate,
                                            a.Description
                                        }).ToList()
                                        .Select(x => new PurchaseModel
                                        {
                                            Id = x.Id,
                                            Name = x.Name,
                                            Vendor = new Vendor { Value = x.SubsidiaryLedgerAccountId },
                                            Date = x.PurchaseDate,
                                            DueDate = x.PurchaseDueDate,
                                            Description = x.Description
                                        }).OrderBy(x => x.Name).ToList();
            return list;
                 
        }
    }
}
