import React, { Component, useState } from "react";

import CreatableSelect from "react-select/creatable";

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

//type State = {
//  options: [{ string: string }];
//  value: string | void;
//};

const createOption = (label) => ({
  label,
  //value: label.toLowerCase().replace(/\W/g, ""),
  value: label
});

const defaultOptions = [
  createOption("One"),
  createOption("Two"),
  createOption("Three"),
];

const CreatableAdvanced = () => {
  //state = {
  //  isLoading: false,
  //  options: defaultOptions,
  //  value: undefined,
  //};

  const [isLoading, setIsloading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [value, setValue] = useState(undefined);

  const handleChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    //this.setState({ value: newValue });
    setValue(newValue)
  };
  const handleCreate = (inputValue) => {
    //this.setState({ isLoading: true });
    setIsloading(true);
    console.group("Option created");
    console.log("Wait a moment...");
    setTimeout(() => {
      //const { options } = this.state;
      const newOption = createOption(inputValue);
      console.log(newOption);
      console.groupEnd();
      //this.setState({
      //  isLoading: false,
      //  options: [...options, newOption],
      //  value: newOption,
      //});

      setIsloading(false);
      setOptions(newOption);
      setValue(newOption);
    }, 1000);
    handleClose();
  };

  const [open, toggleOpen] = useState(false);
  const handleClose = () => {
    toggleOpen(false);
  };
  const [dialogValue, setDialogValue] = useState({
    name: "",
  });
  //const { isLoading, options, value } = this.state;
  return (
    <>
      <CreatableSelect
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={handleChange}
        onCreateOption={() => toggleOpen(true)}
        options={options}
        value={value}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleCreate}>
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
    </>
  );
};

export default CreatableAdvanced;
