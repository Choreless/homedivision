import React, { Component } from 'react';
import {RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './home.css';

/*This file is the landing page*/


class Home extends Component {
  handleSignUpButton = () => {
    this.props.history.push("/login");
  };

  render() {
    return (
      <section className="container">
        <h2>Welcome to Choreless</h2>
        <div className="desc">
          <p>Chores are a never ending task and are often overlooked when living with others. This can be frustrating because of untidy living spaces. Choreless helps your house with coordinating chores between housemates, recording each housemates daily or weekly chores, and incentivizing housemates to complete their chores.</p>
          <p>Sign in or create an account now to begin using Choreless with your house!</p>
        </div>
        <div className="button">
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <RaisedButton label={'Sign in/up'} primary={true} labelStyle={{color: '#fff'}} onTouchTap={this.handleSignUpButton} />
          </MuiThemeProvider>
        </div>
      </section>
    );
  }
}

export default Home;