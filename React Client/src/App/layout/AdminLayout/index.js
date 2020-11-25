import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';

import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';
import Loader from "../Loader";
import routes from "../../../routes";
import FullPageRoute from "../../../route";

import Subscription from "../../../Demo/Account/Subscription"
import Account from "../../../Demo/Account/Account"

import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";
import config from '../../../config';
import './app.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

class AdminLayout extends Component {

  fullScreenExitHandler = () => {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
      this.props.onFullScreenExit();
    }
  };

  componentWillMount() {
    if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
      this.props.onComponentWillMount();
    }
  }

  mobileOutClickHandler() {
    if (this.props.windowWidth < 992 && this.props.collapseMenu) {
      this.props.onComponentWillMount();
    }
  }


  render() {
    console.log("In admin Layout", this.props.userType)


    /* full screen exit call */
    document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
    document.addEventListener('webkitfullscreenchange', this.fullScreenExitHandler);
    document.addEventListener('mozfullscreenchange', this.fullScreenExitHandler);
    document.addEventListener('MSFullscreenChange', this.fullScreenExitHandler);

    const menu = routes.map((route, index) => {
      return (route.component) ? (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          name={route.name}
          render={props => (
            <route.component {...props} />
          )} />
      ) : (null);
    });

    return (
      <BrowserRouter basename={config.basename}>
        <Switch>
        <Route
                              path="/prices"
                              exact={true}
                              name="Basic"
                              render={props => (
                                <Subscription {...props} />
                              )} />
                            <Route
                              path="/account"
                              exact={true}
                              name="Basic"
                              render={props => (
                                <Account {...props} />
                              )} />
        <Aux>
          <Fullscreen enabled={this.props.isFullScreen}>
            <Navigation setUserLoginState={this.props.setUserLoginState} userType={this.props.userType} />
            <NavBar />
            <div className="pcoded-main-container" onClick={() => this.mobileOutClickHandler}>
              <div className="pcoded-wrapper">
                <div className="pcoded-content">
                  <div className="pcoded-inner-content">
                    <Breadcrumb />
                    <div className="main-body">
                      <div className="page-wrapper">
                        <Suspense fallback={<Loader />}>
                          
                            {menu}
                            
                            <Redirect from="/" to={this.props.defaultPath} />
                          
                        </Suspense>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fullscreen>
        </Aux>
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    defaultPath: state.defaultPath,
    isFullScreen: state.isFullScreen,
    collapseMenu: state.collapseMenu,
    configBlock: state.configBlock,
    layout: state.layout
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onFullScreenExit: () => dispatch({ type: actionTypes.FULL_SCREEN_EXIT }),
    onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(AdminLayout));