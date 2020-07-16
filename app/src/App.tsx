import './App.css';

import { Provider, cacheExchange, createClient, dedupExchange } from 'urql';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import * as React from 'react';

import FileManager from './FileManager';

const client = createClient({
  url: 'http://localhost:5000',
  exchanges: [dedupExchange, cacheExchange, multipartFetchExchange],
});
interface AppProps {}

function App({}: AppProps) {
  return (
    <Provider value={client}>
      <Router>
        <Switch>
          <Route path="/:id?">
            <FileManager />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
