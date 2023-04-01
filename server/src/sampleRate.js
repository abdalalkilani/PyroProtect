const e = React.createElement;

class SampleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 5};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({sample : this.state.value})
    };
    fetch('http://13.41.188.158:8080/api/SampleRateChange', requestOptions);
    event.preventDefault();
    }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          SampleRate:
          <input type="number" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
const domContainer2 = document.querySelector('#form');
if (domContainer2) {
    const root = ReactDOM.createRoot(domContainer2);
    root.render(e(SampleForm));
} else {
    console.error("Element with id 'test' not found in the HTML");
}