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

const styles = {};

function FileList(props) {
  const { handleShare, handleDelete } = props;
  return (
    <List>
      {props.filenames.map(({ id, name }) => (
        <ListItem key={id}>
          <ListItemAvatar>
            <Avatar>
              <InsertDriveFile />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={name} />
          <ListItemSecondaryAction>
            <IconButton aria-label="Share" onClick={() => handleShare(name)}>
              <ShareIcon />
            </IconButton>
            <IconButton aria-label="Delete" onClick={() => handleDelete(name)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

// {/* {this.state.files.map(filename => (
//               <div key={filename.id}>
//                 <p style={{ marginLeft: 5 }}>{filename}</p>
//                 <button onClick={() => this.downloadFile(filename)}>
//                   View
//                 </button>
//                 <button onClick={() => this.onShare(filename)}>Share</button>
//               </div>
//             ))} */}

export default withStyles(styles)(FileList);
