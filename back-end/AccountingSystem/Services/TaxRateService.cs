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
        public List<TaxRateModel> GetTaxRates()
        {
            return (from a in _serverContext.TaxRates
                    select new { a.Id, a.Description }).ToList()
                     .Select(x => new TaxRateModel { value = x.Id, label = x.Description }).OrderBy(x => x.label).ToList();

        }

        public int AddAccount(TaxRate taxRate)
        {
            _serverContext.TaxRates.Add(taxRate);
            _serverContext.SaveChanges();
            return taxRate.Id;
        }
    }
}
