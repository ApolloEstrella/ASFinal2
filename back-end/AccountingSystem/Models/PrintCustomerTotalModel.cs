using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class PrintCustomerTotalModel
    {
        public decimal SubTotal { get; set; }
        public decimal TotalTaxes { get; set; }
        public decimal Total { get; set; }
    }
}
