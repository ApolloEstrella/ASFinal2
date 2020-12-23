import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  useMediaQuery,
  useTheme,
  withStyles,
  IconButton,
} from "@material-ui/core";
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

import SalesInvoice from "./sales-invoice";

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

const SalesInvoiceList = () => {
  const classes = useStyles();
  const [list, setList] = useState([
    {
      invoiceDate: null,
      invoiceNo: "",
      customer: "",
    },
  ]);
  const [listCounter, setListCounter] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  
    const handleClose = () => {
        setOpenEdit(false);
    }
    
  useEffect(() => {
    fetch("https://localhost:44302/api/sales/GetAllAccounts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        setList(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [listCounter]);
  const handleEdit = (row) => {
    //setFormValues(row);
    //setAddMode(false);
    //handleClickOpen(true);
    console.log(row);
    };
    
    function getnow() {
        setOpenEdit(true);
        this.refs.child.getInvoice();
   }


  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Date</StyledTableCell>
              <StyledTableCell align="right">Invoice No.</StyledTableCell>
              <StyledTableCell align="right">Customer</StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="right">
                  {row.invoiceDate}
                </StyledTableCell>
                <StyledTableCell align="right">{row.invoiceNo}</StyledTableCell>
                <StyledTableCell align="right">{row.customer}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton onClick={() => this.refs.child.getInvoice()}>
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <SalesInvoice ref="child" />
        <Dialog
          //fullScreen={fullScreen}
          fullScreen
          open={openEdit}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              variant="contained"
              autoFocus
              onClick={() => setOpenEdit(false)}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default SalesInvoiceList;
