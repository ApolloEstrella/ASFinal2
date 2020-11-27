using Microsoft.AspNetCore.Mvc;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ChartOfAccountController : ControllerBase
    {
        private readonly IChartOfAccountService _chartOfAccountService;
        public ChartOfAccountController(IChartOfAccountService chartOfAccountService)
        {
            _chartOfAccountService = chartOfAccountService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_chartOfAccountService.GetChartOfAccount());
        }

        [HttpGet]
        public IActionResult GetTypes()
        {
            return Ok(_chartOfAccountService.GetChartOfAccountsTypes());
        }

        [HttpPost]
        public IActionResult AddAccount(ChartOfAccount account)
        {
            return Ok(_chartOfAccountService.AddAccount(account));
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAccount(int id)
        {
            return Ok(_chartOfAccountService.DeleteAccount(id));
        }
        [HttpPut]
        public IActionResult EditAccount(ChartOfAccount account)
        {
            return Ok(_chartOfAccountService.EditAccount(account));
        }

    }
}
