import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {AppBar, Drawer, MenuItem, Toolbar, ToolbarGroup, FlatButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';
import firebase from 'firebase';
import logo from './img/favicon.png';

/*This file handles display of navigation*/

class Navigation extends Component {
  state = {
    open: false,
  }

  componentWillReceiveProps = (newProps) => {
    if(newProps.groupID) {
      firebase.database().ref('groups/'+newProps.groupID).once('value').then((snapshot) => {
        this.setState({name: snapshot.val().name})
      })
    }
    this.setState({isAuth: newProps.isAuth, userID: newProps.userID})
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
      location.reload();
    }).catch((err) => {
      alert(err);
    })
  }

  render() {
    let links;
    if(this.props.isAuth && !this.props.groupID) {
      //Person is logged in, not assigned to group, display create group
      links = [{link: '/', body: 'Home'}, {link: '/create', body: 'Create Group'}, {link: '/settings', body: 'User Settings'}];
    } else if(!this.props.isAuth && !this.props.groupID) {
      //Person not logged, and not assigned to group
      links = [{link: '/', body: 'Home'}, {link: '/login', body: 'Login'}];
    } else if(this.props.isAuth && this.props.groupID) {
      links = [{link: '/', body: 'Home'},{link: '/' + this.props.groupID +'/weekly', body: 'Weekly Calendar'}, {link: '/' + this.props.groupID + '/settings', body: 'Group Settings'},  {link: '/settings', body: 'User Settings'}];
    } else {
      links = [{link: '/', body: 'Home'}, {link: '/login', body: 'Login'}];
    }
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
                    title={<span style={{color: '#fff'}}><img src={logo} style={{width: 64, height: 64, float: 'left'}} alt="Choreless Logo"/> {this.state.name && 'Group - ' + this.state.name}</span>}
                  />
                </ToolbarGroup>
                <ToolbarGroup className="hide-on-med-and-down">
                  {rightNav}
                </ToolbarGroup>
              </Toolbar>
          </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Drawer
              width={256}
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
