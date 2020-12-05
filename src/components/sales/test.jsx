import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  useMediaQuery,
  InputLabel,
  IconButton,
  useTheme,
} from "@material-ui/core";

import { Field, FieldArray, FieldProps, Form, Formik, getIn, ErrorMessage} from "formik";
import React, { useState, useEffect } from "react";
import ReactSelect from "../controls/reactSelect";
import * as yup from "yup";

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
        paddingTop: "5px",
        zIndex: "0",
      },
    },
    textField2: {
      "& > *": {
        width: "100%",
        //paddingTop: ".5px",
        //marginTop: "2px"
      },
    },
    ReactSelect: {
      paddingTop: "50px",
      zIndex: "5",
    },

    myTable: {
      width: "500px",
    },
    submitButton: {
      marginTop: "24px",
    },
    deleteButton: {
      marginLeft: "15px",
    },
    title: { textAlign: "center" },
    successMessage: { color: "green" },
    errorMessage: { color: "red" },
  })
);


const validationSchema = yup.object().shape({
  customer2: yup.string().nullable().required("Enter Customer"),
  people: yup.array().of(
    yup.object().shape({
      firstName: yup.string().required("enter first name"),
      lastName: yup.string().required("enter last name"),
      name: yup.string().nullable().required("enter name"),
    })
  ),
});

const Input = ({ field, form: { errors } }) => {
  const errorMessage = getIn(errors, field.name);

  return (
    <>
      <TextField {...field} />
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </>
  );
};

const onSubmit = (values, e) =>
{ 
  console.log(JSON.stringify(values))
  }


const App = () => {
  const classes = useStyles();
  const [itemCount, setItemCount] = useState(-2);
  //const [people, setPeople] = useState([{ id: "5", firstName: "bob", lastName: "bob2", name: "" }]);
  return (
    <div style={{ textAlign: "center" }}>
      <button>add</button>
      <Formik
        initialValues={{
          id: -1,
          customer2: null,
          billingAddress: "",
          invoiceNo: "",
          date: new Date(),
          dueDate: new Date(),
          terms: "",
          reference: "",
          people: [],
        }}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched }) => (
          <Form onSubmit={onSubmit}>
            <ReactSelect
              label="Customer2"
              name="customer2"
              type="text"
              options={[
                { value: "1", label: "abc" },
                { value: "2", label: "def" },
              ]}
              value={values.customer2}
              helperText={
                errors.customer2 && touched.customer2 && errors.customer2
              }
              error={errors.customer2 && touched.customer2}
            />
            <span className={classes.errorMessage}>
              <ErrorMessage name="customer2" />
            </span>
            <FieldArray name="people">
              {({ push, remove, touched }) => (
                <div>
                  {values.people.map((p, index) => {
                    return (
                      <div key={index}>
                        <ReactSelect
                          label="Customer"
                          id="customer"
                          name={`people[${index}].name`}
                          type="text"
                          options={[
                            { value: "1", label: "abc" },
                            { value: "2", label: "def" },
                          ]}
                          //value={values.customer}
                          //helperText={
                          //  errors.customer &&
                          //  touched.customer &&
                          //  errors.customer
                          //}
                          //error={errors.customer && touched.customer}
                        />
                        <span className={classes.errorMessage}>
                          <ErrorMessage name={`people[${index}].name`} />
                        </span>
                        
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    onClick={() =>
                      push({
                        id: setItemCount(itemCount - 1),
                        firstName: "",
                        lastName: "",
                      })
                    }
                  >
                    add to list
                  </Button>
                </div>
              )}
            </FieldArray>
            <div>
              <Button type="submit">submit</Button>
            </div>
            
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
