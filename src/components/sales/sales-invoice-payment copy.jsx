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
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { ptBR } from "date-fns/locale";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import configData from "../../config.json";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useReactToPrint } from "react-to-print";
import Paper from "@material-ui/core/Paper";

import { ComponentToPrint } from "./sales-invoice-print";
import { set } from "date-fns";

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
        paddingBottom: "5px",
        fontSize: "13px",
      },
    },
    textField2: {
      width: "100%",
      zIndex: "0",
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
      paddingTop: "8px",
      fontSize: "13px",
      width: "100%",
      zIndex: "5",
    },
    reactSelect2: {
      paddingTop: "8px",
      fontSize: "13px",
      width: "40%",
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
      paddingBottom: "0px",
    },
  })
);

const validationSchema = Yup.object().shape({
  billingAddress: Yup.string().required("Enter Billing Address."),
  invoiceNo: Yup.string().required("Enter Invoice No."),
  customer: Yup.object().nullable().required("Enter Customer"),
  id: Yup.number(),
  terms: Yup.number(),
  items: Yup.array().of(
    Yup.object().shape({
      id: Yup.number(),
      salesItem: Yup.object().nullable().required("Sales Item is required"),
      description: Yup.string().nullable().required("Enter Description"),
      taxRateItem: Yup.object().nullable().required("Tax Rate is required"),
      trackingItem: Yup.object().nullable().required("Tracking is required"),
      qty: Yup.number()
        .nullable()
        .typeError("Quantity is required")
        .required("Quantity is required"),
      unitPrice: Yup.number()
        .nullable()
        .typeError("Unit Price is required")
        .required("Unit Price is required"),
      //Yup.string()
      //.nullable()
      //.typeError("Unit Price is required")
      //.required("Unit Price is required")
      //.test("is-decimal", "invalid decimal", (value) =>
      //  (value + "").match(/^\d+(\.\d{1,2})?$/)
      //),
    })
  ),
});

let renderCount = 0;

const initialValues = {
  id: -1,
  customer: { value: null, label: null },
  billingAddress: "",
  invoiceNo: "",
  date: new Date(),
  dueDate: new Date(),
  terms: "",
  reference: "",
  /* items: [
    {
      id: -1234567,
      salesItem: null,
      description: "",
      qty: null,
      unitPrice: null,
      taxRateItem: null,
      trackingItem: null,
    },
  ], */
};

