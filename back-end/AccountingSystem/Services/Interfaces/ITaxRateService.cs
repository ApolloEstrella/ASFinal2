using System.Collections.Generic;
using AccountingSystem.Data.Entities;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface ITaxRateService
    {
        List<TaxRateModel> GetTaxRates();
        int AddAccount(TaxRate account);
    }
}
