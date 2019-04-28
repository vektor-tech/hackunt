import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { InsertDriveFile } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import ShareIcon from "@material-ui/icons/Share";
import { Typography } from "@material-ui/core";

const styles = {
  text: {
    padding: "10px",
    textAlign: "center"
  }
};

function FileList(props) {
  const { handleShare, handleDelete, shared, filenames, classes } = props;

  if (!filenames || filenames.length == 0)
    return <Typography className={classes.text}>No Files Found!</Typography>;

  return (
    <List>
      {filenames.map(({ id, name }) => {
        return (
          <ListItem key={id} button>
            <ListItemAvatar>
              <Avatar>
                <InsertDriveFile />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                shared ? name.split("SHARED_")[1].split("_END_")[1] : name
              }
              secondary={shared && name.split("SHARED_")[1].split("_END_")[0]}
            />
            <ListItemSecondaryAction>
              {!shared && (
                <IconButton
                  aria-label="Share"
                  onClick={() => handleShare(name)}
                >
                  <ShareIcon />
                </IconButton>
              )}
              <IconButton
                aria-label="Delete"
                onClick={() => handleDelete(name)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

export default withStyles(styles)(FileList);
