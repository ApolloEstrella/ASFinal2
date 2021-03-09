using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class CustomerInvoicePaymentModel
    {
        public int Id { get; set; }
        public int LedgerMasterId { get; set; }
        public int CustomerId { get; set; }
        public string ReferenceNo { get; set; }
        public DateTime PaymentDate { get; set; }

        public decimal InvoiceAmount { get; set; }
        public int ChartOfAccountId { get; set; }
        public DateTime CreatedDate { get; set; }
        //public string Notes { get; set; }
        public List<CustomerInvoicePostPaymentItemModel> Items { get; set; }
    }
}
