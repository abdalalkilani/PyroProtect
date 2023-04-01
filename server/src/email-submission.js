const e = React.createElement;


class EmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

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
        body: JSON.stringify({email : this.state.value})
    };
    fetch('http://13.41.188.158:8080/api/EmailSubmission', requestOptions);
    event.preventDefault();
    }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Email:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
const domContainer = document.querySelector('#form');
if (domContainer) {
    const root = ReactDOM.createRoot(domContainer);
    root.render(e(EmailForm));
} else {
    console.error("Element with id 'test' not found in the HTML");
}