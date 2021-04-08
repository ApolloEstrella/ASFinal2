using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class InventoryLedger
    {
        public int Id { get; set; }
        public int InventoryLedgerReferenceId { get; set; }
        public string InventoryLedgerType { get; set; }
        public int InventoryLedgerInventoryId { get; set; }
        public decimal? InventoryLedgerUnitCost { get; set; }
        public decimal? InventoryLedgerTotalCost { get; set; }
        public DateTime InventoryLedgerDate { get; set; }
        public decimal InventoryLedgerQuantity { get; set; }
        public decimal? InventoryLedgerUnitPrice { get; set; }
        public decimal? InventoryLedgerQuantityIn { get; set; }
        public decimal? InventoryLedgerQuantityOut { get; set; }
        public string InventoryLedgerDescription { get; set; }

        public virtual Inventory InventoryLedgerInventory { get; set; }
    }
}
