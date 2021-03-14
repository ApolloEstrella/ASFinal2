using System.IO;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Data.Entities;
using System.Collections.Generic;
using AccountingSystem.Models;
using System;
using System.Linq;
using Microsoft.AspNetCore.Http;

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
                    select new { a.Id, a.InvoiceDate, a.InvoiceNo, b.Name, a.Void, a.InvoiceAmount, a.SubsidiaryLedgerAccountId }).ToList()
                    .Select(x => new CustomerInvoiceForListModel
                    {
                        Id = x.Id,
                        InvoiceDate = x.InvoiceDate,
                        InvoiceNo = x.InvoiceNo,
                        Customer = x.Name,
                        Void = x.Void,
                        InvoiceAmount = x.InvoiceAmount,
                        CustomerId = x.SubsidiaryLedgerAccountId,
                        //UnPaidBalance = 0
                        UnPaidBalance = (decimal)x.InvoiceAmount - (from a in _serverContext.InvoicePaymentDetails
                                                                    join b in _serverContext.LedgerMasters
                                                                    on a.LedgerMasterId equals b.Id
                                                                    where a.LedgerMasterId == x.Id &&
                                                                          b.InvoiceNo == x.InvoiceNo
                                                                    select a.InvoicePaymentDetailAmount).Sum(),

                    })
                    .OrderByDescending(x => x.Customer.ToLower()).ThenByDescending(x => x.InvoiceDate).ThenByDescending(x => x.InvoiceNo).ToList();
        }

        public List<CustomerInvoiceForListModel> GetAllSalesInvoicesByCustomerName(string customerName)
        {
            return (from a in _serverContext.LedgerMasters
                    join b in _serverContext.SubsidiaryLedgerAccountNames
                    on a.SubsidiaryLedgerAccountId equals b.Id
                    select new { a.Id, a.InvoiceDate, a.InvoiceNo, b.Name, a.Void, a.InvoiceAmount, a.SubsidiaryLedgerAccountId }).ToList()
                    .Where(x => x.Name.ToLower().Contains(customerName.ToLower()))
                    .Select(x => new CustomerInvoiceForListModel
                    {
                        Id = x.Id,
                        InvoiceDate = x.InvoiceDate,
                        InvoiceNo = x.InvoiceNo,
                        Customer = x.Name,
                        Void = x.Void,
                        InvoiceAmount = x.InvoiceAmount,
                        UnPaidBalance = (decimal)x.InvoiceAmount - (from a in _serverContext.InvoicePaymentDetails
                                                                    join b in _serverContext.LedgerMasters
                                                                    on a.LedgerMasterId equals b.Id
                                                                    where a.LedgerMasterId == x.Id &&
                                                                          b.InvoiceNo == x.InvoiceNo
                                                                    select a.InvoicePaymentDetailAmount).Sum(),
                        CustomerId = x.SubsidiaryLedgerAccountId
                    }).OrderByDescending(x => x.Customer.ToLower()).ThenByDescending(x => x.InvoiceDate).ThenByDescending(x => x.InvoiceNo).ToList();
        }

        public List<CustomerInvoiceForListModel> GetAllSalesInvoicesByInvoiceNo(string invoiceNo)
        {
            return (from a in _serverContext.LedgerMasters
                    join b in _serverContext.SubsidiaryLedgerAccountNames
                    on a.SubsidiaryLedgerAccountId equals b.Id
                    select new { a.Id, a.InvoiceDate, a.InvoiceNo, b.Name, a.Void, a.InvoiceAmount, a.SubsidiaryLedgerAccountId }).ToList()
                    .Where(x => x.InvoiceNo.ToLower().Contains(invoiceNo.ToLower()))
                    .Select(x => new CustomerInvoiceForListModel
                    {
                        Id = x.Id,
                        InvoiceDate = x.InvoiceDate,
                        InvoiceNo = x.InvoiceNo,
                        Customer = x.Name,
                        Void = x.Void,
                        InvoiceAmount = x.InvoiceAmount,
                        UnPaidBalance = (decimal)x.InvoiceAmount - (from a in _serverContext.InvoicePaymentDetails
                                                                    join b in _serverContext.LedgerMasters
                                                                    on a.LedgerMasterId equals b.Id
                                                                    where a.LedgerMasterId == x.Id &&
                                                                          b.InvoiceNo == x.InvoiceNo
                                                                    select a.InvoicePaymentDetailAmount).Sum(),
                        CustomerId = x.SubsidiaryLedgerAccountId
                    }).OrderByDescending(x => x.InvoiceNo.ToLower()).ThenByDescending(x => x.InvoiceDate).ThenByDescending(x => invoiceNo).ToList();
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
                                                       Amount = Math.Round((x.InvoiceQuantity * x.InvoiceUnitPrice), 2).ToString("#,##0.00")
                                                   }).ToList();

            List<LoadFileModel> files = (from a in _serverContext.UploadedFiles
                                         select new
                                         {
                                             a.Id,
                                             a.LedgerMasterId,
                                             a.Path
                                         }).ToList()
                                         .Where(x => x.LedgerMasterId == id)
                                         .Select(x => new LoadFileModel
                                         {
                                             Path = Path.GetFileName(x.Path),
                                             FullPath = x.Path
                                         })
                                         .ToList();




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
                        Items = items,
                        LoadFiles = files
                    })
                    .Where(w => w.Id == id)
                    .FirstOrDefault();


        }
        public CustomerInvoiceModel AddSalesInvoice(CustomerInvoiceModel customerInvoiceModel)
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
                ledgerMaster.InvoiceCreatedDate = DateTime.Now;
                ledgerMaster.InvoiceAmount = customerInvoiceModel.Total;
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
            customerInvoiceModel.Id = Id;
            return customerInvoiceModel;
        }

        public CustomerInvoiceModel EditSalesInvoice(CustomerInvoiceModel customerInvoiceModel)
        {
            _serverContext.Database.BeginTransaction();
            try
            {
                LedgerMaster ledgerMaster = _serverContext.LedgerMasters.Find(customerInvoiceModel.Id);
                ledgerMaster.SubsidiaryLedgerAccountId = customerInvoiceModel.Customer.Value;
                ledgerMaster.InvoiceBillingAddress = customerInvoiceModel.BillingAddress;
                ledgerMaster.InvoiceNo = customerInvoiceModel.InvoiceNo;
                ledgerMaster.InvoiceDate = customerInvoiceModel.Date;
                ledgerMaster.InvoiceDueDate = customerInvoiceModel.DueDate;
                ledgerMaster.InvoiceTerms = customerInvoiceModel.Terms;
                ledgerMaster.InvoiceReference = customerInvoiceModel.Reference;
                ledgerMaster.InvoiceModifiedDate = DateTime.Now;
                ledgerMaster.TransactionType = "INV";
                _serverContext.SaveChanges();


                foreach (var item in _serverContext.LedgerDetails.Where(x => x.LedgerMasterId == customerInvoiceModel.Id).ToList())
                {
                    LedgerDetail ledgerDetail = new LedgerDetail();
                    ledgerDetail = _serverContext.LedgerDetails.Find(item.Id);
                    if (ledgerDetail != null)
                    {
                        _serverContext.LedgerDetails.Remove(ledgerDetail);
                        _serverContext.SaveChanges();
                    }
                }
                foreach (CustomerInvoiceItemModel item in customerInvoiceModel.Items)
                {
                    LedgerDetail ledgerDetail = new LedgerDetail();
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
                _serverContext.Database.CommitTransaction();
            }
            catch (Exception ex)
            {
                _serverContext.Database.RollbackTransaction();
            }
            return customerInvoiceModel;
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

        public PrintCustomerInvoiceModel PrintCustomerInvoice(int id)
        {

            List<PrintCustomerInvoiceDetailModel> InvoiceItems = (from a in _serverContext.IncomeItems
                                                                  join b in _serverContext.LedgerDetails
                                                                  on a.Id equals b.InvoiceSalesItemId
                                                                  join c in _serverContext.TaxRates
                                                                  on b.InvoiceTaxRateId equals c.Id
                                                                  join d in _serverContext.Trackings
                                                                  on b.InvoiceTrackingId equals d.Id
                                                                  //join e in _serverContext.Trackings
                                                                  //on b.InvoiceTrackingId equals e.Id
                                                                  select new
                                                                  {
                                                                      b.LedgerMasterId,
                                                                      a.Name,
                                                                      b.InvoiceDescription,
                                                                      b.InvoiceQuantity,
                                                                      b.InvoiceUnitPrice,
                                                                      TaxRateItem = c.Description,
                                                                      //Amount = (b.InvoiceQuantity * b.InvoiceQuantity),
                                                                      TrackingItem = d.Description,
                                                                      TaxRate = c.Rate / 100
                                                                  }).ToList()
                                                                  .Where(x => x.LedgerMasterId == id)
                                                                  .Select(x => new PrintCustomerInvoiceDetailModel
                                                                  {
                                                                      SalesItem = x.Name,
                                                                      Description = x.InvoiceDescription,
                                                                      Quantity = x.InvoiceQuantity,
                                                                      UnitPrice = x.InvoiceUnitPrice,
                                                                      TaxItem = x.TaxRateItem,
                                                                      SubTotal = Math.Round(x.InvoiceQuantity * x.InvoiceUnitPrice, 2),
                                                                      TotalTaxes = x.TaxRate * Math.Round(x.InvoiceQuantity * x.InvoiceUnitPrice, 2),
                                                                      TrackingItem = x.TrackingItem
                                                                  }).ToList();


            var itemSums = InvoiceItems.Aggregate((SubTotal: Convert.ToDecimal(0), TotalTaxes: Convert.ToDecimal(0), Total: Convert.ToDecimal(0)), (sums, item) =>
             (sums.SubTotal + item.SubTotal, sums.TotalTaxes + item.TotalTaxes, sums.Total + item.TotalTaxes));


            PrintCustomerInvoiceModel printCustomerInvoiceModel = (from a in _serverContext.LedgerMasters
                                                                   join b in _serverContext.SubsidiaryLedgerAccountNames
                                                                   on a.SubsidiaryLedgerAccountId equals b.Id
                                                                   select new
                                                                   {
                                                                       a.Id,
                                                                       b.Name,
                                                                       a.InvoiceBillingAddress,
                                                                       a.InvoiceNo,
                                                                       a.InvoiceDate,
                                                                       a.InvoiceDueDate,
                                                                       a.InvoiceTerms,
                                                                       a.InvoiceReference
                                                                   })
                                                                   .Where(x => x.Id == id)
                                                                   .Select(x => new PrintCustomerInvoiceModel
                                                                   {
                                                                       CustomerName = x.Name,
                                                                       BillingAddress = x.InvoiceBillingAddress,
                                                                       InvoiceNo = x.InvoiceNo,
                                                                       InvoiceDate = x.InvoiceDate,
                                                                       DueDate = x.InvoiceDueDate,
                                                                       Terms = x.InvoiceTerms,
                                                                       Reference = x.InvoiceReference,
                                                                       InvoiceItems = InvoiceItems,
                                                                       SubTotal = itemSums.SubTotal,
                                                                       TotalTaxes = itemSums.TotalTaxes,
                                                                       Total = itemSums.SubTotal + itemSums.TotalTaxes
                                                                   }
                                                                   ).SingleOrDefault();



            return printCustomerInvoiceModel;
        }

        public int DeleteSalesInvoice(int id)
        {
            LedgerMaster ledgerMaster = _serverContext.LedgerMasters.Find(id);
            _serverContext.LedgerMasters.Remove(ledgerMaster);
            _serverContext.SaveChanges();
            return id;
        }

        public int VoidSalesInvoice(int id)
        {
            LedgerMaster ledgerMaster = _serverContext.LedgerMasters.Find(id);
            ledgerMaster.InvoiceModifiedDate = DateTime.Now;
            ledgerMaster.Void = true;
            _serverContext.SaveChanges();

            return id;
        }

        public int Payment(CustomerInvoicePaymentModel customerInvoicePaymentModel)
        {
            int Id = 0;
            _serverContext.Database.BeginTransaction();
            var Invoice = (from a in _serverContext.LedgerMasters
                           where a.SubsidiaryLedgerAccountId == customerInvoicePaymentModel.CustomerId
                           select new { a.SubsidiaryLedgerAccountId });
            try
            {
                InvoicePayment invoice = new InvoicePayment();
                //invoice.LedgerMasterId = customerInvoicePaymentModel.LedgerMasterId;
                invoice.SubsidiaryLedgerAccountId = customerInvoicePaymentModel.CustomerId;
                invoice.InvoicePaymentAmount = customerInvoicePaymentModel.InvoiceAmount;
                invoice.ChartOfAccountId = customerInvoicePaymentModel.ChartOfAccountId;
                invoice.InvoicePaymentReferenceNo = customerInvoicePaymentModel.ReferenceNo;
                invoice.InvoicePaymentDate = customerInvoicePaymentModel.PaymentDate;
                invoice.InvoicePaymentCreatedDate = DateTime.Now;
                _serverContext.InvoicePayments.Add(invoice);
                invoice.InvoicePaymentModifiedDate = DateTime.Now;
                _serverContext.SaveChanges();
                Id = invoice.Id;
                foreach (CustomerInvoicePostPaymentItemModel item in customerInvoicePaymentModel.Items)
                {
                    InvoicePaymentDetail invoicePaymentDetail = new InvoicePaymentDetail();
                    invoicePaymentDetail.InvoicePaymentId = Id;
                    invoicePaymentDetail.LedgerMasterId = item.Id;
                    invoicePaymentDetail.InvoicePaymentDetailAmount = item.Amount;
                    _serverContext.InvoicePaymentDetails.Add(invoicePaymentDetail);
                    _serverContext.SaveChanges();
                }
                _serverContext.Database.CommitTransaction();
            }
            catch (Exception ex)
            {
                _serverContext.Database.RollbackTransaction();
            }
            return Id;
        }
        public IEnumerable<CustomerInvoicePaymentItemModel> GetInvoicePayment(int customerId)
        {

            IEnumerable<CustomerInvoicePaymentItemModel> customerInvoicePaymentItemModel = (from a in _serverContext.LedgerMasters
                                                                                            join b in _serverContext.InvoicePaymentDetails
                                                                                            on a.Id equals b.LedgerMasterId into jts
                                                                                            from jtResult in jts.DefaultIfEmpty()
                                                                                            select new { a.Id, a.InvoiceNo, a.SubsidiaryLedgerAccountId, a.InvoiceAmount, a.InvoiceDueDate })
                                                                               .Where(x => x.SubsidiaryLedgerAccountId == customerId)
                                                                               .Select(x => new CustomerInvoicePaymentItemModel
                                                                               {
                                                                                   Id = x.Id,
                                                                                   InvoiceNo = x.InvoiceNo,
                                                                                   InvoiceDueDate = x.InvoiceDueDate,
                                                                                   InvoiceAmount = (decimal)x.InvoiceAmount,
                                                                                   UnPaidBalance = (decimal)x.InvoiceAmount - (from a in _serverContext.InvoicePaymentDetails
                                                                                                                               join b in _serverContext.LedgerMasters
                                                                                                                               on a.LedgerMasterId equals b.Id
                                                                                                                               where a.LedgerMasterId == x.Id &&
                                                                                                                                     b.InvoiceNo == x.InvoiceNo
                                                                                                                               select a.InvoicePaymentDetailAmount).Sum()
                                                                               }).Distinct().ToList();
            return customerInvoicePaymentItemModel.Where(x => x.UnPaidBalance != 0);
        }

        public List<InvoiceSalesPaymentModel> GetInvoiceSalesPayment(int customerId)
        {
            List<InvoiceSalesPaymentModel> InvoiceSalesPayment = (from a in _serverContext.InvoicePaymentDetails
                                                                  join b in _serverContext.LedgerMasters
                                                                  on a.LedgerMasterId equals b.Id
                                                                  join c in _serverContext.SubsidiaryLedgerAccountNames
                                                                  on b.SubsidiaryLedgerAccountId equals c.Id
                                                                  select new { b.SubsidiaryLedgerAccountId, b.InvoiceNo, a.LedgerMasterId, a.InvoicePaymentDetailAmount })
                                                                    .Where(x => x.SubsidiaryLedgerAccountId == customerId)
                                                                    .Select(x => new InvoiceSalesPaymentModel
                                                                    {
                                                                        InvoiceNo = x.InvoiceNo,
                                                                        LedgerMasterId = x.LedgerMasterId,
                                                                        SubsidiaryLedgerId = x.SubsidiaryLedgerAccountId,
                                                                        Amount = (from a in _serverContext.InvoicePaymentDetails
                                                                                  join b in _serverContext.LedgerMasters
                                                                                  on a.LedgerMasterId equals b.Id
                                                                                  join c in _serverContext.SubsidiaryLedgerAccountNames
                                                                                  on b.SubsidiaryLedgerAccount.Id equals c.Id
                                                                                  where b.SubsidiaryLedgerAccountId == customerId &&
                                                                                        a.LedgerMasterId == x.LedgerMasterId
                                                                                  select a.InvoicePaymentDetailAmount
                                                                                  ).Sum(),
                                                                        /* Items = (from a in _serverContext.InvoicePaymentDetails
                                                                                  join b in _serverContext.InvoicePayments
                                                                                  on a.InvoicePaymentId equals b.Id
                                                                                  join c in _serverContext.LedgerMasters
                                                                                  on a.LedgerMasterId equals c.Id
                                                                                  where (c.SubsidiaryLedgerAccountId == customerId &&
                                                                                        c.Id == a.LedgerMasterId)
                                                                                  select new { c.InvoiceNo, x.InvoicePaymentDetailAmount, c.SubsidiaryLedgerAccountId }
                                                                                  )
                                                                                  .Where(x => x.SubsidiaryLedgerAccountId == customerId)
                                                                                  .Select(x => new InvoiceSalesPaymentItemModel
                                                                                  {
                                                                                      InvoiceNo = x.InvoiceNo,
                                                                                      InvoicePaymentDetailAmount = x.InvoicePaymentDetailAmount
                                                                                  }).ToList() */
                                                                    })
                                                                    .Distinct().ToList();




            return InvoiceSalesPayment;
        }

        public int DeleteInvoicePayment(int id)
        {
            try
            {
                
                IList<int> invoicePaymentListId = new List<int>();
                _serverContext.Database.BeginTransaction();
                var invoicePaymentDetails = _serverContext.InvoicePaymentDetails.Where(x => x.LedgerMasterId == id).ToList();
                foreach (InvoicePaymentDetail item in invoicePaymentDetails)
                {
                    _serverContext.InvoicePaymentDetails.Remove(_serverContext.InvoicePaymentDetails.Find(item.Id));
                    _serverContext.SaveChanges();
                    invoicePaymentListId.Add(item.InvoicePaymentId);
                }
                for (int i = 0; i < invoicePaymentListId.Count(); i++)
                {
                    var invoicePaymentDetail = _serverContext.InvoicePaymentDetails.Where(x => x.InvoicePaymentId == invoicePaymentListId[i]).ToList();
                    if (invoicePaymentDetail == null || invoicePaymentDetail.Count() == 0)
                    {
                        var invoicePayment = _serverContext.InvoicePayments.Find(invoicePaymentListId[i]);
                        if (invoicePayment != null)
                        {
                            _serverContext.InvoicePayments.Remove(_serverContext.InvoicePayments.Find(invoicePaymentListId[i]));
                            _serverContext.SaveChanges();
                        }
                    }
                }
                _serverContext.Database.CommitTransaction();
            }
            catch (Exception ex)
            {
                _serverContext.Database.RollbackTransaction();
            }
            finally 
            {
                //_serverContext.Dispose();
            }
            return 1;
        }
    }
}