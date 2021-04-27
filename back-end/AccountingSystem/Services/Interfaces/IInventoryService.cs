using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Models;

namespace AccountingSystem.Services.Interfaces
{
    public interface IInventoryService
    {
        List<InventoryModel> GetAll();
        List<InventoryItemModel> GetSelect();
        List<InventoryItemModel> GetSelectPerType(string type);
        int Add(InventoryModel inventoryModel);
        int Update(InventoryModel inventoryModel);
        int Delete(int Id);
        decimal GetUnitCost(int inventoryId, decimal quantity, decimal cost);
    }
}
