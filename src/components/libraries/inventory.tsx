import React, { useEffect, useState } from "react";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import configData from "../../config.json";
import {
  Grid,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  withStyles,
  Hidden,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    p: {
      marginTop: "0px",
      color: "#bf1650",
      marginBottom: "0px",
    },
  })
);

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name required"),
  productServiceCode: Yup.string().required("Code required"),
  description: Yup.string().required("Description required"),
  //incomeAccount: Yup.object().nullable().required("Income Account required"),
  id: Yup.number(),
});

interface Props {
  closeDialog: any;
  updateList: any;
  rowData: any;
}

export default function EnhancedTable(props: Props) {
  const classes = useStyles();
  const {
    register,
    control,
    handleSubmit,
    errors,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    //mode: "onChange",
    defaultValues: props.rowData === null ? {} : props.rowData,
    resolver: yupResolver(validationSchema),
  });

  const [counterSales, setCounterSales] = useState(0);
  const [selectedRadioValue, setSelectedRadioValue] = useState(props.rowData === null ? "P": props.rowData.type);
  const handleRadioChange = (event: any) => {
    setSelectedRadioValue(event.target.value);
  };

  const initialValues = {
    id: 0,
    type: "P",
    name: "",
    productServiceCode: "",
    description: "",
    incomeAccount: { value: null, label: null },
    expenseAccount: { value: null, label: null },
  };

  const onSubmit = (values: any, e: any) => {
    values.type = selectedRadioValue;
    if (values.type === "S") {
      if (values.expenseAccount !== undefined) {
        values.expenseAccount.value = null;
      }
    }
    var url: string;
    var method: string;

    if (props.rowData === null) {
      url = "inventory/add";
      method = "POST";
    }
    else {
      url = "inventory/update?Id=" + values.id;
      method = "PUT";
    }

    fetch(configData.SERVER_URL + url, {
      method: method,
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        reset(initialValues);
        props.updateList();
        props.closeDialog();
      })
      .catch(function (error) {
        console.log("network error");
      });
  };

  const [salesItems, getSalesItems] = useState([]);

  const handleSelectChange = (e: any, field: string) => {
    setValue(field, e, { shouldValidate: true });
  };

  const handleChange = (e: any, field: string) => {
    //setValue(field, e, { shouldValidate: true }, { shouldDirty: true });
    //handleCostsChange();
  };

  useEffect(() => {
    fetch(configData.SERVER_URL + "chartOfAccount/GetSelect", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        getSalesItems(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, [counterSales]);

  return salesItems.length > 0 ? (
    <Grid container spacing={0} style={{ width: "100%" }}>
      <Grid item xs={12}>
        <form id="inventoryForm" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <TextField
                inputRef={register()}
                name="id"
                value={props.rowData === null ? 0 : props.rowData.id}
                style={{ display: "none" }}
              ></TextField>
              <Controller
                control={control}
                name="type"
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <Radio
                    name="type"
                    inputRef={register()}
                    checked={selectedRadioValue === "P"}
                    onChange={handleRadioChange}
                    value="P"
                  />
                )}
              />{" "}
              Product Type
              <Controller
                control={control}
                name="type"
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <Radio
                    name="type"
                    inputRef={register()}
                    checked={selectedRadioValue === "S"}
                    onChange={handleRadioChange}
                    value="S"
                  />
                )}
              />{" "}
              Service Type
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="name"
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <TextField
                    name="name"
                    inputRef={register()}
                    label="Name"
                    margin="normal"
                    defaultValue={
                      props.rowData === null ? "" : props.rowData.name
                    }
                    variant="outlined"
                    //InputLabelProps={{ shrink: true }}
                    size="small"
                    style={{ width: "100%" }}
                  />
                )}
              />
              <p className={classes.p}>{errors.name?.message}</p>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="productServiceCode"
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <TextField
                    name="productServiceCode"
                    inputRef={register()}
                    label="Product/Service Code"
                    margin="normal"
                    variant="outlined"
                    defaultValue={
                      props.rowData === null
                        ? ""
                        : props.rowData.productServiceCode
                    }
                    size="small"
                    style={{ width: "100%" }}
                  />
                )}
              />
              <p className={classes.p}>{errors.productServiceCode?.message}</p>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="description"
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <TextField
                    name="description"
                    inputRef={register()}
                    label="Description"
                    margin="normal"
                    variant="outlined"
                    defaultValue={
                      props.rowData === null ? "" : props.rowData.description
                    }
                    size="small"
                    style={{ width: "100%" }}
                    multiline
                    rows={3}
                  />
                )}
              />
              <p className={classes.p}>{errors.description?.message}</p>
            </Grid>
            <Grid item xs={12}>
              <h3>Inventory Account</h3>
              <Controller
                control={control}
                name="assetAccount"
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <Select
                    name="assetAccount"
                    onBlur={onBlur}
                    onChange={(e) => handleSelectChange(e, "assetAccount")}
                    inputRef={register()}
                    options={salesItems}
                    //className={classes.reactSelect}
                    placeholder="Please select Inventory Account"
                    // styles={customStyles}
                    isClearable
                    defaultValue={
                      props.rowData === null
                        ? null
                        : salesItems.find(
                            (obj) =>
                              Number(obj["value"]) ===
                              Number(props.rowData.assetAccount.value)
                          )
                    }
                  />
                )}
              />
              <p className={classes.p}>
                {errors?.["incomeAccount"]?.["message"]}
              </p>
            </Grid>
            <Grid item xs={12}>
              <h3>Sales Account</h3>
              <Controller
                control={control}
                name="incomeAccount"
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <Select
                    name="incomeAccount"
                    onBlur={onBlur}
                    onChange={(e) => handleSelectChange(e, "incomeAccount")}
                    inputRef={register()}
                    options={salesItems}
                    //className={classes.reactSelect}
                    placeholder="Please select Sales Items"
                    // styles={customStyles}
                    isClearable
                    defaultValue={
                      props.rowData === null
                        ? null
                        : salesItems.find(
                            (obj) =>
                              Number(obj["value"]) ===
                              Number(props.rowData.incomeAccount.value)
                          )
                    }
                  />
                )}
              />
              <p className={classes.p}>
                {errors?.["incomeAccount"]?.["message"]}
              </p>
            </Grid>
            <Grid item xs={12}>
              <h3>Expense Account</h3>
              <Controller
                control={control}
                name="expenseAccount"
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <Select
                    name="expenseAccount"
                    onBlur={onBlur}
                    onChange={(e) => handleSelectChange(e, "expenseAccount")}
                    inputRef={register()}
                    options={salesItems}
                    //className={classes.reactSelect}
                    placeholder="Please select Expense Account"
                    // styles={customStyles}
                    isClearable
                    //isDisabled={selectedRadioValue === "S" ? true : false}
                    defaultValue={
                      props.rowData === null
                        ? null
                        : salesItems.find(
                            (obj) =>
                              Number(obj["value"]) ===
                              Number(props.rowData.expenseAccount.value)
                          )
                    }
                  />
                )}
              />
              <p className={classes.p}>
                {errors?.["expenseAccount"]?.["message"]}
              </p>
            </Grid>
          </Grid>
          <div style={{ paddingTop: "180px" }}>
            <Grid container justify="flex-end">
              <Button
                type="submit"
                variant="contained"
                autoFocus
                color="primary"
                style={{ right: "auto" }}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="contained"
                autoFocus
                onClick={() => {
                  props.closeDialog();
                }}
                color="primary"
                style={{ marginLeft: "15px" }}
              >
                Close
              </Button>
            </Grid>
          </div>
        </form>
      </Grid>
    </Grid>
  ) : (
    <>loading....</>
  );
}
