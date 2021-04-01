using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Entities
{
    public partial class PurchaseDetail
    {
        public int Id { get; set; }
        public int PurchaseId { get; set; }
        public int ChartOfAccountId { get; set; }
        public string PurchaseDetailDescription { get; set; }
        public decimal PurchaseQuantity { get; set; }
        public decimal PurchaseUnitPrice { get; set; }
        public int PurchaseTaxRateId { get; set; }
        public int? PurchaseInventoryId { get; set; }

        public virtual ChartOfAccount ChartOfAccount { get; set; }
        public virtual Purchase Purchase { get; set; }
        public virtual Inventory PurchaseInventory { get; set; }
        public virtual TaxRate PurchaseTaxRate { get; set; }
    }
}
