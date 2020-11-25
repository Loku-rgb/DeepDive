import React, { Component } from "react";
import { Link } from "react-router-dom";

import DEMO from "../../../../store/constant";
import Aux from "../../../../hoc/_Aux";

class Breadcrumb extends Component {
  render() {
    console.log("window.location.pathname : ",window.location.pathname)
    let name = window.location.pathname
      .split("/")
      .slice(-1)[0]
      .replace(/([A-Z])/g, " $1");
    let page = window.location.pathname
      .split("/")
      .slice(-2)[0]
      .replace(/([A-Z])/g, " $1");
    let breadcrumb = (
      <div className="page-header">
        <div className="page-block">
          <div className="row align-items-center">
            <div className="col-md-12">
              <div className="page-header-title">
                <h5 className="m-b-10">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </h5>
              </div>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="feather icon-home" />
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <a href={DEMO.BLANK_LINK}>
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href={DEMO.BLANK_LINK}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
    document.title =
      name.charAt(0).toUpperCase() + name.slice(1) + " | DeepDive";

    return <Aux>{breadcrumb}</Aux>;
  }
}

export default Breadcrumb;
