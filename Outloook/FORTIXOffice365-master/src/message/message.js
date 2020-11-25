/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */  
(function(){
    'use strict';
  
    // The Office initialize function must be run each time a new page is loaded.
    Office.initialize = function(reason){
      jQuery(document).ready(function(){
        if (window.location.search) {
          // Check if warning should be displayed.
          var errorMsg = getParameterByName("errorMsg");
          if (errorMsg) {
            $("#errorMsg").text(errorMsg);
          } else {
            var successMsg = getParameterByName("successMsg");
            $("#successMsg").text(successMsg);
          }
        }

        $("#home").on('click', function(){
          window.location.href = "/home.html";
        })
  
      })
    };

    function getParameterByName(name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  })();
  