const SalesInvoicePayment = (props) => {
  const [costs, setCosts] = useState([]);
  const [files, setFiles] = useState([]);
  const loadPreLoadedValues = useRef(true);

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

    //resolver: yupResolver(validationSchema),
  });

  const invoice = useRef();
  const tax = useRef();

  const [inv, setInv] = useState();

  //invoice.current = {
  //  billingAddress: "abc",
  //  items: [{ description: "kat1" }, { description: "kat2" }],
  //};

  invoice.current = {
    billingAddress: "abc",
    items: [{ description: "kat1" }, { description: "kat2" }],
  };

  

  useEffect(() => {});

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "items",
      keyName: "keyNameId",
    }
  );

  const classes = useStyles();

  const [subsidiaryLedgerAccounts, getSubsidiaryLedgerAccounts] = useState([]);

  const [salesItems, getSalesItems] = useState([]);

  const [taxRates, getTaxRates] = useState([]);

  const [trackings, getTrackings] = useState([]);

  const [itemCount, setItemCount] = useState(-2);
  const [count, setCount] = useState(0);
  const [counter, setCounter] = useState(0);
  const [counterSales, setCounterSales] = useState(0);
  const [counterTax, setCounterTax] = useState(0);
  const [counterTracking, setCounterTracking] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalTaxes, setTotalTaxes] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceData, setInvoiceData] = useState();
  const [taxRateDefaultValue, setTaxRateDefaultValue] = useState([]);
  var [invoiceCounter, setInvoiceCounter] = useState(0);

  

  var tv = [];
  const [isBusy, setBusy] = useState(true);
  const [isBusy2, setBusy2] = useState(true);
  //const onLoadInvoiceItems = useRef(true);
  const [addInvoiceItems, setAddInvoiceItems] = useState(false);
  const [invoicePaymentDetails, setInvoicePaymentDetails] = useState([]);
    
  useEffect(() => {
    fetch(
      configData.SERVER_URL +
        "Sales/GetCustomerInvoicePayment?customerId=" +
        props.customerId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((results) => results.json())
      .then((data) => {
        setInvoicePaymentDetails(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [invoiceCounter, props.customerId]);  
   

  useEffect(() => {
    fetch(configData.SERVER_URL + "SubsidiaryLedger/get", {
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
    fetch(configData.SERVER_URL + "IncomeItem/get", {
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
    fetch(configData.SERVER_URL + "TaxRate/get", {
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
        setBusy2(false);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, []);

  useEffect(() => {
    fetch(configData.SERVER_URL + "Tracking/get", {
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

  const [origId, setOrigId] = useState();
  const [preId, setPreId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const tv2 = [2011, 2];

  const [taxRateValue, setSelectedTaxRateValue] = useState([]);
  //setCounterTax(counterTax + 1)

  useEffect(() => {
    //setValue(`items[0].taxRateItem`, taxRateDefaultValue[0])
  }, []);

  function handleNewSales(values) {
    fetch(configData.SERVER_URL + "IncomeItem/addaccount", {
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
    fetch(configData.SERVER_URL + "TaxRate/addaccount", {
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

  function removeFileAttachment(file) {
    fetch(
      configData.SERVER_URL + "FileAttachment/DeleteFile?fileName=" + file,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((results) => results.json())
      .then((data) => {});
  }

  function handleNewTracking(values) {
    fetch(configData.SERVER_URL + "Tracking/addaccount", {
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

  // here is how you call this function
  //const invData = fetchCourses();

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 40,
      minHeight: 40,
    }),
  };

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
    //handleCostsChange();
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const [openDelete, setOpenDelete] = useState(false);

  //const [deleteItemId, setDeleteItemId] = useState(null);

  const deleteItemId = useRef(0);

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

  const handleCostsChange = (event, index, field, fieldName) => {
    console.log(costs);
    const _tempCosts = [...costs];
    console.log(fields);
    var rate = 0;
    //const index = event.target.dataset.id;
    if (_tempCosts.length > 0) {
      if (event.target === undefined) {
        _tempCosts[index][field] = event;
        setValue(
          fieldName,
          event,
          { shouldValidate: true },
          { shouldDirty: true }
        );
        rate = _tempCosts[index][field].rate / 100;
      } else {
        _tempCosts[index][field] = Number(event.target.value);
        setValue(
          fieldName,
          event.target.value === "" || isNaN(event.target.value)
            ? ""
            : event.target.value,
          { shouldValidate: true },
          { shouldDirty: true }
        );
        if (_tempCosts[index].hasOwnProperty("taxRateItem")) {
          rate = _tempCosts[index]["taxRateItem"]["rate"];
          if (rate === undefined) rate = 0;
          if (typeof rate === "object") rate = rate.rate / 100;
        }
      }
    }

    _tempCosts[index]["id"] = index;

    setCosts(_tempCosts);
    console.log(costs);
    const q = Number(_tempCosts[index]["qty"]);
    const y = Number(_tempCosts[index]["unitPrice"]);
    // console.log(q * y)
    // const z = `items[${index}].amount`;
    setValue(
      `items[${index}].amount`,
      isNaN(Math.round(q * y * 100) / 100)
        ? ""
        : commaNumber(Math.round(q * y * 100) / 100).toString()
    );
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

  const onDrop = React.useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  var [optionSales, setOptionSales] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeAttachment = (file, files) => {
    const result = $.grep(
      files,
      function (n, i) {
        if (n.path === file.path) {
          removeFileAttachment(file.path);
        }
        return n.path !== file.path;
      },
      false
    );
    setFiles(result);
  };

   

  const onSubmit = (values, { resetForm }) => {
      const x = JSON.stringify(values);
      return;
    console.log("data", values);
    //values.files = files;
    //values.items = costs;
    //console.log(values.id);
    //values.items = null;
    //values.files = null;
    //if (values.date === undefined) new Date();
    //if (values.dueDate === undefined) new Date();

    //values.date = new Date(values.date);
    //values.dueDate = new Date(values.dueDate);

    //values.date = new Date(moment(values.date).format("MM/DD/YYYY"));
    //values.dueDate = new Date(moment(values.dueDate).format("MM/DD/YYYY"));

    //values.date = new Date(values.date.ge, 10, 9);
    //values.dueDate = new Date(values.dueDate.year, 7, 8);

    //values.qty = Number(values.qty)
    //values.unitPrice = Number(values.unitPrice)
    //values.terms = Number(values.terms);

    //values.date = new Date(values.date.replace(/-/g, '/').replace(/T.+/, ''));
    //values.dueDate = new Date(values.date.replace(/-/g, "/").replace(/T.+/, ""));

    values.date = moment(values.date.toString()).toDate();
    values.dueDate = moment(values.dueDate.toString()).toDate();
    values.id = origId;
  };

  function handleNewCustomer(name, address) {
    fetch(configData.SERVER_URL + "subsidiaryledger/addaccount", {
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

  //const [selectedDate, setSelectedDate] = React.useState(new Date());

  //const handleDateChange = (date) => {
  //  setSelectedDate(date);
  //};

  const [selectedDate1, setSelectedDate] = useState(
    new Date("2020-09-11T12:00:00")
  );

  //const [selectedDate, handleDateChange] = useState(new Date().toISOString());
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedDueDate, handleDueDateChange] = useState(new Date());

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //renderCount++;

  return salesItems.length > 0 && invoicePaymentDetails.length > 0 ? (
    <form id="salesInvoiceForm" onSubmit={handleSubmit(onSubmit)}>
      <Grid container justify="space-around" direction="row">
        <Grid item xs={6}>
          <Controller
            control={control}
            name="amount"
            render={(
              { onChange, onBlur, value, name, ref },
              { invalid, isTouched, isDirty }
            ) => (
              <TextField
                name="invoiceAmount"
                //defaultValue={0}
                inputRef={register()}
                label="Amount Paid"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid
          item
          xs={6}
          className={classes.textField}
          styles={{ zIndex: "9999" }}
        >
          <Controller
            control={control}
            name="BankNameDeposit"
            render={(
              { onChange, onBlur, value, name, ref },
              { invalid, isTouched, isDirty }
            ) => (
              <CreatableSelect
                name="BankNameDeposit"
                onBlur={onBlur}
                onChange={(e) => handleChange(e, "BankNameDeposit")}
                defaultValue=""
                inputRef={register()}
                options={salesItems}
                className={classes.reactSelect}
                placeholder="Please select cash or bank account"
              />
            )}
          />

          {/* <p className={classes.p}>
            {errors?.["items"]?.[index]?.["salesItem"]?.["message"]}
            </p> */}
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="customer"
            render={(
              { onChange, onBlur, value, name, ref },
              { invalid, isTouched, isDirty }
            ) => (
              <TextField
                name="customer"
                inputRef={register()}
                label="Customer"
                defaultValue={props.customerName}
                fullWidth
                disabled={true}
              />
            )}
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
        </Grid>
        <Grid
          item
          xs={6}
          className={classes.textField}
          styles={{ zIndex: "0" }}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Controller
              control={control}
              name="paymentDate"
              render={({ onChange, onBlur, value, name, ref }) => (
                <KeyboardDatePicker
                  name="date"
                  value={value}
                  format="MM/dd/yyyy"
                  inputRef={register()}
                  label="Payment Date"
                  onBlur={onBlur}
                  onChange={onChange}
                  size="small"
                  variant="filled"
                  //value={value}
                  style={{ marginTop: "3px", zIndex: "0" }}
                />
              )}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                   
                </TableRow>
              </TableHead>
              <TableBody>
                {invoicePaymentDetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.invoiceNo} {row.invoiceAmount } {row.unPaidBalance}  
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        // disabled={isSubmitting}
        style={{ marginTop: "50px" }}
      >
        Save
      </Button>
    </form>
  ) : (
    ""
  );
};
export default SalesInvoicePayment;
