import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import store from './store';
import { Provider } from 'react-redux';
import { loadUser } from './actions/auth';
import './App.css';
import Home from "./home/Home";
import LoginPage from "./home/Login";
import ResetPass from "./home/ResetPass";

class App extends React.Component {
 
  componentDidMount() {
    store.dispatch(loadUser());
  } 
  render() {
    return (
      <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/login/reset" component={ResetPass} />
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
      </Provider>
    );
  }
}

export default App;
