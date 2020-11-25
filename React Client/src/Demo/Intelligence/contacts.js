import React, { useState, useEffect, useRef, Component } from "react";
import {Row,Col,Card,  Button,  Form,  ToggleButtonGroup,  ToggleButton,  Container, Tabs, Tab} from "react-bootstrap";
import { Link } from "react-router-dom";
import Aux from "../../hoc/_Aux";
import BootstrapTable from "react-bootstrap-table-next";

import ToolkitProvider, {  Search,  CSVExport,} from "react-bootstrap-table2-toolkit";
import axios from "axios";

import "./mystyle.css";
import DEMO from "../../store/constant";

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';


import ReactDOM from "react-dom";
import { Line } from "react-chartjs-2";
const pdfConverter = require("jspdf");

export default function Contacts() {

  const [dataFromApi, setDatafromApi] = useState([]); 

  const { SearchBar, ClearSearchButton } = Search;
  const { ExportCSVButton } = CSVExport;


  //-----------------------------------------------------------------------Set Filters Card--------------------------------

  //ref to filter search inputs
  const inputName = useRef(null);
  const periodRef = useRef(0);
  const date_from_month = useRef();
  const date_from_year = useRef();
  const date_to_month = useRef();
  const date_to_year = useRef();

  //data
  const months = ["...","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",]
  const year = ["...", "2018", "2019", "2020"]
  const period = ["24h", "7d", "14d", "30d"]

  //tags
  const [tagsName,setTagsName] = useState([])
  const [tagsColor,setTagsColor] = useState([])
  const [tagsState,setTagsState] = useState([])

  //checkbox change handler
  const handleCheckBoxChange = (e) => {
    // console.log("called handlechange : ",e.target.id)
    let temp = tagsState;
    temp[e.target.id] = !temp[e.target.id];
    console.log("temp : ",temp)
    setTagsState([...temp]);
  };

  //tags checkboxes
  const tagsComponent = () => {
    return (
      <Col>
        <Row style={{ justifyContent: "flex-start", alignItems: "center" }}>
          {tagsName.map((tagName, index) => (
            <div key={index}>
              <input 
                type="checkbox"
                id={index}
                checked={tagsState[index]===undefined?true:tagsState[index]}
                onChange={(e) => handleCheckBoxChange(e)}
              />
              <label style={{ color: tagsColor[index], margin: "1rem" }}>
                {tagName}
              </label>
            </div>
          ))}
        </Row>
      </Col>
    )
  }
  // -----------------------------------------------------single contatc tab's graph Data--------------------------------------

  //default Y labels
  const [graphYLabels1, setGraphYLabels1] = useState([65, 40, 65, 59, 80, 81, 56, 56, 55, 40, 65, 59, 80, 81, 56, 19, 56, 55, 40, 55, 55, 40, 55, 40, 65, 59, 80, 81, 56, 55, 40])
  const [graphYLabels2, setGraphYLabels2] = useState([56, 19, 56, 65, 59, 80, 81, 56, 19, 56, 65, 40, 65, 59, 80, 81, 81, 56, 19, 56, 65, 40, 65, 59, 80, 55, 40, 55, 40, 65, 59, 80, 81, 40, 55])
  const [graphYLabels3, setGraphYLabels3] = useState([50, 55, 40, 65, 59, 80, 81, 56, 91, 56, 55, 55, 40, 65, 59, 56, 19, 56, 65, 55, 40, 19, 56, 65, 40, 65, 59, 80, 81, 19, 30, 46])

  //default labels
  const [graphEmailTone, setGraphEmailTone] = useState({
    labels: ["01d", "0d"],
    datasets: [{
      label: 'Positive👍',
      fill: 1,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: 'rgba(75,192,192,1)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: graphYLabels1
    }, {
      label: 'Neutral👌',
      fill: 2,
      lineTension: 0.1,
      backgroundColor: 'rgb(145, 209, 139,0.4)',
      borderColor: 'rgb(145, 209, 139,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgb(	145, 209, 139,1)',
      pointBackgroundColor: 'rgb(	145, 209, 139,1)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgb(145, 209, 139,1)',
      pointHoverBorderColor: 'rgba(145, 209, 139,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: graphYLabels2
    }, {
      label: 'Tricky👏',
      fill: 3,
      lineTension: 0.1,
      backgroundColor: 'rgba(234, 158, 84,0.4)',
      borderColor: 'rgba(234, 158, 84,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(234, 158, 84,1)',
      pointBackgroundColor: 'rgba(234, 158, 84,1)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(234, 158, 84,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: graphYLabels3
    },]
  })

  const [graphdataEmailVolume, setGraphdataEmailVolume] = useState({
    labels: ["01d", "0d"],
    datasets: [{
      label: 'Email Volume (Member 1)',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: 'rgba(75,192,192,1)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: graphYLabels1
    }, {
      label: 'Email Volume (Member 2)',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgb(145, 209, 139,0.4)',
      borderColor: 'rgb(145, 209, 139,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgb(	145, 209, 139,1)',
      pointBackgroundColor: 'rgb(	145, 209, 139,1)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgb(145, 209, 139,1)',
      pointHoverBorderColor: 'rgba(145, 209, 139,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: graphYLabels2
    }, {
      label: 'Email Volume (Member 3)',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(234, 158, 84,0.4)',
      borderColor: 'rgba(234, 158, 84,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(234, 158, 84,1)',
      pointBackgroundColor: 'rgba(234, 158, 84,1)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(234, 158, 84,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: graphYLabels3
    },]
  })


  //-----------------------------------------------------------------------Table's colored Tags Column --------------------------------

  //table's tag circles style
  const tagColoredDiv = (color) => {
    return {
      width: "0.8rem",
      height: "0.8rem",
      background: color,
      borderRadius: "0.8rem",
      margin: "0.1rem",
    };
  };
  //table's tone circles style
  const tableToneStyle = (color) => {
    return {
      width: "0.8rem",
      height: "0.8rem",
      background: color,
      borderRadius: "0.8rem",
      margin: "0.1rem",
      border: "1px solid grey",
    };
  };
  let tagColoredCirclesArr = (tagObjArr) => {
    return <Row>
      {tagObjArr.map((tagObj, index) => {
        return <div key={index} style={tagColoredDiv(tagObj.color_code)} />;
      })}
    </Row>
  }
  let toneDiv = (toneObj) =>{
    let div = <></>;

    let arrayofdivs = (tonecolor) => {
      let arr = [];
      for (let i = 0; i < 3; i++) {
        if (i < Number(toneObj.magnitude))
          arr.push(<div key={i} style={tableToneStyle(tonecolor)} />);
        else arr.push(<div key={i} style={tableToneStyle("white")} />);
      }
      return arr;
    };

    let temp = () => {
      if(toneObj.sentiment_score===0) return 0;
      else return(toneObj.sentiment_score>0?1:-1)
    }

    switch (temp()) {
      case 1: {
        div = (
          <Row style={{ justifyContent: "start", alignItems: "center" }}>
            <span>👍 Positive </span>
            {arrayofdivs("green")}
          </Row>
        );
        break;
      }
      case 0: {
        div = (
          <Row style={{ justifyContent: "start", alignItems: "center" }}>
            <span>👌 Neutral </span>
            {arrayofdivs("powderblue")}
          </Row>
        );
        break;
      }
      case -1: {
        div = (
          <Row style={{ justifyContent: "start", alignItems: "center" }}>
            <span>👏 Tricky </span>
            {arrayofdivs("orange")}
          </Row>
        );
        break;
      }

      default: div = <></>
    }
    return div
  }
  
  // -----------------------------------------------------------------------Table ---------------------------------------------------------------
  
  const [completeColumnData,setCompleteColumnData] = useState([]) //stores complete list of contacts,used for fallback fpr columnData when clear filter is clicked
  const [columnData, setColumnData] = useState([]); //stores list after filteration if any

  //table headings
  const columnHeading = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "companyTitle",
      text: "Company & Title",
      sort: true,
    },
    {
      dataField: "tone",
      text: "Tone",
    },
    {
      dataField: "tags",
      text: "Tags",
    },
    {
      dataField: "view",
      text: "View",
    },
    {
      dataField: "link",
      text: "Link",
    },
  ];

  const [singleContactVisible,setSingleContactVisible] =  useState(false);
  const [contactSelected,setContactSelected] = useState();
  const [tabPersonalInfo,setTabPersonalInfo] = useState();
  const [tabInsightsComponent,setTabInsightsComponent] = useState();
  const [tabDocuments,setTabDocuments] = useState()
  const [singleContactScreen,setSingleContactScreen] = useState();

  const documentsTable = (contact) =>{
    function get_documents(userId) {
      return axios.get("/contactsList/" + userId +"/" + contact._id)
    }
  
    //making get api call for tags given tagId
    function get_tags(tagID) {
      // return axios.get("/tagsList/" + tagID)
    }
    

    return(
      <div>Document Table</div>
    )
  }

  useEffect(() => {
    console.log("contactSelected changed")
    if (contactSelected) {
      setTabPersonalInfo(
        <Aux>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Col md={4} style={{ textAlign: "end" }}>
              <img className="rounded-circle" style={{ width: '8rem' }} src={avatar2} alt="activity-user" />
            </Col>
            <Col md={6}>
              <Row style={{ margin: "0", alignItems: "center" }}>
                <Col md={3}> <h6>Tags : </h6>{" "} </Col>
                <Col md={9}>
                  <div style={{ padding: "0px 15px" }}>
                    {tagColoredCirclesArr(contactSelected.tags)}
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0", alignItems: "center" }}>
                <Col md={3}> <h6>Tone : </h6>{" "} </Col>
                <Col md={9}>
                  <div style={{ padding: "0px 15px" }}>
                    {toneDiv(contactSelected.tone)}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ margin: "1rem", alignItems: "baseline" }}>
            <Col sm={6} md={2} style={{ justifyContent: "center", alignContent: "center" }}> <h6>First Name : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={contactSelected.first_name}
              />
            </Col>

            <Col sm={6} md={2}> <h6>Last Name : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={contactSelected.last_name != "Unknown" ? contactSelected.last_name : ""}
              />
            </Col>
          </Row>
          <Row style={{ margin: "1rem", alignItems: "baseline" }}>
            <Col sm={6} md={2} style={{ justifyContent: "center", alignContent: "center" }}> <h6>Email : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={contactSelected.email !== "NA" ? contactSelected.email : ""}
              />
            </Col>
            <Col sm={6} md={2}> <h6>Phone : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={contactSelected.phone !== "NA" ? contactSelected.phone : ""}
              />
            </Col>
          </Row>
          <Row style={{ margin: "1rem", alignItems: "baseline" }}>
            <Col sm={6} md={2} style={{ justifyContent: "center", alignContent: "center" }}> <h6>Company : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={contactSelected.organization !== "NA" ? contactSelected.organization : ""}
              />
            </Col>
            <Col sm={6} md={2}> <h6>Position : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={contactSelected.occupation !== "NA" ? contactSelected.occupation : ""}
              />
            </Col>
          </Row>
          <Row style={{ margin: "1rem", alignItems: "baseline" }}>
            <Col sm={6} md={2} style={{ justifyContent: "center", alignContent: "center" }}> <h6>Link : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={""}
              />
            </Col>
            <Col sm={6} md={2} style={{ justifyContent: "center", alignContent: "center" }}> <h6>Website : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={""}
              />
            </Col>
          </Row>
          <Row style={{ margin: "1rem", alignItems: "baseline" }}>
            <Col sm={6} md={2} style={{ justifyContent: "center", alignContent: "center" }}> <h6>Socials 1 : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={""}
              />
            </Col>
            <Col sm={6} md={2} style={{ justifyContent: "center", alignContent: "center" }}> <h6>Socials 2 : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={""}
              />
            </Col>
          </Row>
          <Row style={{ margin: "1rem", alignItems: "baseline" }}>
            <Col sm={6} md={2} style={{ justifyContent: "center", alignContent: "center" }}> <h6>Socials 3 : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={""}
              />
            </Col>
            <Col sm={6} md={2} style={{ justifyContent: "center", alignContent: "center" }}> <h6>Socials 4 : </h6>{" "} </Col>
            <Col sm={6} md={4}>
              <Form.Control
                disabled
                size="sm"
                type="text"
                placeholder="Not Available"
                value={""}
              />
            </Col>
          </Row>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Button onClick={() => { setSingleContactVisible(false) }} variant="light" size="sm">Go Back</Button>
          </Row>
        </Aux>
      )
      setTabInsightsComponent(
        <>
          <Row style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
            <Col md={6} xl={4} style={{ minHeight: "100%" }}>
              <Card style={{ padding: "20px" }}>
                <h6 className='mb-4'>Avg Number of Emails</h6>
                <Card.Body style={{ padding: "39px 0px" }}>

                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5" />300% </h3>
                    </div>

                    <div className="col-3 text-right">
                      <p className="m-b-0" style={{ padding: "0" }}>150 Emails</p>
                    </div>
                  </div>
                  <div className="progress m-t-30" style={{ height: '7px' }}>
                    <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} xl={4}>
              <Card style={{ padding: "18px" }}>
                <h6 className='mb-4'>Avg Email Reply Time</h6>
                <Card.Body style={{ padding: "10px 5px" }}>

                  <Row style={{ justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: "8rem", height: "8rem", borderRadius: "8rem", border: '1rem solid powderblue', padding: "1rem" }}>
                      <Col style={{ margin: "0", padding: "0" }}>00 Days</Col>
                      <Col style={{ margin: "0", padding: "0" }}>02 Hours</Col>
                      <Col style={{ margin: "0", padding: "0" }}>36 Mins</Col>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <Card.Body style={{ padding: "11px" }}>
                  <h6 className='mb-4'>Top Tags</h6>
                  <div className="row">
                    <div className="col-xl-12">
                      <h6 className="align-items-center float-left"><i className="fa fa-envelope-o f-10 m-r-10 text-c-red" />Important</h6>
                      <h6 className="align-items-center float-right">70 Emails</h6>
                      <div className="progress m-t-30 m-b-20" style={{ height: '6px' }}>
                        <div className="progress-bar progress-c-theme3" role="progressbar" style={{ width: '70%' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" />
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <h6 className="align-items-center float-left"><i className="fa fa-envelope-o f-10 m-r-10 text-c-blue" />Indirect</h6>
                      <h6 className="align-items-center float-right">35 Emails</h6>
                      <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                        <div className="progress-bar progress-c-theme4" role="progressbar" style={{ width: '35%' }} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100" />
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <h6 className="align-items-center float-left"><i className="fa fa-envelope-o f-10 m-r-10 text-c-yellow" />Hidden</h6>
                      <h6 className="align-items-center float-right">25 Emails</h6>
                      <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                        <div className="progress-bar progress-c-theme5" role="progressbar" style={{ width: '25%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" />
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Email Tone Timeline</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row style={{ "justifyContent": "center" }}>
                <Col md={9} sm={12} style={{ "padding": 0 }}>
                      <Line
                        data={graphEmailTone}
                        options={{
                          legend: {
                            display: true,
                            position: 'bottom'
                          },
                          maintainAspectRatio: true,
                        }}
                      />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Email Volume Timeline</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row style={{ "justifyContent": "center" }}>
                <Col md={9} sm={12} style={{ "padding": 0 }}>
                      <Line
                        data={graphdataEmailVolume}
                        options={{
                          legend: {
                            display: true,
                            position: 'bottom'
                          },
                          maintainAspectRatio: true,
                        }}
                      />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )
      setTabDocuments(documentsTable(contactSelected))
    }
  }, [contactSelected])

  useEffect(()=>{
    setTabInsightsComponent(
      <>
        <Row style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
          <Col md={6} xl={4} style={{ minHeight: "100%" }}>
            <Card style={{ padding: "20px" }}>
              <h6 className='mb-4'>Avg Number of Emails</h6>
              <Card.Body style={{ padding: "39px 0px" }}>

                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0"><i className="feather icon-arrow-up text-c-green f-30 m-r-5" />300% </h3>
                  </div>

                  <div className="col-3 text-right">
                    <p className="m-b-0" style={{ padding: "0" }}>150 Emails</p>
                  </div>
                </div>
                <div className="progress m-t-30" style={{ height: '7px' }}>
                  <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xl={4}>
            <Card style={{ padding: "18px" }}>
              <h6 className='mb-4'>Avg Email Reply Time</h6>
              <Card.Body style={{ padding: "10px 5px" }}>

                <Row style={{ justifyContent: "center", alignItems: "center" }}>
                  <div style={{ width: "8rem", height: "8rem", borderRadius: "8rem", border: '1rem solid powderblue', padding: "1rem" }}>
                    <Col style={{ margin: "0", padding: "0" }}>00 Days</Col>
                    <Col style={{ margin: "0", padding: "0" }}>02 Hours</Col>
                    <Col style={{ margin: "0", padding: "0" }}>36 Mins</Col>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4}>
            <Card>
              <Card.Body style={{ padding: "11px" }}>
                <h6 className='mb-4'>Top Tags</h6>
                <div className="row">
                  <div className="col-xl-12">
                    <h6 className="align-items-center float-left"><i className="fa fa-envelope-o f-10 m-r-10 text-c-red" />Important</h6>
                    <h6 className="align-items-center float-right">70 Emails</h6>
                    <div className="progress m-t-30 m-b-20" style={{ height: '6px' }}>
                      <div className="progress-bar progress-c-theme3" role="progressbar" style={{ width: '70%' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" />
                    </div>
                  </div>

                  <div className="col-xl-12">
                    <h6 className="align-items-center float-left"><i className="fa fa-envelope-o f-10 m-r-10 text-c-blue" />Indirect</h6>
                    <h6 className="align-items-center float-right">35 Emails</h6>
                    <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                      <div className="progress-bar progress-c-theme4" role="progressbar" style={{ width: '35%' }} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100" />
                    </div>
                  </div>

                  <div className="col-xl-12">
                    <h6 className="align-items-center float-left"><i className="fa fa-envelope-o f-10 m-r-10 text-c-yellow" />Hidden</h6>
                    <h6 className="align-items-center float-right">25 Emails</h6>
                    <div className="progress m-t-30  m-b-20" style={{ height: '6px' }}>
                      <div className="progress-bar progress-c-theme5" role="progressbar" style={{ width: '25%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" />
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Email Tone Timeline</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row style={{ "justifyContent": "center" }}>
              <Col md={9} sm={12} style={{ "padding": 0 }}>
                    <Line
                      data={graphEmailTone}
                      options={{
                        legend: {
                          display: true,
                          position: 'bottom'
                        },
                        maintainAspectRatio: true,
                      }}
                    />
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Email Volume Timeline</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row style={{ "justifyContent": "center" }}>
              <Col md={9} sm={12} style={{ "padding": 0 }}>
                    <Line
                      data={graphdataEmailVolume}
                      options={{
                        legend: {
                          display: true,
                          position: 'bottom'
                        },
                        maintainAspectRatio: true,
                      }}
                    />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    )
  },[graphEmailTone,graphdataEmailVolume])

  useEffect(() => {
    if(tabPersonalInfo && tabInsightsComponent && tabDocuments){
      console.log("setting singleContactScreen")

      setSingleContactScreen(
        <Col>
          <Tabs defaultActiveKey="contactInfo" id="contact-tab">
            <Tab eventKey="contactInfo" title="Personal Information">
              {tabPersonalInfo}
            </Tab>
            <Tab eventKey="contactInsights" title="Insights">
              {tabInsightsComponent}
            </Tab>
            <Tab eventKey="contactDocuments" title="Documents">
              {tabDocuments}
            </Tab>
          </Tabs>
        </Col>
      )
    }
  }, [tabPersonalInfo,tabInsightsComponent,tabDocuments])

  useEffect(()=>{
    if(singleContactScreen) setSingleContactVisible(true)
  },[singleContactScreen])


  // ----------------------------------------------------------------------timeLine Chart---------------------------------------

  //to be used for downloading graph
  const chartRef = useRef(null);

  //default Y labels
  const [graphYLabels, setGraphYLabels] = useState([65,40,65,59,80,81,56,56,55,40,65,59,80,81,56,1,56,55,40,55,40,40,65,59,80,81,56,55,40,55,40,65,59,80,81,56,55,40,]);

  //default labels
  const [graphdata, setGraphData] = useState({
    labels: ["01d", "0d"],
    datasets: [
      {
        label: "No. of Contacts",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "rgba(75,192,192,1)",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: graphYLabels,
      },
    ],
  });

  //updating labels of "graphdata" on "period" change
  const getGraphXlabels = () => {
    let arr = [];
    let noOfDays = 0;
    switch (Number(periodRef.current.value)) {
      case 1: {
        noOfDays = 1;
        break;
      }
      case 2: {
        noOfDays = 7;
        break;
      }
      case 3: {
        noOfDays = 14;
        break;
      }
      case 4: {
        noOfDays = 30;
        break;
      }
      default: {
        noOfDays = 0;
      }
    }

    for (let i = noOfDays; i >= 0; i--) {
      arr.push(i + "d");
    }
    setGraphData({ ...graphdata, labels: arr });
    setGraphdataEmailVolume({...graphdataEmailVolume, labels:arr})
    setGraphEmailTone({...graphEmailTone, labels:arr})

    // setTabInsightsComponent(tabInsightsComponent)
  };

// -----------------------------------Apply button and clear button------------------------

  //Clear filters
  const handleClearClick = () => {
    // setColumnData(newColumnDataWithTagsToneLinks);
    // inputName.current.value = "";
    // periodRef.current.value = "1";
    // date_from_month.current.value = "...";
    // date_from_year.current.value = "...";
    // date_to_month.current.value = "...";
    // date_to_year.current.value = "...";
    // getGraphXlabels();
  };

  //Apply filters
  const handleAppyClick = () => {
    // setColumnData(newColumnDataWithTagsToneLinks);
  };

  // ----------------------------------------------------------------------------------Api Calls-------------------------------------

  //making get api call for contacts for user with "userID"....returns array of conatcts with "tags" array of tag's ids
  function get_contacts(userId) {
    return axios.get("/contactsList/" + userId)
  }

  //making get api call for tags given tagId
  function get_tags(tagID) {
    return axios.get("/tagsList/" + tagID)
  }

  //structure contact data after gettings data from apis
  var get_contactsData = async function (userId) {

    const contactsListWithTagsIds = (await get_contacts(userId)).data;

    const contactListWithTagsObj = []

    //iterate through contactsListWithTagsIds for replacing replace array of "tagId" with array of tag objects
    let tempTags = [];
    for (const contact of contactsListWithTagsIds) {
      for (const tagId of contact.tags) {
        let temp = (await get_tags(tagId)).data[0]
        tempTags.push(temp)
      }
      contact.tags = tempTags //replace array of "tagId" with array of tag objects
      contactListWithTagsObj.push(contact)
      tempTags = [] //reinitialise for another contact in loop
    }
    return contactListWithTagsObj
  }

  // initially and after Component loaded for first time => get data from APis
  useEffect(() => {
    get_contactsData("5f27f0033c2be31a8a7b4ed3").then((contacts) => {

      let tempTagsName = []
      let tempTagsColor = []
      let tempTagsState = []
      let tempDataFromApi = [] //this is formatted data for tables'data, will includes coloured tone and tags div data too

      //set tags
      for (let contact of contacts) {
        for (let tag of contact.tags) {
          if (!tempTagsName.includes(tag.tag_name)) {
            tempTagsName.push(tag.tag_name);
            tempTagsColor.push(tag.color_code);
            tempTagsState.push(true)
          }
        }
      }

      // set tags divs and tone divs into tempDataFromApi , as now possible tags are available at tempTagsName
      for(let contact of contacts){
        //set dataFromApi 
        tempDataFromApi.push({
          name : `${contact.first_name} ${contact.last_name!=="NA"?contact.last_name:""}`,
          companyTitle : `${contact.occupation}, ${contact.organization}`,
          email : `${contact.email}`,
          tags : tagColoredCirclesArr(contact.tags),
          tone : toneDiv(contact.tone),
          view: <Button onClick={()=>{setContactSelected(contact);}} variant="light" size="sm">View</Button>,
          link: <Button href="#!" variant="link" size="sm">Link</Button>
        })

      }

      setTagsColor(tempTagsColor);
      setTagsName(tempTagsName);
      setTagsState(tempTagsState);

      setDatafromApi(contacts);//store raw data here
      setCompleteColumnData(tempDataFromApi)  //store complete table data for fallback for filterd "columnData"
      setColumnData(tempDataFromApi) //store table data
    })
  }, []);

  return (
    <Aux>
      <Card>
        <Card.Header>
          <Card.Title as="h5">Set Filters</Card.Title>
          {/* <span className="d-block m-t-5">use props <code>hover</code> with <code>Table</code> component</span> */}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Row style={{ justifyContent: "space-between" }}>
                <Col md={4}>
                  <Form.Group
                    controlId="exampleForm.ControlSelect1"
                    style={{ width: "fit-content", justifyContent: "center" }}
                  >
                    <Form.Label>Select Period : </Form.Label>
                    <Form.Control
                      ref={periodRef}
                      onChange={(e) => {
                        getGraphXlabels();
                      }}
                      as="select"
                      size="sm"
                      style={{
                        width: "auto",
                        padding: "3px 10px",
                        height: "auto",
                      }}
                    >
                      {period.map((item, index) => {
                        return (
                          <option key={index} value={index + 1}>
                            {item}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <label>Date Range : </label>
                  <Row>
                    <Col md={6}>
                      <Form.Row
                        style={{
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <Form.Label>From: </Form.Label>

                        <Form.Group style={{ justifyContent: "space-around" }}>
                          <Form.Control
                            ref={date_from_month}
                            size="sm"
                            as="select"
                            defaultValue="..."
                            style={{
                              width: "auto",
                              padding: "3px 10px",
                              height: "auto",
                            }}
                          >
                            {months.map((item, index) => {
                              return <option key={index}>{item}</option>;
                            })}
                          </Form.Control>
                        </Form.Group>

                        <Form.Group style={{ justifyContent: "space-around" }}>
                          <Form.Control
                            ref={date_from_year}
                            size="sm"
                            as="select"
                            defaultValue="..."
                            style={{
                              width: "auto",
                              padding: "3px 10px",
                              height: "auto",
                            }}
                          >
                            {year.map((item, index) => {
                              return <option key={index}>{item}</option>;
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                    </Col>
                    <Col md={6}>
                      <Form.Row
                        style={{
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <Form.Label>To: </Form.Label>

                        <Form.Group style={{ justifyContent: "space-around" }}>
                          <Form.Control
                            ref={date_to_month}
                            size="sm"
                            as="select"
                            defaultValue="*"
                            style={{
                              width: "auto",
                              padding: "3px 10px",
                              height: "auto",
                            }}
                          >
                            {months.map((item, index) => {
                              return <option key={index}>{item}</option>;
                            })}
                          </Form.Control>
                        </Form.Group>

                        <Form.Group style={{ justifyContent: "space-around" }}>
                          <Form.Control
                            ref={date_to_year}
                            size="sm"
                            as="select"
                            defaultValue="..."
                            style={{
                              width: "auto",
                              padding: "3px 10px",
                              height: "auto",
                            }}
                          >
                            {year.map((item, index) => {
                              return <option key={index}>{item}</option>;
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <label>Select Tags to show : </label>
              <br />
              {tagsComponent()}
              <br />
            </Col>
            <Col md={4}>
              <Row style={{ marginBottom: "3rem" }}>
                <Col>
                  <label>Search Contacts: </label>
                  <br />
                  <Form>
                    <Form.Control
                      ref={inputName}
                      size="sm"
                      type="text"
                      placeholder="Search"
                      style={{ borderRadius: "5px" }}
                    />
                  </Form>
                </Col>
                <Col>
                  <label>Compare : </label>
                  <Form>
                    <Form.Check custom type="checkbox" id="Yes" label="Yes" />
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    type="submit"
                    onClick={handleAppyClick}
                    variant="success"
                    size="sm"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleClearClick}
                    variant="danger"
                    size="sm"
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {singleContactVisible ? <> {singleContactScreen} </> :
        <>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Contacts Timeline</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row style={{ justifyContent: "center" }}>
                <Col md={10} sm={12} style={{ padding: 0 }}>
                  <div>
                    <div className="div2PDF">
                      <Line
                        data={graphdata}
                        options={{
                          legend: {
                            display: false,
                            position: "bottom",
                          },
                          maintainAspectRatio: false,
                        }}
                        width={100}
                        height={400}
                        ref={chartRef}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title as="h5">All Contacts</Card.Title>
              <span className="d-block m-t-5">
                {" "}
            Set above <code> Filters </code> or use Below <code> Search </code>{" "}
            text input
          </span>
            </Card.Header>
            <Card.Body>
              <ToolkitProvider
                keyField="id"
                data={columnData}
                columns={columnHeading}
                search
              >
                {(props) => (
                  <div>
                    <Row
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "2rem",
                      }}
                    >
                      <Col md={3} xsm={12} style={{ padding: "0" }}>
                        <h4 style={{ margin: "2rem" }}>Search Keywords : </h4>
                      </Col>
                      <Col md={3} xsm={12}>
                        <SearchBar
                          className="btn-md"
                          style={{}}
                          {...props.searchProps}
                        />
                      </Col>
                      <Col md={3} xsm={12} style={{ margin: "inherit" }}>
                        <ClearSearchButton
                          className="btn btn-outline-danger btn-sm"
                          {...props.searchProps}
                        />
                      </Col>
                    </Row>
                    <BootstrapTable
                      {...props.baseProps}
                      bootstrap4
                      bordered={false}
                      wrapperClasses="table-responsive"
                      className="table"
                      // filter={filterFactory()}
                      filterPosition="top"
                      striped
                      defaultSorted={[
                        {
                          dataField: "name",
                          order: "asc",
                        },
                      ]}
                    />
                    <Row
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "2rem",
                      }}
                    >
                      <ExportCSVButton
                        className="btn btn-outline-primary btn-sm"
                        {...props.csvProps}
                      >
                        Export CSV!!
                  </ExportCSVButton>
                    </Row>
                  </div>
                )}
              </ToolkitProvider>
            </Card.Body>
          </Card>
        </>
      }
    </Aux>
  );
}
