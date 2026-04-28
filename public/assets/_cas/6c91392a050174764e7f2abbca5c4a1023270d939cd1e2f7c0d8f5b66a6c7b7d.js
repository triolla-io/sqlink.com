// Global vars Content/scripts
var mobileRes = 320,
    tabletRes = 768,
    desktopRes = 1024,
    desktopHdRes = 1280,
    appResizeTimer,
    $body = $('body'),
    eventtopHeadTimeline,
    upgradeTime = parseInt($('#counter').attr('data-timeleftminutes')) * 60,
    seconds = upgradeTime,
    $counter_days = $('.counter_days'),
    $counter_hours = $('.counter_hours'),
    $counter_minutes = $('.counter_minutes'),
    $counter_seconds = $('.counter_seconds'),
    $isEng = false;

$(document).ready(function () {

    // On window load
    $(window).on('load', function () {
        // Event top animation
        if ($('#eventtop_head').length > 0) {
            eventtopHeadTimeline.play();
        }
    });

    // On click outside all widgets
    $(document).on('click tap', function (e) {
        var $this = $(e.target);
        if (!$this.closest('.side_form').length)
            $('#side_form').removeClass('open');

    });


    // Event top animation
    if ($('#eventtop_head').length > 0) {
        eventtopHeadTimeline = new TimelineMax({ delay: 0.1 })
            .fromTo('#eventtop_head .cover', 2, { scale: 1.1 }, { scale: 1, delay: 0, force3D: !0, ease: new Ease(BezierEasing(0.25, 0.46, 0.45, 0.94)) }, 0)
            .to('#eventtop_head .title_section', 1.1, { opacity: 1, delay: 0.15, force3D: !0, ease: Power1.easeOut }, 0);

        eventtopHeadTimeline.pause(0);
    }
    // Employee benefits page
    if ($('#employeebenf_page').length > 0) {
        // On click benefits navs
        $('#nav_benefits').on('click', 'a', function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 20,
                    }, 1000, 'easeInOutQuart');
                    return false;
                }
            }
        });
    }

    // On click open top nav mobile
    $('#topmain_nav').on('click', '.toggle_nav', function () {
        $('#topmain_nav').toggleClass('open');
        return false;
    });

    // Careers menu
    $('.menu_link_careers').hover(function () {
        $('.menu_careers').addClass('open');
    }, function () {
        $('.menu_careers').removeClass('open');
    });
    // Carousel init
    if ($('.owl-carousel').length > 0) {
        $('.owl-carousel').each(function () {
            var $main_carousel = $(this),
                numItems = $('.item', this).length,
                loop = $main_carousel.data('loop') == true ? true : false,
                number = $main_carousel.data('number'),
                mouseDrag = $main_carousel.data('mousedrag') ? true : false,
                rtl = $main_carousel.data('rtl') == true ? true : false,
                numbermobile = $main_carousel.data('numbermobile') ? $main_carousel.data('numbermobile') : number,
                numbermobilehor = $main_carousel.data('numbermobilehor') ? $main_carousel.data('numbermobilehor') : number,
                numbertablet = $main_carousel.data('numbertablet') ? $main_carousel.data('numbertablet') : number,
                numberdesktopt = $main_carousel.data('numberdesktopt') ? $main_carousel.data('numberdesktopt') : number,
                numberdesktopw = $main_carousel.data('numberdesktopw') ? $main_carousel.data('numberdesktopw') : number,
                numberdesktopf = $main_carousel.data('numberdesktopf') ? $main_carousel.data('numberdesktopf') : number,
                autoplay = $main_carousel.data('autoplay'),
                autoplayTimeout = $main_carousel.data('autoplaytimeout'),
                autoplaySpeed = $main_carousel.data('autoplayspeed'),
                smartSpeed = $main_carousel.data('smartspeed'),
                animateout = $main_carousel.data('animateout'),
                dots = $main_carousel.data('dots'),
                dotsmobile = $main_carousel.data('dotsmobile') != undefined ? $main_carousel.data('dotsmobile') : dots,
                nav = $main_carousel.data('nav'),
                navmobile = $main_carousel.data('navmobile') != undefined ? $main_carousel.data('navmobile') : nav,
                navtablet = $main_carousel.data('navtablet') != undefined ? $main_carousel.data('navtablet') : nav,
                margini = $main_carousel.data('margin'),
                marginimobile = $main_carousel.data('marginmobile') != undefined ? $main_carousel.data('marginmobile') : margini,
                marginitablet = $main_carousel.data('margintablet') != undefined ? $main_carousel.data('margintablet') : margini,
                stagepadding = $main_carousel.data('stagepadding'),
                stagepaddingmobile = $main_carousel.data('stagepaddingmobile') != undefined ? $main_carousel.data('stagepaddingmobile') : stagepadding,
                stagepaddingtablet = $main_carousel.data('stagepaddingtablet') != undefined ? $main_carousel.data('stagepaddingtablet') : stagepadding,
                stagepaddingdesktopt = $main_carousel.data('stagepaddingt') != undefined ? $main_carousel.data('stagepaddingt') : stagepadding,
                stagepaddingdesktopw = $main_carousel.data('stagepaddingw') != undefined ? $main_carousel.data('stagepaddingw') : stagepadding,
                stagepaddingdesktopf = $main_carousel.data('stagepaddingf') != undefined ? $main_carousel.data('stagepaddingf') : stagepadding;

            $main_carousel.owlCarousel({
                loop: loop,
                number: number,
                rtl: rtl,
                autoplay: autoplay,
                autoplayTimeout: autoplayTimeout,
                autoplaySpeed: autoplaySpeed,
                dots: dots,
                nav: nav,
                navText: ['', ''],
                animateOut: animateout,
                smartSpeed: smartSpeed,
                mouseDrag: mouseDrag,
                onTranslate: function (e) {
                    // Gallery box
                    if ($main_carousel.parents('.gallery_box').length > 0) {
                        $('#gallery_box .thumbs_list .item.active').removeClass('active');
                        $('#gallery_box .thumbs_list .item:eq(' + e.item.index + ')').addClass('active');
                        TweenMax.to('#gallery_box .thumbs_list', 0.6, { scrollTo: { x: $('#gallery_box .thumbs_list .item.active').innerWidth() * $('#gallery_box .thumbs_list .item.active').index(), autoKill: false }, ease: Power1.easeOut });
                    }
                },
                responsive: {
                    5: {
                        items: numbermobile,
                        nav: navmobile,
                        dots: dotsmobile,
                        margin: marginimobile,
                        stagePadding: stagepaddingmobile,
                    },
                    568: {
                        items: numbermobilehor,
                        nav: navmobile,
                        dots: dotsmobile,
                        margin: marginimobile,
                        stagePadding: stagepaddingmobile,
                    },
                    768: {
                        items: numbertablet,
                        nav: navtablet,
                        dots: dots,
                        margin: marginitablet,
                        stagePadding: stagepaddingtablet,
                    },
                    1024: {
                        items: number,
                        nav: nav,
                        dots: dots,
                        margin: margini,
                        stagePadding: stagepadding,
                    },
                    1280: {
                        items: numberdesktopt,
                        margin: margini,
                        stagePadding: stagepaddingdesktopt,
                    },
                    1440: {
                        items: numberdesktopw,
                        margin: margini,
                        stagePadding: stagepaddingdesktopw,
                    },
                    1900: {
                        items: numberdesktopf,
                        margin: margini,
                        stagePadding: stagepaddingdesktopf,
                    }
                },
            });
        });
    }
    /////////////////////MAIN carousel
    // Carousel init
    if ($('.main_carousel').length > 0) {
        $('.main_carousel').each(function () {
            var $main_carousel = $(this),
                numItems = $('.item', this).length,

                loop = numItems > 1 ? $main_carousel.data('loop') : false,
                number = $main_carousel.data('number'),
                items = $main_carousel.data('items'),
                numbermobile = $main_carousel.data('numbermobile') ? $main_carousel.data('numbermobile') : number,
                numbertablet = $main_carousel.data('numbertablet') ? $main_carousel.data('numbertablet') : number,
                autoplay = $main_carousel.data('autoplay'),
                autoplayTimeout = $main_carousel.data('autoplaytimeout'),
                autoplaySpeed = $main_carousel.data('autoplayspeed'),
                smartSpeed = $main_carousel.data('smartspeed'),
                animateout = $main_carousel.data('animateout'),
                dots = $main_carousel.data('dots'),
                nav = $main_carousel.data('nav'),
                navmobile = $main_carousel.data('navmobile') != 'undefined' ? $main_carousel.data('navmobile') : nav;
            navtablet = $main_carousel.data('navtablet') != 'undefined' ? $main_carousel.data('navtablet') : nav;
            margini = $main_carousel.data('margin'),
                marginimobile = $main_carousel.data('marginmobile') != 'undefined' ? $main_carousel.data('marginmobile') : margini;
            marginitablet = $main_carousel.data('margintablet') != 'undefined' ? $main_carousel.data('margintablet') : margini;
            $main_carousel.owlCarousel({
                loop: loop,
                items: items,
                number: number,
                rtl: $('.header .accessibility').css('direction') == 'ltr' ? false : true,
                autoplay: autoplay,
                autoplayTimeout: autoplayTimeout,
                autoplaySpeed: autoplaySpeed,
                autoplayHoverPause: true,
                dots: dots,
                scrollPerPage: true,
                nav: nav,
                navText: ['', ''],
                animateOut: animateout,
                smartSpeed: smartSpeed,
                responsive: {
                    5: {
                        items: numbermobile,
                        nav: navmobile,
                        margin: marginimobile
                    },
                    768: {
                        items: numbertablet,
                        nav: navtablet,
                        margin: marginitablet
                    },
                    1024: {
                        items: number,
                        nav: nav,
                        margin: margini
                    }
                },
                onInitialized: function () {
                    var countItems = numbermobile;
                    if (getViewport_width() >= desktopRes)
                        countItems = number;
                    else if (getViewport_width() < desktopRes && getViewport_width() >= tabletRes)
                        countItems = numbertablet;

                    if ($main_carousel.find('.owl-item').length <= countItems)
                        $main_carousel.find('.owl-controls').hide();
                    else
                        $main_carousel.find('.owl-controls').show();

                    // Hide dots if not need them
                    if ($main_carousel.find('.owl-item:not(.cloned)').length <= countItems)
                        $main_carousel.find('.owl-dot').hide();
                    else
                        $main_carousel.find('.owl-dot').show();
                },
                onResized: function () {
                    var countItems = numbermobile;
                    if (getViewport_width() >= desktopRes)
                        countItems = number;
                    else if (getViewport_width() < desktopRes && getViewport_width() >= tabletRes)
                        countItems = numbertablet;

                    if ($main_carousel.find('.owl-item').length <= countItems)
                        $main_carousel.find('.owl-controls').hide();
                    else
                        $main_carousel.find('.owl-controls').show();

                    // Hide dots if not need them
                    if ($main_carousel.find('.owl-item:not(.cloned)').length <= countItems)
                        $main_carousel.find('.owl-dot').hide();
                    else
                        $main_carousel.find('.owl-dot').show();
                }
            });
            if ($main_carousel.hasClass('gallery_carousel')) {
                $main_carousel.on('changed.owl.carousel', function (event) {
                    var itemIndex = $('.gallery_carousel .owl-item:eq(' + event.item.index + ') .item').data('slidenum');
                    $('.gallery_list li').removeClass('active');
                    $('.gallery_list li[data-slide="' + itemIndex + '"]').addClass('active');
                    if (desktopRes <= getViewport_width())
                        $('.gallery_list').mCustomScrollbar('scrollTo', $('.gallery_list li[data-slide="' + itemIndex + '"]'));
                });
            }
            else if ($main_carousel.hasClass('album_carousel')) {
                $main_carousel.on('changed.owl.carousel', function (event) {
                    var itemIndex = $('.album_carousel .owl-item:eq(' + event.item.index + ') .item').data('slidenum');
                    $('.albumlist_carousel .item').removeClass('active');
                    $('.albumlist_carousel .item[data-slide="' + itemIndex + '"]').addClass('active');
                    $('.albumlist_carousel').trigger('to.owl.carousel', [(itemIndex - 1), 300, true]);
                });
            }


        });
    }

    ///////////////////////

    // Carousel init benefits_carousel
    if ($('.benefits_carousel').length > 0) {
        $('.benefits_carousel').each(function () {
            var $main_carousel = $(this),
                numItems = $('.item', this).length,
                loop = $main_carousel.data('loop') == true ? true : false,
                number = $main_carousel.data('number'),
                mouseDrag = $main_carousel.data('mousedrag') ? true : false,
                rtl = $main_carousel.data('rtl') == true ? true : false,
                numbermobile = $main_carousel.data('numbermobile') ? $main_carousel.data('numbermobile') : number,
                numbermobilehor = $main_carousel.data('numbermobilehor') ? $main_carousel.data('numbermobilehor') : number,
                numbertablet = $main_carousel.data('numbertablet') ? $main_carousel.data('numbertablet') : number,
                numberdesktopt = $main_carousel.data('numberdesktopt') ? $main_carousel.data('numberdesktopt') : number,
                numberdesktopw = $main_carousel.data('numberdesktopw') ? $main_carousel.data('numberdesktopw') : number,
                numberdesktopf = $main_carousel.data('numberdesktopf') ? $main_carousel.data('numberdesktopf') : number,
                autoplay = $main_carousel.data('autoplay'),
                autoplayTimeout = $main_carousel.data('autoplaytimeout'),
                autoplaySpeed = $main_carousel.data('autoplayspeed'),
                smartSpeed = $main_carousel.data('smartspeed'),
                animateout = $main_carousel.data('animateout'),
                dots = $main_carousel.data('dots'),
                dotsmobile = $main_carousel.data('dotsmobile') != undefined ? $main_carousel.data('dotsmobile') : dots,
                nav = $main_carousel.data('nav'),
                navmobile = $main_carousel.data('navmobile') != undefined ? $main_carousel.data('navmobile') : nav,
                navtablet = $main_carousel.data('navtablet') != undefined ? $main_carousel.data('navtablet') : nav,
                margini = $main_carousel.data('margin'),
                marginimobile = $main_carousel.data('marginmobile') != undefined ? $main_carousel.data('marginmobile') : margini,
                marginitablet = $main_carousel.data('margintablet') != undefined ? $main_carousel.data('margintablet') : margini,
                stagepadding = $main_carousel.data('stagepadding'),
                stagepaddingmobile = $main_carousel.data('stagepaddingmobile') != undefined ? $main_carousel.data('stagepaddingmobile') : stagepadding,
                stagepaddingtablet = $main_carousel.data('stagepaddingtablet') != undefined ? $main_carousel.data('stagepaddingtablet') : stagepadding,
                stagepaddingdesktopt = $main_carousel.data('stagepaddingt') != undefined ? $main_carousel.data('stagepaddingt') : stagepadding,
                stagepaddingdesktopw = $main_carousel.data('stagepaddingw') != undefined ? $main_carousel.data('stagepaddingw') : stagepadding,
                stagepaddingdesktopf = $main_carousel.data('stagepaddingf') != undefined ? $main_carousel.data('stagepaddingf') : stagepadding;

            $main_carousel.owlCarousel({
                loop: loop,
                number: number,
                rtl: false,
                autoplay: autoplay,
                autoplayTimeout: autoplayTimeout,
                autoplaySpeed: autoplaySpeed,
                dots: dots,
                nav: nav,
                navText: ['', ''],
                animateOut: animateout,
                smartSpeed: smartSpeed,
                mouseDrag: mouseDrag,
                onTranslate: function (e) {
                    // Gallery box NEW??
                    if ($main_carousel.parents('.gallery_box').length > 0) {
                        $('#gallery_box .thumbs_list .item.active').removeClass('active');
                        $('#gallery_box .thumbs_list .item:eq(' + e.item.index + ')').addClass('active');
                        TweenMax.to('#gallery_box .thumbs_list', 0.6, { scrollTo: { x: $('#gallery_box .thumbs_list .item.active').innerWidth() * $('#gallery_box .thumbs_list .item.active').index(), autoKill: false }, ease: Power1.easeOut });
                    }
                },
                responsive: {
                    5: {
                        items: numbermobile,
                        nav: navmobile,
                        dots: dotsmobile,
                        margin: marginimobile,
                        stagePadding: stagepaddingmobile,
                    },
                    568: {
                        items: numbermobilehor,
                        nav: navmobile,
                        dots: dotsmobile,
                        margin: marginimobile,
                        stagePadding: stagepaddingmobile,
                    },
                    768: {
                        items: numbertablet,
                        nav: navtablet,
                        dots: dots,
                        margin: marginitablet,
                        stagePadding: stagepaddingtablet,
                    },
                    1024: {
                        items: number,
                        nav: nav,
                        dots: dots,
                        margin: margini,
                        stagePadding: stagepadding,
                    },
                    1280: {
                        items: numberdesktopt,
                        margin: margini,
                        stagePadding: stagepaddingdesktopt,
                    },
                    1440: {
                        items: numberdesktopw,
                        margin: margini,
                        stagePadding: stagepaddingdesktopw,
                    },
                    1900: {
                        items: numberdesktopf,
                        margin: margini,
                        stagePadding: stagepaddingdesktopf,
                    }
                },
            });
        });
        $(".title_row").removeClass('hideTitle');
    }

    //events
    if ($('.events_carousel').length > 0) {
        $('.main_carousel').each(function () {
            var $main_carousel = $(this),
                numItems = $('.item', this).length,
                loop = $main_carousel.data('loop') == true ? true : false,
                number = $main_carousel.data('number'),
                mouseDrag = $main_carousel.data('mousedrag') ? true : false,
                rtl = $main_carousel.data('rtl') == true ? true : false,
                numbermobile = $main_carousel.data('numbermobile') ? $main_carousel.data('numbermobile') : number,
                numbermobilehor = $main_carousel.data('numbermobilehor') ? $main_carousel.data('numbermobilehor') : number,
                numbertablet = $main_carousel.data('numbertablet') ? $main_carousel.data('numbertablet') : number,
                numberdesktopt = $main_carousel.data('numberdesktopt') ? $main_carousel.data('numberdesktopt') : number,
                numberdesktopw = $main_carousel.data('numberdesktopw') ? $main_carousel.data('numberdesktopw') : number,
                numberdesktopf = $main_carousel.data('numberdesktopf') ? $main_carousel.data('numberdesktopf') : number,
                autoplay = $main_carousel.data('autoplay'),
                autoplayTimeout = $main_carousel.data('autoplaytimeout'),
                autoplaySpeed = $main_carousel.data('autoplayspeed'),
                smartSpeed = $main_carousel.data('smartspeed'),
                animateout = $main_carousel.data('animateout'),
                dots = $main_carousel.data('dots'),
                dotsmobile = $main_carousel.data('dotsmobile') != undefined ? $main_carousel.data('dotsmobile') : dots,
                nav = $main_carousel.data('nav'),
                navmobile = $main_carousel.data('navmobile') != undefined ? $main_carousel.data('navmobile') : nav,
                navtablet = $main_carousel.data('navtablet') != undefined ? $main_carousel.data('navtablet') : nav,
                margini = $main_carousel.data('margin'),
                marginimobile = $main_carousel.data('marginmobile') != undefined ? $main_carousel.data('marginmobile') : margini,
                marginitablet = $main_carousel.data('margintablet') != undefined ? $main_carousel.data('margintablet') : margini,
                stagepadding = $main_carousel.data('stagepadding'),
                stagepaddingmobile = $main_carousel.data('stagepaddingmobile') != undefined ? $main_carousel.data('stagepaddingmobile') : stagepadding,
                stagepaddingtablet = $main_carousel.data('stagepaddingtablet') != undefined ? $main_carousel.data('stagepaddingtablet') : stagepadding,
                stagepaddingdesktopt = $main_carousel.data('stagepaddingt') != undefined ? $main_carousel.data('stagepaddingt') : stagepadding,
                stagepaddingdesktopw = $main_carousel.data('stagepaddingw') != undefined ? $main_carousel.data('stagepaddingw') : stagepadding,
                stagepaddingdesktopf = $main_carousel.data('stagepaddingf') != undefined ? $main_carousel.data('stagepaddingf') : stagepadding;

            $main_carousel.owlCarousel({
                loop: loop,
                number: number,
                rtl: false,
                autoplay: autoplay,
                autoplayTimeout: autoplayTimeout,
                autoplaySpeed: autoplaySpeed,
                dots: dots,
                nav: nav,
                navText: ['', ''],
                animateOut: animateout,
                smartSpeed: smartSpeed,
                mouseDrag: mouseDrag,
                onTranslate: function (e) {
                    // Gallery box NEW??
                    if ($main_carousel.parents('.gallery_box').length > 0) {
                        $('#gallery_box .thumbs_list .item.active').removeClass('active');
                        $('#gallery_box .thumbs_list .item:eq(' + e.item.index + ')').addClass('active');
                        TweenMax.to('#gallery_box .thumbs_list', 0.6, { scrollTo: { x: $('#gallery_box .thumbs_list .item.active').innerWidth() * $('#gallery_box .thumbs_list .item.active').index(), autoKill: false }, ease: Power1.easeOut });
                    }
                },
                responsive: {
                    5: {
                        items: numbermobile,
                        nav: navmobile,
                        dots: dotsmobile,
                        margin: marginimobile,
                        stagePadding: stagepaddingmobile,
                    },
                    568: {
                        items: numbermobilehor,
                        nav: navmobile,
                        dots: dotsmobile,
                        margin: marginimobile,
                        stagePadding: stagepaddingmobile,
                    },
                    768: {
                        items: numbertablet,
                        nav: navtablet,
                        dots: dots,
                        margin: marginitablet,
                        stagePadding: stagepaddingtablet,
                    },
                    1024: {
                        items: number,
                        nav: nav,
                        dots: dots,
                        margin: margini,
                        stagePadding: stagepadding,
                    },
                    1280: {
                        items: numberdesktopt,
                        margin: margini,
                        stagePadding: stagepaddingdesktopt,
                    },
                    1440: {
                        items: numberdesktopw,
                        margin: margini,
                        stagePadding: stagepaddingdesktopw,
                    },
                    1900: {
                        items: numberdesktopf,
                        margin: margini,
                        stagePadding: stagepaddingdesktopf,
                    }
                },
            });
        });
        $(".title_row").removeClass('hideTitle');
    }
    // Custom scrollbar
    if ($('.scrollbar-inner').length > 0) {
        $('.scrollbar-inner').scrollbar();
    }

    // Gallery box
    if ($('#gallery_box').length > 0) {
        $('#gallery_box').on('click', '.thumbs_list .item a', function () {
            $('#gallery_box .main_carousel').trigger('to.owl.carousel', [$(this).parents('.item').index(), 600, true]);
            return false;
        });
    }

    // Checkbox & Radiobox custom
    //if ($('.checkbox,.radiobox').length > 0) {
    //    customRadioboxCheckbox($body);
    //}

    // Counter
    if ($('.counter').length > 0) {
        var countdownTimer = setInterval('countdown()', 1000);
    }

    // Input file
    if ($('.input_file').length > 0) {
        $('.input_file').on('change', 'input[type="file"]', function () {
            var filename = $(this).val().split('\\').pop();
            $(this).parent().find('.filename').text(filename);
        })
    }

    // Input file
    if ($('#side_form').length > 0) {
        $('#side_form').on('click', '.btn_open', function () {
            $('#side_form').addClass('open');
            return false;
        });
        $('#side_form').on('click', '.btn_close', function () {
            $('#side_form').removeClass('open');
            return false;
        });
    }


    // List slice
    if ($('.list_slice').length > 0)
        $('.list_slice').listSlice();

    // Lightbox
    if ($('#lightbox').length > 0) {
        $('#lightbox').lightbox({
            afterClose: function () {
                $('#lightbox .popup_video .iframe').attr('src', '');
                $('#lightbox .popup_image .image').attr('src', '');
            }
        });

        $('#gallery_videos .list .inner').on('click tap', function () {
            $('#lightbox .popup_video .iframe').attr('src', $(this).attr('data-videourl'));
        });

        $('#gallery_images .list .inner').on('click tap', function () {
            $('#lightbox .popup_image .image').attr('src', $(this).attr('data-imageurl'));
        });
    }

    //popup_careerc ay

    $('.sendPopupCV, .sendPopupCVinner').on('click tap', function () {
        $(".popupSendCV").removeClass('hide');

        setTimeout(function () {
            $('#lightbox').lightbox('open', '.popup_careerc');
        }, 10)

    });


    //popupLinkedInOpen
    $('.popupLinkedInOpen').on('click tap',function () {
        $(".popupLinkedIn").removeClass('hide');

        setTimeout(function () {
            $('#lightbox').lightbox('open', '.popupLinkedIn');
        }, 10)
    });




    //close_lightbox
    //$(document).bind('keydown', function (e) {
    //    if (e.which == 27) {
    //        $("#popupLinkedIn").hide();
    //        $("#popupSendCV").hide();
    //    }
    //}); 

    //$('.close_lightbox').on('click tap',function () {
    //    $(".popupLinkedIn").hide();
    //    $(".popupSendCV").hide();

    //})
});

