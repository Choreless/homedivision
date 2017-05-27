import React, { Component } from 'react';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import WeeklyDays from './WeeklyDays.js';
import './weekly.css';
import _ from 'lodash';
import { Row, Col, Collapsible, CollapsibleItem} from 'react-materialize';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { IconButton, Dialog, DatePicker, FlatButton, Checkbox, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, Drawer, MenuItem } from 'material-ui';
import ActionAddNote from 'material-ui/svg-icons/action/note-add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

//var choresRef = firebase.database().ref("groups/dw23498xz/chores");
/*This file handles display of the weekly calendar*/

class Weekly extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentBreakpoint: 'lg',
            mounted: false,
            layouts: {lg: this.props.initialLayout},
            items: this.generateLayout(),         
            open: true,
            userID: this.props.userID,
            groupID: this.props.groupID,
            chores: [],   
            newCounter: 0   
        };
    }    


    static propTypes = {
        onLayoutChange: PropTypes.func.isRequired
    };

    // This code is for a responsive grid layout; however, I set all the columns to be 8 (days + col for card deck)
    // since we will be switching to a different view on a md or lower breakpoint
    static defaultProps = {
        className: "layout",
        rowHeight: 30,
        cols: {lg: 8, md: 8, sm: 8, xs: 8, xxs: 8},
        initialLayout: generateLayout(),
        onLayoutChange: function() {},
    };  

  createElement(el) {
    var removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    };
    var i = el.add ? '+' : el.i;
    return (
      <div key={i} data-grid={el}>
        {el.add ?
          <span className="add text" onClick={this.onAddItem} title="You can add an item by clicking here, too.">Add +</span>
        : <span className="text">{i}</span>}
        <span className="remove" style={removeStyle} onClick={this.onRemoveItem.bind(this, i)}>x</span>
      </div>
    );
  }

    onAddItem() {
        /*eslint no-console: 0*/
     console.log('adding', 'n' + this.state.newCounter);
        this.setState({
            // Add a new item. It must have a unique key!
         items: this.state.items.concat({
            i: 'n' + this.state.newCounter,
            x: 0, // on the deck col
            y: Infinity, // puts it at the bottom
            w: 1,
            h: 2
        }),
    // Increment the counter to ensure key is always unique.
    newCounter: this.state.newCounter + 1
    });
    }

    onRemoveItem(i) {
        console.log('removing', i);
        this.setState({items: _.reject(this.state.items, {i: i})});
    }   

    componentWillReceiveProps = (newProps) => {
        //Check for prop changes, and set state from here if something new comes up, since render does not re render component.
        if(newProps.isAuth !== this.state.isAuth) {
        this.setState({isAuth: newProps.isAuth, userID: newProps.userID});
        }
    }

    componentWillMount = () => {
        console.log(this.state.items);
        console.log(this.state);
        // Sets the current groupID the user is in
        firebase.database().ref().on('value', (snapshot) => {
            const generalRef = snapshot.val();
           // console.log(generalRef.users[this.state.userID].group);
            if (generalRef.users[this.props.userID].group != null) {
                this.setState({
                    groupID: generalRef.users[this.props.userID].group
                });
            }
        })
        console.log(this.props.userID);
        // Saves the user color and handle info to state
        if (this.props.userID != null) {
            firebase.database().ref('users/' + this.props.userID).on('value', (snapshot) => {
            const userData = snapshot.val();
            if (userData != null) {
                this.setState({
                    userColor: userData.color,
                    userHandle: userData.handle
                });
            }
            }) 
        }        
    }
    componentDidMount = () => {
        this.setState({mounted: true});
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
/*
        firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //console.log("inside user");
                this.setState({
                    user: user
                });
        } else {
            // No user is signed in.
                        console.log("outside user");
        }
    });*/
        // grabs the group data from firebase, and save the chores list in the state as an array
        firebase.database().ref('groups/' + this.state.groupID).on('value', (snapshot) => {
            const currentGroup = snapshot.val();
            if (currentGroup != null) {
                this.setState({
                    chores: currentGroup.chores
                });
            }
            console.log(this.state.chores);
        })       
    }

    componentWillUnmount = () => {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
      let temp;
      if(window.innerWidth >= 992) temp = false;
      else temp = true;
      this.setState({ isMobile: temp});
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

      onLayoutChange = () => {
        console.log("changed desu");
                console.log(this.state.layouts);
      }
    // Creates the chore cards
    generateDOM = () => {
        return _.map(this.state.layouts.lg, function (l, i) {
            return (
                <div key={i} className={''}>
                <span className="text">Chore name here</span>
                </div>);
            });
        }
                     
    generateLayout() {
        return _.map(_.range(0, 10), function (item, i) {
        //var y = Math.ceil(Math.random() * 4) + 1;
        return {
            x: 0,
            y: Infinity, // puts card at the bottom
            w: 1,
            h: 2,
            i: i.toString(),
            isResizable: false,
        };
    });
        }                 
    // Get current chore card layout of group from firebase
    grabLayout() {
        // array of objects to be returned, represents chore cards in screen
        var currentLayout = [];
        if (this.state.groupID != null) {
            firebase.database().ref('groups/' + this.state.groupID + '/layout').on('value', (snapshot) => {
            // saves the layout field in firebase
            const layoutRef = snapshot.val();
            if (layoutRef != null) {
                for (var i = 0; i < layoutRef.length; i++) {
                    var card =  {
                                    x: layoutRef[i].x,
                                    y: Infinity,
                                    w: 1,
                                    h: 2,
                                    i: i,
                                    isResizable: false
                                }
                    currentLayout.push(card);
                }
            }
        })  
    }
    return currentLayout;
}     


    render() {
               console.log(this.state);
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
                {/* <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <Drawer containerStyle={{top: '65px', boxShadow: 'none'}} open={this.state.open}>
                    <div style={{height: 50}}></div>
                    <div style={{marginLeft: 50, height: 90}}>Jimmy</div>
                    <div style={{marginLeft: 50, height: 90}}>Jeff</div>
                  </Drawer>
                </MuiThemeProvider> */}
                <div>
                  <div className="container-fluid">
                      <div className="row seven-cols">
                          <div className="col-md-1 center">Deck
                                 <button onClick={this.onAddItem}>Add Item</button>     
                          </div>                
                          <div className="col-md-1 center">Sunday</div>
                          <div className="col-md-1 center">Monday</div>
                          <div className="col-md-1 center">Tuesday</div>
                          <div className="col-md-1 center">Wednesday</div>
                          <div className="col-md-1 center">Thursday</div>
                          <div className="col-md-1 center">Friday</div>
                          <div className="col-md-1 center">Saturday</div>
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

// Generate the layout of the chore cards
// Returns an array of objects
// x is the x position on the grid, defaults to 8, the chore deck column 
// y is the y position on the grid
// w and h are width and height
// i is the div key of the card

function generateLayout() {
    return _.map(_.range(0, 10), function (item, i) {
        //var y = Math.ceil(Math.random() * 4) + 1;
        return {
            x: 0,
            y: Infinity, // puts card at the bottom
            w: 1,
            h: 2,
            i: i.toString(),
            isResizable: false,
        };
    });
}

export default Weekly;

/*
col 0: deck
col 1: sunday
col 2: monday
col 3: tueday
col 4: wed
col 5: thur
col 6: friday
col 7: saturday
*/ 