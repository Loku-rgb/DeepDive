(function () {
    "use strict";

    // The Office initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        jQuery(document).ready(function () {
            // When the Done button is selected, send the
            // values back to the caller as a serialized
            // object.
            var currentUrl = window.location.href;
            console.log('called url: ' + currentUrl);
            var token = getParameterByName('token', currentUrl);
            var fURL = getParameterByName('loginURL', currentUrl);
            if(token){
                console.log('here token received: ' + token);
                var messageObject = { messageType: "signinSuccess", data: token, loginURL: fURL };
                var jsonMessage = JSON.stringify(messageObject);
                Office.context.ui.messageParent(jsonMessage);
            } else {
                var callbackURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
                // window.location.href = 'https://office-fortix.blue-bricks.com/authorize.html?callback=' + callbackURL;
                window.location.href = 'https://login.fortix.systems/office_login.html?callback=' + callbackURL;
            }
        });
    };

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
})();