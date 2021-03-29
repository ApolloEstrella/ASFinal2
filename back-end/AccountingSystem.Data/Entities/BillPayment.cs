using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class BillPayment
    {
        public BillPayment()
        {
            BillPaymentDetails = new HashSet<BillPaymentDetail>();
        }

        public int Id { get; set; }
        public string BillPaymentReferenceNo { get; set; }
        public decimal BillPaymentAmount { get; set; }
        public string BillPaymentNotes { get; set; }
        public DateTime BillPaymentDate { get; set; }
        public DateTime BillPaymentModifiedDate { get; set; }
        public DateTime BillPaymentCreatedDate { get; set; }
        public int ChartOfAccountId { get; set; }
        public int SubsidiaryLedgerAccountId { get; set; }

        public virtual ChartOfAccount ChartOfAccount { get; set; }
        public virtual SubsidiaryLedgerAccountName SubsidiaryLedgerAccount { get; set; }
        public virtual ICollection<BillPaymentDetail> BillPaymentDetails { get; set; }
    }
}
