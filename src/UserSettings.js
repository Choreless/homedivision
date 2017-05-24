import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { TextField, RaisedButton, List, ListItem, Subheader, CircularProgress, Checkbox, DatePicker, FlatButton, Dialog } from 'material-ui';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

class UserSettings extends Component {
  state = {
    isAuth: undefined,
    open: false,
    loading: undefined,
    nonAuthText: ''
  }

  updateNickname() {
    return (
      <div>
        <h2>Update Nickname</h2>
        <form role="form" /*onSubmit={this.signIn}*/>
          <div className="updateNickname">
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <TextField style={{color: '#039BE5'}} floatingLabelText="New Nickname" fullWidth={true} type="nickname" name="nickname" />
            </MuiThemeProvider>
          </div>
        </form>
      </div>
    );
  }

  updatePassword() {
    return (
      <div>
        <h2>Update Password</h2>
        <form role="form" /*onSubmit={this.signIn}*/>
          <div className="confirmPassword">
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <TextField style={{color: '#039BE5'}} floatingLabelText="Old Password" fullWidth={true} type="old_password" name="old_password" />
            </MuiThemeProvider>
          </div>
        </form>
        <form role="form" /*onSubmit={this.signIn}*/>
          <div className="newPassword">
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <TextField style={{color: '#039BE5'}} floatingLabelText="New Password" fullWidth={true} type="new_password" name="new_password" />
            </MuiThemeProvider>
          </div>
        </form>
        <form role="form" /*onSubmit={this.signIn}*/>
          <div className="confirmNewPassword">
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <TextField style={{color: '#039BE5'}} floatingLabelText="Confirm New Password" fullWidth={true} type="confirm_new_password" name="confirm_new_password" />
            </MuiThemeProvider>
          </div>
        </form>
      </div>
    );
  }

  updateEmail() {
    return (
      <div>
        <h2>Update Email</h2>
        <form role="form" /*onSubmit={this.signIn}*/>
          <div className="updateNickname">
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <TextField style={{color: '#039BE5'}} floatingLabelText="New Email" fullWidth={true} type="email" name="email" />
            </MuiThemeProvider>
          </div>
        </form>
      </div>
    );
  }

  updateColor() {
    return (
      <div>
        <h2>Update Personal Color</h2>    
        
      </div>
    );
  }

  UserSettingsForm() {
    return (
      <div>
        {this.updateNickname()}
        {this.updatePassword()}
        {this.updateEmail()}
        {this.updateColor()}
      </div>
          
    );
  }

  render() {
    //Variables go here
    return (
      <section className="container">
        <h1>User Settings</h1>
        {this.UserSettingsForm()}
      </section>
    );
  } 
}

export default UserSettings;
