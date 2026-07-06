import React from "react";
import "../styles/Oha.css";
import { Container, Grid, Header, List, Table } from "semantic-ui-react";
import logo from "../image/delete.png";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Audio, Puff, Bars, Hearts, ThreeDots } from "react-loader-spinner";

var tlName;
var clipping = "Clipping";
var twisting = "Twisting";
var pruning = "Pruning";
var dropping = "Dropping";
var deleafing = "Deleafing";
var picking = "Picking";
var pruneArch = "Prune And Arch";
var arching = "Arching";
var density = "Density";

var checkedBox;

var response = [];
var data2 = [];
var dummy = [];

class Oha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamLeaderName: "",
      combinedTLWorkers: "",
      workerName: "",
      adiNumber: "",
      combinedData: [],
      otherTLName: "",
      TL1: [],
      assignJobs: "",
      jobList: [],
      loading: false,
      value: "",
      filteredData: [],
      leaders: [],
      copyFromTL: "",
      showCopyUI: false,
    };

    this.handleWorkersNameChange = this.handleWorkersNameChange.bind(this);
    this.handleAdiChange = this.handleAdiChange.bind(this);
    this.handleTLChange = this.handleTLChange.bind(this);
    this.getTLName = this.getTLName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAsignJobsButton = this.handleAsignJobsButton.bind(this);
    this.handleCopyFromTLChange = this.handleCopyFromTLChange.bind(this);
    this.handleCopyData = this.handleCopyData.bind(this);
  }

  componentDidMount() {
    this.getLeadersFromGoogle();
  }

  getLeadersFromGoogle = () => {
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbyL2lpPLYjuO0dctGfyCjUchA0as1WKMSRPfjliIu5BJfKuzpyJ/exec";
    const url = `${scriptUrl}?callback=ctrlq&action=${"doGetOhaAuditorsName"}`;

    console.log("Fetching leaders from: " + url);
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Leaders received:", responseJson);
        // Handle different response formats
        let leadersArray = [];
        if (Array.isArray(responseJson)) {
          leadersArray = responseJson.map((item) => item.value || item);
        } else if (responseJson && Array.isArray(responseJson.items)) {
          leadersArray = responseJson.items.map((item) => item.value || item);
        } else if (responseJson && Array.isArray(responseJson.data)) {
          leadersArray = responseJson.data.map((item) => item.value || item);
        }
        this.setState({ leaders: leadersArray });
      })
      .catch((error) => {
        console.log("Error fetching leaders:", error);
        this.setState({ leaders: [] });
      });
  };

  getDataFromGoogleSheet = () => {
    this.setState({ loading: true });

    const scriptUrl1 =
      "https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec";
    const url1 = `${scriptUrl1}?callback=ctrlq&action=${"doGetOhaData"}`;

    console.log("URL : " + url1);
    fetch(url1)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ combinedData: responseJson });
        if (responseJson !== null) {
          //TL 1
          const jobAndTeamLeader = (d) =>
            d.TeamLeader === this.state.otherTLName;

          const filteredData =
            this.state.combinedData.items.filter(jobAndTeamLeader);

          const sortedData = filteredData.sort((a, b) =>
            a.Name.localeCompare(b.Name),
          );

          this.setState({ TL1: sortedData });
          //END

          console.log("Names received!!");

          this.getCheckListFromGoogle();
        }
      })
      .catch((error) => {
        this.setState({ combinedData: null });

        console.log(error);
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuu   :");
        this.setState({ loading: false });
      });
  };

  getCheckListFromGoogle = () => {
    console.log("Checklist data from Google in progress..");

    const scriptUrl1 =
      "https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec";
    const url1 = `${scriptUrl1}?callback=ctrlq&action=${"doGetChecklistOhaData"}`;

    console.log("URL : " + url1);
    fetch(url1)
      .then((response) => response.json())
      .then((responseJson) => {
        data2 = responseJson;

        this.setState(
          { jobList: responseJson },

          () => {
            this.afterSetStateFinished(data2);
          },
        );
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  getDataFromGoogleSheetFast = () => {
    // Fast reload - only gets worker data without checklist
    this.setState({ loading: true });

    const scriptUrl1 =
      "https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec";
    const url1 = `${scriptUrl1}?callback=ctrlq&action=${"doGetOhaData"}`;

    console.log("URL (Fast) : " + url1);
    fetch(url1)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ combinedData: responseJson });
        if (responseJson !== null) {
          const jobAndTeamLeader = (d) =>
            d.TeamLeader === this.state.otherTLName;

          const filteredData =
            this.state.combinedData.items.filter(jobAndTeamLeader);

          const sortedData = filteredData.sort((a, b) =>
            a.Name.localeCompare(b.Name),
          );

          this.setState({ TL1: sortedData, loading: false });
          console.log("Worker data reloaded!");
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  handleWorkersNameChange(event) {
    //var str = event.target.value.substring(0, 1).toUpperCase() + event.target.value.substring(1).toLowerCase()
    var str = this.titleCase(event.target.value);
    this.setState({ workerName: str });
  }

  handleTLChange(event) {
    this.setState({
      teamLeaderName: event.target.value,
      combinedTLWorkers: this.state.workerName + " " + event.target.value,
    });
  }

  afterSetStateFinished(data) {
    this.setState({ loading: false });

    response = data;
  }

  getTLName(event) {
    tlName = event.target.value;

    this.setState({ otherTLName: tlName });

    // hide when noething selected

    this.getDataFromGoogleSheet();
  }

  getJobDetails(valueName, valueJob, valueTL, event, deletingLookup) {
    const combinedJobValue = event.target.value;
    this.sendData(
      valueName,
      valueJob,
      valueTL,
      combinedJobValue,
      deletingLookup,
    );
  }

  handleDeleteClick(deleteNames, names) {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1 className="custom-heading">Confirm to delete</h1>
            <p>
              Are you sure you want to delete <strong>{names}</strong> from the
              list.
            </p>
            <button onClick={onClose} className="btn-no">
              No
            </button>
            <button
              className="btn-yes"
              onClick={() => {
                const scriptUrl =
                  "https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec";
                const url = `${scriptUrl}?
                                  callback=ctrlq&action=${"doDeleteOhaNames"}&delete_names=${deleteNames}`;

                console.log("URL : " + url);
                fetch(url, { mode: "no-cors" }).then(() => {
                  this.getDataFromGoogleSheet();

                  console.log(deleteNames + " Deleted");

                  toast.success("Deleted!!");

                  onClose();
                });
              }}
            >
              Yes, Delete it !
            </button>
          </div>
        );
      },
      closeOnClickOutside: false,

      /*title: 'Confirm to delete',
            message: 'Are you sure you want to delete ' + names + ' from the list.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {

                        const scriptUrl = 'https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec';
                        const url = `${scriptUrl}?
              callback=ctrlq&action=${'doDeleteNames'}&delete_names=${deleteNames}`;

                        console.log("URL : " + url);
                        fetch(url, { mode: 'no-cors' }).then(
                            () => {

                                console.log(deleteNames + " Deleted");

                                this.getDataFromGoogleSheet()

                                toast.success("Deleted!!")

                            },
                        );

                    },

                },
                {
                    label: 'No',
                    style: "cancel",
                }
            ],
            closeOnClickOutside: false,*/
    });
  }

  sendData(valueName, valueJob, valueTL, combinedValue, lookupValue) {
    console.log("NAME LIST: " + combinedValue);

    var that = this;

    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec";
    const url = `${scriptUrl}?
        callback=ctrlq&action=${"doPostAssignJobsOhaData"}&assign_jobs_name=${valueName}&assign_jobs_job=${valueJob}&assign_jobs_TL=${valueTL}&assign_jobs=${combinedValue}&lookup_value=${lookupValue}`;
    console.log("URL : " + url);
    fetch(url, { mode: "no-cors" }).then(() => {
      console.log("Data send");
    });
  }

  handleAdiChange(event) {
    this.setState({ adiNumber: event.target.value });
  }

  userExists(name) {
    if (response.length != 0) {
      console.log("Data Available");

      /*response.items.map(function (item) {
              if (item.JobList.includes(name)) {
                console.log(name+ " Yes");
                return true;
              } else {
                console.log(name+ " No");
                return false;
              }
            });*/

      //EXAMPLE

      const employeesUnderIds = response.items.map((item) => item.JobList);

      if (employeesUnderIds.includes(name)) {
        return true;
      }

      //END
    } else {
      console.log("Empty Data");
    }
  }

  handleAsignJobsButton(event) {}

  handleCopyFromTLChange(event) {
    this.setState({ copyFromTL: event.target.value });
  }

  handleCopyData = () => {
    const { copyFromTL, otherTLName } = this.state;

    if (!copyFromTL || copyFromTL === "none") {
      toast.error("Please select a team leader to copy from.");
      return;
    }

    if (copyFromTL === otherTLName) {
      toast.error("Please select a different team leader.");
      return;
    }

    // Show toast and clear dropdowns immediately
    toast.success("Data copied successfully!");
    this.setState({
      copyFromTL: "",
      otherTLName: "",
    });

    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec";
    const url = `${scriptUrl}?callback=ctrlq&action=${"doCopyOhaTLData"}&copy_from_tl=${copyFromTL}&copy_to_tl=${otherTLName}`;

    console.log("URL : " + url);
    fetch(url, { mode: "no-cors" })
      .then(() => {
        console.log("Data copied successfully");
        // Refresh data in background
        this.getDataFromGoogleSheetFast();
      })
      .catch((error) => {
        console.log("Error copying data:", error);
        toast.error("Error copying data. Please try again.");
      });
  };

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.leaders.length === 0) {
      toast.error("Please wait for leaders to load.");
      return;
    }

    if (
      this.state.teamLeaderName === "" ||
      this.state.teamLeaderName === "SELECT" ||
      this.state.teamLeaderName === null
    ) {
      toast.error("Please select team leader from the list.");
      return;
    }

    this.sendDataToGoogleSheet();
  }

  titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });

    const searchQuery = e.target.value.toLowerCase();

    const filteredCountries = this.state.TL1.filter((item) => {
      const searchValue = item.Name.toLowerCase();

      return searchValue.indexOf(searchQuery) > -1;
    });

    this.setState({
      filteredData: filteredCountries,
    });
  };

  sendDataToGoogleSheet = () => {
    var that = this;

    const { workerName } = that.state;
    const { adiNumber } = that.state;

    if (workerName) {
      if (adiNumber) {
        const scriptUrl =
          "https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec";
        const url = `${scriptUrl}?
        callback=ctrlq&action=${"doPostOhaData"}&workers_name=${
          that.state.workerName
        }&adi_number=${that.state.adiNumber}&teamleader_name=${
          that.state.teamLeaderName
        }&combined_name=${that.state.combinedTLWorkers}`;

        console.log("URL : " + url);
        fetch(url, { mode: "no-cors" }).then(() => {
          toast.success("Data Send");
          this.setState({
            workerName: "",
            adiNumber: "",
            teamLeaderName: "",
            combinedTLWorkers: "",
          });

          document.getElementById("name_select").selectedIndex = 0; //1 = option 2
        });
      } else {
        toast.error("Please select team leader from the list.");
      }
    } else {
      toast.error("Please enter ADI number.");
    }
  };

  render() {
    const dataToDisplay = this.state.filteredData.length
      ? this.state.filteredData
      : this.state.TL1;

    if (this.state.loading) {
      return (
        <div className="Oha">
          <div className="OhaLoader">
            <ThreeDots heigth="100" width="100" color="#4CAF50" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="Oha">
          <br />
          <br />
          <form onSubmit={this.handleSubmit}>
            <label>
              Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                className="text-input"
                type="text"
                value={this.state.workerName}
                onChange={this.handleWorkersNameChange}
              />
            </label>

            <br />
            <br />

            <label>
              ADI: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                className="text-input"
                type="text"
                value={this.state.adiNumber}
                onChange={this.handleAdiChange}
              />
            </label>

            <br />
            <br />

            <label>
              TL: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <select
                className="text-input"
                id="name_select"
                name="leaders"
                onChange={this.handleTLChange}
                value={this.state.teamLeaderName || "none"}
                disabled={this.state.leaders.length === 0}
              >
                <option value="none">
                  {this.state.leaders.length === 0 ? "Loading..." : "SELECT"}
                </option>
                {Array.isArray(this.state.leaders) &&
                  this.state.leaders.map((leader, index) => (
                    <option key={index} value={leader}>
                      {leader}
                    </option>
                  ))}
              </select>
            </label>

            <br />
            <br />

            <input className="button-submit" type="submit" />
          </form>

          <br />

          <h3 className="text_header_style">
            Select Teamleader name to assign jobs
          </h3>

          <select
            className="button-dropdown"
            name="leaders"
            onChange={this.getTLName}
            value={this.state.otherTLName || "none"}
            disabled={this.state.leaders.length === 0}
          >
            <option value="none">
              {this.state.leaders.length === 0 ? "Loading..." : "SELECT"}
            </option>
            {Array.isArray(this.state.leaders) &&
              this.state.leaders.map((leader, index) => (
                <option key={index} value={leader}>
                  {leader}
                </option>
              ))}
          </select>

          <br />

          <h3 className="text_header_style2">{this.state.otherTLName}</h3>

          {this.state.TL1.length > 0 ? (
            <input
              className="text-input"
              icon="search"
              value={this.state.value}
              placeholder="SEARCH BY NAME..."
              onChange={this.handleChange}
            />
          ) : null}

          {this.state.TL1.length > 0 ? (
            <form onSubmit={this.handleAsignJobsButton}>
              <div className="align-center">
                <Table singleLine>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell className="align-space">
                        NAME
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        ADI
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        CLIPPING
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        TWISTING
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        PRUNING
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        DROPPING
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        DELEAFING
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        PICKING
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        PRUNE &#38; ARCH
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        ARCHING
                      </Table.HeaderCell>
                      <Table.HeaderCell className="align-space">
                        DENSITY
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <br />

                  <Table.Body>
                    {dataToDisplay.map((el) => {
                      return (
                        <Table.Row key={el.Name}>
                          <Table.Cell className="align-space">
                            {el.Name}
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {el.Adi}
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {" "}
                            <input
                              className="largerCheckbox"
                              type="checkbox"
                              id="Clipping"
                              name={
                                el.Name +
                                " " +
                                clipping +
                                " " +
                                this.state.otherTLName
                              }
                              defaultChecked={this.userExists(
                                el.Name +
                                  " " +
                                  clipping +
                                  " " +
                                  this.state.otherTLName,
                              )}
                              onChange={(e) =>
                                this.getJobDetails(
                                  el.Name,
                                  clipping,
                                  this.state.otherTLName,
                                  e,
                                  el.Name + " " + this.state.otherTLName,
                                )
                              }
                              value={
                                el.Name +
                                " " +
                                clipping +
                                " " +
                                this.state.otherTLName
                              }
                            />
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {" "}
                            <input
                              className="largerCheckbox"
                              type="checkbox"
                              id="Twisting"
                              name={
                                el.Name +
                                " " +
                                twisting +
                                " " +
                                this.state.otherTLName
                              }
                              defaultChecked={this.userExists(
                                el.Name +
                                  " " +
                                  twisting +
                                  " " +
                                  this.state.otherTLName,
                              )}
                              onChange={(e) =>
                                this.getJobDetails(
                                  el.Name,
                                  twisting,
                                  this.state.otherTLName,
                                  e,
                                  el.Name + " " + this.state.otherTLName,
                                )
                              }
                              value={
                                el.Name +
                                " " +
                                twisting +
                                " " +
                                this.state.otherTLName
                              }
                            />
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {" "}
                            <input
                              className="largerCheckbox"
                              type="checkbox"
                              id="Pruning"
                              name={
                                el.Name +
                                " " +
                                pruning +
                                " " +
                                this.state.otherTLName
                              }
                              defaultChecked={this.userExists(
                                el.Name +
                                  " " +
                                  pruning +
                                  " " +
                                  this.state.otherTLName,
                              )}
                              onChange={(e) =>
                                this.getJobDetails(
                                  el.Name,
                                  pruning,
                                  this.state.otherTLName,
                                  e,
                                  el.Name + " " + this.state.otherTLName,
                                )
                              }
                              value={
                                el.Name +
                                " " +
                                pruning +
                                " " +
                                this.state.otherTLName
                              }
                            />
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {" "}
                            <input
                              className="largerCheckbox"
                              type="checkbox"
                              id="Dropping"
                              name={
                                el.Name +
                                " " +
                                dropping +
                                " " +
                                this.state.otherTLName
                              }
                              defaultChecked={this.userExists(
                                el.Name +
                                  " " +
                                  dropping +
                                  " " +
                                  this.state.otherTLName,
                              )}
                              onChange={(e) =>
                                this.getJobDetails(
                                  el.Name,
                                  dropping,
                                  this.state.otherTLName,
                                  e,
                                  el.Name + " " + this.state.otherTLName,
                                )
                              }
                              value={
                                el.Name +
                                " " +
                                dropping +
                                " " +
                                this.state.otherTLName
                              }
                            />
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {" "}
                            <input
                              className="largerCheckbox"
                              type="checkbox"
                              id="Deleafing"
                              name={
                                el.Name +
                                " " +
                                deleafing +
                                " " +
                                this.state.otherTLName
                              }
                              defaultChecked={this.userExists(
                                el.Name +
                                  " " +
                                  deleafing +
                                  " " +
                                  this.state.otherTLName,
                              )}
                              onChange={(e) =>
                                this.getJobDetails(
                                  el.Name,
                                  deleafing,
                                  this.state.otherTLName,
                                  e,
                                  el.Name + " " + this.state.otherTLName,
                                )
                              }
                              value={
                                el.Name +
                                " " +
                                deleafing +
                                " " +
                                this.state.otherTLName
                              }
                            />
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {" "}
                            <input
                              className="largerCheckbox"
                              type="checkbox"
                              id="Picking"
                              name={
                                el.Name +
                                " " +
                                picking +
                                " " +
                                this.state.otherTLName
                              }
                              defaultChecked={this.userExists(
                                el.Name +
                                  " " +
                                  picking +
                                  " " +
                                  this.state.otherTLName,
                              )}
                              onChange={(e) =>
                                this.getJobDetails(
                                  el.Name,
                                  picking,
                                  this.state.otherTLName,
                                  e,
                                  el.Name + " " + this.state.otherTLName,
                                )
                              }
                              value={
                                el.Name +
                                " " +
                                picking +
                                " " +
                                this.state.otherTLName
                              }
                            />
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {" "}
                            <input
                              type="checkbox"
                              id="PruneArch"
                              className="largerCheckbox"
                              name={
                                el.Name +
                                " " +
                                pruneArch +
                                " " +
                                this.state.otherTLName
                              }
                              defaultChecked={this.userExists(
                                el.Name +
                                  " " +
                                  pruneArch +
                                  " " +
                                  this.state.otherTLName,
                              )}
                              onChange={(e) =>
                                this.getJobDetails(
                                  el.Name,
                                  pruneArch,
                                  this.state.otherTLName,
                                  e,
                                  el.Name + " " + this.state.otherTLName,
                                )
                              }
                              value={
                                el.Name +
                                " " +
                                pruneArch +
                                " " +
                                this.state.otherTLName
                              }
                            />
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {" "}
                            <input
                              type="checkbox"
                              id="Arching"
                              className="largerCheckbox"
                              name={
                                el.Name +
                                " " +
                                arching +
                                " " +
                                this.state.otherTLName
                              }
                              defaultChecked={this.userExists(
                                el.Name +
                                  " " +
                                  arching +
                                  " " +
                                  this.state.otherTLName,
                              )}
                              onChange={(e) =>
                                this.getJobDetails(
                                  el.Name,
                                  arching,
                                  this.state.otherTLName,
                                  e,
                                  el.Name + " " + this.state.otherTLName,
                                )
                              }
                              value={
                                el.Name +
                                " " +
                                arching +
                                " " +
                                this.state.otherTLName
                              }
                            />
                          </Table.Cell>
                          <Table.Cell className="align-space">
                            {" "}
                            <input
                              type="checkbox"
                              id="Density"
                              className="largerCheckbox"
                              name={
                                el.Name +
                                " " +
                                density +
                                " " +
                                this.state.otherTLName
                              }
                              defaultChecked={this.userExists(
                                el.Name +
                                  " " +
                                  density +
                                  " " +
                                  this.state.otherTLName,
                              )}
                              onChange={(e) =>
                                this.getJobDetails(
                                  el.Name,
                                  density,
                                  this.state.otherTLName,
                                  e,
                                  el.Name + " " + this.state.otherTLName,
                                )
                              }
                              value={
                                el.Name +
                                " " +
                                density +
                                " " +
                                this.state.otherTLName
                              }
                            />
                          </Table.Cell>
                          <Table.Cell
                            className="align-space-top"
                            onClick={() =>
                              this.handleDeleteClick(
                                el.Name + " " + this.state.otherTLName,
                                el.Name,
                              )
                            }
                            value={el.Name + " " + this.state.otherTLName}
                          >
                            {" "}
                            <img src={logo} />{" "}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>

                  <br />
                  <br />
                </Table>
              </div>
            </form>
          ) : (
            this.state.otherTLName && (
              <div className="align-center">
                <h3 style={{ color: "#d32f2f", marginTop: "20px" }}>
                  No data found for {this.state.otherTLName}
                </h3>
                <p>Would you like to copy data from another Team Leader?</p>
                <p
                  style={{
                    backgroundColor: "#fff3cd",
                    padding: "10px",
                    borderRadius: "5px",
                    color: "#856404",
                    fontSize: "14px",
                  }}
                >
                  <strong>Note:</strong> Copy may take up to 5 minutes. Refresh
                  the page to check if copied.
                </p>

                <label style={{ marginRight: "10px" }}>
                  Copy from:
                  <select
                    className="text-input"
                    name="copyFromTL"
                    onChange={this.handleCopyFromTLChange}
                    value={this.state.copyFromTL || "none"}
                    style={{
                      marginLeft: "10px",
                      width: "250px",
                      minWidth: "250px",
                    }}
                  >
                    <option value="none">SELECT</option>
                    {Array.isArray(this.state.leaders) &&
                      this.state.leaders.map((leader, index) => (
                        <option key={index} value={leader}>
                          {leader}
                        </option>
                      ))}
                  </select>
                </label>

                <br />
                <br />

                <button
                  className="button-submit"
                  onClick={this.handleCopyData}
                  type="button"
                >
                  Copy Data
                </button>
              </div>
            )
          )}
          <br />
          <br />
        </div>
      );
    }
  }
}

export default Oha;
