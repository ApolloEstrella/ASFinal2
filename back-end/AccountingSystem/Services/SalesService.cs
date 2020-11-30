using System.Threading.Tasks;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;
using System.Collections.Generic;
using AccountingSystem.Models;
using System;

namespace AccountingSystem.Services
{
    public class SalesService : ISalesService
    {
        private readonly accounting_systemContext _serverContext;

        public SalesService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }
        public List<CustomerInvoiceModel> GetSalesInvoice()
        {
            const List<CustomerInvoiceModel> list = null;
            return list;
        }
        public int AddSalesInvoice(CustomerInvoiceModel customerInvoiceModel)
        {
            int Id = 0;
            _serverContext.Database.BeginTransactionAsync();
            try
            {
                LedgerMaster ledgerMaster = new LedgerMaster(customerInvoiceModel.BillingAddress);
                ledgerMaster.SubsidiaryLedgerAccountId = customerInvoiceModel.Customer;
                ledgerMaster.InvoiceBillingAddress = customerInvoiceModel.BillingAddress;
                ledgerMaster.InvoiceNo = customerInvoiceModel.InvoiceNo;
                ledgerMaster.InvoiceDate = customerInvoiceModel.Date;
                ledgerMaster.InvoiceDueDate = customerInvoiceModel.DueDate;
                ledgerMaster.InvoiceTerms = customerInvoiceModel.Terms;
                ledgerMaster.InvoiceReference = customerInvoiceModel.Reference;
                ledgerMaster.TransactionType = "INV";
                _serverContext.LedgerMasters.Add(ledgerMaster);
                _serverContext.SaveChanges();

                LedgerDetail ledgerDetail = new LedgerDetail();
                foreach (CustomerInvoiceItemModel item in customerInvoiceModel.Items)
                {
                    ledgerDetail.Id = 0;
                    ledgerDetail.LedgerMasterId = ledgerMaster.Id;
                    ledgerDetail.InvoiceSalesItemId = item.SalesItemId;
                    ledgerDetail.InvoiceDescription = item.Description;
                    ledgerDetail.InvoiceQuantity = item.Qty;
                    ledgerDetail.InvoiceUnitPrice = item.UnitPrice;
                    ledgerDetail.InvoiceTaxRate = item.TaxRate;
                    ledgerDetail.InvoiceTaxRateId = item.TaxRateId;
                    ledgerDetail.InvoiceTrackingId = item.TrackingId;
                    _serverContext.LedgerDetails.Add(ledgerDetail);
                    _serverContext.SaveChanges();
                }                
                Id = ledgerMaster.Id;
                _serverContext.Database.CommitTransaction();
            }
            catch (Exception ex)
            {
                _serverContext.Database.RollbackTransaction();
            }
            return Id;
        }
    }
}
