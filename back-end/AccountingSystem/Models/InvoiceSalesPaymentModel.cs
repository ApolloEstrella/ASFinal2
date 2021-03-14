using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class InvoiceSalesPaymentModel
    {
        public string InvoiceNo { get; set; }
        public decimal Amount { get; set; }
        public int LedgerMasterId { get; set; }
        public int SubsidiaryLedgerId { get; set; }

        //public List<InvoiceSalesPaymentItemModel> Items { get; set;  }
    }
}
