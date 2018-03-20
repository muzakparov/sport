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
  Table,
  Glyphicon,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from 'axios';

import TableNavigation from './TableNavigation'


class Teams extends Component {
  constructor() {
    super()

    this.state = {
      teams: [],
    }

    this.handleChange = this.handleChange.bind(this)
    this.postJSON = this.postJSON.bind(this)
    this.handleRemove=this.handleRemove.bind(this)
    this.handleAddClick=this.handleAddClick.bind(this)
  }

  componentDidMount() {
    fetch("http://localhost:3001/teams")
      .then((res) => res.json())
      .then(data => {
        console.log("data", data)

        this.setState({
          teams: data,
          value: "",
        })
      })


  }

  handleChange(e) {
    const value = e.target.value

    this.setState({
      value,
    })

    if (e.key === "Enter") {
      console.log("Enter pressed")

      const teams = this.state.teams.slice()

      const lastId = teams[teams.length - 1].id

      const newTeam = { id: `${lastId + 1}`, name: value }

      teams.push(newTeam)

      this.setState({
        teams,
        value: "",
      })

      this.postJSON(newTeam)
    }
  }

  handleAddClick(){
    const teams=this.state.teams.slice()

    const lastIndex=teams[teams.length-1].id
    const newIndex=Number(lastIndex)+1
    const team={id:newIndex, name: this.state.value}

    teams.push(team)

    this.setState({
      teams,
      value:"",
    })

    axios.post("http://localhost:3001/teams",team)
  }

  handleRemove(id){
    console.log("delete TEAMS")
    let teams=this.state.teams.slice()

    teams=teams.filter(team=>team.id!==id)
    
    this.setState({
      teams,
    })

    axios.delete("http://localhost:3001/teams/"+id)

  }

  postJSON(teamObj) {
    axios.post("http://localhost:3001/teams", teamObj)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    const trList = this.state.teams.map(team => {
      return (
        <tr key={team.id}>
          <td>{team.id}</td>
          <td>{team.name}</td>
          <td>
            <Button onClick={()=>this.handleRemove(team.id)}>
              <Glyphicon glyph="glyphicon glyphicon-trash" />
            </Button>
          </td>
        </tr>
      )
    })

    return (
      <div className="App">
        <TableNavigation activeKey="2" />
        <div>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Team Name</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <FormControl
                    type="text"
                    value={this.state.value}
                    placeholder="Team Name"
                    onChange={this.handleChange}
                    onKeyPress={this.handleChange}
                  />
                </td>
                <td>
                  <Button onClick={this.handleAddClick}>
                    <Glyphicon glyph="glyphicon glyphicon-plus" />
                  </Button>
                </td>
              </tr>
              {trList}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Teams;
