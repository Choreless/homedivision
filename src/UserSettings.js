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

  validate = (value, validations) => {
    var errors = {isValid: true, style:''};

    if(value !== undefined){ //check validations
      //handle required
      if(validations.required && value === ''){
        errors.required = true;
        errors.isValid = false;
      }

      //handle minLength
      if(validations.minLength && value.length < validations.minLength){
        errors.minLength = validations.minLength;
        errors.isValid = false;
      }
      if(validations.passwordInput && validations.passwordInput !== value){
        errors.passwordInput = true;
        errors.isValid = false;
      }

      let valid;
      //handle email type ??
      if(validations.email){
        //pattern comparison from w3c
        //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
        valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
        if(!valid){
          errors.email = true;
          errors.isValid = false;
        }
      }

      if(validations.user) {
        valid = !/[^a-zA-Z0-9]/.test(value)
        if(!valid) {
          errors.isValid = false;
          errors.specialcharacters = true;
        }
      }

      //handle password type
      if(validations.password){
        valid = /^(?=.*\d+)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%]{6,15}$/.test(value)
        if(!valid){
          errors.password = true;
          errors.isValid = false;
        }
      }
    }

    //display details
    if(!errors.isValid){ //if found errors
      errors.style = 'has-error';
    }
    else if(value !== undefined){ //valid and has input
      //errors.style = 'has-success' //show success coloring
    }
    else { //valid and no input
      errors.isValid = false; //make false anyway
    }
    return errors; //return data object
  }

   handleUserValidate = (event) => {
    this.handleChange(event);
    let errors = this.validate(event.target.value, {required:true, minLength:3, user:true});
    this.setState({uservalidate: errors.isValid});
  }

    handlePasswordValidate = (event) => {
    this.handleChange(event);
    let errors = this.validate(event.target.value, {required:true, minLength:6, password:true});
    this.setState({passwordvalidate: errors.isValid})
  }

  handleMatchValidate = (event) => {
    this.handleChange(event);
    let errors = this.validate(event.target.value, {required:true, passwordInput:this.state.password})
    this.setState({matchvalidate: errors.isValid})
  }

  updateNickname = (event) => {
    
  }

  updatePassword = (event) => {

  }

  updateEmail = (event) => {

  }

  updateColor = (event) => {

  }


  render() {
    //Variables go here
    return (
      <section className="container">
        <h2>User Settings</h2>
        <div style={{color: '#E53935'}}>{this.state.errorText}</div>
        <div>
          <h4>Update Nickname</h4>
          <form role="form" /*onSubmit={this.signIn}*/>
            <div className="updateNickname">
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField id="signin-user" style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="New Nickname" name="user" type="text" onChange={this.handleUserValidate} errorText={!this.state.uservalidate && this.state.user ? 'Must be at least 3 characters in length and not contain special characters or spaces':''} />
              </MuiThemeProvider>
              
            </div>
          </form>
        </div>
        <div>
          <h4>Update Password</h4>
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
            <div className="form">
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField id="signin-user" style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="Confirm New Password" name="match" type="password" onChange={this.handleMatchValidate} errorText={!this.state.matchvalidate && this.state.match ? 'Passwords do not match':''} />
              </MuiThemeProvider>
            </div>
          </form>
        </div>
        <div>
          <h4>Update Email</h4>
          <form role="form" /*onSubmit={this.signIn}*/>
            <div className="updateNickname">
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField style={{color: '#039BE5'}} floatingLabelText="New Email" fullWidth={true} type="email" name="email" />
              </MuiThemeProvider>
            </div>
          </form>
        </div>
        <div>
          <h4>Update Personal Color</h4>
        </div>
      </section>
    );
  } 
}

export default UserSettings;
