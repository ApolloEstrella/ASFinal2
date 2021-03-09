using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Entities
{
    public partial class InvoicePaymentDetail
    {
        public int Id { get; set; }
        public int InvoicePaymentId { get; set; }
        public decimal InvoicePaymentDetailAmount { get; set; }

        public virtual InvoicePayment InvoicePayment { get; set; }
    }
}
