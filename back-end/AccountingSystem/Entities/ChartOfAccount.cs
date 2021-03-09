using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Entities
{
    public partial class ChartOfAccount
    {
        public ChartOfAccount()
        {
            IncomeItems = new HashSet<IncomeItem>();
            InvoicePayments = new HashSet<InvoicePayment>();
        }

        public int Id { get; set; }
        public int AccountTypeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public int? SubAccountTypeId { get; set; }

        public virtual ChartOfAccountsType AccountType { get; set; }
        public virtual ICollection<IncomeItem> IncomeItems { get; set; }
        public virtual ICollection<InvoicePayment> InvoicePayments { get; set; }
    }
}
