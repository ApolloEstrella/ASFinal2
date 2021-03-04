import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  TextField,
  Button,
  createStyles,
  useMediaQuery,
  useTheme,
  withStyles,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import SalesInvoiceApp from "./sales-invoice-app";
import SalesInvoice from "./sales-invoice";
import configData from "../../config.json";

import { format } from "date-fns";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import PhonelinkEraseIcon from "@material-ui/icons/PhonelinkErase";

const columns = [
  { id: "customer", label: "Customer", minWidth: 170 },
  { id: "invoiceNo", label: "Invoice No", minWidth: 100 },
  { id: "invoiceDate", label: "Invoice Date", minWidth: 100 },
  { id: "void", label: "Status", minWidth: 100 },
  { id: "edit", label: "", minWidth: 100 },
  { id: "delete", label: "", minWidth: 100 },
  { id: "voidIcon", label: "", minWidth: 100 },
  //{ id: "delete", label: "", minWidth: 100 },
  /*{
    id: "population",
    label: "Population",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Size\u00a0(km\u00b2)",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "Density",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  }, */
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 900,
  },
});

export default function StickyHeadTable(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [list, setList] = useState([]);
  const [listCounter, setListCounter] = useState(0);
  const [customerListCounter, setCustomerListCounter] = useState(0);
  const [invoiceListCounter, setInvoiceListCounter] = useState(0);
  const [rows, setRows] = useState([]);
  const invoiceId = useRef(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [openAdd, setAdd] = useState(false);
  const [openEdit, setEdit] = useState(false);

  const setOpenEdit = (isEdit) => {
    setEdit(isEdit);
    setListCounter(listCounter + 1);
  };

  const handleAddClose = () => {
    setListCounter(listCounter + 1);
    setAdd(false);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleEdit = (id) => {
    invoiceId.current = id;
    setOpenEdit(true);
  };

  const [searchValue, setSearchValue] = React.useState("customer");
  const [searchText, setSearchText] = React.useState("");

  const handleChangeSearchValue = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    setSearchText(document.getElementById("searchBox").value);
    if (searchValue === "customer") {
      setCustomerListCounter(customerListCounter + 1);
    } else {
      setInvoiceListCounter(invoiceListCounter + 1);
    }
  };

  const handleDelete = (id) => {
    invoiceId.current = id;
    setOpenDelete(true);
  };

  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteInvoice = () => {
    fetch(
      configData.SERVER_URL +
        "sales/DeleteSalesInvoice?id=" +
        invoiceId.current,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        setListCounter(listCounter + 1);
      })
      .catch(function (error) {
        console.log("network error");
      });
  };

  const handleVoid = (id) => {
    invoiceId.current = id;
    setOpenVoid(true);
  };

  const [openVoid, setOpenVoid] = useState(false);

  const handleVoidInvoice = () => {
    fetch(
      configData.SERVER_URL + "sales/VoidSalesInvoice?id=" + invoiceId.current,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        setListCounter(listCounter + 1);
      })
      .catch(function (error) {
        console.log("network error");
      });
  };

  useEffect(() => {
    fetch(configData.SERVER_URL + "sales/GetAllAccounts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        setRows(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [listCounter]);

  /*const urlCustomer =
    searchText === ""
      ? "sales/GetAllAccounts"
      : "sales/GetAllAccountsByCustomerName?customerName=" + searchText; */

  useEffect(() => {
    if (searchValue !== "customer" || searchText === "") return setRows([]);
    fetch(
      configData.SERVER_URL +
        "sales/GetAllAccountsByCustomerName?customerName=" +
        searchText,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        setRows(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [customerListCounter, searchText, searchValue]);

  /* const urlInvoice =
  searchText === ""
    ? "sales/GetAllAccounts"
    : "sales/GetAllAccountsByInvoiceNo?invoiceNo=" + searchText; */
  useEffect(() => {
    if (searchValue !== "invoiceNo" || searchText === "") return setRows([]);
    fetch(
      configData.SERVER_URL +
        "sales/GetAllAccountsByInvoiceNo?invoiceNo=" +
        searchText,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        setRows(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [invoiceListCounter, searchText, searchValue]);

  return (
    <>
      <Grid container justify="space-around" direction="row" spacing={0}>
        <Grid item xs={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setAdd(true);
            }}
          >
            Create Invoice
          </Button>
        </Grid>
        <Grid item xs={6}>
          <FormControl component="fieldset" style={{ paddingLeft: "510px" }}>
            <RadioGroup
              aria-label="gender"
              name="searchValue"
              value={searchValue}
              onChange={handleChangeSearchValue}
              row={true}
            >
              <FormControlLabel
                value={"customer"}
                control={<Radio />}
                label="Customer"
              />
              <FormControlLabel
                value="invoiceNo"
                control={<Radio />}
                label="Invoice No."
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Search"
            id="searchBox"
            name="searchBox"
            defaultValue=""
            variant="filled"
            size="small"
            style={{ width: "100%", marginLeft: "90px" }}
            //onBlur={handleSearch}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginLeft: "100px", marginTop: "10px" }}
            onClick={() => handleSearch()}
          >
            Go
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginLeft: "52px", marginTop: "10px" }}
            onClick={() => setListCounter(listCounter + 1)}
          >
            Reset
          </Button>
        </Grid>
      </Grid>

      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "edit" ? (
                              <>
                                {" "}
                                <EditIcon
                                  onClick={() => handleEdit(row.id)}
                                  style={{ paddingRight: "60px" }}
                                />{" "}
                              </>
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : column.id === "invoiceDate" ? (
                              format(new Date(value), "MM/dd/yyyy")
                            ) : column.id === "void" ? (
                              value === true ? (
                                "Void"
                              ) : (
                                value
                              )
                            ) : column.id === "delete" ? (
                              <DeleteForeverIcon
                                onClick={() => handleDelete(row.id)}
                              />
                            ) : column.id === "voidIcon" ? (
                              <PhonelinkEraseIcon
                                onClick={() => handleVoid(row.id)}
                              />
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth={"xl"}
          open={openEdit}
          onClose={handleEditClose}
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
                <SalesInvoiceApp id={invoiceId} setOpenEdit={setOpenEdit} />
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
              Close123
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          //fullScreen={fullScreen}
          //fullScreen
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth={"xl"}
          open={openAdd}
          onClose={() => handleAddClose()}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Create Invoice</DialogTitle>
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
                <SalesInvoice preloadedValues={null} />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              variant="contained"
              autoFocus
              onClick={() => handleAddClose()}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            DELETE CONFIRMATION
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this permanently?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => setOpenDelete(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteInvoice();
                setOpenDelete(false);
              }}
              color="primary"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openVoid}
          onClose={() => setOpenVoid(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            VOID CONFIRMATION
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to void this invoice?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => setOpenVoid(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleVoidInvoice();
                setOpenVoid(false);
              }}
              color="primary"
              autoFocus
            >
              Void
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
