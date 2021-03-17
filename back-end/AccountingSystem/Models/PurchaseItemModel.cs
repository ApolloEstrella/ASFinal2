using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class PurchaseItemModel
    {
        public int Id { get; set; }
        public int Account { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class Account
    {
        public int Value { get; set; }
        public string Label { get; set; }
    }
}
