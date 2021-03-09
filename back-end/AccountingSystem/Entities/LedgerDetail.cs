using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Entities
{
    public partial class LedgerDetail
    {
        public int Id { get; set; }
        public int LedgerMasterId { get; set; }
        public int InvoiceSalesItemId { get; set; }
        public string InvoiceDescription { get; set; }
        public decimal InvoiceQuantity { get; set; }
        public decimal InvoiceUnitPrice { get; set; }
        public int InvoiceTaxRateId { get; set; }
        public int InvoiceTrackingId { get; set; }
        public int ChartOfAccountId { get; set; }

        public virtual IncomeItem InvoiceSalesItem { get; set; }
        public virtual TaxRate InvoiceTaxRate { get; set; }
        public virtual Tracking InvoiceTracking { get; set; }
        public virtual LedgerMaster LedgerMaster { get; set; }
    }
}
