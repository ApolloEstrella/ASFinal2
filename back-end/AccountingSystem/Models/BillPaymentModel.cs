using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class BillPaymentModel
    {
        public string ReferenceNo { get; set; }
        public decimal Amount { get; set; }
        public int PurchaseId { get; set; }
        public int SubsidiaryLedgerId { get; set; }
    }
}
