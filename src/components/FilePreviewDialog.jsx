import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";

const styles = {};

function Viewer({ content }) {
  if (content.startsWith("data:image")) {
    return <img width="100%" src={content} />;
  }
  if (content.startsWith("data")) {
    return <iframe width="100%" src={content} />;
  }
  return <p>{content}</p>;
}

function FilePreviewDialog({ open, handleClose, content, isLoading, classes }) {
  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">File Preview</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isLoading ? "Loading..." : <Viewer content={content} />}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withStyles(styles)(FilePreviewDialog);
