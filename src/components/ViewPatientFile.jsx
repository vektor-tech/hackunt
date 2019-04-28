import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {};

function ViewPatientFile(props) {
  return (
    <div>
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
      {/* <button onClick={this.onDoctorView}>View Patient File</button> */}
    </div>
  );
}

export default withStyles(styles)(ViewPatientFile);
