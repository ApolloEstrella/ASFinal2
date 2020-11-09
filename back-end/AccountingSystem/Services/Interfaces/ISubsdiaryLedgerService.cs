using System.Collections.Generic;
using AccountingSystem.Data.Entities;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface ISubsdiaryLedgerService
    {
        List<SubsidiaryLedgerModel> GetSubsidiaryLedger();
        int AddAccount(SubsidiaryLedgerAccountName account);
        int DeleteAccount(int id);
        int EditAccount(SubsidiaryLedgerAccountName account);
    }
}
