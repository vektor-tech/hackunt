import React, { Component } from "react";
// import ImageLoader from "react-image-file"
import { writeFile, readFile } from "blockstack-large-storage";
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile,
  listFiles
} from "blockstack";
import { height } from "window-size";

const avatarFallbackImage =
  "https://s3.amazonaws.com/onename/avatar-placeholder.png";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentImage: "",
      doctorName: "",
      files: [],
      person: {
        name() {
          return "Anonymous";
        },
        avatarUrl() {
          return avatarFallbackImage;
        }
      },
      username: "",
      newStatus: "",
      statuses: [],
      statusIndex: 0,
      isLoading: false,
      shareResult: "",
      secretPhrase: "",
      patientUsername: ""
    };

    this.onImageChange = this.onImageChange.bind(this);
    this.onDoctorView = this.onDoctorView.bind(this);
  }

  handleNewStatusChange(event) {
    this.setState({ newStatus: event.target.value });
  }

  handleNewStatusSubmit(event) {
    this.saveNewStatus(this.state.newStatus);
    this.setState({
      newStatus: ""
    });
  }

  saveNewStatus(statusText) {
    let statuses = this.state.statuses;

    let status = {
      id: this.state.statusIndex++,
      text: statusText.trim(),
      created_at: Date.now()
    };

    statuses.unshift(status);

    const options = { encrypt: false };
    putFile("statuses.json", JSON.stringify(statuses), options).then(() => {
      this.setState({
        statuses: statuses
      });
    });
  }

  fetchData() {
    this.setState({ isLoading: true });
    listFiles(name => {
      this.setState(function(state, _) {
        return {
          person: state.person || new Person(loadUserData().profile),
          username: state.username || loadUserData().username,
          statusIndex: state.statuses.length + 1,
          statuses: [name, ...state.statuses]
        };
      });
      return true;
    })
      .then(res => console.log("res", res))
      .catch(err => console.error(err))
      .finally(() => this.setState({ isLoading: false }));
  }

  onImageChange(e) {
    const files = Array.from(e.target.files);
    this.setState({ isLoading: true });

    let reader = new FileReader();
    reader.onloadend = function() {
      // console.log(reader.result);
      writeFile(files[0].name, reader.result, { encrypt: false })
        .then(this.fetchData())
        .finally(() => this.setState({ isLoading: false }));
    }.bind(this);
    reader.readAsDataURL(files[0]);
  }

  downloadFile(filename) {
    // download file
    readFile(filename, { decrypt: false }).then(res => {
      this.setState({ currentImage: res });
    });
  }

  onDoctorView() {
    // this.state.secretPhrase; this.state.username

    console.log(
      `DoctorView: this.state.secretPhrase, ${
        this.state.secretPhrase
      }, this.state.username, ${this.state.username}`
    );

    // let client2 = "https://us-central1-dhcs2-236915.cloudfunctions.net/encrypt_message"

    let url =
      "https://us-central1-dhcs2-236915.cloudfunctions.net/decrypt_message";

    if (this.state.patientUsername.startsWith("sl_")) {
      url =
        "https://us-central1-dhcs-236902.cloudfunctions.net/decrypt_message";
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        encrypted: this.state.secretPhrase,
        doctor: this.state.username.split(".")[0]
      })
    })
      .then(msg => msg.json())
      .then(data => this.setState({ currentImage: data.result }));
  }

  onShare(filename) {
    //
    if (!filename || !this.state.doctorName) return;

    console.log(filename, this.state.doctorName);

    let url =
      "https://us-central1-dhcs2-236915.cloudfunctions.net/encrypt_message";

    if (this.state.username.startsWith("sl_")) {
      url =
        "https://us-central1-dhcs-236902.cloudfunctions.net/encrypt_message";
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        file: filename,
        doctor: this.state.doctorName
      })
    })
      .then(msg => msg.json())
      .then(data => this.setState({ shareResult: data.result }));
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    return !isSignInPending() ? (
      <div className="panel-welcome" id="section-2">
        <div className="left">
          <div className="avatar-section">
            <img
              src={
                person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage
              }
              className="img-rounded avatar"
              id="avatar-image"
            />
          </div>
          <h1>
            Hello,{" "}
            <span id="heading-name">
              {this.state.username.split(".")[0] || "Dude"}
            </span>
            !
          </h1>
          <p className="lead">
            <button
              className="btn btn-primary btn-lg"
              id="signout-button"
              onClick={handleSignOut.bind(this)}
            >
              Logout
            </button>
          </p>
          <div className="result-div">
            {this.state.currentImage &&
              (this.state.currentImage.startsWith("data:image") ? (
                <img style={{ height: "30vh" }} src={this.state.currentImage} />
              ) : (
                <textarea
                  style={{ height: "100%", width: "100%", marginLeft: 15 }}
                >
                  {this.state.currentImage}
                </textarea>
              ))}
          </div>
          {!this.state.username.startsWith("dr") && (
            <div className="image-doctor">
              <input
                type="file"
                onChange={this.onImageChange}
                className="btn btn-primary btn-lg"
              />
              <input
                type="text"
                placeholder="Doctor's Name"
                onChange={e => this.setState({ doctorName: e.target.value })}
              />
            </div>
          )}
        </div>
        <div className="new-status">
          {this.state.shareResult && <p>{this.state.shareResult}</p>}
          <div className="col-md-12 statuses">
            {this.state.isLoading && <span>Loading...</span>}
            {!this.state.username.startsWith("dr") &&
              this.state.statuses.map(status => (
                <div className="status" key={status.id}>
                  <p style={{ marginLeft: 5 }}>{status}</p>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => this.downloadFile(status)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => this.onShare(status)}
                  >
                    Share
                  </button>
                </div>
              ))}
          </div>
          {this.state.username.startsWith("dr") && (
            <div className="doctor-view">
              <input
                type="text"
                placeholder="File Secret Phrase"
                onChange={e => this.setState({ secretPhrase: e.target.value })}
              />
              <input
                type="text"
                placeholder="Patient's Username"
                onChange={e =>
                  this.setState({ patientUsername: e.target.value })
                }
              />
              <button
                className="btn btn-primary btn-lg"
                onClick={this.onDoctorView}
              >
                View Patient File
              </button>    
            </div>
          )}
          <div className="col-md-12" />
        </div>
      </div>
    ) : null;
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
      username: loadUserData().username
    });
  }
}
