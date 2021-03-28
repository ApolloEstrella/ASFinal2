import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";

import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Grid,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import configData from "../../config.json";
import { Controller, useForm } from "react-hook-form";
import Radio from "@material-ui/core/Radio";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Inventory from "../libraries/inventory";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PhonelinkEraseIcon from "@material-ui/icons/PhonelinkErase";
import EditIcon from "@material-ui/icons/Edit";
import PurchaseApp from "../purchases/purchase-app";
import Purchase from "../purchases/purchase"
import { format } from "date-fns";
import PaymentIcon from "@material-ui/icons/Payment";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme: Theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

interface Data {
  id: number;
  name: string;
  amount: string;
  unpaidBalance: string;
  date: any;
  dueDate: any;
  description: string;
  referenceNo: string;
  void: string;
  edit: string;
  delete: string;
  voidIcon: string;
  paymentIcon: string;
  cancelPaymentIcon: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Vendor",
  },
  {
    id: "referenceNo",
    numeric: true,
    disablePadding: false,
    label: "Reference No.",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Amount",
  },
  {
    id: "unpaidBalance",
    numeric: true,
    disablePadding: false,
    label: "Unpaid Balance",
  },
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "dueDate",
    numeric: true,
    disablePadding: false,
    label: "Due Date",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
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
  {
    id: "paymentIcon",
    numeric: true,
    disablePadding: false,
    label: "",
  },
  {
    id: "cancelPaymentIcon",
    numeric: true,
    disablePadding: false,
    label: "",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{ background: "#DFE7F6", color: "#189AB4" }}>
      <TableRow>
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

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return null;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      padding: theme.spacing(0),
      textAlign: "left",
      color: theme.palette.text.secondary,
      width: "100%",
      margin: "auto",
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
    p: {
      marginTop: "0px",
      color: "#bf1650",
      marginBottom: "0px",
    },
  })
);

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name required"),
  productServiceCode: Yup.string().required("Code required"),
  description: Yup.string().required("Description required"),
});

export default function EnhancedTable() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [listCounter, setListCounter] = useState(0);
  useEffect(() => {
    fetch(configData.SERVER_URL + "purchase/GetAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setRows(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [listCounter]);
  //const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("name");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, toggleOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const purchaseId: any = useRef(0);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n["name"]);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const {
    register,
    control,
    handleSubmit,
    errors,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    //mode: "onChange",
    //defaultValues: preloadedValues === null ? {} : preloadedValues,
    resolver: yupResolver(validationSchema),
  });

  const [rowInfo, setRowInfo] = useState(null);

  const handleEdit = (id: any) => {
    purchaseId.current = id;
    setOpenEdit(true);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(0);

  const showDelete = (id: number) => {
    setDeleteItemId(id);
    setOpenDelete(true);
  };

  const handleDelete = () => {
    fetch(configData.SERVER_URL + "purchase/delete?Id=" + deleteItemId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setListCounter(listCounter + 1);
        setOpenDelete(false);
      })
      .catch(function (error) {
        console.log("network error");
      });
  };

  

  return (
    <Grid container spacing={0} style={{ width: "80%" }}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          style={{ height: "39px" }}
          onClick={() => {
            //setRowInfo(null);
            //toggleOpen(true);
            setOpenAdd(true)
          }}
        >
          New Bill / Expense
        </Button>
        <div className={classes.root}>
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
                       const labelId: string = `enhanced-table-checkbox-${index}`; 

                      return (
                        <StyledTableRow hover key={row.id}>
                          <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            style={{ wordBreak: "break-word" }}
                          >
                            {" "}
                            {row.name}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row.referenceNo}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                             
                          </StyledTableCell>
                          <StyledTableCell align="right">
                             
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {format(new Date(row.date), "MM/dd/yyyy")}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {format(new Date(row.dueDate), "MM/dd/yyyy")}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.description}
                          </StyledTableCell>
                          <StyledTableCell align="right"></StyledTableCell>
                          <StyledTableCell align="right">
                            <EditIcon
                              color="primary"
                              onClick={() => handleEdit(row.id)}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <DeleteForeverIcon
                              color="secondary"
                              onClick={() => showDelete(Number(row.id))}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <PhonelinkEraseIcon
                              color="secondary"
                              //onClick={() => handleVoid(row.id)}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <PaymentIcon
                              color="primary"
                              //onClick={() =>
                              // handleInvoicePayment(
                              //   row.customerId,
                              //   row.customer,
                              //    row.id
                              //  )
                              //}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <DeleteSweepIcon
                              color="primary"
                              //onClick={() =>
                              //  handleInvoicePaymentDetail(
                              //    row.customerId,
                              //    row.customer,
                              //    row.id
                              //  )
                              //}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
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
        </div>
      </Grid>
      <>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          //maxWidth={"xl"}
          //fullWidth
          open={openAdd}
          aria-labelledby="responsive-dialog-title"
          maxWidth={false}
        >
          <div style={{ width: 1400 }}>
            <DialogTitle id="responsive-dialog-title">
              {"Create Bill/Expense"}
            </DialogTitle>
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
                  <Purchase
                    //id={purchaseId.current}
                    rowData= {null}
                    closeDialog={() => {
                      setListCounter(listCounter + 1);
                      setOpenAdd(false);
                    }}
                    //updateList={() => {
                    // setListCounter(listCounter + 1);
                    //}}
                  />
                </div>
              </div>
            </DialogContent>
          </div>
          <DialogActions></DialogActions>
        </Dialog>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          //maxWidth={"xl"}
          //fullWidth
          open={openEdit}
          aria-labelledby="responsive-dialog-title"
          maxWidth={false}
        >
          <div style={{ width: 1400 }}>
            <DialogTitle id="responsive-dialog-title">
              {"Edit Bill/Expense"}
            </DialogTitle>
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
                  <PurchaseApp
                    id={purchaseId.current}
                    closeDialog={() => {
                      setListCounter(listCounter + 1);
                      setOpenEdit(false);
                    }}
                    //updateList={() => {
                    // setListCounter(listCounter + 1);
                    //}}
                  />
                </div>
              </div>
            </DialogContent>
          </div>
          <DialogActions></DialogActions>
        </Dialog>

        <Dialog
          //fullScreen={fullScreen}
          open={openDelete}
          //onClose={handleClose}
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
              onClick={() => setOpenDelete(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDelete();
              }}
              color="primary"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </Grid>
  );
}
