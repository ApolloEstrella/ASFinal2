//import { useForm } from "react-hook-form";
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

function App() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    //numberOfTickets: Yup.string().required("Number of tickets is required"),
    tickets: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Email is Invalid")
          .required("Email is required"),
      })
    ),
  });

  const classes = useStyles();

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

  // functions to build form returned by useForm() hook
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

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "items",
    }
  );

  const handleChange = (e, field) => {
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 40,
      minHeight: 40,
    }),
  };

  const handleChangeSubTotal = (e, field) => {
    //watch("fieldArray" , fields);
    //watch("items");
    console.log(ticketNumbers());
    setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    //handleChangeAmount(fields);
    //append({});
  };

  // watch to enable re-render when ticket number is changed
  const watchNumberOfTickets = watch("numberOfTickets");

  function onSubmit(data) {
    // display form data on success
    alert("SUCCESS!! :-)\n\n" + JSON.stringify(data, null, 4));
  }

  const [addTicket, setAddTicket] = useState(1);

  // return array of ticket indexes for rendering dynamic forms in the template
  function ticketNumbers() {
    //console.log(...Array(parseInt(addTicket)));
    return [...Array(parseInt(addTicket)).keys()];
  }

  function loopTickets() {
    for (const key of ticketNumbers()) {
      console.log(key);
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
      <div className="card m-3">
        <h5 className="card-header">
          React Dynamic Form Example with React Hook Form
        </h5>
        <div className="card-body border-bottom">
          <div className="form-row">
            <div className="form-group">
              <label>Number of Tickets</label>
              <select
                name="numberOfTickets"
                ref={register}
                className={`form-control ${
                  errors.numberOfTickets ? "is-invalid" : ""
                }`}
              >
                {["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 100].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                {errors.numberOfTickets?.message}
              </div>
            </div>
          </div>
        </div>
        {ticketNumbers().map((index) => (
          <div key={index} className="list-group list-group-flush">
            <div className="list-group-item">
              <h5 className="card-title">Ticket {index + 1}</h5>
              <div className="form-row">
                <div className="form-group col-6">
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
                </div>
                <div className="form-group col-6">
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
                </div>
                <div className="form-group col-6">
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
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="card-footer text-center border-top-0">
          <button
            type="button"
            className="btn btn-primary mr-1"
            onClick={() => setAddTicket(addTicket + 1)}
          >
            Add Tickets
          </button>
          <button type="submit" className="btn btn-primary mr-1">
            Submit
          </button>
          <button type="button" className="btn btn-primary mr-1" onClick={() => loopTickets()}>
            Loop tickets array
          </button>
        </div>
      </div>
    </form>
  );
}

export default App;
