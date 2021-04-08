using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class Inventory
    {
        public Inventory()
        {
            InventoryLedgers = new HashSet<InventoryLedger>();
            LedgerDetails = new HashSet<LedgerDetail>();
            PurchaseDetails = new HashSet<PurchaseDetail>();
        }

        public int Id { get; set; }
        public string InventoryProductServiceCode { get; set; }
        public string InventoryProductServiceName { get; set; }
        public string InventoryProductDescription { get; set; }
        public string InventoryProductServiceType { get; set; }
        public int? InventoryProductServiceAssetAccountId { get; set; }
        public int? InventoryProductServiceIncomeAccountId { get; set; }
        public int? InventoryProductServiceExpenseAccountId { get; set; }
        public DateTime InventoryProductServiceModifiedDate { get; set; }
        public DateTime InventoryProductServiceCreatedDate { get; set; }

        public virtual ChartOfAccount InventoryProductServiceAssetAccount { get; set; }
        public virtual ChartOfAccount InventoryProductServiceExpenseAccount { get; set; }
        public virtual ChartOfAccount InventoryProductServiceIncomeAccount { get; set; }
        public virtual ICollection<InventoryLedger> InventoryLedgers { get; set; }
        public virtual ICollection<LedgerDetail> LedgerDetails { get; set; }
        public virtual ICollection<PurchaseDetail> PurchaseDetails { get; set; }
    }
}
