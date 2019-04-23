import React, { Component } from "react";

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div>
        <h1>Welcome to Decentralized Health Care System!</h1>
        <p>
          <button onClick={handleSignIn.bind(this)}>
            Sign In with Blockstack
          </button>
        </p>
      </div>
    );
  }
}
