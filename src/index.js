/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import firebase from 'firebase';
import App from './App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './index.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';

/*This file handles setting up the whole application, as well as including base functionality and CSS files*/

// Needed for onTouchTap
injectTapEventPlugin();

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyC-CutM2TvBV-VD6vMMQm6MvpJDRDVrdBw",
    authDomain: "choreless-20110.firebaseapp.com",
    databaseURL: "https://choreless-20110.firebaseio.com",
    projectId: "choreless-20110",
    storageBucket: "choreless-20110.appspot.com",
    messagingSenderId: "645346681524"
  };
  firebase.initializeApp(config);

render(
  <Router>
    <App/>
  </Router>,
  document.querySelector('#root')
);
