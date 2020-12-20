using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class CustomerInvoiceItemEditModel
    {
        public int Id { get; set; }
        public int LedgerMasterId { get; set; }
        public int SalesItem { get; set; }
        public string Description { get; set; }
        public int Qty { get; set; }
        public decimal UnitPrice { get; set; }
        public int TaxRateId { get; set; }
        public int TaxRateItem { get; set; }
        public int TrackingItem { get; set; }
    }
}
