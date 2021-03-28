using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class ChartOfAccount
    {
        public ChartOfAccount()
        {
            BillPayments = new HashSet<BillPayment>();
            IncomeItems = new HashSet<IncomeItem>();
            InventoryInventoryProductServiceAssetAccounts = new HashSet<Inventory>();
            InventoryInventoryProductServiceExpenseAccounts = new HashSet<Inventory>();
            InventoryInventoryProductServiceIncomeAccounts = new HashSet<Inventory>();
            InvoicePayments = new HashSet<InvoicePayment>();
            PurchaseDetails = new HashSet<PurchaseDetail>();
        }

        public int Id { get; set; }
        public int AccountTypeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public int? SubAccountTypeId { get; set; }

        public virtual ChartOfAccountsType AccountType { get; set; }
        public virtual ICollection<BillPayment> BillPayments { get; set; }
        public virtual ICollection<IncomeItem> IncomeItems { get; set; }
        public virtual ICollection<Inventory> InventoryInventoryProductServiceAssetAccounts { get; set; }
        public virtual ICollection<Inventory> InventoryInventoryProductServiceExpenseAccounts { get; set; }
        public virtual ICollection<Inventory> InventoryInventoryProductServiceIncomeAccounts { get; set; }
        public virtual ICollection<InvoicePayment> InvoicePayments { get; set; }
        public virtual ICollection<PurchaseDetail> PurchaseDetails { get; set; }
    }
}
