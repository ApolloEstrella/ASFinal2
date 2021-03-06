import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import ReactSelect from "../controls/reactSelect";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import $ from "jquery";
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
      },
    },
    myTable: {
      width:"500px"
    },
    submitButton: {
      marginTop: "24px",
    },
    title: { textAlign: "center" },
    successMessage: { color: "green" },
    errorMessage: { color: "red" },
  })
);

const SalesInvoice = (props) => {
  const classes = useStyles();

  const [subsidiaryLedgerAccounts, getSubsidiaryLedgerAccounts] = useState([
    {
      Id: 0,
      name: "",
    },
  ]);

  const [rows, setRow] = useState([]);

  const [rowId, setRowId] = useState(-1);

  

  const removeRow = (id) => {
    var result = $.grep(rows, function (e, i) {
      return +e.id !== id;
    });
    setRow(result);
    console.log(rows);
  };

  const editRow = (row) => {};
  const [loadSubsidiaryLedger, setLoadSubsidiaryLedger] = useState(false);

  useEffect(() => {
    fetch("https://localhost:44302/api/SubsidiaryLedger/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        //console.log(data);
        getSubsidiaryLedgerAccounts(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [loadSubsidiaryLedger]);

  const handleItemChange = (e) => {
    // alert(e.target.value)
    // $("#" + p1).val(e.target.value);
    const value = e.target[e.target.type === "checkbox" ? "checked" : "value"];
    const name = e.target.name;

    //props.onFilter({
    //  [name]: value,
    //});
  };

  const [quantity, setQuantity] = React.useState({
    qty: 0,
  });

  const [inputList, setInputList] = useState([
    { me: {value: 0, label:""}, firstName: "", lastName: "" },
  ]);

const AddItem = () => {
  setInputList([...inputList, { me: [{value: 0, label: ""}],firstName: "", lastName: "" }]);
};

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
    //$("#fullName").val(
    //  $("#firstName").val() + $("#lastName").val()
    //);
  };

 const handleInputChange2 = (inputValue, actionMeta) => {
    console.group("Input Changed");
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  const [me, setNewValue] = useState({"value": 0, label:""});

const handleChangeMe = (newValue, actionMeta) => {
  console.group("Value Changed");
  console.log(newValue);
  console.log(`action: ${actionMeta.action}`);
  console.groupEnd();
  //this.setState({ value: newValue });
  setNewValue({ value: newValue.value, label: newValue.label });
};

  return (
    <div className={classes.root}>
      <button onClick={AddItem}>New</button>
      <Formik
        initialValues={{
          id: 0,
          customer: "",
          billingAddress: "",
          me2: {
            value: 5,
            label: "batman and superman",
          },
          det2: [{
            firstName: "",
            lastName: "",
            me: { value: 5, label: "batman and superman" }
          }],
        }}
        onSubmit={(values, actions) => {
          console.log(inputList);
          console.log({ master: values });
          console.log(JSON.stringify(values));
        }}
        validationSchema={Yup.object().shape({
          //email: Yup.string().email().required("Enter valid email-id"),
          customer: Yup.string().required("Please enter full name"),
          /* password: Yup.string()
            .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/
            )
            .required(
              "Please valid password. One uppercase, one lowercase, one special character and no spaces"
            ),
          confirmPassword: Yup.string()
            .required("Required")
            .test("password-match", "Password musth match", function (value) {
              return this.parent.password === value;
            }), */
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            //handleItemChange,
            isSubmitting,
          } = props;
          return (
            <Form>
              <h1 className={classes.title}>Sales Invoice</h1>
              <Grid container justify="space-around" direction="row">
                <Grid item xs={12}>
                  <ReactSelect
                    label="Customer"
                    id="customer"
                    name="customer"
                    type="text"
                    options={subsidiaryLedgerAccounts}
                    value={values.customer}
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <CreatableSelect
                    id="me2"
                    name="me2"
                    isClearable
                    //onChange={handleChangeMe}
                    //onInputChange={handleInputChange}
                    options={subsidiaryLedgerAccounts}
                    value={{
                      value: 5,
                      label: "batman and superman",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TextField
                    label="Billing Address"
                    name="billingAddress"
                    className={classes.textField}
                    value={values.billingAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.description &&
                      touched.description &&
                      errors.description
                    }
                    margin="normal"
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TableContainer component={Paper}>
                    <Table
                      className={classes.myTable}
                      size="small"
                      aria-label="a dense table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Sales Item</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Qty</TableCell>
                          <TableCell>Unit Price</TableCell>
                          <TableCell>Tax Rate</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Tracking</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inputList.map((r, i) => (
                          <TableRow key={r.id}>
                            <TableCell component="th" scope="row">
                              <TextField
                                label="firstName"
                                id="firstName"
                                name="firstName"
                                value={r.firstName}
                                className={classes.textField}
                                onChange={(e) => handleInputChange(e, i)}
                                onBlur={handleBlur}
                                helperText={
                                  errors.description &&
                                  touched.description &&
                                  errors.description
                                }
                                margin="normal"
                              />
                            </TableCell>

                            <TableCell component="th" scope="row">
                              <TextField
                                label="lastName"
                                id="lastName"
                                name="lastName"
                                value={r.lastName}
                                className={classes.textField}
                                onChange={(e) => handleInputChange(e, i)}
                                onBlur={handleBlur}
                                helperText={
                                  errors.qty && touched.qty && errors.qty
                                }
                                margin="normal"
                              />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <TextField
                                label="fullName"
                                id="fullName"
                                name="fullName"
                                value={r.firstName + r.lastName}
                                onChange={(e) => handleInputChange(e, i)}
                                className={classes.textField}
                                onBlur={handleBlur}
                                helperText={
                                  errors.unitPrice &&
                                  touched.unitPrice &&
                                  errors.unitPrice
                                }
                                margin="normal"
                              />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <CreatableSelect
                                id="me"
                                name="me"
                                isClearable
                                //onChange={handleChangeMe}
                                //onInputChange={handleInputChange}
                                options={subsidiaryLedgerAccounts}
                                value={{
                                  value: 5,
                                  label: "batman and superman",
                                }}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <button type="button" onClick={() => editRow(r)}>
                                Edit
                              </button>
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <button
                                type="button"
                                onClick={() => removeRow(r.id)}
                              >
                                Remove
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                    color="secondary"
                    // disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SalesInvoice;
