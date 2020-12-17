import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Formik, Form, ErrorMessage, useFormikContext, useField } from "formik";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import * as Yup from "yup";

const ReactSelect = ({
  options,
  label,
  value,
  myValues,
  accountType,
  ...props
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "30px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "38px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "5px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "5px",
    }),
  };

  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);
  const [open, toggleOpen] = useState(false);
  const { handleChangeAmount } = props;
  const handleClose = () => {
    setBillingAddress({ address: "" });
    toggleOpen(false);
  };
  const [dialogValue, setDialogValue] = useState({
    name: "",
    billingAddress: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    address: "",
  });
  /**
   * Will manually set the value belong to the name props in the Formik form using setField
   */
  function handleOptionChange(selection) {
    setFieldValue(props.name, selection);
    setDialogValue(selection.label);
    if (accountType === "INV") loadBillingAddress(selection.value);
    if (myValues !== undefined) handleBake(myValues, selection, props.name);
  }

  function handleBake(evt, selection) {
    props.functionBake(evt, selection, props.name); // calling function from parent class and giving argument as a prop
  }

  function loadSubsidiaryLedger() {
    props.refreshSL();
  }

  function loadBillingAddress(id) {
    props.loadBillingAddress(id);
  }
  /**
   * Manually updated the touched property for the field in Formik
   */
  function updateBlur() {
    setFieldTouched(props.name, true);
  }

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
        loadSubsidiaryLedger();
        handleClose();
      });
  }

  const validationSchemaCustomer = Yup.object().shape({
    name: Yup.string().required("Enter Customer Name."),
    //billingAddress: Yup.string().required("Enter Billing Address."),
  });  


  const initialCustomerValues = {
    name: dialogValue.name,
    billingAddress: "",
  };
  return (
    <React.Fragment>
      <CreatableSelect
        styles={customStyles}
        options={options}
        {...field}
        {...props}
        //formatCreateLabel={(inputValue) => setDialogValue(inputValue)}
        onBlur={updateBlur}
        onChange={handleOptionChange}
        onCreateOption={(inputValue) => {
          setDialogValue({ name: inputValue });
          toggleOpen(true);
        }}
        //value={options.find((obj) => obj  === value)}
        //value={options.find((obj) => obj.value === value)}
        value={
          value === null ? null : options.find((obj) => obj.value === value)
        }
        isClearable
      />
      {meta.touched && meta.error ? (
        <span className="custom-input-error">{meta.error.value}</span>
      ) : null}

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
            //onSubmit={() => alert("submittsdfdsafadsf")}
            onSubmit={(values, { resetForm }) => { handleNewCustomer(values.name,values.billingAddress)} }
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
                    //onBlur={handleBlur}
                    //helperText={
                    //  errors.description && touched.description && errors.description
                    //}
                    margin="normal"
                    multiline
                    rows={4}
                    rowsMax={4}
                    variant="outlined"
                  />
                  <Button
                    type="submit"
                    //onClick={() => handleNewCustomer()}
                    color="primary"
                  >
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
    </React.Fragment>
  );
};

export default ReactSelect;
