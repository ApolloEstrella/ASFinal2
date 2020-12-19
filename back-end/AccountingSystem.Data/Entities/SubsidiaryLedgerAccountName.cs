using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class SubsidiaryLedgerAccountName
    {
        public SubsidiaryLedgerAccountName()
        {
            LedgerMasters = new HashSet<LedgerMaster>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        public virtual ICollection<LedgerMaster> LedgerMasters { get; set; }
    }
}
