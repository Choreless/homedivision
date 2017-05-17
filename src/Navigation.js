import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {AppBar, Drawer, MenuItem, Toolbar, ToolbarGroup, FlatButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';
import firebase from 'firebase';

/*This file handles display of navigation*/

class Navigation extends Component {
  state = {
    open: false,
  }

  handleToggle = () => {
    this.setState({open: !this.state.open});
  }

  handleActiveLink = (link) => {
    let path = location.pathname;
    if(path === link) {
      if(location.pathname !== '/' && link === '/') return {color: '#000'};
      return {backgroundColor: '#CFD8DC', color: '#000'};
    } else {
      return {color: '#000'};
    }
  }

  //Signout function
  signOut = () =>  {
    firebase.auth().signOut().then(() => {
      if(location.pathname !== '/') this.props.history.push('/')
      else this.forceUpdate();
    }).catch((err) => {
      alert(err);
    })
  }

  render() {
    let links = [{link: '/', body: 'Home'}, {link: '/login', body: 'Login'}, {link: '/create', body: 'Create Room'}, {link: '/dw23498xz/weekly', body: 'Test Weekly'}, {link: '/dw23498xz/monthly', body: 'Test Monthly'}];
    let drawerlinks = _.map(links, (elem, index) => {
      let activeStyle = this.handleActiveLink(elem.link);
      return (
        <Link to={elem.link} key={'drawerlink-' + index} onTouchTap={this.handleToggle}><MenuItem style={activeStyle}>{elem.body}</MenuItem></Link>
      )
    });
    let rightNav;
    if(this.props.userHandle === null || this.props.userHandle === undefined) {
      rightNav = <span></span>
    } else if(this.props.userHandle.length > 0) {
      rightNav = <div>
        <span style={{color: '#fff'}}>Welcome, {this.props.userHandle}</span>
        <FlatButton onTouchTap={this.signOut} labelStyle={{color: '#fff'}} label="Sign Out"/>
      </div>
    } else {
      rightNav = <Link to="/login"><FlatButton labelStyle={{color: '#fff'}} label="Sign In/Sign Up"/></Link>
    }
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Toolbar style={{height: '64px', backgroundColor: '#000'}}>
                <ToolbarGroup firstChild={true}>
                  <AppBar
                    style={{backgroundColor: '#000', boxShadow: 'none'}}
                    onLeftIconButtonTouchTap={this.handleToggle}
                    id="navbar-appbarz" //Remove the "z" to make it so that the menu shows up only on mobile.
                    title={<span style={{color: '#fff'}}>Logo</span>}
                  />
                </ToolbarGroup>
                <ToolbarGroup className="hide-on-med-and-down">
                  {rightNav}
                </ToolbarGroup>
              </Toolbar>
          </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Drawer
              width={230}
              open={this.state.open}
              docked={false}
              onRequestChange={(open) => this.setState({open})}
            >
              <div style={{height: 64, backgroundColor: '#212121'}}></div>
              {drawerlinks}
            </Drawer>
          </MuiThemeProvider>
      </div>
    );
  }
}

export default withRouter(Navigation);
