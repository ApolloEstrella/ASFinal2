using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace AccountingSystem.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FileAttachmentController : ControllerBase
    {
        private readonly IFileAttachmentService _fileAttachmentService;
        private IWebHostEnvironment _environment;

        public FileAttachmentController(IFileAttachmentService fileAttachmentService, IWebHostEnvironment environment)
        {
            _fileAttachmentService = fileAttachmentService;
            _environment = environment;
        }

        [HttpDelete]
        public ActionResult DeleteFile(string fileName)
        {
            return Ok(_fileAttachmentService.DeleteFile(fileName));
        }
    }
}
