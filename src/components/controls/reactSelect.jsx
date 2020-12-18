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
  const [openSales, toggleOpenSales] = useState(false);
  const [openTax, toggleOpenTax] = useState(false);
  const [openTracking, toggleOpenTracking] = useState(false);

  const handleClose = () => {
    setBillingAddress({ address: "" });
    toggleOpen(false);
  };

  const handleCloseSales = () => {
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
  /**
   * Will manually set the value belong to the name props in the Formik form using setField
   */
  function handleOptionChange(selection) {
    setFieldValue(props.name, selection);
    if (accountType === "INV") {
      setDialogValue(selection.label);
      loadBillingAddress(selection.value);
    }
    if (myValues !== undefined) handleBake(myValues, selection, props.name);
  }

  function handleBake(evt, selection) {
    props.functionBake(evt, selection, props.name); // calling function from parent class and giving argument as a prop
  }

  function loadSubsidiaryLedger() {
    props.refreshSL();
  }

  function loadSales() {
    props.refreshSales();
  }

  function loadTax() {
    props.refreshTax();
  }

  function loadTracking() {
    props.refreshTracking();
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

  function handleNewSales(values) {
    fetch("https://localhost:44302/api/IncomeItem/addaccount", {
      method: "POST",
      body: JSON.stringify({
        id: 0,
        name: values.name,
        sku: values.sku,
        description: values.description,
        incomeAccountId: 6054, //values.incomeAccountId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        loadSales();
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
        loadTax();
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
      loadTracking();
      handleCloseTracking();
    });
}

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
    incomeAccountId: 6054,
  };

  const initialTaxValues = {
    description: dialogValueTax.description,
    rate: 0,
  };

  const initialTrackingValues = {
    description: dialogValueTracking.description
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
          if (accountType === "INV") {
            setDialogValue({ name: inputValue });
            toggleOpen(true);
          } else if (accountType === "SALES") {
            setDialogValueSales({ name: inputValue });
            toggleOpenSales(true);
          } else if (accountType === "TAX") {
            setDialogValueTax({ description: inputValue });
            toggleOpenTax(true);
          } else if (accountType === "TRACKING") {
            setDialogValueTracking({ description: inputValue });
            toggleOpenTracking(true);
          }
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
              handleNewSales(values);
            }}
            validationSchema={validationSchemaSales}
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
                  <TextField
                    id="sku"
                    label="SKU"
                    name="sku"
                    value={values.sku}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    rowsMax={4}
                    variant="outlined"
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
                    rows={2}
                    rowsMax={4}
                    variant="outlined"
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
    </React.Fragment>
  );
};

export default ReactSelect;
