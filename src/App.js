import React, { Component } from 'react';
import Login from './Login';
import Home from './Home';
import CreateGroup from './CreateGroup';
import Monthly from './Monthly';
import Weekly from './Weekly';
import Navigation from './Navigation';
import UserSettings from './UserSettings';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import firebase from 'firebase';

/*This file handles the display of routes and navigation, as well as footer. */

class App extends Component {
  state = {
    isAuth: undefined
  }

  //Upon mounting component, initialize listener. Set state variables if user is authed.
  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(user => {
     if(user) {
       this.setState({userID:user.uid});
       this.setState({userEmail:user.email});
       this.setState({isAuth: true});
       firebase.database().ref('users/' + user.uid).once('value').then(snapshot=> {
         if(snapshot.val()) {
           this.setState({
             userHandle: snapshot.val().handle,
             groupID: snapshot.val().group
            });
         }
       });
     }
     else{
       this.setState({userID: null}); //null out the saved state
       this.setState({userEmail: null})
       this.setState({userHandle: ''});
       this.setState({isAuth: false})
     }
   });
  }

  render() {
    return (
      <div>
        <header>
          <Navigation userHandle={this.state.userHandle} />
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/:groupID/monthly" render={(props)=><Monthly {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} userHandle={this.state.userHandle}/>}/>
            <Route path="/:groupID/weekly" render={(props)=><Weekly {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} userHandle={this.state.userHandle} groupID={this.state.groupID}/>}/>
            <Route path="/login" component={Login}/>
            <Route path="/create" render={(props)=><CreateGroup {...props} isAuth={this.state.isAuth}/>}/>
            <Route path="/userSettings" render={(props)=><UserSettings {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} userHandle={this.state.userHandle}/>}/>
          </Switch>
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}

export default App;
