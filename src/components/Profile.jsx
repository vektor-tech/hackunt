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
      isLoading: false
    };

    this.onImageChange = this.onImageChange.bind(this);
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

    const options = { encrypt: true };
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
      writeFile(files[0].name, reader.result, { encrypt: true })
        .then(this.fetchData())
        .finally(() => this.setState({ isLoading: false }));
    }.bind(this);
    reader.readAsDataURL(files[0]);

    // console.log(files[0]);
  }

  downloadFile(filename) {
    // download file
    readFile(filename, { decrypt: true }).then(res => {
      this.setState({ currentImage: res });
    });
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    return !isSignInPending() ? (
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img
            src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage}
            className="img-rounded avatar"
            id="avatar-image"
          />
        </div>
        <h1>
          Hello,{" "}
          <span id="heading-name">
            {person.name() ? person.name() : "Nameless Person"}
          </span>
          !
        </h1>
        {this.state.currentImage &&
          (this.state.currentImage.startsWith("data:image") ? (
            <img style={{ height: "30vh" }} src={this.state.currentImage} />
          ) : (
            <div>{this.state.currentImage}</div>
          ))}
        <div className="new-status">
          <div className="col-md-12 statuses">
            {this.state.isLoading && <span>Loading...</span>}
            {this.state.statuses.map(status => (
              <div
                className="status"
                key={status.id}
                onClick={() => this.downloadFile(status)}
              >
                {status}
              </div>
            ))}
          </div>
          <div className="col-md-12" />
          <div className="col-md-12">
            <input
              type="file"
              onChange={this.onImageChange}
              className="btn btn-primary btn-lg"
            />
          </div>
          {/* <div className="col-md-12">
            <button
              className="btn btn-primary btn-lg"
              onClick={e => this.handleNewStatusSubmit(e)}
            >
              Submit
            </button>
          </div> */}
        </div>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={handleSignOut.bind(this)}
          >
            Logout
          </button>
        </p>
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
