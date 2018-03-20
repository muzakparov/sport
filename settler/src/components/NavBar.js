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

import { isProduction } from '../constants'

class NavBar extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.loginOnEnter = this.loginOnEnter.bind(this)
  }

  loginOnEnter(e) {
    if (e.key === 'Enter') {
      console.log("13")
      this.props.onLogin();
      this.handleLogin()
    }
  }

  handleLogout() {
    console.log("axios handleLogout")

    this.props.onLogout()

    // axios.get('https://cct-stage.iosport.co.uk/api/auth/logout')
    //   .then(function (response) {
    //     console.log(response);
    //     self.props.onLogout()
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

  }

  handleLogin() {
    const request = "username=" + this.state.username + "&password=" + this.state.password
    const self = this

    //uncomment this for PRODUCTION
    const uri= isProduction?(window.location.origin+'/api/auth'):"https://cct-stage.iosport.co.uk/api/auth"
    
    //del
    //to test locally
    // const uri ="https://cct-stage.iosport.co.uk/api/auth"

    axios.post(uri, request)//make it window.location.origin or check react-parcel
      .then(function (response) {
        console.log(response);
        // console.log("response", self.props);
        self.props.onLogin();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleUsernameChange(e) {

    this.setState({
      username: e.target.value,
    })
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    })
  }

  render() {
    const { isLoggedIn, home, away } = this.props

    const loginForm = (
      <Navbar.Form pullRight>
        <FormGroup>
          <ControlLabel>User</ControlLabel>{' '}
          <FormControl
            type="text"
            placeholder="username"
            value={this.state.username}
            onChange={this.handleUsernameChange}
            onKeyPress={this.loginOnEnter}
          />
        </FormGroup>{' '}
        <FormGroup>
          <ControlLabel>Password</ControlLabel>{' '}
          <FormControl
            type="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            onKeyPress={this.loginOnEnter}
          />
        </FormGroup>{' '}
        <Button type="submit" onClick={this.handleLogin}>Login</Button>
      </Navbar.Form>
    )

    const successLoginDiv = (
      <Nav pullRight>
        {/* <div className="alert alert-warning" style={{ position: "absolute", right: "102px", paddingTop: "5px", paddingBottom: "5px", top: "14px" }}>
            Hello, {this.state.username}!:)
          </div> */}
        <NavItem onClick={this.handleLogout}>
          Logout
          </NavItem>
      </Nav>
    )

    return (
      <Navbar fluid={true}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">ioSport Cricket Settler{home && " / "+home+" vs "+away}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {isLoggedIn ? successLoginDiv : loginForm}
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavBar