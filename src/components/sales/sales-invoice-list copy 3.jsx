import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
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
import $ from "jquery";
import SalesInvoiceApp from "./sales-invoice-app";

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
    hide: { display: "none" },
  })
);

const SalesInvoiceList = () => {
  const classes = useStyles();
  const [list, setList] = useState([
    {
      id: 0,
      invoiceDate: null,
      invoiceNo: "",
      customer: "",
    },
  ]);
  const [listCounter, setListCounter] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [counterTotal, setCounterTotal] = useState(0);

  const handleClose = () => {
    setOpenEdit(false);
  };

  useEffect(() => {
    fetch("https://localhost:44367/api/sales/GetAllAccounts", {
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

  return (
    <>
      <Button onClick={() => setOpenEdit(true)}>Click Me</Button>
      <Grid container justify="space-around" direction="row">
        {list.map((item, index) => {
          return (
            <div key={item.id}>
              <Grid item xs={12}>
                
              </Grid>
            </div>
          );
              
        })}
      </Grid>

      <div>
        <Dialog
          //fullScreen={fullScreen}
          //fullScreen
          maxWidth={"xl"}
          open={openEdit}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Sales Invoice</DialogTitle>
          <DialogContent>
            <div
              style={{
                overflowX: "hidden",
                overflowY: "hidden",
                height: "100%",
                width: "100%",
              }}
            >
              <div
                style={{
                  paddingRight: "17px",
                  height: "100%",
                  width: "100%",
                  boxSizing: "content-box",
                  //overflow: "scroll",
                }}
              >
                <DialogContentText></DialogContentText>
                <SalesInvoiceApp />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              variant="contained"
              autoFocus
              onClick={() => setOpenEdit(false)}
              color="primary"
            >
              Closes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default SalesInvoiceList;
