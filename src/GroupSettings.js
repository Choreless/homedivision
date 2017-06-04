import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { TextField, RaisedButton, List, ListItem, Subheader, CircularProgress, Checkbox, DatePicker, FlatButton, Dialog } from 'material-ui';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import moment from 'moment';
import _ from 'lodash';
import fbcontroller from './fbcontroller';

/*This file displays the create/join room page*/

class GroupSettings extends Component {
  state = {
    isAuth: undefined,
    open: false,
    loading: undefined,
    nonAuthText: 'hey',
    groupID: '',
    passcode: '',
    groupName: '',
    chores: [],
    members: [],
    memberIDs: [],
    dialogTitle: '',
    dialogBody: '',
    dialogItem: '',
    disableDialogConfirm: false
  }

  componentWillReceiveProps = (newProps) => {
    //Check for prop changes, and set state from here if something new comes up, since render does not re render component.
    var groupID = this.props.location.pathname.split('/')[1]; //grabs groupID from url parameter
    if(newProps.isAuth === undefined) this.setState({nonAuthText: ''});
    else {
      this.setState({loading: false, nonAuthText: 'An error has occured.'});
    }
    if(newProps.isAuth !== this.state.isAuth) {
      this.setState({isAuth: newProps.isAuth});
    }
  }

  validate = (value, validations) => {
    var errors = {isValid: false, style:''};
    
    if(value !== undefined){ //check validations
      //handle required
      if(validations.required && value === ''){
        errors.required = true;
        errors.isValid = false;
      }

      let valid;
      if(validations.chore) {
        valid = !/[^a-zA-Z0-9\s]/.test(value)
        if(!valid) {
          errors.isValid = true;
          errors.specialcharacters = true;
        }
      }
    }
    return errors;
  }

  loadFirebase = () => {
    firebase.database().ref('groups/' + this.props.match.params.groupID).once('value').then((snapshot) => {
          const currentGroup = snapshot.val();
          if (currentGroup !== null){
            firebase.database().ref('users').once('value').then((snapshot) => {
                const users = snapshot.val();
                if (users !== null) {
                    let tempMembers = [];
                    currentGroup.members.forEach((currentUserID) => {
                      let currentUser = users[currentUserID];
                      tempMembers.push(currentUser.handle);
                    });
                    // let tempChores = [];
                    // if(currentGroup.chores !== null){
                    //   currentGroup.chores.forEach((chore) => {
                    //     console.log(chore);
                    //     tempChores.push(chore);
                    //   });
                    // }
                    this.setState({
                      groupName: currentGroup.name,
                      passcode: currentGroup.passcode,
                      members: tempMembers,
                      groupID: this.props.match.params.groupID,
                      chores: currentGroup.chores || [],
                      memberIDs: currentGroup.members
                    });
                }
              });
          }
        });
  }

  componentDidMount = () => {
    this.setState({isAuth: this.props.isAuth});
    this.choreRef = firebase.database().ref('groups/'+this.props.match.params.groupID + '/chores');
    this.choreRef.on('value', (snapshot) => {
      this.setState({chores: snapshot.val()});
    })
    this.loadFirebase();
   }

  componentWillUnmount = () => {
    this.choreRef.off();
  }

  handleChange = (event) => {
      var field = event.target.name;
      var value = event.target.value;
      var changes = {}; //object to hold changes
      changes[field] = value; //change this field
      this.setState(changes); //update state
      this.setState({errorText: ''});
  }

  formatDate = (date) => {
    return moment(date).format('ddd, MMMM D YYYY');
  }

  handleChoreValidate = (event) => {
    this.handleChange(event);
    let errors = this.validate(event.target.value, {required:true, chore:true});
    this.setState({
      disableDialogConfirm: errors.isValid, 
      dialogBody: <TextField style={{color: '#039BE5'}} value={event.target.value} floatingLabelText="Chore Description" fullWidth={true} type="text" name="description" onChange={(e) => {this.handleChoreValidate(e)}} errorText={errors.isValid ? 'Chores can only contain letters, numbers, or spaces':''} />
    });
  }

  handleOpen = (title, item) => {
    var body;
    switch (title) {
      case "Add Chore":
        body = <TextField style={{color: '#039BE5'}} floatingLabelText="Chore Description" fullWidth={true} type="text" name="description" onChange={(e) => {this.handleChoreValidate(e)}} errorText={this.state.disableDialogConfirm ? 'Chores can only contain letters, numbers, or spaces':''} />;
        break;
      case "Edit Chore":
        body = <TextField style={{color: '#039BE5'}} value={item} floatingLabelText="Chore Description" fullWidth={true} type="text" name="description" onChange={(e) => {this.handleChoreValidate(e)}} errorText={this.state.disableDialogConfirm ? 'Chores can only contain letters, numbers, or spaces':''}/>;
        break;
      case "Remove Member":
        body = <h6>Are you sure you want to remove {item}?</h6>;
        break;
      default:
        body = <h6>what do you want</h6>;
    }
    this.setState({
      open: true,
      dialogTitle: title,
      dialogBody: body,
      dialogItem: item,
      disableDialogConfirm: false
    });
  };

