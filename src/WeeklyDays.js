import React, { Component } from 'react';
import './weekly.css';

/*This file handles display of the weekly calendar*/

class WeeklyDays extends Component {
  render() {
    return (
        <div className="container-fluid">
          <div className="row seven-cols">
            <div className="col-md-1">Sunday</div>
            <div className="col-md-1">Monday</div>
            <div className="col-md-1">Tuesday</div>
            <div className="col-md-1">Wednesday</div>
            <div className="col-md-1">Thursday</div>
            <div className="col-md-1">Friday</div>
            <div className="col-md-1">Saturday</div>
          </div>
        </div>
    );
  }
}    
    
export default WeeklyDays;