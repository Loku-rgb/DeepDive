Office.onReady(info => {
    if (info.host === Office.HostType.Outlook) {
        document.getElementById("sideload-msg").style.display = "none";
        document.getElementById("app-body").style.display = "flex";
        // document.getElementById("run").onclick = run;

    }

    // localStorage.setItem("apiKey", "zMJDQmz1j6LPNKqEfsLMGM8XFwuZMyU9F1h02hDRESE8wxNrQ1h4HwaWqADFnRjy");
    // localStorage.setItem("testConnectionAPIEndpoint", "/dataapi/v1/Login/check");
    // localStorage.setItem("loginAPIEndpoint", "/dataapi/v1/Login/login");
    // localStorage.setItem("logoutAPIEndpoint", "/dataapi/v1/Login/logout");
    // localStorage.setItem("assignToAPIEndpoint", "/dataapi/v1/IncomingEmails/assign");
    // localStorage.setItem("getOpportunitiesAPIEndpoint", "/dataapi/v1/Opportunities/index");
    // localStorage.setItem("getRequestsAPIEndpoint", "/dataapi/v1/Requests/index");
    // localStorage.setItem("sendToAPIEndpoint", "/dataapi/v1/IncomingEmails/index");
    // localStorage.setItem("createOpportunityAPIEndpoint", "/dataapi/v1/IncomingEmails/createOpportunity");

});

(function () {
    'use strict';

    var token;
    var dialog;

    // The Office initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            console.log("Loded...!!!");

            // localStorage.removeItem("jwtToken");
            token = localStorage.getItem("jwtToken");

            if(!token || typeof token === 'undefined'){
                $("body").show();
                $("#login").on('click', function () {
                    console.log("login clicked!!");
    
                    // Display settings dialog.
                    var url = new URI("/dialog.html").absoluteTo(window.location).toString();
                    // var url = "https://login.fortix.systems/office_login.html";
                    // var url = new URI("/dialog.html").host("office-fortix.blue-bricks.com").protocol("https").toString();
                    // var url = '/dialog.html';
                    console.log("dialog url>> " + url);
                    
                    var dialogOptions = { width: 40, height: 60, displayInIframe: true };

                    Office.context.ui.displayDialogAsync(url, {height: 70, width: 40,  displayInIframe: true},
                        function (asyncResult) {
                            // dialog = asyncResult.value;
                            // dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
                            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                                showNotification(asyncResult.error.code = ": " + asyncResult.error.message);
                            } else {
                                dialog = asyncResult.value;
                                dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
                            }
                        }
                    );
                })
            } else {
                console.log('current saved token : ' + token);
                window.location.replace("/home.html");
            }            
        })
    };

    function processMessage(arg) {
        console.log(arg.message);
        var messageFromDialog = JSON.parse(arg.message);
        if (messageFromDialog.messageType === "signinSuccess") {
            dialog.close();
            console.log("token: " + messageFromDialog.data);
            localStorage.setItem("jwtToken", messageFromDialog.data);
            localStorage.setItem("baseURL", messageFromDialog.loginURL);
            console.log("dialog closed and token is saved!!");
            window.location.reload();
        } else {

            console.error("Unable to authenticate user: " + messageFromDialog.error);
        }
    }

})();