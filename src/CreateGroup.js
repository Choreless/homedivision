import React, { Component } from 'react';
/*This file displays the create/join group page*/

class CreateGroup extends Component {

  componentWillReceiveProps = (newProps) => {
    //Check for prop changes, and set state from here if something new comes up, since render does not re render component.
  }

  createGroupForm() {
    return (
      <div className="container">
        <h2>Create a New Group</h2>
        <div>
          <h4>Group Name</h4>
          <input type="text" />
          
          <h4>Passcode to Join</h4>
          <input type="text" />
          
          <h4>Confirm Passcode to Join</h4>
          <input type="text" />
          
          <button>Create Group</button>
        </div>
      </div>
    );
  }

  joinGroupForm() {
    return (
      <div className="container">
        <h2>Join a Group</h2>
        <div>
          <h4>Passcode to Join</h4>
          <input type="text" />
          <button>Join Group</button>
        </div>
      </div>
    );
  }

  groupForm() {
    //How are we storing/passing user data? need to check if they are in a group or not
    //if(!this.state.hasGroup) { 
      return (
        <div>
          {this.joinGroupForm()}
          {this.createGroupForm()}
        </div>
      );
    //} else {
      //leave a group?
    //}
  }

//How should i deal with authentication?
/*
  <section className="container">
    <p>This is the create group page. Testing passed in prop via routing: {this.props.auth ? 'Auth is true' : 'Auth is false'}</p>
  </section>
*/
  render() {
    return (
      <div>
        {this.groupForm()}
      </div>
    );
  }
}

export default CreateGroup;
