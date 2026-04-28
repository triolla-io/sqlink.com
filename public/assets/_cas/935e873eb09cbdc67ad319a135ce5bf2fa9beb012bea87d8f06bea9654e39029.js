
//	Copyright (c) 2011 Fred Heusschen
//	www.frebsite.nl
////for UpperScroller on HP
///scrollers

//bundled

//$('.menuIcons a').eq(0).addClass('iconOn').removeClass('iconOff');
$('.menuIcons .iconOff').eq(0).addClass('none');
$('.menuIcons .iconOn').eq(0).removeClass('none');
$('.menuIcons .iconOnCover').addClass('none');
$('.menuIcons .iconOnCover').eq(0).removeClass('none');
$(".prevMove").fadeOut();
$(".nextMove").fadeOut();


$(".upperScroller").hover(

function () {
    $(".prevMove").fadeIn(500);
    $(".nextMove").fadeIn(500);
    //   $(".pagination a").fadeIn(500);
}, function () {
    $(".prevMove").fadeOut(500);
    $(".nextMove").fadeOut(500);
    //   $(".pagination a").fadeOut(500);
});

var left = Math.abs((($(window).width() - 2200) / 2)) * (-1);
var top = Math.abs((($(window).height() - 670) / 2)) * (-1);
//$('.innerImage').css('background-position-x', left + 'px');

//CheckWindow();

$(function () {
    if ($('#BGScroller') != null) {
        $('#BGScroller').carouFredSel({
            responsive: true,
            circular: true,
            auto: true,
            // width: $(window).width(),
            // height: $(window).height(),
            height: 671,
            next: '.nextMove',
            prev: '.prevMove',
            items: {
                visible: 1,
                //width: '100%',
                // width: $(window).width(),
                // height: $(window).height()
                height: 671
            },
            scroll: {
                onBefore: function () {
                    var pos = $("#BGScroller").triggerHandler("currentPosition");
                    $('.menuIcons .iconOff').removeClass('none');
                    $('.menuIcons .iconOn').addClass('none');
                    $('.menuIcons .iconOnCover').addClass('none');

                    $('.menuIcons .iconOff').eq(pos).addClass('none');
                    $('.menuIcons .iconOn').eq(pos).removeClass('none');
                    $('.menuIcons .iconOnCover').eq(pos).removeClass('none');
                },

                fx: 'crossfade',
                easing: "linear",
                duration: 1000
                //  mousewheel: true
            }
        });


        $('.menuIcons').carouFredSel({
            responsive: true,
            circular: true,
            align: 'center',
            auto: false,
            width: 1000,
            height: 80,
            items: {
                visible: 8,
                width: 120,
                height: 80
            }

        });



        $('.menuIcons a').click(function () {
            var currentItem = (this.href.split('#').pop());
            // alert(currentItem);
            $('#BGScroller').trigger('slideTo', '#big' + this.href.split('#').pop());
            $('.iconOff').removeClass('none');
            $('.iconOn').addClass('none');
            $('#id' + currentItem + ' .iconOff').addClass('none');
            $('#id' + currentItem + ' .iconOn').removeClass('none');
            return false;
        });


    }

});


function CheckWindow() {
    if ($(window).width() <= 1024) {

        $('.innerImage').css('background-position-y', '-50px');
        $('.innerImage').css('height', '500px');
        $('.innerImage').css('width', '1000px');
        $('.upperScrollerWrapperHP').css('height', '500px');
        $('.upperScroller').css('height', '500px');
        $('.upperScroller .more').css('margin-top', '330px');
    }
}

//////////////////for services on homepage/

$(function () {
    $('.servicesScroller').carouFredSel({
        align: false,
        auto: false,
        infinite: true,
        circular: true,
        width: 936,
        height: 370,
        pagination: ".pagerDiv",
        items: {
            start: "random"
        },
        prev: {
            button: function () {
                return $(this).parents(".frames ").find(".prev");
            }
        },
        next: {
            button: function () {
                return $(this).parents(".frames ").find(".next");
            }
        },
        scroll: {
            fx: "directscroll",
            items: 3,
            width: 312,
            height: 340,
            duration: 300
        }

    });
});

///////////////////////for news scroller

$(function () {
    $('.newsDiv').carouFredSel({
        align: false,
        auto: true,
        infinite: true,
        circular: true,
        width: 1000,
        height: 270,
        pagination: {
            container: ".pager",
            keys: true
        },

        scroll: {
            fx: "directscroll",
            items: 1,
            width: 1000,
            height: 270,
            duration: 1000
        }

    });
});

////////for customers scroller on homepage
$(function () {
    $('#customersScroller').carouFredSel({
        align: false,
        auto: false,
        infinite: true,
        circular: true,
        width: 910,
        height: 71,
        prev: {
            button: function () {
                return $(this).parents(".customerSlider ").find(".prevArr");
            }
        },
        next: {
            button: function () {
                return $(this).parents(".customerSlider ").find(".nextArr");
            }
        },
        scroll: {
            fx: "directscroll",
            items: 6,
            width: 150,
            height: 71,
            duration: 300
        }

    });
});