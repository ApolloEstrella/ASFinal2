using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class CustomerInvoiceItemModel
    {
        public int Id { get; set; }
        public int SalesItem { get; set; }
        public string Description { get; set; }
        public int Qty { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxRate { get; set; }
        public int Tracking { get; set; }
        public decimal Amount { get; set; }
    }
}
