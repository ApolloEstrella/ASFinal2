using AccountingSystem.Services.Interfaces;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace AccountingSystem.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly ISalesService _salesService;
        public SalesController(ISalesService salesService)
        {
            _salesService = salesService;
        }

        [HttpPost]
        public ActionResult AddAccount([FromBody] CustomerInvoiceModel customerInvoiceModel)
        {
            return Ok(_salesService.AddSalesInvoice(customerInvoiceModel));
        }

        [HttpPut]
        public ActionResult EditAccount([FromBody] CustomerInvoiceModel customerInvoiceModel)
        {
            return Ok(_salesService.EditSalesInvoice(customerInvoiceModel));
        }

        [HttpPost]
        public ActionResult AddUploadedFiles([FromForm] FileModel files)
        {

            return Ok(_salesService.AddUploadFiles(files.Id, files));
        }

        [HttpGet]
        public ActionResult GetAccount(int id)
        {
            return Ok(_salesService.GetSalesInvoice(id));
        }

        

        [HttpGet]
        public ActionResult GetAllAccounts()
        {
            return Ok(_salesService.GetAllSalesInvoices());
        }
    }
}
