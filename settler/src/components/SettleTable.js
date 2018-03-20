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

import SettleThead from './SettleThead'
import SettleTbody from './SettleTbody'
import TableNavigation from './TableNavigation'

import { isProduction } from '../constants'

console.log("HERE")

class SettleTable extends Component {
  constructor() {
    super()

    this.state = {
      ir_lambi: {
        status: "inactive",//active, inactive, ready_to_settle
        team: "",
        runs: "",
      },
      mo: {
        status: "inactive",
        winner: "",
      },
      home: "",
      away: "",
      appinfo: "",
      name: "",
      showMatchoddsModal: false,
      showLambiModal: false,
      showFancyMarketModal: false,
      isSettle: false,
      isVoid: false,
      finalLambi: "",
      finalMo: "",
      isMatchOddsVoided: false,
      isMatchOddsSettled: false,
      isLambiVoided: false,
      isLambiSettled: false,
      statusFancyStruct: {
        ir_fancy_1_6: {
          isFancyVoided: false,
          isFancySettled: false,
        },
        ir_fancy_1_12: {
          isFancyVoided: false,
          isFancySettled: false,
        },
        ir_fancy_2_6: {
          isFancyVoided: false,
          isFancySettled: false,
        },
        ir_fancy_2_12: {
          isFancyVoided: false,
          isFancySettled: false,
        }
      },
      ir_fancy_1_6: {
        overs: 6,
        runs: 0,
        status: "inactive",
        team: "Delhi Daredevils"
      },
      ir_fancy_1_12: {
        overs: 6,
        runs: 0,
        status: "inactive",
        team: "Delhi Daredevils"
      },
      ir_fancy_2_6: {
        overs: 6,
        runs: 0,
        status: "inactive",
        team: "Kolkata Knight Riders"
      },
      ir_fancy_2_12: {
        overs: 6,
        runs: 0,
        status: "inactive",
        team: "Kolkata Knight Riders"
      },
      final_ir_fancy_1_6: "",
      final_ir_fancy_1_12: "",
      final_ir_fancy_2_6: "",
      final_ir_fancy_2_12: "",
      final_ir_fancy_market: "",
      final_fancy_market_sel: "",
    }

    this.handleMatchoddsSettleChange = this.handleMatchoddsSettleChange.bind(this)
    this.handleLambiSettleChange = this.handleLambiSettleChange.bind(this)
    this.handleHide = this.handleHide.bind(this)
    this.handleLambiChange = this.handleLambiChange.bind(this)
    this.handleOutcomeChange = this.handleOutcomeChange.bind(this)
    this.settleMatchOdds = this.settleMatchOdds.bind(this)
    this.settleLambi = this.settleLambi.bind(this)
    this.handleFancyMarkets = this.handleFancyMarkets.bind(this)
    this.handleFancyMarketBtn = this.handleFancyMarketBtn.bind(this)
    this.settleFancyMarkets = this.settleFancyMarkets.bind(this)

    this.test = this.test.bind(this)
  }

  test() {
    console.log("TEST")
  }

  componentDidMount() {
    //WebSocketConnection
    console.log("WebSocketConnection")

    if (!("WebSocket" in window)) {
      alert("This browser does not support WebSockets");
    }

    let prevLambiRuns;
    let prevMoWinner;
    let prevFancy_1_6_runs
    let prevFancy_1_12_runs
    let prevFancy_2_6_runs
    let prevFancy_2_12_runs

    let once = true;

    const self = this
    let uri;
    //uncomment this for PRODUCTION
    if (isProduction) {
      const host = window.location.host;
      const path = "/api/settler/ws";
      console.log("PROTOCOL", window.location.protocol)
      if (window.location.protocol === "https:") {
        uri = "wss://" + host + path;
      } else {
        uri = "ws://" + host + path;
      }
    } else {
      uri = "wss://cct-stage.iosport.co.uk/api/settler/ws"
    }


    //del
    //to test locally
    // uri = "wss://cct-stage.iosport.co.uk/api/settler/ws"

    this.ws = new WebSocket(uri);
    this.ws.onopen = function () {
      console.log('Connected');
    };
    this.ws.onclose = function (e) {
      console.log('Connection closed', e.reason);
    };
    this.ws.onmessage = function (evt) {
      var response = JSON.parse(evt.data);
      console.log("Received: ", (response));
      if (response.mo.winner !== undefined && prevMoWinner !== response.mo.winner) {
        self.setState({
          finalMo: response.mo.winner,
        })
      }
      if (response.ir_lambi.runs !== undefined && prevLambiRuns !== response.ir_lambi.runs) {
        self.setState({
          finalLambi: response.ir_lambi.runs,
        })
      }

      if(response.ir_fancy_1_6.runs!==undefined && prevFancy_1_6_runs!==response.ir_fancy_1_6.runs){
        self.setState({
          final_ir_fancy_1_6:response.ir_fancy_1_6.runs,
        })
      }

      if(response.ir_fancy_1_12.runs!==undefined && prevFancy_1_12_runs!==response.ir_fancy_1_12.runs){
        self.setState({
          final_ir_fancy_1_12:response.ir_fancy_1_12.runs,
        })
      }

      if(response.ir_fancy_2_6.runs!==undefined && prevFancy_2_6_runs!==response.ir_fancy_2_6.runs){
        self.setState({
          final_ir_fancy_2_6:response.ir_fancy_2_6.runs,
        })
      }

      if(response.ir_fancy_2_12.runs!==undefined && prevFancy_2_12_runs!==response.ir_fancy_2_12.runs){
        self.setState({
          final_ir_fancy_2_12:response.ir_fancy_2_12.runs,
        })
      }

      prevLambiRuns = response.ir_lambi.runs
      prevMoWinner = response.mo.winner
      prevFancy_1_6_runs=response.ir_fancy_1_6.runs
      prevFancy_1_12_runs=response.ir_fancy_1_12.runs
      prevFancy_2_6_runs=response.ir_fancy_2_6.runs
      prevFancy_2_12_runs=response.ir_fancy_2_12.runs

      self.setState(response);

      // console.log("WS onmessage response", response);

      if (once) {
        self.props.setMatchNames(response.home, response.away)
        once = false
      }

    }
    this.ws.onerror = function (e) {
      console.log("WS error", e);
    }
    // if (this.ws !== undefined) {
    //   console.log("WS is getting closed")
    //   this.ws.close();
    //   this.ws = undefined;
    // }

    console.log("================WS================", this.ws)
  }

