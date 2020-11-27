using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class TaxRate
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Rate { get; set; }
    }
}
