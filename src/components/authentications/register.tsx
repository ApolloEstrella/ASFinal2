import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  Theme,
  InputLabel,
} from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import bcrypt from "bcryptjs";

import MuiSelect from "@material-ui/core/Select";
import MuiMenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "450px",
      display: "block",
      margin: "0 auto",
    },
    textField: {
      "& > *": {
        width: "100%",
      },
    },
    submitButton: {
      marginTop: "24px",
    },
    button: {
      marginRight: "20px",
    },
    title: { textAlign: "center" },
    successMessage: { color: "green" },
    errorMessage: { color: "red" },
  })
);

interface ISignUpForm {
  user: {
    companyname: string;
    password: string;
    confirmPassword: string;
    email: string;
  };
}

interface IFormStatus {
  message: string;
  type: string;
}

interface IFormStatusProps {
  [key: string]: IFormStatus;
}

const formStatusProps: IFormStatusProps = {
  success: {
    message: "Registered successfully.",
    type: "success",
  },
  duplicate: {
    message: "Email-id already exist. Please use different email-id.",
    type: "error",
  },
  error: {
    message: "Something went wrong. Please try again.",
    type: "error",
  },
};

const SignUp: React.FunctionComponent = () => {
  const classes = useStyles();
  const [displayFormStatus, setDisplayFormStatus] = useState(false);
  const [formStatus, setFormStatus] = useState<IFormStatus>({
    message: "",
    type: "",
  });
  const history = useHistory();

  const handleButtonClick = (pageURL: string) => {
    history.push(pageURL);
  };

  const createNewUser = (data: ISignUpForm, resetForm: Function) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        throw err;
      } else {
        bcrypt.hash(data.user.password, salt, function (err, hash) {
          if (err) {
            throw err;
          } else {
            //console.log(hash);
            const originalPassword = data.user.password;
            data.user.password = hash;
            // API call integration will be here. Handle success / error response accordingly.
            fetch("https://localhost:44302/api/account", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data.user),
            })
              .then(function (response) {
                data.user.password = originalPassword;
                return response.json();
              })
              .then(function (response) {
                console.log(response);
                if (response >= 0) {
                  setFormStatus(formStatusProps.success);
                  resetForm({});
                  setDisplayFormStatus(true);
                } else if (response === -1) {
                  setFormStatus(formStatusProps.duplicate);
                } else {
                  setFormStatus(formStatusProps.error);
                }
              })
              .catch(function (error) {
                console.log("network error");
                setFormStatus(formStatusProps.error);
              });
            setDisplayFormStatus(true);
          }
        });
      }
    });
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          user: {
            companyname: "",
            password: "",
            confirmPassword: "",
            email: "",
          },
        }}
        onSubmit={(values: ISignUpForm, actions) => {
          createNewUser(values, actions.resetForm);
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 500);
        }}
        validationSchema={Yup.object().shape({
          user: Yup.object().shape({
            email: Yup.string().email().required("Email is required!"),
            companyname: Yup.string().required("Please enter Company name"),
            password: Yup.string()
              .matches(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/
              )
              .required(
                "Please valid password. One uppercase, one lowercase, one special character and no spaces"
              ),
            confirmPassword: Yup.string()
              .required("Required")
              .test("password-match", "Password must match", function (value) {
                return this.parent.password === value;
              }),
          }),
        })}
      >
        {(props: FormikProps<ISignUpForm>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            isSubmitting,
          } = props;
          return (
            <Form>
              <h1 className={classes.title}>Register</h1>
              <Grid container justify="space-around" direction="row">
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <InputLabel id="age" style={{fontSize: "13px"}} >Age</InputLabel>
                          <MuiSelect labelId="age" style={{
                              width: "13em", paddingBottom: "4px"
                          }}>
                    <MuiMenuItem value="1">1</MuiMenuItem>
                    <MuiMenuItem value="2">2</MuiMenuItem>
                  </MuiSelect>
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className={classes.textField}
                >
                  <TextField
                    name="user.companyname"
                    id="user.companyname"
                    label="Company Name"
                    value={values.user.companyname}
                    type="text"
                    helperText={
                      errors.user?.companyname && touched.user?.companyname
                        ? errors.user?.companyname
                        : "Enter your Company name."
                    }
                    error={
                      errors.user?.companyname && touched.user?.companyname
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                    name="user.password"
                    id="user.password"
                    label="Password"
                    value={values.user.password}
                    type="password"
                    helperText={
                      errors.user?.password && touched.user?.password
                        ? "Please valid password. One uppercase, one lowercase, one special character and no spaces"
                        : "One uppercase, one lowercase, one special character and no spaces"
                    }
                    error={
                      errors.user?.password && touched.user?.password
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                    name="user.confirmPassword"
                    id="user.confirmPassword"
                    label="Confirm password"
                    value={values.user.confirmPassword}
                    type="password"
                    helperText={
                      errors.user?.confirmPassword &&
                      touched.user?.confirmPassword
                        ? errors.user?.confirmPassword
                        : "Re-enter password to confirm"
                    }
                    error={
                      errors.user?.confirmPassword &&
                      touched.user?.confirmPassword
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                    name="user.email"
                    id="user.email"
                    label="Email-id"
                    value={values.user.email}
                    type="email"
                    helperText={
                      errors.user?.email && touched.user?.email
                        ? errors.user?.email
                        : "Enter email-id"
                    }
                    error={
                      errors.user?.email && touched.user?.email ? true : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
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
                    className={classes.button}
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={isSubmitting}
                    onClick={() => handleButtonClick("/")}
                  >
                    Cancel
                  </Button>
                  {displayFormStatus && (
                    <div className="formStatus">
                      {formStatus.type === "error" ? (
                        <p className={classes.errorMessage}>
                          {formStatus.message}
                        </p>
                      ) : formStatus.type === "success" ? (
                        <p className={classes.successMessage}>
                          {formStatus.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SignUp;
