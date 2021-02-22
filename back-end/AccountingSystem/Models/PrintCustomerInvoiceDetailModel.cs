using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class PrintCustomerInvoiceDetailModel
    {
      public string SalesItem { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string TaxItem { get; set; }
        public decimal SubTotal { get; set; }
        public string TrackingItem { get; set; }
    }
}
