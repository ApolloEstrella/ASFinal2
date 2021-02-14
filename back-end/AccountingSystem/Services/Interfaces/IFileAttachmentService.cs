using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Services.Interfaces
{
    public interface IFileAttachmentService
    {
        int DeleteFile(string file);
    }
}
