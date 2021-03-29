using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface IPurchaseService
    {
        List<PurchaseModel> GetAll();
        int Add(PurchaseModel purchaseModel);
        PurchaseModel GetById(int Id);
        int Update(PurchaseModel purchaseModel);
        int Delete(int Id);
        List<BillPaymentItemModel> GetBillPayments(int vendorId);
    }
}
