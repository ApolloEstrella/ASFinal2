using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class CustomerInvoicePostPaymentItemModel
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
    }
}
