using System.IO;
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
                LedgerMaster ledgerMaster = new LedgerMaster();
                ledgerMaster.SubsidiaryLedgerAccountId = customerInvoiceModel.Customer.Value;
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
                    ledgerDetail.InvoiceSalesItemId = item.SalesItem.Value;
                    ledgerDetail.InvoiceDescription = item.Description;
                    ledgerDetail.InvoiceQuantity = item.Qty;
                    ledgerDetail.InvoiceUnitPrice = item.UnitPrice;
                    ledgerDetail.InvoiceTaxRate = item.TaxRateItem.Value;
                    ledgerDetail.InvoiceTaxRateId = item.TaxRateItem.Value;
                    ledgerDetail.InvoiceTrackingId = item.TrackingItem.Value;
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

        public int AddUploadFiles(int id, FileModel files)
        {
            for (int i = 0; i < files.Files.Count; i++)
            {
                string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", files.Files[i].FileName);
                using (Stream stream = new FileStream(path, FileMode.Create))
                {
                    files.Files[i].CopyTo(stream);
                    UploadedFile uploadedFile = new UploadedFile();
                    uploadedFile.Id = 0;
                    uploadedFile.LedgerMasterId = id;
                    uploadedFile.Path = path;
                    _serverContext.UploadedFiles.Add(uploadedFile);
                    _serverContext.SaveChanges();
                }
            }
            return 1;
        }
    }
}
