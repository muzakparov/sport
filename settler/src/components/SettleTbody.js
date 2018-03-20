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
    Label,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from 'axios';
import Cookies from "js-cookie";



class SettleTbody extends Component {
    constructor() {
        super()

        this.state = {
            lambiAction: false,
            matchoddsAction: false,
            fancy_1_6_Action:false,
            fancy_1_12_Action:false,
            fancy_2_6_Action:false,
            fancy_2_12_Action:false,
        }

        this.hideLambiAction = this.hideLambiAction.bind(this)
        this.showLambiAction = this.showLambiAction.bind(this)
        this.showMatchoddsAction = this.showMatchoddsAction.bind(this)
        this.hideMatchoddsAction = this.hideMatchoddsAction.bind(this)
        this.hideFancyMarketAction = this.hideFancyMarketAction.bind(this)
        this.showFancyMarketAction = this.showFancyMarketAction.bind(this)
    }

    showMatchoddsAction() {
        if (!this.state.matchoddsAction) {
            this.setState({
                matchoddsAction: true,
            })
        }
    }

    hideMatchoddsAction() {
        if (this.state.matchoddsAction) {
            this.setState({
                matchoddsAction: false,
            })
        }
    }

    showLambiAction() {
        if (!this.state.lambiAction) {
            this.setState({
                lambiAction: true,
            })
        }
    }

    hideLambiAction() {
        if (this.state.lambiAction) {
            this.setState({
                lambiAction: false,
            })
        }
    }

    showFancyMarketAction(marketType){
        switch(marketType){
            case "fancy_1_6":
                if (!this.state.fancy_1_6_Action) {
                    this.setState({
                        fancy_1_6_Action: true,
                    })
                }
                break
            case "fancy_1_12":
                if (!this.state.fancy_1_12_Action) {
                    this.setState({
                        fancy_1_12_Action: true,
                    })
                }
                break
            case "fancy_2_6":
                if (!this.state.fancy_2_6_Action) {
                    this.setState({
                        fancy_2_6_Action: true,
                    })
                }
                break
            case "fancy_2_12":
                if (!this.state.fancy_2_12_Action) {
                    this.setState({
                        fancy_2_12_Action: true,
                    })
                }
                break
        }        
    }

    hideFancyMarketAction(marketType){
        switch(marketType){
            case "fancy_1_6":
                if (this.state.fancy_1_6_Action) {
                    this.setState({
                        fancy_1_6_Action: false,
                    })
                }
                break
            case "fancy_1_12":
                if (this.state.fancy_1_12_Action) {
                    this.setState({
                        fancy_1_12_Action: false,
                    })
                }
                break
            case "fancy_2_6":
                if (this.state.fancy_2_6_Action) {
                    this.setState({
                        fancy_2_6_Action: false,
                    })
                }
                break
            case "fancy_2_12":
                if (this.state.fancy_2_12_Action) {
                    this.setState({
                        fancy_2_12_Action: false,
                    })
                }
                break
        }        
    }



