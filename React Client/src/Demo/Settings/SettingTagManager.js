import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Card, Form, Button, InputGroup, FormControl, DropdownButton, Dropdown, Alert } from 'react-bootstrap';
import { ReactDOM } from 'react-dom'
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';

import Aux from "../../hoc/_Aux";

export default function TagManager() {
    //console.log("rendering")

    const { SearchBar, ClearSearchButton } = Search;
    const { ExportCSVButton } = CSVExport;

    const [selfDetails, setSelfDetails] = useState({
        firstName: "Craig",
        lastName: "Thomas",
        email: "ct@gmail.com",
        company: "CRT Importing",
        number: "+61 490 5643 771",
        position: "Manager",
        password: "1234",
        twoFactorSecurity: true
    })

    const [columndata, setColumnData] = useState([
        {
            id: 1,
            date: "12/06/2020",
            action: "billing.invoice",
            user: "craig.thomas",
            ipAddress: "180.152.94.66",
        },
        {
            id: 2,
            date: "01/06/2020",
            action: "add_new.team_member",
            user: "scott.thomas",
            ipAddress: "180.325.74.22",
        },
        {
            id: 3,
            date: "01/05/2020",
            action: "update.password",
            user: "craig.thomas",
            ipAddress: "180.152.94.66",
        },
        {
            id: 4,
            date: "01/06/2020",
            action: "add_new.team_member",
            user: "craig.thomas",
            ipAddress: "180.152.94.66",
        },
        {
            id: 5,
            date: "01/05/2020",
            action: "update.settings_first_name",
            user: "craig.thomas",
            ipAddress: "180.152.94.66",
        },
        {
            id: 6,
            date: "01/04/2020",
            action: "update.settings_position",
            user: "craig.thomas",
            ipAddress: "180.152.94.66",
        },
        {
            id: 7,
            date: "01/04/2020",
            action: "billing.invoice",
            user: "craig.thomas",
            ipAddress: "180.152.94.66",
        }
    ]);

    //table headings
    const columnHeading = ([
        {
            dataField: 'date',
            text: 'Date',
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
            dataField: 'action',
            text: "Action",
            sort: true,
            //filter: textFilter({ placeholder : "Search...", getFilter: (filter) => { typeFilter = filter; } })
        },
        {
            dataField: 'user',
            text: 'User',
            sort: true,
            // filter: textFilter({placeholder : "Search...", getFilter: (filter) => {emailFilter = filter;} })
        },

        {
            dataField: 'ipAddress',
            text: 'Ip Address',
            sort: true,
        }
    ])

    let firstNameInput = useRef("");;
    const lastNameInput = useRef("");
    const emailInput = useRef("");
    const companyInput = useRef("");
    const numberInput = useRef("");
    const positionInput = useRef("");
    const passwordInput = useRef("");
    const changePasswordInput = useRef("");
    const reEnterPasswordInput = useRef("");
    const twoFactorSecurityInput = useRef("");

    const otherTagRef1 = useRef("");
    const otherTagRef2 = useRef("");
    const otherTagRef3 = useRef("");
    const otherTagRef4 = useRef("");
    const otherTagRef5 = useRef("");


    const [msgAlert, setMsgAlert] = useState("")
    const [variantAlert, setVariantAlert] = useState("")
    const [showAlert, setShowAlert] = useState(false);

    const [otherTagsText, setOtherTagsText] = useState([]);
    const [otherTagsColor, setOtherTagsColor] = useState(["#0ABDE3", "#FF4848", "#218F76", "#2475B0", "#EA7773"])

    const [permanentTagsText, setPermanentTagsText] = useState(["Direct (To)", "Indirect (Cc)", "Hidden (Cc)", "Important", "Mutual"])
    const [permanentTagsColor, setPermanentTagsColor] = useState(["#1de9b6", "#fc9003", "#f4c22b", "#f44236", "#37474f"])

    const [otherTagsUpdated, setOtherTagUpdated] = useState();

    const returnOtherTagsWithStyle = (indexes) => {
        //console.log("got  : ", otherTagsText)
        setOtherTagUpdated(otherTagsText.map((text, index) => {
            return (
                <div style={TagStyle((otherTagsColor[indexes[index]]))} key={index}>{text}</div>
            )
        }))
    }

    const handleOtherTagSubmit = () => {

        let texts = []
        let indexes = []
        if (otherTagRef1.current.value !== "") {
            texts = otherTagsText;
            texts.push(otherTagRef1.current.value)
            indexes.push(0)
            otherTagRef1.current.value = ""
        }
        if (otherTagRef2.current.value !== "") {
            texts = otherTagsText;
            texts.push(otherTagRef2.current.value)
            indexes.push(1)
            otherTagRef2.current.value = ""
        }
        if (otherTagRef3.current.value !== "") {
            texts = otherTagsText;
            texts.push(otherTagRef3.current.value)
            indexes.push(2)
            otherTagRef3.current.value = ""
        }
        if (otherTagRef4.current.value !== "") {
            texts = otherTagsText;
            texts.push(otherTagRef4.current.value)
            indexes.push(3)
            otherTagRef4.current.value = ""
        }
        if (otherTagRef5.current.value !== "") {
            texts = otherTagsText;
            texts.push(otherTagRef5.current.value)
            indexes.push(4)
            otherTagRef5.current.value = ""
        }
        //console.log(otherTagsText)
        setOtherTagsText(texts)
        returnOtherTagsWithStyle(indexes)
    }

    useEffect(() => {
        // console.log("calling from useEffect")
        returnOtherTagsWithStyle();
    }, [otherTagsText])

    const handleSubmit = (event) => {
        event.preventDefault()

        console.log("got tempDetails  : ", selfDetails)

        let tempDetails = selfDetails;
        let tempMsgAlert = "Saved";
        let tempVariantAlert = "success";

        if (passwordInput.current.value !== tempDetails.password) {
            passwordInput.current.focus();
            tempMsgAlert = "Wrong Password";
            tempVariantAlert = "danger";
        }
        else {
            passwordInput.current.value = "";

            if (changePasswordInput.current.value !== "" || reEnterPasswordInput.current.value !== "") {

                //console.log('here in  if(changePassword.current.value!=="" || reEnterPassword.current.value!=="")')
                if (changePasswordInput.current.value !== reEnterPasswordInput.current.value) {
                    reEnterPasswordInput.current.focus()
                    tempMsgAlert = "Password Does not Match";
                    tempVariantAlert = "danger";
                }
                else {
                    tempDetails.password = changePasswordInput.current.value
                    changePasswordInput.current.value = ""; reEnterPasswordInput.current.value = "";
                }

            }

            if (firstNameInput.current.value !== "") {
                tempDetails.firstName = firstNameInput.current.value
                firstNameInput.current.value = "";
            }
            if (lastNameInput.current.value !== "") {
                tempDetails.lastName = lastNameInput.current.value
                lastNameInput.current.value = "";
            }
            if (emailInput.current.value !== "") {
                tempDetails.email = emailInput.current.value
                emailInput.current.value = "";
            }
            if (positionInput.current.value !== "") {
                tempDetails.position = positionInput.current.value
                positionInput.current.value = "";
            }
            if (numberInput.current.value !== "") {
                tempDetails.number = numberInput.current.value
                numberInput.current.value = "";
            }
            if (companyInput.current.value !== "") {
                tempDetails.company = companyInput.current.value
                companyInput.current.value = "";
            }

        }
        setMsgAlert(tempMsgAlert);
        setVariantAlert(tempVariantAlert);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000)
        setSelfDetails(tempDetails)
        //console.log("selfDetails : ", selfDetails)
    }
    useEffect(() => {

    }, [selfDetails])

    const TagStyle = (color) => {
        return ({
            width: "auto",
            height: "auto",
            "color": "white",
            "borderColor": "white",
            "background": color,
            margin: "1rem",
            padding: "5px",
            borderRadius: "5px"

        })
    }
    const editTagStyle = (color) => {
        return ({
            width: "fit-content",
            height: "auto",
            "color": "white",
            "borderColor": "white",
            "background": color,
            margin: "1rem",
            padding: "5px",
            borderRadius: "5px"
        })
    }

    const returnRef = (index) => {
        let temp;
        switch (index) {
            case 1: { temp = otherTagRef1; break; }
            case 2: { temp = otherTagRef2; break; }
            case 3: { temp = otherTagRef3; break; }
            case 4: { temp = otherTagRef4; break; }
            case 5: { temp = otherTagRef5; break; }
            default:
                break;
        }
        return temp;
    }

    return (
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Tag Manager</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row style={{ justifyContent: "flex-start", alignItems: "center" }}>
                                <Col md={2}><h5>Permanent tags : </h5></Col>
                                <Col md={10}>
                                    <Row>
                                        {
                                            permanentTagsText.map((text, index) => {
                                                return (
                                                    <div style={TagStyle(permanentTagsColor[index])} key={index}>{text}</div>
                                                )
                                            })
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{ justifyContent: "flex-start", alignItems: "center" }}>
                                <Col md={2}><h5>Other tags : </h5></Col>
                                <Col md={10}>
                                    <Row>
                                        {otherTagsUpdated}
                                    </Row>
                                </Col>

                            </Row>
                            <Row style={{ justifyContent: "flex-start", alignItems: "center" }}>
                                <Col md={2}><h5>Edit Other tags : </h5></Col>
                                <Col>
                                    <Row>
                                        {
                                            otherTagsColor.map((color, index) => {
                                                return (
                                                    <div style={{ margin: "1rem" }} key={index}>
                                                        <Form.Control style={{ background: color, borderRadius: "5px", borderColor: "white", color: "white", width: "auto" }} ref={returnRef(index + 1)} size="sm" type="text" placeholder="Enter ..." />
                                                    </div>
                                                )
                                            })
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{ justifyContent: "center", alignItems: "center" }}>
                                <Button type="submit" variant="outline-primary" onClick={() => handleOtherTagSubmit()} >Save</Button>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">
                                <Row>
                                    <Col>Settings</Col>
                                    <Col><Alert show={showAlert} variant={variantAlert} style={{ margin: "0", padding: "2px" }}>{msgAlert}</Alert></Col>
                                </Row>

                            </Card.Title>
                        </Card.Header>
                        <Card.Body>

                            <Form>
                                <Row>
                                    <Col md={6} >
                                        <Row>

                                            <Col md={4} style={{ alignSelf: "center" }}><label size="sm" >First name : </label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={firstNameInput} size="sm" type="text" placeholder={selfDetails.firstName} /></Col>

                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Last name : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={lastNameInput} size="sm" type="text" placeholder={selfDetails.lastName} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "1rem" }}>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Email : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={emailInput} size="sm" type="email" placeholder={selfDetails.email} /></Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Phone Number : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={numberInput} size="sm" type="tel" placeholder={selfDetails.number} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "1rem" }}>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Company : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={companyInput} size="sm" type="text" placeholder={selfDetails.company} /></Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Position : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={positionInput} size="sm" type="text" placeholder={selfDetails.position} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "1rem" }}>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Password : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={passwordInput} size="sm" type="password" placeholder={`Hint : ${selfDetails.password} `} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "1rem" }}>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Change Password : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={changePasswordInput} size="sm" type="password" placeholder="Enter New Password..." /></Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={6} style={{ alignSelf: "center" }}>
                                                <Form.Check
                                                    inline
                                                    custom
                                                    type="checkbox"
                                                    id="checkbox1"
                                                    label="Two-factor security"
                                                    value={selfDetails.twoFactorSecurity}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "1rem" }}>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Re-enter Password : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={reEnterPasswordInput} size="sm" type="password" placeholder="New Password..." /></Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={6} style={{ alignSelf: "center" }}>
                                                <Button type="submit" onClick={(e) => handleSubmit(e)} variant="outline-primary" size="sm">Save Settings</Button>
                                            </Col>
                                            <Col>

                                            </Col>
                                        </Row>
                                    </Col>

                                </Row>

                            </Form>

                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body >
                            <ToolkitProvider
                                keyField='id'
                                data={columndata}
                                columns={columnHeading}
                                search
                            >
                                {
                                    props => (
                                        <div>
                                            <Row style={{ "justifyContent": "center", "alignItems": "center", "margin": "2rem" }}>
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
                                                striped
                                                defaultSorted={[{
                                                    dataField: 'date',
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
                </Col>
            </Row>
        </Aux>
    );
}
