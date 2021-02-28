import React, { useState, useEffect, useRef } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import configData from "../../config.json";
import NumberFormat from "react-number-format";

export class ComponentToPrint extends React.Component {
  state = { invoiceData: {}, items: [{}], counter: 0 };

  static getDerivedStateFromProps(props, state) {
    return (state.invoiceData = props.loadInfo);
  }

  render() {
    return (
      <>
        {this.state.hasOwnProperty("invoiceData") &&
        this.state.invoiceData !== undefined ? (
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <h1>SALES INVOICE</h1>
            <div
              style={{
                textAlign: "left",
                //paddingLeft: "300px",
                marginLeft: "-170px",
                marginTop: "30px",
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td style={{ paddingRight: "5px" }}>
                      <h3>CUSTOMER: </h3>
                    </td>
                    <td style={{ paddingRight: "5px" }}>
                      <h3>{this.state.invoiceData.customerName}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3>ADDRESS:</h3>
                    </td>
                    <td style={{ paddingTop: "0px" }}>
                      <h3>{this.state.invoiceData.billingAddress}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "140px" }}>
                      <h3>INVOICE NO:</h3>
                    </td>
                    <td style={{ paddingTop: "0px" }}>
                      <h3>{this.state.invoiceData.invoiceNo}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "140px" }}>
                      <h3>DATE:</h3>
                    </td>
                    <td style={{ paddingTop: "0px" }}>
                      <h3>{this.state.invoiceData.invoiceDate}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "140px" }}>
                      <h3>DUE DATE:</h3>
                    </td>
                    <td style={{ paddingTop: "0px" }}>
                      <h3>{this.state.invoiceData.dueDate}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "140px" }}>
                      <h3>TERMS:</h3>
                    </td>
                    <td style={{ paddingTop: "0px" }}>
                      <h3>{this.state.invoiceData.terms}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "140px" }}>
                      <h3>REFERENCE:</h3>
                    </td>
                    <td style={{ paddingTop: "0px" }}>
                      <h3>{this.state.invoiceData.reference}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "140px" }} colSpan="2">
                      <table style={{ width: "120%" }}>
                        <tbody>
                          <tr>
                            <td>Sales Item</td>
                            <td>Description</td>
                            <td>Qty</td>
                            <td>Unit Price</td>
                            <td>Sub Total</td>
                            <td>Tracking</td>
                          </tr>
                          {this.state.items.map((item, i) => {
                            return [
                              <tr key={i}>
                                <td>{item.salesItem}</td>
                                <td>{item.description}</td>
                                <td>
                                  <NumberFormat
                                    value={item.quantity}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                  />
                                </td>
                                <td>
                                  <NumberFormat
                                    value={item.unitPrice}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                  />
                                </td>

                                <td>
                                  <NumberFormat
                                    value={item.subTotal}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                  />
                                </td>

                                <td>{item.trackingItem}</td>
                              </tr>,
                            ];
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
                <tfoot></tfoot>
              </table>
            </div>
          </div>
        ) : (
          "ok"
        )}
      </>
    );
  }
}

export default ComponentToPrint;
