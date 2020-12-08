import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  useMediaQuery,
  InputLabel,
  IconButton,
  useTheme,
  FormControl,
} from "@material-ui/core";
import { Formik, Form, ErrorMessage, FieldArray, Field } from "formik";
import * as Yup from "yup";
import ReactSelect from "../controls/reactSelect";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
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
        textAlign: "center",
      },
    },
    textField2: {
      "& > *": {
        width: "100%",
        //paddingTop: ".5px",
        //marginTop: "2px"
      },
    },
    ReactSelect: {
      paddingTop: "9.5px",
      zIndex: "5",
      height:"12px"
    },
    rowLines: {
      maxWidth: "100%",
    },
    myTable: {
      width: "500px",
    },
    number: {
      paddingTop: "12px",
      textAlign: "left",
    },
    hideField: {
      display: "none",
    },
    horizontalLine: {
      marginTop: "5px",
      textAlign: "left",
    },
    submitButton: {
      marginTop: "24px",
    },
    deleteButton: {
      marginTop: "9.5px",
      marginLeft: "15px",
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

  const [trackings, getTrackings] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  const [customerValue, setCustomerValue] = useState();

  const [rows, setRow] = useState([]);

  const [rowId, setRowId] = useState(-1);

  const removeRow = (id, values) => {
    //values.items = []
    //setDeleteItem(null)
    //return
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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const editRow = (row) => {};
  const [loadSubsidiaryLedger, setLoadSubsidiaryLedger] = useState(false);

  const [loadSalesItems, setLoadSalesItems] = useState(false);
  const [loadTaxRates, setLoadTaxRates] = useState(false);
  const [loadTrackings, setLoadTrackings] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [deleteItem, setDeleteItem] = useState({ id: "", values: [] });

  const handleDeleteConfirmation = (values) => {
    setOpenDelete(true);
    //setDeleteItemId({});
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
        //console.log(data);
        getSubsidiaryLedgerAccounts(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [loadSubsidiaryLedger]);

  useEffect(() => {
    fetch("https://localhost:44302/api/IncomeItem/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        //console.log(data);
        getSalesItems(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [loadSalesItems]);

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
  }, [loadTaxRates]);

  useEffect(() => {
    fetch("https://localhost:44302/api/Tracking/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        //console.log(data);
        getTrackings(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [loadTrackings]);

  const handleItemChange = (e) => {
    // alert(e.target.value)
    // $("#" + p1).val(e.target.value);
    const value = e.target[e.target.type === "checkbox" ? "checked" : "value"];
    const name = e.target.name;

    //props.onFilter({
    //  [name]: value,
    //});
  };

  const [quantity, setQuantity] = React.useState({
    qty: 0,
  });

  const [inputList, setInputList] = useState([]);

  const AddItem = () => {
    setItemCount(itemCount - 1);
    setInputList([
      ...inputList,
      {
        id: itemCount,
        name: "",
      },
    ]);
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    //const list = [...inputList];
    //list[index][name] = value;
    //setInputList(list);
    //$("#fullName").val(
    //  $("#firstName").val() + $("#lastName").val()
    //);
  };

  const handleInputChange2 = (inputValue, actionMeta) => {
    console.group("Input Changed");
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  const [me, setNewValue] = useState({ value: 0, label: "" });

  const handleChangeMe = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    //this.setState({ value: newValue });
    setNewValue({ value: newValue.value, label: newValue.label });
  };
  const [selectedDate, setSelectedDate] = React.useState();
  const [selectedDueDate, setSelectedDueDate] = React.useState();

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
        qty: "",
        unitPrice: "",
        taxRateItem: null,
        trackingItem: null,
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    invoiceNo: Yup.string().required("Enter Invoice No."),
    customer: Yup.string().nullable().required("Enter Customer"),
    items: Yup.array().of(
      Yup.object().shape({
        salesItem: Yup.string().nullable().required("Sales Item is required"),
        taxRateItem: Yup.string().nullable().required("Tax Rate is required"),
        trackingItem: Yup.string().nullable().required("Tracking is required"),
        //description: Yup.string()
        //  .nullable()
        //  .required("Description is required"),
        qty: Yup.string().nullable().required("Quantity is required"),
        unitPrice: Yup.string().nullable().required("Unit Price is required"),
      })
    ),
  });

  const subTotal = (name) => {
    console.log(name);
    console.log($("#" + name).val());
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={initialValues}
        //validationSchema={Yup.object().shape({
        //  invoiceNo: Yup.string().required("Enter Invoice No."),
        //  customer: Yup.string().nullable().required("Enter Customer"),
        //
        //})}

        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          fetch("https://localhost:44302/api/sales/addaccount", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((results) => results.json())
            .then((data) => {
              resetForm(initialValues);
              //setLoadSubsidiaryLedger(true);
              setCustomerValue(null);

              //setCustomerValue(values.customer);

              //setInputList([]);
              console.log("successful");
            })
            .catch(function (error) {
              console.log("network error");
            })
            .finally(function () {});

          //console.log(inputList);
          //console.log({ values });
          //console.log({inputList})
          // console.log(JSON.stringify(values));
        }}
        /* validationSchema={Yup.object().shape({
          //email: Yup.string().email().required("Enter valid email-id"),
          customer: Yup.string().required("Please enter full name"),
           password: Yup.string()
            .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/
            )
            .required(
              "Please valid password. One uppercase, one lowercase, one special character and no spaces"
            ),
          confirmPassword: Yup.string()
            .required("Required")
            .test("password-match", "Password musth match", function (value) {
              return this.parent.password === value;
            }), 
        })} */
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            //handleItemChange,
            isSubmitting,
          } = props;
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
                      value={values.customer}
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
                      name="billingAddress"
                      className={classes.textField}
                      value={values.billingAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.description &&
                        touched.description &&
                        errors.description
                      }
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

                  {/*  <Grid container justify="space-around" direction="row">
                    <Grid item xs={2}>
                      Sales Item
                    </Grid>
                    <Grid item xs={3}>
                      Description
                    </Grid>
                    <Grid item xs={1}>
                      Quantity
                    </Grid>
                    <Grid item xs={1}>
                      Unit Price
                    </Grid>
                    <Grid item xs={2}>
                      Tax Rate
                    </Grid>
                    <Grid item xs={1}>
                      Amount
                    </Grid>
                    <Grid item xs={1}>
                      Tracking
                    </Grid>
                    <Grid item xs={1}></Grid>
                  </Grid> */}

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
                                      label="Customer"
                                      name={`items[${index}].salesItem`}
                                      type="text"
                                      options={salesItems}
                                      value={r.salesItem}
                                      className={classes.ReactSelect}
                                      //helperText={
                                      //  errors.customer &&
                                      //  touched.customer &&
                                      //  errors.customer
                                      //}
                                      //error={errors.customer && touched.customer}
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
                                    //className={classes.textField}
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
                                      //className={classes.textField}
                                      fullWidth
                                      margin="dense"
                                      variant="outlined"
                                      label="Description"
                                    />
                                  </Grid>
                                  <Grid item xs={1}>
                                    <TextField
                                      label="Quantity"
                                      name={`items[${index}].qty`}
                                      value={r.qty}
                                      type="number"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      helperText={
                                        errors.qty && touched.qty && errors.qty
                                      }
                                      margin="dense"
                                      variant="outlined"
                                    />
                                    <span className={classes.errorMessage}>
                                      <ErrorMessage
                                        name={`items[${index}].qty`}
                                      />
                                    </span>
                                  </Grid>
                                  <Grid item xs={1}>
                                    <TextField
                                      label="Unit Price"
                                      name={`items[${index}].unitPrice`}
                                      value={r.unitPrice}
                                      type="number"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      helperText={
                                        errors.unitPrice &&
                                        touched.unitPrice &&
                                        errors.unitPrice
                                      }
                                      margin="dense"
                                      variant="outlined"
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
                                      className={classes.ReactSelect}
                                    />
                                    <span className={classes.errorMessage}>
                                      <ErrorMessage
                                        name={`items[${index}].taxRateItem`}
                                      />
                                    </span>
                                  </Grid>
                                  <Grid item xs={1}>
                                    <TextField
                                      id="amount0"
                                      name="amount0"
                                      value={r.qty * r.unitPrice}
                                      //type="number"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      helperText={
                                        errors.amount &&
                                        touched.amount &&
                                        errors.amount
                                      }
                                      className={classes.hideField}
                                    />
                                    <div className={classes.number}>
                                      <NumberFormat
                                        value={r.qty * r.unitPrice}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        decimalScale={2}
                                      />
                                    </div>
                                  </Grid>
                                  <Grid item xs={1}>
                                    <ReactSelect
                                      label="Tracking"
                                      name={`items[${index}].trackingItem`}
                                      type="text"
                                      options={trackings}
                                      value={r.trackingItem}
                                      className={classes.ReactSelect}
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
                            <Button
                              type="button"
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                setItemCount(itemCount - 1);
                                push({
                                  id: itemCount,
                                  salesItem: "",
                                  description: "",
                                  qty: "",
                                  unitPrice: "",
                                  taxRateItem: "",
                                  trackingItem: "",
                                });
                              }}
                            >
                              Add New Row
                            </Button>
                          </>
                        )}
                      </FieldArray>
                    </Grid>
                  </Grid>

                  <Grid item xs={9} className={classes.submitButton}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      // disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Grid>

                  <Grid item xs={3} className={classes.textField}>
                    Sub Total: <label>84324</label>
                  </Grid>
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
