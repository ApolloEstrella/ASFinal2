import * as React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import configData from "../../config.json";

export class ComponentToPrint extends React.PureComponent {
  render() {
    return (
      <Table
        style={{ width: "400px" }}
        //className={classes.table}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell>File(s) Attachment</TableCell>
            <TableCell align="right">Delete Item</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
           
            <TableRow>
              <TableCell component="th" scope="row">
                 asdfasdfafasdfasf
              </TableCell>
              
            </TableRow>
          
        </TableBody>
      </Table>
    );
  }
}