using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class TaxRateModel
    {
        public int value { get; set; }
        public string label { get; set; }

        public decimal rate { get; set; }

    }
}