  handleDialogConfirm = () => {
    switch (this.state.dialogTitle) {
      case "Add Chore":
        this.state.description.trim() != "" ? this.state.chores.push(this.state.description) : console.log("no chore to add") ;
        fbcontroller.updateChores(this.state.groupID, this.state.chores)
        this.setState({open: false});
        break;
      case "Edit Chore":
        var index = this.state.chores.indexOf(this.state.dialogItem);
        if (index !== -1) {
          this.state.chores[index] = this.state.description;
          if(this.state.description.trim() == "") {
            this.state.chores.splice(index, 1);
          }
        }
        fbcontroller.updateChores(this.state.groupID, this.state.chores)
        this.setState({open: false});
        break;
      case "Remove Member":
        var index = this.state.members.indexOf(this.state.dialogItem);
        if (index !== -1) {
            fbcontroller.removeMemberFromGroup(this.state.groupID, this.state.memberIDs[index]);
        };
        this.setState({open: false});
        break;
      default:
        console.log("this shouldnt be happening");
      this.loadFirebase();
    }
    
  }

  handleEmail = () => {
      let subject = "Choreless Group Invite";
      let body = "You've been invited to join a Choreless Group. Your group passcode is: " + this.state.passcode;
      body += "To join the group visit https://github.com/HomeDivision/Choreless. Log in or create an account, then use the above passcode to join the group.";
      window.open('mailto:?subject=' + subject + '&body=' + body);
    };

  handleClose = () => {
    this.setState({open: false});
  };

  saveSettings = event => {
    event.preventDefault(); //don't submit
    fbcontroller.updateGroupName(this.props.match.params.groupID, this.state.groupName.trim());
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Ok"
        primary={true}
        disabled={this.state.disableDialogConfirm}
        onTouchTap={this.handleDialogConfirm}
      />,
    ];

    let chores;
    if(this.state.chores.length > 0) {
      chores = _.map(this.state.chores, (elem, index) => {
        return (
          <ListItem key={'chore-'+index} rightIcon={<EditIcon/>} onTouchTap={() => {this.handleOpen("Edit Chore", elem)}}>{elem}</ListItem>
        )
      })
    } else {
      chores = <div>There are no chores for this group yet</div>
    }

    let members;
    if(this.state.members.length > 0) {
      members = _.map(this.state.members, (elem, index) => {
        return (
          <ListItem key={'member-'+index} rightIcon={<EditIcon/>} onTouchTap={() => {this.handleOpen("Remove Member", elem)}}>{elem}</ListItem>
        )
      })
    } else {
      members = <div>There are no chores for this group yet</div>
    }

    return (
      <section className="container">
        {this.state.isAuth === undefined &&
          <Row>
            <Col style={{marginTop: 60}} className="center-align" s={12}>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <CircularProgress size={60} thickness={7} />
              </MuiThemeProvider>
            </Col>
          </Row>
        }
        {this.state.isAuth ?
          <div>
            <Row>
              <Col s={12}>
                <h1 style={{display: 'none'}}>Group Settings</h1>
                <h2 style={{fontSize: '2rem'}}>Group Settings</h2>
              </Col>
            </Row>
            <Row>
              <Col s={12}>
                <form role="form" onSubmit={this.saveSettings}>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <TextField style={{color: '#039BE5'}} value={this.state.groupName} floatingLabelText="Group Name" fullWidth={true} type="text" name="groupName" onChange={(e) => {this.handleChange(e)}} />
                    </MuiThemeProvider>
                  </div>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <TextField style={{color: '#039BE5'}} value={this.state.passcode} floatingLabelText={'Passcode'} fullWidth={true} type="text" name="passcode" disabled/>
                    </MuiThemeProvider>
                  </div>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <RaisedButton type="submit" label="Invite Friends" secondary={true} labelStyle={{color: '#fff'}} onTouchTap={this.handleEmail}/>
                    </MuiThemeProvider>
                  </div>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <List>
                        <Subheader>Group Members</Subheader>
                        {members}
                      </List>
                    </MuiThemeProvider>
                  </div>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <List>
                        <Subheader>Chores</Subheader>
                        <RaisedButton style={{marginTop: 5, marginBottom: 20}} label="Add Chore" secondary={true} labelStyle={{color: '#fff'}} onTouchTap={() => {this.handleOpen("Add Chore", "")}}/>
                        {chores}
                      </List>
                    </MuiThemeProvider>
                  </div>
                  <div className="input-field">

                  </div>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <RaisedButton type="submit" label="Save Settings" primary={true} labelStyle={{color: '#fff'}} onTouchTap={this.saveSettings}/>
                    </MuiThemeProvider>
                  </div>
                </form>
              </Col>
            </Row>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Dialog
                title={this.state.dialogTitle}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
              >
              {this.state.dialogBody}
                {/* <TextField style={{color: '#039BE5'}} floatingLabelText="Chore Description" fullWidth={true} type="text" name="description" onChange={(e) => {this.handleChange(e)}} />
                <Row>
                  <Col s={12}>
                    <TextField type="text" name="chore_name" floatingLabelText="Chore Name" onChange={(e) => {this.handleChange(e)}}/>
                  </Col>
                </Row>
                <Row>
                  <Col s={12}>
                    <DatePicker firstDayOfWeek={0}
                      container="dialog"
                      formatDate={this.formatDate}
                      onChange={(n, date) => {this.handleDate(date)}}
                      hintText="Date Picker" />
                  </Col>
                </Row>

                <Checkbox onCheck={(e, isChecked) => {this.handleCheck(e, isChecked)}} label="Recurring"/> */}
              </Dialog>
            </MuiThemeProvider>
          </div>
          :
          <Row>
            <Col s={12}>{this.state.nonAuthText}</Col>
          </Row>
        }
      </section>
    );
  }
}

export default GroupSettings;
