using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace AccountingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeItemController : ControllerBase
    {
        private readonly IIncomeItemService _incomeItemService;
        public IncomeItemController(IIncomeItemService incomeItemService)
        {
            _incomeItemService = incomeItemService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_incomeItemService.GetIncomeItem());
        }

        [HttpPost]
        public IActionResult AddAccount(IncomeItem account)
        {
            return Ok(_incomeItemService.AddAccount(account));
        }
    }
}
