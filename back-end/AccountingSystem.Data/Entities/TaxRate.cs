using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class TaxRate
    {
        public TaxRate()
        {
            LedgerDetails = new HashSet<LedgerDetail>();
            PurchaseDetails = new HashSet<PurchaseDetail>();
        }

        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Rate { get; set; }
        public string TaxType { get; set; }

        public virtual ICollection<LedgerDetail> LedgerDetails { get; set; }
        public virtual ICollection<PurchaseDetail> PurchaseDetails { get; set; }
    }
}
