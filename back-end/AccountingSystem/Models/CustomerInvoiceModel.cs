using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccountingSystem.Models
{
    public class CustomerInvoiceModel
    {
        public int Id { get; set; }
        public int SubsidiaryLedgerAccountId { get; set; }
        public Customer Customer { get; set; }
        public string BillingAddress { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }
        public short Terms { get; set; }
        public string Reference { get; set; }
        public List<CustomerInvoiceItemModel> Items { get; set; }
        public FileModel Files { get; set; }
        public List<LoadFileModel> LoadFiles { get; set; }
        public decimal Amount { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TotalTaxes { get; set; }
        public decimal Total { get; set; }
    }

    public class Customer
    {
        public int Value { get; set; }
        public string Label { get; set; }
    }
}
