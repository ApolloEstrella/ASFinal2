using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class ChartOfAccountModel
    {
       public int Id { get; set; }
       public string Type { get; set; }
       public string Title { get; set; }
       public int CategoryId { get; set; }
       public string Description { get; set; }
       public string Code { get; set; }
       public int AccountTypeId { get; set; }

    }
}
