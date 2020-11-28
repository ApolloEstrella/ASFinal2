using System.Linq;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;
using System.Collections.Generic;
using AccountingSystem.Models;

namespace AccountingSystem.Services
{
    public class SalesService : ISalesService
    {
        private readonly accounting_systemContext _serverContext;

        public SalesService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public List<CustomerInvoiceModel> GetSalesInvoice()
        {
            const List<CustomerInvoiceModel> list = null;
            return list;
        }
        public int AddSalesInvoice(CustomerInvoiceModel customerInvoiceModel)
        {
            return 1;
        }
    }
}
