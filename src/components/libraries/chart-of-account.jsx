import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  InputLabel,
  withStyles,
  IconButton,
} from "@material-ui/core";

import MuiSelect from "@material-ui/core/Select";
import MuiMenuItem from "@material-ui/core/MenuItem";

import { Formik, Form, FormikProps } from "formik";
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
      maxWidth: "100%",
      display: "block",
      margin: "0 auto",
    },
    textField: {
      "& > *": {
        width: "100%",
      },
    },
    submitButton: {
      paddingTop: "25px",
    },
    title: { textAlign: "center" },
    successMessage: { color: "green" },
    errorMessage: { color: "red" },
  })
);

const SignUp = () => {
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const [isSubmitting, setSubmitting] = useState(false);
  const [chartofaccounttypes, getChartOfAccountTypes] = useState([
    { id: "", type: "" },
  ]);
  const [chartofaccounts, getChartOfAccounts] = useState([
    { Id: 0, type: "", Title: "", Description: "", Code: "", AccountTypeId: 0 },
  ]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [addMode, setAddMode] = useState(true);
  const initialValues = {
    id: 0,
    accountTypeId: "0",
    title: "",
    description: "",
    code: "",
  };
  const [formValues, setFormValues] = useState(null);

  const handleClose = () => {
    setAddMode(true);
     setFormValues(null);
     setOpen(false);
  };

  useEffect(() => {
    fetch("https://localhost:44302/api/chartofaccount/gettypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        getChartOfAccountTypes(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [count]);

  useEffect(() => {
    fetch("https://localhost:44302/api/chartofaccount/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        getChartOfAccounts(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [count]);

  const handleSubmit = (values, resetForm) => {
    if (addMode) {
      values.id = 0;
      fetch("https://localhost:44302/api/chartofaccount/addaccount", {
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
      fetch("https://localhost:44302/api/chartofaccount/EditAccount", {
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

  const handleDelete = (id) => {
    fetch("https://localhost:44302/api/chartofaccount/deleteaccount/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setCount(count + 1);
        setSubmitting(false);
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

  

  return ( 
    <div className={classes.root}>
      <Formik
        initialValues={formValues || initialValues}
        enableReinitialize={true}
        //resetForm={true}
        onSubmit={(values, { resetForm }) => {
          //console.log(values);
          //resetForm();
          handleSubmit(values, resetForm);          
        }}   
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            resetForm
          } = props;

          return (
            <>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {handleClickOpen(); }}
                >
                  Open form dialog
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">{addMode ? 'New Account' : 'Edit Count' }</DialogTitle>
                  <DialogContent>
                    <Form id="coaForm">
                      <Grid container justify="space-around" direction="row">
                        <Grid item xs={12}>
                          <InputLabel id="type">Type</InputLabel>
                          <MuiSelect
                            fullWidth
                            name="accountTypeId"
                            id="accountTypeId"
                            labelId="Type"
                            //defaultValue="0"
                            value={values.accountTypeId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <MuiMenuItem key={0} value={0}>
                              Please Select ...
                            </MuiMenuItem>
                            {chartofaccounttypes.map((label, key) => (
                              <MuiMenuItem key={key} value={label.id}>
                                {label.type}
                              </MuiMenuItem>
                            ))}
                          </MuiSelect>
                        </Grid>
                        <Grid item xs={12} className={classes.textField}>
                          <TextField
                            name="title"
                            id="title"
                            label="Title"
                            value={values.title}
                            type="text"
                            helperText={
                              errors.title && touched.title
                                ? errors.type
                                : "Enter Title."
                            }
                            error={errors.title && touched.title ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.textField}>
                          <TextField
                            name="description"
                            id="description"
                            label="Description"
                            value={values.description}
                            type="text"
                            helperText={
                              errors.description && touched.description
                                ? errors.description
                                : "Enter Description."
                            }
                            error={errors.description && touched.description ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.textField}>
                          <TextField
                            name="code"
                            id="code"
                            label="Code"
                            value={values.code}
                            type="text"
                            helperText={
                              errors.code && touched.code
                                ? errors.code
                                : "Enter Code."
                            }
                            error={errors.code && touched.code ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.submitButton}>
                          <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="secondary"
                            disabled={isSubmitting}
                            //onClick={handleClose}
                          >
                            Submit
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>

              <br></br>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell align="right">Title</StyledTableCell>
                      <StyledTableCell align="right">
                        Description
                      </StyledTableCell>
                      <StyledTableCell align="right">Code</StyledTableCell>
                      <StyledTableCell align="right">Id</StyledTableCell>
                      <StyledTableCell align="right">Edit</StyledTableCell>
                      <StyledTableCell align="right">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chartofaccounts.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {row.type}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.description}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.title}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.code}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon />
                          </IconButton>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default SignUp;
