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
      competitions: [],
      teams:[],
      matches:[],
      check:"",
      value:"",
    }

    this.handleChange = this.handleChange.bind(this)
    this.postJSON = this.postJSON.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleAddClick = this.handleAddClick.bind(this)
  }

  componentDidMount() {
    this.competitionInput.focus()

    console.log("competitions", this.props.test)

    fetch("http://localhost:3001/all")
      .then((res) => res.json())
      .then(data => {
        console.log("data", data)

        this.setState({
          check:data.check,
          competitions: data.competitions,
          teams:data.teams,
          matches:data.matches,
          value: "",
        })
      })

      console.log("scheduler componentDidMount") 
      // fetch("https://cct-stage.iosport.co.uk/api/scheduler")
      // .then(res=>console.log("scheduler", res))
      // .catch(e=>console.log("ERRORED"))
  }

  handleChange(e) {
    const value = e.target.value

    this.setState({
      value,
    })

    if(value==="")
      return

    if (e.key === "Enter") {
      console.log("Enter pressed")

      const competitions = this.state.competitions.slice()

      const lastId = competitions[competitions.length - 1].id

      const newCompetition = { id: `${Number(lastId) + 1}`, name: value }

      competitions.push(newCompetition)

      this.setState({
        competitions,
        value: "",
      })

      this.postJSON({
        check: this.state.check,
        competitions:this.state.competitions,
        teams:this.state.teams,
        matches:this.state.matches,
      })
    }
  }

  postJSON(schedulerObj) {
    axios.post("http://localhost:3001/all", schedulerObj)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  }

  handleAddClick() {
    const competitions = this.state.competitions.slice()

    const lastIndex = competitions[competitions.length - 1].id
    const newIndex = Number(lastIndex) + 1

    console.log("newIndex", typeof lastIndex)

    if(this.state.value===""){
      return
    }

    const competition = { id: newIndex, name: this.state.value }

    competitions.push(competition)

    this.setState({
      competitions,
      value: "",
    })

    const self=this

    axios.post("http://localhost:3001/all", {
      check: this.state.check,
      competitions:this.state.competitions,
      teams:this.state.teams,
      matches:this.state.matches,
    })
    .catch(err=>{
      console.log("someone else added before you did")
      self.componentDidMount()
      self.handleAddClick()
    })
  }

  handleRemove(id) {
    console.log("delete competitions")
    let competitions = this.state.competitions.slice()

    competitions = competitions.filter(competition => competition.id !== id)

    this.setState({
      competitions,
    })

    const self=this

    axios.post("http://localhost:3001/all", {
      check: this.state.check,
      competitions:this.state.competitions,
      teams:this.state.teams,
      matches:this.state.matches,
    })
    .catch(err=>{
      console.log("someone else added before you did")
      self.componentDidMount()
      setTimeout(()=>{self.handleRemove(id)},100);
    })
  }

  render() {
    const trList = this.state.competitions.map(competition => {
      return (
        <tr key={competition.id}>
          <td>{competition.id}</td>
          <td>{competition.name}</td>
          <td>
            <Button onClick={() => this.handleRemove(competition.id)}>
              <Glyphicon glyph="glyphicon glyphicon-trash" />
            </Button>
          </td>
        </tr>
      )
    })

    return (
      <div className="App">
        <TableNavigation activeKey="1" />
        <div>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Competition Name</th>
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
                    placeholder="Competition Name"
                    onChange={this.handleChange}
                    onKeyPress={this.handleChange}
                    inputRef={(input) => { this.competitionInput = input }}
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
