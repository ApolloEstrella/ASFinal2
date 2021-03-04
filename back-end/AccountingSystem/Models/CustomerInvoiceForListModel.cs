using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class CustomerInvoiceForListModel
    {
       public int Id { get; set; }
       public DateTime InvoiceDate { get; set; }
       public string InvoiceNo { get; set; }
       public string Customer { get; set; }
       public bool? Void { get; set; }
       public decimal InvoiceAmount { get; set; }
       public decimal UnPaidBalance { get; set; }

    }
}
