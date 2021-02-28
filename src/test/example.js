// TODO: why does the dev build not pick this up automatically?
// https://github.com/microsoft/TypeScript-React-Starter/issues/12#issuecomment-369113072
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../index.d.ts'/>

import * as React from "react";

 


class ComponentToPrint extends React.PureComponent {
  

  render() {
    return (
      <div style={{ marginTop: "50px", marginLeft: "-180px"}}>abcdef</div>
    )
  }
} 
export default ComponentToPrint;