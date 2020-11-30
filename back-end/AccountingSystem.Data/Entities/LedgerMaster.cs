using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class LedgerMaster
    {
        public LedgerMaster(string InvoiceBillingAddress)
        {
            LedgerDetails = new HashSet<LedgerDetail>();
        }

        public int Id { get; set; }
        public int SubsidiaryLedgerAccountId { get; set; }
        public string InvoiceBillingAddress { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime InvoiceDueDate { get; set; }
        public short InvoiceTerms { get; set; }
        public string InvoiceReference { get; set; }
        public string TransactionType { get; set; }

        public virtual ICollection<LedgerDetail> LedgerDetails { get; set; }
    }
}
