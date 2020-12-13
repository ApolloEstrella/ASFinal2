using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace AccountingSystem.Models
{
    public class FileModel
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public IFormFile FormFile { get; set; }
        public string[] FileNames { get; set; }
        public IFormFileCollection Files { get; set; }
    }
}
