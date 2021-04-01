using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class VendorBillPaymentModel
    {
        public int Id { get; set; }
        public int PurchaseId { get; set; }
        public int VendorId { get; set; }
        public string ReferenceNo { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal BillAmount { get; set; }
        public int ChartOfAccountId { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<VendorBillPostPaymentItemModel> Items { get; set; }
    }
}
