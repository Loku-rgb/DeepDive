/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */
(function () {
    'use strict';

    var messageData;

    // The Office initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        jQuery(document).ready(function () {
            Office.context.mailbox.makeEwsRequestAsync(
                getItemRequest(Office.context.mailbox.item.itemId),
                callback
            );

            $("#logout").on('click', function () {
                buttonLoader(this, 'Loading', 1);
                console.log("logging you out...");
                window.setTimeout(function () {
                    var token = localStorage.getItem("jwtToken");
                    console.log('current stored token: ' + token);
                    var apiKey = config.apiKey;
                    console.log('api key loaded from config: ' + apiKey);
                    var url = localStorage.getItem("baseURL") + config.logoutAPIEndpoint;
                    console.log(url);

                    $.ajax({
                        url: url,
                        async: false,
                        type: "POST",
                        headers: {
                            "X-Ff3-Api-Key": apiKey,
                            "X-Jwt-Assertion": token
                        },

                        "crossDomain": true,
                        "processData": false,
                        "contentType": false,
                        "mimeType": "multipart/form-data",
                        success: function (result) {
                            console.log("success result>> ");
                            console.log(result);
                            localStorage.removeItem("jwtToken");
                            localStorage.removeItem("baseURL");
                            window.location.replace("/taskpane.html");
                        },
                        error: function (error) {
                            console.log("error result>> ");
                            console.log(JSON.stringify(error));
                            var msg = "Failed to logout!!";
                            window.location.href = "/fail.html?errorMsg=" + msg;
                        }
                    });
                }, 1000);
            })

            $("#attach1").on('click', function () {
                window.location.href = "/opportunities.html";
            })

            $("#attach2").on('click', function () {
                window.location.href = "/workrequest.html";
            })

            $("#send1").on('click', function () {
                buttonLoader(this, 'Loading', 1);
                console.log("Sending to Sale...");
                window.setTimeout(function(){
                    var displayMessageURL = "/";
                    var token = localStorage.getItem("jwtToken");
                    var apiKey = config.apiKey;
                    var url = localStorage.getItem("baseURL") + config.sendToAPIEndpoint;
                    console.log(url);

                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(messageData, "text/xml");

                    var msgRaw = xmlDoc.getElementsByTagName("t:MimeContent")[0].childNodes[0].nodeValue;
                    var msgStr = window.atob(msgRaw)

                    var form = new FormData();
                    form.append("type", "Sale");
                    form.append("rawEmail", msgStr);
                    $.ajax({
                        url: url,
                        async: false,
                        type: "POST",
                        headers: {
                            "X-Ff3-Api-Key": apiKey,
                            "X-Jwt-Assertion": token
                        },

                        "crossDomain": true,
                        "processData": false,
                        "contentType": false,
                        "mimeType": "multipart/form-data",
                        "data": form,
                        success: function (result) {
                            console.log("success result>> ");
                            console.log(result);
                            var msg = "Successfully Sent!!";
                            displayMessageURL = displayMessageURL + "success.html?successMsg=" + msg;
                        },
                        error: function (error) {
                            console.log("error result>> ");
                            console.log(JSON.stringify(error));
                            var msg = "Failed to Send!!";
                            displayMessageURL = displayMessageURL + "fail.html?errorMsg=" + msg;
                        }
                    });

                    window.location.href = displayMessageURL;
                }, 1000);
            })

            $("#send2").on('click', function () {
                buttonLoader(this, 'Loading', 1);
                console.log("Sending to support...");
                window.setTimeout(function(){
                    var displayMessageURL = "/";
                    var token = localStorage.getItem("jwtToken");
                    var apiKey = config.apiKey;
                    var url = localStorage.getItem("baseURL") + config.sendToAPIEndpoint;
                    console.log(url);

                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(messageData, "text/xml");

                    var msgRaw = xmlDoc.getElementsByTagName("t:MimeContent")[0].childNodes[0].nodeValue;
                    var msgStr = window.atob(msgRaw)

                    var form = new FormData();
                    form.append("type", "Support");
                    form.append("rawEmail", msgStr);
                    $.ajax({
                        url: url,
                        async: false,
                        type: "POST",
                        headers: {
                            "X-Ff3-Api-Key": apiKey,
                            "X-Jwt-Assertion": token
                        },

                        "crossDomain": true,
                        "processData": false,
                        "contentType": false,
                        "mimeType": "multipart/form-data",
                        "data": form,
                        success: function (result) {
                            console.log("success result>> ");
                            console.log(result);
                            var msg = "Successfully Sent!!";
                            displayMessageURL = displayMessageURL + "success.html?successMsg=" + msg;
                        },
                        error: function (error) {
                            console.log("error result>> ");
                            console.log(JSON.stringify(error));
                            var msg = "Failed to Send!!";
                            displayMessageURL = displayMessageURL + "fail.html?errorMsg=" + msg;
                        }
                    });

                    window.location.href = displayMessageURL;
                }, 1000);
            })
        })
    };

    function callback(asyncResult) {

        console.log("Message Data Loaded!!");
        messageData = asyncResult.value;

        document.getElementById("loader").style.display = "none";
        document.getElementById("myDiv").style.display = "block";

        // var result = asyncResult.value;
        // var context = asyncResult.asyncContext;
        // var error = asyncResult.error;
        // var diagnostics  = asyncResult.diagnostics;
        // console.log("getItem Result>>");
        // console.log(result);
        // console.log("getItem context>>");
        // console.log(context);
        // console.log("getItem error>>");
        // console.log(error);
        // console.log("getItem diagnostics>>");
        // console.log(diagnostics);
    }
})();


// var myVar;

// function myFunction() {
//   myVar = setTimeout(showPage, 3000);
// }

// function showPage() {
//   document.getElementById("loader").style.display = "none";
//   document.getElementById("myDiv").style.display = "block";
// }