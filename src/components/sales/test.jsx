import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PhonelinkEraseIcon from "@material-ui/icons/PhonelinkErase";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Grid,
  TextField,
  Button,
  createStyles,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";

import { format } from "date-fns";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";

import SalesInvoiceApp from "./sales-invoice-app";
import SalesInvoice from "./sales-invoice";

import configData from "../../config.json";
/*
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0),
]; */

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "customer",
    label: "Customer",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "invoiceNo",
    numeric: true,
    disablePadding: false,
    label: "Invoice No",
  },
  {
    id: "invoiceAmount",
    numeric: true,
    disablePadding: false,
    label: "Amount",
  },
  {
    id: "unPaidBalance",
    numeric: true,
    disablePadding: false,
    label: "Unpaid Balance",
  },
  {
    id: "invoiceDate",
    numeric: true,
    disablePadding: false,
    label: "Invoice Date",
  },
  {
    id: "void",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "edit",
    numeric: true,
    disablePadding: false,
    label: "",
  },
  {
    id: "delete",
    numeric: true,
    disablePadding: false,
    label: "",
  },
  {
    id: "voidIcon",
    numeric: true,
    disablePadding: false,
    label: "",
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox" style>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
  </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return null;
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [rows, setRows] = useState([]);
  const [listCounter, setListCounter] = useState(0);
  const [customerListCounter, setCustomerListCounter] = useState(0);
  const [invoiceListCounter, setInvoiceListCounter] = useState(0);
  const invoiceId = useRef(0);

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
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
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow key={row.name}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {" "}
                        {row.customer}
                      </TableCell>
                      <TableCell align="right">{row.invoiceNo}</TableCell>
                      <TableCell align="right">{row.invoiceAmount}</TableCell>
                      <TableCell align="right">{row.unPaidBalance}</TableCell>
                      <TableCell align="right">
                        {format(new Date(row.invoiceDate), "MM/dd/yyyy")}
                      </TableCell>
                      <TableCell align="right">{row.void}</TableCell>
                      <TableCell align="right">
                        {" "}
                        <EditIcon onClick={() => handleEdit(row.id)} />{" "}
                      </TableCell>
                      <TableCell align="right">
                        <DeleteForeverIcon
                          onClick={() => handleDelete(row.id)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <PhonelinkEraseIcon
                          onClick={() => handleVoid(row.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
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
    </div>
  );
}
