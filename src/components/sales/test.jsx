import React, {useState} from "react";
import ReactDOM from "react-dom";
//Using React 16.0.0 as per script loaded in Settings
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'pol'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    alert(event.target.value)
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('The value submitted: ' + this.state.value);
    event.preventDefault();
  }

  handleTest() {
    this.setState({ value: "event.target.value" });
  }

  render() {
    return (
      <form>
        <button onClick={()=>this.handleTest()}>test</button>
        <div>Rendered with React 16.0.0</div>
        <div>Outside the React scope, with JS input has preset value</div>
        <div>
          Click submit to see if value is set by JS. Entering value manually
          will change the value of input.
        </div>
        <input
          type="text"
          id="myinput"
          value={this.state.value}
          onChange={this.handleChange}
        />

        <input type="button" value="Submit" />
      </form>
    );
  }
}

ReactDOM.render(
  <NameForm />,
  document.getElementById('root')
);

//Outside the React scope
var input = document.getElementById('myinput');
var event = new Event('input', { bubbles: true});
//Toggling simulated=false or true and will not trigger the value change
event.simulated = true;
input.value = 'JS set Value';
input.defaultValue = 'JS set Value';
input.dispatchEvent(event);





export default NameForm;