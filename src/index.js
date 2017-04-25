/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import App from './App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './index.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';

/*This file handles setting up the whole application, as well as including base functionality and CSS files*/

// Needed for onTouchTap
injectTapEventPlugin();

render(
  <Router>
    <App/>
  </Router>,
  document.querySelector('#root')
);
