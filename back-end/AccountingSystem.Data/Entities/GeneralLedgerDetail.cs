using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class GeneralLedgerDetail
    {
        public int Id { get; set; }
        public int GeneralLedgerId { get; set; }
        public int ChartOfAccountId { get; set; }
        public string GeneralLedgerDetailMode { get; set; }
        public decimal GeneralLedgerDetailAmount { get; set; }
        public string GeneralLedgerDetailDescription { get; set; }

        public virtual ChartOfAccount ChartOfAccount { get; set; }
        public virtual GeneralLedger GeneralLedger { get; set; }
    }
}
