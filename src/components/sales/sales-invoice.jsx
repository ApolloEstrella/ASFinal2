import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Formik, Form, ErrorMessage, FieldArray, Field } from "formik";
import * as Yup from "yup";
import ReactSelect from "../controls/reactSelect";
import UploadFile from "../controls/uploadFile";
import $ from "jquery";
import DeleteIcon from "@material-ui/icons/Delete";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import NumberFormat from "react-number-format";
import "react-dropzone-uploader/dist/styles.css";
import { useDropzone } from "react-dropzone";
import { compareSync } from "bcryptjs";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import commaNumber from "comma-number";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      maxWidth: "100%",
      display: "block",
      margin: "0 auto",
    },
    textField: {
      "& > *": {
        width: "100%",
        paddingTop: "0px",
        zIndex: "0",
      },
    },
    textField2: {
      width: "100%",
    },
    textFieldReadOnly: {
      "& > *": {
        width: "100%",
        zIndex: "-999",
      },
    },
    reactSelect: {
      paddingTop: "8px",
      //zIndex: "5",
    },
    rowLines: {
      maxWidth: "100%",
    },
    myTable: {
      width: "500px",
    },
    totalAmount: {
      marginTop: "0px",
      paddingTop: "0px",
      textAlign: "left",
    },
    submitButton: {
      marginTop: "24px",
    },
    deleteButton: {
      marginTop: "9.5px",
      marginLeft: "15px",
    },
    deleteAttachmentButton: {
      marginBottom: "0px",
    },
    title: { textAlign: "center" },
    successMessage: { color: "green" },
    errorMessage: { color: "red" },
  })
);

