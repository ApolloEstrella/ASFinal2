using System;
using Microsoft.EntityFrameworkCore;

namespace AccountingSystem.Data.Entities
{
    public partial class accounting_systemContextExt : accounting_systemContext
    {
        public accounting_systemContextExt()
        {
        }

        public accounting_systemContextExt(DbContextOptions<accounting_systemContext> options)
            : base(options)
        {
        }

        //public virtual DbSet<JustAnotherEntity> AnotherEntity { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDbFunction(typeof(accounting_systemContext).GetMethod(nameof(ActivePostCountForBlog), new[] { typeof(int) }))
    .HasName("CommentedPostCountForBlog");

        }

        public int ActivePostCountForBlog(int blogId)
            => throw new NotSupportedException(); 
    }
}
