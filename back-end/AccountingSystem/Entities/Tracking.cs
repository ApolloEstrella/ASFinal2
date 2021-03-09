using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Entities
{
    public partial class Tracking
    {
        public Tracking()
        {
            LedgerDetails = new HashSet<LedgerDetail>();
        }

        public int Id { get; set; }
        public string Description { get; set; }

        public virtual ICollection<LedgerDetail> LedgerDetails { get; set; }
    }
}
