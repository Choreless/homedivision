import React, { Component } from 'react';

/*This file displays the create/join room page*/

class CreateRoom extends Component {
  state = {
    isAuth: null
  }

  componentWillReceiveProps = (newProps) => {
    //Check for prop changes, and set state from here if something new comes up, since render does not re render component.
    if(newProps.isAuth !== this.state.isAuth) {
      this.setState({isAuth: newProps.isAuth});
    }
  }

  render() {
    return (
      <section className="container">
        <p>This is the create room page. Testing passed in prop via routing: {this.state.isAuth ? 'Auth is true' : 'Auth is false'}</p>
      </section>
    );
  }
}

export default CreateRoom;
