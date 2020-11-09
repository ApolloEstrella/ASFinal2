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

const SubsidiaryLedgerAccounts = () => {
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const [isSubmitting, setSubmitting] = useState(false);
   
  const [subsidiaryLedgerAccounts, getSubsidiaryLedgerAccounts] = useState([
    {
      Id: 0,
      type: "",
      Title: "",
      Description: "",
      Code: "",
      AccountTypeId: "",
    },
  ]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [addMode, setAddMode] = useState(true);
  const initialValues = {
    id: 0,
    name: "" 
  };
  const [formValues, setFormValues] = useState(null);
  const handleClose = () => {
    setAddMode(true);
    setFormValues(null);
    setOpen(false);
  };
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
    name: Yup.string().required("Please Enter Name") 
  });

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
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
          } = props;

          return (
            <>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    handleClickOpen();
                  }}
                >
                  New
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">
                    {addMode ? "New Account" : "Edit Account"}
                  </DialogTitle>
                  <DialogContent>
                    <Form id="coaForm">
                      <Grid container justify="space-around" direction="row">
                        <Grid item xs={12} className={classes.textField}>
                          <TextField
                            name="name"
                            id="name"
                            label="Name"
                            value={values.name}
                            type="text"
                            helperText={
                              errors.name && touched.name
                                ? errors.name
                                : "Enter Name."
                            }
                            error={errors.name && touched.name ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            inputProps={{ maxLength: 100 }}
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.submitButton}>
                          <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="secondary"
                            disabled={isSubmitting}
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

              <div>
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

              <br></br>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell align="right">id</StyledTableCell>
                      <StyledTableCell align="right">Edit</StyledTableCell>
                      <StyledTableCell align="right">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subsidiaryLedgerAccounts.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {row.name}
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
                          <IconButton
                            onClick={() => handleDeleteConfirmation(row.id)}
                          >
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

export default SubsidiaryLedgerAccounts;
