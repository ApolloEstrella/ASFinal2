import React, { useState } from "react";
import {
  Grid,
  TextField,
  Checkbox,
  Button,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import bcrypt from "bcryptjs";
import StorageService from "../../services/storage.service";
import { SET_COMPANY, SET_LOGIN } from "../../actions/companyAction";
import store from "../../store";

const storageService = new StorageService();
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
    email: string;
    password: string;
    rememberMe: boolean;
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
  authenticate: {
    message: "Invalid email or password!",
    type: "error",
  },
  error: {
    message: "Something went wrong. Please try again.",
    type: "error",
  },
};

const Login: React.FunctionComponent = () => {
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
    var statusCode = 200;
    fetch("https://localhost:44302/api/account?email=" + data.user.email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        statusCode = response.status;
        return response.json();
      })
      .then(function (response) {
        const email = response.email;
        const passwordHash = response.password;

        bcrypt.compare(data.user.password, passwordHash, function (
          err,
          isMatch
        ) {
          if (err) {
            throw err;
          } else if (!isMatch) {
            console.log("Password doesn't match!");
            setDisplayFormStatus(true);
            setFormStatus(formStatusProps.authenticate);
          } else {
            if (storageService.secureStorage.getItem("rememberMe") === true) {
              history.push("/");
            } else if (data.user.email === email) {
              store.dispatch({
                type: SET_LOGIN,
                payload: { isLogin: true },
              });

              storageService.secureStorage.setItem("email", data.user.email);

              storageService.secureStorage.setItem("isLogin", true);

              if (data.user.rememberMe) {
                storageService.secureStorage.setItem(
                  "rememberMe",
                  data.user.rememberMe
                );
              } else {
                storageService.secureStorage.removeItem("rememberMe");
              }
              console.log(store.getState().accountReducer.isLogin);
              console.log("User authenticated!");

              //const x = store.getState().accountReducer.email
              history.push("/");
            }
          }
        });
      })
      .catch(function (error) {
        setDisplayFormStatus(true);
        if (statusCode === 204) {
          setFormStatus(formStatusProps.authenticate);
        } else {
          setFormStatus(formStatusProps.error);
        }
      });
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          user: {
            //companyname: "",
            password: "",
            //confirmPassword: "",
            email: "",
            rememberMe: false,
          },
        }}
        onSubmit={(values: ISignUpForm, actions) => {
          createNewUser(values, actions.resetForm);
        }}
        validationSchema={Yup.object().shape({
          user: Yup.object().shape({
            email: Yup.string().email().required("Email is required!"),
            password: Yup.string().required("Password is required!"),
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
              <h1 className={classes.title}>Log In</h1>
              <Grid container justify="space-around" direction="row">
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
                  className={classes.textField}
                >
                  <TextField
                    name="user.password"
                    id="user.password"
                    label="Password"
                    value={values.user.password}
                    type="password"
                    helperText={"Enter Password"}
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
                  //className={classes.textField}
                >
                  <label>Remember Me</label>
                  <Checkbox
                    id="user.rememberMe"
                    name="user.rememberMe"
                    color="primary"
                    onChange={handleChange}
                    value={values.user.rememberMe}
                  ></Checkbox>
                </Grid>

                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.submitButton}
                >
                  <br></br>
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

export default Login;
