import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: 250,
    margin: theme.spacing.unit
  },
  textInput: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 3
  }
});

function ViewPatientFile({ handleSubmit, classes }) {
  const [patientUsername, setPatientUsername] = useState("");
  const [patientFilename, setPatientFilename] = useState("");

  return (
    <div className={classes.root}>
      <TextField
        autoFocus
        className={classes.textField}
        id="username"
        label="Patient's Username"
        type="text"
        value={patientUsername}
        onChange={e => setPatientUsername(e.target.value)}
      />
      <TextField
        className={classes.textField}
        id="filename"
        label="Patient's Filename"
        type="text"
        value={patientFilename}
        onChange={e => setPatientFilename(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => handleSubmit(patientUsername, patientFilename)}
      >
        Submit
      </Button>
    </div>
  );
}

/* <div>
      <input
        type="text"
        placeholder="Patient Filename"
        // onChange={e => this.setState({ patientFilename: e.target.value })}
      />
      <input
        type="text"
        placeholder="Patient's Username"
        // onChange={e => this.setState({ patientUsername: e.target.value })}
      />
      {/* <button onClick={this.onDoctorView}>View Patient File</button> */
// </div>

export default withStyles(styles)(ViewPatientFile);
