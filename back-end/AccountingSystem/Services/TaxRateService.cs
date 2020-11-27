using System.Linq;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;
using System.Collections.Generic;

namespace AccountingSystem.Services
{
    public class TaxRateService : ITaxRateService
    {
        private readonly accounting_systemContext _serverContext;

        public TaxRateService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public List<TaxRate> GetTaxRates()
        {
            return _serverContext.TaxRates.OrderBy(x => x.Description).ToList();
        }

        public int AddAccount(TaxRate taxRate)
        {
            _serverContext.TaxRates.Add(taxRate);
            _serverContext.SaveChanges();
            return taxRate.Id;
        }
    }
}
