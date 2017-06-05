import React, { Component } from 'react';
import firebase from 'firebase';
import {TextField, RaisedButton} from 'material-ui';

class JoinGroupForm extends Component{

    state = {
        passcode: undefined,
        errorText: '',
        disabled: true,
        icon: undefined,
        currentMembers: undefined
    };

    //handle join group button
    joinGroup = event => {
        event.preventDefault();
        var groupID = null;
        
        //check if passcode is valid
        firebase.database().ref('groups').once('value').then((snapshot) => {
          let groupCode = this.state.passcode.trim();
          for(let group in snapshot.val()) {
            if(snapshot.val()[group].passcode === groupCode) {
              groupID = group;
              break;
            }
        }

        if(groupID != null) {
            // check that user is not already in the group
            firebase.database().ref('groups/' + groupID + '/members').once('value').then((snapshot) => {
                var currentMembers = snapshot.val();
                let userExists = false;
                
                // loop through current members and check for match
                for(let userID in currentMembers) {
                    if (userID === this.props.userID) {
                        userExists = true;
                        break;
                    }
                }
                
                if(!userExists) {
                    //add user to currentMembers
                    if (currentMembers == null) {
                        currentMembers = [];
                    }
                    currentMembers.push(this.props.userID);                
                    firebase.database().ref('groups/' + groupID).update({
                        members: currentMembers
                    }).then(() => {  
                        firebase.database().ref('users/' + this.props.userID).update({
                            group: groupID
                        })
                    }).catch((err) =>{
                        alert('Error occured', err);
                    })

                    //redirect 
                    this.props.history.push("/" + groupID + "/weekly");
                }
            });
          } else {
            this.setState({errorText: 'Passcode does not belong to a group. Please try a different passcode.'});
          }
        })
    }

    handleChange = (event) => {
        var field = event.target.name;
        var value = event.target.value;
        var changes = {}; //object to hold changes
        changes[field] = value; //change this field
        this.setState(changes); //update state
        this.setState({errorText: ''});
        if(this.state.passcode) this.setState({disabled: false});
    }

    render() {
        return (
            <div className="container">
                <h4>Join a Group</h4>
                <div style={{color: '#E53935'}}>{this.state.errorText}</div>
                <form role="form" onSubmit={this.joinGroup}>
                    <div className="input-field">
                        <TextField style={{color: '#039BE5'}} floatingLabelText="Passcode to Join" fullWidth={true} type="passcode" name="passcode" onChange={(e) => {this.handleChange(e)}}/>
                    </div>

                    <RaisedButton type="submit" label={!this.state.icon && 'Join Group'} icon={this.state.icon} primary={true} disabled={this.state.disabled} labelStyle={{color: '#fff'}} onTouchTap={this.joinGroup}/>
                </form>
            </div>
        );
    }
}

export default JoinGroupForm;
