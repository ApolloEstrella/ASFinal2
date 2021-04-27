using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Models;
using AccountingSystem.Data.Entities;
using Microsoft.Extensions.Options;

namespace AccountingSystem.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly accounting_systemContext _serverContext;
        private readonly IOptions<AppSettingsModel> appSettings;
        private int APKey;
        private int SalesTaxKey;


        public PurchaseService(accounting_systemContext serverContext, IOptions<AppSettingsModel> app)
        {
            _serverContext = serverContext;
            appSettings = app;
            APKey = appSettings.Value.AP_KEY;
            SalesTaxKey = appSettings.Value.SALES_TAX_KEY;
        }

        public int Add(PurchaseModel purchaseModel)
        {
            int purchaseId = 0;
            int APKey = appSettings.Value.AP_KEY;
            int SalesTaxKey = appSettings.Value.SALES_TAX_KEY;
            _serverContext.Database.BeginTransaction();
            try
            {
                purchaseId = UpdatePurchase(purchaseModel, true);
                UpdateGeneralLedger(purchaseModel, purchaseId, APKey);
                _serverContext.Database.CommitTransaction();
            }
            catch (Exception ex)
            {
                _serverContext.Database.RollbackTransaction();
            }

            return purchaseId;
        }

        int UpdatePurchase(PurchaseModel purchaseModel, bool addMode)
        {
            Purchase purchase = null;
            if (addMode)
            {
                purchase = new Purchase
                {
                    SubsidiaryLedgerAccountId = purchaseModel.Vendor.Value,
                    PurchaseModeOfPayment = purchaseModel.ModeOfPayment,
                    ChartOfAccountId = purchaseModel.ModeOfPayment == "PD" ? purchaseModel.ChartOfAccounts.Value : null,
                    PurchaseReferenceNo = purchaseModel.ReferenceNo,
                    PurchaseAmount = purchaseModel.Amount,
                    PurchaseDate = purchaseModel.Date,
                    PurchaseDueDate = purchaseModel.DueDate,
                    Description = purchaseModel.Description,
                    PurchaseCreatedDate = DateTime.Now
                };
                _serverContext.Purchases.Add(purchase);
                _serverContext.SaveChanges();
            }
            else
            {
                purchase = _serverContext.Purchases.Find(purchaseModel.Id);
                purchase.SubsidiaryLedgerAccountId = purchaseModel.Vendor.Value;
                purchase.PurchaseModeOfPayment = purchaseModel.ModeOfPayment;
                purchase.ChartOfAccountId = purchaseModel.ModeOfPayment == "PD" ? purchaseModel.ChartOfAccounts.Value : null;
                purchase.PurchaseAmount = purchaseModel.Amount;
                purchase.PurchaseReferenceNo = purchaseModel.ReferenceNo;
                purchase.Description = purchaseModel.Description;
                purchase.PurchaseDate = purchaseModel.Date;
                purchase.PurchaseDueDate = purchaseModel.DueDate;
                _serverContext.SaveChanges();
            }
            if (!addMode)
            {
                foreach (var item in _serverContext.PurchaseDetails.Where(x => x.PurchaseId == purchaseModel.Id).ToList())
                {
                    PurchaseDetail purchaseDetail = new PurchaseDetail();
                    purchaseDetail = _serverContext.PurchaseDetails.Find(item.Id);
                    if (purchaseDetail != null)
                    {
                        _serverContext.PurchaseDetails.Remove(purchaseDetail);
                        _serverContext.SaveChanges();
                    }
                }
            }
            foreach (PurchaseItemModel item in purchaseModel.Items)
            {
                PurchaseDetail purchaseDetail = new PurchaseDetail();
                purchaseDetail.PurchaseId = purchase.Id;
                if (item.InventoryItem != null)
                    purchaseDetail.PurchaseInventoryId = item.InventoryItem.Value;
                purchaseDetail.ChartOfAccountId = item.ChartOfAccountItem.Value;
                purchaseDetail.PurchaseTaxRateId = item.TaxRateItem.Value;
                purchaseDetail.PurchaseDetailDescription = item.Description;
                purchaseDetail.PurchaseQuantity = item.Quantity;
                purchaseDetail.PurchaseUnitPrice = item.UnitPrice;
                _serverContext.PurchaseDetails.Add(purchaseDetail);
                _serverContext.SaveChanges();
            }

            if (!addMode)
            {
                var tempGl = _serverContext.GeneralLedgers.Where(x => x.PurchaseId == purchaseModel.Id).SingleOrDefault();
                _serverContext.GeneralLedgers.Remove(tempGl);
            }
            return purchase.Id;
        }

        void UpdateGeneralLedger(PurchaseModel purchaseModel, int purchaseId,int APKey)
        {
            GeneralLedger generalLedger = new GeneralLedger
            {
                SubsidiaryLedgerAccountId = purchaseModel.Vendor.Value,
                GeneralLedgerReferenceNo = purchaseModel.ReferenceNo,
                GeneralLedgerInvoiceNo = "",
                GeneralLedgerDate = purchaseModel.Date,
                GeneralLedgerType = "PUR",
                PurchaseId = purchaseId
            };
            _serverContext.GeneralLedgers.Add(generalLedger);
            _serverContext.SaveChanges();

           

            //var invoiceDetail = customerInvoiceModel.Items.GroupBy(x => x.SalesItem.Value).Select(g => new { Id = g.Key, Value = g.Sum(s => Convert.ToDecimal(s.Amount)) });

            foreach (PurchaseItemModel item in purchaseModel.Items)
            {
                GeneralLedgerDetail generalLedgerDetail = new GeneralLedgerDetail();
                //var temp = _serverContext.Inventories.Where(x => x.Id == item.SalesItem.Value).FirstOrDefault();
                //generalLedgerDetail.ChartOfAccountId = Convert.ToInt32(temp.InventoryProductServiceIncomeAccountId);
                generalLedgerDetail.ChartOfAccountId = item.ChartOfAccountItem.Value;
                generalLedgerDetail.GeneralLedgerDetailMode = "D";
                generalLedgerDetail.GeneralLedgerId = generalLedger.Id;
                generalLedgerDetail.GeneralLedgerDetailAmount = Convert.ToDecimal(item.Amount);
                generalLedgerDetail.GeneralLedgerDetailDescription = item.Description;
                _serverContext.GeneralLedgerDetails.Add(generalLedgerDetail);
                _serverContext.SaveChanges();
            }

            if (purchaseModel.TotalTaxes > 0)
            {
                GeneralLedgerDetail generalLedgerDetail = new GeneralLedgerDetail();
                generalLedgerDetail.ChartOfAccountId = SalesTaxKey;
                generalLedgerDetail.GeneralLedgerDetailMode = "D";
                generalLedgerDetail.GeneralLedgerId = generalLedger.Id;
                generalLedgerDetail.GeneralLedgerDetailAmount = purchaseModel.TotalTaxes;
                generalLedgerDetail.GeneralLedgerDetailDescription = "";
                _serverContext.GeneralLedgerDetails.Add(generalLedgerDetail);
                _serverContext.SaveChanges();
            }

            var APAmount = purchaseModel.Amount;
            GeneralLedgerDetail APGeneralLedgerDetail = new GeneralLedgerDetail();
            APGeneralLedgerDetail.GeneralLedgerId = generalLedger.Id;
            APGeneralLedgerDetail.GeneralLedgerDetailDescription = "";
            APGeneralLedgerDetail.ChartOfAccountId = purchaseModel.ModeOfPayment == "PY" ? APKey : (int)purchaseModel.ChartOfAccounts.Value;
            APGeneralLedgerDetail.GeneralLedgerDetailMode = "C";
            APGeneralLedgerDetail.GeneralLedgerId = generalLedger.Id;
            APGeneralLedgerDetail.GeneralLedgerDetailAmount = APAmount;
            _serverContext.GeneralLedgerDetails.Add(APGeneralLedgerDetail);
            _serverContext.SaveChanges();

             
        }
        public List<PurchaseModel> GetAll()
        {
            List<PurchaseModel> list = (from a in _serverContext.Purchases
                                        join b in _serverContext.SubsidiaryLedgerAccountNames
                                        on a.SubsidiaryLedgerAccountId equals b.Id
                                        select new
                                        {
                                            a.Id,
                                            b.Name,
                                            a.SubsidiaryLedgerAccountId,
                                            a.PurchaseReferenceNo,
                                            a.PurchaseAmount,
                                            a.PurchaseDate,
                                            a.PurchaseDueDate,
                                            a.Description
                                        }).ToList()
                                        .Select(x => new PurchaseModel
                                        {
                                            Id = x.Id,
                                            VendorId = x.SubsidiaryLedgerAccountId,
                                            Name = x.Name,
                                            Vendor = new Vendor { Value = x.SubsidiaryLedgerAccountId },
                                            Date = x.PurchaseDate,
                                            DueDate = x.PurchaseDueDate,
                                            Description = x.Description,
                                            ReferenceNo = x.PurchaseReferenceNo,
                                            Amount = x.PurchaseAmount,

                                            UnpaidBalance = (decimal)x.PurchaseAmount - (from a in _serverContext.BillPaymentDetails
                                                                                         join b in _serverContext.Purchases
                                                                                         on a.PurchaseId equals b.Id
                                                                                         where a.PurchaseId == x.Id &&
                                                                                               b.PurchaseReferenceNo == x.PurchaseReferenceNo
                                                                                         select a.BillPaymentDetailAmount).Sum()




                                        }).OrderBy(x => x.Name).ToList();

            /*  List<PurchaseModel> list = (List<PurchaseModel>)(from a in _serverContext.Purchases
                                          select new
                                          {
                                              a.Id,
                                              a.SubsidiaryLedgerAccountId,
                                              a.PurchaseReferenceNo,
                                              a.PurchaseDate,
                                              a.PurchaseDueDate,
                                              a.Description
                                          }).ToList()
                                          //.Where(x => x.Id == Id)
                                          .Select(x => new PurchaseModel
                                          {
                                              Id = x.Id,
                                              Vendor = new Vendor { Value = x.SubsidiaryLedgerAccountId },
                                              Date = x.PurchaseDate,
                                              DueDate = x.PurchaseDueDate,
                                              Description = x.Description,
                                              ReferenceNo = x.PurchaseReferenceNo,
                                              Items = (from a in _serverContext.PurchaseDetails
                                                       select new
                                                       {
                                                           Id = a.Id,
                                                           PurchaseId = a.PurchaseId,
                                                           InventoryItem = new InventoryItem { Value = a.PurchaseInventoryId },
                                                           ChartOfAccountItem = new ChartOfAccountItem { Value = a.ChartOfAccountId },
                                                           Description = a.PurchaseDetailDescription,
                                                           Quantity = a.PurchaseQuantity,
                                                           UnitPrice = a.PurchaseUnitPrice,
                                                           TaxRateItem = new PurchaseTaxRate { Value = a.PurchaseTaxRateId }
                                                       }).ToList()
                                                      .Where(x => x.PurchaseId == 18)
                                                      .Select(x => new PurchaseItemModel
                                                      {
                                                          Id = x.Id,
                                                          InventoryItem = x.InventoryItem,
                                                          ChartOfAccountItem = x.ChartOfAccountItem,
                                                          Description = x.Description,
                                                          Quantity = x.Quantity,
                                                          UnitPrice = x.UnitPrice,
                                                          TaxRateItem = x.TaxRateItem
                                                      }).ToList()
                                          }); */

            return list;
        }

        public PurchaseModel GetById(int Id)
        {
            PurchaseModel purchaseModel = (from a in _serverContext.Purchases
                                           select new
                                           {
                                               a.Id,
                                               a.SubsidiaryLedgerAccountId,
                                               a.PurchaseReferenceNo,
                                               a.PurchaseDate,
                                               a.PurchaseDueDate,
                                               a.Description,
                                               a.PurchaseModeOfPayment,
                                               a.ChartOfAccountId
                                           }).ToList()
                                        .Where(x => x.Id == Id)
                                        .Select(x => new PurchaseModel
                                        {
                                            Id = x.Id,
                                            Vendor = new Vendor { Value = x.SubsidiaryLedgerAccountId },
                                            Date = x.PurchaseDate,
                                            DueDate = x.PurchaseDueDate,
                                            Description = x.Description,
                                            ReferenceNo = x.PurchaseReferenceNo,
                                            ModeOfPayment = x.PurchaseModeOfPayment,
                                            ChartOfAccounts = new ChartOfAccounts { Value = x.ChartOfAccountId },
                                            Items = (from a in _serverContext.PurchaseDetails
                                                     join b in _serverContext.TaxRates
                                                     on a.PurchaseTaxRateId equals b.Id
                                                     select new
                                                     {
                                                         Id = a.Id,
                                                         PurchaseId = a.PurchaseId,
                                                         InventoryItem = new InventoryItem { Value = a.PurchaseInventoryId },
                                                         ChartOfAccountItem = new ChartOfAccountItem { Value = a.ChartOfAccountId },
                                                         Description = a.PurchaseDetailDescription,
                                                         Quantity = a.PurchaseQuantity,
                                                         UnitPrice = a.PurchaseUnitPrice,
                                                         TaxRateItem = new PurchaseTaxRate { Value = a.PurchaseTaxRateId, Rate = b.Rate }
                                                     }).ToList()
                                                    .Where(x => x.PurchaseId == Id)
                                                    .Select(x => new PurchaseItemModel
                                                    {
                                                        Id = x.Id,
                                                        InventoryItem = x.InventoryItem,
                                                        ChartOfAccountItem = x.ChartOfAccountItem,
                                                        Description = x.Description,
                                                        Quantity = x.Quantity,
                                                        UnitPrice = x.UnitPrice,
                                                        TaxRateItem = x.TaxRateItem,
                                                        Amount = Math.Round((x.Quantity * x.UnitPrice), 2).ToString("#,##0.00")
                                                    }).ToList()
                                        }).FirstOrDefault();

            return purchaseModel;
        }

        public List<BillPaymentItemModel> GetBillPayments(int vendorId)
        {
            List<BillPaymentItemModel> list = (from a in _serverContext.Purchases
                                               join b in _serverContext.BillPaymentDetails
                                               on a.Id equals b.PurchaseId into jts
                                               from jtResult in jts.DefaultIfEmpty()
                                               select new
                                               {
                                                   a.Id,
                                                   a.PurchaseReferenceNo,
                                                   a.PurchaseAmount,
                                                   a.PurchaseDate,
                                                   a.PurchaseDueDate,
                                                   a.SubsidiaryLedgerAccountId
                                               })
                                              .Where(x => x.SubsidiaryLedgerAccountId == vendorId)
                                              .Select(x => new BillPaymentItemModel
                                              {
                                                  Id = x.Id,
                                                  VendorId = x.SubsidiaryLedgerAccountId,
                                                  ReferenceNo = x.PurchaseReferenceNo,
                                                  Amount = x.PurchaseAmount,
                                                  Date = x.PurchaseDate,
                                                  DueDate = x.PurchaseDueDate,
                                                  UnPaidBalance = x.PurchaseAmount - (from a in _serverContext.BillPaymentDetails
                                                                                      join b in _serverContext.Purchases
                                                                                      on a.PurchaseId equals b.Id
                                                                                      where a.PurchaseId == x.Id &&
                                                                                            b.PurchaseReferenceNo == x.PurchaseReferenceNo
                                                                                      select a.BillPaymentDetailAmount).Sum()
                                              })
                                              .Distinct().ToList();

            return list.Where(x => x.UnPaidBalance != 0).ToList();
        }

        public List<BillPaymentItemModel> GetBillPaymentsByReferenceNo(int vendorId)
        {
            List<BillPaymentItemModel> list = (from a in _serverContext.Purchases
                                               join b in _serverContext.BillPaymentDetails
                                               on a.Id equals b.PurchaseId into jts
                                               from jtResult in jts.DefaultIfEmpty()
                                               select new
                                               {
                                                   a.Id,
                                                   a.PurchaseReferenceNo,
                                                   a.PurchaseAmount,
                                                   a.PurchaseDate,
                                                   a.PurchaseDueDate,
                                                   a.SubsidiaryLedgerAccountId
                                               })
                                              .Where(x => x.SubsidiaryLedgerAccountId == vendorId)
                                              .Select(x => new BillPaymentItemModel
                                              {
                                                  Id = x.Id,
                                                  VendorId = x.SubsidiaryLedgerAccountId,
                                                  ReferenceNo = x.PurchaseReferenceNo,
                                                  Amount = x.PurchaseAmount,
                                                  Date = x.PurchaseDate,
                                                  DueDate = x.PurchaseDueDate,
                                                  AmountPaid = (from a in _serverContext.BillPaymentDetails
                                                                join b in _serverContext.Purchases
                                                                on a.PurchaseId equals b.Id
                                                                where a.PurchaseId == x.Id &&
                                                                      b.PurchaseReferenceNo == x.PurchaseReferenceNo
                                                                select a.BillPaymentDetailAmount).Sum()
                                              })
                                              .Distinct().ToList();

            return list.Where(x => x.AmountPaid != 0).ToList();
        }

        public int Update(PurchaseModel purchaseModel)
        {
            int purchaseId = 0;
            _serverContext.Database.BeginTransaction();
            try
            {
                purchaseId = UpdatePurchase(purchaseModel, false);
                UpdateGeneralLedger(purchaseModel, purchaseId,APKey);
                _serverContext.Database.CommitTransaction();
            }
            catch (Exception ex)
            {
                _serverContext.Database.RollbackTransaction();
            }

            return purchaseModel.Id;
        }

        public int Delete(int Id)
        {
            Purchase purchase = _serverContext.Purchases.Find(Id);
            _serverContext.Purchases.Remove(purchase);
            _serverContext.SaveChanges();
            return Id;
        }

        public int Payment(VendorBillPaymentModel vendorBillPaymentModel)
        {
            int Id = 0;
            _serverContext.Database.BeginTransaction();
            try
            {
                BillPayment billPayment = new BillPayment();
                billPayment.SubsidiaryLedgerAccountId = vendorBillPaymentModel.VendorId;
                billPayment.BillPaymentAmount = vendorBillPaymentModel.BillAmount;
                billPayment.BillPaymentDate = vendorBillPaymentModel.PaymentDate;
                billPayment.BillPaymentCreatedDate = DateTime.Now;
                billPayment.ChartOfAccountId = vendorBillPaymentModel.ChartOfAccountId;
                _serverContext.BillPayments.Add(billPayment);
                _serverContext.SaveChanges();
                Id = billPayment.Id;
                foreach (VendorBillPostPaymentItemModel item in vendorBillPaymentModel.Items)
                {
                    BillPaymentDetail billPaymentDetail = new BillPaymentDetail();
                    billPaymentDetail.BillPaymentId = Id;
                    billPaymentDetail.BillPaymentDetailAmount = item.AmountPaid;
                    billPaymentDetail.PurchaseId = item.Id;
                    _serverContext.BillPaymentDetails.Add(billPaymentDetail);
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
        public int DeleteBillPayment(int id)
        {
            try
            {
                IList<int> billPaymentListId = new List<int>();
                _serverContext.Database.BeginTransaction();
                var billPaymentDetails = _serverContext.BillPaymentDetails.Where(x => x.PurchaseId == id).ToList();
                foreach (BillPaymentDetail item in billPaymentDetails)
                {
                    _serverContext.BillPaymentDetails.Remove(_serverContext.BillPaymentDetails.Find(item.Id));
                    _serverContext.SaveChanges();
                    billPaymentListId.Add(item.BillPaymentId);
                }
                for (int i = 0; i < billPaymentListId.Count(); i++)
                {
                    var billPaymentDetail = _serverContext.BillPaymentDetails.Where(x => x.BillPaymentId == billPaymentListId[i]).ToList();
                    if (billPaymentDetail == null || billPaymentDetail.Count() == 0)
                    {
                        var billPayment = _serverContext.BillPayments.Find(billPaymentListId[i]);
                        if (billPayment != null)
                        {

                            _serverContext.BillPayments.Remove(_serverContext.BillPayments.Find(billPaymentListId[i]));
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
            return 1;
        }
    }
}
