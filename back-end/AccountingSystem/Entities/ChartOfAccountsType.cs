using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Entities
{
    public partial class ChartOfAccountsType
    {
        public ChartOfAccountsType()
        {
            ChartOfAccounts = new HashSet<ChartOfAccount>();
        }

        public int Id { get; set; }
        public string Type { get; set; }
        public int CategoryId { get; set; }

        public virtual ChartOfAccountsCategory Category { get; set; }
        public virtual ICollection<ChartOfAccount> ChartOfAccounts { get; set; }
    }
}
