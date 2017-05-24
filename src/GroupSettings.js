import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { TextField, RaisedButton, List, ListItem, Subheader, CircularProgress, Checkbox, DatePicker, FlatButton, Dialog } from 'material-ui';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

/*This file displays the create/join room page*/

class GroupSettings extends Component {
  state = {
    isAuth: undefined,
    open: false,
    loading: undefined,
    nonAuthText: ''
  }

  componentWillReceiveProps = (newProps) => {
    //Check for prop changes, and set state from here if something new comes up, since render does not re render component.
    if(newProps.isAuth === undefined) this.setState({nonAuthText: ''});
    else {
      this.setState({loading: false, nonAuthText: 'An error has occured.'});
    }
    if(newProps.isAuth !== this.state.isAuth) {
      this.setState({isAuth: newProps.isAuth});
    }
  }

  handleChange = (event) => {
      var field = event.target.name;
      var value = event.target.value;
      var changes = {}; //object to hold changes
      changes[field] = value; //change this field
      this.setState(changes); //update state
      this.setState({errorText: ''});
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

  //handle signIn button
  saveSettings = event => {
    event.preventDefault(); //don't submit
    console.log('Callback for saving settings');
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <section className="container">
        {this.state.isAuth === undefined &&
          <Row>
            <Col style={{marginTop: 60}} className="center-align" s={12}>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <CircularProgress size={60} thickness={7} />
              </MuiThemeProvider>
            </Col>
          </Row>
        }
        {this.state.isAuth ?
          <div>
            <Row>
              <Col s={12}>
                <h1 style={{display: 'none'}}>Group Settings</h1>
                <h2 style={{fontSize: '2rem'}}>Group Settings</h2>
              </Col>
            </Row>
            <Row>
              <Col s={12}>
                <form role="form" onSubmit={this.saveSettings}>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <TextField style={{color: '#039BE5'}} defaultValue="Exodia" floatingLabelText="Group Name" fullWidth={true} type="text" name="group_name" onChange={(e) => {this.handleChange(e)}} />
                    </MuiThemeProvider>
                  </div>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <List>
                        <Subheader>Group Members</Subheader>
                        <ListItem rightIcon={<EditIcon/>}>Jeff</ListItem>
                        <ListItem rightIcon={<EditIcon/>}>Jimmy</ListItem>
                      </List>
                    </MuiThemeProvider>
                  </div>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <List>
                        <Subheader>Chores</Subheader>
                        <RaisedButton style={{marginTop: 5, marginBottom: 20}} label="Add Chore" secondary={true} labelStyle={{color: '#fff'}} onTouchTap={this.handleOpen}/>
                        <ListItem rightIcon={<EditIcon/>}>Wash Dishes</ListItem>
                        <ListItem rightIcon={<EditIcon/>}>Clean Bathroom</ListItem>
                      </List>
                    </MuiThemeProvider>
                  </div>
                  <div className="input-field">

                  </div>
                  <div className="input-field">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <RaisedButton type="submit" label="Save Settings" primary={true} labelStyle={{color: '#fff'}} onTouchTap={this.saveSettings}/>
                    </MuiThemeProvider>
                  </div>
                </form>
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
          </div>
          :
          <Row>
            <Col s={12}>{this.state.nonAuthText}</Col>
          </Row>
        }
      </section>
    );
  }
}

export default GroupSettings;
