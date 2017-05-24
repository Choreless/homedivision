import React, { Component } from 'react';
import firebase from 'firebase';
import CreateGroupForm from './CreateGroupForm';
import JoinGroupForm from './JoinGroupForm';
import {Row, Col} from 'react-materialize';
import {Tabs, Tab} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

/*
  This file displays the create/join group page
*/

class CreateGroup extends Component {

  render() {
    return (
      <section className="container">
        <Row>
          <Col s={12}>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Tabs inkBarStyle={{backgroundColor: '#000', zIndex: '10'}}>
                <Tab buttonStyle={{backgroundColor: '#fff', color: '#000'}} label="Join">
                  <JoinGroupForm />
                </Tab>
                <Tab buttonStyle={{backgroundColor: '#fff', color: '#000'}} label="Create">
                  <CreateGroupForm />
                </Tab>
              </Tabs>
            </MuiThemeProvider>
          </Col>
        </Row>
      </section>
    );
  }
}

export default CreateGroup;
