using System.IO;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;
using System.Collections.Generic;
using AccountingSystem.Models;
using System;
using System.Linq;
using Microsoft.AspNetCore.Hosting;

namespace AccountingSystem.Services
{
    public class FileAttachmentService : IFileAttachmentService
    {
        private readonly accounting_systemContext _serverContext;
        private IWebHostEnvironment _environment;

        public FileAttachmentService(accounting_systemContext serverContext, IWebHostEnvironment webHostEnvironment)
        {
            _serverContext = serverContext;
            _environment = webHostEnvironment;
        }

        public int DeleteFile(string file)
        {
            List<UploadedFile> dbFile = _serverContext.UploadedFiles.ToList();

            //foreach(UploadedFile f in dbFile)
            //{
            //    f.Path = Path.GetFileName(f.Path);
            //};


            List<UploadedFile> dbFileFiltered = dbFile.Where(x => Path.GetFileName(x.Path) == file).ToList();
            //_serverContext.UploadedFiles.Remove(dbFile);
            //_serverContext.SaveChanges();
            string fullPath = Path.Combine(_environment.WebRootPath, file);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                //UploadedFile dbFile1 = _serverContext.UploadedFiles.Find(x => x.P ) 
                //_serverContext.UploadedFiles.Remove(dbFile1);
                //_serverContext.SaveChanges();
                if (dbFileFiltered.Count > 0)
                {
                    foreach (UploadedFile f in dbFileFiltered)
                    {
                        _serverContext.UploadedFiles.Remove(f);
                    }
                    _serverContext.SaveChanges();
                }
            }
            return 1;
        }
    }
}
