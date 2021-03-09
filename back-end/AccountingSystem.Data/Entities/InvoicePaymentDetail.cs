using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class InvoicePaymentDetail
    {
        public int Id { get; set; }
        public decimal InvoicePaymentDetailAmount { get; set; }
        public int LedgerMasterId { get; set; }

        public virtual LedgerMaster LedgerMaster { get; set; }
    }
}
