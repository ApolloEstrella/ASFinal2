using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Entities
{
    public partial class Purchase
    {
        public Purchase()
        {
            BillPaymentDetails = new HashSet<BillPaymentDetail>();
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
        public decimal PurchaseAmount { get; set; }

        public virtual SubsidiaryLedgerAccountName SubsidiaryLedgerAccount { get; set; }
        public virtual ICollection<BillPaymentDetail> BillPaymentDetails { get; set; }
        public virtual ICollection<PurchaseDetail> PurchaseDetails { get; set; }
    }
}
