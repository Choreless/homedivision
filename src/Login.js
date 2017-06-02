import React, { Component } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import {Row, Col} from 'react-materialize';
import {Tabs, Tab} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

/*
  This file handles logging in

*/


class Login extends Component {
  state = {
    showSignUp: false,
  }

  render() {
    return (
      <section className="container">
        <Row>
          <Col s={12}>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Tabs inkBarStyle={{backgroundColor: '#000', zIndex: '10'}}>
                <Tab buttonStyle={{backgroundColor: '#fff', color: '#000'}} label="Sign In">
                  <SignInForm history={this.props.history} userID={this.props.userID}/>
                </Tab>
                <Tab buttonStyle={{backgroundColor: '#fff', color: '#000'}} label="Sign Up">
                  <SignUpForm history={this.props.history}/>
                </Tab>
              </Tabs>
            </MuiThemeProvider>
          </Col>
        </Row>
      </section>
    );
  }
}

export default Login;
