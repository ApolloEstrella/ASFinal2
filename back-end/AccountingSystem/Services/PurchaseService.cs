using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccountingSystem.Services.Interfaces;
using AccountingSystem.Models;
using AccountingSystem.Data.Entities;

namespace AccountingSystem.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly accounting_systemContext _serverContext;

        public PurchaseService(accounting_systemContext serverContext)
        {
            _serverContext = serverContext;
        }

        public int Add(PurchaseModel purchaseModel)
        {
            int Id = 0;
            _serverContext.Database.BeginTransaction();
            try
            {
                Purchase purchase = new Purchase
                {
                    SubsidiaryLedgerAccountId = purchaseModel.Vendor.Value,
                    PurchaseReferenceNo = purchaseModel.ReferenceNo,
                    PurchaseDate = purchaseModel.Date,
                    PurchaseDueDate = purchaseModel.DueDate,
                    Description = purchaseModel.Description,
                    PurchaseCreatedDate = DateTime.Now
                };
                _serverContext.Purchases.Add(purchase);
                _serverContext.SaveChanges();


                foreach (PurchaseItemModel item in purchaseModel.Items)
                {
                    PurchaseDetail purchaseDetail = new PurchaseDetail();
                    purchaseDetail.PurchaseId = purchase.Id;
                    if (item.InventoryItem != null)
                        purchaseDetail.PurchaseInventoryId = item.InventoryItem.Value;
                    purchaseDetail.ChartOfAccountId = item.ChartOfAccountItem.Value;
                    purchaseDetail.PurchaseDetailDescription = item.Description;
                    purchaseDetail.PurchaseQuantity = item.Quantity;
                    purchaseDetail.PurchaseUnitPrice = item.UnitPrice;
                    purchaseDetail.PurchaseTaxRateId = item.TaxRateItem.Value;
                    _serverContext.PurchaseDetails.Add(purchaseDetail);
                    _serverContext.SaveChanges();
                }
                _serverContext.Database.CommitTransaction();
                Id = purchase.Id;
            }
            catch (Exception ex)
            {
                _serverContext.Database.RollbackTransaction();
            }

            return Id;
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
                                            a.PurchaseDate,
                                            a.PurchaseDueDate,
                                            a.Description
                                        }).ToList()
                                        .Select(x => new PurchaseModel
                                        {
                                            Id = x.Id,
                                            Name = x.Name,
                                            Vendor = new Vendor { Value = x.SubsidiaryLedgerAccountId },
                                            Date = x.PurchaseDate,
                                            DueDate = x.PurchaseDueDate,
                                            Description = x.Description,
                                            ReferenceNo = x.PurchaseReferenceNo
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
                                               a.Description
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
    }
}
