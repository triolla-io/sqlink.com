
var recaptchaEvent;
var recaptchaContactCustomer;
var recaptchaContact;
var recaptchaSideForm;
var recaptchaAbuse;
var recaptchaContactMain;
var recaptchaFriends;
var recaptchaSQLabs;
var recaptchaRegister;
var recaptchaSearchJobs;
var recaptchaLinkedIn;


//recaptcha invisible         'badge': 'inline', if you want to see it
var recaptcha_site_key = "6LcctggfAAAAADB_NrylEHWJDvGdfyVRUPSDhP92";
function renderInvisibleReCaptcha(recaptchaID, callbackFunction) {
    return grecaptcha.render(recaptchaID, {
        'sitekey': recaptcha_site_key,
        "theme": "light",
        'size': 'invisible',
        'callback': callbackFunction
    });
}

function onload() {
    var sendEventButton = document.getElementById('sendEventButton');
    if (sendEventButton != null) {

        sendEventButton.onclick = validateEvent;
    }

    var sendContactCustomersButton = document.getElementById('sendContactCustomersButton');
    if (sendContactCustomersButton != null) {

        sendContactCustomersButton.onclick = validateContactCustomers;
    }

    var buttonFriendsSubmit = document.getElementById('buttonFriendsSubmit');
    if (buttonFriendsSubmit != null) {

        buttonFriendsSubmit.onclick = validateFriends;
    }

    //ok
    var buttonContactSubmit = document.getElementById('buttonContactSubmit');
    if (buttonContactSubmit != null) {

        buttonContactSubmit.onclick = validateContact;
    }
    //sendRegisterButton ok
    var buttonRegisterSubmit = document.getElementById('sendRegisterButton');
    if (buttonRegisterSubmit != null) {

        buttonRegisterSubmit.onclick = validateRegister;
    }

    //SearchJobButton-- noneed for captcha on this form
    //var buttonSearchJobSubmit = document.getElementById('SearchJobButton');
    //if (buttonSearchJobSubmit != null)
    //{

    //    buttonSearchJobSubmit.onclick = validateSearchJob;
    //}
    //sendSideCVButton 
    var buttonCVSubmit = document.getElementById('sendSideCVButton');
    if (buttonCVSubmit != null) {
    
        buttonCVSubmit.onclick = validateCV;
    }
    //linkedin
    var buttonLinkedInSubmit = document.getElementById('sendLinkedInButton');
    if (buttonLinkedInSubmit != null)
    {
        buttonLinkedInSubmit.onclick = validateLinkedIn;
    }
}
onload();
function validateEvent(event) {
    event.preventDefault();
    if ($("#EventForm").length > 0) {
        $("#EventForm").validate();
        var isFormValid = $("#EventForm").valid();
        if (isFormValid) {
            if (($('#recaptchaEvent')).length > 0) {
                renderInvisibleReCaptcha('recaptchaEvent', 'onEventFormSubmit')
            }
            grecaptcha.execute(recaptchaEvent);
        }
    }
}


