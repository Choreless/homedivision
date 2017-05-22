import React, { Component } from 'react';
import './weekly.css';

/*This file handles display of the weekly calendar*/

class WeeklyDays extends Component {
  render() {
    return (
        <div className="container-fluid">
            <div className="row seven-cols">
                <div className="col-md-1 center">Sunday</div>
                <div className="col-md-1 center">Monday</div>
                <div className="col-md-1 center">Tuesday</div>
                <div className="col-md-1 center">Wednesday</div>
                <div className="col-md-1 center">Thursday</div>
                <div className="col-md-1 center">Friday</div>
                <div className="col-md-1 center">Saturday</div>
                <div className="col-md-1 center">Deck</div>   
            </div>
        </div>
    );
  }
}    
    
export default WeeklyDays;