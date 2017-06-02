import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { TextField, RaisedButton, FlatButton, Dialog } from 'material-ui';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import firebase from 'firebase';
import fbcontroller from './fbcontroller'
import { CirclePicker } from 'react-color';

class UserSettings extends Component {

  state = {
    nickname: undefined,
    newPassword: undefined,
    confirmNewPassword: undefined,
    currentEmail: undefined,
    isAuth: undefined,
    open: false,
    loading: undefined,
    nonAuthText: '',
    passwordDisabled: true,
    emailDisabled: true,
    icon: undefined,
    emailvalidate: false,
    passwordvalidate: false,
    matchvalidate: false,
    uservalidate: false,
    userColor: undefined,
    currentUser: undefined
  }

  componentDidMount = () => { 
    if(this.props.isAuth === false || this.props.isAuth === undefined) this.props.history.push('/');

    if (this.props.userID !== null) {
        firebase.database().ref('users/' + this.props.userID).once('value').then((snapshot) => {
        const userData = snapshot.val();
        if (userData !== null) {
          this.setState({
            userColor: userData.color,
          });
        }
      })
    }

    var user = firebase.auth().currentUser;
    if(user != null) {
      this.setState({currentEmail: user.email});
    }
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
        valid = /^(?=.*\d+)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%]{6,20}$/.test(value)
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
    else { //valid and no input`
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
    let errors = this.validate(event.target.value, {required:true, passwordInput:this.state.new_password})
    this.setState({matchvalidate: errors.isValid})
  }

  handleEmailValidate = (event) => {
    this.handleChange(event);
    let errors = this.validate(event.target.value, {required:true, email:true});
    this.setState({emailvalidate: errors.isValid})
  }

  updateNickname = (event) => {
    fbcontroller.updateUserInfo(this.props.userID, document.getElementById("changeNickname").value, this.state.userColor); 
  }

  updatePassword = (event) => {
    var user = firebase.auth().currentUser;
    if(user != null) {
      user.updatePassword(document.getElementById("changePassword").value);
    } else {
      alert("No current user found!");
    }
  }

  updateEmail = (event) => {
    var user = firebase.auth().currentUser;
    if(user != null) {
      user.updateEmail(document.getElementById("changeEmail").value);
    } else {
      alert("No current user found!");
    }
  }

  updateColor = (color, event) => {
    fbcontroller.updateUserInfo(this.props.userID, this.props.userHandle, color.hex);
  }

  handleChange = (event) => {
    var field = event.target.name;
    var value = event.target.value;
    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
    this.setState({errorText: ''});
  }

  render() {
    //Variables go here
    let nicknameDisabled;
    let passwordDisabled;
    let emailDisabled;
    let colorDisabled;

    if(this.state.uservalidate) { 
      nicknameDisabled = false;
    } else {
      nicknameDisabled = true;
    }

    if(this.state.passwordvalidate && this.state.matchvalidate) { 
      passwordDisabled = false;
    } else {
      passwordDisabled = true;
    }

    if(this.state.emailvalidate) { 
      emailDisabled = false;
    } else {
      emailDisabled = true;
    }

    return (
      <div className="container">
        <h2>User Settings</h2>
        <div style={{color: '#E53935'}}>{this.state.errorText}</div>

        <div>
          <h4>Update Nickname</h4>
          <form role="form">
            <div className="form-group">
              <h6>Your current nickname is: {this.props.userHandle}</h6>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField id="changeNickname" style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="New Nickname" name="user" type="text" onChange={(e) => {this.handleUserValidate(e);}} errorText={!this.state.uservalidate && this.state.user ? 'Must be at least 3 characters in length and not contain special characters or spaces':''} />
              </MuiThemeProvider>
            </div>
            <div>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <RaisedButton type="submit" label={!this.state.icon && 'Update Nickname'} icon={this.state.icon} primary={true} disabled={nicknameDisabled} labelStyle={{color: '#fff'}} onTouchTap={this.updateNickname}/>
              </MuiThemeProvider>
            </div>
          </form>
        </div>

        <div>
          <h4>Update Password</h4>
          <form role="form">
            <div className="form-group">
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <TextField id="changePassword" style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="New Password" name="new_password" type="password" onChange={(e) => {this.handlePasswordValidate(e);}} errorText={!this.state.passwordvalidate && this.state.new_password ? 'Must contain at least 1 digit and alpha and be between 6-20 characters': ''} />
                </MuiThemeProvider>
            </div>
            <div className="form-group">
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="Confirm New Password" name="match" type="password" onChange={(e) => {this.handleMatchValidate(e);}} errorText={!this.state.matchvalidate && this.state.match ? 'Passwords do not match':''} />
              </MuiThemeProvider>
            </div>
            <div className="form-group">
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <RaisedButton type="submit" label={!this.state.icon && 'Update Password'} icon={this.state.icon} primary={true} disabled={passwordDisabled} labelStyle={{color: '#fff'}} onTouchTap={this.updatePassword}/>
              </MuiThemeProvider>
            </div>
          </form>
        </div>

        <div>
          <h4>Update Email</h4>
          <form role="form">
            <div className="form-group">
              <h6>Your current email is: {this.state.currentEmail}</h6>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField id="changeEmail" style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="Email" name="email" type="email" onChange={(e) => {this.handleEmailValidate(e);}} errorText={!this.state.emailvalidate && this.state.email ? 'Not a valid email address':''} />
              </MuiThemeProvider>
            </div>
            <div className="form-group">
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <RaisedButton type="submit" label={!this.state.icon && 'Update Email Address'} icon={this.state.icon} primary={true} disabled={emailDisabled} labelStyle={{color: '#fff'}} onTouchTap={this.updateEmail}/>
              </MuiThemeProvider>
            </div>
          </form>
        </div>

        <div>
          <h4>Update Personal Color</h4>
            <CirclePicker 
              color= {this.state.userColor}
              onChange={this.updateColor}
              width="400px"
            />
        </div>
      </div>
    );
  } 
}

export default UserSettings;
