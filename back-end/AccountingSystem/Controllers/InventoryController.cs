using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Models;

namespace AccountingSystem.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        public ActionResult GetAll()
        {
            return Ok(_inventoryService.GetAll());
        }

        public ActionResult GetSelect()
        {
            return Ok(_inventoryService.GetSelect());
        }
        public ActionResult Add(InventoryModel inventoryModel)
        
        {
            return Ok(_inventoryService.Add(inventoryModel));
        }
        public ActionResult Update(InventoryModel inventoryModel)

        {
            return Ok(_inventoryService.Update(inventoryModel));
        }
        public ActionResult Delete(int Id)

        {
            return Ok(_inventoryService.Delete(Id));
        }
    }
}
