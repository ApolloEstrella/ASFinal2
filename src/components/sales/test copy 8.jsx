import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ReactSelect from "../controls/reactSelect";
import UploadFile from "../controls/uploadFile";
import $ from "jquery";
import DeleteIcon from "@material-ui/icons/Delete";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import NumberFormat from "react-number-format";
import "react-dropzone-uploader/dist/styles.css";
import { useDropzone } from "react-dropzone";
import { compareSync } from "bcryptjs";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import commaNumber from "comma-number";
import CreatableSelect from "react-select/creatable";

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
        paddingTop: "0px",
        zIndex: "0",
        marginTop: "0px",
      },
    },
    textField2: {
      width: "100%",
      zIndex: "0",
    },
    textFieldReadOnly: {
      "& > *": {
        width: "100%",
        zIndex: "-999",
      },
    },
    reactSelect: {
      paddingTop: "8px",
      //zIndex: "5",
    },
    rowLines: {
      maxWidth: "100%",
    },
    myTable: {
      width: "500px",
    },
    totalAmount: {
      marginTop: "0px",
      paddingTop: "0px",
      textAlign: "left",
    },
    submitButton: {
      marginTop: "24px",
    },
    deleteButton: {
      marginTop: "9.5px",
      marginLeft: "15px",
    },
    deleteAttachmentButton: {
      marginBottom: "0px",
    },
    title: { textAlign: "center" },
    successMessage: { color: "green" },
    errorMessage: { color: "red" },
    p: {
      marginTop: "0px",
      color: "#bf1650",
      marginBottom: "0px",
    },
    controller: {
      marginTop: "0px",
    },
    billingAddress: {
      marginTop: "15px",
    },
  })
);

const validationSchema = Yup.object().shape({
  billingAddress: Yup.string().required("Enter Billing Address."),
  invoiceNo: Yup.string().required("Enter Invoice No."),
  customer: Yup.object().nullable().required("Enter Customer"),
  items: Yup.array().of(
    Yup.object().shape({
      salesItem: Yup.object().nullable().required("Sales Item is required"),
      description: Yup.string().required("Enter Description"),
      taxRateItem: Yup.object().nullable().required("Tax Rate is required"),
      trackingItem: Yup.object().nullable().required("Tracking is required"),
      qty: Yup.string().nullable().required("Quantity is required"),
      unitPrice: Yup.string().nullable().required("Unit Price is required"),
    })
  ),
});

const initialValues = {
  id: -1,
  customer: null,
  billingAddress: "",
  invoiceNo: "",
  date: new Date(),
  dueDate: new Date(),
  terms: "",
  reference: "",
  items: [
    {
      id: -1,
      salesItem: null,
      description: null,
      qty: null,
      unitPrice: null,
      taxRateItem: null,
      trackingItem: null,
    },
  ],
};

let renderCount = 0;

