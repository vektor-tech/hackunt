import React, { Component } from "react";
import { writeFile, readFile } from "blockstack-large-storage";
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  listFiles
} from "blockstack";
import * as cryptico from "cryptico";
import { putFile } from "blockstack/lib/storage";

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
      isLoading: false,
      patientFilename: "",
      patientUsername: ""
    };

    this.onImageChange = this.onImageChange.bind(this);
    this.onDoctorView = this.onDoctorView.bind(this);
  }

  // gets list of files from user's gaia hub
  fetchData() {
    this.setState({ isLoading: true, files: [] });

    listFiles(name => {
      this.setState({
        files: [name, ...this.state.files]
      });
      return true;
    })
      .then(res => console.log("Number of files: ", res))
      .catch(err => console.error(err))
      .finally(() => {
        this.setState({ isLoading: false });
        // checks if public & private files exists for the user
        this.initialSetup();
      });
  }

  initialSetup() {
    // check for public & private

    let found = 0;

    for (let file of this.state.files) {
      if (file == "public.json" || file == "private.json") found++;
    }

    // if not found generate public & private
    if (found != 2) {
      // now use RSA

      let passphrase = loadUserData().appPrivateKey;

      let privatekey = cryptico.generateRSAKey(passphrase, 1024);

      let publickey = cryptico.publicKeyString(privatekey);

      putFile("private.json", JSON.stringify(privatekey), { encrypt: true })
        .then(res => console.log(res))
        .catch(err => console.error(err));

      putFile("public.json", publickey, { encrypt: false })
        .then(res => console.log(res))
        .catch(err => console.error(err));
    }
  }

  // whenever user clicks something to upload.
  onImageChange(e) {
    const files = Array.from(e.target.files);
    this.setState({ isLoading: true });

    let reader = new FileReader();
    reader.onloadend = function() {
      // console.log(reader.result);
      writeFile(files[0].name, reader.result, {
        encrypt: true
      })
        .then(this.fetchData())
        .finally(() => this.setState({ isLoading: false }));
    }.bind(this);
    reader.readAsDataURL(files[0]);
  }

  // downloads the given filename from user's gaia hub
  downloadFile(filename) {
    // download file
    readFile(filename, { decrypt: true }).then(res => {
      this.setState({ currentImage: res });
    });
  }

  onDoctorView() {
    console.log(this.state.patientFilename, this.state.username);

    // getFile("private.json", {
    //   decrypt: true
    // }).then(privatekey => {

    let passphrase = loadUserData().appPrivateKey;

    let privatekey = cryptico.generateRSAKey(passphrase, 1024);

    console.log("PRIVATE", privatekey);

    // console.log(this.state.username)
    getFile(
      `${this.state.username.split(".")[0]}_${this.state.patientFilename}`,
      {
        username: `${this.state.patientUsername}.id.blockstack`,
        decrypt: false
      }
    ).then(filecontent => {
      console.log("FILE CONTENT", filecontent);

      // console.log("PARSED KEY", JSON.parse(privatekey));

      let decrypted = cryptico.decrypt(filecontent, privatekey);

      console.log("DECRYPED", decrypted.plaintext);

      this.setState({ currentImage: decrypted.plaintext });
    });
    // });
  }

  onShare(filename) {
    if (!filename || !this.state.doctorName) return;

    console.log(filename, this.state.doctorName);

    getFile("public.json", {
      username: `${this.state.doctorName}.id.blockstack`,
      decrypt: false
    })
      .then(rcvrpublickey => {
        console.log("PUBLIC", rcvrpublickey);

        console.log("FILENAME TO SHARE", filename);

        getFile(filename, { decrypt: true })
          .then(filecontent => {
            console.log("FILE CO", filecontent);

            let encrypted = cryptico.encrypt(filecontent, rcvrpublickey);

            putFile(`${this.state.doctorName}_${filename}`, encrypted.cipher, {
              encrypt: false
            })
              .then(res => console.log("SHARE DONE", res))
              .catch(err => console.error(err));
          })
          .catch(err => console.error("CALLBACK HELL", err));
      })
      .then(res => console.log("CATEDTDETDE", res))
      .catch(err => console.error(err));
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
              {this.state.username.split(".")[0] || "User"}
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
                  {atob(this.state.currentImage.split('base64,')[1])}
                </textarea>
              ))}
          </div>
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
        </div>
        <div className="new-status">
          <div className="col-md-12 statuses">
            {this.state.isLoading && <span>Loading...</span>}
            {this.state.files.map(filename => (
              <div className="status" key={filename.id}>
                <p style={{ marginLeft: 5 }}>{filename}</p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => this.downloadFile(filename)}
                >
                  View
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => this.onShare(filename)}
                >
                  Share
                </button>
              </div>
            ))}
          </div>
          <div className="doctor-view">
            <input
              type="text"
              placeholder="Patient Filename"
              onChange={e => this.setState({ patientFilename: e.target.value })}
            />
            <input
              type="text"
              placeholder="Patient's Username"
              onChange={e => this.setState({ patientUsername: e.target.value })}
            />
            <button
              className="btn btn-primary btn-lg"
              onClick={this.onDoctorView}
            >
              View Patient File
            </button>
          </div>
          <div className="col-md-12" />
        </div>
      </div>
    ) : null;
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillMount() {
    console.log("LOAD", loadUserData());
    this.setState({
      person: new Person(loadUserData().profile),
      username: loadUserData().username
    });
  }
}
