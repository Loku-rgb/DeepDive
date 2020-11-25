import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import { Redirect } from 'react-router-dom';

import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';


export default function Invoices() {
  const userId = "5f28f0fd7791224c080e1d3e"
  // console.log("component rendering");
  const [subscriptionPageShow, setSubscriptionPageShow] = useState(false)

  const { SearchBar, ClearSearchButton } = Search;
  const { ExportCSVButton } = CSVExport;

  const [columnData, setColumnData] = useState([]);

  const [billingDetails, setBillingDetails] = useState({
    lastPaid: "",
    nextPaid: "",
    package: "",
    amount: "",
  });
  const [billingSettings, setBillingSettings] = useState({
    state: "",
    postCode: "",
    address: "",
    city: "",
  });
  const [modalShow, setModalShow] = useState(false);
  const [latestInvoice, setLatestInvoice] = useState({});
  const [serverResponse, setServerResponse] = useState("");
  //-----------------------------------------------------------------------Set Filters Card--------------------------------

  //ref to filter search inputs
  const inputAddress = useRef(null);
  const inputPostCode = useRef(null);
  const inputCity = useRef(null);
  const inputState = useRef(null);

  let getInvoices = async () => {
    await axios
      .get(`/invoicesList`, {
        params: {
          userId: userId,
        },
      })
      .then(async (res) => {

        let tempLatestInvoice = res.data[0];
        let minTempCreatedOn = new Date(res.data[0].createdOn);

        //get latest dated invoice
        for (let i of res.data) {
          if (new Date(i.createdOn) > minTempCreatedOn) {
            tempLatestInvoice = i;
            minTempCreatedOn = new Date(i.createdOn);
          }
        }

        //get package name and details from invoice pacakge id
        await axios
          .get("/package", {
            params: {
              _id: tempLatestInvoice.packageId,
            },
          })
          .then((res) => {
            console.log("res.data in package : ", res);
            setBillingDetails({
              lastPaid: new Date(tempLatestInvoice.lastPaid),
              nextPaid: new Date(tempLatestInvoice.nextPaid),
              amount: tempLatestInvoice.amount,
              package: `${res.data.name}, ($ ${res.data.billing_rate} / ${res.data.validity_period} ) `,
            });
          });
        
        //set address from latest invoice
        setBillingSettings({
          state: tempLatestInvoice.state ? tempLatestInvoice.state : null,
          postCode: tempLatestInvoice.postCode? tempLatestInvoice.postCode : null,
          address: tempLatestInvoice.address ? tempLatestInvoice.address : null,
          city: tempLatestInvoice.city ? tempLatestInvoice.city : null,
        });

        //set list of invoices for table
        setColumnData(
          res.data.map((invoice) => {
            let myDateFormat = new Date(invoice.createdOn);
            return {
              id: invoice._id,
              date: `${myDateFormat.getDate()}/${myDateFormat.getMonth()}/${myDateFormat.getFullYear()}`,
              description: `Payment (${invoice.cardDetails})`,
              amount: `$${invoice.amount}`,
              download: (
                <Button
                  variant="light"
                  href={invoice.invoiceUrl}
                  target="_blank"
                  size="sm"
                >
                  Download
                </Button>
              ),
            };
          })
        );
        
        //set latest invoice
        setLatestInvoice(tempLatestInvoice);
      });

  };

  //set address from latest invoice to db's user details on first time
  const setAddresstoDb = async () =>{
    await axios
    .put("/userDetails/" + String(userId),billingSettings)
    .then((res) => {}).catch((err) => {
      console.error(err);
    });
  }


  //on billing settings edit submit
  let setValues = (e) => {
    e.preventDefault();

    let newBillingSetting = {
      address: inputAddress.current.value
        ? inputAddress.current.value
        : billingSettings.address,
      postCode: inputPostCode.current.value
        ? inputPostCode.current.value
        : billingSettings.postCode,
      city: inputCity.current.value
        ? inputCity.current.value
        : billingSettings.city,
      state: inputState.current.value
        ? inputState.current.value
        : billingSettings.state,
    }

    //on address change , save it to user address in our db
    axios
      .put("/userDetails/" + String(userId),newBillingSetting )
      .then((res) => {

        setBillingSettings(newBillingSetting)
        setServerResponse(
          res.data === "Saved" ? (
            <span
              style={{
                color: "green",
                background: "#d4edda",
                margin: "0.5rem",
                padding: "0.3rem",
                borderRadius: "0.3rem",
              }}
            >
              Saved
            </span>
          ) : (
              <span
                style={{
                  color: "red",
                  background: "#f8d7da",
                  margin: "0.5rem",
                  padding: "0.3rem",
                  borderRadius: "0.3rem",
                }}
              >
                {res.data}
              </span>
            )
        );
        setTimeout(() => {
          setServerResponse("");
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
      });

    //hide modal
    setModalShow(false);
  };

  function UpdateBillingSettings(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Form onSubmit={(e) => setValues(e)}>
                <Row>
                  <Col md={6}>
                    <Row>
                      <Col md={4} style={{ alignSelf: "center" }}>
                        <label size="sm">Address : </label>
                      </Col>
                      <Col md={6} style={{ alignSelf: "center" }}>
                        <Form.Control
                          ref={inputAddress}
                          size="sm"
                          type="text"
                          placeholder={billingSettings.address}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <Col md={4} style={{ alignSelf: "center" }}>
                        <Form.Label size="sm">City: </Form.Label>
                      </Col>
                      <Col md={6} style={{ alignSelf: "center" }}>
                        <Form.Control
                          ref={inputCity}
                          size="sm"
                          type="text"
                          placeholder={billingSettings.city}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row style={{ marginTop: "1rem" }}>
                  <Col md={6}>
                    <Row>
                      <Col md={4} style={{ alignSelf: "center" }}>
                        <Form.Label size="sm">State : </Form.Label>
                      </Col>
                      <Col md={6} style={{ alignSelf: "center" }}>
                        <Form.Control
                          ref={inputState}
                          size="sm"
                          type="text"
                          placeholder={billingSettings.state}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <Col md={4} style={{ alignSelf: "center" }}>
                        <Form.Label size="sm">Postcode : </Form.Label>
                      </Col>
                      <Col md={6} style={{ alignSelf: "center" }}>
                        <Form.Control
                          ref={inputPostCode}
                          size="sm"
                          type="number"
                          placeholder={billingSettings.postCode}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row style={{ marginTop: "1rem", justifyContent: "center" }}>
                  <Button type="submit" size="sm">
                    {" "}
                    Save{" "}
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    );
  }

  useEffect(() => {
    getInvoices();
    if(billingSettings.state!==""){
      setAddresstoDb()
    }
  }, []);

  // -----------------------------------------------------------------------Table ---------------------------------------------------------------

  //table headings
  const columnHeading = [
    {
      dataField: "date",
      text: "Date",
      sort: true,
      sortFunc: (a, b, order, dataField, rowA, rowB) => {
        let A = a.split("/").reverse();
        let B = b.split("/").reverse();
        let tempA = [];
        for (let i = 0; i < A.length; i++) {
          tempA.push(Number(A[i]));
        }
        let tempB = [];
        for (let i = 0; i < B.length; i++) {
          tempB.push(Number(B[i]));
        }

        if (order === "asc") {
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
        } else if (order === "desc") {
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
      },
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
    },
    {
      dataField: "amount",
      text: "Amount",
      sort: true,
    },
    {
      dataField: "download",
      text: "",
    },
  ];

  if (subscriptionPageShow) {
    return (
      <Redirect
        to={{
          pathname: '/prices',
          state: { userID : userId }
        }}
      />
    )
  }
  else {
    return (

      <><Aux>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Billing Details</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row style={{ margin: "1rem", alignItems: "baseline" }}>
              <Col
                md={3}
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                {" "}
                <h6>My Plan : </h6>{" "}
              </Col>
              <Col md={5}>
                {" "}
                <Form.Control
                  disabled
                  size="sm"
                  type="text"
                  placeholder="Your Plan..."
                  value={billingDetails.package}
                />
              </Col>
            </Row>
            <Row style={{ margin: "1rem", alignItems: "baseline" }}>
              <Col md={3}>
                {" "}
                <h6>Last Paid : </h6>{" "}
              </Col>
              <Col md={5}>
                {" "}
                <Form.Control
                  disabled
                  size="sm"
                  type="text"
                  placeholder="Last Paid..."
                  value={billingDetails.lastPaid}
                />
              </Col>
            </Row>
            <Row style={{ margin: "1rem", alignItems: "baseline" }}>
              <Col md={3}>
                {" "}
                <h6>Next Pay: </h6>{" "}
              </Col>
              <Col md={5}>
                {" "}
                <Form.Control
                  disabled
                  size="sm"
                  type="text"
                  placeholder="Next Pay..."
                  value={billingDetails.nextPaid}
                />
              </Col>
            </Row>
            <Row style={{ margin: "1rem", alignItems: "baseline" }}>
              <Col md={3}>
                {" "}
                <h6>Amount this period: </h6>{" "}
              </Col>
              <Col md={5}>
                {" "}
                <Form.Control
                  disabled
                  size="sm"
                  type="text"
                  placeholder="Amount..."
                  value={`$${billingDetails.amount}`}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Billing Settings {serverResponse}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row style={{ margin: "1rem", alignItems: "baseline" }}>
              <Col
                md={9}
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <h6>
                  This address will appear on the monthly invoice and should be
                  the registered (legal) address of the business.
                  </h6>
              </Col>
              <Col
                md={3}
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => setModalShow(true)}
                >
                  {" "}
                    Edit Settings
                  </Button>
              </Col>
            </Row>
            <Row style={{ margin: "1rem", alignItems: "baseline" }}>
              <Col
                md={2}
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                {" "}
                <h6>Address : </h6>{" "}
              </Col>
              <Col md={4}>
                {" "}
                <Form.Control
                  disabled
                  size="sm"
                  type="text"
                  placeholder={
                    billingSettings.address
                      ? billingSettings.address
                      : "Not Available"
                  }
                  value={billingSettings.address}
                />
              </Col>

              <Col md={2}>
                {" "}
                <h6>City : </h6>{" "}
              </Col>
              <Col md={4}>
                {" "}
                <Form.Control
                  disabled
                  size="sm"
                  type="text"
                  placeholder={
                    billingSettings.city
                      ? billingSettings.city
                      : "Not Available"
                  }
                  value={billingSettings.city}
                />
              </Col>
            </Row>
            <Row style={{ margin: "1rem", alignItems: "baseline" }}>
              <Col md={2}>
                {" "}
                <h6>State : </h6>{" "}
              </Col>
              <Col md={4}>
                {" "}
                <Form.Control
                  disabled
                  size="sm"
                  type="text"
                  placeholder={
                    billingSettings.state
                      ? billingSettings.state
                      : "Not Available"
                  }
                  value={billingSettings.state}
                />
              </Col>
              <Col md={2}>
                {" "}
                <h6>Postcode : </h6>{" "}
              </Col>
              <Col md={4}>
                {" "}
                <Form.Control
                  disabled
                  size="sm"
                  type="text"
                  placeholder={
                    billingSettings.postCode
                      ? billingSettings.postCode
                      : "Not Available"
                  }
                  value={billingSettings.postCode}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Billing History</Card.Title>
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
                    filterPosition="top"
                    striped
                    defaultSorted={[
                      {
                        dataField: "date",
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
        <Card>
          <Card.Header>
            <Card.Title as="h5">Plans</Card.Title>
          </Card.Header>
          <Card.Body>
            <button onClick={() => setSubscriptionPageShow(true)}>see plans</button>
          </Card.Body>
        </Card>
        <UpdateBillingSettings
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </Aux>
      </>
    );
  }

}
