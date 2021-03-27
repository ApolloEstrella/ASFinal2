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
import EditIcon from "@material-ui/icons/Edit";
import PurchaseApp from "../purchases/purchase-app";

interface Data {
  id: number;
  name: string;
  date: any;
  dueDate: any;
  description: string;
  referenceNo: string;
  //type: string;
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
    label: "vendor",
  },
  {
    id: "referenceNo",
    numeric: false,
    disablePadding: false,
    label: "Reference No.",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "dueDate",
    numeric: false,
    disablePadding: false,
    label: "Due Date",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
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
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
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

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Bills / Expenses
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list"></IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    fetch(configData.SERVER_URL + "inventory/delete?Id=" + deleteItemId, {
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
    <Grid container spacing={0} style={{ width: "60%" }}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          style={{ height: "39px" }}
          onClick={() => {
            setRowInfo(null);
            toggleOpen(true);
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
                      return (
                        <TableRow hover key={row.id}>
                          <TableCell
                            component="th"
                            //id={labelId}
                            scope="row"
                            padding="none"
                          ></TableCell>
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell align="left">{row.referenceNo}</TableCell>
                          <TableCell align="left">{row.date}</TableCell>
                          <TableCell align="left">{row.dueDate}</TableCell>
                          <TableCell align="left">{row.description}</TableCell>
                          <TableCell align="left">
                            <EditIcon
                              color="primary"
                              onClick={() => handleEdit(row.id)}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <DeleteForeverIcon
                              color="secondary"
                              onClick={() => showDelete(Number(row.id))}
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
        </div>
      </Grid>
      <>
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
                    closeDialog={() => { setListCounter(listCounter + 1); setOpenEdit(false) }}
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
