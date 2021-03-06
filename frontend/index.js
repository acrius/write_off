import React from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import configureStore from './store/configureStore';

import WriteOff from './write-off/containers';

injectTapEventPlugin();

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={WriteOff}>
      </Route>
    </Router>
  </Provider>, document.getElementById('application'));