    render() {
        const {
            ir_lambi,
            mo,
            home,
            away,
            finalMo,
            finalLambi,
            isMatchOddsVoided,
            isMatchOddsSettled,
            isLambiVoided,
            isLambiSettled,
            statusFancyStruct,
            ir_fancy_1_6,
            final_ir_fancy_1_6,
            ir_fancy_1_12,
            final_ir_fancy_1_12,
            ir_fancy_2_6,
            final_ir_fancy_2_6,
            ir_fancy_2_12,
            final_ir_fancy_2_12,
      } = this.props

        console.log("mo.status", mo.status)

        const isFancy_1_6_Voided=statusFancyStruct.ir_fancy_1_6.isFancyVoided
        const isFancy_1_6_Settled=statusFancyStruct.ir_fancy_1_6.isFancySettled
        const isFancy_1_12_Voided=statusFancyStruct.ir_fancy_1_12.isFancyVoided
        const isFancy_1_12_Settled=statusFancyStruct.ir_fancy_1_12.isFancySettled
        const isFancy_2_12_Settled=statusFancyStruct.ir_fancy_2_12.isFancyVoided
        const isFancy_2_12_Voided=statusFancyStruct.ir_fancy_2_12.isFancyVoided  
        const isFancy_2_6_Voided=statusFancyStruct.ir_fancy_2_6.isFancyVoided
        const isFancy_2_6_Settled=statusFancyStruct.ir_fancy_2_6.isFancyVoided        

        const labelStyleObj = {
            "inactive": "info",
            "active": "danger",
            "ready_to_settle": "warning",
            "settled": "success"
        }

        const badgeSignal = {
            "inactive": "..",
            "active": "V",
            "ready_to_settle": "S/V",
            "settled": "-"
        }

        let settleVoidMatchoddsBtn
        let settleVoidLambiBtn
        let settleVoidFancy_1_6_Btn
        let settleVoidFancy_1_12_Btn
        let settleVoidFancy_2_6_Btn
        let settleVoidFancy_2_12_Btn

        if (isMatchOddsVoided) {
            settleVoidMatchoddsBtn = <Button bsStyle="info">Void</Button>
        } else if (isMatchOddsSettled) {
            settleVoidMatchoddsBtn = <Button bsStyle="success">Settle</Button>
        } else {
            settleVoidMatchoddsBtn = (
                <div style={{ position: "relative" }} className="btn-action" onMouseLeave={this.hideMatchoddsAction}>
                    <Button
                        bsStyle="danger"
                        onMouseEnter={this.showMatchoddsAction}
                    >
                        Action{' '}
                        <span className="badge">
                            {
                                badgeSignal[mo.status]
                            }
                        </span>
                    </Button>
                    {
                        this.state.matchoddsAction && (
                            <div style={{ position: "absolute", zIndex: 999, top: 0 }}>
                                {
                                    mo.status === "ready_to_settle" &&
                                    <Button
                                        bsStyle="success"
                                        onClick={() => { this.props.onMatchoddsSettleChange("settle") }}
                                    >Settle
                                            </Button>
                                }
                                {' '}
                                {
                                    (mo.status === "active" || mo.status === "ready_to_settle") &&
                                    <Button
                                        bsStyle="info"
                                        onClick={() => this.props.onMatchoddsSettleChange("void")}
                                        style={mo.status === "active" ? { width: "101px" } : {}}
                                    >Void</Button>
                                }

                            </div>
                        )
                    }
                </div>
            )
        }

        if (isLambiVoided) {
            settleVoidLambiBtn = <Button bsStyle="info">Void</Button>
        } else if (isLambiSettled) {
            settleVoidLambiBtn = <Button bsStyle="success">Settle</Button>
        } else {
            settleVoidLambiBtn = (
                <div style={{ position: "relative" }} className="btn-action" onMouseLeave={this.hideLambiAction}>
                    <button
                        className="btn btn-danger"
                        onMouseEnter={this.showLambiAction}
                    >
                        Action{' '}
                        <span className="badge">{badgeSignal[ir_lambi.status]}</span>
                    </button>
                    {
                        this.state.lambiAction && (
                            <div style={{ position: "absolute", zIndex: 999, top: 0 }}>
                                {
                                    ir_lambi.status === "ready_to_settle" &&
                                    <Button
                                        bsStyle="success"
                                        onClick={() => this.props.onLambiSettleChange("settle")}

                                    >Settle</Button>
                                }{' '}
                                {
                                    (ir_lambi.status === "active" || ir_lambi.status === "ready_to_settle") &&
                                    <Button
                                        bsStyle="info"
                                        onClick={() => this.props.onLambiSettleChange("void")}
                                        style={ir_lambi.status === "active" ? { width: "101px" } : {}}
                                    >Void</Button>
                                }

                            </div>
                        )
                    }
                </div>
            )
        }

        if (isFancy_1_6_Voided) {
            settleVoidFancy_1_6_Btn = <Button bsStyle="info">Void</Button>
        } else if (isFancy_1_6_Settled) {
            settleVoidFancy_1_6_Btn = <Button bsStyle="success">Settle</Button>
        } else {
            settleVoidFancy_1_6_Btn = (
                <div style={{ position: "relative" }} className="btn-action" onMouseLeave={()=>this.hideFancyMarketAction("fancy_1_6")}>
                    <button
                        className="btn btn-danger"
                        onMouseEnter={()=>this.showFancyMarketAction("fancy_1_6")}
                    >
                        Action{' '}
                        <span className="badge">{badgeSignal[ir_fancy_1_6.status]}</span>
                    </button>
                    {
                        this.state.fancy_1_6_Action && (
                            <div style={{ position: "absolute", zIndex: 999, top: 0 }}>
                                {
                                    ir_fancy_1_6.status === "ready_to_settle" &&
                                    <Button
                                        bsStyle="success"
                                        onClick={() => this.props.onFancyMarketBtn("settle","fancy_1_6")}
                                    >Settle</Button>
                                }{' '}
                                {
                                    (ir_fancy_1_6.status === "active" || ir_fancy_1_6.status === "ready_to_settle") &&
                                    <Button
                                        bsStyle="info"
                                        onClick={() => this.props.onFancyMarketBtn("void", "fancy_1_6")}
                                        style={ir_fancy_1_6.status === "active" ? { width: "101px" } : {}}
                                    >Void</Button>
                                }
                            </div>
                        )
                    }
                </div>
            )
        }

        
        if (isFancy_1_12_Voided) {
            settleVoidFancy_1_12_Btn = <Button bsStyle="info">Void</Button>
        } else if (isFancy_1_12_Settled) {
            settleVoidFancy_1_12_Btn = <Button bsStyle="success">Settle</Button>
        } else {
            settleVoidFancy_1_12_Btn = (
                <div style={{ position: "relative" }} className="btn-action" onMouseLeave={()=>this.hideFancyMarketAction("fancy_1_12")}>
                    <button
                        className="btn btn-danger"
                        onMouseEnter={()=>this.showFancyMarketAction("fancy_1_12")}
                    >
                        Action{' '}
                        <span className="badge">{badgeSignal[ir_fancy_1_12.status]}</span>
                    </button>
                    {
                        this.state.fancy_1_12_Action && (
                            <div style={{ position: "absolute", zIndex: 999, top: 0 }}>
                                {
                                    ir_fancy_1_12.status === "ready_to_settle" &&
                                    <Button
                                        bsStyle="success"
                                        onClick={() => this.props.onFancyMarketBtn("settle","fancy_1_12")}
                                    >Settle</Button>
                                }{' '}
                                {
                                    (ir_fancy_1_12.status === "active" || ir_fancy_1_12.status === "ready_to_settle") &&
                                    <Button
                                        bsStyle="info"
                                        onClick={() => this.props.onFancyMarketBtn("void", "fancy_1_12")}
                                        style={ir_fancy_1_12.status === "active" ? { width: "101px" } : {}}
                                    >Void</Button>
                                }
                            </div>
                        )
                    }
                </div>
            )
        }

        if (isFancy_2_6_Voided) {
            settleVoidFancy_2_6_Btn = <Button bsStyle="info">Void</Button>
        } else if (isFancy_2_6_Settled) {
            settleVoidFancy_2_6_Btn = <Button bsStyle="success">Settle</Button>
        } else {
            settleVoidFancy_2_6_Btn = (
                <div style={{ position: "relative" }} className="btn-action" onMouseLeave={()=>this.hideFancyMarketAction("fancy_2_6")}>
                    <button
                        className="btn btn-danger"
                        onMouseEnter={()=>this.showFancyMarketAction("fancy_2_6")}
                    >
                        Action{' '}
                        <span className="badge">{badgeSignal[ir_fancy_2_6.status]}</span>
                    </button>
                    {
                        this.state.fancy_2_6_Action && (
                            <div style={{ position: "absolute", zIndex: 999, top: 0 }}>
                                {
                                    ir_fancy_2_6.status === "ready_to_settle" &&
                                    <Button
                                        bsStyle="success"
                                        onClick={() => this.props.onFancyMarketBtn("settle","fancy_2_6")}
                                    >Settle</Button>
                                }{' '}
                                {
                                    (ir_fancy_2_6.status === "active" || ir_fancy_2_6.status === "ready_to_settle") &&
                                    <Button
                                        bsStyle="info"
                                        onClick={() => this.props.onFancyMarketBtn("void", "fancy_2_6")}
                                        style={ir_fancy_2_6.status === "active" ? { width: "101px" } : {}}
                                    >Void</Button>
                                }
                            </div>
                        )
                    }
                </div>
            )
        }

        if (isFancy_2_12_Voided) {
            settleVoidFancy_2_12_Btn = <Button bsStyle="info">Void</Button>
        } else if (isFancy_2_12_Settled) {
            settleVoidFancy_2_12_Btn = <Button bsStyle="success">Settle</Button>
        } else {
            settleVoidFancy_2_12_Btn = (
                <div style={{ position: "relative" }} className="btn-action" onMouseLeave={()=>this.hideFancyMarketAction("fancy_2_12")}>
                    <button
                        className="btn btn-danger"
                        onMouseEnter={()=>this.showFancyMarketAction("fancy_2_12")}
                    >
                        Action{' '}
                        <span className="badge">{badgeSignal[ir_fancy_2_12.status]}</span>
                    </button>
                    {
                        this.state.fancy_2_12_Action && (
                            <div style={{ position: "absolute", zIndex: 999, top: 0 }}>
                                {
                                    ir_fancy_2_12.status === "ready_to_settle" &&
                                    <Button
                                        bsStyle="success"
                                        onClick={() => this.props.onFancyMarketBtn("settle","fancy_2_12")}
                                    >Settle</Button>
                                }{' '}
                                {
                                    (ir_fancy_2_12.status === "active" || ir_fancy_2_12.status === "ready_to_settle") &&
                                    <Button
                                        bsStyle="info"
                                        onClick={() => this.props.onFancyMarketBtn("void", "fancy_2_12")}
                                        style={ir_fancy_2_12.status === "active" ? { width: "101px" } : {}}
                                    >Void</Button>
                                }
                            </div>
                        )
                    }
                </div>
            )
        }

        return (
            <tbody>
                <tr>
                    <td>Matchodds</td>
                    <td>N/A</td>
                    <td>
                        <h3>
                            <Label bsStyle={labelStyleObj[mo.status]}>{mo.status}</Label>
                        </h3>

                    </td>
                    <td>{mo.winner ? mo.winner : "-"}</td>
                    <td>
                        <select name="" id="" defaultValue="outcome" onChange={this.props.onOutcomeChange}>
                            <option value="outcome" hidden>Choose outcome</option>
                            <option value="Draw">Draw</option>
                            <option value={home}>{home}</option>
                            <option value={away}>{away}</option>
                        </select>
                    </td>
                    <td>{finalMo}</td>
                    <td>
                        {/* <select defaultValue="either" onChange={this.props.onMatchoddsSettleChange}>
                            <option value="either" hidden>Settle/Void</option>
                            <option value="settle">settle</option>
                            <option value="void">void</option>
                        </select> */}
                        {settleVoidMatchoddsBtn}
                    </td>
                    <td>
                        <button className="btn btn-primary">Undo</button>
                    </td>
                    <td>
                        active*
                    </td>
                </tr>
                <tr>
                    <td>Lambi</td>
                    <td>{ir_lambi.team ? ir_lambi.team : "-"}</td>
                    <td>
                        <h3>
                            <Label bsStyle={labelStyleObj[ir_lambi.status]}>{ir_lambi.status} </Label>
                        </h3>
                    </td>
                    <td>{ir_lambi.runs ? ir_lambi.runs : "-"}</td>
                    <td>
                        <input type="number" step="1" value={finalLambi} onChange={this.props.onLambiChange} />
                    </td>
                    <td>{finalLambi}</td>
                    <td>
                        {/* <select name="" id="" defaultValue="either" onChange={this.props.onLambiSettleChange}>
                            <option value="either" hidden>Settle/Void</option>
                            <option value="settle">settle</option>
                            <option value="void">void</option>
                        </select> */}
                        {settleVoidLambiBtn}
                    </td>
                    <td>
                        <button className="btn btn-primary">Undo</button>
                    </td>
                    <td>settled</td>
                </tr>
                <tr>
                    <td>Fancy 1 6</td>
                    <td>{ir_fancy_1_6.team ? ir_fancy_1_6.team : "-"}</td>
                    <td>
                        <h3>
                            <Label bsStyle={labelStyleObj[ir_fancy_1_6.status]}>{ir_fancy_1_6.status} </Label>
                        </h3>
                    </td>
                    <td>{ir_fancy_1_6.runs!==0 ? ir_fancy_1_6.runs : "-"}</td>
                    <td>
                        <input type="number" step="1" value={final_ir_fancy_1_6} onChange={e=>this.props.onFancyMarketsChange(e, "fancy_1_6")} />
                    </td>
                    <td>{final_ir_fancy_1_6}</td>
                    <td>
                        {/* <select name="" id="" defaultValue="either" onChange={this.props.onLambiSettleChange}>
                            <option value="either" hidden>Settle/Void</option>
                            <option value="settle">settle</option>
                            <option value="void">void</option>
                        </select> */}
                        {settleVoidFancy_1_6_Btn}
                    </td>
                    <td>
                        <button className="btn btn-primary">Undo</button>
                    </td>
                    <td>settled</td>
                </tr>
                <tr>
                    <td>Fancy 1 12</td>
                    <td>{ir_fancy_1_12.team ? ir_fancy_1_12.team : "-"}</td>
                    <td>
                        <h3>
                            <Label bsStyle={labelStyleObj[ir_fancy_1_12.status]}>{ir_fancy_1_12.status} </Label>
                        </h3>
                    </td>
                    <td>{ir_fancy_1_12.runs!==0 ? ir_fancy_1_12.runs : "-"}</td>
                    <td>
                        <input type="number" step="1" value={final_ir_fancy_1_12} onChange={e=>this.props.onFancyMarketsChange(e, "fancy_1_12")} />
                    </td>
                    <td>{final_ir_fancy_1_12}</td>
                    <td>
                        {/* <select name="" id="" defaultValue="either" onChange={this.props.onLambiSettleChange}>
                            <option value="either" hidden>Settle/Void</option>
                            <option value="settle">settle</option>
                            <option value="void">void</option>
                        </select> */}
                        {settleVoidFancy_1_12_Btn}
                    </td>
                    <td>
                        <button className="btn btn-primary">Undo</button>
                    </td>
                    <td>settled</td>
                </tr>
                <tr>
                    <td>Fancy 2 6</td>
                    <td>{ir_fancy_2_6.team ? ir_fancy_2_6.team : "-"}</td>
                    <td>
                        <h3>
                            <Label bsStyle={labelStyleObj[ir_fancy_2_6.status]}>{ir_fancy_2_6.status} </Label>
                        </h3>
                    </td>
                    <td>{ir_fancy_2_6.runs!==0 ? ir_fancy_2_6.runs : "-"}</td>
                    <td>
                        <input type="number" step="1" value={final_ir_fancy_2_6} onChange={(e)=>this.props.onFancyMarketsChange(e, "fancy_2_6")} />
                    </td>
                    <td>{final_ir_fancy_2_6}</td>
                    <td>
                        {/* <select name="" id="" defaultValue="either" onChange={this.props.onLambiSettleChange}>
                            <option value="either" hidden>Settle/Void</option>
                            <option value="settle">settle</option>
                            <option value="void">void</option>
                        </select> */}
                        {settleVoidFancy_2_6_Btn}
                    </td>
                    <td>
                        <button className="btn btn-primary">Undo</button>
                    </td>
                    <td>settled</td>
                </tr>
                <tr>
                    <td>Fancy 2 12</td>
                    <td>{ir_fancy_2_12.team ? ir_fancy_2_12.team : "-"}</td>
                    <td>
                        <h3>
                            <Label bsStyle={labelStyleObj[ir_fancy_2_12.status]}>{ir_fancy_2_12.status} </Label>
                        </h3>
                    </td>
                    <td>{ir_fancy_2_12.runs!==0 ? ir_fancy_2_12.runs : "-"}</td>
                    <td>
                        <input type="number" step="1" value={final_ir_fancy_2_12} onChange={(e)=>this.props.onFancyMarketsChange(e, "fancy_2_12")} />
                    </td>
                    <td>{final_ir_fancy_2_12}</td>
                    <td>
                        {/* <select name="" id="" defaultValue="either" onChange={this.props.onLambiSettleChange}>
                            <option value="either" hidden>Settle/Void</option>
                            <option value="settle">settle</option>
                            <option value="void">void</option>
                        </select> */}
                        {settleVoidFancy_2_12_Btn}
                    </td>
                    <td>
                        <button className="btn btn-primary">Undo</button>
                    </td>
                    <td>settled</td>
                </tr>
            </tbody>
        )
    }
}

export default SettleTbody