using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class ChartOfAccount
    {
        public int Id { get; set; }
        public int AccountTypeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public int? SubAccountTypeId { get; set; }

        public virtual ChartOfAccountsType AccountType { get; set; }
    }
}
