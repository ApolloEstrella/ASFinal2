using Microsoft.AspNetCore.Mvc;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TaxRateController : ControllerBase
    {
        private readonly ITaxRateService _taxRateService;

        public TaxRateController(ITaxRateService taxRateService)
        {
            _taxRateService = taxRateService;
        }

        [HttpGet]
        public IActionResult Get(string Type)
        {
            return Ok(_taxRateService.GetTaxRates(Type));
        }

        [HttpPost]
        public IActionResult AddAccount(TaxRate account)
        {
            return Ok(_taxRateService.AddAccount(account));
        }
    }
}
