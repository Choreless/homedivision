import React, { Component } from 'react';
import Login from './Login';
import Home from './Home';
import CreateRoom from './CreateRoom';
import Monthly from './Monthly';
import Weekly from './Weekly';
import Navigation from './Navigation';
import { Route, Switch } from 'react-router-dom';

/*This file handles the display of routes and navigation, as well as footer. */

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Navigation/>
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/:roomID/monthly" component={Monthly}/>
            <Route path="/:roomID/weekly" component={Weekly}/>
            <Route path="/login" component={Login}/>
            <Route path="/create" render={(props)=><CreateRoom {...props} auth={true}/>}/>
          </Switch>
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}

export default App;
