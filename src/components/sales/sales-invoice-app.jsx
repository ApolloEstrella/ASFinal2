import React, { useEffect, useState } from "react";
//import "./App.css";
//import { getUserData } from "./api";
import  SalesInvoice  from "./sales-invoice";

function SalesInvoiceApp() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://localhost:44367/api/sales/GetAccount?id=9088", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((results) => results.json())
      .then((data) => {
        setData(data);
      })
      .catch(function (error) {
        console.log("network error");
      });
  }, []);

  return data ? <SalesInvoice preloadedValues={null} /> : <div>Loading...</div>;
}

export default SalesInvoiceApp;
