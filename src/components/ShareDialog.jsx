import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";

const styles = {};

function ShareDialog({ open, handleClose, filename, handleSubmit }) {
  const [input, setInput] = useState("");

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Share</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`To share ${filename}, please enter doctor's blockstack id.`}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Blockstack Id"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={res => handleSubmit(filename, input)}
            color="primary"
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withStyles(styles)(ShareDialog);
