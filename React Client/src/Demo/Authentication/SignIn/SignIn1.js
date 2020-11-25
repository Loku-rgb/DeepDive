import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col,Image } from 'react-bootstrap'

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";

class SignUp1 extends React.Component {
    render() {
        return (
            <Aux>
                <div className="auth-wrapper">
                    <Row >
                        <Col md={6} style={{maxWidth:"50%"}}>
                             <Image src={require("../../../assets/images/deep-dive-LOGO-p-1600.png")} style={{width:"20rem"}} />
                        </Col>
                        <Col md={6} >
                            <div className="auth-content">
                                <div className="auth-bg">
                                    <span className="r" />
                                    <span className="r s" />
                                    <span className="r s" />
                                    <span className="r" />
                                </div>
                                <div className="card">
                                    <div className="card-body text-center">
                                        <div className="mb-4">
                                            <i className="feather icon-unlock auth-icon" />
                                        </div>
                                        <h3 className="mb-4">Login</h3>
                                        <div className="input-group mb-3">
                                            <input type="email" className="form-control" placeholder="Email" />
                                        </div>
                                        <div className="input-group mb-4">
                                            <input type="password" className="form-control" placeholder="password" />
                                        </div>
                                        <div className="form-group text-left">
                                            <div className="checkbox checkbox-fill d-inline">
                                                <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" />
                                                <label htmlFor="checkbox-fill-a1" className="cr"> Save credentials</label>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary shadow-2 mb-4" onClick={() => { this.props.setUserDetails({ type: "admin", loginState: true }) }}>Login As Admin</button>
                                        <button className="btn btn-primary shadow-2 mb-4" onClick={() => { this.props.setUserDetails({ type: "member", loginState: true }) }}>Login As Member</button>
                                    </div>
                                </div>
                            </div>


                        </Col>
                    </Row>

                </div>
            </Aux>
        );
    }
}

export default SignUp1;