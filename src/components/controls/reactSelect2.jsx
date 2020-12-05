//import "./formik-demo.css";
import React from "react";
import { withFormik } from "formik";
import * as Yup from "yup";

import CreatableSelect from "react-select";
//import "react-select/dist/react-select.css";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    topic: Yup.string().ensure().required("Topic is required!"),
  }),
  mapPropsToValues: (props) => ({
    topic: "",
  }),
});

const MyForm = ({ options, label, value, ...props }) => {
  const {
    values,
    touched,
    dirty,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = props;
  return (
    <MySelect
      value={values.topic}
      onChange={setFieldValue}
      onBlur={setFieldTouched}
      error={errors.topic}
      touched={touched.topic}
      options={options}
    />
  );
};

 

class MySelect extends React.Component {
  handleChange = (value) => {
    // this is going to call setFieldValue and manually update values.topcis
    this.props.onChange("topic", value);
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    this.props.onBlur("topic", true);
  };

  render() {
    return (
      <div style={{ margin: "1rem 0" }}>
        <label htmlFor="color">Topic</label>
        <CreatableSelect
          id="color"
          options={this.props.options}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />
        {!!this.props.error && this.props.touched && (
          <div style={{ color: "red", marginTop: ".5rem" }}>
            {this.props.error}
          </div>
        )}
      </div>
    );
  }
}

const MyEnhancedForm = formikEnhancer(MyForm);

export default MyEnhancedForm;
 
