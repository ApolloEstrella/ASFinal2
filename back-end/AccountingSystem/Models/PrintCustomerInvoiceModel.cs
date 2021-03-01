using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class PrintCustomerInvoiceModel
    {
       public string CustomerName { get; set; }
        public string BillingAddress { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public int Terms { get; set; }
        public string Reference { get; set; }
        public List<PrintCustomerInvoiceDetailModel> InvoiceItems { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TotalTaxes { get; set; }
        public decimal Total { get; set; }
    }
}
