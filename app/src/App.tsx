import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as React from 'react';
import RsuiteDummy from './RsuiteDummy';

interface AppProps {}

function App({}: AppProps) {
  return (
    <Router>
      <Switch>
        <Route path="/rsuite"><RsuiteDummy/></Route>
      </Switch>

    </Router>
  );
}

export default App;
