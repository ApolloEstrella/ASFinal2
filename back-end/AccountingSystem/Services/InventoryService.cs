using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Models;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services
{   
    public class InventoryService : IInventoryService
    {
        private readonly accounting_systemContext _serverContext;
        public InventoryService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public List<InventoryModel> GetAll()
        {
            List<InventoryModel> list = (from a in _serverContext.Inventories
                                         select new { a.Id, a.InventoryProductServiceName, a.InventoryProductServiceCode, 
                                                      a.InventoryProductDescription, a.InventoryProductServiceType,
                                                      a.InventoryProductServiceAssetAccountId,
                                                      a.InventoryProductServiceIncomeAccountId,
                                                      a.InventoryProductServiceExpenseAccountId
                                         
                                         }).ToList()
                                        .Select(x => new InventoryModel
                                        {
                                            Id = x.Id,
                                            Name = x.InventoryProductServiceName,
                                            ProductServiceCode = x.InventoryProductServiceCode,
                                            Description = x.InventoryProductDescription,
                                            Type=x.InventoryProductServiceType,
                                            AssetAccount = new AssetAccount { Value = x.InventoryProductServiceAssetAccountId },
                                            IncomeAccount = new IncomeAccount { Value = x.InventoryProductServiceIncomeAccountId},
                                            ExpenseAccount = new ExpenseAccount { Value = x.InventoryProductServiceExpenseAccountId}
                                        }).OrderBy(x => x.Name).ToList();
            return list;
        }

        public InventoryItemModel GetInventoryItem()
        {
            InventoryItemModel inventoryItemModel = null;
            return inventoryItemModel;
        }
        public List<InventoryItemModel> GetSelect()
        {
            return (from a in _serverContext.Inventories
                    select new { a.Id, a.InventoryProductServiceName }).ToList()
                     .Select(x => new InventoryItemModel { value = x.Id, label = x.InventoryProductServiceName }).OrderBy(x => x.label).ToList();
        }
        public int Add(InventoryModel inventoryModel)
        {
            Inventory inventory = new Inventory
            {
                InventoryProductServiceName = inventoryModel.Name,
                InventoryProductServiceType = inventoryModel.Type,
                InventoryProductServiceCode = inventoryModel.ProductServiceCode,
                InventoryProductDescription = inventoryModel.Description,
                InventoryProductServiceIncomeAccountId = inventoryModel.IncomeAccount.Value,
                InventoryProductServiceExpenseAccountId = inventoryModel.ExpenseAccount == null ? null : inventoryModel.ExpenseAccount.Value,
                InventoryProductServiceCreatedDate = DateTime.Now,
            };
            _serverContext.Inventories.Add(inventory);
            _serverContext.SaveChanges();
            return inventory.Id;
        }
        public int Update(InventoryModel inventoryModel)
        {
            Inventory inventory = _serverContext.Inventories.Find(inventoryModel.Id);
            inventory.InventoryProductServiceType = inventoryModel.Type;
            inventory.InventoryProductServiceName = inventoryModel.Name;
            inventory.InventoryProductDescription = inventoryModel.Description;
            inventory.InventoryProductServiceCode = inventoryModel.ProductServiceCode;
            inventory.InventoryProductServiceAssetAccountId = inventoryModel.AssetAccount.Value;
            inventory.InventoryProductServiceIncomeAccountId = inventoryModel.IncomeAccount.Value;
            inventory.InventoryProductServiceExpenseAccountId = inventoryModel.ExpenseAccount.Value;
            _serverContext.SaveChanges();
            return inventoryModel.Id;
        }
        public int Delete(int Id)
        {
            Inventory inventory = _serverContext.Inventories.Find(Id);
            _serverContext.Inventories.Remove(inventory);
            _serverContext.SaveChanges();
            return Id;
        }
    }
}
