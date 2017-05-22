import React, { Component } from 'react';
//import firebase from 'firebase';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import WeeklyDays from './WeeklyDays.js';
import './weekly.css';
import _ from 'lodash';
import { Row, Col, Collapsible, CollapsibleItem} from 'react-materialize';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { IconButton, Dialog, DatePicker, FlatButton, Checkbox, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import ActionAddNote from 'material-ui/svg-icons/action/note-add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import controller from './check';


//var generalRef = firebase.database().ref("groups/dw23498xz/chores");

/*This file handles display of the weekly calendar*/

class Weekly extends Component {
    state = {
      currentBreakpoint: 'lg',
      mounted: false,
      layouts: {lg: this.props.initialLayout},
    }

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

    componentDidMount = () => {
        this.setState({mounted: true});
        this.setState({isMobile: controller.checkMobile()});
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
    generateDOM = () => {
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
            {this.state.isMobile ?
              <section>
                <Row className="reduce-bot-margin">
                  <Col s={12}>
                    <h2 style={{fontSize: '1.8rem'}}>Monthly Calendar</h2>
                  </Col>
                </Row>
                <Row>
                  <Col s={12}>
                    <h3 style={{fontSize: '1.4rem'}}>Members</h3>
                    <Collapsible popout>
                      <CollapsibleItem header='Group Member 1'>
                        This is the monthly calendar view, with room ID: {this.props.match.params.roomID}
                      </CollapsibleItem>
                      <CollapsibleItem header='Group Member 2'>
                        <Row>
                          <Col s={10}>
                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                              <Table
                                selectable={false}>
                                <TableHeader
                                  displaySelectAll={false}
                                  adjustForCheckbox={false}>
                                  <TableRow>
                                    <TableHeaderColumn>Chore</TableHeaderColumn>
                                    <TableHeaderColumn>Time</TableHeaderColumn>
                                    <TableHeaderColumn>Edit</TableHeaderColumn>
                                  </TableRow>
                                </TableHeader>
                                <TableBody
                                  displayRowCheckbox={false}>
                                  <TableRow>
                                    <TableRowColumn>Clean Dishes</TableRowColumn>
                                    <TableRowColumn>Mon</TableRowColumn>
                                    <TableRowColumn><IconButton><EditIcon/></IconButton></TableRowColumn>
                                  </TableRow>
                                  <TableRow>
                                    <TableRowColumn>Do Laundry</TableRowColumn>
                                    <TableRowColumn>Sun</TableRowColumn>
                                    <TableRowColumn><IconButton><EditIcon/></IconButton></TableRowColumn>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </MuiThemeProvider>
                          </Col>
                          <Col s={2}>
                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                              <IconButton iconStyle={{height: 36, width: 36}} tooltip="Add Chore Card" onTouchTap={this.handleOpen}><ActionAddNote/></IconButton>
                            </MuiThemeProvider>
                          </Col>
                        </Row>
                      </CollapsibleItem>
                      <CollapsibleItem header='Group Member 3'>
                        Lorem ipsum dolor sit amet.
                      </CollapsibleItem>
                    </Collapsible>
                  </Col>
                </Row>
              </section>
            :
              <section>
                <div>
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
              </section>
            }
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
