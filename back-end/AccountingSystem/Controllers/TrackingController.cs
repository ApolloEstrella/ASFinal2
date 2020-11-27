﻿using Microsoft.AspNetCore.Mvc;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrackingController : ControllerBase
    {
        private readonly ITrackingService _trackingService;

        public TrackingController(ITrackingService trackingService)
        {
            _trackingService = trackingService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_trackingService.GetTracking());
        }

        [HttpPost]
        public IActionResult Post(Tracking account)
        {
            return Ok(_trackingService.AddAccount(account));
            
        }
    }
}
