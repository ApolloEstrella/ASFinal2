using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace AccountingSystem.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SubsidiaryLedgerController : ControllerBase
    {
        private readonly ISubsdiaryLedgerService _subsdiaryLedgerService;
        public SubsidiaryLedgerController(ISubsdiaryLedgerService subsdiaryLedgerService)
        {
            _subsdiaryLedgerService = subsdiaryLedgerService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_subsdiaryLedgerService.GetSubsidiaryLedger());
        }
        [HttpPost]
        public IActionResult AddAccount(SubsidiaryLedgerAccountName name)
        {
            return Ok(_subsdiaryLedgerService.AddAccount(name));
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteAccount(int id)
        {
            return Ok(_subsdiaryLedgerService.DeleteAccount(id));
        }
        public IActionResult EditAccount(SubsidiaryLedgerAccountName account)
        {
            return Ok(_subsdiaryLedgerService.EditAccount(account));
        }
    }
}
