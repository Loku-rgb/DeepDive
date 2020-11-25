import React, { useState, useEffect, useRef } from "react";
// import { useNavigate  } from "react-router-dom";
import { Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
// import { useHistory } from "react-router-dom";
import axios from "axios";

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';

import PaymentForm from './PaymentForm';
import Product from './Product';
import { withRouter } from 'react-router-dom';

// let customerId; 
// let priceId = "price_1HRMGyIYRzF4KXaeJTePz6bK";

const products = [
    {
        key: 0,
        price: '$5.00',
        name: 'Basic',
        interval: 'month',
        billed: 'monthly',
    },
    {
        key: 1,
        price: '$15.00',
        name: 'Premium',
        interval: 'month',
        billed: 'monthly',
    },
];


function Subscription(props) {

    const [userId, setUserID] = useState(props.location.state.userID)
    const [userDetails, setUserDetails] = useState();
    const [customer, setCustomer] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [productSelected, setProduct] = useState(null); //setproduct

    //on product selection
    function handleClick(key) {
        setProduct(products[key]);
    }

    let header = { 'Content-Type': 'application/json', }

    //get userDetails for given userId => for creating new stripe customer if needed
    const getUserDetails = async (userId) => {
        await axios
            .get('/userDetails/' + userId)
            .then((res) => {
                // console.log("userDetails : ",res.data)
                setUserDetails(res.data)
            })
            .catch((err) => {
                console.error("err in getUserDetails : ", err);
            });
    }

    //after stripe customer created or when already a customer => use customerId to retrieve customer details => set customer
    const getStripeCustomerObj = async (customerId) => {
        await axios
            .get('/retrieve-customer/' + customerId)
            .then((res) => {
                setCustomer(res.data)
            })
            .catch((err) => {
                console.error("err in getStripeCusutomerObj : ", err);
            });
    }

    //get userDetials on intial render
    useEffect(() => {
        getUserDetails(userId);
    }, [])

    //set customerID
    useEffect(() => {
        if (userDetails) {

            //if user is not registered stripe customer => create customer => set newly created customerID => save to user collection on db
            if (!userDetails.stripeCustomerId) {

                //create customer and get "stripeCustomerId" for newly created stripeCustomer
                axios
                    .post(
                        "/create-customer",
                        {
                            "email": userDetails.email,
                            "name": userDetails.first_name + userDetails.last_name,
                            "phone": userDetails.phoneNumber,
                            "address": {
                                line1: userDetails.address,
                                city: userDetails.city,
                                state: userDetails.state,
                                postal_code: userDetails.postCode,
                                country: userDetails.country ? userDetails.country : "India"
                            }
                        },
                        { headers: header }
                    )
                    .then(async (res) => {
                        //set CustomerId 
                        setCustomerId(res.data);
                        //save stripeCustomerId for this user in our db
                        await axios
                            .put("/userDetails/" + String(userId), { stripeCustomerId: res.data })
                            .then((res) => console.log(" stripeCustomerId : ", res.data))
                    })
                    .catch((err) => {
                        console.error("err in create-customer/setting user customerId: ", err);
                    });
            }

            // else directly set customerID
            else {
                setCustomerId(userDetails.stripeCustomerId)
            }
        }
    }, [userDetails])

    //once customerId is avialable => setCustomerObj
    useEffect(() => {
        if (customerId) {
            getStripeCustomerObj(customerId)
        }
    }, [customerId])

    //once customer id avialable
    useEffect(() => {
        if (customer) {
            console.log("stripe customer : ",customer)
        }
    }, [customer])


    return (
        <div style={{background:"#00002d"}} >
            {
                customer ?
                            
                            < >
                                <Row style={{justifyContent:"space-evenly",alignItems:"center"}}>
                                    <h2 style={{color:"white"}}>Subscribe to a plan</h2>
                                </Row>
                                
                                <Row style={{justifyContent:"space-evenly",alignItems:"center"}}>
                                    {products.map((product, index) => {
                                        return (
                                            <Product
                                                key={index}
                                                product={product}
                                                handleClick={handleClick}
                                            />
                                        );
                                    })}
                                </Row>
                                {productSelected ? (
                                    <PaymentForm
                                        productSelected={productSelected}
                                        customer={customer}
                                    />
                                ) : null}
                            </>
                    : null
            }

        </div>
    )
}

export default withRouter(Subscription)