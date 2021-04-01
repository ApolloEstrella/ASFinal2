using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Entities
{
    public partial class BillPaymentDetail
    {
        public int Id { get; set; }
        public decimal BillPaymentDetailAmount { get; set; }
        public int BillPaymentId { get; set; }
        public int PurchaseId { get; set; }

        public virtual BillPayment BillPayment { get; set; }
        public virtual Purchase Purchase { get; set; }
    }
}
