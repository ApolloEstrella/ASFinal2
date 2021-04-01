using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class accounting_systemContext : DbContext
    {
        public accounting_systemContext()
        {
        }

        public accounting_systemContext(DbContextOptions<accounting_systemContext> options)
            : base(options)
        {
        }

        public virtual DbSet<BillPayment> BillPayments { get; set; }
        public virtual DbSet<BillPaymentDetail> BillPaymentDetails { get; set; }
        public virtual DbSet<ChartOfAccount> ChartOfAccounts { get; set; }
        public virtual DbSet<ChartOfAccountsCategory> ChartOfAccountsCategories { get; set; }
        public virtual DbSet<ChartOfAccountsType> ChartOfAccountsTypes { get; set; }
        public virtual DbSet<IncomeItem> IncomeItems { get; set; }
        public virtual DbSet<Inventory> Inventories { get; set; }
        public virtual DbSet<InvoicePayment> InvoicePayments { get; set; }
        public virtual DbSet<InvoicePaymentDetail> InvoicePaymentDetails { get; set; }
        public virtual DbSet<LedgerDetail> LedgerDetails { get; set; }
        public virtual DbSet<LedgerMaster> LedgerMasters { get; set; }
        public virtual DbSet<Purchase> Purchases { get; set; }
        public virtual DbSet<PurchaseDetail> PurchaseDetails { get; set; }
        public virtual DbSet<SubsidiaryLedgerAccountName> SubsidiaryLedgerAccountNames { get; set; }
        public virtual DbSet<TaxRate> TaxRates { get; set; }
        public virtual DbSet<Tracking> Trackings { get; set; }
        public virtual DbSet<UploadedFile> UploadedFiles { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=DESKTOP-GT4AAMB;Database=accounting_system;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<BillPayment>(entity =>
            {
                entity.ToTable("bill_payment");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.BillPaymentAmount)
                    .HasColumnType("decimal(12, 2)")
                    .HasColumnName("bill_payment_amount");

                entity.Property(e => e.BillPaymentCreatedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("bill_payment_created_date");

                entity.Property(e => e.BillPaymentDate)
                    .HasColumnType("date")
                    .HasColumnName("bill_payment_date");

                entity.Property(e => e.BillPaymentModifiedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("bill_payment_modified_date")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.BillPaymentNotes)
                    .HasMaxLength(500)
                    .HasColumnName("bill_payment_notes");

                entity.Property(e => e.ChartOfAccountId).HasColumnName("chart_of_account_id");

                entity.Property(e => e.SubsidiaryLedgerAccountId).HasColumnName("subsidiary_ledger_account_id");

                entity.HasOne(d => d.ChartOfAccount)
                    .WithMany(p => p.BillPayments)
                    .HasForeignKey(d => d.ChartOfAccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_bill_payment_chart_of_account_id");

                entity.HasOne(d => d.SubsidiaryLedgerAccount)
                    .WithMany(p => p.BillPayments)
                    .HasForeignKey(d => d.SubsidiaryLedgerAccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_bill_payment_subsidiary_ledger_account_id");
            });

            modelBuilder.Entity<BillPaymentDetail>(entity =>
            {
                entity.ToTable("bill_payment_detail");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.BillPaymentDetailAmount)
                    .HasColumnType("decimal(12, 2)")
                    .HasColumnName("bill_payment_detail_amount");

                entity.Property(e => e.BillPaymentId).HasColumnName("bill_payment_id");

                entity.Property(e => e.PurchaseId).HasColumnName("purchase_id");

                entity.HasOne(d => d.BillPayment)
                    .WithMany(p => p.BillPaymentDetails)
                    .HasForeignKey(d => d.BillPaymentId)
                    .HasConstraintName("FK_bill_payment_detail_bill_payment_id");

                entity.HasOne(d => d.Purchase)
                    .WithMany(p => p.BillPaymentDetails)
                    .HasForeignKey(d => d.PurchaseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_bill_payment_detail_purchase_id");
            });

            modelBuilder.Entity<ChartOfAccount>(entity =>
            {
                entity.ToTable("chart_of_account");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AccountTypeId).HasColumnName("account_type_id");

                entity.Property(e => e.Code)
                    .HasMaxLength(30)
                    .HasColumnName("code");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("description");

                entity.Property(e => e.SubAccountTypeId).HasColumnName("sub_account_type_id");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("title");

                entity.HasOne(d => d.AccountType)
                    .WithMany(p => p.ChartOfAccounts)
                    .HasForeignKey(d => d.AccountTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_chart_of_account_type_id");
            });

            modelBuilder.Entity<ChartOfAccountsCategory>(entity =>
            {
                entity.ToTable("chart_of_accounts_category");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Category)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("category");
            });

            modelBuilder.Entity<ChartOfAccountsType>(entity =>
            {
                entity.ToTable("chart_of_accounts_type");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CategoryId).HasColumnName("category_id");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("type");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.ChartOfAccountsTypes)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_category_id");
            });

            modelBuilder.Entity<IncomeItem>(entity =>
            {
                entity.ToTable("income_item");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Description)
                    .HasMaxLength(200)
                    .HasColumnName("description");

                entity.Property(e => e.IncomeAccountId).HasColumnName("income_account_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("name");

                entity.Property(e => e.Sku)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("sku");

                entity.HasOne(d => d.IncomeAccount)
                    .WithMany(p => p.IncomeItems)
                    .HasForeignKey(d => d.IncomeAccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_income_account_id");
            });

            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.ToTable("inventory");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.InventoryProductDescription)
                    .IsRequired()
                    .HasMaxLength(2000)
                    .HasColumnName("inventory_product_description");

                entity.Property(e => e.InventoryProductServiceAssetAccountId).HasColumnName("inventory_product_service_asset_account_id");

                entity.Property(e => e.InventoryProductServiceCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("inventory_product_service_code");

                entity.Property(e => e.InventoryProductServiceCreatedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("inventory_product_service_created_date");

                entity.Property(e => e.InventoryProductServiceExpenseAccountId).HasColumnName("inventory_product_service_expense_account_id");

                entity.Property(e => e.InventoryProductServiceIncomeAccountId).HasColumnName("inventory_product_service_income_account_id");

                entity.Property(e => e.InventoryProductServiceModifiedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("inventory_product_service_modified_date")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.InventoryProductServiceName)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("inventory_product_service_name");

                entity.Property(e => e.InventoryProductServiceType)
                    .IsRequired()
                    .HasMaxLength(1)
                    .HasColumnName("inventory_product_service_type")
                    .IsFixedLength(true);

                entity.HasOne(d => d.InventoryProductServiceAssetAccount)
                    .WithMany(p => p.InventoryInventoryProductServiceAssetAccounts)
                    .HasForeignKey(d => d.InventoryProductServiceAssetAccountId)
                    .HasConstraintName("FK_inventory_product_service_asset_account_id");

                entity.HasOne(d => d.InventoryProductServiceExpenseAccount)
                    .WithMany(p => p.InventoryInventoryProductServiceExpenseAccounts)
                    .HasForeignKey(d => d.InventoryProductServiceExpenseAccountId)
                    .HasConstraintName("FK_inventory_product_service_expense_account_id");

                entity.HasOne(d => d.InventoryProductServiceIncomeAccount)
                    .WithMany(p => p.InventoryInventoryProductServiceIncomeAccounts)
                    .HasForeignKey(d => d.InventoryProductServiceIncomeAccountId)
                    .HasConstraintName("FK_inventory_product_service_income_account_id");
            });

            modelBuilder.Entity<InvoicePayment>(entity =>
            {
                entity.ToTable("invoice_payment");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ChartOfAccountId).HasColumnName("chart_of_account_id");

                entity.Property(e => e.InvoicePaymentAmount)
                    .HasColumnType("decimal(12, 2)")
                    .HasColumnName("invoice_payment_amount");

                entity.Property(e => e.InvoicePaymentCreatedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("invoice_payment_created_date");

                entity.Property(e => e.InvoicePaymentDate)
                    .HasColumnType("date")
                    .HasColumnName("invoice_payment_date");

                entity.Property(e => e.InvoicePaymentModifiedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("invoice_payment_modified_date")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.InvoicePaymentNotes)
                    .HasMaxLength(500)
                    .HasColumnName("invoice_payment_notes");

                entity.Property(e => e.InvoicePaymentReferenceNo)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("invoice_payment_reference_no");

                entity.Property(e => e.SubsidiaryLedgerAccountId).HasColumnName("subsidiary_ledger_account_id");

                entity.HasOne(d => d.ChartOfAccount)
                    .WithMany(p => p.InvoicePayments)
                    .HasForeignKey(d => d.ChartOfAccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_invoice_payment_chart_of_account_id");

                entity.HasOne(d => d.SubsidiaryLedgerAccount)
                    .WithMany(p => p.InvoicePayments)
                    .HasForeignKey(d => d.SubsidiaryLedgerAccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_invoice_payment_subsidiary_ledger_account_id");
            });

            modelBuilder.Entity<InvoicePaymentDetail>(entity =>
            {
                entity.ToTable("invoice_payment_detail");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.InvoicePaymentDetailAmount)
                    .HasColumnType("decimal(12, 2)")
                    .HasColumnName("invoice_payment_detail_amount");

                entity.Property(e => e.InvoicePaymentId).HasColumnName("invoice_payment_id");

                entity.Property(e => e.LedgerMasterId).HasColumnName("ledger_master_id");

                entity.HasOne(d => d.InvoicePayment)
                    .WithMany(p => p.InvoicePaymentDetails)
                    .HasForeignKey(d => d.InvoicePaymentId)
                    .HasConstraintName("FK_invoice_payment_detail_invoice_payment_id");

                entity.HasOne(d => d.LedgerMaster)
                    .WithMany(p => p.InvoicePaymentDetails)
                    .HasForeignKey(d => d.LedgerMasterId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_invoice_payment_detail_ledger_master_id");
            });

            modelBuilder.Entity<LedgerDetail>(entity =>
            {
                entity.ToTable("ledger_detail");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ChartOfAccountId).HasColumnName("chart_of_account_id");

                entity.Property(e => e.InvoiceDescription)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("invoice_description");

                entity.Property(e => e.InvoiceQuantity)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("invoice_quantity");

                entity.Property(e => e.InvoiceSalesItemId).HasColumnName("invoice_sales_item_id");

                entity.Property(e => e.InvoiceTaxRateId).HasColumnName("invoice_tax_rate_id");

                entity.Property(e => e.InvoiceTrackingId).HasColumnName("invoice_tracking_id");

                entity.Property(e => e.InvoiceUnitPrice)
                    .HasColumnType("money")
                    .HasColumnName("invoice_unit_price");

                entity.Property(e => e.LedgerMasterId).HasColumnName("ledger_master_id");

                entity.HasOne(d => d.InvoiceSalesItem)
                    .WithMany(p => p.LedgerDetails)
                    .HasForeignKey(d => d.InvoiceSalesItemId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_invoice_sales_item_id");

                entity.HasOne(d => d.InvoiceTaxRate)
                    .WithMany(p => p.LedgerDetails)
                    .HasForeignKey(d => d.InvoiceTaxRateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_invoice_tax_rate_id");

                entity.HasOne(d => d.InvoiceTracking)
                    .WithMany(p => p.LedgerDetails)
                    .HasForeignKey(d => d.InvoiceTrackingId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_invoice_tracking_id");

                entity.HasOne(d => d.LedgerMaster)
                    .WithMany(p => p.LedgerDetails)
                    .HasForeignKey(d => d.LedgerMasterId)
                    .HasConstraintName("FK_ledger_detail_id");
            });

            modelBuilder.Entity<LedgerMaster>(entity =>
            {
                entity.ToTable("ledger_master");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.InvoiceAmount)
                    .HasColumnType("decimal(12, 2)")
                    .HasColumnName("invoice_amount");

                entity.Property(e => e.InvoiceBillingAddress)
                    .IsRequired()
                    .HasMaxLength(1000)
                    .HasColumnName("invoice_billing_address");

                entity.Property(e => e.InvoiceCreatedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("invoice_created_date");

                entity.Property(e => e.InvoiceDate)
                    .HasColumnType("date")
                    .HasColumnName("invoice_date");

                entity.Property(e => e.InvoiceDueDate)
                    .HasColumnType("date")
                    .HasColumnName("invoice_due_date");

                entity.Property(e => e.InvoiceModifiedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("invoice_modified_date")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.InvoiceNo)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("invoice_no");

                entity.Property(e => e.InvoiceReference)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("invoice_reference");

                entity.Property(e => e.InvoiceTerms).HasColumnName("invoice_terms");

                entity.Property(e => e.SubsidiaryLedgerAccountId).HasColumnName("subsidiary_ledger_account_id");

                entity.Property(e => e.TransactionType)
                    .IsRequired()
                    .HasMaxLength(5)
                    .HasColumnName("transaction_type");

                entity.Property(e => e.Void)
                    .HasColumnName("void")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.SubsidiaryLedgerAccount)
                    .WithMany(p => p.LedgerMasters)
                    .HasForeignKey(d => d.SubsidiaryLedgerAccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_subsidiary_ledger_account_id");
            });

            modelBuilder.Entity<Purchase>(entity =>
            {
                entity.ToTable("purchase");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Description)
                    .HasMaxLength(3000)
                    .HasColumnName("description");

                entity.Property(e => e.PurchaseAmount)
                    .HasColumnType("decimal(12, 2)")
                    .HasColumnName("purchase_amount");

                entity.Property(e => e.PurchaseCreatedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("purchase_created_date");

                entity.Property(e => e.PurchaseDate)
                    .HasColumnType("date")
                    .HasColumnName("purchase_date");

                entity.Property(e => e.PurchaseDueDate)
                    .HasColumnType("date")
                    .HasColumnName("purchase_due_date");

                entity.Property(e => e.PurchaseModifiedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("purchase_modified_date")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.PurchaseReferenceNo)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("purchase_reference_no");

                entity.Property(e => e.SubsidiaryLedgerAccountId).HasColumnName("subsidiary_ledger_account_id");

                entity.HasOne(d => d.SubsidiaryLedgerAccount)
                    .WithMany(p => p.Purchases)
                    .HasForeignKey(d => d.SubsidiaryLedgerAccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_purchase_subsidiary_ledger_account_id");
            });

            modelBuilder.Entity<PurchaseDetail>(entity =>
            {
                entity.ToTable("purchase_detail");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ChartOfAccountId).HasColumnName("chart_of_account_id");

                entity.Property(e => e.PurchaseDetailDescription)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("purchase_detail_description");

                entity.Property(e => e.PurchaseId).HasColumnName("purchase_id");

                entity.Property(e => e.PurchaseInventoryId).HasColumnName("purchase_inventory_id");

                entity.Property(e => e.PurchaseQuantity)
                    .HasColumnType("decimal(12, 2)")
                    .HasColumnName("purchase_quantity");

                entity.Property(e => e.PurchaseTaxRateId).HasColumnName("purchase_tax_rate_id");

                entity.Property(e => e.PurchaseUnitPrice)
                    .HasColumnType("decimal(12, 2)")
                    .HasColumnName("purchase_unit_price");

                entity.HasOne(d => d.ChartOfAccount)
                    .WithMany(p => p.PurchaseDetails)
                    .HasForeignKey(d => d.ChartOfAccountId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_purchase_detail_chart_of_account_id");

                entity.HasOne(d => d.Purchase)
                    .WithMany(p => p.PurchaseDetails)
                    .HasForeignKey(d => d.PurchaseId)
                    .HasConstraintName("FK_purchase_detail_purchase_id");

                entity.HasOne(d => d.PurchaseInventory)
                    .WithMany(p => p.PurchaseDetails)
                    .HasForeignKey(d => d.PurchaseInventoryId)
                    .HasConstraintName("FK_purchase_detail_inventory_id");

                entity.HasOne(d => d.PurchaseTaxRate)
                    .WithMany(p => p.PurchaseDetails)
                    .HasForeignKey(d => d.PurchaseTaxRateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_purchase_detail_tax_rate_id");
            });

            modelBuilder.Entity<SubsidiaryLedgerAccountName>(entity =>
            {
                entity.ToTable("subsidiary_ledger_account_name");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Address)
                    .HasMaxLength(1000)
                    .HasColumnName("address");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<TaxRate>(entity =>
            {
                entity.ToTable("tax_rate");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("description");

                entity.Property(e => e.Rate)
                    .HasColumnType("decimal(5, 2)")
                    .HasColumnName("rate");

                entity.Property(e => e.TaxType)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasColumnName("tax_type")
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<Tracking>(entity =>
            {
                entity.ToTable("tracking");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Description)
                    .HasMaxLength(50)
                    .HasColumnName("description");
            });

            modelBuilder.Entity<UploadedFile>(entity =>
            {
                entity.ToTable("uploaded_file");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.LedgerMasterId).HasColumnName("ledger_master_id");

                entity.Property(e => e.Path)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("path");

                entity.HasOne(d => d.LedgerMaster)
                    .WithMany(p => p.UploadedFiles)
                    .HasForeignKey(d => d.LedgerMasterId)
                    .HasConstraintName("FK_ledger_master_id");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("company_name");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("email");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
