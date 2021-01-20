import React, { Component } from "react";
import { Formik, Form, useField, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

const Names = (props) => {     
  return (
    <>
      <FieldArray name="names">
        {(arrayHelpers) => (
          <div>
            <button
              onClick={() =>
                arrayHelpers.push({
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  id: "" + Math.random(),
                })
              }
            >
              Add a Name
            </button>
            {props.values.names.map((name, index) => {
              return (
                <div key={name.id}>
                  <TextField
                    label="First Name"
                    name={`names.${index}.firstName`}
                    type="text"
                    placeholder="Enter Your First name"
                  />
                  <TextField
                    label="Middle Name"
                    name={`names.${index}.middleName`}
                    type="text"
                    placeholder="Enter Your Middle name"
                  />
                  <TextField
                    label="Last Name"
                    name={`names.${index}.lastName`}
                    type="text"
                    placeholder="Enter Your Last name"
                  />
                  <button onClick={() => arrayHelpers.remove(index)}>
                    Remove name
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </FieldArray>
    </>
  );
};

export default Names;
