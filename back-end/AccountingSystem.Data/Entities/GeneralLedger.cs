using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class GeneralLedger
    {
        public GeneralLedger()
        {
            GeneralLedgerDetails = new HashSet<GeneralLedgerDetail>();
        }

        public int Id { get; set; }
        public string GeneralLedgerType { get; set; }
        public int SubsidiaryLedgerAccountId { get; set; }
        public DateTime GeneralLedgerDate { get; set; }
        public string GeneralLedgerReferenceNo { get; set; }
        public string GeneralLedgerDescription { get; set; }
        public DateTime GeneralLedgerCreatedModifiedDate { get; set; }
        public string GeneralLedgerInvoiceNo { get; set; }

        public virtual SubsidiaryLedgerAccountName SubsidiaryLedgerAccount { get; set; }
        public virtual ICollection<GeneralLedgerDetail> GeneralLedgerDetails { get; set; }
    }
}
