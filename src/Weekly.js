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
import { IconButton, Dialog, DatePicker, FlatButton, Checkbox, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, Drawer, MenuItem, Menu, Popover } from 'material-ui';
import ActionAddNote from 'material-ui/svg-icons/action/note-add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import RaisedButton from 'material-ui/RaisedButton';

//var choresRef = firebase.database().ref("groups/dw23498xz/chores");
/*This file handles display of the weekly calendar*/

class Weekly extends Component {
    state = {
      popoverOpen: false,
      currentBreakpoint: 'lg',
      mounted: false,
      layouts: {lg: this.props.initialLayout},
      open: true,
      items: [],
      userID: this.props.userID,
      groupID: this.props.groupID,
      chores: [],
      newCounter: 0,
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
        onLayoutChange: () => {}
    };

    componentWillReceiveProps = (newProps) => {
        var groupID = this.props.location.pathname.split('/')[1]; //grabs groupID from url parameter

        //Check for prop changes, and set state from here if something new comes up, since render does not re render component.
        if(newProps.isAuth !== this.state.isAuth) {
        this.setState({isAuth: newProps.isAuth, userID: newProps.userID});
        }

        // Saves the user color and handle info to state
        if (this.props.userID !== null) {
            firebase.database().ref('users/' + this.props.userID).once('value').then((snapshot) => {
            const userData = snapshot.val();
            if (userData !== null) {
                this.setState({
                    userColor: userData.color,
                    userHandle: userData.handle
                });
            }
          })
        }
    }

    componentDidMount = () => {
        // grabs the group data from firebase, and save the chores list in the state as an array
       firebase.database().ref('groups/' + this.props.match.params.groupID).once('value').then((snapshot) => {
           const currentGroup = snapshot.val();
           if (currentGroup != null) {
               this.setState({
                   chores: currentGroup.chores
               });
           }
       })

       this.setState({
           items: this.grabLayout()
       });

       this.setState({
           layouts:{lg: this.state.items}
       })
        this.setState({mounted: true});
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
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

      onNewLayout = () => {
        this.setState({
          layouts: {lg: generateLayout()}
        });
      };

      onLayoutChange = (newLayout) => {
        for(let i = 0; i < newLayout.length; i++) {
          newLayout[i].isDraggable = true;
          newLayout[i]['maxH'] = 10;
          newLayout[i]['maxW'] = 10;
          newLayout[i]['minH'] = 1;
          newLayout[i]['minW'] = 0;
          newLayout[i]['chore'] = this.state.items[i].chore;
        }
        firebase.database().ref('groups/'+this.props.match.params.groupID).update({
          layout: newLayout
        }).then(() => {
          console.log('Succesfully updated');
        }).catch((err) => {
          alert('Error occured', err);
        })
      }

    onAddItem = () => {
        /*eslint no-console: 0*/
        this.setState({
            // Add a new item. It must have a unique key!
         items: this.state.items.concat([{
            i: 'n' + this.state.newCounter,
            x: 0, // on the deck col
            y: Infinity, // puts it at the bottom
            w: 1,
            h: 2
        }]),
    // Increment the counter to ensure key is always unique.
    newCounter: this.state.newCounter + 1
    });
    }

    onRemoveItem = (i) => {
        console.log('removing', i);
        this.setState({items: _.reject(this.state.items, {i: i})});
    }

    createElement = (el) => {
        var removeStyle = {
            position: 'absolute',
            right: '2px',
            top: 0,
            cursor: 'pointer'
        };
        var i = el.i;
        return (
        <div onTouchTap={this.handleTouchTap} key={i} data-grid={el}>{el.chore}</div>
        );
    }

    // Get current chore card layout of group from firebase
    grabLayout = () => {
        // array of objects to be returned, represents chore cards in screen
        var currentLayout = [];
        firebase.database().ref('groups/' + this.props.match.params.groupID + '/layout').once('value').then((snapshot) => {
          this.setState({items: snapshot.val()})
        });
    }

//i is the index. l is the object containing x/y coords.
    handleTouchTap = (event) => {
      // This prevents ghost click.
      event.preventDefault();
      this.setState({
        popoverOpen: true,
        anchorEl: event.currentTarget,
      });
    };

    handleRequestClose = () => {
      this.setState({
        popoverOpen: false,
      });
    };


    render() {
      let chores = _.map(this.state.items, (elem,index) => {
        return (
          <li key={'Chore-'+index}>{elem.chore}</li>
        )
      })
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
                    List of chores <br/>
                    <ul>
                      {chores}
                    </ul>
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
                                 <button onTouchTap={this.onAddItem}>Add Item</button>
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
                        {_.map(this.state.items, this.createElement)}
                    </ResponsiveReactGridLayout>
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <Popover
                        open={this.state.popoverOpen}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={this.handleRequestClose}
                      >
                      <Menu>
                        <MenuItem primaryText="Mark as Complete" />
                        <MenuItem primaryText="Edit Chore" />
                        <MenuItem primaryText="Remove" />
                      </Menu>
                      </Popover>
                    </MuiThemeProvider>
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


// set inital layout to be no cards
function generateLayout() {
    return _.map(_.range(0, 0), function (item, i) {
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
