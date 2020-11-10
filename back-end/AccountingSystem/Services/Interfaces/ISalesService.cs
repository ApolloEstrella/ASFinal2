using System.Collections.Generic;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface ISalesService
    {
        List<CustomerInvoiceModel> GetSalesInvoice();

    }
}
