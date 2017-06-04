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
import { IconButton, Dialog, DatePicker, FlatButton, Checkbox, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, Drawer, MenuItem, Menu, Popover, SelectField } from 'material-ui';
import ActionAddNote from 'material-ui/svg-icons/action/note-add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import RaisedButton from 'material-ui/RaisedButton';

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
      currentCard: 0,
      value: undefined,
      currentDay: new Date().getDay() + 1,
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
        console.log(newProps);
        // Saves the user color and handle info to state
        if (this.props.userID !== null) {
            firebase.database().ref('users/' + this.props.userID).once('value').then((snapshot) => {
            const userData = snapshot.val();
            if (userData !== null) {
                this.setState({
                    userColor: newProps['userColor'],
                    userHandle: newProps['handle']
                });
            }
          })
        }
    }

    componentDidMount = () => {
      this.layoutRef = firebase.database().ref('groups/'+this.props.match.params.groupID + '/layout');
      this.layoutRef.on('value', (snapshot) => {
        this.setState({items: snapshot.val()});
      })
        // grabs the group data from firebase, and save the chores list in the state as an array
       firebase.database().ref('groups/' + this.props.match.params.groupID).once('value').then((snapshot) => {
           const currentGroup = snapshot.val();
           if (currentGroup != null) {
               this.setState({
                   chores: currentGroup.chores
               });
           }
       })

//        firebase.database().ref('users/' + this.state.userID).once('value').then((snapshot) => {
//            const userColor = snapshot.val();
//           this.setState({
//               userColor: userColor
//           })
//        })

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
      this.layoutRef.off();
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

       onLayoutChange = (changedLayout) => {
         var newLayout = changedLayout;
         console.log(this.state.items);
         console.log(newLayout);
        for(let i = 0; i < newLayout.length; i++) {
          newLayout[i]['maxH'] = 10;
          newLayout[i]['maxW'] = 10;
          newLayout[i]['minH'] = 1;
          newLayout[i]['minW'] = 0;
          newLayout[i]['chore'] = this.state.items[i].chore;
          newLayout[i]['i'] = i.toString();
          if (newLayout[i]['x'] !== this.state.items[i].x) {
            newLayout[i]['completed'] = false;
          } else {
            newLayout[i]['completed'] = this.state.items[i].completed;
          }
          // A chore card is assigned an owner only if its not in the deck (at x=0)
          if (newLayout[i]['x'] !== 0 && this.state.items[i].owner == "") { //chore card is on a day of a week
              newLayout[i]['owner'] = this.props.userID;
          } else if (newLayout[i]['x'] !== 0 && this.state.items[i].owner !== "") { //the chore card is now in the deck
              newLayout[i]['owner'] = this.state.items[i].owner;
           } else {
              newLayout[i]['owner'] = "";
          }          
          if (newLayout[i]['owner'] !== "") {
            if (this.state.items[i].owner == this.props.userID) {
              newLayout[i]['userHandle'] = this.props.userHandle;
            } else if (newLayout[i]['owner'] !== this.props.userID) {
              newLayout[i]['userHandle'] = this.state.items[i].userHandle;
            } 
          } else {
            newLayout[i]['userHandle'] = "";
          }
          if (this.state.items[i].owner !== this.props.userID) {
            newLayout[i].isDraggable = false; 
          } else {
            newLayout[i].isDraggable = true;
          }
          // if (newLayout[i]['owner'] !== "") {
          //   if (this.state.items[i].owner == this.props.userID) {
          //     newLayout[i]['color'] = this.props.userColor
          //   } else if (newLayout[i]['owner'] !== this.props.userID) {
          //     newLayout[i]['color'] = this.state.items[i].color
          //   }
          // } else {
          //   newLayout[i]['color'] = "";
          // }
        }

        firebase.database().ref('groups/'+this.props.match.params.groupID).update({
          layout: newLayout
        }).then(() => {
          console.log('Succesfully updated');
        }).catch((err) => {
          alert('Error occured', err);
        })
      }

    onAddItem = (chore) => {
        var addedChore = {
                            i: 'n' + this.state.newCounter,
                            x: 0, // on the deck col
                            y: Infinity, // puts it at the bottom
                            w: 1,
                            h: 2,
                            isResizable: false,
                            chore: chore,
                            maxW: 10,
                            maxH: 10,
                            minH: 1,
                            minW: 0,
                            isDraggable: true,
                            completed: false,
                            userHandle: "",
                            owner: ""
                            // color: ""
                        }
        // if there are no chore cards, set this to be the first item
        if (this.state.items == null) {
            var newLayout = []
            newLayout.push(addedChore);
            this.setState({
                items: newLayout,
            })
        } else { // add new chore card to item
            this.setState({
                items: this.state.items.concat([addedChore])
            })
        }
        this.setState({ // ensure key is always unique
            newCounter: this.state.newCounter + 1
        })
    }

    onRemoveItem = (i) => {
        var newItems = this.state.items;
        if (newItems[i].owner == this.props.userID) {
          newItems.splice(i, 1);
          this.setState({
              items: newItems,
              popoverOpen: false,
          })
        }
    }

    onMarkComplete = (i) => {
        var currentItems = this.state.items;
        if (currentItems[i].x <= this.state.currentDay) { // cannot mark chore as complete if it assigned on future day
            currentItems[i].completed = true;
            firebase.database().ref('groups/'+this.props.match.params.groupID).update({
            layout: currentItems
            })        
        }
    }

    createElement = (el) => {
        var cardColor = "#ffffff";   
        if (el.x !== 0) {
            cardColor = this.state.userColor;
        }
        var cardStyle = {background: cardColor};
        return (
        <div style={cardStyle} onTouchTap={(event) => this.handleTouchTap(event, el.i)} key={el.i} data-grid={el}>{el.chore} Completed: {el.completed.toString()} Assigned: {el.userHandle}</div>
        );
    }

    // Get current chore card layout of group from firebase
    grabLayout = () => {
        // array of objects to be returned, represents chore cards in screen
        firebase.database().ref('groups/' + this.props.match.params.groupID + '/layout').once('value').then((snapshot) => {
          this.setState({items: snapshot.val()})
        });
    }

//i is the index. l is the object containing x/y coords.
    handleTouchTap = (event, index) => {
    // need to fix bug of event not being passedd into here so popover is showing up top left
      // This prevents ghost click.
      event.preventDefault();
      this.setState({
        popoverOpen: true,
        anchorEl: event.currentTarget
      });
        this.setState({
            currentCard: index
        })
    };

    handleRequestClose = () => {
      this.setState({
        popoverOpen: false,
      });
    };

    handleChange = (event, index, value) => {
      if(value !== null) {
        this.onAddItem(value);
        this.setState({value: null});
      }
    }

    render() {
      let chores = _.map(this.state.chores, (elem,index) => {
        return (
          <MenuItem key={'chore-'+index} value={elem} primaryText={elem} />
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
                    <Collapsible popout>
                    	<CollapsibleItem header='Sunday'>
                    		Lorem ipsum dolor sit amet.
                    	</CollapsibleItem>
                    	<CollapsibleItem header='Monday'>
                    		Lorem ipsum dolor sit amet.
                    	</CollapsibleItem>
                    	<CollapsibleItem header='Tuesday'>
                    		Lorem ipsum dolor sit amet.
                    	</CollapsibleItem>
                      <CollapsibleItem header='Wednesday'>
                    		Lorem ipsum dolor sit amet.
                    	</CollapsibleItem>
                      <CollapsibleItem header='Thursday'>
                    		Lorem ipsum dolor sit amet.
                    	</CollapsibleItem>
                      <CollapsibleItem header='Friday'>
                    		Lorem ipsum dolor sit amet.
                    	</CollapsibleItem>
                      <CollapsibleItem header='Saturday'>
                    		Lorem ipsum dolor sit amet.
                    	</CollapsibleItem>
                    </Collapsible>
                    List of chores <br/>
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <SelectField
                        value={this.state.value}
                        onChange={this.handleChange}
                        autoWidth={false}
                        style={{width: 200}}
                      >
                        <MenuItem value={null} primaryText=""/>
                        {chores}
                      </SelectField>
                    </MuiThemeProvider>
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
                          <div className="col-md-1">
                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                              <SelectField
                                floatingLabelText="Select Chore to Add"
                                value={this.state.value}
                                onChange={this.handleChange}
                                autoWidth={false}
                                style={{width: 200, marginTop: -10}}
                              >
                                <MenuItem value={null} primaryText=""/>
                                {chores}
                              </SelectField>
                            </MuiThemeProvider>
                          </div>
                          <div className="col-md-1 center">Sunday <hr/></div>
                          <div className="col-md-1 center">Monday <hr/></div>
                          <div className="col-md-1 center">Tuesday <hr/></div>
                          <div className="col-md-1 center">Wednesday <hr/></div>
                          <div className="col-md-1 center">Thursday <hr/></div>
                          <div className="col-md-1 center">Friday <hr/></div>
                          <div className="col-md-1 center">Saturday <hr/></div>
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
                        <MenuItem primaryText="Mark as Complete" onTouchTap={() => this.onMarkComplete(this.state.currentCard)}/>
                        <MenuItem primaryText="Remove" onTouchTap={() => this.onRemoveItem(this.state.currentCard)}/>
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