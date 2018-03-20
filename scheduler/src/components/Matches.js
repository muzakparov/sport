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
import moment from "moment"

import TableNavigation from './TableNavigation'


class Matches extends Component {
  constructor(props) {
    super(props)

    const currentDate=moment().format("YYYY-MM-DD")    

    this.state = {
      competitions: [],
      teams: [],
      matches: [],
      rowIsChangedArr:[],
      newMatch:{
        competition:"Choose",
        home:"Choose",
        away:"Choose",
        date:currentDate,
        time:"00:00:00",
        overs:0,
      },
    }

    this.makeGetCall = this.makeGetCall.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleMatchOversChange = this.handleMatchOversChange.bind(this)
    this.deleteMatch=this.deleteMatch.bind(this)
    this.handleNewMatchChange=this.handleNewMatchChange.bind(this)
    this.handleNewMatchDateInput=this.handleNewMatchDateInput.bind(this)
    this.addNewMatch=this.addNewMatch.bind(this)
    this.updateMatch=this.updateMatch.bind(this)

    this.test = this.test.bind(this)
  }

  test(e) {
    console.log("TEST", e.target.value)
  }

  componentDidMount() {
    const self = this    

    axios.all([this.makeGetCall("matches"), this.makeGetCall("competitions"), this.makeGetCall("teams")])
      .then(axios.spread(function (matches, competitions, teams) {
        // Both requests are now complete
        self.setState({
          matches: matches.data,
          competitions: competitions.data,
          teams: teams.data,
        })
      }))
      .then(()=>{
        const rowIsChangedArr=this.state.matches.map(match=>{
          return {id:match.id, isChanged:false}
        })

        this.setState({
          rowIsChangedArr,
        })
      })      
  }

  makeGetCall(paramStr) {
    return axios.get("http://localhost:3001/" + paramStr)
  }

  handleSelectChange(e, matchId, prop) {
    const id = e.target.value    

    const matches = this.state.matches.slice().map(match => {
      if (match.id === matchId) {
        match[prop] = id
      }
      return match
    })

    let rowIsChangedArr=this.state.rowIsChangedArr.slice()
    
    rowIsChangedArr=JSON.parse(JSON.stringify(rowIsChangedArr)).map(rowIsChangedObj=>{
      if(rowIsChangedObj.id===matchId){
        rowIsChangedObj.isChanged=true;
      }
      return rowIsChangedObj
    })

    this.setState({
      matches,
      rowIsChangedArr,
    })

    console.log("handleSelectChange matches", id)
  }

  handleDateChange(e, matchId, prop) {
    const val = e.target.value
    let matches = this.state.matches.slice()

    if (val === "")
      return

    matches = matches.map(match => {
      if (match.id === matchId) {
        console.log("handleDateChange", match.start, val)

        const fullDateArr = match.start.split("T")

        if (prop === "date") {
          fullDateArr[0] = val
        } else if (prop === "time") {
          fullDateArr[1] = val + ":00Z"
        }

        match.start = fullDateArr.join("T")

        console.log("handleDateChange FINAL", match.start)
      }
      return match
    })

    const rowIsChangedArr=JSON.parse(JSON.stringify(this.state.rowIsChangedArr)).map(rowIsChangedObj=>{
      if(rowIsChangedObj.id===matchId){
        rowIsChangedObj.isChanged=true;
      }
      return rowIsChangedObj
    })

    this.setState({
      matches,
      rowIsChangedArr,
    })
  }

  handleMatchOversChange(e, matchId) {
    const val = e.target.value
    let matches = this.state.matches.slice()

    matches = matches.map(match => {
      if (match.id === matchId) {
        match.overs = val
      }

      return match
    })

    const rowIsChangedArr=JSON.parse(JSON.stringify(this.state.rowIsChangedArr)).map(rowIsChangedObj=>{
      if(rowIsChangedObj.id===matchId){
        rowIsChangedObj.isChanged=true;
      }
      return rowIsChangedObj
    })

    this.setState({
      matches,
      rowIsChangedArr,
    })
  }

  deleteMatch(matchId){
    console.log("deleteMatch id",matchId)
    let matches = this.state.matches.slice()

    matches=matches.filter(match=>match.id!==matchId)

    this.setState({
      matches,
    })

    //axios.delete(url,objToBeDeleted)
  }

  handleNewMatchChange(e, prop){
    console.log("handleNewMatchChange")

    const val=e.target.value
    const newMatch={...this.state.newMatch}

    newMatch[prop]=val

    this.setState({
      newMatch,
    })
    
  }

  handleNewMatchDateInput(e, prop){
    console.log("handleNewMatchDateInput")

    const val=e.target.value

    const newMatch={...this.state.newMatch}

    newMatch[prop]=val

    this.setState({
      newMatch,
    })
  }

