using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class TaxRate
    {
        public TaxRate()
        {
            LedgerDetails = new HashSet<LedgerDetail>();
        }

        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Rate { get; set; }

        public virtual ICollection<LedgerDetail> LedgerDetails { get; set; }
    }
}
