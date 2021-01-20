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
//import { Formik, Form, ErrorMessage, FieldArray, Field } from "formik";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
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
import SalesInvoiceItem from "./sales-invoice-item";

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

function FieldArrayNameWatched({ control, name }) {
  useWatch({
    control,
    name: name, // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  });
  return <></>;
}

const _defaultCosts = [
  {
    name: "Rice",
    price: 40,
  },
];

const SalesInvoice = (props) => {
  const {
    register,
    handleSubmit,
    errors,
    control,
    touched,
    setValue,
    watch,
  } = useForm({
    //mode: "onChange",
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

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

  var [totalTaxes, setTotalTaxes] = useState();

  const [trackings, getTrackings] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  var [subTotal, setSubTotal] = useState(0);

  const [files, setFiles] = useState([]);
  const onDrop = React.useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  var fileList = files.map((file) => (
    <li key={file.path}>
      {file.path}
      {<DeleteForeverIcon onClick={() => removeAttachment(file, files)} />}
    </li>
  ));

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

  /* const removeRow = (id, values) => {
    const result = $.grep(
      values.items,
      function (n, i) {
        return n.id !== id;
      },
      false
    );
    values.items = result;
    setDeleteItem(result);
    setDeleteItem(null);
    setOpenDelete(false);
  }; */

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

  const handleChangeAmount = (values, value, name) => {
    
    var subTotal = 0;
    var totalTaxes = 0;
    var totalAmount = 0;
    var rate = 0;
    // eslint-disable-next-line array-callback-return
    fields.map((item, index) => {
      if (name !== undefined) {
        if (name.indexOf(index) !== -1) {
          item.taxRateItem = value;
        }
      }
      rate =
        item.taxRateItem !== null
          ? taxRates.find((x) => x.value === item.taxRateItem.value)
          : null;
      var taxRate = item.taxRateItem === null ? 0 : rate.rate / 100;
      subTotal = subTotal + item.qty * item.unitPrice;
      totalTaxes = totalTaxes + subTotal * taxRate;
      totalAmount = totalAmount + subTotal + totalTaxes;
    });
    setSubTotal(Number(subTotal));
    setTotalTaxes(totalTaxes);
    setTotalAmount(Number(subTotal) + totalTaxes);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [loadSubsidiaryLedger, setLoadSubsidiaryLedger] = useState(false);
  const [loadSalesItems, setLoadSalesItems] = useState(false);
  const [loadTaxRates, setLoadTaxRates] = useState(false);
  const [loadTrackings, setLoadTrackings] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [counter, setCounter] = useState(0);
  const [counterSales, setCounterSales] = useState(0);
  const [counterTax, setCounterTax] = useState(0);
  const [counterTracking, setCounterTracking] = useState(0);

  const [deleteItem, setDeleteItem] = useState({ id: 0 });

  const handleDeleteConfirmation = (values) => {
    setOpenDelete(true);
  };

  const [itemCount, setItemCount] = useState(-2);

  var [formValues, setFormValues] = useState(null);

  const [costs, setCosts] = useState(_defaultCosts);

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 40,
      minHeight: 40,
    }),
  };

  const getInvoice = () => {
    fetch("https://localhost:44302/api/sales/getaccount/6048", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        data.customer = data.customer.value;
        setFormValues(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  };

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

  var [totalAmount, setTotalAmount] = useState(0);

  const [open, toggleOpen] = useState(false);
  const handleClose = () => {
    toggleOpen(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const onSubmit = (data) => {
    console.log(data);
  };

  const [indexes, setIndexes] = useState([]);
  const [counterArray, setCounterArray] = useState(0);

  const addRow = () => {
    //setIndexes((prevIndexes) => [...prevIndexes, counterArray]);
    //setCounter((prevCounter) => prevCounter + 1);
    //setItemCount(itemCount - 1);
    append({});
  };

  const removeRow = (index) => () => {
    setIndexes((prevIndexes) => [
      ...prevIndexes.filter((item) => item !== index),
    ]);
    setCounterArray((prevCounter) => prevCounter - 1);
  };

  const handleChangeCustomer = (e, field) => {
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    loadBillingAddress(e.value);
  };

  const handleChange = (e, field) => {
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
  };

  const handleChangeSubTotal = (e, field) => {
    //watch("fieldArray" , fields);
    //watch("items");
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    handleChangeAmount(fields);
  };

  const handleChangeSubTotal2 = (e, field, newPrimaryIndex) => {
    setValue(
      fields.map((f, i) => ({
        [field]: i === newPrimaryIndex,
      }))
    );
    fields.forEach((f, i) => {
      f.primary = i === newPrimaryIndex;
    });
  };

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "items",
    }
  );

  //watch("items");
  //const lat = useWatch({name: `items[${index}].lat`});
const addNewCost = () => {
  setCosts((prevCosts) => [...prevCosts, { name: "", price: 0 }]);
};
  return (
    <div className={classes.root}>
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className={classes.title}>Sales Invoice</h1>
          <Grid container justify="space-around" direction="row">
            <Grid item xs={12}>
              <Controller
                control={control}
                name="customer"
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

            {costs.map((r, index) => (
              <div key={index}>
                <Grid container justify="space-around" direction="row" fullScreen>
                  <Grid item xs={2}>
                    <Controller
                      control={control}
                      name={`items[${index}].salesItem`}
                      render={(
                        { onChange, onBlur, value, name, ref },
                        { invalid, isTouched, isDirty }
                      ) => (
                        <CreatableSelect
                          onBlur={onBlur}
                          onChange={(e) =>
                            handleChange(e, `items[${index}].salesItem`)
                          }
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
                      name={`items[${index}].qty`}
                      render={(
                        { onChange, onBlur, value, name, ref },
                        { invalid, isTouched, isDirty }
                      ) => (
                        <TextField
                          onBlur={onBlur}
                          variant="outlined"
                          onChange={(e) =>
                            handleChangeSubTotal(
                              e.target.value,
                              `items[${index}].qty`,
                              index
                            )
                          }
                          //ref={register({})}
                          placeholder="Quantity"
                          className={classes.textField}
                          styles={customStyles}
                          type="Number"
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
                      name={`items[${index}].unitPrice`}
                      render={(
                        { onChange, onBlur, value, name, ref },
                        { invalid, isTouched, isDirty }
                      ) => (
                        <TextField
                          onBlur={onBlur}
                          variant="outlined"
                          onChange={(e) =>
                            handleChangeSubTotal(
                              e.target.value,
                              `items[${index}].unitPrice`,
                              index
                            )
                          }
                          placeholder="Unit Price"
                          className={classes.textField}
                          //styles={customStyles}
                          type="Number"
                          //ref={register({})}
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
                          onBlur={onBlur}
                          onChange={(e) =>
                            handleChangeSubTotal(
                              e,
                              `items[${index}].taxRateItem`,
                              index
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
                      name={`items[${index}].amount`}
                      control={control}
                      //defaultValue="5"
                      className={classes.textFieldReadOnly}
                      InputProps={{
                        readOnly: true,
                      }}
                      margin="dense"
                      label="Sub Total"
                      size="small"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Controller
                      control={control}
                      name={`items[${index}].trackingItem`}
                      render={(
                        { onChange, onBlur, value, name, ref },
                        { invalid, isTouched, isDirty }
                      ) => (
                        <CreatableSelect
                          onBlur={onBlur}
                          onChange={(e) =>
                            handleChange(e, `items[${index}].trackingItem`)
                          }
                          inputRef={ref}
                          options={trackings}
                          className={classes.reactSelect}
                          placeholder="Please select Tracking"
                          styles={customStyles}
                        />
                      )}
                    />
                    <p className={classes.p}>
                      {
                        errors?.["items"]?.[index]?.["trackingItem"]?.[
                          "message"
                        ]
                      }
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
                        //setDeleteItemId(index);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </div>
            ))}

            <br></br>
            <Grid container justify="space-around" direction="row" fullScreen>
              <Grid item xs={9}>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    addNewCost()
                  }}
                >
                  Add New Row
                </Button>
              </Grid>
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
            <Grid
              item
              lg={10}
              md={10}
              sm={10}
              xs={10}
              className={classes.submitButton}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                // disabled={isSubmitting}
              >
                Submit
              </Button>
            </Grid>
            <Grid
              item
              lg={2}
              md={2}
              sm={2}
              xs={2}
              className={classes.submitButton}
            ></Grid>
          </Grid>
        </form>
      </>

      <>
        <Dialog
          fullScreen={fullScreen}
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
                removeRow(deleteItemId);
                setOpenDelete(false);
                //handleChangeAmount(deleteItem.values);
              }}
              color="primary"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default SalesInvoice;
