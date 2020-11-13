import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  withStyles,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

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
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const filter = createFilterOptions();

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: "70%",
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
  })
);

const SalesInvoice = () => {
  const classes = useStyles();
  const [isSubmitting, setSubmitting] = useState(false);

  const [value, setValue] = useState(null);
  const [open, toggleOpen] = useState(false);
  const [count, setCount] = useState(0);

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

  //const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    //setOpen(true);
  };

  const handleAddClick = () => {
    setInputList([...inputList, { firstName: "", lastName: "" }]);
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const [addMode, setAddMode] = useState(true);
  const initialValues = {
    id: 0,
    name: "",
  };
  const [formValues, setFormValues] = useState(null);

  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteItemId, setDeleteItemId] = React.useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handleDelete = () => {
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
  };

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
    name: Yup.string().required("Please Enter Name"),
  });

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedDueDate, setSelectedDueDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDueDateChange = (date) => {
    setSelectedDueDate(date);
  };

  const [inputList, setInputList] = useState([
    [
      {
        salesItem: "",
        description: "",
        qty: 0,
        unitPrice: 0,
        taxRate: "",
        amount: 0,
        tracking: "",
      },
    ],
  ]);

  return (
    <div className={classes.root}>
      <Formik
        initialValues={formValues || initialValues}
        enableReinitialize={true}
        //resetForm={true}
        validationSchema={testSchema}
        onSubmit={(values, { resetForm }) => {
          //console.log(values);
          //resetForm();
          handleSubmit(values, resetForm);
        }}
      >
        {(props) => {
          const { values, touched, errors, handleBlur, handleChange } = props;

          return (
            <>
              <div>
                <Form id="salesInvoiceForm">
                  <Grid
                    container
                    spacing={1}
                    justify="space-around"
                    direction="row"
                  >
                    <Grid item xs={12} className={classes.textField}>
                      <Autocomplete
                        value={value}
                        onChange={(event, newValue) => {
                          if (typeof newValue === "string") {
                            // timeout to avoid instant validation of the dialog's form.
                            setTimeout(() => {
                              toggleOpen(true);
                              setDialogValue({
                                name: newValue,
                              });
                            });
                          } else if (newValue && newValue.inputValue) {
                            toggleOpen(true);
                            setDialogValue({
                              name: newValue.inputValue,
                            });
                          } else {
                            setValue(newValue);
                          }
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);

                          if (params.inputValue !== "") {
                            filtered.push({
                              inputValue: params.inputValue,
                              name: `Add "${params.inputValue}"`,
                            });
                          }

                          return filtered;
                        }}
                        id="free-solo-dialog-demo"
                        options={subsidiaryLedgerAccounts}
                        getOptionLabel={(option) => {
                          // e.g value selected with enter, right from the input
                          if (typeof option === "string") {
                            return option;
                          }
                          if (option.inputValue) {
                            return option.inputValue;
                          }
                          return option.name;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderOption={(option) => option.name}
                        style={{ width: "100%" }}
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search Customer"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.textField}>
                      <TextField
                        id="outlined-multiline-static"
                        label="Billing Address"
                        multiline
                        rows={4}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={2} className={classes.textField}>
                      <TextField
                        id="outlined-multiline-static"
                        label="Invoice No."
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
                        <>
                          <Grid item xs={2} className={classes.textField}>
                            <Autocomplete
                              name="salesItem"
                              value={value}
                              onChange={(event, newValue) => {
                                if (typeof newValue === "string") {
                                  // timeout to avoid instant validation of the dialog's form.
                                  setTimeout(() => {
                                    toggleOpen(true);
                                    setDialogValue({
                                      name: newValue,
                                    });
                                  });
                                } else if (newValue && newValue.inputValue) {
                                  toggleOpen(true);
                                  setDialogValue({
                                    name: newValue.inputValue,
                                  });
                                } else {
                                  setValue(newValue);
                                }
                              }}
                              filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== "") {
                                  filtered.push({
                                    inputValue: params.inputValue,
                                    name: `Add "${params.inputValue}"`,
                                  });
                                }

                                return filtered;
                              }}
                              id="free-solo-dialog-demo"
                              options={subsidiaryLedgerAccounts}
                              getOptionLabel={(option) => {
                                // e.g value selected with enter, right from the input
                                if (typeof option === "string") {
                                  return option;
                                }
                                if (option.inputValue) {
                                  return option.inputValue;
                                }
                                return option.name;
                              }}
                              selectOnFocus
                              clearOnBlur
                              handleHomeEndKeys
                              renderOption={(option) => option.name}
                              style={{ width: "100%" }}
                              freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Search Sales Item"
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={2} className={classes.textField}>
                            <TextField
                              name="description"
                              id="outlined-multiline-static"
                              label="Description"
                              variant="outlined"
                              size="small"
                              inputStyle={{ fontSize: "5px" }}
                            />
                          </Grid>
                          <Grid item xs={1} className={classes.textField}>
                            <TextField
                              name="Qty"
                              id="outlined-multiline-static"
                              label="Qty"
                              type="number"
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={2} className={classes.textField}>
                            <TextField
                              name="unitPrice"
                              id="outlined-multiline-static"
                              label="Unit Price"
                              type="number"
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={1} className={classes.textField}>
                            <Autocomplete
                              name="taxRate"
                              value={value}
                              size="small"
                              onChange={(event, newValue) => {
                                if (typeof newValue === "string") {
                                  // timeout to avoid instant validation of the dialog's form.
                                  setTimeout(() => {
                                    toggleOpen(true);
                                    setDialogValue({
                                      name: newValue,
                                    });
                                  });
                                } else if (newValue && newValue.inputValue) {
                                  toggleOpen(true);
                                  setDialogValue({
                                    name: newValue.inputValue,
                                  });
                                } else {
                                  setValue(newValue);
                                }
                              }}
                              filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== "") {
                                  filtered.push({
                                    inputValue: params.inputValue,
                                    name: `Add "${params.inputValue}"`,
                                  });
                                }

                                return filtered;
                              }}
                              id="free-solo-dialog-demo"
                              options={subsidiaryLedgerAccounts}
                              getOptionLabel={(option) => {
                                // e.g value selected with enter, right from the input
                                if (typeof option === "string") {
                                  return option;
                                }
                                if (option.inputValue) {
                                  return option.inputValue;
                                }
                                return option.name;
                              }}
                              selectOnFocus
                              clearOnBlur
                              handleHomeEndKeys
                              renderOption={(option) => option.name}
                              style={{ width: "100%" }}
                              freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Tax Rate"
                                  variant="outlined"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={2} className={classes.textField}>
                            <TextField
                              name="amount"
                              id="outlined-multiline-static"
                              label="Amount"
                              type="number"
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={1} className={classes.textField}>
                            <Autocomplete
                              name="tracking"
                              value={value}
                              size="small"
                              onChange={(event, newValue) => {
                                if (typeof newValue === "string") {
                                  // timeout to avoid instant validation of the dialog's form.
                                  setTimeout(() => {
                                    toggleOpen(true);
                                    setDialogValue({
                                      name: newValue,
                                    });
                                  });
                                } else if (newValue && newValue.inputValue) {
                                  toggleOpen(true);
                                  setDialogValue({
                                    name: newValue.inputValue,
                                  });
                                } else {
                                  setValue(newValue);
                                }
                              }}
                              filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== "") {
                                  filtered.push({
                                    inputValue: params.inputValue,
                                    name: `Add "${params.inputValue}"`,
                                  });
                                }

                                return filtered;
                              }}
                              id="free-solo-dialog-demo"
                              options={subsidiaryLedgerAccounts}
                              getOptionLabel={(option) => {
                                // e.g value selected with enter, right from the input
                                if (typeof option === "string") {
                                  return option;
                                }
                                if (option.inputValue) {
                                  return option.inputValue;
                                }
                                return option.name;
                              }}
                              selectOnFocus
                              clearOnBlur
                              handleHomeEndKeys
                              renderOption={(option) => option.name}
                              style={{ width: "100%" }}
                              freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Tracking"
                                  variant="outlined"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={1} className={classes.textField}>
                            <Button
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteConfirmation()}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </>
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
