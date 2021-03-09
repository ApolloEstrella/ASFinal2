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
        int AddSalesInvoice(CustomerInvoiceModel customerInvoiceModel);
        int AddUploadFiles(int id, FileModel files);
        CustomerInvoiceModel GetSalesInvoice(int id);
        int EditSalesInvoice(CustomerInvoiceModel customerInvoiceModel);
        PrintCustomerInvoiceModel PrintCustomerInvoice(int id);
        int DeleteSalesInvoice(int id);
        int VoidSalesInvoice(int id);
        int Payment(CustomerInvoicePaymentModel customerInvoicePaymentModel);
        //CustomerInvoicePaymentItemModel GetInvoicePayment(int customerId);
        List<CustomerInvoicePaymentItemModel> GetInvoicePayment(int customerId);
    }
}
