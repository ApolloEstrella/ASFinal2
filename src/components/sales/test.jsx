import React, { useState, useEffect } from "react";

const Test = () => {

  const getInvoice = () => {
    fetch("https://localhost:44302/api/sales/getaccount/6048", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        data.customer = data.customer.value
        //getSubsidiaryLedgerAccounts(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }
  return <button onClick={getInvoice}>test</button>;

}

export default Test;