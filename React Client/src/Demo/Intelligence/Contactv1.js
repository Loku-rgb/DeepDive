import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Form, ToggleButtonGroup, ToggleButton, Container } from 'react-bootstrap';
import {Link} from 'react-router-dom'
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


export default function Documents() {
    const [dataFromApi,setDatafromApi] = useState([])
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
    
    // console.log("component rendering")

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
    

    //-----------------------------------------------------------------------Table's colored Tags Column --------------------------------
    
    
    const [fixTags,setFixTags] = useState(["direct","indirect","hidden","important","mutual"])
    const [fixTagsColors, setFixTagsColors] = useState(["#1de9b6", "#04a9f5", "#f4c22b", "#f44236", "#37474f"])
    const [selectedFixTagsValues,setSelectedFixTagsValues] = useState([])

    const [otherTags,setOtherTags] = useState([])
    const [otherTagsColors, setOtherTagsColors] = useState(["#f20089", "#6a00f4", "#8ac926", "#ff4800", "#8ac926","#1de9b6", "#04a9f5", "#f4c22b", "#f44236", "#37474f"])
    const [selectedOtherTagsValues,setSelectedOtherTagsValues] = useState([])

    //other Tags Button style
    const otherTagsButtonstyle =(tag_name)=>{
        let mycolor = otherTagsColors[otherTags.indexOf(tag_name)];
        return ({ 
            "color":mycolor,
            "borderColor":mycolor,
            "background": "#fff",
            "margin": "0.5rem", boxShadow: "5px 5px 3px rgba(46, 46, 46, 0.62)" 
        })
    }
    const toggle_otherTagsButtonstyle = (e,tag_name)=>{

        //let mycolor = otherTagsColors[otherTags.indexOf(tag_name)];

        //console.log("mycolor : ",hexToRgb(otherTagsColors[otherTags.indexOf(tag_name)].g))
        // e.target.style.color===mycolor ? e.target.style.color="#fff" : e.target.style.color=mycolor;
        // e.target.style.borderColor==mycolor ? e.target.style.borderColor="#fff" : e.target.style.borderColor=mycolor;
        // e.target.style.bgcolor!=="#fff" ? e.target.style.bgcolor="#fff" : e.target.style.bgcolor=mycolor;
        e.target.style.boxShadow!=="" ? e.target.style.boxShadow="" : e.target.style.boxShadow="5px 5px 3px rgba(46, 46, 46, 0.62)";
    }

    const fixTagsSelectionChange = (val) => {setSelectedFixTagsValues(val) ; }
    const OtherTagsSelectionChange = (val) => { setSelectedOtherTagsValues(val) ; }
  
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

    const tableToneStyle = (color) => {
        return ({
            "width": "0.8rem",
            "height": "0.8rem",
            "background": color,
            "borderRadius": "0.8rem",
            "margin": "0.1rem",
            border: '1px solid grey'
        })
    }
    
    const returnToneColoredDivs = (toneArr) => {
        var color;
        let div;
        let arrayofdivs = (tonecolor) =>{
            let arr = [];
            for(let i=0;i<3;i++){
                if(i<Number(toneArr[1])) arr.push(<div key={i} style={tableToneStyle(tonecolor)}/>) 
                else arr.push(<div key={i} style={tableToneStyle("white")}/>)
            }
            return arr;
        }
        switch (toneArr[0]) {
            case "positive": {
                color = "green";
                div = <Row style={{justifyContent:"start",alignItems: "center"}}><span>👍 Positive </span>{arrayofdivs(color)}</Row>;
                break;
            }
            case "neutral": { 
                color = "powderblue"; 
                div = <Row style={{justifyContent:"start",alignItems: "center"}}><span>👌 Neutral </span>{arrayofdivs(color)}</Row>; 
                break; 
            }
            case "tricky": { 
                color = "orange"; 
                div = <Row style={{justifyContent:"start",alignItems: "center"}}><span>👏 Tricky </span>{arrayofdivs(color)}</Row>; 
                break; 
            }

            default: { color = "black" }
        }
        return div
    }

    // -----------------------------------------------------------------------Table ---------------------------------------------------------------
    const [columnData,setColumnData] = useState([
        {
            id: 1,
            name: "Samuel Gee",
            companyTitle: "samuel@adsrus.com",
            email: "samuel@adsrus.com ",
            tagList : ["hidden","important","direct","indirect","mutual"],
            tone : ["positive","1"],
            view : <Button variant="light" href="#" size="sm">View</Button>
        },
        {
            id: 2,
            name: "Ben Bolt",
            companyTitle: "No company",
            email: "ben@outlook.com",
            tagList : ["hidden","important","direct","indirect","mutual"],
            tone : ["neutral","2"],
            view : <Button variant="light" href="#" size="sm">View</Button>
        },
        {
            id: 3,
            name: "Sara Kana",
            companyTitle: "Game fair, Marketing S...",
            email: "sara@gamefair.com",
            tagList : ["hidden","important","direct","indirect","mutual"],
            tone : ["tricky","3"],
            view : <Button variant="light" href="#" size="sm">View</Button>
        },
        {
            id: 4,
            name: "Jess Gerry",
            companyTitle: "Tips tops, Head of HR",
            email: "jess@tipstops.co.uk",
            tagList : ["hidden","indirect","mutual","Private","Need Action"],
            tone : ["positive","3"],
            view : <Button variant="light" href="#" size="sm">View</Button>
        },
        {
            id: 5,
            name: "Glen Archery",
            companyTitle: "Glens mowing, CEO",
            email: "glen@gmail.com",
            tagList : ["hidden","important","direct","indirect","Private","Company",],
            tone : ["neutral","1"],
            view : <Button variant="light" href="#" size="sm">View</Button>
        },
        {
            id: 6,
            name: "Steven Berger",
            companyTitle: "Steven's Burgers, Chef",
            email: "steven@berg.com",
            tagList : ["important","direct","indirect","mutual","Private","Company","Need Action","Delete Later"],
            tone : ["tricky","2"],
            view : <Button variant="light" href="#" size="sm">View</Button>
        }
    ]);

    //setting available custom tags
    useEffect(() => {
        set_otherTags(columnData);
        // console.log("[] :",otherTags)
    }, [])

    let [newColumnDataWithTagsToneLinks,setNewColumnDataWithTagsToneLinks] = useState()

    //adding tones and link
    useEffect(() => {
        let newColumnDataWith_Tone_Link = dataFromApi.map((doc) => {
            let temp2 = returnToneColoredDivs(doc.tone)
            let downloadButton = <Button style={{alignSelf:"flex-start"}} href="#" variant="link" size="sm">Link</Button>
            return ({ ...doc, tone: temp2, link: downloadButton })
        })
        //console.log("[dataFromApi] newColumnDataWith_Tone_Link : ",newColumnDataWith_Tone_Link)
        setNewColumnDataWithTagsToneLinks(newColumnDataWith_Tone_Link)
        setColumnData(newColumnDataWith_Tone_Link);

    }, [dataFromApi])

    //adding tags
    useEffect(() => {
        let newColumnData = columnData.map((doc) => {
            let temp1 = returnTagsColoredDivs(doc.tagList)
            return ({ ...doc, tags: temp1 })
        })
        //console.log("[otherTags]) newColumnData : ",newColumnData)
        setColumnData(newColumnData);
        setDatafromApi(newColumnData);
    }, [otherTags])

    useEffect(()=>{
        //console.log("[newColumnDataWithTagsToneLinks] newColumnDataWithTagsToneLinks  : ", newColumnDataWithTagsToneLinks)
    },[newColumnDataWithTagsToneLinks])


    //table headings
    const columnHeading = ([
        {
            dataField: 'name',
            text: "Name",
            //filter: textFilter({ placeholder : "Search...", getFilter: (filter) => { nameFilter = filter; } }),
            sort: true,
        },
        {
            dataField: 'email',
            text: "Email",
            sort: true,
            //filter: textFilter({ placeholder : "Search...", getFilter: (filter) => { typeFilter = filter; } })
        },
        {
            dataField: 'companyTitle',
            text: 'Company & Title',
            sort: true,
           // filter: textFilter({placeholder : "Search...", getFilter: (filter) => {emailFilter = filter;} })
        },
        {
            dataField: 'tone',
            text: 'Tone',
        },
        {
            dataField: 'tags',
            text: 'Tags',
        },
        {
            dataField: 'view',
            text: 'View',
        },
        {
            dataField: 'link',
            text: 'Link',
        }
        
    ])

    // ----------------------------------------------------------------------timeLine Chart---------------------------------------
    
    //to be used for downloading graph
    const chartRef = useRef(null);

    const get_Number_Of_Documents_AsPer_Filters = () => {
        
        let filtered_docs = newColumnDataWithTagsToneLinks;

        //filtering by filter doc name
        if (inputName.current.value !== "")
            filtered_docs = filtered_docs.filter(doc => doc.name.toLowerCase().includes(inputName.current.value));
        //console.log("filtered_docs name: ", filtered_docs);

        //filtering by filter's "From" date
        // if (date_from_month.current.value !== "..." && date_from_year.current.value !== "...")
        // {
        //     filtered_docs = filtered_docs.filter(doc =>{
        //         let docDatesArray = doc.dateRecieved.split("/");//eg:[1,12,2020]
        //         if (Number(docDatesArray[2]) < Number(date_from_year.current.value))
        //             return false;
        //         if (Number(docDatesArray[2]) > Number(date_from_year.current.value))
        //             return true;
        //         else if (Number(docDatesArray[2]) === Number(date_from_year.current.value)) {
        //             return Number(docDatesArray[1]) >= months.indexOf(date_from_month.current.value)
        //         }}
        //     );
        // }
        //console.log("filtered_docs From: ", filtered_docs);

        //filtering by filter's "To" date
        // if (date_to_month.current.value !== "..." && date_to_year.current.value !== "...")
        // {
        //     filtered_docs = filtered_docs.filter(doc =>{
        //         let docDatesArray = doc.dateRecieved.split("/");//eg:[1,12,2020]
        //         if (Number(docDatesArray[2]) > Number(date_to_year.current.value))
        //             return false;
        //         if (Number(docDatesArray[2]) < Number(date_to_year.current.value))
        //             return true;
        //         else if (Number(docDatesArray[2]) === Number(date_to_year.current.value)) {
        //             return Number(docDatesArray[1]) <= months.indexOf(date_to_month.current.value)
        //         }}
        //     );
        // }
        //console.log("filtered_docs to: ", filtered_docs);

        //filtering by filter's fix "tags list"
        if(selectedFixTagsValues.length>0)
        {
            for(let tagSelectedValue of selectedFixTagsValues){
                filtered_docs = filtered_docs.filter(doc => doc.tagList.includes(fixTags[tagSelectedValue-1]));
            }
        }
        //console.log("filtered_docs fix: ", filtered_docs);
        
        //filtering by filter's custom "tags list"
        if(selectedOtherTagsValues.length>0)
        {
           // console.log("otherTags : ",otherTags,"values  : ",selectedOtherTagsValues);
            for(let tagSelectedValue of selectedOtherTagsValues){
                filtered_docs = filtered_docs.filter(doc => doc.tagList.includes(otherTags[tagSelectedValue-1]));
            }
        }

        //console.log("filtered_docs other: ",filtered_docs);
        setColumnData(filtered_docs);
        
    }
    //default Y labels
    const [graphYLabels,setGraphYLabels] = useState([65, 40,65, 59, 80, 81, 56, 56, 55, 40,65, 59, 80, 81, 56,1, 56, 55, 40, 55, 40, 40,65, 59, 80, 81, 56, 55, 40, 55, 40,65, 59, 80, 81, 56, 55, 40])
    
    //calculate Y labels on changing period value (i.e X Labels)
    const setGraphYLabels_AsPer_period = (docs)=>{
        const x_period = Number(periodRef.current.value);

    }
    //default labels
    const [graphdata,setGraphData] = useState({
        labels: ["01d","0d"],
        datasets: [{
            label: 'No. of Contacts',
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
            data: graphYLabels
        }]
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
        setGraphData({...graphdata,labels:arr})
    }
    // --------------------------------------------------------------------------Apply button and clear button------------------------

    //Clear filters
    const handleClearClick = () => {
        setColumnData(newColumnDataWithTagsToneLinks)
        // nameFilter('');
        // typeFilter('');
        inputName.current.value = ""
        //inputType.current.value = ""
        periodRef.current.value = "1"
        date_from_month.current.value = "..."
        date_from_year.current.value = "..."
        date_to_month.current.value = "..."
        date_to_year.current.value = "..."
        getGraphXlabels();
    };

    //Apply filters
    const handleAppyClick = () => {
        setColumnData(newColumnDataWithTagsToneLinks)
        get_Number_Of_Documents_AsPer_Filters();
        // nameFilter(inputName.current.value);
        // typeFilter(inputType.current.value);
        // inputName.current.value = ""
        // inputType.current.value = ""
    };

    return (
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
                                            <Form.Control ref={periodRef} onChange={(e)=>{getGraphXlabels()}} as="select" size="sm" style={{ "width": "auto", "padding": "3px 10px", "height": "auto" }}>
                                                {(period.map((item,index) => {
                                                    return (
                                                        <option key={index} value={index+1}>{item}</option>
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
                                                            {(months.map((item,index) => {
                                                                return (
                                                                    <option key={index} >{item}</option>
                                                                )
                                                            }))}
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group style={{ "justifyContent": "space-around" }} >
                                                        <Form.Control ref={date_from_year} size="sm" as="select" defaultValue="..." style={{ "width": "auto", "padding": "3px 10px", "height": "auto" }}>
                                                            {(year.map((item,index)=> {
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
                                                            {(months.map((item,index) => {
                                                                return (
                                                                    <option key={index}>{item}</option>
                                                                )
                                                            }))}
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group style={{ "justifyContent": "space-around" }} >
                                                        <Form.Control ref={date_to_year} size="sm" as="select" defaultValue="..." style={{ "width": "auto", "padding": "3px 10px", "height": "auto" }}>
                                                            {(year.map((item,index) => {
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
                                    <ToggleButton style={{"margin": "0.5rem"}} variant="outline-success" value={1} size="sm" >Direct (To)</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup type="checkbox" value={selectedFixTagsValues} onChange={fixTagsSelectionChange}>
                                    <ToggleButton style={{"margin": "0.5rem"}} variant="outline-primary" value={2} size="sm">InDirect (Cc)</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup type="checkbox" value={selectedFixTagsValues} onChange={fixTagsSelectionChange}>
                                    <ToggleButton style={{"margin": "0.5rem"}} variant="outline-warning" value={3} size="sm">Hidden (Bcc)</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup type="checkbox" value={selectedFixTagsValues} onChange={fixTagsSelectionChange}>
                                    <ToggleButton style={{"margin": "0.5rem"}} variant="outline-danger" value={4} size="sm">Important</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup type="checkbox" value={selectedFixTagsValues} onChange={fixTagsSelectionChange}>
                                    <ToggleButton style={{"margin": "0.5rem"}} variant="outline-dark" value={5} size="sm">Mutual</ToggleButton>
                                </ToggleButtonGroup>
                                <br />
                                
                                    {(otherTags.map((tag_name, index) => {
                                        return(
                                        <ToggleButtonGroup key={index} type="checkbox" value={selectedOtherTagsValues} onChange={OtherTagsSelectionChange}>
                                            <ToggleButton style={otherTagsButtonstyle(tag_name)}   onClick={(e)=>{toggle_otherTagsButtonstyle(e,tag_name)}} value={index+1} size="sm" >{tag_name}</ToggleButton>
                                        </ToggleButtonGroup>)
                                    }))}
                                
                            </Col>
                            <Col md={4} >
                                <Row style={{marginBottom:"3rem"}}>
                                    <Col>
                                        <label>Search Contacts: </label><br />
                                        <Form>
                                            <Form.Control ref={inputName} size="sm" type="text" placeholder="Search" style={{ "borderRadius": "5px" }} />
                                        </Form>
                                    </Col>
                                    <Col>
                                        <label>Compare : </label>
                                        <Form>
                                            <Form.Check
                                                custom
                                                type="checkbox"
                                                id="Yes"
                                                label="Yes"
                                            />
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col >
                                        <Button type="submit" onClick={handleAppyClick} variant="success" size="sm" >Apply Filters</Button>
                                        <Button type="submit" onClick={handleClearClick} variant="danger" size="sm" >Clear Filters</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header>
                        <Card.Title as="h5">Contacts Timeline</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Row style={{"justifyContent":"center"}}>
                            <Col md={10} sm={12} style={{ "padding": 0 }}>
                                <div>
                                    <div className="div2PDF">
                                        <Line
                                            data={graphdata}
                                            options={{
                                                legend: {
                                                    display: false,
                                                    position: 'bottom'
                                                },
                                                maintainAspectRatio: false
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
                        <span className="d-block m-t-5"> Set above <code> Filters </code> or use Below <code> Search </code> text input</span>
                    </Card.Header>
                    <Card.Body >
                        <ToolkitProvider
                            keyField='id'
                            data={columnData}
                            columns={columnHeading}
                            search
                        >
                            {
                                props => (
                                    <div>
                                        <Row style={{ "justifyContent": "center","alignItems":"center", "margin": "2rem" }}>
                                            <Col md={3} xsm={12} style={{ "padding": "0" }}><h4 style={{ "margin": "2rem" }}>Search Keywords : </h4></Col>
                                            <Col md={3} xsm={12}><SearchBar className="btn-md" style={{}} {...props.searchProps} /></Col>
                                            <Col md={3} xsm={12} style={{ "margin": "inherit" }}><ClearSearchButton className="btn btn-outline-danger btn-sm" {...props.searchProps} /></Col>
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
                                            defaultSorted={[{
                                                dataField: 'name',
                                                order: 'asc'
                                            }]}
                                            
                                        />
                                        <Row style={{ "justifyContent": "center", "alignItems": "center", "margin": "2rem" }}><ExportCSVButton className="btn btn-outline-primary btn-sm" {...props.csvProps}>Export CSV!!</ExportCSVButton></Row>

                                    </div>
                                )
                            }
                        </ToolkitProvider>
                    </Card.Body>
                </Card>
            </Aux>
 
    )

}
