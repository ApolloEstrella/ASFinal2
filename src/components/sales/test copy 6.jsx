import { yupResolver } from "@hookform/resolvers/yup";
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
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
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

//import "./CostTable.css";

const _defaultCosts = {
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



const Test = () => {
  const validationSchema = Yup.object().shape({
    //numberOfTickets: Yup.string().required("Number of tickets is required"),
    //tickets: Yup.array().of(
    //  Yup.object().shape({
    //    name: Yup.string().required("Name is required"),
    //    email: Yup.string()
    //      .email("Email is Invalid")
    //      .required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    errors,
    watch,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
  control,
  name: "items",
});

  const handleChange = (e, field) => {
    //setValue(field, e, { shouldValidate: true }, { shouldDirty: true });

    console.log(costs);
    const _tempCosts = [...costs.items];
    _tempCosts[field] = e;

    setCosts(_tempCosts);
    console.log(costs);
  };

  const [costs, setCosts] = useState(_defaultCosts);

  const handleCostsChange = (event) => {
    console.log(costs);
    const _tempCosts = [...costs.items];
    _tempCosts[event.target.dataset.id][event.target.name] = event.target.value;

    setCosts(_tempCosts);
    console.log(costs);
  };

  const addNewCost = () => {
    setCosts((prevCosts) => [...prevCosts.items, {salesItem:null, name: "", price: 0 }]);
   
  
  };

  const getTotalCosts = () => {
    return 0;
    return costs.reduce((total, item) => {
      return total + Number(item.price);
    }, 0);
  };

  const [salesItems, getSalesItems] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  const [counterSales, setCounterSales] = useState(0);

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

  return (
    <div className="table">
      <div className="table-title">Food costs</div>
      <div className="table-content">
        <div className="table-header">
          <div className="table-row">
            <div className="table-data">
              <div>Item</div>
            </div>
            <div className="table-data">
              <div>Price</div>
            </div>
          </div>
        </div>
        <div className="table-body">
          {costs.items.map((item, index) => (
            <div className="table-row" key={index}>
              <div className="table-data">
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
                        handleChange(e, `salesItem`)
                      }
                      inputRef={ref}
                      options={salesItems}
                      //className={classes.reactSelect}
                      placeholder="Please select Sales Items"
                      //styles={customStyles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="name"
                  data-id={index}
                  value={item.name}
                  variant="outlined"
                  //onChange={handleCostsChange}
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <TextField
                      //name="name"
                      //onBlur={onBlur}
                      variant="outlined"
                      //onChange={(e) => handleChange(e.target.value, `items[${index}].qty`)}
                      //ref={register({})}
                      //data-id={index}
                      placeholder="Description"
                      //value={item.name}
                      //onChange={handleCostsChange}
                      name="name"
                      inputProps={{ "data-id": index }}
                      //data-id={index}
                      //value={item.name}
                    />
                  )}
                />
              </div>
              <div className="table-data">
                <TextField
                  id="price"
                  name="price"
                  //data-id={index}
                  type="number"
                  //value={item.price}
                  onChange={handleCostsChange}
                  variant="outlined"
                  inputProps={{ "data-id": index }}
                />
              </div>
            </div>
          ))}
          <div className="table-row">
            <div className="table-data">
              <button onClick={() => addNewCost()}>+</button>
            </div>
          </div>
        </div>
        <div className="table-footer">
          <div className="table-row">
            <div className="table-data">
              <div>Total</div>
            </div>
            <div className="table-data">
              <div>{getTotalCosts()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
