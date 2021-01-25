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
import { Formik, Form, ErrorMessage, useFormikContext, useField } from "formik";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import { value } from "numeral";

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
    textField3: {
      width: "100%",
      zIndex: "0",
      paddingTop: "8px",
      //margin: "0px"
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
    hide: {
      display: "none",
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
      qty: Yup.number().nullable().required("Quantity is required"),
      unitPrice: Yup.number().nullable().required("Unit Price is required"),
    })
  ),
});

let renderCount = 0;

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
      id: -1234567,
      salesItem: null,
      description: "",
      qty: null,
      unitPrice: null,
      taxRateItem: null,
      trackingItem: null,
    },
  ],
};

const SalesInvoice = () => {
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
    //defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
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

  const [itemCount, setItemCount] = useState(-2);
  const [count, setCount] = useState(0);
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

  function handleNewSales(values) {
    fetch("https://localhost:44302/api/IncomeItem/addaccount", {
      method: "POST",
      body: JSON.stringify({
        id: 0,
        name: values.name,
        sku: values.sku,
        description: values.description,
        incomeAccountId: values.incomeAccountId.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setCounterSales(counterSales + 1);
        handleCloseSales();
      });
  }

  function handleNewTax(values) {
    fetch("https://localhost:44302/api/TaxRate/addaccount", {
      method: "POST",
      body: JSON.stringify({
        description: values.description,
        rate: values.rate,
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

  function handleNewTracking(values) {
    fetch("https://localhost:44302/api/Tracking/addaccount", {
      method: "POST",
      body: JSON.stringify({
        description: values.description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setCounterTracking(counterTracking + 1);
        handleCloseTracking();
      });
  }

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 40,
      minHeight: 40,
    }),
  };

  const [costs, setCosts] = useState([]);

  const loadBillingAddress = (id) => {
    const sL = subsidiaryLedgerAccounts.find((x) => x.value === id);
    //setValue("billingAddress", sL.address, {
    //  shouldValidate: true,
    //  shouldDirty: true,
    //});
    setValue("billingAddress", sL.address === null ? "" : sL.address, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const handleChangeCustomer = (e, field) => {
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    loadBillingAddress(e.value);
  };

  const handleChange = (e, field) => {
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    handleCostsChange();
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [open, toggleOpen] = useState(false);
  const [indexes, setIndexes] = useState([]);
  const [counterArray, setCounterArray] = useState(0);
  const [openSales, toggleOpenSales] = useState(false);
  const [openTax, toggleOpenTax] = useState(false);
  const [openTracking, toggleOpenTracking] = useState(false);
  const [chartOfAccounts, getChartOfAccounts] = useState([]);
  const [counterChartOfAccount, setCounterCharOfAccount] = useState(0);

  const handleClose = () => {
    setBillingAddress({ address: "" });
    toggleOpen(false);
  };

  const handleCloseSales = () => {
    setOptionSales((optionSales = null));
    toggleOpenSales(false);
  };

  const handleCloseTax = () => {
    toggleOpenTax(false);
  };

  const handleCloseTracking = () => {
    toggleOpenTracking(false);
  };

  const [dialogValue, setDialogValue] = useState({
    name: "",
    billingAddress: "",
  });

  const [dialogValueSales, setDialogValueSales] = useState({
    description: "",
    rate: 0,
  });

  const [dialogValueTax, setDialogValueTax] = useState({
    description: "",
    rate: 0,
  });

  const [dialogValueTracking, setDialogValueTracking] = useState({
    description: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    address: "",
  });

  const handleCostsChange = (event, index, field) => {
    console.log(costs);
    const _tempCosts = [...costs];
    console.log(fields);
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
          Number(event.target.value),
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
        : (commaNumber(Math.round(q * y * 100) / 100)).toString()
    );
    //setValue(`items[${index}].description`, "8");
    handleDeleteDisplayTotal(false);
  };

  const handleDeleteDisplayTotal = (handleDelete) => {
    var _tempCosts = [...costs];
    setCosts(_tempCosts);
    setSubTotal(0);
    setTotalTaxes(0);
    setTotalAmount(0);
    var subTotal = 0;
    var totalTaxes = 0;
    var totalAmount = 0;
    console.log(fields);
    console.log(costs);
    var idDeleted = 0;
    // eslint-disable-next-line array-callback-return
    _tempCosts.map((item, index) => {
      var hitBreak = false;
      var itemId;
      for (itemId = 0; itemId <= _tempCosts.length + 100; itemId++) {
        if (!isNaN(Number(item["items[" + itemId + "].id"]))) {
          hitBreak = true;
          break;
        }
      }
      if (
        (handleDelete && index !== deleteItemId && hitBreak) ||
        (!handleDelete && hitBreak)
      ) {
        //_tempCosts.splice(index, 1);
        //idDeleted = index;
        //break;

        const qty = Number(item["items[" + itemId + "].qty"]);
        const unitPrice = Number(item["items[" + itemId + "].unitPrice"]);
        //var x = "items[" + item.id + "].taxRateItem";
        //const qty = Number(item.qty);
        //const unitPrice = Number(item.unitPrice);
        var rate = 0;
        var taxRateItem = item["items[" + itemId + "].taxRateItem"];
        if (taxRateItem !== undefined) {
          rate = taxRateItem.rate / 100;
          //if (rate === undefined) rate = 0;
          //if (typeof rate === "object") rate = rate.rate / 100;
        }
        if (!isNaN(qty) && !isNaN(unitPrice)) {
          subTotal = subTotal + qty * unitPrice;
          totalTaxes = totalTaxes + qty * unitPrice * rate;
          totalAmount = totalAmount + subTotal + totalTaxes;
        }
      } else if (handleDelete && hitBreak) {
        idDeleted = deleteItemId;
      }
    });
    setOpenDelete(false);
    setSubTotal(Number(subTotal));
    setTotalTaxes(totalTaxes);
    setTotalAmount(Number(subTotal) + totalTaxes);
    if (handleDelete) {
      remove(deleteItemId);
      _tempCosts.splice(idDeleted, 1);
      setCosts(_tempCosts);
    }
  };

  function handleOptionChangeSelect(selection) {
    setOptionSales(selection);
    //setFieldValue(props.name, selection);
  }

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

  const validationSchemaCustomer = Yup.object().shape({
    name: Yup.string().required("Enter Customer Name."),
  });

  const validationSchemaSales = Yup.object().shape({
    name: Yup.string().required("Enter Sales Item Name."),
  });

  const validationSchemaTax = Yup.object().shape({
    description: Yup.string().required("Enter Description."),
  });

  const initialCustomerValues = {
    name: dialogValue.name,
    billingAddress: "",
  };

  const initialSaleValues = {
    name: dialogValueSales.name,
    sku: "",
    description: "",
    incomeAccountId: {},
  };

  const initialTaxValues = {
    description: dialogValueTax.description,
    rate: 0,
  };

  const initialTrackingValues = {
    description: dialogValueTracking.description,
  };

  const [files, setFiles] = useState([]);
  const onDrop = React.useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  var [optionSales, setOptionSales] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeAttachment = (file, files) => {
    const result = $.grep(
      files,
      function (n, i) {
        return n.path !== file.path;
      },
      false
    );
    setFiles(result);
  };

  var fileList = files.map((file) => (
    <li key={file.path}>
      {file.path}
      {<DeleteForeverIcon onClick={() => removeAttachment(file, files)} />}
    </li>
  ));

  const onSubmit = (values, { resetForm }) => {
    const x = JSON.stringify(values);
    console.log("data", values);
    values.files = files;
    console.log(values.id)
    //values.items = null;
    //values.files = null;
    values.date = values.date.toISOString();
    values.dueDate = values.dueDate.toISOString();
    values.terms = Number(values.terms)

    fetch("https://localhost:44302/api/sales/addaccount", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        var formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("Files", files[i]);
        }
        formData.append("id", Number(data));
        fetch("https://localhost:44302/api/sales/AddUploadedFiles", {
          method: "POST",
          body: formData,
        })
          .then((results) => results.json())
          .then((data) => {
            //resetForm(initialValues);
            fileList = [null];
            setFiles([]);
            //subTotal = 0;
            //totalTaxes = 0;
            //totalAmount = 0;
            setSubTotal(0);
            setTotalTaxes(0);
            setTotalAmount(0);
            console.log("successful");
          })
          .catch(function (error) {
            console.log("network error");
          });
      })
      .catch(function (error) {
        console.log("network error");
      })
      .finally(function () {});
  };

  function handleNewCustomer(name, address) {
    fetch("https://localhost:44302/api/subsidiaryledger/addaccount", {
      method: "POST",
      body: JSON.stringify({
        id: 0,
        name: name,
        address: address,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setCounter(counter + 1);
        handleClose();
      });
  }

  //const { register, handleSubmit } = useForm();

  const onSubmitNewCustomer = (data) => alert(JSON.stringify(data));

  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  renderCount++;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="counter">Render Count: {renderCount}</span>
      <Grid container justify="space-around" direction="row">
        <Controller
          as={TextField}
          name="id"
          control={control}
          defaultValue={0}
          className={classes.hide}
        />
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
                isClearable
                options={subsidiaryLedgerAccounts}
                className={classes.reactSelect}
                onCreateOption={(inputValue) => {
                  setDialogValue({ name: inputValue });
                  toggleOpen(true);
                }}
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

        <Grid item xs={2} className={classes.textField}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Controller
              name="date"
              control={control}
              render={({ ref, ...rest }) => (
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Date picker dialog"
                  format="MM/dd/yyyy"
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  {...rest}
                />
              )}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={2} className={classes.textField}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Controller
              name="dueDate"
              control={control}
              render={({ ref, ...rest }) => (
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Date picker dialog"
                  format="MM/dd/yyyy"
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  {...rest}
                />
              )}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={1} className={classes.textField}>
          <Controller
            as={TextField}
            name="terms"
            control={control}
            //ref={register}
            type="number"
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
          <div key={item.id}>
            <Grid container justify="space-around" direction="row">
              <Controller
                as={TextField}
                id={`items[${index}].id`}
                name={`items[${index}].id`}
                control={control}
                label="id"
                className={classes.hide}
                margin="dense"
                defaultValue={item.id}
                variant="outlined"
                size="small"
                //required={true}
              />
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
                      //onBlur={onBlur}
                      //onChange={(e) =>
                      //  handleChange(e, `items[${index}].salesItem`)
                      //}
                      onChange={(e) =>
                        handleCostsChange(e, index, `items[${index}].salesItem`)
                      }
                      inputRef={ref}
                      options={salesItems}
                      className={classes.reactSelect}
                      placeholder="Please select Sales Items"
                      styles={customStyles}
                      onCreateOption={(inputValue) => {
                        setDialogValueSales({ name: inputValue });
                        toggleOpenSales(true);
                      }}
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
                  //defaultValue={null}
                  //name="qty"
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <TextField
                      //name="qty"
                      name={`items[${index}].qty`}
                      defaultValue={null}
                      variant="outlined"
                      onChange={(e) =>
                        handleCostsChange(e, index, `items[${index}].qty`)
                      }
                      //ref={register({})}
                      placeholder="Quantity"
                      className={classes.textField3}
                      //styles={customStyles}
                      type="Number"
                      size="small"
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
                  //defaultValue={0}
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
                      defaultValue={null}
                      placeholder="Unit Price"
                      className={classes.textField3}
                      size="small"
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
                      onCreateOption={(inputValue) => {
                        setDialogValueTax({ name: inputValue });
                        toggleOpenTax(true);
                      }}
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
                      onChange={(e) =>
                        handleCostsChange(
                          e,
                          index,
                          `items[${index}].trackingItem`
                        )
                      }
                      onCreateOption={(inputValue) => {
                        setDialogValueTracking({ name: inputValue });
                        toggleOpenTracking(true);
                      }}
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
                    setDeleteItemId(index);
                  }}
                >
                  Delete
                </Button>
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
          append({
            id: itemCount,
            qty: 1,
            unitPrice: 1,
            taxRateItem: null,
            amount: ""
          });
          setCosts((prevCosts) => [...prevCosts, { id: itemCount }]);
          //setCosts([{id: itemCount}]);
          //console.log(costs);
        }}
      >
        Add Line
      </Button>

      <>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add a new Customer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Customer does not exists. Please, add it!
            </DialogContentText>
            <Formik
              initialValues={initialCustomerValues}
              onSubmit={(values, { resetForm }) => {
                handleNewCustomer(values.name, values.billingAddress);
              }}
              validationSchema={validationSchemaCustomer}
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
                      id="name"
                      name="name"
                      fullWidth
                      value={values.name}
                      onChange={handleChange}
                      //onChange={(event) =>
                      //  setDialogValue({
                      //    ...dialogValue,
                      //    name: event.target.value,
                      //  })
                      //}
                      label="name"
                      type="text"
                      helperText={errors.name && touched.name && errors.name}
                      error={errors.name && touched.name}
                    />
                    <TextField
                      id="billingAddress"
                      label="Billing Address"
                      name="billingAddress"
                      value={values.address}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      rowsMax={4}
                      variant="outlined"
                    />
                    <Button type="submit" color="primary">
                      Add
                    </Button>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>

        <Dialog
          open={openSales}
          onClose={handleCloseSales}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add new Sales Item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sales Item does not exists. Please, add it!
            </DialogContentText>
            <Formik
              initialValues={initialSaleValues}
              onSubmit={(values, { resetForm }) => {
                values.incomeAccountId = optionSales;
                handleNewSales(values);
                resetForm(initialSaleValues);
              }}
              //validationSchema={validationSchemaSales}
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
                      id="name"
                      name="name"
                      fullWidth
                      value={values.name}
                      onChange={handleChange}
                      label="name"
                      type="text"
                      helperText={errors.name && touched.name && errors.name}
                      error={errors.name && touched.name}
                    />
                    <br></br>
                    <br></br>
                    <br></br>
                    <Select
                      id="incomeAccountId"
                      name="incomeAccountId"
                      placeholder="Select Income Account"
                      //styles={customStyles}
                      //{...field}
                      {...props}
                      //onBlur={updateBlur}
                      onChange={handleOptionChangeSelect}
                      value={optionSales}
                      //value={chartOfAccounts.find((obj) => obj.value === 6054)}
                      //value={{ value: 6054, label: "31231" }}
                      options={chartOfAccounts}
                      //className={customStyles.reactSelect}
                      isClearable
                    />
                    {console.log(
                      chartOfAccounts.find((obj) => obj.value === 6054)
                    )}

                    <TextField
                      id="sku"
                      label="SKU"
                      name="sku"
                      value={values.sku}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      multiline
                      //rows={4}
                      //rowsMax={4}
                      //variant="outlined"
                      className={customStyles.textFieldReadOnly}
                    />
                    <TextField
                      id="description"
                      label="Description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      multiline
                      //rows={2}
                      //rowsMax={4}
                      //variant="outlined"
                    />

                    <Button type="submit" color="primary">
                      Add
                    </Button>
                    <Button onClick={handleCloseSales} color="primary">
                      Cancel
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>

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
                      error={errors.description && touched.description}
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

        <Dialog
          open={openTracking}
          onClose={handleCloseTracking}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add new Tracking</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tracking does not exists. Please, add it!
            </DialogContentText>
            <Formik
              initialValues={initialTrackingValues}
              onSubmit={(values, { resetForm }) => {
                handleNewTracking(values);
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
                      error={errors.description && touched.description}
                    />
                    <Button type="submit" color="primary">
                      Add
                    </Button>
                    <Button onClick={handleCloseTracking} color="primary">
                      Cancel
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
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
                handleDeleteDisplayTotal(true);
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
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <section className="container">
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
              <h4>Files</h4>
              <ul>{fileList}</ul>
            </aside>
          </section>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        // disabled={isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
};

export default SalesInvoice;
