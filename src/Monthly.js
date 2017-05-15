import React, { Component } from 'react';
import { Row, Col, Collapsible, CollapsibleItem } from 'react-materialize';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { IconButton, Dialog, DatePicker, FlatButton, Checkbox } from 'material-ui';
import ActionAddNote from 'material-ui/svg-icons/action/note-add';

/*This file handles display of the monthly view*/

class Monthly extends Component {
  state = {
    open: false
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleCheck = (elem, isChecked) => {
    console.log('Checkbox status', isChecked);
  }

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <section className="container">
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
                    <ul>
                      <li>Chore 1 : Monday</li>
                      <li>Chore 2 : Friday</li>
                    </ul>
                  </Col>
                  <Col s={2}>
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <IconButton tooltip="Add Chore" onTouchTap={this.handleOpen}><ActionAddNote/></IconButton>
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
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Dialog
            title="Add Chore"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            Open a Date Picker dialog from within a dialog.
            <DatePicker hintText="Date Picker" />
            <Checkbox onCheck={(e, isChecked) => {this.handleCheck(e, isChecked)}} label="Recurring"/>
          </Dialog>
        </MuiThemeProvider>
      </section>
    );
  }
}

export default Monthly;