  componentWillUnmount() {
    if (this.ws !== undefined) {
      console.log("WS is getting closed")
      this.ws.close();
      this.ws = undefined;
    }
  }

  handleLambiSettleChange(val) {
    this.setState({
      showLambiModal: true,
    })

    if (val === "settle") {
      this.setState({
        isSettle: true,
        isVoid: false
      })
    } else if (val === "void") {
      this.setState({
        isVoid: true,
        isSettle: false,
      })
    }
  }

  handleFancyMarketBtn(btnType, marketType) {
    this.setState({
      showFancyMarketModal: true,
    })

    if (btnType === "settle") {
      this.setState({
        isSettle: true,
        isVoid: false
      })
    } else if (btnType === "void") {
      this.setState({
        isVoid: true,
        isSettle: false,
      })
    }

    switch (marketType) {
      case "fancy_1_6":
        this.setState({
          final_ir_fancy_market: this.state.final_ir_fancy_1_6,
          final_fancy_market_sel: "ir_fancy_1_6"
        })
        break
      case "fancy_1_12":
        this.setState({
          final_ir_fancy_market: this.state.final_ir_fancy_1_12,
          final_fancy_market_sel: "ir_fancy_1_12"
        })
        break
      case "fancy_2_6":
        this.setState({
          final_ir_fancy_market: this.state.final_ir_fancy_2_6,
          final_fancy_market_sel: "ir_fancy_2_6"
        })
        break
      case "fancy_2_12":
        this.setState({
          final_ir_fancy_market: this.state.final_ir_fancy_2_12,
          final_fancy_market_sel: "ir_fancy_2_12"
        })
        break
    }
  }

  handleMatchoddsSettleChange(val) {
    this.setState({
      showMatchoddsModal: true,
    })

    if (val === "settle") {
      this.setState({
        isSettle: true,
        isVoid: false
      })
    } else if (val === "void") {
      this.setState({
        isVoid: true,
        isSettle: false,
      })
    }
  }

  handleHide() {
    this.setState({
      showMatchoddsModal: false,
      showLambiModal: false,
      showFancyMarketModal: false,
      isSettle: false,
      isVoid: false
    })
  }

  handleLambiChange(e) {
    const val = Math.floor(e.target.value);
    if (val < 0) {
      return
    }
    const mssg = { data: JSON.stringify({ ir_lambi: { runs: val } }) }
    console.log("mssg", mssg)
    // this.ws.send(mssg)
    this.setState({
      finalLambi: val,
    })
  }

  handleOutcomeChange(e) {
    const val = e.target.value

    console.log("handleOutcomeChange", val)

    this.setState({
      finalMo: val,
    })
  }

  handleFancyMarkets(e, marketType) {
    const val = Math.floor(e.target.value);
    if (val < 0) {
      return
    }
    console.log("handleFancyMarkets", val, marketType)

    switch (marketType) {
      case "fancy_1_6":
        this.setState({
          final_ir_fancy_1_6: val,
        })
        break
      case "fancy_1_12":
        this.setState({
          final_ir_fancy_1_12: val,
        })
        break
      case "fancy_2_6":
        this.setState({
          final_ir_fancy_2_6: val,
        })
        break
      case "fancy_2_12":
        this.setState({
          final_ir_fancy_2_12: val,
        })
        break
    }
  }

