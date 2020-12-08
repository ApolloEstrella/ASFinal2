import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useFormikContext, useField } from "formik";
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

const ReactSelect = ({ options, label, value, ...props }) => {
  //console.log("value=> " + value.value + " label=>" + value.label);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);
  const [open, toggleOpen] = useState(false);

  const handleClose = () => {
    toggleOpen(false);
  };
  const [dialogValue, setDialogValue] = useState({
    name: "",
  });
  /**
   * Will manually set the value belong to the name props in the Formik form using setField
   */
  function handleOptionChange(selection) {
    setFieldValue(props.name, selection);
  }

  /**
   * Manually updated the touched property for the field in Formik
   */
  function updateBlur() {
    setFieldTouched(props.name, true);
  }

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

  return (
    <React.Fragment>
      <CreatableSelect
        styles={customStyles}
        options={options}
        {...field}
        {...props}
        onBlur={updateBlur}
        onChange={handleOptionChange}
        onCreateOption={() => toggleOpen(true)}
        //value={options.find((obj) => obj  === value)}
        //value={options.find((obj) => obj.value === value)}
        value={value === null ? null : options.find((obj) => obj.value === value)}
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
        <form>
          <DialogTitle id="form-dialog-title">Add a new Customer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Customer does not exists. Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              fullWidth
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label="name"
              type="text"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default ReactSelect;
