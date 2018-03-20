import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import { Switch } from "react-router";
import {
  Nav,
  NavItem,
  Navbar,
  FormGroup,
  FormControl,
  Button,
  ControlLabel,
  Modal,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from 'axios';
import Cookies from "js-cookie";
import './App.css';

import Competitions from './components/Competitions'
import Teams from './components/Teams'
import Matches from './components/Matches'
import NavBar from './components/NavBar'

import { cookieName } from "./constants"

const isProduction=false;

//uncomment this for PRODUCTION
export const root_url = isProduction?window.location.pathname:""

class App extends Component {
  constructor(){
    super()

    this.state={
      isLoggedIn:false,
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    const cookie = Cookies.get(cookieName);
    if (isProduction && cookie!==undefined) {      
      console.log("componentDidMount-", cookie)
    }
    
    if (isProduction) {
      if (cookie !== undefined) {
        this.setState({ isLoggedIn: true })
      }
    }
  }

  handleLogin() {
    this.setState({
      isLoggedIn: true,
    })
  }

  handleLogout() {
    console.log("handleLogout")

    if (isProduction) {
      Cookies.remove(cookieName);
    }

    this.setState({
      isLoggedIn: false,
    })
  }

  render() {  
    const router = (
      <Router>
        <Switch>
          <Route exact path="/" component={Competitions} />
          <Route path="/teams" component={Teams} />
          <Route path="/matches" component={Matches} />
        </Switch>
      </Router>
    )

    return (
      <div className="App">
        <div>
          <NavBar isLoggedIn={this.state.isLoggedIn} onLogin={this.handleLogin} onLogout={this.handleLogout} />
        </div>
        {this.state.isLoggedIn?router:<div>Please login</div>}
      </div>
    );
  }
}

export default App;
