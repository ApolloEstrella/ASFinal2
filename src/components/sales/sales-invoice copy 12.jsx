import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  memo,
  useCallback,
} from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Formik, Form, ErrorMessage, FieldArray, Field, FastField } from "formik";
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

const SalesInvoice = forwardRef((props, ref) => {
  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Child");
    },
    getInvoice() {
      getInvoice()
    }
  }));
 
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

  //const [taxRates, setTaxRates] = useState([{ value: 0, label: "", rate: 0 }]);

  const [taxRates, setTaxRates] = useState([]);

  const [counter, setCounter] = useState(0);
  const [counterSales, setCounterSales] = useState(0);
  var [counterTax, setCounterTax] = useState(0);
  const [counterTracking, setCounterTracking] = useState(0);

  var [totalTaxes, setTotalTaxes] = useState();

  const [trackings, getTrackings] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  const [addMode, setAddMode] = useState(true);

  var [subTotal, setSubTotal] = useState(0);

  const [files, setFiles] = useState([]);

const theme = useTheme();
const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

const [loadSubsidiaryLedger, setLoadSubsidiaryLedger] = useState(false);
const [loadSalesItems, setLoadSalesItems] = useState(false);
const [loadTaxRates, setLoadTaxRates] = useState(false);
const [loadTrackings, setLoadTrackings] = useState(false);

const [openDelete, setOpenDelete] = useState(false);
const [deleteItemId, setDeleteItemId] = useState(null);

const [deleteItem, setDeleteItem] = useState({ id: "", values: [] });

const handleDeleteConfirmation = (values) => {
  setOpenDelete(true);
};

const [itemCount, setItemCount] = useState(-2);

var [formValues, setFormValues] = useState(null);

var [totalAmount, setTotalAmount] = useState(0);

const [open, toggleOpen] = useState(false);
const handleClose = () => {
  toggleOpen(false);
};

