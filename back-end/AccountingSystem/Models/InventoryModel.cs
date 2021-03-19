using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class InventoryModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string ProductServiceCode { get; set; }
        public string Description { get; set; }
        public IncomeAccount IncomeAccount { get; set; }
        public ExpenseAccount ExpenseAccount { get; set; }
        public AssetAccount AssetAccount { get; set; }
    }
    public class IncomeAccount
    {
        public int? Value { get; set; }
        public string Label { get; set; }
    }

    public class ExpenseAccount
    {
        public int? Value { get; set; }
        public string Label { get; set; }
    }

    public class AssetAccount
    {
        public int? Value { get; set; }
        public string Label { get; set; }
    }
}
