﻿using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class InvoicePayment
    {
        public int Id { get; set; }
        public string InvoicePaymentReferenceNo { get; set; }
        public decimal InvoicePaymentAmount { get; set; }
        public int LedgerMasterId { get; set; }
        public string InvoicePaymentNotes { get; set; }
        public DateTime InvoicePaymentDate { get; set; }
        public DateTime InvoicePaymentModifiedDate { get; set; }
        public DateTime InvoicePaymentCreatedDate { get; set; }
        public int ChartOfAccountId { get; set; }
        public int SubsidiaryLedgerAccountId { get; set; }

        public virtual ChartOfAccount ChartOfAccount { get; set; }
        public virtual LedgerMaster LedgerMaster { get; set; }
        public virtual SubsidiaryLedgerAccountName SubsidiaryLedgerAccount { get; set; }
    }
}