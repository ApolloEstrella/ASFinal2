using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services.Interfaces
{
    public interface IAccountService
    {
        int AddUser(User user);
        User GetUser(string email);
    }
}
