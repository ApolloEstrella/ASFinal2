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

        public virtual DbSet<ChartOfAccount> ChartOfAccounts { get; set; }
        public virtual DbSet<ChartOfAccountsCategory> ChartOfAccountsCategories { get; set; }
        public virtual DbSet<ChartOfAccountsType> ChartOfAccountsTypes { get; set; }
        public virtual DbSet<SubsidiaryLedgerAccountName> SubsidiaryLedgerAccountNames { get; set; }
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

            modelBuilder.Entity<SubsidiaryLedgerAccountName>(entity =>
            {
                entity.ToTable("subsidiary_ledger_account_name");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("name");
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
