import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
var _ = require('lodash');
import './weekly.css';

/*This file handles display of the weekly calendar*/

class Weekly extends Component {
    
    static propTypes = {
        onLayoutChange: PropTypes.func.isRequired
    };    
    
    static defaultProps = { 
        className: "layout",
        rowHeight: 30,
        onLayoutChange: function() {},
        cols: {lg: 7, md: 7, sm: 7, xs: 7, xxs: 7},
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

    generateDOM() {
        return _.map(this.state.layouts.lg, function (l, i) {
            return (
                <div key={i} className={''}>
                <span className="text">Take out the trash</span>
                </div>);
            });
        }
                     
    render() {
        return (
            <div>
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

function generateLayout() {
    return _.map(_.range(0, 20), function (item, i) {
        var y = Math.ceil(Math.random() * 4) + 1;
        return {
            x: _.random(0, 5) * 2 % 12,
            y: Math.floor(i / 6) * y,
            w: 1,
            h: 2,
            i: i.toString(),
            isResizable: false,
        };
    });
}

export default Weekly;