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
        int Add(InventoryModel inventoryModel);
    }
}
