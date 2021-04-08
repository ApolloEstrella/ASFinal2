using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class ViewInventoryBalance
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal? Balance { get; set; }
    }
}
