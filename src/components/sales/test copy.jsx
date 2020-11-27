import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import $ from "jquery";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

/*const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];*/

export default function DenseTable() {
  const classes = useStyles();
  const [rows, setRow] = useState([]);

  const [rowId, setRowId] = useState(-1);

  const AddItem = () => {
    setRowId(rowId - 1);
    setRow([
      ...rows,
      { id: rowId, name: "janpol", description: "one" },
      // { name: "janpol2", description: "two" },
    ]);
  };

  

  const handleSubmit = (values, event) => {
    console.log(values);
  };

  const removeRow = (id) => {
    var result = $.grep(rows, function (e, i) {
      return +e.id !== id;
    });
    setRow(result)
    console.log(rows);
  };

  return (
    <>
      <button onClick={AddItem}>New</button>
      <Formik
        initialValues={{
          id: 0,
          name: "",
          description: "",
        }}
        onSubmit={(values) => {
          console.log({ info: { master: values, detail: rows } });
          //await new Promise((r) => setTimeout(r, 500));
          //alert(JSON.stringify(values, null, 2));
        }}
      >
        <Form>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <button onClick={() => removeRow(row.id)}>Remove</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <button type="submit" value="submit">
            Submit
          </button>
        </Form>
      </Formik>
    </>
  );
}
