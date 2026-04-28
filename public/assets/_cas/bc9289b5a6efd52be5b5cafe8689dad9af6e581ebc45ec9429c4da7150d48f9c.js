//for sendJobsCv

$(".uploadCVInput").removeClass("messageText");
//files allowed for upload
var hash = {
    '.doc': 1,
    '.docx': 2,
    '.pdf': 3
};

function check_extension(filename,current, obj) {

    var $this = obj;
    var $current = current;
 
    $($this + ' #errMessageDiv').removeClass("none");
    var re = /\..+$/;
    var ext = filename.match(re);
    $($current).parent().find('.errMessageDiv').addClass("none");
  //  $($parent + ' .errMessageDiv').addClass("none");
    $($current).parent().find('.noFileMessageDiv').addClass("none");
  //  $($parent + ' #noFileMessageDiv').addClass("none");
    if (filename != null)
    {
        $($current).addClass("messageText");

    }

    if (hash[ext]) {

        $('#sendButton').prop('disabled', false);
        $($current).parent().find('.errMessageDiv').addClass("none");
       // $($parent + ' .errMessageDiv').addClass("none");
        return true;
    } else {

        $('#sendButton').prop('disabled', true);
        $($current).parent().find('.errMessageDiv').removeClass("none");
       // $($parent + ' .errMessageDiv').removeClass("none");
        return false;
    }
}
//side_form
function check_extensionSIDE(filename, obj) {

    var $this = obj;
    $($this + ' #errMessageDivSIDE').removeClass("none");
    var re = /\..+$/;
    var ext = filename.match(re);

    $($this + ' #errMessageDivSIDE').addClass("none");
    $($this + ' #noFileMessageDivSIDE').addClass("none");
    $($this + ' .filename').addClass("messageText");
    if (hash[ext]) {

        $('#sendSideCVButton').prop('disabled', false);
        $($this + ' #errMessageDivSIDE').addClass("none");
        return true;
    } else {

        $('#sendSideCVButton').prop('disabled', true);
        $($this + ' #errMessageDivSIDE').removeClass("none");
        return false;
    }
}



$(document).ready(function () {


    if ($.trim($('#statusSide').html()).length > 0) {
            $('#side_form').addClass('open');

        }
});

//function validateCV() {
//    valid = true;
//    if ($("#fileSideCV").val() == '') {
//        // your validation error action
//        $('#side_form').addClass('open');
//        valid = false;
//    }
//    return valid //true or false
//}

function sendToFriend(url) {
    if (url != null) {
        location.href = "mailto:?subject=" + url.toString().replace('&', '%26');
    }

}

function PopupCenter(url, title, w, h) {

    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}


(function () {
    $.validator.unobtrusive.adapters.addSingleVal("minimumfilesize", "size");
    $.validator.unobtrusive.adapters.addSingleVal("maximumfilesize", "size");
    $.validator.unobtrusive.adapters.addSingleVal("validfiletype", "filetypes");

    $.validator.addMethod('minimumfilesize', function (value, element, minSize) {
        return convertBytesToMegabytes(element.files[0].size) >= parseFloat(minSize);
    });

    $.validator.addMethod('maximumfilesize', function (value, element, maxSize) {
        return convertBytesToMegabytes(element.files[0].size) <= parseFloat(maxSize);
    });

    $.validator.addMethod('validfiletype', function (value, element, validFileTypes) {
        if (validFileTypes.indexOf(',') > -1) {
            validFileTypes = validFileTypes.split(',');
        } else {
            validFileTypes = [validFileTypes];
        }

        var fileType = value.split('.')[value.split('.').length - 1];

        for (var i = 0; i < validFileTypes.length; i++) {
            if (validFileTypes[i] === fileType) {
                return true;
            }
        }

        return false;
    });

    $.validator.unobtrusive.adapters.add('fileuploadvalidator', ['clientvalidationmethods', 'parameters', 'errormessages'], function (options) {
        options.rules['fileuploadvalidator'] = {
            clientvalidationmethods: options.params['clientvalidationmethods'].split(','),
            parameters: options.params['parameters'].split('|'),
            errormessages: options.params['errormessages'].split(',')
        };
    });

    $.validator.addMethod("fileuploadvalidator", function (value, element, param) {
        if (value == "" || value == null || value == undefined) {
            return true;
        }
        //array of jquery validation rule names
        var validationrules = param["clientvalidationmethods"];

        //array of paramteres required by rules, in this case regex patterns
        var patterns = param["parameters"];

        //array of error messages for each rule
        var rulesErrormessages = param["errormessages"];

        var validNameErrorMessage = new Array();
        var index = 0

        for (i = 0; i < patterns.length; i++) {
            var valid = true;
            var pattern = patterns[i].trim();

            //get a jquery validator method.
            var rule = $.validator.methods[validationrules[i].trim()];

            //create a paramtere object
            var parameter = new Object();
            parameter = pattern;

            //execute the rule
            var isValid = rule.call(this, value, element, parameter);

            if (!isValid) {
                //if rule fails, add error message
                validNameErrorMessage[index] = rulesErrormessages[i];
                index++;

            }
        }
        //if we have more than on error message, one of the rule has failed
        if (validNameErrorMessage.length > 0) {
            //update the error message for 'validname' rule
            $.validator.messages.fileuploadvalidator = validNameErrorMessage.toString();
            return false;
        }
        return true;
    }, "This is not a valid individual name"//default error message
    );

    function convertBytesToMegabytes(bytes) {
        return (bytes / 1024) / 1024;
    }
})();