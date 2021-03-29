import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {
  useForm,
  useFieldArray,
  Controller,
  useWatch,
  useFormContext,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten } from "@material-ui/core/styles";
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
import CreatableSelect from "react-select/creatable";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import configData from "../../config.json";
import moment from "moment";
import { format } from "date-fns";

interface Data {
  id: number;
  referenceNo: string;
  dueDate: any;
  unpaidBalance: string;
  BillAmount: string;
  balance: string;
  payment: string;
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
    id: "referenceNo",
    numeric: false,
    disablePadding: true,
    label: "Reference No",
  },
  { id: "dueDate", numeric: false, disablePadding: false, label: "Due Date" },
  {
    id: "BillAmount",
    numeric: true,
    disablePadding: false,
    label: "Bill Amount",
  },
  { id: "balance", numeric: true, disablePadding: false, label: "Balance" },
  { id: "payment", numeric: true, disablePadding: false, label: "Payment" },
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
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
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
  textField: {
    "& > *": {
      width: "100%",
      paddingTop: "0px",
      zIndex: "0",
      marginTop: "0px",
      paddingBottom: "5px",
      fontSize: "13px",
    },
  },
}));

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
        ></Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

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
  p: {
    marginTop: "0px",
    color: "#bf1650",
    marginBottom: "0px",
  },
}));