const SalesInvoice = (props) => {
  const classes = useStyles();

  const [subsidiaryLedgerAccounts, getSubsidiaryLedgerAccounts] = useState([
    {
      Id: 0,
      name: "",
      address: "",
    },
  ]);

  const [salesItems, getSalesItems] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  const [taxRates, getTaxRates] = useState([
    {
      Id: 0,
      name: "",
      rate: 0,
    },
  ]);

  var [totalTaxes, setTotalTaxes] = useState();

  const [trackings, getTrackings] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  var [subTotal, setSubTotal] = useState(0);

  const [files, setFiles] = React.useState([]);
  const onDrop = React.useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  var fileList = files.map((file) => (
    <li key={file.path}>
      {file.path}
      {<DeleteForeverIcon onClick={()=> removeAttachment(file,files)} />}
    </li>
  ));

  const removeAttachment = (file, files) => {
    const result = $.grep(
      files,
      function (n, i) {
        return n.path !== file.path;
      },
      false
    );
    setFiles(result)
  }

  const removeRow = (id, values) => {
    const result = $.grep(
      values.items,
      function (n, i) {
        return n.id !== id;
      },
      false
    );
    values.items = result;
    setDeleteItem(result);
    setDeleteItem(null);
    setOpenDelete(false);
  };

  const handleChangeAmount = (values, value, name) => {
    var subTotal = 0;
    var totalTaxes = 0;
    var totalAmount = 0;
    var rate = 0;
    // eslint-disable-next-line array-callback-return
    values.items.map((item, index) => {
      if (name !== undefined) {
        if (name.indexOf(index) !== -1) {
          item.taxRateItem = value;
        }
      }
      rate =
        item.taxRateItem !== null
          ? taxRates.find((x) => x.value === item.taxRateItem.value)
          : null;
      var taxRate = item.taxRateItem === null ? 0 : rate.rate / 100;
      subTotal = subTotal + item.qty * item.unitPrice;
      totalTaxes = totalTaxes + subTotal * taxRate;
      totalAmount = totalAmount + subTotal + totalTaxes;
    });
    setSubTotal(Number(subTotal));
    setTotalTaxes(totalTaxes);
    setTotalAmount(Number(subTotal) + totalTaxes);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [loadSubsidiaryLedger, setLoadSubsidiaryLedger] = useState(false);
  const [loadSalesItems, setLoadSalesItems] = useState(false);
  const [loadTaxRates, setLoadTaxRates] = useState(false);
  const [loadTrackings, setLoadTrackings] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [counter, setCounter] = useState(0);
  const [counterSales, setCounterSales] = useState(0);
  const [counterTax, setCounterTax] = useState(0);
  const [counterTracking, setCounterTracking] = useState(0);

  const [deleteItem, setDeleteItem] = useState({ id: "", values: [] });

  const handleDeleteConfirmation = (values) => {
    setOpenDelete(true);
  };

  const [itemCount, setItemCount] = useState(-2);

  useEffect(() => {
    fetch("https://localhost:44302/api/SubsidiaryLedger/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        //console.log(data)
        getSubsidiaryLedgerAccounts(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counter]);

  useEffect(() => {
    fetch("https://localhost:44302/api/IncomeItem/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        getSalesItems(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterSales]);

  useEffect(() => {
    fetch("https://localhost:44302/api/TaxRate/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        //console.log(data);
        getTaxRates(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterTax]);

  useEffect(() => {
    fetch("https://localhost:44302/api/Tracking/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        getTrackings(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterTracking]);

  var [totalAmount, setTotalAmount] = useState(0);

  const [open, toggleOpen] = useState(false);
  const handleClose = () => {
    toggleOpen(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const initialValues = {
    id: -1,
    customer: null,
    billingAddress: "",
    invoiceNo: "",
    date: new Date(),
    dueDate: new Date(),
    terms: "",
    reference: "",
    items: [
      {
        id: -1,
        salesItem: null,
        description: "",
        qty: 0,
        unitPrice: 0,
        taxRateItem: null,
        trackingItem: null,
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    billingAddress: Yup.string().required("Enter Billing Address."),
    invoiceNo: Yup.string().required("Enter Invoice No."),
    customer: Yup.string().nullable().required("Enter Customer"),
    items: Yup.array().of(
      Yup.object().shape({
        salesItem: Yup.string().nullable().required("Sales Item is required"),
        taxRateItem: Yup.string().nullable().required("Tax Rate is required"),
        trackingItem: Yup.string().nullable().required("Tracking is required"),
        qty: Yup.string().nullable().required("Quantity is required"),
        unitPrice: Yup.string().nullable().required("Unit Price is required"),
      })
    ),
  });

  function addCommas(num) {
    var str = num.toString().split(".");
    if (str[0].length >= 4) {
      //add comma every 3 digits befor decimal
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
    /* Optional formating for decimal places
    if (str[1] && str[1].length >= 4) {
        //add space every 3 digits after decimal
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }*/
    return str.join(".");
  }
  return (
    <div className={classes.root}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          values.files = files;
          fetch("https://localhost:44302/api/sales/addaccount", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((results) => results.json())
            .then((data) => {
              var formData = new FormData();
              for (let i = 0; i < files.length; i++) {
                formData.append("Files", files[i]);
              }
              formData.append("id", Number(data));
              fetch("https://localhost:44302/api/sales/AddUploadedFiles", {
                method: "POST",
                body: formData,
              })
                .then((results) => results.json())
                .then((data) => {
                  resetForm(initialValues);
                  fileList = [null];
                  setFiles([]);
                  subTotal = 0;
                  totalTaxes = 0;
                  totalAmount = 0;
                  setSubTotal(0);
                  setTotalTaxes(0);
                  setTotalAmount(0);
                  console.log("successful");
                })
                .catch(function (error) {
                  console.log("network error");
                });
            })
            .catch(function (error) {
              console.log("network error");
            })
            .finally(function () {});
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            isSubmitting,
            setFieldValue,
          } = props;

          const loadBillingAddress = (id) => {
            const sL = subsidiaryLedgerAccounts.find((x) => x.value === id);
            setFieldValue("billingAddress", sL.address);
            setFieldValue(
              "billingAddress",
              sL.address === null ? "" : sL.address
            );
          };

          return (
            <>
              <Form>
                <h1 className={classes.title}>Sales Invoice</h1>
                <Grid container justify="space-around" direction="row">
                  <Grid item xs={12}>
                    <ReactSelect
                      label="Customer"
                      id="customer"
                      name="customer"
                      type="text"
                      options={subsidiaryLedgerAccounts}
                      className={classes.reactSelect}
                      value={values.customer}
                      accountType="INV"
                      refreshSL={() => setCounter(counter + 1)}
                      loadBillingAddress={(id) => loadBillingAddress(id)}
                      placeholder="Select Customer..."
                      helperText={
                        errors.customer && touched.customer && errors.customer
                      }
                      error={errors.customer && touched.customer}
                    />
                    <span className={classes.errorMessage}>
                      <ErrorMessage name="customer" />
                    </span>
                  </Grid>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={classes.textField}
                  >
                    <TextField
                      label="Billing Address"
                      id="billingAddress"
                      name="billingAddress"
                      value={values.billingAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.billingAddress &&
                        touched.billingAddress &&
                        errors.billingAddress
                      }
                      error={errors.billingAddress && touched.billingAddress}
                      margin="normal"
                      multiline
                      rows={4}
                      rowsMax={4}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={2} className={classes.textField}>
                    <TextField
                      id="invoiceNo"
                      name="invoiceNo"
                      label="invoice No"
                      value={values.invoiceNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.invoiceNo &&
                        touched.invoiceNo &&
                        errors.invoiceNo
                      }
                      error={errors.invoiceNo && touched.invoiceNo}
                    />
                  </Grid>

                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item xs={2} className={classes.textField}>
                      <KeyboardDatePicker
                        style={{ marginTop: "0px" }}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date"
                        name="date"
                        label="Date"
                        value={props.values.date}
                        onChange={(value) => props.setFieldValue("date", value)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                    <Grid item xs={2} className={classes.textField}>
                      <KeyboardDatePicker
                        style={{ marginTop: "0px" }}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="dueDate"
                        name="dueDate"
                        label="Due Date"
                        value={props.values.dueDate}
                        onChange={(value) =>
                          props.setFieldValue("dueDate", value)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <Grid item xs={1} className={classes.textField}>
                    <TextField
                      id="terms"
                      name="terms"
                      label="Terms"
                      type="number"
                      value={values.terms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={errors.terms && touched.terms && errors.terms}
                    />
                  </Grid>
                  <Grid item xs={5} className={classes.textField}>
                    <TextField
                      id="reference"
                      name="reference"
                      label="Reference"
                      value={values.reference}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.reference &&
                        touched.reference &&
                        errors.reference
                      }
                    />
                  </Grid>

                  <Grid container justify="space-around" direction="row">
                    <Grid item xs={12}>
                      <FieldArray name="items">
                        {({ push, remove, touched }) => (
                          <>
                            {values.items.map((r, index) => (
                              <div key={index}>
                                <Grid
                                  container
                                  justify="space-around"
                                  direction="row"
                                >
                                  <Grid item xs={2}>
                                    <ReactSelect
                                      label="Sales Item"
                                      name={`items[${index}].salesItem`}
                                      type="text"
                                      options={salesItems}
                                      value={r.salesItem}
                                      placeholder="Select Sales Item..."
                                      className={classes.reactSelect}
                                      accountType="SALES"
                                      refreshSales={() =>
                                        setCounterSales(counterSales + 1)
                                      }
                                    />
                                    <span className={classes.errorMessage}>
                                      <ErrorMessage
                                        name={`items[${index}].salesItem`}
                                      />
                                    </span>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    className={classes.textField}
                                  >
                                    <TextField
                                      name={`items[${index}].description`}
                                      value={r.description}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      helperText={
                                        errors.description &&
                                        touched.description &&
                                        errors.description
                                      }
                                      className={classes.textField2}
                                      margin="dense"
                                      variant="outlined"
                                      label="Description"
                                    />
                                  </Grid>
                                  <Grid item xs={1}>
                                    <TextField
                                      name={`items[${index}].qty`}
                                      value={r.qty}
                                      type="number"
                                      onChange={(e) => {
                                        handleChange(e);
                                        values.items[index].qty =
                                          e.currentTarget.value;
                                        handleChangeAmount(values);
                                      }}
                                      onBlur={handleBlur}
                                      helperText={
                                        errors.qty && touched.qty && errors.qty
                                      }
                                      className={classes.textField}
                                      margin="dense"
                                      variant="outlined"
                                      label="Quantity"
                                    />
                                    <span className={classes.errorMessage}>
                                      <ErrorMessage
                                        name={`items[${index}].qty`}
                                      />
                                    </span>
                                  </Grid>
                                  <Grid item xs={1}>
                                    <TextField
                                      name={`items[${index}].unitPrice`}
                                      value={r.unitPrice}
                                      type="number"
                                      onChange={(e) => {
                                        handleChange(e);
                                        values.items[index].unitPrice =
                                          e.currentTarget.value;
                                        handleChangeAmount(values);
                                      }}
                                      onBlur={handleBlur}
                                      helperText={
                                        errors.unitPrice &&
                                        touched.unitPrice &&
                                        errors.unitPrice
                                      }
                                      className={classes.textField}
                                      margin="dense"
                                      variant="outlined"
                                      label="Unit Price"
                                    />
                                    <span className={classes.errorMessage}>
                                      <ErrorMessage
                                        name={`items[${index}].unitPrice`}
                                      />
                                    </span>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <ReactSelect
                                      label="Tax Rate"
                                      name={`items[${index}].taxRateItem`}
                                      type="text"
                                      options={taxRates}
                                      value={r.taxRateItem}
                                      placeholder="Select Tax Rate..."
                                      className={classes.reactSelect}
                                      myValues={values}
                                      functionBake={handleChangeAmount}
                                      accountType="TAX"
                                      refreshTax={() =>
                                        setCounterTax(counterTax + 1)
                                      }
                                    />
                                    <span className={classes.errorMessage}>
                                      <ErrorMessage
                                        name={`items[${index}].taxRateItem`}
                                      />
                                    </span>
                                  </Grid>
                                  <Grid item xs={1}>
                                    <TextField
                                      name={`items[${index}].amount`}
                                      //value={r.qty * r.unitPrice}
                                      //value={(Math.round((r.qty * r.unitPrice) * 100) / 100)}
                                      value={commaNumber(
                                        Math.round(r.qty * r.unitPrice * 100) /
                                          100
                                      )}
                                      margin="dense"
                                      className={classes.textFieldReadOnly}
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                      label="Sub Total"
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Grid>
                                  <Grid item xs={1}>
                                    <ReactSelect
                                      label="Tracking"
                                      name={`items[${index}].trackingItem`}
                                      type="text"
                                      options={trackings}
                                      value={r.trackingItem}
                                      accountType="TRACKING"
                                      placeholder="Select Tracking Item..."
                                      className={classes.reactSelect}
                                      refreshTracking={() =>
                                        setCounterTracking(counterTracking + 1)
                                      }
                                    />
                                    <span className={classes.errorMessage}>
                                      <ErrorMessage
                                        name={`items[${index}].trackingItem`}
                                      />
                                    </span>
                                  </Grid>
                                  <Grid item xs={1}>
                                    {values.items.length > 1 ? (
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.deleteButton}
                                        startIcon={<DeleteIcon />}
                                        onClick={
                                          () => {
                                            setDeleteItem({
                                              id: r.id,
                                              values: values,
                                            });
                                            handleDeleteConfirmation(values);
                                          }
                                          //removeRow(r.id,values)
                                        }
                                      >
                                        Delete
                                      </Button>
                                    ) : (
                                      ""
                                    )}
                                  </Grid>
                                </Grid>
                              </div>
                            ))}
                            <br></br>
                            <Grid
                              container
                              justify="space-around"
                              direction="row"
                            >
                              <Grid item xs={9}>
                                <Button
                                  type="button"
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    setItemCount(itemCount - 1);
                                    push({
                                      id: itemCount,
                                      salesItem: null,
                                      description: "",
                                      qty: 0,
                                      unitPrice: 0,
                                      taxRateItem: null,
                                      trackingItem: null,
                                      //amount: ""
                                    });
                                    handleChangeAmount(values);
                                  }}
                                >
                                  Add New Row
                                </Button>
                              </Grid>
                              <Grid item xs={1}>
                                <h1 className={classes.totalAmount}>
                                  Sub Total:
                                </h1>
                              </Grid>
                              <Grid item xs={2}>
                                <h1 className={classes.totalAmount}>
                                  <NumberFormat
                                    value={subTotal}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                  />
                                </h1>
                              </Grid>
                              <Grid item xs={9}></Grid>
                              <Grid item xs={1}>
                                <h1 className={classes.totalAmount}>
                                  Sales Tax:
                                </h1>
                              </Grid>
                              <Grid item xs={2}>
                                <h1 className={classes.totalAmount}>
                                  <NumberFormat
                                    value={totalTaxes}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                  />
                                </h1>
                              </Grid>
                              <Grid item xs={9}></Grid>
                              <Grid item xs={1}>
                                <h1 className={classes.totalAmount}>TOTAL :</h1>
                              </Grid>
                              <Grid item xs={2}>
                                <h1 className={classes.totalAmount}>
                                  <NumberFormat
                                    value={totalAmount}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                  />
                                </h1>
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </FieldArray>
                    </Grid>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <section className="container">
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <p>
                          Drag 'n' drop some files here, or click to select
                          files
                        </p>
                      </div>
                      <aside>
                        <h4>Files</h4>
                        <ul>{fileList}</ul>
                      </aside>
                    </section>
                  </Grid>
                  <Grid
                    item
                    lg={10}
                    md={10}
                    sm={10}
                    xs={10}
                    className={classes.submitButton}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      // disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Grid>
                  <Grid
                    item
                    lg={2}
                    md={2}
                    sm={2}
                    xs={2}
                    className={classes.submitButton}
                  ></Grid>
                </Grid>
              </Form>
            </>
          );
        }}
      </Formik>
      <>
        <Dialog
          fullScreen={fullScreen}
          open={openDelete}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            DELETE CONFIRMATION
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => handleCloseDelete()}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                removeRow(deleteItem.id, deleteItem.values);
                handleChangeAmount(deleteItem.values);
              }}
              color="primary"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default SalesInvoice;
