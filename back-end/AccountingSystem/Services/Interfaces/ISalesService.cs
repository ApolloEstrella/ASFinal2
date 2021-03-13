using System.Collections.Generic;
using AccountingSystem.Models;
using System.Threading.Tasks;
using System.Linq;

namespace AccountingSystem.Services.Interfaces
{
    public interface ISalesService
    {
        List<CustomerInvoiceModel> GetSalesInvoice();
        List<CustomerInvoiceForListModel> GetAllSalesInvoices();
        List<CustomerInvoiceForListModel> GetAllSalesInvoicesByCustomerName(string customerName);
        List<CustomerInvoiceForListModel> GetAllSalesInvoicesByInvoiceNo(string invoiceNo);
        CustomerInvoiceModel AddSalesInvoice(CustomerInvoiceModel customerInvoiceModel);
        int AddUploadFiles(int id, FileModel files);
        CustomerInvoiceModel GetSalesInvoice(int id);
        CustomerInvoiceModel EditSalesInvoice(CustomerInvoiceModel customerInvoiceModel);
        PrintCustomerInvoiceModel PrintCustomerInvoice(int id);
        int DeleteSalesInvoice(int id);
        int VoidSalesInvoice(int id);
        int Payment(CustomerInvoicePaymentModel customerInvoicePaymentModel);
        //CustomerInvoicePaymentItemModel GetInvoicePayment(int customerId);
        IEnumerable<CustomerInvoicePaymentItemModel> GetInvoicePayment(int customerId);
    }
}
