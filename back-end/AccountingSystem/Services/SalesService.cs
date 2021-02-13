using System.IO;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;
using System.Collections.Generic;
using AccountingSystem.Models;
using System;
using System.Linq;

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

        public List<CustomerInvoiceForListModel> GetAllSalesInvoices()
        {
            return (from a in _serverContext.LedgerMasters
                    join b in _serverContext.SubsidiaryLedgerAccountNames
                    on a.SubsidiaryLedgerAccountId equals b.Id
                    select new { a.Id, a.InvoiceDate, a.InvoiceNo, b.Name }).ToList()
                    .Select(x => new CustomerInvoiceForListModel { Id = x.Id, InvoiceDate = x.InvoiceDate, InvoiceNo = x.InvoiceNo, Customer = x.Name }).OrderBy(x => x.InvoiceDate).ToList();                 
        }
        public CustomerInvoiceModel GetSalesInvoice(int id)
        {
            List<CustomerInvoiceItemModel> items = (from a in _serverContext.LedgerDetails
                                                    join b in _serverContext.TaxRates
                                                    on a.InvoiceTaxRateId equals b.Id
                                                    select new
                                                    {
                                                        a.Id,
                                                        a.InvoiceSalesItem,
                                                        a.LedgerMasterId,
                                                        a.InvoiceSalesItemId,
                                                        a.InvoiceDescription,
                                                        a.InvoiceQuantity,
                                                        a.InvoiceUnitPrice,
                                                        a.InvoiceTaxRateId,
                                                        a.InvoiceTrackingId,
                                                        b.Description,
                                                        b.Rate
                                                    }).ToList()
                                                    .Where(w => w.LedgerMasterId == id)
                                                   .Select(x => new CustomerInvoiceItemModel
                                                   {
                                                       Id = x.Id,
                                                       LedgerMasterId = x.LedgerMasterId,
                                                       SalesItem = new SalesItem { Value = x.InvoiceSalesItemId },
                                                       Description = x.InvoiceDescription,
                                                       Qty = x.InvoiceQuantity,
                                                       UnitPrice = x.InvoiceUnitPrice,
                                                       TaxRateItem = new TaxRateItem { Value = x.InvoiceTaxRateId, Label = x.Description, Rate = x.Rate },
                                                       TrackingItem = new TrackingItem { Value = x.InvoiceTrackingId },
                                                       Amount= Math.Round((x.InvoiceQuantity * x.InvoiceUnitPrice), 2).ToString("#,##0.00")
                                                   }).ToList();

            var x = (from a in _serverContext.LedgerMasters
                     select new
                     {
                         a.Id,
                         a.SubsidiaryLedgerAccountId,
                         a.InvoiceBillingAddress,
                         a.InvoiceNo,
                         a.InvoiceDate,
                         a.InvoiceDueDate,
                         a.InvoiceTerms,
                         a.InvoiceReference

                     })
                    .Select(x => new CustomerInvoiceModel
                    {
                        Id = x.Id,
                        Customer = new Customer { Value = x.SubsidiaryLedgerAccountId },
                        BillingAddress = x.InvoiceBillingAddress,
                        InvoiceNo = x.InvoiceNo,
                        Date = x.InvoiceDate,
                        DueDate = x.InvoiceDueDate,
                        Terms = x.InvoiceTerms,
                        Reference = x.InvoiceReference,
                        Items = items
                    })
                    .Where(w => w.Id == id)
                    .FirstOrDefault();

            return (from a in _serverContext.LedgerMasters
                    select new
                    {
                        a.Id,
                        a.SubsidiaryLedgerAccountId,
                        a.InvoiceBillingAddress,
                        a.InvoiceNo,
                        a.InvoiceDate,
                        a.InvoiceDueDate,
                        a.InvoiceTerms,
                        a.InvoiceReference

                    })
                    .Select(x => new CustomerInvoiceModel
                    {
                        Id = x.Id,
                        Customer = new Customer { Value = x.SubsidiaryLedgerAccountId },
                        BillingAddress = x.InvoiceBillingAddress,
                        InvoiceNo = x.InvoiceNo,
                        Date = x.InvoiceDate,
                        DueDate = x.InvoiceDueDate,
                        Terms = x.InvoiceTerms,
                        Reference = x.InvoiceReference,
                        Items = items
                    })
                    .Where(w => w.Id == id)
                    .FirstOrDefault();


        }
        public int AddSalesInvoice(CustomerInvoiceModel customerInvoiceModel)
        {
            int Id = 0;
            _serverContext.Database.BeginTransaction();
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
            if (files.Files != null)
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
            }
            return 1;
        }

        public int EditSalesInvoice(CustomerInvoiceEditModel customerInvoiceEditModel)
        {
            _serverContext.Database.BeginTransaction();
            try
            {
                var ledgerMaster = _serverContext.LedgerMasters.Find(customerInvoiceEditModel.Id);
                ledgerMaster.SubsidiaryLedgerAccountId = customerInvoiceEditModel.Customer;
                ledgerMaster.InvoiceBillingAddress = customerInvoiceEditModel.BillingAddress;
                ledgerMaster.InvoiceNo = customerInvoiceEditModel.InvoiceNo;
                ledgerMaster.InvoiceDate = customerInvoiceEditModel.Date;
                ledgerMaster.InvoiceDueDate = customerInvoiceEditModel.DueDate;
                ledgerMaster.InvoiceTerms = customerInvoiceEditModel.Terms;
                ledgerMaster.InvoiceReference = customerInvoiceEditModel.Reference;
                _serverContext.SaveChanges();

                //_serverContext.LedgerDetails.

                _serverContext.Database.CommitTransaction();
            }
            catch(Exception ex)
            {
                _serverContext.Database.RollbackTransaction();
            }
            return 1;
        }
    }
}
