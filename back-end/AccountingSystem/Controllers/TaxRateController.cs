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
        public IActionResult Get()
        {
            return Ok(_taxRateService.GetTaxRates());
        }

        [HttpPost]
        public IActionResult Post(TaxRate account)
        {
            return Ok(_taxRateService.AddAccount(account));
        }
    }
}