  addNewMatch(){
    console.log("addNewMatch")

    const matches=[...this.state.matches]
    const rowIsChangedArr=[...this.state.rowIsChangedArr]
    const lastMatchId=matches[matches.length-1].id
    const newMatch={...this.state.newMatch}
    const start=newMatch.date+"T"+newMatch.time+"Z"
    console.log("addMatch start",start)
    
    newMatch.start=start
    delete newMatch.date
    delete newMatch.time

    if(newMatch.competition==="Choose" 
        || newMatch.home==="Choose" 
        || newMatch.away==="Choose" 
    ){
      return
    }


    newMatch.id=parseInt(lastMatchId)+1
    matches.push(newMatch)
    rowIsChangedArr.push({id:newMatch.id, isChanged:false})

    const newMatchReconstruct = {...newMatch}

    newMatchReconstruct.competition="Choose"
    newMatchReconstruct.home="Choose"
    newMatchReconstruct.away="Choose"
    newMatchReconstruct.start=moment().format("YYYY-MM-DD")
    newMatchReconstruct.time="00:00:00"
    newMatchReconstruct.overs=0;

    this.setState({
      matches,
      rowIsChangedArr,
      newMatch:newMatchReconstruct,
    })

    
  }

  updateMatch(matchId){
    let rowIsChangedArr=[...this.state.rowIsChangedArr]

    console.log("rowIsChangedArr",rowIsChangedArr)

    rowIsChangedArr=rowIsChangedArr.map(rowIsChanged=>{
      if(matchId===rowIsChanged.id){
        rowIsChanged.isChanged=false
      }
      return rowIsChanged;
    })

    this.setState({
      rowIsChangedArr,
    })
  }


  render() {
    const {
      matches,
      competitions,
      teams,
      rowIsChangedArr,
      newMatch,
    } = this.state

    const teamsList = teams.map(team => (
      <option value={teams.id} key={team.id}>{team.name}</option>
    ))

    const competitionsList = competitions.map(competition => (
      <option value={competition.id} key={competition.id}>{competition.name}</option>
    ))

    const trList = matches.map(match => {
      const startArr = match.start.split("T")
      const date = startArr[0]
      const time = startArr[1].substr(0, startArr[1].indexOf("Z"))

      const rowIsChanged=rowIsChangedArr.length
                      ?rowIsChangedArr.filter(rowIsChangedObj=>rowIsChangedObj.id===match.id)[0].isChanged
                      :false

      return (
        <tr key={match.id}>
          <td>{match.id}</td>
          <td>
            <select
              name="competitionName"
              value={match.competition}
              onChange={(e) => this.handleSelectChange(e, match.id, "competition")}
            >
              {competitionsList}
            </select>
          </td>
          <td>
            <select
              name="teamsList"
              value={match.home}
              onChange={(e) => this.handleSelectChange(e, match.id, "home")}
            >
              {teamsList}
            </select>
          </td>
          <td>
            <select
              name="awayTeamName"
              value={match.away}
              onChange={(e) => this.handleSelectChange(e, match.id, "away")}
            >
              {teamsList}
            </select>
          </td>
          <td>
            <input type="date" value={date} onChange={(e) => this.handleDateChange(e, match.id, "date")} />
          </td>
          <td>
            <input type="time" value={time} onChange={(e) => this.handleDateChange(e, match.id, "time")} />
          </td>
          <td>
            <input type="number" value={match.overs} onChange={(e) => this.handleMatchOversChange(e, match.id)} />
          </td>
          <td>
            <Button bsStyle={rowIsChanged?"danger":"primary"} onClick={e=>this.updateMatch(match.id)}>
              <Glyphicon glyph={rowIsChanged?"refresh":"ok"} />
            </Button>{' '}
            <Button onClick={()=>this.deleteMatch(match.id)}>
              <Glyphicon glyph="trash" />
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
                <th>ID</th>
                <th>Competition</th>
                <th>Home</th>
                <th>Away</th>
                <th>Start Date</th>
                <th>Start Time <br />(GMT)</th>
                <th>Format</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <select value={newMatch.competition} onChange={e=>this.handleNewMatchChange(e, "competition")}>
                    <option value="Choose">Choose</option>
                    {competitionsList}
                  </select>
                </td>
                <td>
                  <select value={newMatch.home} onChange={e=>this.handleNewMatchChange(e, "home")}>
                    <option value="Choose">Choose</option>
                    {teamsList}
                  </select>
                </td>
                <td>
                  <select value={newMatch.away} onChange={e=>this.handleNewMatchChange(e, "away")}>
                    <option value="Choose">Choose</option>
                    {teamsList}
                  </select>
                </td>
                <td>
                  <input type="date" value={newMatch.date}  onChange={e=>this.handleNewMatchDateInput(e,"date")}/>
                </td>
                <td>
                  <input type="time" value={newMatch.time}   onChange={e=>this.handleNewMatchDateInput(e, "time")}/>
                </td>
                <td>
                  <input type="number" value={newMatch.overs}   onChange={e=>this.handleNewMatchDateInput(e, "overs")}/>
                </td>
                <td>
                  <Button onClick={this.addNewMatch}>
                    <Glyphicon glyph="plus" />
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

export default Matches;
