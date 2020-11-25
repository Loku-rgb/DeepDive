import React, { useState, useEffect, useRef } from "react";
// import { useNavigate  } from "react-router-dom";
import { Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
// import { useHistory } from "react-router-dom";
import axios from "axios";

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';

let customerId; 
let priceId = "price_1HRMGyIYRzF4KXaeJTePz6bK";


export default function Subscription({history}) {

    // let history = useHistory();

    const [email, setEmail] = useState('');
    const [customer, setCustomer] = useState(null);

    const stripe = useStripe();
    const elements = useElements();
    
    const header = {
        'Content-Type': 'application/json',
    }

    const handlePaymentThatRequiresCustomerAction = (response) =>{
        console.log("handlePaymentThatRequiresCustomerAction : ",response)
    }
    const handleRequiresPaymentMethod = (response) =>{
        console.log("handleRequiresPaymentMethod : ",response)
    }

    const onSubscriptionComplete = (response) =>{
        console.log("onSubscriptionComplete : ",response)
    }
    const showCardError = (error) =>{
        console.log("showCardError : ", error)
    }
    


    const createSubscription = async ({ customerId, paymentMethodId, priceId }) => {
        await axios
            .post("/create-subscription", {
                customerId: customerId,
                paymentMethodId: paymentMethodId,
                priceId: priceId,
            }, { headers: header })
            // If the card is declined, display an error to the user.
            .then((result) => {
                if (result.error) {
                    // The card had an error when trying to attach it to a customer.
                    throw result;
                }
                return result;
            })
            // Normalize the result to contain the object returned by Stripe.
            // Add the additional details we need.
            .then((result) => {
                return {
                    paymentMethodId: paymentMethodId,
                    priceId: priceId,
                    subscription: result,
                };
            })
            // Some payment methods require a customer to be on session
            // to complete the payment process. Check the status of the
            // payment intent to handle these actions.
            .then((response)=>handlePaymentThatRequiresCustomerAction(response))
            // If attaching this card to a Customer object succeeds,
            // but attempts to charge the customer fail, you
            // get a requires_payment_method error.
            .then((response)=>handleRequiresPaymentMethod(response))
            // No more actions required. Provision your service for the user.
            .then((response)=>onSubscriptionComplete(response))
            .catch((error) => {
                // An error has happened. Display the failure to the user here.
                // We utilize the HTML element we created.
                showCardError(error);
            })
    }


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // If a previous payment was attempted, get the latest invoice
        const latestInvoicePaymentIntentStatus = localStorage.getItem(
            'latestInvoicePaymentIntentStatus'
        );

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[createPaymentMethod error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);

            const paymentMethodId = paymentMethod.id;

            // Create the subscription
            createSubscription({ customerId, paymentMethodId, priceId });
        }


    };

    useEffect(() => {

        let userPlan = {stripeCustomerId : null, planActive : false, planName : null}

        let user = {}
        //check plan status of userId "5f27c1a39a9acd12811864bc" in our db
        axios
            .get('/userDetails/'+"5f27c1a39a9acd12811864bc")
            .then((res) => {
                userPlan = {
                    stripeCustomerId :  res.data.stripeCustomerId,
                    planActive :  res.data.planActive,
                    planName :  res.data.planName
                }
                user = res.data;
            })
            .catch((err) => {
                console.error("err : ", err);
            });

    //     //if "stripeCustomerId" not present in our db => create stripe customer
    //     if (!userPlan.stripeCustomerId) {

    //         let stripeCustomerId;
            
    //         //create customer and get "stripeCustomerId" for newly created stripeCustomer
    //         await axios
    //             .post("/create-customer", { "email": user.email, "name" : user.first_name + user.last_name ,"phone" : user.phoneNumber }, { headers: header })
    //             .then((res) => {
    //                 stripeCustomerId = res.data.customer.id
    //             })
    //             .catch((err) => {
    //                 console.error("err : ", err);
    //             });
            
    //         //set stripeCustomer id to our db for userid
    //         await axios
    //         .put("/userDetails/"+"5f27c1a39a9acd12811864bc",
    //         {
    //             stripeCustomerId :stripeCustomerId
    //         }).then(res => {
    //             console.log(" stripeCustomerId saved : ", stripeCustomerId)
    //         })

    //     }

    //     customerId = user.stripeCustomerId;
        //update
    }, [])

    return (
        <>
            <Row>
            <Col>
            <form onSubmit={handleSubmit}>
                
                <Row><CardSection /></Row>
                <button disabled={!stripe}>Confirm order</button>
                
            </form>
            </Col>
            </Row>
            
            <button onClick={()=>history.goBack()}>Back</button>

        </>
    )
}