const handleCloseDelete = () => {
  setOpenDelete(false);
  };
  
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  var fileList = files.map((file) => (
    <li key={file.path}>
      {file.path}
      {<DeleteForeverIcon onClick={() => removeAttachment(file, files)} />}
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
    setFiles(result);
  };

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

    function getInvoice() {
      setFormValues(null);
      setAddMode(false);
      fetch("https://localhost:44302/api/sales/getaccount/" + props.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((data) => {
          data.customer = data.customer.value;
          for (var i = 0; i < data.items.length; i++) {
            data.items[i].salesItem = data.items[i].salesItem.value;
            data.items[i].taxRateItem = data.items[i].taxRateItem.value;
            data.items[i].trackingItem = data.items[i].trackingItem.value;
          }
          setFormValues(data);
          handleChangeAmount(data);
        })
        .catch(function (error) {
          console.log("network error");
        });
  }
  
  useEffect(() => {
    fetch("https://localhost:44302/api/taxrate/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then( (data) => {
        console.log(data);
        setTaxRates(data);
        //setTaxRates(taxRates => [...taxRates, data]);
        //setTaxRates([...taxRates, ...data]);
        //setTaxRates((taxRates) => [...taxRates, ...data]);
        //setTaxRates((prev) => [...prev, ...data]);
        //setTaxRates([...taxRates, data]);
        //const tr = Object.assign({}, data);
        //setTaxRates(tr);
      })
      .catch(function (error) {
        console.log("network error");
      });
  },[]);

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

  const handleChangeAmount = (values, value, name) => {
    counterTax = counterTax + 1;
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
          ? taxRates.find(
              (x) =>
                x.value ===
                (typeof item.taxRateItem === "object"
                  ? item.taxRateItem.value
                  : item.taxRateItem)
            )
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
  return (
    <div className={classes.root}>      
      <Formik
        enableReinitialize={formValues === null ? false : true}
        initialValues={formValues === null ? initialValues : formValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm, setFieldValue }) => {
          values.files = files;
          const url =
            addMode === true
              ? "https://localhost:44302/api/sales/addaccount"
              : "https://localhost:44302/api/sales/editaccount";

          const method = addMode === true ? "POST" : "PUT";

          //if (formValues !== null && typeof values.customer === "object")
          if (!addMode && typeof values.customer !== "number")
            values.customer = values.customer.value;

          if (!addMode) { 
            for (let i = 0; i < values.items.length; i++) {
              if (typeof values.items[i].salesItem === "object") {
                values.items[i].salesItem = values.items[i].salesItem.value;
              }
              if (typeof values.items[i].taxRateItem === "object") {
                values.items[i].taxRateItem = values.items[i].taxRateItem.value;
              }
              if (typeof values.items[i].trackingItem === "object") {
                values.items[i].trackingItem =
                  values.items[i].trackingItem.value;
              }
            }
          }
          fetch(url, {
            method: method,
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((results) => results.json())
            .then((data) => {             
              setAddMode(true);
              resetForm({initialValues});
              resetForm({ values: null });
              setFormValues(null);
              //$("#invoiceNo").val(null);
              //$("#invoiceNo").trigger("focus");
              //$("#invoiceNo").val(" ");
              //$("#invoiceNo").val("");
              //$("#billingAddress").trigger("focus");
              //setFieldValue("invoiceNo","", true);
              Array.from(document.querySelectorAll("input")).forEach(
                (input) => (input.value = null)
              );
              //resetForm();
              //$("#invoiceNo").trigger("change");
              fileList = [null];
              setFiles([]);
              subTotal = 0;
              totalTaxes = 0;
              totalAmount = 0;
              setSubTotal(0);
              setTotalTaxes(0);
              setTotalAmount(0);
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
            setFieldValue("billingAddress", "");
            const sL = subsidiaryLedgerAccounts.find((x) => x.value === id);
            setFieldValue("billingAddress", sL.address);
            setFieldValue(
              "billingAddress",
              sL.address === null ? "" : sL.address
            );
          };

          const Input = memo(({ index, onChange, value }) => (
            <TextField
              value={value}
              onChange={(e) => onChange(index, e.target.value)}
            />
          ));
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
                      //label="Billing Address"
                      id="billingAddress"
                      name="billingAddress"
                      //defaultValue={values.billingAddress}
                      value={values.billingAddress}
                      onChange={handleChange}
                      label="Billing Address"
                      placeholder="Billing Address"
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} className={classes.textField}>
                    <TextField
                      id="invoiceNo"
                      name="invoiceNo"
                      label="Invoice No"
                      defaultValue={values.invoiceNo}
                      //value={values.invoiceNo}
                      //onChange={handleChange}
                      onBlur={handleChange}
                      autoFocus={true}
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
                      defaultValue={values.terms}
                      //value={values.terms}
                      //onChange={handleChange}
                      onBlur={handleChange}
                      helperText={errors.terms && touched.terms && errors.terms}
                    />
                  </Grid>
                  <Grid item xs={5} className={classes.textField}>
                    <TextField
                      id="reference"
                      name="reference"
                      label="Reference"
                      defaultValue={values.reference}
                      //value={values.reference}
                      //onChange={handleChange}
                      onBlur={handleChange}
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
                                      //value={r.description}
                                      //onChange={handleChange}
                                      defaultValue={r.description}
                                      onBlur={handleChange}
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
                                      defaultValue={r.qty}
                                      //value={r.qty}
                                      type="number"
                                      //onChange={(e) => {
                                      //  handleChange(e);
                                      //  values.items[index].qty =
                                      //    e.currentTarget.value;
                                      //  handleChangeAmount(values);
                                      //}}
                                      onBlur={(e) => {
                                        handleChange(e);
                                        values.items[index].qty =
                                          e.currentTarget.value;
                                        handleChangeAmount(values);
                                      }}
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
                                      defaultValue={r.unitPrice}
                                      //value={r.unitPrice}
                                      type="number"
                                      //onChange={(e) => {
                                      //  handleChange(e);
                                      //  values.items[index].unitPrice =
                                      //    e.currentTarget.value;
                                      //  handleChangeAmount(values);
                                      //}}
                                      onBlur={(e) => {
                                        handleChange(e);
                                        values.items[index].unitPrice =
                                          e.currentTarget.value;
                                        handleChangeAmount(values);
                                      }}
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
                                      //className={classes.textFieldReadOnly}
                                      //className={classes.textField}
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
});



export default memo(SalesInvoice);
