import React, { Component } from 'react';
import ReactGridLayout from 'react-grid-layout';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
var _ = require('lodash');
import './weekly.css';

/*This file handles display of the weekly calendar*/

class Weekly extends Component {
    static defaultProps = { 
        className: "layout",
        rowHeight: 30,
        onLayoutChange: function() {},
        cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
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
        <div key={i} className={l.static ? 'static' : ''}>
          {l.static ?
            <span className="text" title="This item is static and cannot be removed or resized.">Static - {i}</span>
            : <span className="text">{i}</span>
          }
        </div>);
    });
  }
  render() {
      var layoutNonState = [
          {i: 'a', x: 0, y: 0, w: 3, h: 2, isResizable: false},
          {i: 'b', x: 1, y: 0, w: 3, h: 2, isResizable: false},
          {i: 'c', x: 4, y: 0, w: 3, h: 2, isResizable: false}
      ];

    return (
    /*
      <ReactGridLayout className="layout" layout={layoutNonState} cols={12} rowHeight={30} width={900}>
        <div key={'a'}>a</div>
        <div key={'b'}>b</div>
        <div key={'c'}>c</div>
      </ReactGridLayout>*/
        /*
    <ResponsiveReactGridLayout className="layout" layouts={this.state.layouts}
      breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
      cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
      <div key={'a'}>a</div>
      <div key={'b'}>b</div>
      <div key={'c'}>c</div>
    </ResponsiveReactGridLayout>*/
        
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
/*
function generateLayout() {
    var layout = [
      {i: 'a', x: 0, y: 0, w: 3, h: 2, minW: 3, maxW: 3, minH: 2, maxH: 2},
      {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 3, maxW: 3, minH: 2, maxH: 2},
      {i: 'c', x: 4, y: 0, w: 3, h: 2, minW: 3, maxW: 3, minH: 2, maxH: 2}
    ];  
    return layout;
}*/

function generateLayout() {
  return _.map(_.range(0, 20), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
      console.log(i);
    return {
      x: _.random(0, 5) * 2 % 12,
      y: Math.floor(i / 6) * y,
      w: 1.5,
      h: 2,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}

export default Weekly;
