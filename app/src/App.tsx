import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createClient, Provider } from 'urql';
import * as React from 'react';

import FileManager from './FileManager';

const client = createClient({ url: 'http://localhost:5000' });
interface AppProps {}

function App({}: AppProps) {
  return (
    <Provider value={client}>
      <Router>
        <Switch>
          <Route>
            <FileManager />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
