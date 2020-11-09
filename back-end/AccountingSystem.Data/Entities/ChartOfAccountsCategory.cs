using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class ChartOfAccountsCategory
    {
        public ChartOfAccountsCategory()
        {
            ChartOfAccountsTypes = new HashSet<ChartOfAccountsType>();
        }

        public int Id { get; set; }
        public string Category { get; set; }

        public virtual ICollection<ChartOfAccountsType> ChartOfAccountsTypes { get; set; }
    }
}
