import React, { Component } from 'react';
import {TextField, RaisedButton, CircularProgress, Dialog, FlatButton, Checkbox} from 'material-ui';
import firebase from 'firebase';
import randomatic from 'randomatic';
import fbcontroller from './fbcontroller';

class CreateGroupForm extends Component{

    state = {
        groupName: undefined,
        errorText: '',
        disabled: true,
        icon: undefined,
        open: false,
    };

    //handle create group button
    createGroup = event => {
        event.preventDefault();
        let passcode = randomatic('A0', 5);
        let groupcode = randomatic('Aa0', 9);
        this.setState({passcode: passcode, groupcode: groupcode});
        firebase.database().ref('groups/'+groupcode).set({
          members: [this.props.userID],
          passcode: passcode,
          name: this.state.groupName
        }).then(() => {
          firebase.database().ref('users/' + this.props.userID).update({
            group: groupcode
          })
          //Adding default chores if selected
          if(document.getElementById("defaultChores").checked) {
          var choreList = ["Take out the trash", "Vacuum", "Clean the bathroom", "Clean the kitchen", "Dusting", "Wipe the windows"];
          fbcontroller.updateChores(groupcode, choreList);
          }
          this.setState({open: true});
        }).catch((err) =>{
          alert('Error occured', err);
        })
    }

    handleChange = (event) => {
        var field = event.target.name;
        var value = event.target.value;
        var changes = {}; //object to hold changes
        changes[field] = value; //change this field
        this.setState(changes); //update state
        this.setState({errorText: ''});
        if(this.state.groupName) this.setState({disabled: false});
    }

    handleClose = () => {
      this.setState({open: false});
      this.props.history.push('/' + this.state.groupcode + '/weekly')
          window.location.reload()
    };

    handleEmail = () => {
      let subject = "Choreless Group Invite";
      let body = "You've been invited to join a Choreless Group. Your group passcode is: " + this.state.passcode;
      body += "To join the group visit https://github.com/HomeDivision/Choreless. Log in or create an account, then use the above passcode to join the group.";
      window.open('mailto:?subject=' + subject + '&body=' + body);
    };

    render() {
      const actions = [
        <FlatButton
          label="Go To Group"
          primary={true}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          label="Invite others"
          primary={true}
          onTouchTap={this.handleEmail}
        />
      ];

      const styles = {
        block: {
          marginTop: 10,
          maxWidth: 400
        },
        checkbox: {
          marginBottom: 16,
        },
      };
        return (
            <div className="container">
                <h4>Create a New Group</h4>
                <div style={{color: '#E53935'}}>{this.state.errorText}</div>
                <form role="form" onSubmit={this.createGroup}>
                    <div className="input-field">
                        <TextField style={{color: '#039BE5'}} floatingLabelText="Group Name" fullWidth={true} type="groupName" name="groupName" onChange={(e) => {this.handleChange(e)}}/>
                    </div>

                    <RaisedButton type="submit" label={!this.state.icon && 'Create Group'} icon={this.state.icon} primary={true} disabled={this.state.disabled} labelStyle={{color: '#fff'}}/>
                </form>
                <div style={styles.block}>
                  <Checkbox id="defaultChores"
                  label="Include a set of common chores to my group on creation"
                  style={styles.checkbox}
                  />
                </div>
                <Dialog
                  title="Group Created"
                  actions={actions}
                  modal={false}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                >
                 Use this passcode to allow others to join the group! <br/>
                 Passcode: <span style={{fontSize: '2rem'}}>{this.state.passcode}</span>
                </Dialog>
            </div>
        );
    }
}

export default CreateGroupForm;
