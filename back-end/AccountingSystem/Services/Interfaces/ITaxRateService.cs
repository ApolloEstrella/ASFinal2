using System.Collections.Generic;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services.Interfaces
{
    public interface ITaxRateService
    {
        List<TaxRate> GetTaxRates();
        int AddAccount(TaxRate account);
    }
}
