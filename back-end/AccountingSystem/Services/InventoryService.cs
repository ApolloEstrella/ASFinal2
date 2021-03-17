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
                                         select new { a.Id, a.InventoryProductServiceName, a.InventoryProductServiceCode, a.InventoryProductDescription }).ToList()
                                        .Select(x => new InventoryModel
                                        {
                                            Id = x.Id,
                                            Name = x.InventoryProductServiceName,
                                            ProductServiceCode = x.InventoryProductServiceCode,
                                            Description = x.InventoryProductDescription
                                        }).ToList();
            return list;
        }
        public int Add(InventoryModel inventoryModel)
        {
            Inventory inventory = new Inventory
            {
                InventoryProductServiceName = inventoryModel.Name,
                InventoryProductServiceType = inventoryModel.Type,
                InventoryProductServiceCode = inventoryModel.ProductServiceCode,
                InventoryProductDescription = inventoryModel.Description,
                InventoryProductServiceCreatedDate = DateTime.Now,
                InventoryProductServiceModifiedDate = DateTime.Now
            };
            _serverContext.Inventories.Add(inventory);
            _serverContext.SaveChanges();
            return inventory.Id;
        }
    }
}
