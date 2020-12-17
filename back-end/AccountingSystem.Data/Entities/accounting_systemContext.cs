﻿using System;
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

        public virtual DbSet<ChartOfAccount> ChartOfAccounts { get; set; }
        public virtual DbSet<ChartOfAccountsCategory> ChartOfAccountsCategories { get; set; }
        public virtual DbSet<ChartOfAccountsType> ChartOfAccountsTypes { get; set; }
        public virtual DbSet<IncomeItem> IncomeItems { get; set; }
        public virtual DbSet<LedgerDetail> LedgerDetails { get; set; }
        public virtual DbSet<LedgerMaster> LedgerMasters { get; set; }
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

            modelBuilder.Entity<LedgerDetail>(entity =>
            {
                entity.ToTable("ledger_detail");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ChartOfAccountId).HasColumnName("chart_of_account_id");

                entity.Property(e => e.InvoiceDescription)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("invoice_description");

                entity.Property(e => e.InvoiceQuantity).HasColumnName("invoice_quantity");

                entity.Property(e => e.InvoiceSalesItemId).HasColumnName("invoice_sales_item_id");

                entity.Property(e => e.InvoiceTaxRate)
                    .HasColumnType("numeric(5, 2)")
                    .HasColumnName("invoice_tax_rate")
                    .HasAnnotation("Relational:ColumnType", "numeric(5, 2)");

                entity.Property(e => e.InvoiceTaxRateId).HasColumnName("invoice_tax_rate_id");

                entity.Property(e => e.InvoiceTrackingId).HasColumnName("invoice_tracking_id");

                entity.Property(e => e.InvoiceUnitPrice)
                    .HasColumnType("money")
                    .HasColumnName("invoice_unit_price")
                    .HasAnnotation("Relational:ColumnType", "money");

                entity.Property(e => e.LedgerMasterId).HasColumnName("ledger_master_id");

                entity.HasOne(d => d.InvoiceSalesItem)
                    .WithMany(p => p.LedgerDetails)
                    .HasForeignKey(d => d.InvoiceSalesItemId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_invoice_sales_item_id");

                entity.HasOne(d => d.InvoiceTaxRateNavigation)
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
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ledger_detail_id");
            });

            modelBuilder.Entity<LedgerMaster>(entity =>
            {
                entity.ToTable("ledger_master");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.InvoiceBillingAddress)
                    .IsRequired()
                    .HasMaxLength(1000)
                    .HasColumnName("invoice_billing_address");

                entity.Property(e => e.InvoiceDate)
                    .HasColumnType("date")
                    .HasColumnName("invoice_date")
                    .HasAnnotation("Relational:ColumnType", "date");

                entity.Property(e => e.InvoiceDueDate)
                    .HasColumnType("date")
                    .HasColumnName("invoice_due_date")
                    .HasAnnotation("Relational:ColumnType", "date");

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
                    .HasColumnName("rate")
                    .HasAnnotation("Relational:ColumnType", "decimal(5, 2)");
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
                    .OnDelete(DeleteBehavior.ClientSetNull)
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
