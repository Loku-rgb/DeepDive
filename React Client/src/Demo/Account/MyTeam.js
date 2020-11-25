import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Form, Modal,Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import Aux from "../../hoc/_Aux";
import BootstrapTable from 'react-bootstrap-table-next';
// import Table from './table'


export default function Documents() {

    const [dataFromApi, setDatafromApi] = useState([
        {
            id: 1,
            name: "Samuel Gee",
            companyTitle: "samuel@adsrus.com",
            email: "samuel@adsrus.com ",
            lastUsed: "25/06/2020",
        },
        {
            id: 2,
            name: "Ben Bolt",
            companyTitle: "No company",
            email: "ben@outlook.com",
            lastUsed: "16/05/2020",
        },
        {
            id: 3,
            name: "Sara Kana",
            companyTitle: "Game fair, Marketing S...",
            email: "sara@gamefair.com",
            lastUsed: "07/11/2019",
        },
        {
            id: 4,
            name: "Jess Gerry",
            companyTitle: "Tips tops, Head of HR",
            email: "jess@tipstops.co.uk",
            lastUsed: "05/06/2020",
        },
        {
            id: 5,
            name: "Glen Archery",
            companyTitle: "Glens mowing, CEO",
            email: "glen@gmail.com",
            lastUsed: "26/01/2020",
        },
        {
            id: 6,
            name: "Steven Berger",
            companyTitle: "Steven's Burgers, Chef",
            email: "steven@berg.com",
            lastUsed: "12/06/2020",
        }
    ]);
    const deleteMemberIds = [];
    const [showUpdatemodalShow,setShowUpdatemodalShow] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [updateModalShow,setUpdateModalShow] = useState(false)
    const [selfDetails, setSelfDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        number: "",
        position: "",
        password: "",
        twoFactorSecurity: true
    })

    console.log("component rendering")

    const firstNameInput = useRef("");;
    const lastNameInput = useRef("");
    const emailInput = useRef("");
    const companyInput = useRef("");
    const numberInput = useRef("");
    const positionInput = useRef("");

    const [msgAlert, setMsgAlert] = useState("")
    const [variantAlert, setVariantAlert] = useState("")
    const [showAlert, setShowAlert] = useState(false);

    // -----------------------------------------------------------------------Table ---------------------------------------------------------------

    const [columnData, setColumnData] = useState(dataFromApi);

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
            dataField: 'lastUsed',
            text: 'Last Used',
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

                console.log("a: ", tempA)
                console.log("b: ", tempB)

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
            dataField: 'actions',
            text: 'Actions',
        },
        {
            dataField: 'setStatus',
            text: '',
        }
    ])

    function updateMember(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6} >
                                        <Row>

                                            <Col md={4} style={{ alignSelf: "center" }}><label size="sm" >First name : </label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={firstNameInput} required size="sm" type="text" placeholder={selfDetails.firstName} /></Col>

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
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={emailInput} required size="sm" type="email" placeholder={selfDetails.email} /></Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Phone Number : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={numberInput} required size="sm" type="tel" placeholder={selfDetails.number} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "1rem" }}>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Company : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={companyInput} required size="sm" type="text" placeholder={selfDetails.company} /></Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Position : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={positionInput} required size="sm" type="text" placeholder={selfDetails.position} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "1rem", justifyContent: "center" }}>
                                    <Button type="submit" size="sm">+ Add</Button>
                                </Row>

                            </Form>

                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        );
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        
        setColumnData([...columnData,{
            id: columnData.length+1,
            name: `${firstNameInput.current.value} ${lastNameInput.current.value}`,
            companyTitle:`${companyInput.current.value},${positionInput.current.value}`,
            email: emailInput.current.value,
            lastUsed: "----",
            actions: returnActions(columnData.length+1),
            setStatus: setStatus(columnData.length+1)
        }])
        firstNameInput.current.value="";
        lastNameInput.current.value=""
        emailInput.current.value=""
        companyInput.current.value=""
        numberInput.current.value=""
        positionInput.current.value=""
        setModalShow(false)
    }

    const deleteMember = (e,id) =>{
        e.preventDefault();
        console.log("recieved ColumnData : ",columnData)
        let tempColumnData = columnData
        for(const delId of deleteMemberIds)
        {
            console.log("deleting Column : ",columnData[delId-1]);
            tempColumnData = tempColumnData.filter(member => member.id!==delId)
        }
        setColumnData(tempColumnData);
    }
    
    const returnActions = (id) => {
        return (
            <Button variant="outline-secondary" onClick={(e)=>{setShowUpdatemodalShow(true); updateMember(e,id)}} size="sm">View/Edit</Button>
        )
    }
    const setStatus = (id) => {
        return (
            <Button variant="danger" type="submit" size="sm" onClick={(e)=>{deleteMemberIds.push(id); deleteMember(e,id);}}>Delete</Button>
        )
    }

    useEffect(()=>{
        console.log("In []")
        setColumnData(columnData.map((member)=>{
            member.actions  = returnActions(member.id);
            member.setStatus = setStatus(member.id);
            return member;
        }))
    },[])

    useEffect(()=>{
        console.log("columnData updated to : ",columnData);
    },[columnData])


    function AddNewMemberModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        My New Member
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6} >
                                        <Row>

                                            <Col md={4} style={{ alignSelf: "center" }}><label size="sm" >First name : </label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={firstNameInput} required size="sm" type="text" placeholder={selfDetails.firstName} /></Col>

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
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={emailInput} required size="sm" type="email" placeholder={selfDetails.email} /></Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Phone Number : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={numberInput} required size="sm" type="tel" placeholder={selfDetails.number} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "1rem" }}>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Company : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={companyInput} required size="sm" type="text" placeholder={selfDetails.company} /></Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={4} style={{ alignSelf: "center" }}><Form.Label size="sm" >Position : </Form.Label></Col>
                                            <Col md={6} style={{ alignSelf: "center" }}><Form.Control ref={positionInput} required size="sm" type="text" placeholder={selfDetails.position} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "1rem", justifyContent: "center" }}>
                                    <Button type="submit" size="sm">+ Add</Button>
                                </Row>

                            </Form>

                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <>
            <Aux>
                <Card>
                    <Card.Header>
                        <Card.Title as="h5">My Team</Card.Title>
                        {/* <span className="d-block m-t-5"> Set above <code> Filters </code> or use Below <code> Search </code> text input</span> */}
                    </Card.Header>
                    <Card.Body >

                        <Row style={{justifyContent:"center",marginBottom:"2rem"}}>
                            <Button variant="outline-primary" onClick={() => setModalShow(true)}>
                                    + Add Team Member
                            </Button>
                        </Row>
                            

                        <AddNewMemberModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        />

                        <BootstrapTable
                            bootstrap4
                            keyField='id'
                            data={columnData}
                            columns={columnHeading}
                            bordered={false}
                            wrapperClasses="table-responsive"
                            className="table"
                            striped
                            defaultSorted={[{
                                dataField: 'name',
                                order: 'asc'
                            }]}
                        />
                    </Card.Body>
                </Card>
            </Aux>
        </>

    )

}
