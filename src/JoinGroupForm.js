import React, { Component } from 'react';
import firebase from 'firebase';
//import fbcontroller from './fbcontroller';
import {TextField, RaisedButton, CircularProgress} from 'material-ui';

class JoinGroupForm extends Component{

    state = {
        passcode: undefined,
        errorText: '',
        disabled: true,
        icon: undefined
    };


    //handle join group button
    joinGroup = event => {
        event.preventDefault();
        let temp = this.state.passcode.trim();
        //check if passcode is valid
        firebase.database().ref('groups/' + temp).once('value').then((snapshot) => {
        if(snapshot.val()) this.props.history.push("/" + temp + "/weekly");
        else this.setState({errorText: 'Passcode does not belong to a group. Please try a different passcode.'});
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
