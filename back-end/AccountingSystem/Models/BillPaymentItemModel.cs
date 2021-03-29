using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class BillPaymentItemModel
    {
        public int Id { get; set; }
        public string BillReferenceNo { get; set; }
        public decimal BillAmount { get; set; }
        public decimal BillUnPaidBalance { get; set; }
        public int BillVendorId { get; set; }
        public DateTime BillDate { get; set; }
        public DateTime BillDueDate { get; set; }
    }
}
