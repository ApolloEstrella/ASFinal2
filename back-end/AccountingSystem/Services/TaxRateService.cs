using AccountingSystem.Data.Entities;
using AccountingSystem.Models;
using System.Collections.Generic;
using System.Linq;
using AccountingSystem.Services.Interfaces;

namespace AccountingSystem.Services
{
    public class TaxRateService : ITaxRateService
    {
        private readonly accounting_systemContext _serverContext;

        public TaxRateService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public List<TaxRateModel> GetTaxRates(string Type)
        {
            return (from a in _serverContext.TaxRates
                    where a.TaxType == Type
                    select new { a.Id, a.Description, a.Rate }).ToList()
                     .Select(x => new TaxRateModel { value = x.Id, label = x.Description, rate = x.Rate }).OrderBy(x => x.label).ToList();

        }

        public int AddAccount(TaxRate taxRate)
        {
            _serverContext.TaxRates.Add(taxRate);
            _serverContext.SaveChanges();
            return taxRate.Id;
        }
    }
}
