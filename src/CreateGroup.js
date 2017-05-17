import React, { Component } from 'react';

/*This file displays the create/join room page*/

class CreateGroup extends Component {

  componentWillReceiveProps = (newProps) => {
    //Check for prop changes, and set state from here if something new comes up, since render does not re render component.
  }

  render() {
    return (
      <section className="container">
        <p>This is the create group page. Testing passed in prop via routing: {this.props.auth ? 'Auth is true' : 'Auth is false'}</p>
      </section>
    );
  }
}

export default CreateGroup;
