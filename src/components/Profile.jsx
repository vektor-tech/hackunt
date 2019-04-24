import React, { Component } from "react";
import { CircularProgress } from "@material-ui/core";
import MainAppBar from "./MainAppBar.jsx";
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
import FileTable from "./FileTable.jsx";

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
        files: [{ id: this.state.files.length + 1 , name}, ...this.state.files]
      });
      return true;
    })
      .then(res => console.log("Number of files: ", res))
      .catch(err => console.error(err))
      .finally(() => {
        this.setState({ isLoading: false });
        // checks if public.json exists for the user
        this.initialSetup();
      });
  }

  initialSetup() {
    // check for public.json
    for (let file of this.state.files) {
      if (file == "public.json") return;
    }

    // if not found generate public.json

    // generate RSA pair
    let passphrase = loadUserData().appPrivateKey;
    let privatekey = cryptico.generateRSAKey(passphrase, 1024);
    let publickey = cryptico.publicKeyString(privatekey);

    // store in gaia hub, encrypt false so others can access it.
    putFile("public.json", publickey, { encrypt: false })
      .then(res => console.log(res))
      .catch(err => console.error(err));
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

  // when View Patient's file is clicked
  onDoctorView() {
    if (
      !this.state.username ||
      !this.state.patientFilename ||
      !this.state.patientUsername
    ) {
      console.error("Needed fields not provided!");
      return;
    }

    // generate private key to decrypt
    let passphrase = loadUserData().appPrivateKey;
    let privatekey = cryptico.generateRSAKey(passphrase, 1024);

    // get file from patient's gaia hub
    getFile(
      `${this.state.username.split(".")[0]}_${this.state.patientFilename}`,
      {
        username: `${this.state.patientUsername}.id.blockstack`,
        decrypt: false
      }
    ).then(filecontent => {
      // decrypts encrypted file content
      let decrypted = cryptico.decrypt(filecontent, privatekey);

      this.setState({ currentImage: decrypted.plaintext });
    });
  }

  // to share a file with doctor
  onShare(filename) {
    if (!filename || !this.state.doctorName) return;

    // get's public.json from doctor gaia hub
    getFile("public.json", {
      username: `${this.state.doctorName}.id.blockstack`,
      decrypt: false
    })
      .then(rcvrpublickey => {
        // get file to share
        getFile(filename, { decrypt: true })
          .then(filecontent => {
            // here we have public key and file content to encrypt
            let encrypted = cryptico.encrypt(filecontent, rcvrpublickey);

            // make a copy that can be decrypted by doctor
            putFile(`${this.state.doctorName}_${filename}`, encrypted.cipher, {
              encrypt: false
            })
              .then(res => console.log("SHARE DONE: ", res))
              .catch(err =>
                console.error("Error on storing doctor's file", err)
              );
          })
          .catch(err => console.error("Error on getting file to share: ", err));
      })
      .catch(err =>
        console.error("Error on getting doctor's public.json", err)
      );
  }

  render() {
    const { handleSignOut } = this.props;
    return !isSignInPending() ? (
      <div>
        <MainAppBar
          onLogout={handleSignOut}
          username={this.state.username.split(".")[0] || "User"}
        />
        <div>
          <input type="file" onChange={this.onImageChange} />
          <input
            type="text"
            placeholder="Doctor's Name"
            onChange={e => this.setState({ doctorName: e.target.value })}
          />
        </div>
        <FileTable filenames={this.state.files} />
        <div>
          <div>
            {this.state.currentImage &&
              (this.state.currentImage.startsWith("data:image") ? (
                <img style={{ height: "30vh" }} src={this.state.currentImage} />
              ) : (
                <textarea
                  style={{ height: "100%", width: "100%", marginLeft: 15 }}
                  value={atob(this.state.currentImage.split("base64,")[1])}
                />
              ))}
          </div>
        </div>
        <div>
          <div>
            {this.state.isLoading && <span>Loading...</span>}
            {/* {this.state.files.map(filename => (
              <div key={filename.id}>
                <p style={{ marginLeft: 5 }}>{filename}</p>
                <button onClick={() => this.downloadFile(filename)}>
                  View
                </button>
                <button onClick={() => this.onShare(filename)}>Share</button>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    ) : (
      <CircularProgress className={classes.progress} />
    );
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
