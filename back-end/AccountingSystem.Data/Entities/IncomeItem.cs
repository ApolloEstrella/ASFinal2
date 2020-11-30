using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class IncomeItem
    {
        public IncomeItem()
        {
            LedgerDetails = new HashSet<LedgerDetail>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Sku { get; set; }
        public string Description { get; set; }
        public int IncomeAccountId { get; set; }

        public virtual ChartOfAccount IncomeAccount { get; set; }
        public virtual ICollection<LedgerDetail> LedgerDetails { get; set; }
    }
}
