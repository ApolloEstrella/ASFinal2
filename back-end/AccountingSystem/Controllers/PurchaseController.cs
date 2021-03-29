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
            return Ok(_purchaseService.Add(purchaseModel));
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            return Ok(_purchaseService.GetAll());
        }
        [HttpGet]
        public ActionResult GetById(int Id)
        {
            return Ok(_purchaseService.GetById(Id));
        }

        [HttpPut]
        public ActionResult Update(PurchaseModel purchaseModel)
        {
            return Ok(_purchaseService.Update(purchaseModel));
        }

        [HttpDelete]
        public ActionResult Delete(int Id)
        {
            return Ok(_purchaseService.Delete(Id));
        }
        [HttpGet]
        public ActionResult GetBillPayments (int VendorId)
        {
            return Ok(_purchaseService.GetBillPayments(VendorId));
        }

    }
}