  settleMatchOdds() {
    console.log("settleMatchOdds", this.state.isSettle)
    if (this.state.isSettle) {
      if (this.ws.readyState === this.ws.OPEN) {
        if (!this.state.finalMo) {
          return
        }
        this.ws.send(JSON.stringify({ "market": "mo", "settle": this.state.finalMo }))
        this.setState({
          isMatchOddsSettled: true,
        })
      }
    } else if (this.state.isVoid) {
      if (this.ws.readyState === this.ws.OPEN) {
        this.ws.send(JSON.stringify({ "market": "mo", "void": true }))
        this.setState({
          isMatchOddsVoided: true,
        })
      }
    }
    this.handleHide()
  }

  settleLambi() {
    if (this.state.isSettle) {
      if (this.ws.readyState === this.ws.OPEN) {
        console.log("settle LAMBI json", JSON.stringify({ "market": "ir_lambi", "settle": Number(this.state.finalLambi) }))
        this.ws.send(JSON.stringify({ "market": "ir_lambi", "settle": Number(this.state.finalLambi) }))
        this.setState({
          isLambiSettled: true,
        })
      }
    } else if (this.state.isVoid) {
      if (this.ws.readyState === this.ws.OPEN) {
        this.ws.send(JSON.stringify({ "market": "ir_lambi", "void": true }))

        this.setState({
          isLambiVoided: true,
        })
      }
    }
    this.handleHide()
  }

  settleFancyMarkets() {
    // console.log("settleFancyMarkets")
    console.log("FANCY market type - settleFancyMarkets", this.state.final_fancy_market_sel, this.state.final_ir_fancy_market)

    if (this.state.isSettle) {
      if (this.ws.readyState === this.ws.OPEN) {
        console.log("settle LAMBI json", JSON.stringify({ "market": this.state.final_fancy_market_sel, "settle": Number(this.state.final_ir_fancy_market) }))
        if (!this.state.final_ir_fancy_market) {
          return
        }
        this.ws.send(JSON.stringify({ "market": this.state.final_fancy_market_sel, "settle": Number(this.state.final_ir_fancy_market) }))

        const statusFancyStruct = JSON.parse(JSON.stringify(this.state.statusFancyStruct))
        console.log("statusFancyStruct isSettle", statusFancyStruct)

        statusFancyStruct[this.state.final_fancy_market_sel].isFancySettled = true

        console.log("statusFancyStruct isSettle AFTER", statusFancyStruct)

        this.setState({
          statusFancyStruct,
        })
      }
    } else if (this.state.isVoid) {
      if (this.ws.readyState === this.ws.OPEN) {
        this.ws.send(JSON.stringify({ "market": this.state.final_fancy_market_sel, "void": true }))

        const statusFancyStruct = JSON.parse(JSON.stringify(this.state.statusFancyStruct))

        console.log("statusFancyStruct isVoid", statusFancyStruct)

        statusFancyStruct[this.state.final_fancy_market_sel].isFancyVoided = true

        console.log("statusFancyStruct isVoid AFTER", statusFancyStruct)

        this.setState({
          statusFancyStruct,
        })
      }
    }

    this.handleHide()
  }

  render() {
    // console.log("Cookies.get", Cookies.get('cricket~settler'))

    return (
      <div>
        <TableNavigation activeKey="1" />
        <table className="table table-bordered table-condensed">
          <SettleThead />
          <SettleTbody
            {...this.state}
            onLambiChange={this.handleLambiChange}
            onOutcomeChange={this.handleOutcomeChange}
            onMatchoddsSettleChange={this.handleMatchoddsSettleChange}
            onLambiSettleChange={this.handleLambiSettleChange}
            onFancyMarketsChange={this.handleFancyMarkets}
            onFancyMarketBtn={this.handleFancyMarketBtn}
          />
        </table>

        <Modal bsSize="small" show={this.state.showMatchoddsModal} onHide={this.handleHide}>
          <Modal.Body>
            {this.state.isSettle ? "Settle Matchodds @ " + this.state.finalMo : (this.state.isVoid ? "Void Matchodds" : "none")}
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="success" onClick={this.settleMatchOdds}>Yes</Button>
            <Button bsStyle="danger" onClick={this.handleHide}>No</Button>
          </Modal.Footer>
        </Modal>

        <Modal bsSize="small" show={this.state.showLambiModal} onHide={this.handleHide}>
          <Modal.Body>
            {this.state.isSettle ? "Settle Lambi @ " + this.state.finalLambi : (this.state.isVoid ? "Void Lambi" : "none")}
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="success" onClick={this.settleLambi}>Yes</Button>
            <Button bsStyle="danger" onClick={this.handleHide}>No</Button>
          </Modal.Footer>
        </Modal>

        <Modal bsSize="small" show={this.state.showFancyMarketModal} onHide={this.handleHide}>
          <Modal.Body>
            {this.state.isSettle ? "Settle Fancy Market @ " + this.state.final_ir_fancy_market : (this.state.isVoid ? "Void Fancy Market" : "none")}
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="success" onClick={this.settleFancyMarkets}>Yes</Button>
            <Button bsStyle="danger" onClick={this.handleHide}>No</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default SettleTable