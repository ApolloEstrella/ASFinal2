using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class Purchase
    {
        public Purchase()
        {
            PurchaseDetails = new HashSet<PurchaseDetail>();
        }

        public int Id { get; set; }
        public int SubsidiaryLedgerAccountId { get; set; }
        public DateTime PurchaseDate { get; set; }
        public DateTime PurchaseDueDate { get; set; }
        public string PurchaseReferenceNo { get; set; }
        public DateTime PurchaseCreatedDate { get; set; }
        public DateTime? PurchaseModifiedDate { get; set; }
        public string Description { get; set; }

        public virtual SubsidiaryLedgerAccountName SubsidiaryLedgerAccount { get; set; }
        public virtual ICollection<PurchaseDetail> PurchaseDetails { get; set; }
    }
}
