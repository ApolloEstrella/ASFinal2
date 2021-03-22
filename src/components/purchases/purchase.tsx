import React, { useEffect, useState } from "react";
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
        zIndex: "0",
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
      fontSize: "13px"
    }
  })
);

const validationSchema = Yup.object().shape({
  //name: Yup.string().required("Name required"),
  //productServiceCode: Yup.string().required("Code required"),
  //description: Yup.string().required("Description required"),
  //incomeAccount: Yup.object().nullable().required("Income Account required"),
  id: Yup.number(),
  items: Yup.array().of(
    Yup.object().shape({
      id: Yup.number(),
      //salesItem: Yup.object().nullable().required("Sales Item is required"),
      //description: Yup.string().nullable().required("Enter Description"),
      //taxRateItem: Yup.object().nullable().required("Tax Rate is required"),
      //trackingItem: Yup.object().nullable().required("Tracking is required"),
      quantity: Yup.number(),       
      unitPrice: Yup.number(),
      amount: Yup.number()        
    })
  ),
});

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

    values.name ="apol"

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
        //props.closeDialog();
      })
      .catch(function (error) {
        console.log("network error");
      });
  };

  const [vendors, getVendors] = useState([]);
  const [inventories, getInventories] = useState([]);
  const [chartOfAccounts, getChartOfAccounts] = useState([]);

  const handleSelectChange = (e: any, field: string) => {
    setValue(field, e, { shouldValidate: true });
  };

  const handleChange = (e: any, field: string) => {
    //setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    //handleCostsChange();
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

  return vendors.length > 0 ? (
    <form id="inventoryForm" onSubmit={handleSubmit(onSubmit)}>
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
        <Grid item xs={12}>
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
                //style={{ width: "100%", marginTop: "3px"}}
                className={classes.smallFontSize}
                fullWidth
              />
            )}
          />
          <p className={classes.p}>{errors.name?.message}</p>
        </Grid>
        <Grid item xs={6}>
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
        <Grid item xs={6} className={classes.textField}>
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
            <Grid container justify="space-around" direction="row" key={index}>
              <Grid item xs={2}>
                <Controller
                  control={control}
                  name={`items[${index}].inventoryItem`}
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <CreatableSelect
                      name={`items[${index}].inventoryItem`}
                      onChange={(e: any) =>
                        handleSelectChange(e, `items[${index}].inventoryItem`)
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

              <Grid item xs={3}>
                <Controller
                  control={control}
                  name={`items[${index}].description`}
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <TextField
                      name={`items[${index}].description`}
                      defaultValue=""
                      label="Description"
                      //className={classes.textFieldReadOnly}
                      //multiline
                      //rows={4}
                      //rowsMax={4}
                      margin="dense"
                      variant="outlined"
                      size="small"
                      //InputLabelProps={{ shrink: true }}
                      inputRef={register()}
                      className={classes.textField}
                      style={{ paddingTop: "0px", marginTop: "0px" }}
                      //className={classes.multiLine}
                      multiline
                      //rows={3}
                      rowsMax={2}
                      fullWidth
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
                      variant="outlined"
                      //defaultValue={`${item.unitPrice}`}
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
              <Grid item xs={1}>
                <Controller
                  control={control}
                  name={`items[${index}].taxRateItem`}
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <CreatableSelect
                      name={`items[${index}].taxRateItem`}
                      onChange={(e: any) =>
                        handleSelectChange(e, `items[${index}].taxRateItem`)
                      }
                      //inputRef={register()}
                      options={chartOfAccounts}
                      className={classes.reactSelect}
                      placeholder="Tax"
                      //styles={customStyles}
                      //onCreateOption={(inputValue) => {
                      //  setDialogValueTax({ name: inputValue });
                      //  toggleOpenTax(true);
                      // }}
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
                              //defaultValue={`${item.qty}`}
                              variant="outlined"
                              placeholder=""
                              label="Sub Total"
                              className={classes.textField}
                              size="small"
                              inputProps={{ "data-id": index }}
                              inputRef={register()}
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                        <p className={classes.p}>
                          {errors?.["items"]?.[index]?.["amount"]?.["message"]}
                        </p>
                      </td>
                      <td>
                        <DeleteForeverIcon
                          style={{ marginLeft: "0px" }}
                          onClick={() => {
                            //setOpenDelete(true);
                            //deleteItemId.current = index;
                            //handleDeleteDisplayTotal(true, index)
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
          );
        })}
        <Button
          type="button"
          color="primary"
          variant="contained"
          onClick={() => {
            setItemCount(itemCount - 1);
            append(
              { id: itemCount, quantity: "", unitPrice: "", amount: "" },
              false
            );
          }}
        >
          Add Line
        </Button>
      </Grid>
      <Button
        id="submitButton"
        type="submit"
        variant="contained"
        color="primary"
        //disabled={isSubmitting}
        style={{ marginTop: "200px" }}
        //disabled="true"
      >
        Save
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
