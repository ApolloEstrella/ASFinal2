using System;
using System.Collections.Generic;

#nullable disable

namespace AccountingSystem.Data.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string CompanyName { get; set; }
    }
}