// Functions
// Recognize ie
function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

// IE9 and older placeholder support
!function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery) }(function (a) { function b(b) { var c = {}, d = /^jQuery\d+$/; return a.each(b.attributes, function (a, b) { b.specified && !d.test(b.name) && (c[b.name] = b.value) }), c } function c(b, c) { var d = this, f = a(d); if (d.value == f.attr("placeholder") && f.hasClass(m.customClass)) if (f.data("placeholder-password")) { if (f = f.hide().nextAll('input[type="password"]:first').show().attr("id", f.removeAttr("id").data("placeholder-id")), b === !0) return f[0].value = c; f.focus() } else d.value = "", f.removeClass(m.customClass), d == e() && d.select() } function d() { var d, e = this, f = a(e), g = this.id; if ("" === e.value) { if ("password" === e.type) { if (!f.data("placeholder-textinput")) { try { d = f.clone().attr({ type: "text" }) } catch (h) { d = a("<input>").attr(a.extend(b(this), { type: "text" })) } d.removeAttr("name").data({ "placeholder-password": f, "placeholder-id": g }).bind("focus.placeholder", c), f.data({ "placeholder-textinput": d, "placeholder-id": g }).before(d) } f = f.removeAttr("id").hide().prevAll('input[type="text"]:first').attr("id", g).show() } f.addClass(m.customClass), f[0].value = f.attr("placeholder") } else f.removeClass(m.customClass) } function e() { try { return document.activeElement } catch (a) { } } var f, g, h = "[object OperaMini]" == Object.prototype.toString.call(window.operamini), i = "placeholder" in document.createElement("input") && !h, j = "placeholder" in document.createElement("textarea") && !h, k = a.valHooks, l = a.propHooks; if (i && j) g = a.fn.placeholder = function () { return this }, g.input = g.textarea = !0; else { var m = {}; g = a.fn.placeholder = function (b) { var e = { customClass: "placeholder" }; m = a.extend({}, e, b); var f = this; return f.filter((i ? "textarea" : ":input") + "[placeholder]").not("." + m.customClass).bind({ "focus.placeholder": c, "blur.placeholder": d }).data("placeholder-enabled", !0).trigger("blur.placeholder"), f }, g.input = i, g.textarea = j, f = { get: function (b) { var c = a(b), d = c.data("placeholder-password"); return d ? d[0].value : c.data("placeholder-enabled") && c.hasClass(m.customClass) ? "" : b.value }, set: function (b, f) { var g = a(b), h = g.data("placeholder-password"); return h ? h[0].value = f : g.data("placeholder-enabled") ? ("" === f ? (b.value = f, b != e() && d.call(b)) : g.hasClass(m.customClass) ? c.call(b, !0, f) || (b.value = f) : b.value = f, g) : b.value = f } }, i || (k.input = f, l.value = f), j || (k.textarea = f, l.value = f), a(function () { a(document).delegate("form", "submit.placeholder", function () { var b = a("." + m.customClass, this).each(c); setTimeout(function () { b.each(d) }, 10) }) }), a(window).bind("beforeunload.placeholder", function () { a("." + m.customClass).each(function () { this.value = "" }) }) } });
$('input, textarea').placeholder();

