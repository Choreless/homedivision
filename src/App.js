import React, { Component } from 'react';
import Login from './Login';
import Home from './Home';
import CreateGroup from './CreateGroup';
import Monthly from './Monthly';
import Weekly from './Weekly';
import GSettings from './GroupSettings';
import Navigation from './Navigation';
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

      // Sets the current groupID the user is in
      firebase.database().ref().on('value', (snapshot) => {
          const generalRef = snapshot.val();
          if (this.state.userID != null) {
            if (generalRef.users[this.state.userID].group != null) {
                this.setState({
                    groupID: generalRef.users[this.state.userID].group,
                    groupLayout: this.grabLayout()
                });
            } else {
              this.setState({groupID: null, layout: []});
            }
          }
      })    
  }
      // look into promises
      grabLayout() {
        // array of objects to be returned, represents chore cards in screen
        var currentLayout = [{i:"0", h:2,w:1, x:0, y:Infinity}];
        console.log(this.state.groupID);
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
    return (
      <div>
        <header>
          <Navigation userHandle={this.state.userHandle} />
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/:roomID/monthly" render={(props)=><Monthly {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} userHandle={this.state.userHandle}/>}/>
            <Route path="/:roomID/weekly" render={(props)=><Weekly {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} userHandle={this.state.userHandle} groupID={this.state.groupID} groupLayout={this.state.groupLayout}/>}/>
            <Route path="/:roomID/settings" render={(props)=><GSettings {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} userHandle={this.state.userHandle}/>}/>
            <Route path="/login" component={Login}/>
            <Route path="/create" render={(props)=><CreateGroup {...props} isAuth={this.state.isAuth}/>}/>
            
          </Switch>
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}

export default App;