export default function BillsPayment(props: any) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState("customer");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

 /* const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n["referenceNo"]);
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
  }; */

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 20));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleChange = (e: any, field: any) => {
    setValue(field, e, { shouldValidate: true });
  };

  //const isSelected = (name: any) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const [salesItems, getSalesItems] = useState([]);
  const [counterSales, setCounterSales] = useState(0);
  const [counterList, setCounterList] = useState(0);

  const validationSchema = Yup.object().shape({
    billAmount: Yup.number()
      .nullable()
      .typeError("Received Amount is required")
      .required("Received  Amount is required"),
    chartOfAccountId: Yup.object().nullable().required("Bank is required"),
    referenceNo: Yup.string().nullable().required("Enter reference no"),
    items: Yup.array().of(
      Yup.object().shape({
        id: Yup.number(),
        amount: Yup.number()
          .nullable()
          .typeError("Amount is required")
          .required("Amount is required"),
      })
    ),
  });

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

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "items",
      keyName: "keyNameId",
    }
  );

 /* const handleNumeric = (event, fieldName) => {
    setValue(
      fieldName,
      event.target.value === "" || isNaN(event.target.value)
        ? ""
        : event.target.value,
      { shouldValidate: true }
    );
  }; */

  useEffect(() => {
    fetch(configData.SERVER_URL + "ChartOfAccount/GetSelect", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        getSalesItems(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterSales]);

  useEffect(() => {
    fetch(
      configData.SERVER_URL +
        "Purchase/GetBillPayments?vendorId=" +
        props.vendorId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((results) => results.json())
      .then((data) => {
        setRows(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [props.vendorId, counterList]);

  const onSubmit = (values: any) => {
    values.ledgerMasterId = props.ledgerMasterId;
    //values.customerId = props.customerId;
    values.chartOfAccountId = values.chartOfAccountId.value;
    values.paymentDate = moment
      .parseZone(values.paymentDate.toString())
      .toDate();
    console.log("data", values);
    fetch(configData.SERVER_URL + "sales/CustomerInvoicePayment", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        setCounterList(counterList + 1);
        props.parentMethod();
      })
      .catch(function (error) {
        console.log("network error");
      });
  };

const handleNumeric = (event: any, fieldName: any) => {
  setValue(
    fieldName,
    event.target.value === "" || isNaN(event.target.value)
      ? ""
      : event.target.value,
    { shouldValidate: true }
  );
};
    
  return (
    <form id="billsPaymentForm" onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.root}>
        <Grid container justify="space-around" direction="row">
          <Grid item xs={6}>
            <Controller
              control={control}
              name="ledgerMasterId"
              render={(
                { onChange, onBlur, value, name, ref },
                { invalid, isTouched, isDirty }
              ) => (
                <TextField
                  name="ledgerMasterId"
                  value={props.ledgerMasterId}
                  className={classes.visuallyHidden}
                />
              )}
            />
            <Controller
              control={control}
              name="billAmount"
              render={(
                { onChange, onBlur, value, name, ref },
                { invalid, isTouched, isDirty }
              ) => (
                <TextField
                  name="billAmount"
                  onChange={(e) => handleNumeric(e, "billAmount")}
                  //defaultValue={0}
                  inputRef={register()}
                  label="Amount Paid"
                  fullWidth
                />
              )}
            />
            <p className={classes.p}>{errors.billAmount?.message}</p>
          </Grid>

          <Grid
            item
            xs={6}
            //className={classes.textField}
            //styles={{ zIndex: "9999" }}
          >
            <Controller
              control={control}
              name="chartOfAccountId"
              render={(
                { onChange, onBlur, value, name, ref },
                { invalid, isTouched, isDirty }
              ) => (
                <CreatableSelect
                  name="chartOfAccountId"
                  onBlur={onBlur}
                  onChange={(e) => handleChange(e, "chartOfAccountId")}
                  // defaultValue=""
                  inputRef={register()}
                  options={salesItems}
                  //className={classes.reactSelect}
                  style={{
                    paddingTop: "8px",
                    fontSize: "13px",
                    width: "100%",
                    zIndex: "5",
                  }}
                  placeholder="Please select cash or bank account"
                />
              )}
            />
            <p className={classes.p}>{errors.chartOfAccountId?.message}</p>
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="vendor"
              render={(
                { onChange, onBlur, value, name, ref },
                { invalid, isTouched, isDirty }
              ) => (
                <TextField
                  name="vendor"
                  inputRef={register()}
                  label="Vendor"
                  defaultValue={props.vendorName}
                  fullWidth
                  disabled={true}
                />
              )}
            />
            <TextField
              name="vendorId"
              inputRef={register()}
              label="Vendor"
              defaultValue={props.vendorId}
              fullWidth
              disabled={true}
              className={classes.visuallyHidden}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="referenceNo"
              render={(
                { onChange, onBlur, value, name, ref },
                { invalid, isTouched, isDirty }
              ) => (
                <TextField
                  name="referenceNo"
                  defaultValue=""
                  inputRef={register()}
                  label="Reference No."
                  style={{ width: "100%" }}
                />
              )}
            />
            <p className={classes.p}>{errors.referenceNo?.message}</p>
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                control={control}
                name="paymentDate"
                render={({ onChange, onBlur, value, name, ref }) => (
                  <KeyboardDatePicker
                    name="paymentDate"
                    value={value}
                    format="MM/dd/yyyy"
                    inputRef={register()}
                    label="Payment Date"
                    onBlur={onBlur}
                    onChange={onChange}
                    size="small"
                    //variant="filled"
                    //value={value}
                    style={{ marginTop: "3px" }}
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Paper className={classes.paper}>
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
                onSelectAllClick={() => {}} //{handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    //const isItemSelected = isSelected(row.invoiceNo);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        //onClick={(event) => handleClick(event, row.invoiceNo)}
                        role="checkbox"
                        //aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.invoiceNo}
                        //selected={isItemSelected}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.billReferenceNo}
                        </TableCell>
                        <TableCell align="left">
                          {format(new Date(row.billDueDate), "MM/dd/yyyy")}
                        </TableCell>
                        <TableCell align="right">{row.billAmount}</TableCell>
                        <TableCell align="right">
                          {row.billUnPaidBalance}
                        </TableCell>
                        <TableCell align="right">
                          <Controller
                            control={control}
                            name={`items[${index}].amount`}
                            render={(
                              { onChange, onBlur, value, name, ref },
                              { invalid, isTouched, isDirty }
                            ) => (
                              <TextField
                                name={`items[${index}].amount`}
                                defaultValue={0}
                                label="Amount"
                                onChange={(e) =>
                                  handleNumeric(e, `items[${index}].amount`)
                                }
                                //className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                inputRef={register()}
                                fullWidth
                                //style={{ zIndex: "0" }}
                              />
                            )}
                          />
                          <p className={classes.p}>
                            {
                              errors?.["items"]?.[index]?.["amount"]?.[
                                "message"
                              ]
                            }
                          </p>
                          <TextField
                            name={`items[${index}].id`}
                            defaultValue={row.id}
                            inputRef={register()}
                            className={classes.visuallyHidden}
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginRight: "20px" }}
        >
          Saved and Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={props.parentMethod}
        >
          Close
        </Button>
      </div>
    </form>
  );
}
