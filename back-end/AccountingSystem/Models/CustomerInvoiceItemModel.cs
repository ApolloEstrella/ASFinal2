using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class CustomerInvoiceItemModel
    {
        public int Id { get; set; }
        public int LedgerMasterId { get; set; }
        public SalesItem SalesItem { get; set; }
        public string Description { get; set; }
        public int Qty { get; set; }
        public decimal UnitPrice { get; set; }
        public int TaxRateId { get; set; }
        public TaxRateItem TaxRateItem { get; set; }
        public TrackingItem TrackingItem { get; set; }
        public string Amount { get; set; }
    }

    public class SalesItem
    {
        public int Value { get; set; }
        public string Label { get; set; }
    }

    public class TaxRateItem
    {
        public int Value { get; set; }
        public string Label { get; set; }
    }

    public class TrackingItem
    {
        public int Value { get; set; }
        public string Label { get; set; }
    }
}
