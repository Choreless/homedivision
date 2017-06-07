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

    componentWillMount = () => {
      if (this.props.userID !== null) {
          firebase.database().ref('users/' + this.props.userID).once('value').then((snapshot) => {
          const userData = snapshot.val();
          if (userData !== null) {
              this.setState({
                  userColor: this.props.userColor,
                  userHandle: this.props.userHandle
              });
          }
        })
      }
      this.layoutRef = firebase.database().ref('groups/'+this.props.match.params.groupID + '/layout');
      this.layoutRef.on('value', (snapshot) => {
        this.setState({items: snapshot.val() || [], layouts: {lg: snapshot.val() || []}}) //update the layout for everyone viewing it
      })


        // grabs the group data from firebase, and save the chores list in the state as an array
       firebase.database().ref('groups/' + this.props.match.params.groupID).once('value').then((snapshot) => {
           const currentGroup = snapshot.val();
           if(this.props.userID) {
             if(_.indexOf(currentGroup.members, this.props.userID) === -1) {
               alert('You do not have permission to view this group');
               this.props.history.push('/');
               console.log('User does not belong');
             } else {
               if (currentGroup != null) {
                   this.setState({
                       chores: currentGroup.chores
                   });
               }
             }
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
        for(let i = 0; i < newLayout.length; i++) {
          newLayout[i].isDraggable = true;
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
          if (newLayout[i]['x'] !== 0) { //chore card is on a day of a week
            if (this.state.items[i].owner == "") {
              newLayout[i]['owner'] = this.props.userID;
            }
          } else if (newLayout[i]['x'] !== 0 && this.state.items[i].owner !== "") {
              newLayout[i]['owner'] = this.state.items[i].owner;
           } else if (newLayout[i]['x'] == 0) { //the chore card is now in the deck
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
          // if (this.state.items[i].owner !== this.props.userID && this.state.items[i].owner !== "") { //causing weird constant fb write bug
          //   newLayout[i].isDraggable = false;
          // } else {
          //   newLayout[i].isDraggable = true;
          // }
          if (this.state.items[i].userHandle !== "") {
            if (this.state.items[i].userHandle === this.props.userHandle) {
              newLayout[i]['color'] = this.props.userColor;
            } else {
              newLayout[i]['color'] = this.state.items[i].color;
            }
          } else {
            newLayout[i]['color'] = "";
          }
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
                            owner: "",
                            color: ""
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
        //if (newItems[i].owner == this.props.userID) {
          newItems.splice(i, 1);
          this.setState({
              items: newItems,
              popoverOpen: false,
          })
        //}
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
        var cardStyle = {background: this.state.userColor};
        return (
        <div style={cardStyle} onTouchTap={(event) => this.handleTouchTap(event, el.i)} key={el.i} data-grid={el}>
          {el.chore} <br />
          Completed: {el.completed.toString()} <br/>
          Assigned: {el.userHandle}
        </div>
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

    createMenu = (currentCard) => {
      var currentItems = this.state.items;
      if(currentItems !== undefined && currentItems !== null && currentItems.length > 0) {
        if(currentItems[currentCard].x <= this.state.currentDay) {
          return (
            <Menu>
              <MenuItem primaryText="Mark as Complete" onTouchTap={() => this.onMarkComplete(currentCard)}/>
              <MenuItem primaryText="Remove" onTouchTap={() => this.onRemoveItem(currentCard)}/>
            </Menu>
          );
        }
      }
      return (<div></div>);
    }

    render() {
      let chores = _.map(this.state.chores, (elem,index) => {
        return (
          <MenuItem key={'chore-'+index} value={elem} primaryText={elem} />
        )
      })

      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let dayTitles = _.map(days, (elem, index) => {
        return (
          <div key={'Day-'+index} className={index === this.state.currentDay ? "col-md-1 center currentDay" : "col-md-1 center"}>{days[index]} <hr/></div>
        )
      })

        return (
          <div>
            {/*this.state.isMobile ?
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
            :*/
              <section>
                <div>
                  <div className="container-fluid">
                      <div className="row seven-cols">
                          <div className="col-md-1">
                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                              <SelectField
                                floatingLabelText={chores.length > 0 ? "Select Chore to Add" : 'No Chores Found'}
                                value={this.state.value}
                                onChange={this.handleChange}
                                autoWidth={false}
                                disabled={chores.length > 0 ? false : true}
                                style={{width: 200, marginTop: -10}}
                              >

                                {chores}
                              </SelectField>
                            </MuiThemeProvider>
                          </div>
                          {dayTitles}
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

// set inital layout to be no cards
function generateLayout() {
    return _.map(_.range(0, 0), function (item, i) {
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
