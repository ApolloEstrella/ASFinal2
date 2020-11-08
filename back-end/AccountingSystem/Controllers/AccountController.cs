using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AccountingSystem.Data;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Models;
using Microsoft.AspNetCore.Cors;

namespace AccountingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost]
        public int Post([FromBody] User user)
        {
            return _accountService.AddUser(user);
        }

        [HttpGet]
        public IActionResult Get(string email)
        {
            return Ok(_accountService.GetUser(email));
        }
    }
}
