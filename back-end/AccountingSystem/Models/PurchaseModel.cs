using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class PurchaseModel
    {
        public int Id { get; set; }
        //public int SubsidiaryLedgerAccountId { get; set; }
        public string Name { get; set; }
        public int VendorId { get; set; }
        public Vendor Vendor { get; set; }
        public string ReferenceNo { get; set; }
        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public decimal UnpaidBalance { get; set; }
        public string ModeOfPayment { get; set; }
        public ChartOfAccounts ChartOfAccounts { get; set; }
        public int? ChartOfAccountId { get; set; }
        public List<PurchaseItemModel> Items { get; set; }
        public decimal TotalTaxes { get; set; }
    }

    public class Vendor
    {
        public int Value { get; set; }
        public string Label { get; set; }
    }

    public class ChartOfAccounts
    {
        public int? Value { get; set; }
        public string Label { get; set; }
    }
}
