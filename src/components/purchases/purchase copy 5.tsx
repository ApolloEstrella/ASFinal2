import React, { useEffect, useState, useRef } from "react";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import configData from "../../config.json";
import {
  Grid,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  withStyles,
  Hidden,
} from "@material-ui/core";
import {
  useForm,
  useFieldArray,
  Controller,
  useWatch,
  useFormContext,
} from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from "date-fns/locale";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form, ErrorMessage, useFormikContext, useField } from "formik";
import NumberFormat from "react-number-format";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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
    textField: {
      "& > *": {
        width: "100%",
        height: "38px",
        paddingTop: "0px",
        zIndex: "0",
        marginTop: "10px",
        paddingBottom: "5px",
        fontSize: "13px",
      },
    },
    textField2: {
      width: "100%",
      zIndex: 0,
      fontSize: "13px",
    },
    textField3: {
      "& > *": {
        width: "100%",
        paddingTop: "0px",
        zIndex: "0",
        marginTop: "8px",
        paddingBottom: "5px",
        fontSize: "13px",
      },
    },
    textFieldReadOnly: {
      "& > *": {
        width: "100%",
        zIndex: "-999",
        fontSize: "13px",
        height: "40px",
      },
    },
    reactSelect: {
      paddingTop: "10px",
      fontSize: "13px",
      width: "100%",
      //zIndex: "5",
    },
    multiLine: {
      "& > *": {
        width: "100%",
        paddingTop: "0px",
        zIndex: "0",
        marginTop: "0px",
        paddingBottom: "5px",
        fontSize: "13px",
      },
    },
    smallFontSize: {
      fontSize: "13px",
    },
    totalAmount: {
      marginTop: "0px",
      paddingTop: "0px",
      textAlign: "left",
    },
  })
);

const validationSchema = Yup.object().shape({
  vendor: Yup.object().nullable().required("Vendor required"),
  referenceNo: Yup.string().required("Reference No required"),
  //description: Yup.string().required("Description required"),
  //incomeAccount: Yup.object().nullable().required("Income Account required"),
  id: Yup.number(),
  items: Yup.array().of(
    Yup.object().shape({
      id: Yup.number(),
      chartOfAccountItem: Yup.object()
        .nullable()
        .required("Sales Item is required"),
      //description: Yup.string().nullable().required("Description is required"),
      taxRateItem: Yup.object().nullable().required("Tax Rate is required"),
      //trackingItem: Yup.object().nullable().required("Tracking is required"),
      quantity: Yup.number()
        .nullable()
        .typeError("Quantity is required")
        .required("Quantity is required"),
      unitPrice: Yup.number()
        .nullable()
        .typeError("Unit Price is required")
        .required("Unit Price is required"),
    })
  ),
});

const validationSchemaTax = Yup.object().shape({
  description: Yup.string().required("Enter Description."),
});

let renderCount = 0;

interface Props {
  closeDialog: any;
  updateList: any;
  rowData: any;
}

