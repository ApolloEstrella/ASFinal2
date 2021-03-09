using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class CustomerInvoicePaymentItemModel
    {
        public int Id { get; set; }
      //  public int PaymentId 
        public decimal InvoiceAmount { get; set; }
        public decimal UnPaidBalance { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDueDate { get; set; }
    }
}
