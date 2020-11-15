import React, { useState } from 'react';
 
function App() {
 
  const [items, setItems] = useState([]);
 
  // handle click event of the button to add item
  const addMoreItem = () => {
    setItems(prevItems => [...prevItems, {
      id: prevItems.length,
      value: getRandomNumber()
    }]);
    const x = JSON.stringify(items, null, 2);
    console.log(x);
  }
 
  // generate 6 digit random number
  const getRandomNumber = () => {
    return Math.random().toString().substring(2, 8);
  }
 
  const getItems = (x) =>
  {
    alert(x);
  }

  return (
    <div>
      {getItems(JSON.stringify(items, null, 2))}
      <h3>
        useState with an array in React Hooks -{" "}
        <a href="https://www.cluemediator.com">Clue Mediator</a>
      </h3>
      <br />
      <button onClick={() => addMoreItem()}>Add More</button>
      <br></br>
      <label>Output:</label>
    </div>
  );
}
 
export default App;