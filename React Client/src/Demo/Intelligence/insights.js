import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Form, ToggleButtonGroup, ToggleButton, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import Aux from "../../hoc/_Aux";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
// import Table from './table'
import './mystyle.css'

import ReactDOM from "react-dom";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { element } from 'prop-types';
const pdfConverter = require("jspdf");


let nameFilter;
let typeFilter;
let emailFilter;


export default function Documents({ match }) {
    //console.log("in Document : ", match)
    const [dataFromApi, setDatafromApi] = useState([])
    //eg: [..,{
    //     id: 1,
    //     name: "Advertising figures",
    //     type: "xlsx",
    //     dateRecieved: "22/06/2020",
    //     from: "samuel@adsrus.com ",
    //     tagList : ["hidden","important","direct","indirect","mutual"],
    // },..]

    const { SearchBar, ClearSearchButton } = Search;
    const { ExportCSVButton } = CSVExport;

    //console.log("component rendering")

    //-----------------------------------------------------------------------Set Filters Card--------------------------------

    //ref to filter search inputs
    const inputName = useRef(null);
    const inputType = useRef(null);
    const periodRef = useRef(0);
    const date_from_month = useRef();
    const date_from_year = useRef();
    const date_to_month = useRef();
    const date_to_year = useRef();

    //data
    const [months, useMonths] = useState(["...", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
    const [year, setYear] = useState(["...", "2018", "2019", "2020"]);
    const [period, setPeriod] = useState(["24h", "7d", "14d", "30d"])
    const [selectedOtherTagsValues, setSelectedOtherTagsValues] = useState(["",""])
    

    //-----------------------------------------------------------------------Table's colored Tags Column --------------------------------


    const [fixTags, setFixTags] = useState(["direct", "indirect", "hidden", "important", "mutual"])
    const [fixTagsColors, setFixTagsColors] = useState(["#1de9b6", "#04a9f5", "#f4c22b", "#f44236", "#37474f"])
    const [selectedFixTagsValues, setSelectedFixTagsValues] = useState([])

    const [otherTags, setOtherTags] = useState([])
    const [otherTagsColors, setOtherTagsColors] = useState(["#f20089", "#6a00f4", "#8ac926", "#ff4800", "#8ac926", "#1de9b6", "#04a9f5", "#f4c22b", "#f44236", "#37474f"])

    //other Tags Button style
    const otherTagsButtonstyle = (tag_name) => {
        let mycolor = otherTagsColors[otherTags.indexOf(tag_name)];
        return ({
            "color": mycolor,
            "borderColor": mycolor,
            "background": "#fff",
            "margin": "0.5rem", boxShadow: "5px 5px 3px rgba(46, 46, 46, 0.62)"
        })
    }
    const toggle_otherTagsButtonstyle = (e, tag_name) => {

        //let mycolor = otherTagsColors[otherTags.indexOf(tag_name)];

        //console.log("mycolor : ",hexToRgb(otherTagsColors[otherTags.indexOf(tag_name)].g))
        // e.target.style.color===mycolor ? e.target.style.color="#fff" : e.target.style.color=mycolor;
        // e.target.style.borderColor==mycolor ? e.target.style.borderColor="#fff" : e.target.style.borderColor=mycolor;
        // e.target.style.bgcolor!=="#fff" ? e.target.style.bgcolor="#fff" : e.target.style.bgcolor=mycolor;
        e.target.style.boxShadow !== "" ? e.target.style.boxShadow = "" : e.target.style.boxShadow = "5px 5px 3px rgba(46, 46, 46, 0.62)";
    }

    const fixTagsSelectionChange = (val) => { setSelectedFixTagsValues(val); }
    const OtherTagsSelectionChange = (val) => { setSelectedOtherTagsValues(val); }

    const [contactOptions,setContactOptions] = useState(["Samuel Gee","Ben Bolt","Sara Kana","Jess Gerry","Glen Archery","Steven Berger"])

    const set_otherTags = (doc) => {
        let temp_othertag = []
        for (let singleDoc of doc) {
            for (let tag of singleDoc.tagList) {
                if (!fixTags.includes(tag))
                    if (!temp_othertag.includes(tag))
                        temp_othertag.push(tag)
            }
        }
        setOtherTags(temp_othertag);
    }

    //table's tag style
    const tableTagStyle = (color) => {
        return ({
            "width": "0.8rem",
            "height": "0.8rem",
            "background": color,
            "borderRadius": "0.8rem",
            "margin": "0.1rem"
        })
    }

    const returnTagsColoredDivs = (tagList) => {
        return (
            <Row>
                {tagList.map((tag, index) => {
                    let tableTag_color = fixTags.includes(tag) ? fixTagsColors[fixTags.findIndex((each_tag) => each_tag === tag)] : otherTagsColors[otherTags.findIndex((each_tag) => each_tag === tag)]
                    return <div key={index} style={tableTagStyle(tableTag_color)} />
                })}
            </Row>
        )
    }

    // -----------------------------------------------------------------------Table ---------------------------------------------------------------

    const [columndata, setColumnData] = useState([
        {
            id: 1,
            name: "Advertising figures",
            type: "xlsx",
            dateRecieved: "22/06/2020",
            from: "samuel@adsrus.com ",
            tagList: ["hidden", "important", "direct", "indirect", "mutual"],
            link: "#",
        },
        {
            id: 2,
            name: "Ben's Resume",
            type: "wrd",
            dateRecieved: "05/02/2019",
            from: "ben@outlook.com",
            tagList: ["hidden", "important", "direct", "indirect", "mutual"],
            link: "#"
        },
        {
            id: 3,
            name: "Design Guide",
            type: "pdf",
            dateRecieved: "17/01/2020",
            from: "sara@gamefair.com",
            tagList: ["hidden", "important", "Private", "Company", "direct", "indirect", "mutual"],
            link: "#"
        },
        {
            id: 4,
            name: "Logo V2",
            type: "png",
            dateRecieved: "29/12/2019",
            from: "jess@tipstops.co.uk",
            tagList: ["hidden", "indirect", "mutual", "Private", "Need Action"],
            link: "#"
        },
        {
            id: 5,
            name: "Careers Guide 2020",
            type: "indd",
            dateRecieved: "14/09/2019",
            from: "glen@gmail.com",
            tagList: ["hidden", "important", "direct", "indirect", "Private", "Company",],
            link: "#"
        },
        {
            id: 6,
            name: "Shooting Script 1",
            type: "fadein",
            dateRecieved: "22/06/2020",
            from: "steven@berg.com",
            tagList: ["important", "direct", "indirect", "mutual", "Private", "Company", "Need Action", "Delete Later"],
            link: "#"
        }
    ]);

    useEffect(() => {
        set_otherTags(columndata);
    }, [])

    useEffect(() => {
        let newColumnDataWithTags = columndata.map((doc) => {
            let temp = returnTagsColoredDivs(doc.tagList)
            let downloadButton = <Button href="#" variant="link">Link</Button>
            return ({ ...doc, tags: temp, link: downloadButton })
        })
        setColumnData(newColumnDataWithTags);
        setDatafromApi(newColumnDataWithTags);
    }, [otherTags])


    //table headings
    const columnHeading = ([
        {
            dataField: 'name',
            text: "Document Name",
            //filter: textFilter({ placeholder : "Search...", getFilter: (filter) => { nameFilter = filter; } }),
            sort: true,
        },
        {
            dataField: 'type',
            text: "Document Type",
            sort: true,
            //filter: textFilter({ placeholder : "Search...", getFilter: (filter) => { typeFilter = filter; } })
        },
        {
            dataField: 'from',
            text: 'From',
            sort: true,
            // filter: textFilter({placeholder : "Search...", getFilter: (filter) => {emailFilter = filter;} })
        },
        {
            dataField: 'dateRecieved',
            text: 'Date Received',
            sort: true,
            sortFunc: (a, b, order, dataField, rowA, rowB) => {
                let A = a.split('/').reverse()
                let B = b.split('/').reverse()
                let tempA = []
                for (let i = 0; i < A.length; i++) {
                    tempA.push(Number(A[i]))
                }
                let tempB = []
                for (let i = 0; i < B.length; i++) {
                    tempB.push(Number(B[i]))
                }

                // console.log("a: " ,tempA)
                // console.log("b: " ,tempB)

                if (order === 'asc') {
                    if (tempA[0] > tempB[0]) return 1;
                    else if (tempA[0] < tempB[0]) return -1;
                    else {
                        if (tempA[1] > tempB[1]) return 1;
                        else if (tempA[1] < tempB[1]) return -1;
                        else {
                            if (tempA[2] > tempB[2]) return 1;
                            else if (tempA[2] < tempB[2]) return -1;
                        }
                    }
                }
                else if (order === 'desc') {
                    if (tempA[0] > tempB[0]) return -1;
                    else if (tempA[0] < tempB[0]) return 1;
                    else {
                        if (tempA[1] > tempB[1]) return -1;
                        else if (tempA[1] < tempB[1]) return 1;
                        else {
                            if (tempA[2] > tempB[2]) return -1;
                            else if (tempA[2] < tempB[2]) return 1;
                        }
                    }
                }

            }
        },
        {
            dataField: 'tags',
            text: 'Tags',
        },
        {
            dataField: 'link',
            text: 'Download',
        }
    ])

    // ----------------------------------------------------------------------timeLine Chart---------------------------------------

    //to be used for downloading graph
    const chartRef = useRef(null);

    const get_Documents_AsPer_Filters = () => {

        let filtered_docs = columndata;

        //filtering by filter doc name
        if (inputName.current.value !== "")
            filtered_docs = filtered_docs.filter(doc => doc.name.toLowerCase().includes(inputName.current.value));
        //console.log("filtered_docs name: ", filtered_docs);

        //filtering by filter doc type
        if (inputType.current.value !== "")
            filtered_docs = filtered_docs.filter(doc => doc.type.toLowerCase().includes(inputType.current.value));
        //console.log("filtered_docs type: ", filtered_docs);

        //filtering by filter's "From" date
        if (date_from_month.current.value !== "..." && date_from_year.current.value !== "...") {
            filtered_docs = filtered_docs.filter(doc => {
                let docDatesArray = doc.dateRecieved.split("/");//eg:[1,12,2020]
                if (Number(docDatesArray[2]) < Number(date_from_year.current.value))
                    return false;
                if (Number(docDatesArray[2]) > Number(date_from_year.current.value))
                    return true;
                else if (Number(docDatesArray[2]) === Number(date_from_year.current.value)) {
                    return Number(docDatesArray[1]) >= months.indexOf(date_from_month.current.value)
                }
            }
            );
        }
        //console.log("filtered_docs From: ", filtered_docs);
        //filtering by filter's "To" date
        if (date_to_month.current.value !== "..." && date_to_year.current.value !== "...") {
            filtered_docs = filtered_docs.filter(doc => {
                let docDatesArray = doc.dateRecieved.split("/");//eg:[1,12,2020]
                if (Number(docDatesArray[2]) > Number(date_to_year.current.value))
                    return false;
                if (Number(docDatesArray[2]) < Number(date_to_year.current.value))
                    return true;
                else if (Number(docDatesArray[2]) === Number(date_to_year.current.value)) {
                    return Number(docDatesArray[1]) <= months.indexOf(date_to_month.current.value)
                }
            }
            );
        }
        //console.log("filtered_docs to: ", filtered_docs);

        //filtering by filter's fix "tags list"
        if (selectedFixTagsValues.length > 0) {
            for (let tagSelectedValue of selectedFixTagsValues) {
                filtered_docs = filtered_docs.filter(doc => doc.tagList.includes(fixTags[tagSelectedValue - 1]));
            }
        }
        //console.log("filtered_docs fix: ", filtered_docs);
        //filtering by filter's custom "tags list"
        if (selectedOtherTagsValues.length > 0) {
            // console.log("otherTags : ",otherTags,"values  : ",selectedOtherTagsValues);
            for (let tagSelectedValue of selectedOtherTagsValues) {
                filtered_docs = filtered_docs.filter(doc => doc.tagList.includes(otherTags[tagSelectedValue - 1]));
            }
        }

        //console.log("filtered_docs other: ",filtered_docs);
        setColumnData(filtered_docs);

    }

    //default Y labels
    const [graphYLabels1, setGraphYLabels1] = useState([65, 40, 65, 59, 80, 81, 56, 56, 55, 40, 65, 59, 80, 81, 56, 19, 56, 55, 40, 55, 55, 40, 55, 40, 65, 59, 80, 81, 56, 55, 40])
    const [graphYLabels2, setGraphYLabels2] = useState([56, 19, 56, 65, 59, 80, 81, 56, 19, 56, 65, 40, 65, 59, 80, 81, 81, 56, 19, 56, 65, 40, 65, 59, 80, 55, 40, 55, 40, 65, 59, 80, 81, 40, 55])
    const [graphYLabels3, setGraphYLabels3] = useState([50, 55, 40, 65, 59, 80, 81, 56, 91, 56, 55, 55, 40, 65, 59, 56, 19, 56, 65, 55, 40, 19, 56, 65, 40, 65, 59, 80, 81, 19, 30, 46])
    
    //calculate Y labels on changing period value (i.e X Labels)
    const setGraphYLabels_AsPer_period = (docs) => {
        const x_period = Number(periodRef.current.value);

    }

    //default labels
    const [graphdata, setGraphData] = useState({
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

    //updating labels of "graphdata" on "period" change
    const getGraphXlabels = () => {
        let arr = [];
        let noOfDays = 0;
        switch (Number(periodRef.current.value)) {
            case 1: { noOfDays = 1; break; }
            case 2: { noOfDays = 7; break; }
            case 3: { noOfDays = 14; break; }
            case 4: { noOfDays = 30; break; }
            default: { noOfDays = 0; }
        }

        for (let i = noOfDays; i >= 0; i--) {
            arr.push(i + "d")
        }
        setGraphData({ ...graphdata, labels: arr })
        setGraphdataEmailVolume({ ...graphdataEmailVolume, labels: arr })
    }

    useEffect(() => {
        //getGraphXlabels()
    }, [graphdata])

    // --------------------------------------------------------------------------Apply button and clear button------------------------

    //Clear filters
    const handleClearClick = () => {

        setColumnData(dataFromApi)
        // nameFilter('');
        // typeFilter('');
        inputName.current.value = ""
        inputType.current.value = ""
        periodRef.current.value = "1"
        date_from_month.current.value = "..."
        date_from_year.current.value = "..."
        date_to_month.current.value = "..."
        date_to_year.current.value = "..."
        getGraphXlabels();
    };

    //Apply filters
    const handleAppyClick = () => {
        setColumnData(dataFromApi)
        //console.log("selectedTagsColors : ",selectedTagsColors)
        get_Documents_AsPer_Filters();
        // console.log(Number(periodRef.current.value))
        // nameFilter(inputName.current.value);
        // typeFilter(inputType.current.value);
        // inputName.current.value = ""
        // inputType.current.value = ""
    };

    return (
        <>
            <Aux>
                <Card>
                    <Card.Header>
                        <Card.Title as="h5">Set Filters</Card.Title>
                        {/* <span className="d-block m-t-5">use props <code>hover</code> with <code>Table</code> component</span> */}
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={8} >
                                <Row style={{ "justifyContent": "space-between" }} >
                                    <Col md={4}>
                                        <Form.Group controlId="exampleForm.ControlSelect1" style={{ "width": "fit-content", "justifyContent": "center" }} >
                                            <Form.Label>Select Period : </Form.Label>
                                            <Form.Control ref={periodRef} onChange={(e) => { getGraphXlabels() }} as="select" size="sm" style={{ "width": "auto", "padding": "3px 10px", "height": "auto" }}>
                                                {(period.map((item, index) => {
                                                    return (
                                                        <option key={index} value={index + 1}>{item}</option>
                                                    )
                                                }))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={8}>
                                        <label>Date Range : </label>
                                        <Row>
                                            <Col md={6} >
                                                <Form.Row style={{ "justifyContent": "space-around", "alignItems": "center" }} >
                                                    <Form.Label>From: </Form.Label>

                                                    <Form.Group style={{ "justifyContent": "space-around" }} >
                                                        <Form.Control ref={date_from_month} size="sm" as="select" defaultValue="..." style={{ "width": "auto", "padding": "3px 10px", "height": "auto" }}>
                                                            {(months.map((item, index) => {
                                                                return (
                                                                    <option key={index} >{item}</option>
                                                                )
                                                            }))}
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group style={{ "justifyContent": "space-around" }} >
                                                        <Form.Control ref={date_from_year} size="sm" as="select" defaultValue="..." style={{ "width": "auto", "padding": "3px 10px", "height": "auto" }}>
                                                            {(year.map((item, index) => {
                                                                return (
                                                                    <option key={index} >{item}</option>
                                                                )
                                                            }))}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Form.Row>
                                            </Col>
                                            <Col md={6} >
                                                <Form.Row style={{ "justifyContent": "space-around", "alignItems": "center" }} >
                                                    <Form.Label>To: </Form.Label>

                                                    <Form.Group style={{ "justifyContent": "space-around" }} >
                                                        <Form.Control ref={date_to_month} size="sm" as="select" defaultValue="*" style={{ "width": "auto", "padding": "3px 10px", "height": "auto" }}>
                                                            {(months.map((item, index) => {
                                                                return (
                                                                    <option key={index}>{item}</option>
                                                                )
                                                            }))}
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group style={{ "justifyContent": "space-around" }} >
                                                        <Form.Control ref={date_to_year} size="sm" as="select" defaultValue="..." style={{ "width": "auto", "padding": "3px 10px", "height": "auto" }}>
                                                            {(year.map((item, index) => {
                                                                return (
                                                                    <option key={index}>{item}</option>
                                                                )
                                                            }))}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Form.Row>
                                            </Col>
                                        </Row>
                                    </Col>

                                </Row>

                                <label>Select Tags to show : </label><br />
                                <ToggleButtonGroup type="checkbox" value={selectedFixTagsValues} onChange={fixTagsSelectionChange}>
                                    <ToggleButton style={{ "margin": "0.5rem" }} variant="outline-success" value={1} size="sm" >Direct (To)</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup type="checkbox" value={selectedFixTagsValues} onChange={fixTagsSelectionChange}>
                                    <ToggleButton style={{ "margin": "0.5rem" }} variant="outline-primary" value={2} size="sm">InDirect (Cc)</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup type="checkbox" value={selectedFixTagsValues} onChange={fixTagsSelectionChange}>
                                    <ToggleButton style={{ "margin": "0.5rem" }} variant="outline-warning" value={3} size="sm">Hidden (Bcc)</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup type="checkbox" value={selectedFixTagsValues} onChange={fixTagsSelectionChange}>
                                    <ToggleButton style={{ "margin": "0.5rem" }} variant="outline-danger" value={4} size="sm">Important</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup type="checkbox" value={selectedFixTagsValues} onChange={fixTagsSelectionChange}>
                                    <ToggleButton style={{ "margin": "0.5rem" }} variant="outline-dark" value={5} size="sm">Mutual</ToggleButton>
                                </ToggleButtonGroup>
                                <br />

                                {(otherTags.map((tag_name, index) => {
                                    return (
                                        <ToggleButtonGroup key={index} type="checkbox" value={selectedOtherTagsValues} onChange={OtherTagsSelectionChange}>
                                            <ToggleButton style={otherTagsButtonstyle(tag_name)} onClick={(e) => { toggle_otherTagsButtonstyle(e, tag_name) }} value={index + 1} size="sm" >{tag_name}</ToggleButton>
                                        </ToggleButtonGroup>)
                                }))}

                            </Col>
                            <Col md={4} style={{ "background": "white" }}>
                                <Col>
                                    <label>Select Contact : </label><br />
                                    <Form.Control as="select" multiple style={{ height: "100%" }}>
                                        {contactOptions.map((name,index)=>{
                                            return(
                                                <option key={index} value={index}>{name}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </Col>
                                <Col style={{ justifyContent: "space-evenly", alignContent: "space-evenly" }}  >
                                    <Row style={{justifyContent:"center",alignItems:"center",marginTop:"1rem"}}>
                                        <Form.Label style={{margin:"1rem"}}>Compare :</Form.Label>
                                        <Form>
                                            <Form.Check
                                                custom
                                                type="checkbox"
                                                id="Yes"
                                                label="Yes"
                                            />
                                        </Form>
                                        <div style={{margin:"auto"}}>
                                            <Button type="submit" onClick={handleAppyClick} variant="success" size="sm" >Apply Filters</Button>
                                            <Button type="submit" onClick={handleClearClick} variant="danger" size="sm" >Clear Filters</Button>
                                        </div>
                                    </Row>
                                </Col>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
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
                            <Col md={10} sm={12} style={{ "padding": 0 }}>
                                <div>
                                    <div className="div2PDF">
                                        <Line
                                            data={graphdata}
                                            options={{
                                                legend: {
                                                    display: true,
                                                    position: 'bottom'
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
                        <Card.Title as="h5">Email Volume Timeline</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Row style={{ "justifyContent": "center" }}>
                            <Col md={10} sm={12} style={{ "padding": 0 }}>
                                <div>
                                    <div className="div2PDF">
                                        <Line
                                            data={graphdataEmailVolume}
                                            options={{
                                                legend: {
                                                    display: true,
                                                    position: 'bottom'
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

            </Aux>
        </>

    )

}
