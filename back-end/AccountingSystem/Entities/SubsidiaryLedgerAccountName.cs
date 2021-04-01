using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Entities
{
    public partial class SubsidiaryLedgerAccountName
    {
        public SubsidiaryLedgerAccountName()
        {
            BillPayments = new HashSet<BillPayment>();
            InvoicePayments = new HashSet<InvoicePayment>();
            LedgerMasters = new HashSet<LedgerMaster>();
            Purchases = new HashSet<Purchase>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        public virtual ICollection<BillPayment> BillPayments { get; set; }
        public virtual ICollection<InvoicePayment> InvoicePayments { get; set; }
        public virtual ICollection<LedgerMaster> LedgerMasters { get; set; }
        public virtual ICollection<Purchase> Purchases { get; set; }
    }
}
