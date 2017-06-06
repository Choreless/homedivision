import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import {RaisedButton} from 'material-ui';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './home.css';

/*This file is the landing page*/


class Home extends Component {

  componentWillReceiveProps = (newProps) => {
    if(newProps.isAuth !== undefined) {
      this.setState({isAuth: newProps.isAuth});
    }
  }

  componentWillMount = () => {
    this.setState({isAuth: this.props.isAuth});
  }

  render() {
    let authDisplay;
    if(this.state.isAuth === false) {
      authDisplay = (
        <div>
          <p>Sign in or create an account now to begin using Choreless with your house!</p>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Link to="/login"><RaisedButton fullWidth={true} label={'Sign in/up'} primary={true} labelStyle={{color: '#fff'}}/></Link>
          </MuiThemeProvider>
        </div>

      )
    } else if(this.state.isAuth) {
      if(this.props.groupID) {
        authDisplay = (
          <div>
            <p>Quick jump to weekly calendar and settings</p>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Link to={"/" + this.props.groupID + "/weekly"}><RaisedButton style={{marginBottom: 10}} fullWidth={true} label={'Weekly Calendar'} primary={true} labelStyle={{color: '#fff'}}/></Link>
            </MuiThemeProvider>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Link to={"/" + this.props.groupID + "/settings"}><RaisedButton fullWidth={true} label={'Group Settings'} secondary={true} labelStyle={{color: '#fff'}}/></Link>
            </MuiThemeProvider>
          </div>

        )
      } else if(this.props.groupID !== undefined) {
        authDisplay = (
          <div>
            <p>Create or join an existing group</p>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Link to="/create"><RaisedButton fullWidth={true} label={'Create/Join Group'} primary={true} labelStyle={{color: '#fff'}}/></Link>
            </MuiThemeProvider>
          </div>

        )
      }
    } else {
      authDisplay = <div></div>
    }
    return (
      <section className="container">
        <Row>
          <Col s={12}><h2>Welcome to Choreless</h2></Col>
        </Row>
        <Row>
          <Col s={12} m={6}>
            <p>Chores are a never ending task and are often overlooked when living with others. This can be frustrating because of untidy living spaces. Choreless helps your house with coordinating chores between housemates, recording each housemates daily or weekly chores, and incentivizing housemates to complete their chores.</p>

          </Col>
          <Col s={12} m={6} className="center-align">
            {authDisplay}
          </Col>
        </Row>
      </section>
    );
  }
}

export default Home;
