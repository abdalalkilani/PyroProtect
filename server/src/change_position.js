const e = React.createElement;


class PositionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: '', y: '' , d:''};

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange1(event) {
    this.setState({x: event.target.value, y: this.state.y, d:this.state.d});
  }
  handleChange2(event) {
    this.setState({y: event.target.value, x: this.state.x, d : this.state.d});
  }
  handleChange3(event) {
    this.setState({d : event.target.value, x : this.state.x, y:this.state.y});
  }
  handleSubmit(event) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({x : this.state.x,
             y : this.state.y,
              device:("station-" + this.state.d)})
    };
    fetch('http://13.41.188.158:8080/api/ChangePosition', requestOptions);
    event.preventDefault();
    }

  render() {
    return (

      <form onSubmit={this.handleSubmit}>
        <label>
          X:
          <input type="number" value={this.state.x} onChange={this.handleChange1} />
          Y:
          <input type="number" value={this.state.y} onChange={this.handleChange2} />
          ID:
          <input type="number" value={this.state.d} onChange={this.handleChange3} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
const domContainer = document.querySelector('#form');
if (domContainer) {
    const root = ReactDOM.createRoot(domContainer);
    root.render(e(PositionForm));
} else {
    console.error("Element with id 'test' not found in the HTML");
}