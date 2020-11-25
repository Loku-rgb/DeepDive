function buildChoicesList(parent, choices, key, cls, clickFunc) {
    choices.forEach(function (choice) {
        var listItem = $("<label/>")
        .addClass("container")
        .appendTo(parent);

        var text = $('<p/>')
        .addClass("text-truncate")
        .text(choice["name"])
        .appendTo(listItem);

        var radioItem = $("<input>")
            .addClass("rd-btn-grp")
            .addClass("is-selectable")
            .attr("type", "radio")
            .attr("name", cls)
            .attr("tabindex", 0)
            .val(choice[key])
            .appendTo(listItem);

        var desc = $("<span/>")
            .addClass("checkmark")
            .appendTo(listItem);

        listItem.on("click", clickFunc);
    });
}

function onChoiceSelected() {
    $(".rd-btn-grp")
        .removeClass("is-selected")
        .removeAttr("checked");
    $(this)
        .children(".rd-btn-grp")
        .addClass("is-selected")
        .attr("checked", "checked");
}

function getItemRequest(id) {
    var request = 
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    '               xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    '               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
    '               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
    '  <soap:Header>' +
    '    <RequestServerVersion Version="Exchange2013" xmlns="http://schemas.microsoft.com/exchange/services/2006/types" soap:mustUnderstand="0" />' +
    '  </soap:Header>' +
    '  <soap:Body>' +
    '    <GetItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"' +
    '             xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
    '      <ItemShape>' +
    '        <t:BaseShape>Default</t:BaseShape>' +
    '        <t:IncludeMimeContent>true</t:IncludeMimeContent>' +
    '      </ItemShape>' +
    '      <ItemIds>' +
    '        <t:ItemId Id="' + id + '"/>' +
    '      </ItemIds>' +
    '    </GetItem>' +
    '  </soap:Body>' +
    '</soap:Envelope>';

    return request;
}

function buttonLoader(objElement, content, status){
    if(status === 1){
          $('button').prop("disabled", true);
          $(objElement).html(
            '<i class="fa fa-spinner fa-spin"></i> '+content+'...'
          );
    }else{
         $('button').prop("disabled", false);
         $(objElement).html(content);
    }	
}

// (function () {
//     'use strict';

//     function buildChoicesList(parent, choices, key, cls, clickFunc) {
//         choices.forEach(function (choice) {
//             var listItem = $("<label/>")
//             .addClass("container")
//             .text(choice["name"])
//             .appendTo(parent);

//             var radioItem = $("<input>")
//                 .addClass("rd-btn-grp")
//                 .addClass("is-selectable")
//                 .attr("type", "radio")
//                 .attr("name", cls)
//                 .attr("tabindex", 0)
//                 .val(choice[key])
//                 .appendTo(listItem);

//             var desc = $("<span/>")
//                 .addClass("checkmark")
//                 // .text(choice["name"])
//                 .appendTo(listItem);

//             listItem.on("click", clickFunc);
//         });
//     }

//     function onChoiceSelected() {
//         $(".rd-btn-grp")
//             .removeClass("is-selected")
//             .removeAttr("checked");
//         $(this)
//             .children(".rd-btn-grp")
//             .addClass("is-selected")
//             .attr("checked", "checked");
//     }

//     function getItemRequest(id) {
//         var request = 
//         '<?xml version="1.0" encoding="utf-8"?>' +
//         '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
//         '               xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
//         '               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
//         '               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
//         '  <soap:Header>' +
//         '    <RequestServerVersion Version="Exchange2013" xmlns="http://schemas.microsoft.com/exchange/services/2006/types" soap:mustUnderstand="0" />' +
//         '  </soap:Header>' +
//         '  <soap:Body>' +
//         '    <GetItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"' +
//         '             xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
//         '      <ItemShape>' +
//         '        <t:BaseShape>Default</t:BaseShape>' +
//         '        <t:IncludeMimeContent>true</t:IncludeMimeContent>' +
//         '      </ItemShape>' +
//         '      <ItemIds>' +
//         '        <t:ItemId Id="' + id + '"/>' +
//         '      </ItemIds>' +
//         '    </GetItem>' +
//         '  </soap:Body>' +
//         '</soap:Envelope>';

//         return request;
//     }

//     function buttonLoader(objElement, content, status){
//         if(status === 1){
//               $('button').prop("disabled", true);
//               $(objElement).html(
//                 '<i class="fa fa-spinner fa-spin"></i> '+content+'...'
//               );
//         }else{
//              $('button').prop("disabled", false);
//              $(objElement).html(content);
//         }	
//     }
// })();
