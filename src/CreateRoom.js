import React, { Component } from 'react';

/*This file displays the create/join room page*/

class CreateRoom extends Component {
  render() {
    return (
      <section className="container">
        <p>This is the create room page. Testing passed in prop via routing: {this.props.auth ? 'Auth is true' : 'Auth is false'}</p>
      </section>
    );
  }
}

export default CreateRoom;
