import React, { useState } from "react";
import $ from "jquery";
function App() {
  const [inputList, setInputList] = useState([{ firstName: "", lastName: "" }]);

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
    //$("#fullName").val(
    //  $("#firstName").val() + $("#lastName").val()
    //);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { firstName: "", lastName: "" }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault()
  };

  return (
    <div className="App">
      <h3>
        <a href="https://cluemediator.com">Clue Mediator</a>
      </h3>
      <form onSubmit={handleSubmit}>
        {inputList.map((x, i) => {
          return (
            <div className="box" key={i}>
              <input
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
                value={x.firstName}
                onChange={(e) => handleInputChange(e, i)}
              />
              <input
                className="ml10"
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
                value={x.lastName}
                onChange={(e) => handleInputChange(e, i)}
              />
              <input
                className="ml10"
                id="fullName"
                name="fullName"
                value={x.firstName + x.lastName}
                onChange={(e) => handleInputChange(e, i)}
              />
              <div className="btn-box">
                {inputList.length !== 1 && (
                  <button className="mr10" onClick={() => handleRemoveClick(i)}>
                    Remove
                  </button>
                )}
                {inputList.length - 1 === i && (
                  <button onClick={handleAddClick}>Add</button>
                )}
              </div>
            </div>
          );
        })}
        <button type="submit">Submit</button>
      </form>
      <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
    </div>
  );
}

export default App;
