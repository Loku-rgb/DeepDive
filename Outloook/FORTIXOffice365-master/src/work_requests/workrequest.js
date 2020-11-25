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

            var url = localStorage.getItem("baseURL") + config.getRequestsAPIEndpoint;
            console.log("requests url>> " + url);
            var apiKey = config.apiKey;
            var jwtToken = localStorage.getItem("jwtToken");
            $.ajax({
                url: url,
                async: false,
                type: "GET",
                headers: {
                    "X-Ff3-Api-Key": apiKey,
                    "X-Jwt-Assertion": jwtToken
                },
                data: {
                    attributes: "idRequest,name,progress",
                    relations: "requestStatus",
                    orderby: "idRequest DESC",
                    limit: 50
                },
                success: function (result) {
                    // CallBack(result);
                    console.log("success result>> ");
                    console.log(result);
                    $("#request-list").empty();
                    buildChoicesList(
                        $("#requests-list"),
                        result.content.records,
                        "idRequest",
                        "workRequest",
                        onChoiceSelected
                    );
                },
                error: function (error) {
                    console.log("error result>> ");
                    console.log(error);
                }
            });

            $("#assign").on('click', function () {
                buttonLoader(this, 'Loading', 1);
                console.log("assigning to work request...");
                window.setTimeout(function (){
                    var assignToId = $(".rd-btn-grp.is-selected").val();
                    console.log("Assigning to id: " + assignToId);
            
                    var displayMessageURL = "/";
                    var token = localStorage.getItem("jwtToken");
                    var apiKey = config.apiKey;
                    var url = localStorage.getItem("baseURL") + config.assignToAPIEndpoint;
                    console.log(url);   

                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(messageData,"text/xml");

                    var msgRaw = xmlDoc.getElementsByTagName("t:MimeContent")[0].childNodes[0].nodeValue;
                    var msgStr = window.atob(msgRaw)
                    
                    var form = new FormData();
                    form.append("idRequest", assignToId);
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
                            var msg = "Successfully Assigned!!";
                            displayMessageURL = displayMessageURL + "success.html?successMsg=" + msg;
                        },
                        error: function (error) {
                            console.log("error result>> ");
                            console.log(JSON.stringify(error));
                            var msg = "Failed to Assign!!";
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
