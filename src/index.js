import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import './index.css';

import createApp from './components/app';
import createViewer from './components/viewer';

const [App, Viewer] = [createApp(React), createViewer(React)];

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Viewer} />
    </Route>
  </Router>,
  document.getElementById('root')
);
// <Route path="game" component={} />