function validateRecruit(event) {
    event.preventDefault();
    if ($("#RecruitForm").length > 0) {
        $("#RecruitForm").validate();
        var isFormValid = $("#RecruitForm").valid();
        if (isFormValid) {
            if (($('#recaptchaRecruit')).length > 0) {
                renderInvisibleReCaptcha('recaptchaRecruit', 'onRecruitFormSubmit')
            }
            grecaptcha.execute(recaptchaRecruit);
        }
    }
}
function validateCV(event) {
    event.preventDefault();

    var $SendCvForm = $('#SideCvForm');
    if ($SendCvForm.length > 0) {

        $SendCvForm.validate();
        var isFormValid = $SendCvForm.valid();
   
        if (isFormValid) {

            if (($('#recaptchaSideForm')).length > 0) {
           
                renderInvisibleReCaptcha('recaptchaSideForm', 'onCvFormSubmit')
            }
            grecaptcha.execute(recaptchaSideForm);
        }
        else {
            $("#SideCvForm input:text, #SideCvForm textarea").first().focus();
        }
    }
}
function validateLinkedIn(event) {
    event.preventDefault();
 
    var $LinkedInForm = $('#LinkedInForm');
    if ($LinkedInForm.length > 0) {

        $LinkedInForm.validate();
        var isFormValid = $LinkedInForm.valid();
    
        if (isFormValid) {

            if (($('#recaptchaLinkedIn')).length > 0) {
                renderInvisibleReCaptcha('recaptchaLinkedIn', 'onLinkedInFormSubmit')
            }
            grecaptcha.execute(recaptchaLinkedIn);
        }
    }
}
function validateContact(event) {
    event.preventDefault();
    if ($("#ContactForm").length > 0) {

        $("#ContactForm").validate();
        var isFormValid = $("#ContactForm").valid();
        //check combo
        if ($('.cselect_select').lenght > 0) {
            if ($('.cselect_select').hasClass('input-validation-error')) {
                $('.cselect_custom .title').addClass('field-validation-error');
            }
            else if ($('.cselect_select').hasClass('valid')) {
                $('.cselect_custom .title').removeClass('field-validation-error');
            }
        }
        if (isFormValid) {

            if (($('#recaptchaContact')).length > 0) {
                renderInvisibleReCaptcha('recaptchaContact', 'onContactFormSubmit')
               }
               grecaptcha.execute(recaptchaContact);
        }
        //else {
        //    $("#ContactForm input:text, #ContactForm textarea").first().focus();
        //}
    }

}
function validateFriends(event) {
    event.preventDefault();
    if ($("#FriendsForm").length > 0) {

        $("#FriendsForm").validate();
        var isFormValid = $("#FriendsForm").valid();
        if (isFormValid) {

            if (($('#recaptchaFriends')).length > 0) {
                renderInvisibleReCaptcha('recaptchaFriends', 'onFriendsFormSubmit')
            }
            grecaptcha.execute(recaptchaFriends);
        }
    }


}
function validateRegister(event) {
    event.preventDefault();
    if ($("#RegisterForm").length > 0) {
    
        $("#RegisterForm").validate();
        var isFormValid = $("#RegisterForm").valid();
        if (isFormValid) {

            if (($('#recaptchaRegister')).length > 0) {
                renderInvisibleReCaptcha('recaptchaRegister', 'onRegisterFormSubmit')

            }
            grecaptcha.execute(recaptchaRegister);
        }
        else {
            
            $("#RegisterForm input:text, #RegisterForm textarea").first().focus();

        }
    }


}
function validateContactCustomers(event) {
    event.preventDefault();
    if ($("#ContactCustomersForm").length > 0) {

        $("#ContactCustomersForm").validate();
        var isFormValid = $("#ContactCustomersForm").valid();
        if (isFormValid) {

            if (($('#recaptchaContactCustomer')).length > 0) {
                renderInvisibleReCaptcha('recaptchaContactCustomer', 'onContactCustomerFormSubmit')

            }
            grecaptcha.execute(recaptchaContactCustomer);
        }
        else
        {
            $("#ContactCustomersForm .input-validation-error:first").focus();
        }
    }


}
function validateSearchJob(event)
{
    event.preventDefault();
    if ($("#SearchJobForm").length > 0)
    {
        $("#SearchJobForm").validate();
        var isFormValid = $("#SearchJobForm").valid();
        if (isFormValid)
        {
            if (($('#recaptchaSearchJob')).length > 0)
            {
                renderInvisibleReCaptcha('recaptchaSearchJob', 'onSearchJobSubmit')
            }
            grecaptcha.execute(recaptchaSearchJob);
        }
    }
}


//onContactCustomerFormSubmit
function onContactCustomerFormSubmit(data) {

    if ($("#ContactCustomersForm #gRecaptchaResponse").val() == '') {
        $("#ContactCustomersForm #gRecaptchaResponse").val(data);
    }
    document.getElementById("ContactCustomersForm").submit();
 
}

//onRegisterFormSubmit
function onRegisterFormSubmit(data) {


    if ($("#RegisterForm #gRecaptchaResponse").val() == '') {
        $("#RegisterForm #gRecaptchaResponse").val(data);

    }
    document.getElementById("RegisterForm").submit();
    pushData();
}
//on event form submit
function onEventFormSubmit(data) {
    if ($("#EventForm #gRecaptchaResponse").val() == '') {
        $("#EventForm #gRecaptchaResponse").val(data);

    }
    document.getElementById("EventForm").submit();
}
//onContactFormSubmit

function onContactFormSubmit(data) {
    if ($("#ContactForm #gRecaptchaResponse").val() == '') {
        $("#ContactForm #gRecaptchaResponse").val(data);

    }
    document.getElementById("ContactForm").submit();
}
//onCvFormSubmit
function onCvFormSubmit(data) {

    if ($("#SideCvForm #gRecaptchaResponse").val() == '') {
        $("#SideCvForm #gRecaptchaResponse").val(data);
    }
    document.getElementById("SideCvForm").submit();
}
//onLinkedInFormSubmit
function onLinkedInFormSubmit(data) {

    if ($("#LinkedInForm #gRecaptchaResponse").val() == '') {
        $("#LinkedInForm #gRecaptchaResponse").val(data);
    }
    document.getElementById("LinkedInForm").submit();
}
//onFriendsFormSubmit
function onFriendsFormSubmit(data) {

    if ($("#FriendsForm #gRecaptchaResponse").val() == '') {
        $("#FriendsForm #gRecaptchaResponse").val(data);
    }
    document.getElementById("FriendsForm").submit();
}
//onInterviewFormSubmit
function onRecruitFormSubmit(data) {

    if ($("#RecruitForm #gRecaptchaResponse").val() == '') {
        $("#RecruitForm #gRecaptchaResponse").val(data);
    }
    document.getElementById("RecruitForm").submit();
}
//onSearchJobSubmit
function onSearchJobSubmit(data)
{

    if ($("#SearchJobForm #gRecaptchaResponse").val() == '')
    {
        $("#SearchJobForm #gRecaptchaResponse").val(data);
    }
    document.getElementById("SearchJobForm").submit();
}


//invisible - recaptcha




