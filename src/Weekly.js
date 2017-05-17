import React, { Component } from 'react';
//import firebase from 'firebase';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import WeeklyDays from './WeeklyDays.js';
import './weekly.css';
var _ = require('lodash');

//var generalRef = firebase.database().ref("groups/dw23498xz/chores");

/*This file handles display of the weekly calendar*/

class Weekly extends Component {
    
    static propTypes = {
        onLayoutChange: PropTypes.func.isRequired
    };    
    
    // This code is for a responsive grid layout; however, I set all the columns to be 8 (days + col for card deck)
    // since we will be switching to a different view on a md or lower breakpoint 
    static defaultProps = { 
        className: "layout",
        rowHeight: 30,
        onLayoutChange: function() {},
        cols: {lg: 8, md: 8, sm: 8, xs: 8, xxs: 8},
        initialLayout: generateLayout()
    };    

    constructor(props) {
        super(props);
        this.state = {
            currentBreakpoint: 'lg',
            mounted: false,
            layouts: {lg: this.props.initialLayout},
        };
    }

    componentDidMount() {
        this.setState({mounted: true});
    }

    onBreakpointChange = (breakpoint) => {
        this.setState({
            currentBreakpoint: breakpoint
        });
      };

      onLayoutChange = (layout, layouts) => {
        this.props.onLayoutChange(layout, layouts);
      };

      onNewLayout = () => {
        this.setState({
          layouts: {lg: generateLayout()}
        });
      };


    // Creates the chore cards
    generateDOM() {
        return _.map(this.state.layouts.lg, function (l, i) {
            return (
                <div key={i} className={''}>
                <span className="text">Chore name here</span>
                </div>);
            });
        }
                     
    render() {
        return (
            <div>
                <WeeklyDays

                />
            
                <ResponsiveReactGridLayout
                    {...this.props}
                    layouts={this.state.layouts}
                    onBreakpointChange={this.onBreakpointChange}
                    onLayoutChange={this.onLayoutChange}
                    // WidthProvider option
                    measureBeforeMount={true}>
                    {this.generateDOM()}
                </ResponsiveReactGridLayout>
            </div>
        );
    }
}

// Sets the properties for each chore card
// x is the x position on the grid, defaults to 8, the chore deck column 
// y is the y position on the grid
// w and h are width and height
// i is the div key of the card
function generateLayout() {
    return _.map(_.range(0, 10), function (item, i) {
        var y = Math.ceil(Math.random() * 4) + 1;
        return {
            x: 8,
            y: Math.floor(i / 6) * y,
            w: 1,
            h: 2,
            i: i.toString(),
            isResizable: false,
        };
    });
}

export default Weekly;