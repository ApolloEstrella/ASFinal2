using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class InvoiceWithoutCost
    {
        public int Id { get; set; }
        public string InvoiceWithoutCostInvoiceNo { get; set; }
        public DateTime InvoiceWithoutCostDate { get; set; }
    }
}
