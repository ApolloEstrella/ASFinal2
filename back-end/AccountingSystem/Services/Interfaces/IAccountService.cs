using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services.Interfaces
{
    public interface IAccountService
    {
        int AddUser(User user);
        User GetUser(string email);
    }
}
