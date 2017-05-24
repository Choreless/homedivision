import React, { Component } from 'react';
import {TextField, RaisedButton, CircularProgress} from 'material-ui';

class CreateGroupForm extends Component{
    
    state = {
        groupName: undefined,
        errorText: '',
        disabled: true,
        icon: undefined
    };

    //handle create group button
    createGroup = event => {

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

    render() {
        return (
            <div className="container">
                <h4>Create a New Group</h4>
                <div style={{color: '#E53935'}}>{this.state.errorText}</div>
                <form role="form" onSubmit={this.signIn}>
                    <div className="input-field">
                        <TextField style={{color: '#039BE5'}} floatingLabelText="Group Name" fullWidth={true} type="groupName" name="groupName" onChange={(e) => {this.handleChange(e)}}/>
                    </div>
                    
                    <RaisedButton type="submit" label={!this.state.icon && 'Create Group'} icon={this.state.icon} primary={true} disabled={this.state.disabled} labelStyle={{color: '#fff'}} onTouchTap={this.createGroup}/>
                </form>
            </div>
        );
    }
}

export default CreateGroupForm;