function App() {
  const {
    register,
    control,
    handleSubmit,
    errors,
    reset,
    watch,
    setValue,
  } = useForm({
    //mode: "onChange",
    defaultValues: initialValues,
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "items",
      keyName: "keyNameId",
    }
  );

  const classes = useStyles();

  const [subsidiaryLedgerAccounts, getSubsidiaryLedgerAccounts] = useState([
    {
      Id: 0,
      name: "",
      address: "",
    },
  ]);

  const [salesItems, getSalesItems] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  const [taxRates, getTaxRates] = useState([
    {
      Id: 0,
      name: "",
      rate: 0,
    },
  ]);

  const [trackings, getTrackings] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  const [itemCount, setItemCount] = useState(0);

  const [counter, setCounter] = useState(0);
  const [counterSales, setCounterSales] = useState(0);
  const [counterTax, setCounterTax] = useState(0);
  const [counterTracking, setCounterTracking] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalTaxes, setTotalTaxes] = useState();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetch("https://localhost:44302/api/SubsidiaryLedger/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        //console.log(data)
        getSubsidiaryLedgerAccounts(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counter]);

  useEffect(() => {
    fetch("https://localhost:44302/api/IncomeItem/get", {
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
    fetch("https://localhost:44302/api/TaxRate/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        //console.log(data);
        getTaxRates(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterTax]);

  useEffect(() => {
    fetch("https://localhost:44302/api/Tracking/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        getTrackings(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterTracking]);

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 40,
      minHeight: 40,
    }),
  };

  const [costs, setCosts] = useState([]);

  const handleChangeCustomer = (e, field) => {
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    //loadBillingAddress(e.value);
  };

  const handleChange = (e, field) => {
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    handleCostsChange();
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleClose = () => {
    toggleOpen(false);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemIdIndex, setDeleteItemIdIndex] = useState(null);
  const [open, toggleOpen] = useState(false);
  const [indexes, setIndexes] = useState([]);
  const [counterArray, setCounterArray] = useState(0);

  const handleCostsChange = (event, index, field) => {
    console.log(costs);
    const _tempCosts = [...costs];
    var rate = 0;
    //const index = event.target.dataset.id;
    if (_tempCosts.length > 0) {
      if (event.target === undefined) {
        _tempCosts[index][field] = event;
        setValue(field, event, { shouldValidate: true }, { shouldDirty: true });
        rate = costs[index][field].rate / 100;
      } else {
        _tempCosts[index][event.target.name] = event.target.value;
        setValue(
          event.target.name,
          event.target.value,
          { shouldValidate: true },
          { shouldDirty: true }
        );
        if (costs[index]["items[" + index + "].taxRateItem"] !== null) {
          rate = costs[index]["items[" + index + "].taxRateItem"];
          if (rate === undefined) rate = 0;
          if (typeof rate === "object") rate = rate.rate / 100;
        }
      }
    }

    _tempCosts[index]["items[" + index + "].id"] = index;

    setCosts(_tempCosts);
    console.log(costs);
    const q = Number(costs[index]["items[" + index + "].qty"]);
    const y = Number(costs[index]["items[" + index + "].unitPrice"]);
    // console.log(q * y)
    // const z = `items[${index}].amount`;
    setValue(
      `items[${index}].amount`,
      isNaN(Math.round(q * y * 100) / 100)
        ? ""
        : commaNumber(Math.round(q * y * 100) / 100)
    );
    //setValue(`items[${index}].description`, "8");
    var subTotal = 0;
    var totalTaxes = 0;
    var totalAmount = 0;

    console.log(costs);
    // eslint-disable-next-line array-callback-return
    costs.map((item, index) => {
      const qty = Number(item["items[" + index + "].qty"]);
      const unitPrice = Number(item["items[" + index + "].unitPrice"]);
      if (costs[index]["items[" + index + "].taxRateItem"] !== null) {
        rate = costs[index]["items[" + index + "].taxRateItem"];
        if (rate === undefined) rate = 0;
        if (typeof rate === "object") rate = rate.rate / 100;
      }
      if (!isNaN(qty) && !isNaN(unitPrice)) {
        subTotal = subTotal + qty * unitPrice;
        totalTaxes = totalTaxes + qty * unitPrice * rate;
        totalAmount = totalAmount + subTotal + totalTaxes;
      }
    });
    setSubTotal(Number(subTotal));
    setTotalTaxes(totalTaxes);
    setTotalAmount(Number(subTotal) + totalTaxes);
  };

  const handleDisplayAmount = () => {
    var subTotal = 0;
    var totalTaxes = 0;
    var totalAmount = 0;

    console.log(costs);
    // eslint-disable-next-line array-callback-return
    costs.map((item, index) => {
      const qty = Number(item["items[" + index + "].qty"]);
      const unitPrice = Number(item["items[" + index + "].unitPrice"]);
      var rate = 0;
      if (costs[index]["items[" + index + "].taxRateItem"] !== null) {
        rate = costs[index]["items[" + index + "].taxRateItem"];
        if (rate === undefined) rate = 0;
        if (typeof rate === "object") rate = rate.rate / 100;
      }
      if (!isNaN(qty) && !isNaN(unitPrice)) {
        subTotal = subTotal + qty * unitPrice;
        totalTaxes = totalTaxes + subTotal * rate;
        totalAmount = totalAmount + subTotal + totalTaxes;
      }
    });
    setSubTotal(Number(subTotal));
    setTotalTaxes(totalTaxes);
    setTotalAmount(Number(subTotal) + totalTaxes);
  };

  useEffect(() => {
    var subTotal = 0;
    var totalTaxes = 0;
    var totalAmount = 0;
    console.log(fields)
    console.log(costs);
    // eslint-disable-next-line array-callback-return
    fields.map((item, index) => {
      //const qty = Number(item["items[" + item.id + "].qty"]);
      //const unitPrice = Number(item["items[" + item.id + "].unitPrice"]);
      //var x = "items[" + item.id + "].taxRateItem";
      const qty = Number(item.qty);
      const unitPrice = Number(item.unitPrice);
      var rate = 0;
      if (fields.taxRateItem !== null) {
        rate = fields.taxRateItem
        if (rate === undefined) rate = 0;
        if (typeof rate === "object") rate = rate.rate / 100;
      }
      if (!isNaN(qty) && !isNaN(unitPrice)) {
        subTotal = subTotal + qty * unitPrice;
        totalTaxes = totalTaxes + subTotal * rate;
        totalAmount = totalAmount + subTotal + totalTaxes;
      }
    })
    setSubTotal(Number(subTotal));
    setTotalTaxes(totalTaxes);
    setTotalAmount(Number(subTotal) + totalTaxes);
  }, [costs,fields]);

  //useEffect(() => {
  //  setCosts((prevCosts) => [...prevCosts, {}]);
  //},[])

  const handleChangeSubTotal = (e, field, index) => {
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    //handleChangeAmount(fields);
  };
  const removeRow = (index) => () => {
    setIndexes((prevIndexes) => [
      ...prevIndexes.filter((item) => item !== index),
    ]);
    setCounterArray((prevCounter) => prevCounter - 1);
  };

  const onSubmit = (data) => console.log("data", data);

  // if you want to control your fields with watch
  // const watchResult = watch("test");
  // console.log(watchResult);

  // The following is useWatch example
  // console.log(useWatch({ name: "test", control }));

  renderCount++;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="counter">Render Count: {renderCount}</span>
      <Grid container justify="space-around" direction="row">
        <Grid item xs={12}>
          <Controller
            control={control}
            name="customer"
            defaultValue={null}
            render={(
              { onChange, onBlur, value, name, ref },
              { invalid, isTouched, isDirty }
            ) => (
              <CreatableSelect
                onBlur={onBlur}
                onChange={(e) => handleChangeCustomer(e, "customer")}
                inputRef={ref}
                options={subsidiaryLedgerAccounts}
                className={classes.reactSelect}
              />
            )}
          />

          <p className={classes.p}>{errors.customer?.message}</p>
        </Grid>
        <Grid
          item
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className={classes.textField}
        >
          <Controller
            as={TextField}
            name="billingAddress"
            id="billingAddress"
            control={control}
            defaultValue=""
            //ref={register}
            label="Billing Address"
            margin="normal"
            multiline
            rows={4}
            rowsMax={4}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            className={classes.billingAddress}
          />
          <p className={classes.p}>{errors.billingAddress?.message}</p>
        </Grid>
        <Grid item xs={2} className={classes.textField}>
          <Controller
            as={TextField}
            name="invoiceNo"
            control={control}
            //ref={register}
            label="Invoice No"
            defaultValue=""
          />
          <p className={classes.p}>{errors.invoiceNo?.message}</p>
        </Grid>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={2} className={classes.textField}>
            <KeyboardDatePicker
              style={{ marginTop: "0px" }}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date"
              name="date"
              label="Date"
              //defaultValue={props.values.date}
              //onChange={(value) => props.setFieldValue("date", value)}
              //KeyboardButtonProps={{
              //  "aria-label": "change date",
              //}}
            />
          </Grid>
          <Grid item xs={2} className={classes.textField}>
            <KeyboardDatePicker
              style={{ marginTop: "0px" }}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="dueDate"
              name="dueDate"
              label="Due Date"
              //defaultValue={props.values.dueDate}
              //onChange={(value) =>
              //  props.setFieldValue("dueDate", value)
              //}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={1} className={classes.textField}>
          <Controller
            as={TextField}
            name="terms"
            control={control}
            //ref={register}
            label="Terms"
            defaultValue=""
          />
        </Grid>
        <Grid item xs={5} className={classes.textField}>
          <Controller
            as={TextField}
            name="reference"
            control={control}
            //ref={register}
            label="Reference"
            defaultValue=""
          />
          <p className={classes.p}>{errors.reference?.message}</p>
        </Grid>
      </Grid>
      {fields.map((item, index) => {
        return (
          <div key={index}>
            <Grid container justify="space-around" direction="row">
              <Grid item xs={2}>
                <Controller
                  control={control}
                  id={`items[${index}].salesItem`}
                  name={`items[${index}].salesItem`}
                  defaultValue={null}
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <CreatableSelect
                      onBlur={onBlur}
                      //onChange={(e) =>
                      //  handleChange(e, `items[${index}].salesItem`)
                      //}
                      inputRef={ref}
                      options={salesItems}
                      className={classes.reactSelect}
                      placeholder="Please select Sales Items"
                      styles={customStyles}
                    />
                  )}
                />
                <p className={classes.p}>
                  {errors?.["items"]?.[index]?.["salesItem"]?.["message"]}
                </p>
              </Grid>
              <Grid item xs={3}>
                <Controller
                  as={TextField}
                  id={`items[${index}].description`}
                  name={`items[${index}].description`}
                  control={control}
                  label="Description"
                  className={classes.textField2}
                  margin="dense"
                  defaultValue=""
                  variant="outlined"
                  size="small"
                  //required={true}
                />
                <p className={classes.p}>
                  {errors?.["items"]?.[index]?.["description"]?.["message"]}
                </p>
              </Grid>
              <Grid item xs={1}>
                <Controller
                  control={control}
                  id={`items[${index}].qty`}
                  name={`items[${index}].qty`}
                  defaultValue={null}
                  //name="qty"
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <TextField
                      //name="qty"
                      name={`items[${index}].qty`}
                      //onBlur={onBlur}
                      variant="outlined"
                      onChange={(e) =>
                        handleCostsChange(e, index, `items[${index}].qty`)
                      }
                      //ref={register({})}
                      placeholder="Quantity"
                      className={classes.textField}
                      styles={customStyles}
                      type="Number"
                      inputProps={{ "data-id": index }}
                    />
                  )}
                />
                <p className={classes.p}>
                  {errors?.["items"]?.[index]?.["qty"]?.["message"]}
                </p>
              </Grid>
              <Grid item xs={1}>
                <Controller
                  control={control}
                  id={`items[${index}].unitPrice`}
                  name={`items[${index}].unitPrice`}
                  defaultValue={null}
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <TextField
                      //onBlur={onBlur}
                      name={`items[${index}].unitPrice`}
                      variant="outlined"
                      onChange={(e) =>
                        handleCostsChange(e, index, `items[${index}].unitPrice`)
                      }
                      placeholder="Unit Price"
                      className={classes.textField}
                      //styles={customStyles}
                      type="Number"
                      //ref={register({})}
                      inputProps={{ "data-id": index }}
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
                  id={`items[${index}].taxRateItem`}
                  name={`items[${index}].taxRateItem`}
                  defaultValue={null}
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <CreatableSelect
                      //onBlur={onBlur}
                      //onChange={(e) =>
                      //handleChangeSubTotal(
                      //  e,
                      //`items[${index}].taxRateItem`,
                      // index
                      //)
                      // }
                      onChange={(e) =>
                        handleCostsChange(
                          e,
                          index,
                          `items[${index}].taxRateItem`
                        )
                      }
                      inputRef={ref}
                      options={taxRates}
                      className={classes.reactSelect}
                      placeholder="Please select Tax Rates"
                      styles={customStyles}
                      //ref={register({})}
                    />
                  )}
                />
                <p className={classes.p}>
                  {errors?.["items"]?.[index]?.["taxRateItem"]?.["message"]}
                </p>
              </Grid>
              <Grid item xs={1}>
                <Controller
                  as={TextField}
                  id={`items[${index}].amount`}
                  name={`items[${index}].amount`}
                  control={control}
                  label="Sub Total"
                  className={classes.textFieldReadOnly}
                  margin="dense"
                  defaultValue=""
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  //required={true}
                />
              </Grid>
              <Grid item xs={1}>
                <Controller
                  control={control}
                  id={`items[${index}].trackingItem`}
                  name={`items[${index}].trackingItem`}
                  defaultValue={null}
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <CreatableSelect
                      //onBlur={onBlur}
                      //onChange={(e) =>
                      //  handleChange(e, `items[${index}].trackingItem`)
                      //}
                      inputRef={ref}
                      options={trackings}
                      className={classes.reactSelect}
                      placeholder="Please select Tracking"
                      styles={customStyles}
                    />
                  )}
                />
                <p className={classes.p}>
                  {errors?.["items"]?.[index]?.["trackingItem"]?.["message"]}
                </p>
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.deleteButton}
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setOpenDelete(true);
                    setDeleteItemId(item.keyNameId);
                    setDeleteItemIdIndex(index);
                  }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </div>
        );
      })}

      <section>
        <button
          type="button"
          onClick={() => {
            setItemCount(itemCount + 1);
            append({
              id: itemCount,
              //qty: null,
              //unitPrice: null,
              //taxRateItem: null,
            });
            //append({});
            setCosts((prevCosts) => [...prevCosts, { id: itemCount }]);
            //setCosts([{id: itemCount}]);
            console.log(costs);
          }}
        >
          append
        </button>
        <button
          type="button"
          onClick={() =>
            prepend({
              firstName: "prependFirstName",
              lastName: "prependLastName",
            })
          }
        >
          prepend
        </button>
        <button
          type="button"
          onClick={() =>
            insert(parseInt(2, 10), {
              firstName: "insertFirstName",
              lastName: "insertLastName",
            })
          }
        >
          insert at
        </button>

        <button type="button" onClick={() => swap(1, 2)}>
          swap
        </button>

        <button type="button" onClick={() => move(1, 2)}>
          move
        </button>

        <button type="button" onClick={() => remove(1)}>
          remove at
        </button>

        <button
          type="button"
          onClick={() =>
            reset({
              test: [{ firstName: "Bill", lastName: "Luo" }],
            })
          }
        >
          reset
        </button>
      </section>

      <>
        <Dialog
          //fullScreen={fullScreen}
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
              onClick={() => {
                remove(deleteItemIdIndex);
                // get index of object with id:37
                //var _tempCosts = [...costs];
                //setItemCount(itemCount + 1);
                var _tempCosts = [...costs];

                //for (var i = 0; i < _tempCosts.length; i++) {
                  //var id = _tempCosts[i].id;
                  //var x = _tempCosts[i]["items[" + i + "].id"];
                  //console.log(i);
                  //if (_tempCosts[i]["items[" + i + "].id"] === deleteItemId) {
                  //if (id === deleteItemIdIndex) {
                  //  _tempCosts.splice(i, 1);
                  //  //break;
                 // }
               // }
                //_tempCosts = [_tempCosts.filter(
                //  (item, idx) => idx !== deleteItemId
                //)];
                // _tempCosts.splice(removeIndex, 1);
                //setCosts(...costs, ..._tempCosts);
                //_tempCosts[index]["items[" + index + "].id"] = index;
                //setCosts([...costs, _tempCosts]);
                //setCosts([..._tempCosts]);
                //setCosts([...costs, { _tempCosts }]);

                setCosts(_tempCosts);
                console.log(costs);
                //setCosts(_tempCosts);
                //remove(deleteItemIdIndex);
                setOpenDelete(false);
                //handleDisplayAmount();
              }}
              color="primary"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>

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

      <input type="submit" />
    </form>
  );
}

export default App;
