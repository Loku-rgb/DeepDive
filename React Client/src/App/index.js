import React, { Component, Suspense, useState,useContext, createContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

// import SignInPage from  '../Demo/Authentication/SignIn/SignIn1'

import '../../node_modules/font-awesome/scss/font-awesome.scss';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";

const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});
const SignInPage = Loadable({
    loader: () => import('../Demo/Authentication/SignIn/SignIn1'),
    loading: Loader
});

export default function App() {
    const [userDetails,setUserDetails] = useState({
        type: null,
        loginState : false
    });
    const setUserLoginState = (state) =>{
        setUserDetails({...userDetails,"loginState":state})
    }
    console.log("In app : ",userDetails.type)
    return(
        userDetails.loginState? userDetails.type==="admin" ? <AdminLayout setUserLoginState={setUserLoginState} userType={userDetails.type}/> : <AdminLayout setUserLoginState={setUserLoginState} userType={userDetails.type} /> : <SignInPage setUserDetails={setUserDetails} />
    )
}