// Get viewport width and height
function getViewport_width() {
    var viewPortWidth;
    if (typeof window.innerWidth != 'undefined') { viewPortWidth = window.innerWidth }
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) { viewPortWidth = document.documentElement.clientWidth }
    else { viewPortWidth = document.getElementsByTagName('body')[0].clientWidth; }
    return viewPortWidth;
}

function getViewport_height() {
    var viewPortHeight;
    if (typeof window.innerHeight != 'undefined') { viewPortHeight = window.innerHeight }
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientHeight != 'undefined' && document.documentElement.clientHeight != 0) { viewPortHeight = document.documentElement.clientHeight }
    else { viewPortHeight = document.getElementsByTagName('body')[0].clientHeight; }
    return viewPortHeight;
}

// Custom radiobox & checkbox
function customRadioboxCheckbox($container) {
    //var $input = $container.find('.checkbox,.radiobox');
    //$input.each(function(index){
    //    var $thisInput = $(this).find('input'),
    //        inputType = $thisInput.attr('type')=='radio' ? 'radiobox' : 'checkbox',
    //        inputHtml = inputType == 'checkbox' ? '<span class="check_c"></span>' : '<span class="radio_c"></span>',
    //        $thisID ='Agree' ;//  inputType+'_'+index;
    //    $thisInput.attr('id',$thisID).next('label').attr({'for':$thisID}).prepend(inputHtml);
    //});
}

