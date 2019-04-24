import React, { Component } from "react";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Profile from "./Profile.jsx";
import Signin from "./Signin.jsx";
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut
} from "blockstack";

const theme = createMuiTheme({ typography: { useNextVariants: true } });

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin;
    redirectToSignIn(origin, origin + "/manifest.json", [
      "store_write",
      "publish_data"
    ]);
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        {!isUserSignedIn() ? (
          <Signin handleSignIn={this.handleSignIn} />
        ) : (
          <ThemeProvider theme={theme}>
            <Profile handleSignOut={this.handleSignOut} />
          </ThemeProvider>
        )}
      </React.Fragment>
    );
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
  }
}
