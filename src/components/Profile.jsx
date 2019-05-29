import React, { Component } from "react";
import { Button, CircularProgress, Paper, Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  getFile,
  isSignInPending,
  listFiles,
  loadUserData,
  putFile
} from "blockstack";
import * as cryptico from "cryptico";
import FileList from "./FileList.jsx";
import MainAppBar from "./MainAppBar.jsx";
import ShareDialog from "./ShareDialog.jsx";
import SnackBarMessage from "./SnackBarMessage.jsx";
import ViewPatientFile from "./ViewPatientFile.jsx";
import FilePreviewDialog from "./FilePreviewDialog.jsx";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  root: {
    padding: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileContent: "Empty",
      filePreviewDialogOpen: false,
      files: [],
      sharedFiles: [],
      username: "",
      isLoading: false,
      patientFilename: "",
      patientUsername: "",
      snackBarOpen: false,
      snackbarMessage: "",
      shareDialogOpen: false,
      shareFilename: "",
      tabValue: 0
    };

    this.onImageChange = this.onImageChange.bind(this);
    this.onDoctorView = this.onDoctorView.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  // gets list of files from user's gaia hub
  fetchData() {
    this.setState({ isLoading: true, files: [] });

    listFiles(name => {
      this.setState({
        files: name.startsWith("SHARED_")
          ? [...this.state.files]
          : [{ id: this.state.files.length + 1, name }, ...this.state.files],
        sharedFiles: name.startsWith("SHARED_")
          ? [
              { id: this.state.sharedFiles.length + 1, name },
              ...this.state.sharedFiles
            ]
          : [...this.state.sharedFiles]
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
    for (let { name } of this.state.files) {
      if (name == "public.json") return;
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
      putFile(files[0].name, reader.result, {
        encrypt: true
      })
        .then(this.fetchData())
        .finally(() =>
          this.setState({
            isLoading: false,
            open: true,
            snackbarMessage: "File Uploaded!"
          })
        );
    }.bind(this);
    reader.readAsDataURL(files[0]);
  }

  // downloads the given filename from user's gaia hub
  downloadFile(filename) {
    this.setState({ isLoading: true, fileContent: "Empty" });
    // download file
    getFile(filename, { decrypt: true })
      .then(res => {
        this.setState({ fileContent: res, isLoading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isLoading: false, fileContent: "Error Occured!" });
      });
  }

  // when View Patient's file is clicked
  onDoctorView(patientUsername, patientFilename) {
    if (!this.state.username || !patientFilename || !patientUsername) {
      console.error("Needed fields not provided!");
      return;
    }

    this.setState({ filePreviewDialogOpen: true, isLoading: true });

    // generate private key to decrypt
    let passphrase = loadUserData().appPrivateKey;
    let privatekey = cryptico.generateRSAKey(passphrase, 1024);

    // get file from patient's gaia hub
    getFile(
      `SHARED_${this.state.username.split(".")[0]}_END_${patientFilename}`,
      {
        username: `${patientUsername}.id.blockstack`,
        decrypt: false
      }
    )
      .then(filecontent => {
        // decrypts encrypted file content
        let decrypted = cryptico.decrypt(filecontent, privatekey);

        this.setState({ fileContent: decrypted.plaintext, isLoading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isLoading: false, fileContent: "Error Occured!" });
      });
  }

  // to share a file with doctor
  onShare = (filename, doctorName) => {
    this.setState({
      shareDialogOpen: false
    });

    if (!filename || !doctorName) return;

    // get's public.json from doctor gaia hub
    getFile("public.json", {
      username: `${doctorName}.id.blockstack`,
      decrypt: false
    })
      .then(rcvrpublickey => {
        // get file to share
        getFile(filename, { decrypt: true })
          .then(filecontent => {
            // here we have public key and file content to encrypt
            let encrypted = cryptico.encrypt(filecontent, rcvrpublickey);

            // make a copy that can be decrypted by doctor
            putFile(`SHARED_${doctorName}_END_${filename}`, encrypted.cipher, {
              encrypt: false
            })
              .then(_ =>
                this.setState({
                  snackBarOpen: true,
                  snackbarMessage: `Shared ${filename} with ${doctorName}!`
                })
              )
              .catch(err =>
                console.error("Error on storing doctor's file", err)
              );
          })
          .catch(err => console.error("Error on getting file to share: ", err));
      })
      .catch(err =>
        console.error("Error on getting doctor's public.json", err)
      );
  };

  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ snackBarOpen: false });
  }

  handleDelete = filename => {
    this.setState({
      snackBarOpen: true,
      snackbarMessage: "Deletion not supported!"
    });
  };

  handleShare = filename => {
    this.setState({
      shareDialogOpen: true,
      shareFilename: filename
    });
  };

  handleShareDialogClose = () => {
    this.setState({ shareDialogOpen: false });
  };

  handleFilePreviewDialogClose = () => {
    this.setState({ filePreviewDialogOpen: false });
  };

  handleTabChange = (_, value) => {
    this.setState({ tabValue: value });
  };

  previewOpen = (filename, shared) => {
    if (shared) return;
    this.setState({ filePreviewDialogOpen: true });
    this.downloadFile(filename);
  };

  render() {
    const { handleSignOut, classes } = this.props;
    const { tabValue } = this.state;
    return !isSignInPending() ? (
      <>
        <MainAppBar
          onLogout={handleSignOut}
          username={this.state.username.split(".")[0] || "User"}
        />
        <Paper className={classes.root}>
          <input
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={this.onImageChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              component="span"
              color="primary"
              className={classes.button}
            >
              Upload
              <CloudUploadIcon className={classes.rightIcon} />
            </Button>
          </label>
          <Tabs
            value={this.state.tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleTabChange}
          >
            <Tab label="My Files" />
            <Tab label="Shared" />
            <Tab label="Shared with me" />
          </Tabs>
          {tabValue == 0 && (
            <FileList
              filenames={this.state.files}
              handleShare={this.handleShare}
              handleDelete={this.handleDelete}
              handlePreview={this.previewOpen}
            />
          )}
          {tabValue == 1 && (
            <FileList
              filenames={this.state.sharedFiles}
              handleDelete={this.handleDelete}
              handlePreview={this.previewOpen}
              shared={true}
            />
          )}
          {tabValue == 2 && (
            <ViewPatientFile handleSubmit={this.onDoctorView} />
          )}
          <FilePreviewDialog
            open={this.state.filePreviewDialogOpen}
            handleClose={this.handleFilePreviewDialogClose}
            content={this.state.fileContent}
            isLoading={this.state.isLoading}
          />
          <ShareDialog
            open={this.state.shareDialogOpen}
            handleClose={this.handleShareDialogClose}
            filename={this.state.shareFilename}
            handleSubmit={this.onShare}
          />
          <SnackBarMessage
            message={this.state.snackbarMessage}
            handleClose={this.handleClose}
            open={this.state.snackBarOpen}
          />
        </Paper>
      </>
    ) : (
      <CircularProgress className={classes.progress} />
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillMount() {
    this.setState({
      username: loadUserData().username
    });
  }
}

export default withStyles(styles)(Profile);
