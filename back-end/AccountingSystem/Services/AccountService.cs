using System.Linq;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services
{
    public class AccountService : IAccountService
    {
        private readonly accounting_systemContext _serverContext;
        public AccountService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public int AddUser(User user)
        {
            if (_serverContext.Users.FirstOrDefault(e => e.Email.ToLower() == user.Email.ToLower()) != null)
            {
                return -1;
            }
            _serverContext.Users.Add(user);
            _serverContext.SaveChanges();
            return user.Id;
        }

        public User GetUser(string email)
        {
            return _serverContext.Users.FirstOrDefault(e => e.Email == email) != null ? _serverContext.Users.FirstOrDefault(e => e.Email == email) : null;
        }
    }
}
