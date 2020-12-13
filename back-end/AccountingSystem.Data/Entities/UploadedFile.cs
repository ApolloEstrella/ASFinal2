using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Entities
{
    public partial class UploadedFile
    {
        public int Id { get; set; }
        public int LedgerMasterId { get; set; }
        public string Path { get; set; }

        public virtual LedgerMaster LedgerMaster { get; set; }
    }
}
