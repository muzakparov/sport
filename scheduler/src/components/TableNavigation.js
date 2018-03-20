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

//uncomment this for PRODUCTION
import { root_url } from '../App'
import { isProduction } from '../constants'


class TableNavigation extends Component {
  render() {
    return (
      <Nav bsStyle="tabs" activeKey={this.props.activeKey}>
        <LinkContainer exact to={isProduction?(root_url+"/"):("/")}>
          <NavItem eventKey="1">
            Competitions
          </NavItem>
        </LinkContainer>
        <LinkContainer exact to={isProduction?(root_url+"/teams"):"/teams"} >
          <NavItem eventKey="2">
            Teams
          </NavItem>
        </LinkContainer>
        <LinkContainer exact to={isProduction?(root_url+"/matches"):"/matches"} >
          <NavItem eventKey="3">
            Matches
          </NavItem>
        </LinkContainer>
      </Nav>
    );
  }
}

export default TableNavigation