function getBool(val) {
    return !!JSON.parse(String(val).toLowerCase());
}
function isEng() {
    return getBool($isEng);
}

//for side sendCV form :anna
$(document).ready(function () {
    if ($('.checkbox.sideCV .check_c').hasClass('selected')) {
        //$($('.checkbox.sideCV').find("input").prop('checked', true));
        $('.checkbox.sideCV .check_c').removeClass('selected')
        $($('.checkbox.sideCV').find("input").prop('checked', false));
    }
  
    $('.checkbox.sideCV input').change(function () {        
        var isChecked = $(this).is(':checked');
        $($('.checkbox.sideCV').find("input").prop('checked', isChecked));

        if ($(this).is(':checked')) {
            $('.checkbox.sideCV .check_c').addClass('selected')
        }
        else {
            $('.checkbox.sideCV .check_c').removeClass('selected')
        }
    });


    //friendFields
    $('.friendFields').hide();
    if ($('.checkbox2 .check_c2').hasClass('selected')) {
        $($('.checkbox2').find("input").prop('checked', true));
    }
    $('.checkbox2 input').change(function () {

        if ($(this).is(':checked')) {

            $(this).parent().parent().prev().find("input").prop('checked', true);
            $('.checkbox2 .check_c2').addClass('selected');
            $('.friendFields').show();
            $('.event_twocol').css("min-height", "1100px");

        }
        else {

            $(this).parent().parent().prev().find("input").prop('checked', false);
            $('.checkbox2 .check_c2').removeClass('selected');
            $('.friendFields').hide();
            $('.event_twocol').css("min-height", "940px");
        }
    });

});


