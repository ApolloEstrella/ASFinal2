using System.Collections.Generic;
using AccountingSystem.Models;
using System.Threading.Tasks;

namespace AccountingSystem.Services.Interfaces
{
    public interface ISalesService
    {
        List<CustomerInvoiceModel> GetSalesInvoice();
        int AddSalesInvoice(CustomerInvoiceModel customerInvoiceModel);
        int AddUploadFiles(int id, FileModel files);
        CustomerInvoiceModel GetSalesInvoice(int id);
        int EditSalesInvoice(CustomerInvoiceEditModel customerInvoiceEditModel);
    }
}
