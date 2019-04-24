import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

function MainAppBar(props) {
  const { classes, onLogout, username } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Hi, {username}
          </Typography>
          <Button onClick={onLogout} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default withStyles(styles)(MainAppBar);
