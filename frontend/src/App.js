import React from 'react';
import './App.css';
import Home from "./Home";
import LoginPage from "./Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    );
  }
}

export default App;
