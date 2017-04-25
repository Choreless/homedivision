import React, { Component } from 'react';

/*This file handles display of the monthly view*/

class Monthly extends Component {
  render() {
    return (
      <section className="container">
        <p>This is the monthly calendar view, with room ID: {this.props.match.params.roomID}</p>
      </section>
    );
  }
}

export default Monthly;
