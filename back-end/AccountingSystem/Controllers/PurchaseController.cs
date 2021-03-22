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
    public class PurchaseController : ControllerBase
    {
        private readonly IPurchaseService _purchaseService;
        public PurchaseController(IPurchaseService purchaseService)
        {
            _purchaseService = purchaseService;
        }

        [HttpPost]
        public ActionResult Add(PurchaseModel purchaseModel)
        {
            return Ok();
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            return Ok(_purchaseService.GetAll());
        }
    }
}
