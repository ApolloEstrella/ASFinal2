using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class PurchaseItemModel
    {
        public int Id { get; set; }
        public int PurchaseId { get; set; }
        public InventoryItem InventoryItem { get; set; }
        public ChartOfAccountItem ChartOfAccountItem { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public PurchaseTaxRate TaxRateItem { get; set; }
        public decimal Amount { get; set; }
    }

    public class InventoryItem
    {
        public int? Value { get; set; }
        public string Label { get; set; }
    }
    public class ChartOfAccountItem
    {
        public int Value { get; set; }
        public string Label { get; set; }
    }
    public class PurchaseTaxRate
    {
        public int Value { get; set; }
        public string Label { get; set; }
        public decimal Rate { get; set; }
    }
}
