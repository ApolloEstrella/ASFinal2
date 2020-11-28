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
} from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
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
        paddingTop: "5px",
        //marginTop: "2px"
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
      paddingTop: "50px",
    },

    myTable: {
      width: "500px",
    },
    submitButton: {
      marginTop: "24px",
    },
    deleteButton: {
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

  const [rows, setRow] = useState([]);

  const [rowId, setRowId] = useState(-1);

  const removeRow = (id) => {
    var result = $.grep(
      inputList,
      function (n, i) {
        return n.id !== id;
      },
      false
    );
    setInputList(result);
    console.log(result);
    setOpenDelete(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const editRow = (row) => {};
  const [loadSubsidiaryLedger, setLoadSubsidiaryLedger] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const handleDeleteConfirmation = (id) => {
    setOpenDelete(true);
    setDeleteItemId(id);
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

  const [inputList, setInputList] = useState([
    {
      id: -1,
      salesItem: { value: 0, label: "" },
      description: "",
      qty: 0,
      unitPrice: 0,
      taxRate: { value: 0, label: "" },
      amount: 0,
      tracking: { value: 0, label: "" },
    },
  ]);

  const AddItem = () => {
    setItemCount(itemCount - 1);
    setInputList([
      ...inputList,
      {
        id: itemCount,
        salesItem: { value: 0, label: "" },
        description: "",
        qty: 0,
        unitPrice: 0,
        taxRate: { value: 0, label: "" },
        amount: 0,
        tracking: { value: 0, label: "" },
      },
    ]);
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
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

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          id: -1,
          customer: "",
          billingAddress: "",
          invoiceNo: "",
          date: new Date(),
          dueDate: new Date(),
          terms: "",
          reference: "",
        }}
        onSubmit={(values, actions) => {
          for (var i = 0; i < inputList.length; i++) {
            //this["values.salesItem" + i] = values.salesItem0;

            //console.log(values.salesItem0)

            //window["salesItem" + i] = values.salesItem;
            //console.log(values.salesItem0.value)
            //console.log(window["salesItem" + i]);
            var salesItem = window["salesItem" + i];
            var taxRate = window["taxRate" + i];
            var tracking = window["tracking" + i];

            //console.log($("input").val())
            //var y = $("input").find(x);
            //console.log(x.lastChild.defaultValue);
            //console.log(x.innerText);

            var salesItemValue = salesItem.lastChild.defaultValue;
            var salesItemLabel = salesItem.innerText;

            var taxRateValue = taxRate.lastChild.defaultValue;
            var taxRateLabel = taxRate.innerText;

            var trackingValue = tracking.lastChild.defaultValue;
            var trackingLabel = tracking.innerText;

            inputList[i].salesItem.value = salesItemValue;
            //inputList[i].salesItem.label = salesItemLabel;

            inputList[i].taxRate.value = taxRateValue;
            //inputList[i].taxRate.label = taxRateLabel;

            inputList[i].tracking.value = trackingValue;
            //inputList[i].tracking.label = trackingLabel;

            //console.log(inputList[i].description)
            //const key = `values.salesItem${i}`;
            //console.log(key.value);
            //console.log(`values.salesItem${0}`);
            //console.log("si: " + (`values.salesItem${0}`).value);
          }

          const salesInvoice = {
            billingAddress: values.billingAddress,
            customer: values.customer.value,
            date: values.date,
            dueDate: values.dueDate,
            invoiceNo: values.invoiceNo,
            reference: values.reference,
            terms: values.terms,
            //items: inputList
          }

          //console.log(salesInvoice)

          
            values.id = 0;
            fetch("https://localhost:44302/api/sales/addaccount", {
              method: "POST",
              body: JSON.stringify(salesInvoice),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((results) => results.json())
              .then((data) => {
                 console.log("successful")
              })
              .catch(function (error) {
                console.log("network error");
              })
              .finally(function () {
                
              });
           

          
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
                  />
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
                    label="Invoice No."
                    values={values.invoiceNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.invoiceNo && touched.invoiceNo && errors.invoiceNo
                    }
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
                      onChange={(value) => props.setFieldValue("dueDate", value)}
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
                      errors.reference && touched.reference && errors.reference
                    }
                  />
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.textField}
                >
                  <Grid container justify="space-around" direction="row">
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
                  </Grid>

                  {inputList.map((r, i) => (
                    <Grid
                      container
                      justify="space-around"
                      direction="row"
                      key={i}
                    >
                      <Grid item xs={2}>
                        <ReactSelect
                          label="salesItem"
                          id={"salesItem" + i}
                          name={"salesItem" + i}
                          type="text"
                          options={subsidiaryLedgerAccounts}
                          value={{
                            value: r.salesItem.value,
                            label: r.salesItem.label,
                          }}
                        />
                      </Grid>
                      <Grid item xs={3} className={classes.textField}>
                        <TextField
                          id="description"
                          name="description"
                          value={r.description}
                          onChange={(e) => handleInputChange(e, i)}
                          onBlur={handleBlur}
                          helperText={
                            errors.description &&
                            touched.description &&
                            errors.description
                          }
                          className={classes.textField2}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField
                          id="qty"
                          name="qty"
                          value={r.qty}
                          type="number"
                          onChange={(e) => handleInputChange(e, i)}
                          onBlur={handleBlur}
                          helperText={errors.qty && touched.qty && errors.qty}
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField
                          id="unitPrice"
                          name="unitPrice"
                          value={r.unitPrice}
                          type="number"
                          onChange={(e) => handleInputChange(e, i)}
                          onBlur={handleBlur}
                          helperText={
                            errors.unitPrice &&
                            touched.unitPrice &&
                            errors.unitPrice
                          }
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <ReactSelect
                          label="Tax Rate"
                          id={"taxRate" + i}
                          name={"taxRate" + i}
                          type="text"
                          options={subsidiaryLedgerAccounts}
                          value={{
                            value: r.taxRate.value,
                            label: r.taxRate.label,
                          }}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField
                          id="amount"
                          name="amount"
                          value={r.qty * r.unitPrice}
                          type="number"
                          onChange={(e) => handleInputChange(e, i)}
                          onBlur={handleBlur}
                          helperText={
                            errors.amount && touched.amount && errors.amount
                          }
                          className={classes.textField}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <ReactSelect
                          label="Tracking"
                          id={"tracking" + i}
                          name={"tracking" + i}
                          type="text"
                          options={subsidiaryLedgerAccounts}
                          value={{
                            value: r.tracking.value,
                            label: r.tracking.label,
                          }}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        {r.id}
                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.deleteButton}
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteConfirmation(r.id)}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.submitButton}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={AddItem}
                    // disabled={isSubmitting}
                  >
                    Add New Row
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    // disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
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
              onClick={() => removeRow(deleteItemId)}
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