export default function Purchase(props: Props) {
  const classes = useStyles();
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
    defaultValues: props.rowData === null ? {} : props.rowData,
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "items",
      keyName: "keyNameId",
    }
  );
  const [counterVendor, setCounterVendor] = useState(0);
  const [counterInventory, setCounterInventory] = useState(0);
  const [counterChartOfAccount, setCounterChartOfAccount] = useState(0);
  const [itemCount, setItemCount] = useState(-2);
  const [counterTax, setCounterTax] = useState(0);
  const [taxRates, getTaxRates] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [totalTaxes, setTotalTaxes] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const initialValues = {
    id: 0,
    name: "",
    productServiceCode: "",
    description: "",
    incomeAccount: { value: null, label: null },
    expenseAccount: { value: null, label: null },
  };

  const onSubmit = (values: any, e: any) => {
    values.date = moment.parseZone(values.date.toString()).toDate();
    values.dueDate = moment.parseZone(values.dueDate.toString()).toDate();

    var url: string;
    var method: string;

    if (props.rowData === null) {
      url = "purchase/add";
      method = "POST";
    } else {
      url = "purchase/update?Id=" + values.id;
      method = "PUT";
    }

    fetch(configData.SERVER_URL + url, {
      method: method,
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        //reset(initialValues);
        props.updateList();
        props.closeDialog();
      })
      .catch(function (error) {
        console.log("network error");
      });
  };

  interface ICost {
    id: number;
    quantity: string;
    unitPrice: string;
    inventoryItem: any;
    taxRateItem: any;
  }

  const [vendors, getVendors] = useState([]);
  const [inventories, getInventories] = useState([]);
  const [chartOfAccounts, getChartOfAccounts] = useState([]);
  const [openTax, toggleOpenTax] = useState(false);
  const [costs, setCosts] = useState<ICost[]>([]);
  const handleSelectChange = (e: any, field: string) => {
    setValue(field, e, { shouldValidate: true });
  };

  const [dialogValueTax, setDialogValueTax] = useState({
    description: "",
    rate: 0,
    tax_type: "P",
  });

  const handleChange = (e: any, field: string) => {
    setValue(field, e, { shouldValidate: true });
    //handleCostsChange();
  };
  const initialTaxValues = {
    description: dialogValueTax.description,
    rate: 0,
    tax_type: "S",
  };
  useEffect(() => {
    fetch(configData.SERVER_URL + "SubsidiaryLedger/Get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        getVendors(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterVendor]);

  useEffect(() => {
    fetch(configData.SERVER_URL + "TaxRate/get?type=P", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        //console.log(data);
        getTaxRates(data);
        //tax.current = data;
        //setBusy2(false);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterTax]);

  useEffect(() => {
    fetch(configData.SERVER_URL + "Inventory/GetSelect", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        getInventories(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterInventory]);

  useEffect(() => {
    fetch(configData.SERVER_URL + "ChartOfAccount/GetSelect", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        getChartOfAccounts(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterChartOfAccount]);

  const handleCloseTax = () => {
    toggleOpenTax(false);
  };

  function handleNewTax(values: any) {
    fetch(configData.SERVER_URL + "TaxRate/addaccount", {
      method: "POST",
      body: JSON.stringify({
        description: values.description,
        rate: values.rate,
        taxType: "P",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setCounterTax(counterTax + 1);
        handleCloseTax();
      });
  }

  const handleQtyUnitPrice = (e: any, index: number, fieldName: string) => {
    console.log(costs);
    var rate: number = 0;
    if (e.target === undefined) {
      rate = e.rate / 100;
      setValue(fieldName, e);
    } else {
      const validNumber = new RegExp(/^\d*\.?\d*$/);
      const valid: boolean = validNumber.test(e.target.value);

      if (valid === false) {
        setValue(fieldName, "");
        return;
      } else {
        setValue(fieldName, e.target.value, { shouldValidate: true });
      }
    }

    /* setValue(
      fieldName,
      e.target.value === "" || isNaN(e.target.value) 
        ? ""
        : e.target.value,
      { shouldValidate: true } 
    ); */

    //const value: number = Number(e.target.value);
    //setValue(fieldName, value, { shouldValidate: true });
    const id: number = Number(getValues(`items[${index}].id`));
    const quantity: number = Number(getValues(`items[${index}].quantity`));
    const unitPrice: number = Number(getValues(`items[${index}].unitPrice`));
    const taxRateItem: any = getValues(`items[${index}].taxRateItem`);
    const subTotal: string = (Math.round(quantity * unitPrice * 100) / 100)
      .toFixed(2)
      .toString();
    setValue(
      `items[${index}].amount`,
      Number(subTotal).toLocaleString("en", { minimumFractionDigits: 2 })
    );

    const item: ICost = {
      id: id,
      quantity: quantity.toString(),
      unitPrice: unitPrice.toString(),
      taxRateItem: taxRateItem,
      inventoryItem: null
    };

    //setCosts({ ...costs, id: id  });

    const newTodos = [...costs];
    newTodos[index] = item;
    setCosts(newTodos);

    console.log(costs);

    //const item: ICost[] = [{ id: id, quantity: quantity.toString(), unitPrice: unitPrice.toString() }]
    //const update: ICost[] = [...costs];
    // update[index]: ICost[] = item;
    // setTodos(newTodos);
    setFieldCounter(fieldCounter + 1);
    console.log("a");
  };

  const [fieldCounter, setFieldCounter] = useState(0);

  useEffect(() => {
    console.log(costs);
    var subTotal: number = 0;
    var totalTaxes: number = 0;
    // eslint-disable-next-line array-callback-return
    costs.map((item, index) => {
      if (!isNaN(Number(item.quantity)) && !isNaN(Number(item.unitPrice))) {
        const quantity: number = Number(item.quantity);
        const unitPrice: number = Number(item.unitPrice);
        var rate: number = 0;
        if (item.taxRateItem === null)
          rate = 0;
        else
          rate = Number(item.taxRateItem.rate);
        if (isNaN(rate)) rate = 0;
        subTotal = subTotal + quantity * unitPrice;
        totalTaxes = totalTaxes + (quantity * unitPrice * rate/100);
      }
    });

    setSubTotal(Number(subTotal));
    setTotalTaxes(Number(totalTaxes));
    setTotalAmount(Number(subTotal) + totalTaxes);
  }, [costs, fieldCounter]);

  const [openDelete, setOpenDelete] = useState(false);
  const deleteItemId = useRef(0);
  
  const handleUpdateTotal = () => {
    var _tempCosts: ICost[] = costs;
    _tempCosts.splice(deleteItemId.current, 1);
    setCosts(_tempCosts);
    setFieldCounter(fieldCounter + 1)
  }

  renderCount++;

  return vendors.length > 0 ? (
    <form id="inventoryForm" onSubmit={handleSubmit(onSubmit)}>
      <span className="counter">Render Count: {renderCount}</span>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="vendor"
            render={(
              { onChange, onBlur, value, name, ref },
              { invalid, isTouched, isDirty }
            ) => (
              <CreatableSelect
                name="vendor"
                onBlur={onBlur}
                onChange={(e) => handleSelectChange(e, "vendor")}
                inputRef={register()}
                options={vendors}
                //className={classes.reactSelect}
                placeholder="Please select vendor"
                style={{ zindex: 999 }}
                isClearable
                defaultValue={
                  props.rowData === null
                    ? null
                    : vendors.find(
                        (obj: any) =>
                          Number(obj["value"]) ===
                          Number(props.rowData.vendors.value)
                      )
                }
              />
            )}
          />
          <p className={classes.p}>{errors?.["vendor"]?.["message"]}</p>
        </Grid>
        <Grid item xs={8}>
          <Controller
            control={control}
            name="referenceNo"
            render={(
              { onChange, onBlur, value, name, ref },
              { invalid, isTouched, isDirty }
            ) => (
              <TextField
                name="referenceNo"
                inputRef={register()}
                label="Reference No."
                margin="normal"
                defaultValue={
                  props.rowData === null ? "" : props.rowData.referenceNo
                }
                size="small"
                style={{ width: "100%", marginTop: "3px" }}
                className={classes.smallFontSize}
                fullWidth
              />
            )}
          />
          <p className={classes.p}>{errors.referenceNo?.message}</p>
        </Grid>
        <Grid item xs={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Controller
              control={control}
              name="date"
              render={({ onChange, onBlur, value, name, ref }) => (
                <KeyboardDatePicker
                  name="date"
                  value={value}
                  format="MM/dd/yyyy"
                  inputRef={register()}
                  label="Date"
                  onBlur={onBlur}
                  onChange={onChange}
                  size="small"
                  //className={classes.textField3}
                  style={{ marginTop: "3px" }}
                  fullWidth
                />
              )}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={2} className={classes.textField}>
          <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
            <Controller
              control={control}
              name="dueDate"
              render={({ onChange, onBlur, value, name, ref }) => (
                <KeyboardDatePicker
                  name="dueDate"
                  value={value}
                  format="MM/dd/yyyy"
                  inputRef={register()}
                  label="Due Date"
                  onBlur={onBlur}
                  onChange={onChange}
                  size="small"
                  //variant="filled"
                  //value={value}
                  style={{ marginTop: "3px" }}
                  //className={classes.textField}
                  fullWidth
                />
              )}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="description"
            render={(
              { onChange, onBlur, value, name, ref },
              { invalid, isTouched, isDirty }
            ) => (
              <TextField
                name="description"
                inputRef={register()}
                label="Notes"
                margin="normal"
                variant="outlined"
                defaultValue={
                  props.rowData === null ? "" : props.rowData.description
                }
                size="small"
                className={classes.multiLine}
                multiline
                rows={3}
                rowsMax={3}
                fullWidth
              />
            )}
          />
          <p className={classes.p}>{errors.description?.message}</p>
        </Grid>
        {fields.map((item, index) => {
          return (
            <div key={item.id} style={{ width: "100%" }}>
              <Grid container justify="space-around" direction="row">
                <Grid item xs={2}>
                  <Controller
                    control={control}
                    name={`items[${index}].id`}
                    render={(
                      { onChange, onBlur, value, name, ref },
                      { invalid, isTouched, isDirty }
                    ) => (
                      <TextField
                        name={`items[${index}].id`}
                        defaultValue={`${item.id}`}
                        variant="outlined"
                        placeholder="id"
                        label="Id"
                        className={classes.visuallyHidden}
                        size="small"
                        inputProps={{ "data-id": index }}
                        inputRef={register()}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`items[${index}].keyNameId`}
                    render={(
                      { onChange, onBlur, value, name, ref },
                      { invalid, isTouched, isDirty }
                    ) => (
                      <TextField
                        name={`items[${index}].keyNameId`}
                        defaultValue={`${item.keyNameId}`}
                        variant="outlined"
                        placeholder="keyNameId"
                        label="keyNameId"
                        className={classes.visuallyHidden}
                        size="small"
                        inputProps={{ "data-id": index }}
                        inputRef={register()}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`items[${index}].inventoryItem`}
                    render={(
                      { onChange, onBlur, value, name, ref },
                      { invalid, isTouched, isDirty }
                    ) => (
                      <CreatableSelect
                        name={`items[${index}].inventoryItem`}
                        //defaultValue= {inventories.find(obj: any => Number(object.value) === costs[index].taxRateItem.value)};
                        onChange={(e: any) =>
                          handleChange(e, `items[${index}].inventoryItem`)
                        }
                        inputRef={register()}
                        options={inventories}
                        placeholder="Please select inventory item"
                        isClearable
                        className={classes.reactSelect}
                      />
                    )}
                  />
                  <p className={classes.p}>
                    {errors?.["items"]?.[index]?.["inventoryItem"]?.["message"]}
                  </p>
                </Grid>

                <Grid item xs={2}>
                  <Controller
                    control={control}
                    name={`items[${index}].chartOfAccountItem`}
                    render={(
                      { onChange, onBlur, value, name, ref },
                      { invalid, isTouched, isDirty }
                    ) => (
                      <CreatableSelect
                        name={`items[${index}].chartOfAccountItem`}
                        onChange={(e: any) =>
                          handleSelectChange(
                            e,
                            `items[${index}].chartOfAccountItem`
                          )
                        }
                        inputRef={register()}
                        options={chartOfAccounts}
                        placeholder="Please select category"
                        className={classes.reactSelect}
                      />
                    )}
                  />
                  <p className={classes.p}>
                    {
                      errors?.["items"]?.[index]?.["chartOfAccountItem"]?.[
                        "message"
                      ]
                    }
                  </p>
                </Grid>

                <Grid item xs={2}>
                  <Controller
                    control={control}
                    name={`items[${index}].description`}
                    render={(
                      { onChange, onBlur, value, name, ref },
                      { invalid, isTouched, isDirty }
                    ) => (
                      <TextField
                        name={`items[${index}].description`}
                        defaultValue={`${item.description}`}
                        label="Description"
                        style={{ paddingTop: "0px", marginTop: "0px" }}
                        className={classes.textField}
                        margin="dense"
                        variant="outlined"
                        inputRef={register()}
                        fullWidth
                        multiline
                        rows={10}
                        rowsMax={2}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={1}>
                  <Controller
                    control={control}
                    name={`items[${index}].quantity`}
                    render={(
                      { onChange, onBlur, value, name, ref },
                      { invalid, isTouched, isDirty }
                    ) => (
                      <TextField
                        name={`items[${index}].quantity`}
                        onBlur={(e: any) =>
                          handleQtyUnitPrice(
                            e,
                            index,
                            `items[${index}].quantity`
                          )
                        }
                        defaultValue={`${item.quantity}`}
                        variant="outlined"
                        placeholder="Quantity"
                        label="Quantity"
                        className={classes.textField}
                        size="small"
                        inputProps={{ "data-id": index }}
                        inputRef={register()}
                      />
                    )}
                  />
                  <p className={classes.p}>
                    {errors?.["items"]?.[index]?.["quantity"]?.["message"]}
                  </p>
                </Grid>
                <Grid item xs={1}>
                  <Controller
                    control={control}
                    name={`items[${index}].unitPrice`}
                    render={(
                      { onChange, onBlur, value, name, ref },
                      { invalid, isTouched, isDirty }
                    ) => (
                      <TextField
                        name={`items[${index}].unitPrice`}
                        onBlur={(e: any) =>
                          handleQtyUnitPrice(
                            e,
                            index,
                            `items[${index}].unitPrice`
                          )
                        }
                        variant="outlined"
                        defaultValue={`${item.unitPrice}`}
                        placeholder="Unit Price"
                        className={classes.textField}
                        size="small"
                        label="Unit Price"
                        //pattern="/^\d+\.\d{0,2}$/" //"[+-]?\d+(?:[.,]\d+)?"
                        inputRef={register()}
                      />
                    )}
                  />
                  <p className={classes.p}>
                    {errors?.["items"]?.[index]?.["unitPrice"]?.["message"]}
                  </p>
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    control={control}
                    name={`items[${index}].taxRateItem`}
                    render={(
                      { onChange, onBlur, value, name, ref },
                      { invalid, isTouched, isDirty }
                    ) => (
                      <CreatableSelect
                        name={`items[${index}].taxRateItem`}
                        //onBlur={(e: any) => {
                        //  handleChange(e, `items[${index}].taxRateItem`)
                        //  handleQtyUnitPrice(
                        //    e,
                        //    index,
                        //    `items[${index}].taxRateItem`
                        //  );
                        //}}
                        onChange={(e: any) => {
                          //handleSelectChange(e, `items[${index}].taxRateItem`);
                          handleQtyUnitPrice(
                            e,
                            index,
                            `items[${index}].taxRateItem`
                          )
                        }}
                        inputRef={register()}
                        options={taxRates}
                        placeholder="Please select tax"
                        className={classes.reactSelect}
                      />
                    )}
                  />

                  <p className={classes.p}>
                    {errors?.["items"]?.[index]?.["taxRateItem"]?.["message"]}
                  </p>
                </Grid>
                <Grid item xs={2}>
                  <table
                    width="100%"
                    cellPadding="0px"
                    cellSpacing="0px"
                    //style={{tableLayout: "fixed"}}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <Controller
                            control={control}
                            name={`items[${index}].amount`}
                            render={(
                              { onChange, onBlur, value, name, ref },
                              { invalid, isTouched, isDirty }
                            ) => (
                              <TextField
                                name={`items[${index}].amount`}
                                defaultValue={null}
                                variant="outlined"
                                placeholder=""
                                label="Sub Total"
                                className={classes.textField}
                                size="small"
                                inputProps={{
                                  "data-id": index,
                                  readOnly: true,
                                }}
                                inputRef={register()}
                                InputLabelProps={{ shrink: true }}
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
                        </td>
                        <td>
                          <DeleteForeverIcon
                            color="secondary"
                            style={{ marginLeft: "0px" }}
                            onClick={() => {
                              setOpenDelete(true);
                              deleteItemId.current = index;
                              //handleDeleteDisplayTotal(true, index)
                              //handleDeleteItem(
                              //  getValues(`items[${index}].keyNameId`)
                              //);
                              //console.log(fields);
                              //remove(index);
                              //if (fields.length >= index) {
                              //  fields.splice(index, 1);
                              //  setCosts(fields);
                              //  console.log(fields);
                              //}
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Grid>
              </Grid>
            </div>
          );
        })}
        <Button
          type="button"
          color="primary"
          variant="contained"
          onClick={() => {
            setItemCount(itemCount - 1);
            append(
              {
                id: itemCount,
                quantity: "",
                unitPrice: "",
                amount: "",
                description: "",
              },
              false
            );
            const item: ICost = {
              id: itemCount,
              quantity: "",
              unitPrice: "",
              taxRateItem: null,
              inventoryItem: null,
            };
            setCosts([...costs, item]); // adding new item in the array
          }}
        >
          Add Line
        </Button>
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
                remove(deleteItemId.current)
                handleUpdateTotal();
                setOpenDelete(false);
              }}
              color="primary"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Grid container justify="space-around" direction="row">
        <Grid item xs={9}></Grid>
        <Grid item xs={1}>
          <h1 className={classes.totalAmount}>Sub Total:</h1>
        </Grid>
        <Grid item xs={2}>
          <h1 className={classes.totalAmount}>
            <NumberFormat
              value={subTotal}
              displayType={"text"}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </h1>
        </Grid>
        <Grid item xs={9}></Grid>
        <Grid item xs={1}>
          <h1 className={classes.totalAmount}>Sales Tax:</h1>
        </Grid>
        <Grid item xs={2}>
          <h1 className={classes.totalAmount}>
            <NumberFormat
              value={totalTaxes}
              displayType={"text"}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </h1>
        </Grid>
        <Grid item xs={9}></Grid>
        <Grid item xs={1}>
          <h1 className={classes.totalAmount}>TOTAL :</h1>
        </Grid>
        <Grid item xs={2}>
          <h1 className={classes.totalAmount}>
            <NumberFormat
              value={totalAmount}
              displayType={"text"}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </h1>
        </Grid>
      </Grid>
      <Dialog
        open={openTax}
        onClose={handleCloseTax}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add new Tax Rate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tax rate does not exists. Please, add it!
          </DialogContentText>
          <Formik
            initialValues={initialTaxValues}
            onSubmit={(values, { resetForm }) => {
              handleNewTax(values);
            }}
            validationSchema={validationSchemaTax}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
              } = props;
              return (
                <Form onSubmit={handleSubmit}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    name="description"
                    fullWidth
                    value={values.description}
                    onChange={handleChange}
                    label="name"
                    type="text"
                    helperText={
                      errors.description &&
                      touched.description &&
                      errors.description
                    }
                    error={
                      errors.description === "" && touched.description === true
                    }
                  />
                  <TextField
                    id="rate"
                    label="Tax Rate"
                    name="rate"
                    type="number"
                    value={values.rate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    id="tax_type"
                    label="Tax Type"
                    name="tax_type"
                    value="P"
                    //className={classes.hide}
                  />
                  <Button type="submit" color="primary">
                    Add
                  </Button>
                  <Button onClick={handleCloseTax} color="primary">
                    Cancel
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <Button
        id="submitButton"
        type="submit"
        variant="contained"
        color="primary"
        //disabled={isSubmitting}
        style={{ marginTop: "200px" }}
        //disabled="true"
      >
        SaveSS
      </Button>
      <Button
        type="button"
        variant="contained"
        autoFocus
        onClick={() => {
          props.closeDialog();
        }}
        color="primary"
        //  style={{ marginLeft: "15px" }}
        style={{ marginTop: "200px", marginLeft: "15px" }}
      >
        Close
      </Button>
    </form>
  ) : (
    <>loading....</>
  );
}
