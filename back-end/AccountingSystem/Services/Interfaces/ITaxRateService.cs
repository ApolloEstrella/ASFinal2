using System.Collections.Generic;
using AccountingSystem.Data.Entities;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface ITaxRateService
    {
        List<TaxRateModel> GetTaxRates(string Type);
        int AddAccount(TaxRate account);
    }
}
