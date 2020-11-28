using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using AccountingSystem.Models;

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
    }
}