// Input file

// Countdown function
function countdown() {
    var days = Math.floor(seconds / 24 / 60 / 60);
    var hoursLeft = Math.floor((seconds) - (days * 86400));
    var hours = Math.floor(hoursLeft / 3600);
    var minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
    var minutes = Math.floor(minutesLeft / 60);
    var remainingSeconds = seconds % 60;

    if (hours < 10)
        hours = "0" + hours;

    if (minutes < 10)
        minutes = "0" + minutes;

    if (remainingSeconds < 10)
        remainingSeconds = "0" + remainingSeconds;

    $counter_days.text(days);
    $counter_hours.text(hours);
    $counter_minutes.text(minutes);
    $counter_seconds.text(remainingSeconds);

    if (seconds == 0) {
        clearInterval(countdownTimer);
        document.getElementById('countdown').innerHTML = "Completed";
    } else {
        seconds--;
    }
}


/*aside-bottom*/

if ($('#asideForm').length > 0) {

    $('#asideForm').on('click', function (e) {
        if ($(e.target).is('input') || $(e.target).is('button')) {
            return;
        }
        $('#asideForm #sendCvPartial').toggle("slow", function () {
            $('#asideForm #sendCvPartial').addClass('open');
            //$('gentrix-chat').css('display', 'none');
            $('#asideForm #sendCvPartial').removeClass('none');

        });
        return false;
    });

}




var asideBottom = function (e) {

    if ($(e.target).is('input') || $(e.target).is('button')) {
        return;
    }
    var elem = $('.aside-bottom');
    var sendCvPartial = $('#sendCvPartial');
    var headerHeight = elem.find('.header').outerHeight();
    var mainHeight = elem.find('.formContact').outerHeight();
    var elmHeight = headerHeight + mainHeight;

    if (elem.hasClass('move')) {

        sendCvPartial.addClass('help');
        sendCvPartial.removeClass('none');
        elem.removeClass("move");

        elem.outerHeight(elmHeight);
    }
    else {

        elem.outerHeight(headerHeight);
        sendCvPartial.addClass('none');
        elem.addClass("move");
    }

    e.preventDefault();
}

