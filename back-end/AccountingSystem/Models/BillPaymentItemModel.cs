using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class BillPaymentItemModel
    {
        public int Id { get; set; }
        public string ReferenceNo { get; set; }
        public decimal Amount { get; set; }
        public decimal UnPaidBalance { get; set; }
        public int VendorId { get; set; }
        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }
        public decimal AmountPaid { get; set; }
    }
}
