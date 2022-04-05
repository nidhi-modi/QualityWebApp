import React, { Component } from 'react';
import logo1 from './image/logo1.png';
import logo2 from './image/logo2.png';
import './styles/App.css';
import Ger from './screens/Ger'
import Har from './screens/Har'
import Oha from './screens/Oha'
import Rep from './screens/Rep'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'





export default class App extends Component {

  constructor() {
    super();
    this.state = {
      site: '',
      job: '',

    };
    //SITE SELECTION
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    //JOB SELECTION
    this.handleJobSelect = this.handleJobSelect.bind(this);
    this.handleJobSubmit = this.handleJobSubmit.bind(this);
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({ site: event.target.value });
  }

  handleSubmit(event) {

    event.preventDefault();
    console.log(this.state.site);
    this.handleSite();

  }

  handleJobSelect(event) {
    this.setState({ job: event.target.value });
  }

  handleJobSubmit(event) {
    event.preventDefault();
    console.log(this.state.job);
  }

  handleSite() {

    if (this.state.site === "OHA") {

      return <Oha />

    } else if (this.state.site === "HAR") {

      return <Har />

    } else if (this.state.site === "GER") {

      return <Ger />

    } else if (this.state.site === "REP") {

      return <Rep />

    } else {


    }
  }

  render() {
    return (
      <div className="App">

        <ToastContainer
          autoClose={2000} />

        <header className="App-header">

          <img src={logo1} className="App-logo" alt="logo" />
          <img src={logo2} className="App-logo2" alt="logo" />

        </header>


        <h2 className="App-heading">
          Please select what site are you from?
        </h2>


        <form onSubmit={this.handleSubmit}>

          <div class="radio-group">
            <label>
              <input
                type="radio"
                value="HAR"
                checked={this.state.site === "HAR"}
                onChange={this.handleChange}
              />HAR
            </label>

            <span className="space-between-radio" ></span>

            <label>
              <input
                type="radio"
                value="GER"
                checked={this.state.site === "GER"}
                onChange={this.handleChange}
              />GER
            </label>

            <span className="space-between-radio" ></span>

            <label>
              <input
                type="radio"
                value="OHA"
                checked={this.state.site === "OHA"}
                onChange={this.handleChange}
              />OHA
            </label>

            <span className="space-between-radio" ></span>

            <label>
              <input
                type="radio"
                value="REP"
                checked={this.state.site === "REP"}
                onChange={this.handleChange}
              />REP
            </label>
          </div>
        </form>

        {this.handleSite()}


      </div>
    );
  }
}
