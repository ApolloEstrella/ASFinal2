﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class CustomerInvoiceEditModel
    {
        public int Id { get; set; }
        public int SubsidiaryLedgerAccountId { get; set; }
        public int Customer { get; set; }
        public string BillingAddress { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }
        public short Terms { get; set; }
        public string Reference { get; set; }
        public List<CustomerInvoiceItemEditModel> Items { get; set; }
    }
}
