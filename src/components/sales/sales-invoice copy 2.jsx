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

import { Formik, Form } from "formik";
import * as Yup from "yup";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

//import Select from "react-select";

import ReactSelect from "../controls/reactSelect";

import $ from "jquery";
import SubsidiaryLedgerAccounts from "../libraries/subsidiary-ledger-account";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const filter = createFilterOptions();

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: "90%",
      display: "block",
      margin: "0 auto",
    },
    textField: {
      "& > *": {
        width: "100%",
      },
      marginRight: "0",
      marginLeft: "0",
    },
    submitButton: {
      paddingTop: "25px",
    },
    title: { textAlign: "center" },
    successMessage: { color: "green" },
    errorMessage: { color: "red" },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    grid: {
      marginTop: "8px",
    },
  })
);

const SalesInvoice = () => {
  const classes = useStyles();
  const [isSubmitting, setSubmitting] = useState(false);

  const [value, setValue] = useState(null);
  const [open, toggleOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [itemCount, setItemCount] = useState(-2);

  const handleClose = () => {
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = useState({
    name: "",
  });

  const [subsidiaryLedgerAccounts, getSubsidiaryLedgerAccounts] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  const [inputList, setInputList] = useState([
    {
      id: -1,
      salesItem: "",
      description: "",
      qty: 0,
      unitPrice: 0,
      taxRate: "",
      amount: 0,
      tracking: "",
    },
  ]);
  //const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    //setOpen(true);
  };

  const handleAddClick = () => {
    setItemCount(itemCount - 1);
    setInputList([
      ...inputList,
      {
        id: itemCount,
        salesItem: "",
        description: "",
        qty: 0,
        unitPrice: 0,
        taxRate: "",
        amount: 0,
        tracking: "",
      },
    ]);
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const [addMode, setAddMode] = useState(true);
  const initialValues = {
    id: 0,
    name: "",
    billingAddress: "",
    invoiceNo: "",
    amount: ""
  };
  const [formValues, setFormValues] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [addDeletedItemId, setAddDeletedItemId] = useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // handle click event of the Remove button
  const handleDelete = () => {
    const id = deleteItemId;
    const list = [...inputList];
    //list.splice(id, 1);
    //list.filter(x => x.id !== id)

    for (var i = 0; i < list.length; i++)
      if (list[i].id === id) {
        list.splice(i, 1);
        break;
      }

    setInputList(list);
    //setAddDeletedItemId([...addDeletedItemId, {id: id}]);

    //setAddDeletedItemId((prevItems) => [
    //  ...prevItems,
    //  {
    //    id: id,
    //  },
    //]);

    setAddDeletedItemId([...addDeletedItemId, id]);

    //const newToDos = [...addDeletedItemId, { id }];
    //setAddDeletedItemId(newToDos);

    const x = JSON.stringify(addDeletedItemId);
    //console.log(x);
    //alert(JSON.stringify(addDeletedItemId));
    setOpenDelete(false);
  };

  const getDeletedItems = (items) => {
    //console.log(JSON.stringify(items, null, 2));
    console.log(JSON.stringify(items));
  };

  useEffect(() => {
    fetch("https://localhost:44302/api/SubsidiaryLedger/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        getSubsidiaryLedgerAccounts(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [count]);

  const handleSubmit = (values, resetForm) => {
    if (addMode) {
      values.id = 0;
      fetch("https://localhost:44302/api/SubsidiaryLedger/addaccount", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((data) => {
          setCount(count + 1);
          setSubmitting(false);
          resetForm();
          setFormValues(null);
        })
        .catch(function (error) {
          console.log("network error");
        })
        .finally(function () {
          setAddMode(true);
        });
    } else {
      fetch("https://localhost:44302/api/SubsidiaryLedger/EditAccount", {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((data) => {
          setCount(count + 1);
          setSubmitting(false);
          setFormValues(null);
          resetForm();
          handleClose();
        })
        .catch(function (error) {
          console.log("network error");
        })
        .finally(function () {
          setAddMode(true);
        });
    }
  };

  const handleAddAccount = (event) => {
    event.preventDefault();

    //console.log(subsidiaryLedgerAccounts.find(x => x.value === 5))

    //for (const option of document.getElementById("userPermission")) {
    //  alert(option)
    //}

    //$("#userPermission").each(function () {
    //  alert('a');
    //});

    //var myTerms = $("#userPermission");
    //alert(myTerms.length);
    //for (var i = 0; i < myTerms.length; i++) {
    //  console.log(myTerms[i]);
    //}

    //$("#userPermission").each(function () {
    //  alert('a');
    //});
    //$("#userPermission").focus((v) => v.value === 7);
    //$("#userPermission").val(7);
    //handleClose();
    //return;

    fetch("https://localhost:44302/api/SubsidiaryLedger/addaccount", {
      method: "POST",
      body: JSON.stringify({ id: 0, name: dialogValue.name }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setCount(count + 1);
        setValue({
          name: dialogValue.name,
        });
        $("#userPermission").val(5);
      })
      .catch(function (error) {
        console.log("network error");
      });

    handleClose();
  };

  const handleDeleteConfirmation = (id) => {
    setOpenDelete(true);
    setDeleteItemId(id);
  };

  /*const handleDelete = () => {
    const id = deleteItemId;
    fetch("https://localhost:44302/api/SubsidiaryLedger/deleteaccount/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setCount(count + 1);
        setSubmitting(false);
        setOpenDelete(false);
      })
      .catch(function (error) {
        console.log("network error");
      });
  };*/

  const handleEdit = (row) => {
    setFormValues(row);
    setAddMode(false);
    handleClickOpen(true);
    console.log(row);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const testSchema = Yup.object().shape({
    billingAddress: Yup.string().required("Please Enter Billing Address"),
  });

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedDueDate, setSelectedDueDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDueDateChange = (date) => {
    setSelectedDueDate(date);
  };

  return (
    <div className={classes.root}>
      {getDeletedItems(addDeletedItemId)}
      <Formik
        initialValues={formValues || initialValues}
        enableReinitialize={true}
        //resetForm={true}
        //validationSchema={testSchema}
        onSubmit={(values, { resetForm }) => {
          console.log(values);
          //alert(JSON.stringify(values));
          //console.log(JSON.stringify(values));
          //resetForm();
          //handleSubmit(values, resetForm);
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
            value,
          } = props;

          return (
            <>
              <div>
                <Form onSubmit={handleSubmit}>
                  <Grid
                    container
                    spacing={1}
                    justify="space-around"
                    direction="row"
                  >
                    <Grid item xs={12} className={classes.textField}>
                      <ReactSelect
                        label="User Permissions"
                        id="userPermission"
                        name="userPermission"
                        type="text"
                        options={subsidiaryLedgerAccounts}
                      />
                      <button onClick={() => toggleOpen(true)}>
                        new customer
                      </button>
                    </Grid>
                    <Grid item xs={12} className={classes.textField}>
                      <TextField
                        label="Billing Address"
                        name="billingAddress"
                        className={classes.textField}
                        value={values.billingAddress}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.billingAddress &&
                          touched.billingAddress &&
                          errors.billingAddress
                        }
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={2} className={classes.textField}>
                      <TextField
                        label="Invoice No"
                        name="invoiceNo"
                        className={classes.textField}
                        value={values.invoiceNo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.billingAddress &&
                          touched.billingAddress &&
                          errors.billingAddress
                        }
                        margin="normal"
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
                          id="date-picker-inline"
                          label="Date"
                          value={selectedDate}
                          onChange={handleDateChange}
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
                          id="date-picker-inline"
                          label="Due Date"
                          value={selectedDueDate}
                          onChange={handleDueDateChange}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                    <Grid item xs={1} className={classes.textField}>
                      <TextField
                        id="outlined-multiline-static"
                        label="Terms"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={5} className={classes.textField}>
                      <TextField
                        id="outlined-multiline-static"
                        label="Reference"
                      />
                    </Grid>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    {inputList.map((x, i) => {
                      return (
                        <Grid
                          container
                          spacing={1}
                          justify="space-around"
                          direction="row"
                          key={i}
                          className={classes.grid}
                        >
                          <Grid item xs={1} className={classes.textField}>
                            {x.id}
                          </Grid>
                          <Grid item xs={1} className={classes.textField}>
                            <ReactSelect
                              label="User Permissions"
                              id={"userPermission1" + x.id}
                              name={"userPermission1" + x.id}
                              type="text"
                              options={subsidiaryLedgerAccounts}
                            />
                          </Grid>
                          <Grid item xs={2} className={classes.textField}>
                            <TextField
                              label="Amount"
                              name={"billingAddress1" + x.id}
                              className={classes.textField}
                              //value={values.amount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.billingAddress &&
                                touched.billingAddress &&
                                errors.billingAddress
                              }
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={1} className={classes.textField}>
                            <TextField
                              label="Billing Address"
                              name={"billingAddress2" + x.id}
                              className={classes.textField}
                              value={values.billingAddress}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.billingAddress &&
                                touched.billingAddress &&
                                errors.billingAddress
                              }
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={2} className={classes.textField}>
                            <TextField
                              label="Billing Address"
                              name={"billingAddress3" + x.id}
                              className={classes.textField}
                              value={values.billingAddress}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.billingAddress &&
                                touched.billingAddress &&
                                errors.billingAddress
                              }
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={1} className={classes.textField}>
                            <ReactSelect
                              label="User Permissions"
                              id={"userPermission2" + x.id}
                              name={"userPermission2" + x.id}
                              type="text"
                              options={subsidiaryLedgerAccounts}
                            />
                          </Grid>
                          <Grid item xs={2} className={classes.textField}>
                            <TextField
                              label="Billing Address"
                              name={"billingAddress4" + x.id}
                              className={classes.textField}
                              value={values.billingAddress}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.billingAddress &&
                                touched.billingAddress &&
                                errors.billingAddress
                              }
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={1} className={classes.textField}>
                            <ReactSelect
                              label="User Permissions"
                              id={"userPermission3" + x.id}
                              name={"userPermission3" + x.id}
                              type="text"
                              options={subsidiaryLedgerAccounts}
                            />
                          </Grid>
                          <Grid item xs={1} className={classes.textField}>
                            <Button
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteConfirmation(x.id)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                  <br></br>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddClick()}
                  >
                    New Item
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Form>
              </div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="form-dialog-title"
                >
                  <form onSubmit={handleAddAccount}>
                    <DialogTitle id="form-dialog-title">
                      Add a new Customer
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Customer does not exists. Please, add it!
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        fullWidth
                        value={dialogValue.name}
                        onChange={(event) =>
                          setDialogValue({
                            ...dialogValue,
                            name: event.target.value,
                          })
                        }
                        label="name"
                        type="text"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        Add
                      </Button>
                    </DialogActions>
                  </form>
                </Dialog>

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
                      onClick={() => handleDelete()}
                      color="primary"
                      autoFocus
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default SalesInvoice;
