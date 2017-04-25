import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/*This file handles display of navigation*/

class Navigation extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/create">Create Room</Link></li>
          <li><Link to="/dw23498xz/weekly">Weekly Calendar</Link></li>
          <li><Link to="/dw23498xz/monthly">Monthly Calendar</Link></li>
        </ul>
      </div>
    );
  }
}

export default Navigation;
