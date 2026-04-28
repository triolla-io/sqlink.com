//Content/scripts/
var twitterscreenname;
var facebookpageurl;

twitterscreenname = $('#valTwitterUrl').val();

facebookpageurl = $('#valFacebookUrl').val();

facebookpageurl = "http://facebook.com/" + facebookpageurl;

function callFaceBook() {
    document.location.href = facebookpageurl;

}
function callTwitter() {

    doTwitterFollow($('#valSLUserid').val(), twitterscreenname);

}

function gotoSharePage(action) {

    if (!window.location.hash) window.location.hash = '';
    var returnUrl = document.location.href.replace(/#(.)*/g, "");

    document.location.href = "share?action=" + action
        + "&userId=" + encodeURIComponent($('#valSLUserid').val())
        + "&shareMessage=" + encodeURIComponent($('#valSharetext').val())
        + "&returnUrl=" + encodeURIComponent(returnUrl);
}

function share(action) {

    $("#messageDiv").html($("#txtSharing").val());
    if (action === 'Facebook') {
        doFacebookShare($('#valSLUserid').val(), $('#txtShareMessage').val());
    }
    else if (action === 'Twitter') {
        doTwitterShare($('#valSLUserid').val(), $('#txtShareMessage').val());
    }
    else if (action === 'LinkedIn') {
        doLinkedInShare($('#valSLUserid').val(), $('#txtShareMessage').val());
    }
}


window.addEventListener("load", function () {
    setTimeout(function () {
        window.scrollTo(0, 1);
        $('#share1').css("z-index", "1");
    }, 0);
});

window.addEventListener("orientationchange", function () {
    setTimeout(function () {
        window.scrollTo(0, 1);
        $('#share1').css("z-index", "1");
    }, 0);
});

$(document).ready(function () {
    $(window).bind('touchmove', function () {
        $('#share1').css("z-index", "-1");
    });
});

function setPosition() {
    // iPhone or iPad
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        // version >=5  iPhone OS 4_0 like Mac OS X
        if (navigator.userAgent.match(/OS [5-9]_\d[_\d]* like Mac OS X/i)) {

        } else {
            $("#share").css("position", "static");
        }
    }

    // Android
    if (navigator.userAgent.match(/Android/i)) {
        // version >=2.2 Linux; U; Android 2.2; en-gb; GT-P1000 Build/FROYO
        if (navigator.userAgent.match(/Android[/\s]?2.[2-9][.\d]*/i) || navigator.userAgent.match(/Android [3-9][.\d]*/i)) {

        } else {
            $("#share").css("position", "static");
        }
    }

    // Windows Phone
    if (navigator.userAgent.match(/Windows Phone OS/i)) {

        $("#share").css("position", "static");

    }

}

function clickLink(codeId, codesetId, codeName, clickTitle, clickUrl, clickContent) {
    var dataUrl = "cmtrk";
    dataUrl = dataUrl + "?codeId=" + codeId;
    dataUrl = dataUrl + "&clickType=" + codesetId;
    dataUrl = dataUrl + "&codeName=" + encodeURIComponent(codeName);
    dataUrl = dataUrl + "&clickTitle=" + encodeURIComponent(clickTitle);
    dataUrl = dataUrl + "&clickUrl=" + encodeURIComponent(clickContent != null ? clickContent : clickUrl);
    $.ajax({
        url: dataUrl,
        type: "GET",
        dataType: "json",
        success: function (data) {
            window.location.href = clickUrl;
        },
        error: function (data) {
            window.location.href = clickUrl;
        }
    });
}



function sendToFriend() {
    location.href = "mailto:?subject=" + location.href.replace('&', '%26');
}

function sendToFriend(url) {
    location.href = "mailto:?subject=" + url.replace('&', '%26');
}


$('.closeIt').on('click tap', function (e) {
    closeLightbox();

});
$(document).on('click tap', function (e) {

    var $this = $(e.target);
    if (!$this.closest('.open_lightbox').length && !$this.closest('.lightboxNew .btn_submit').length
        && !$this.closest('.lightboxNew .box .inner').length
        && !$this.closest('.lightboxNew .box').length
        && !$this.closest('#lightbox .box').length
        && !$this.closest('#lightbox #popupLinkedIn').length
        && !$this.closest('#openRegister').length
        && $('#lightbox.active').length > 0
        && !$('#lightbox').hasClass('corona'))

        closeLightbox();

});

// Open / close lightbox
function openLightbox($thisLightbox, callback) {
    var $lightboxCont = $('#lightbox');
    if (!$lightboxCont.hasClass('active')) {
        $('#lightbox .box').hide();
        $($thisLightbox).show();
        $lightboxCont.addClass('active');
        $lightboxCont.trigger("lightboxOpened");
        TweenMax.fromTo('#lightbox ' + $thisLightbox, 0.3, { scale: 0.95 }, {
            scale: 1, force3D: !0, ease: Power1.easeOut, onComplete: function () {
                if (callback)
                    callback();
            }
        });
    }
}
function closeLightbox() {
    $lightboxCont = $('#lightbox');
    if (!$lightboxCont.find('.box:visible').hasClass('no_close')) {
        $lightboxCont.removeClass('active');
        $lightboxCont.trigger("lightboxClosed");
        TweenMax.to($lightboxCont.find('.box:visible'), 0.2, {
            scale: 0.9, ease: Power1.easeOut, force3D: !0, onComplete: function () {
                $lightboxCont.find('.box').hide();
            }
        });
    }
}

function openSideRegister()
{
    $('#openRegister').on('click tap', function ()
    {
        $('#lightbox').lightbox('open', '.popupRegister');
    });

}
$(document).ready(function ()
{
    $('#openRegister').on('click tap', function ()
    {
        $('#lightbox').lightbox('open', '.popupRegister');
    });
    $('.closePopupImage').on('click tap', function ()
    {
        $('#lightbox').lightbox('close', '#popupImage');
        closeLightbox();
    });

    $('.closeRegister').on('click tap', function ()
    {
        $('#lightbox').lightbox('close', '#popupRegister');
        closeLightbox();
    });


    var field = 'register';
    var url = window.location.href;
 
    if (url.indexOf('?' + field + '=') != -1)
    {
      
        $('#lightbox').lightbox('open', '.popupRegister');
        return true;
    }

    else if (url.indexOf('&' + field + '=') != -1)
    {
        $('#lightbox').lightbox('open', '.popupRegister');
        return true;
    }
    return false
});
openSideRegister();



$(".uploadCVInput").removeClass("messageText");
//files allowed for upload
var hash = {
    '.doc': 1,
    '.docx': 2,
    '.pdf': 3
};

function check_extension(filename, current, obj) {

    var $this = obj;
    var $current = current;
    $($this + ' #errMessageDiv').removeClass("none");
    var re = /\..+$/;
    var ext = filename.match(re);

    $($this + ' .errMessageDiv').addClass("none");
    $($this + ' #noFileMessageDiv').addClass("none");
    if (filename != null) {
        $($current).addClass("messageText");

    }

    if (hash[ext]) {

        $('#sendButton').prop('disabled', false);
        $($this + ' #errMessageDiv').addClass("none");
        return true;
    } else {

        $('#sendButton').prop('disabled', true);
        $($this + ' #errMessageDiv').removeClass("none");
        return false;
    }
}




