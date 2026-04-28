    // Mixel WCAG
        var mixelWcag = mixelWcag = function () {

            // Rgba color
            function RGBColor(e){this.ok=!1,"#"==e.charAt(0)&&(e=e.substr(1,6)),e=e.replace(/ /g,""),e=e.toLowerCase();var f={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"};for(var a in f)e==a&&(e=f[a]);for(var r=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(e){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}},{re:/^(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function(e){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}},{re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(e){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}}],t=0;t<r.length;t++){var d=r[t].re,l=r[t].process,n=d.exec(e);n&&(channels=l(n),this.r=channels[0],this.g=channels[1],this.b=channels[2],this.ok=!0)}this.r=this.r<0||isNaN(this.r)?0:this.r>255?255:this.r,this.g=this.g<0||isNaN(this.g)?0:this.g>255?255:this.g,this.b=this.b<0||isNaN(this.b)?0:this.b>255?255:this.b,this.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"},this.toHex=function(){var e=this.r.toString(16),f=this.g.toString(16),a=this.b.toString(16);return 1==e.length&&(e="0"+e),1==f.length&&(f="0"+f),1==a.length&&(a="0"+a),"#"+e+f+a},this.getHelpXML=function(){for(var e=new Array,a=0;a<r.length;a++)for(var t=r[a].example,d=0;d<t.length;d++)e[e.length]=t[d];for(var l in f)e[e.length]=l;var n=document.createElement("ul");n.setAttribute("id","rgbcolor-examples");for(var a=0;a<e.length;a++)try{var i=document.createElement("li"),o=new RGBColor(e[a]),s=document.createElement("div");s.style.cssText="margin: 3px; border: 1px solid black; background:"+o.toHex()+"; color:"+o.toHex(),s.appendChild(document.createTextNode("test"));var c=document.createTextNode(" "+e[a]+" -> "+o.toRGB()+" -> "+o.toHex());i.appendChild(s),i.appendChild(c),n.appendChild(i)}catch(b){}return n}}


            var $bodym = $('body');

            var datgWcagLang = $bodym.attr('data-wcaglang')=='ltr' ? 'ltr' : 'rtl';
            var lang_he = ['סרגל נגישות','נגישות','סגור סרגל נגישות','הגדלת טקסט','הקטנת טקסט','גווני אפור','שינוי ניגודיות','ניווט בעזרת מקלדת','עצירת תנועתיות','הצהרת נגישות','איפוס הגדרות'];
            var lang_en = ['Accessibility toolbar','','Close accessibility toolbar','Increase text','Decrease text','Grayscale colors','Change colors contrast','Navigate with keyboard','Motility stopping','Accessibility statement','Reset settings'];
            var lang = datgWcagLang=='ltr' ? lang_en : lang_he;

            var render = function () {

                // Render Css
                   // $bodym.removeAttr('data-wcaglang')
                // Render html
                    var container = $('<div/>', {'class': 'mixelwcag','id':'mixelwcag'}).append(
                                        $('<a/>', {'href': 'javascript:;','title':lang[0],'tabindex':'2','class':'open','html':'<span class="iconw iconw-chair"></span>'+lang[1]})
                                    ).append(
                                        $('<div/>', {'class': 'box'}).append(
                                            $('<a/>', {'href': 'javascript:;','title':lang[2],'class':'close','html':'<span class="iconw iconw-close"></span>'})
                                        ).append(
                                            $('<ul/>').append(
                                                $('<li/>').append($('<a/>', {'href': 'javascript:;','title':lang[3],'class':'fontsize plus','html':'<span class="iconw iconw-textp"></span>'+lang[3]+'</a>'}))
                                            )
                                            .append(
                                                $('<li/>').append($('<a/>', {'href': 'javascript:;','title':lang[4],'class':'fontsize minus','html':'<span class="iconw iconw-textm"></span>'+lang[4]+'</a>'}))
                                            )
                                            .append(
                                                $('<li/>').append($('<a/>', {'href': 'javascript:;','title':lang[5],'class':'color','html':'<span class="iconw iconw-color"></span>'+lang[5]+'</a>'}))
                                            )
                                            .append(
                                                $('<li/>').append($('<a/>', {'href': 'javascript:;','title':lang[6],'class':'contrast','html':'<span class="iconw iconw-contrast"></span>'+lang[6]+'</a>'}))
                                            )
                                            .append(
                                                $('<li/>').append($('<a/>', {'href': 'javascript:;','title':lang[7],'class':'keyboard','html':'<span class="iconw iconw-keyboard"></span>'+lang[7]+'</a>'}))
                                            )
                                            //.append(
                                            //    $('<li/>').append($('<a/>', {'href': 'javascript:;','title':lang[8],'class':'motion','html':'<span class="iconw iconw-motion"></span>'+lang[8]+'</a>'}))
                                            //)
                                                       .append(
                                             $('<li/>').append($('<a/>', { 'href': '/accessibility/', 'title': lang[9], 'class': 'info', 'html': '<span class="iconw iconw-info"></span>' + lang[9] + '</a>' }))
                                            )
                                            .append(
                                                $('<li/>').append($('<a/>', {'href': 'javascript:;','title':lang[10],'class':'reset','html':'<span class="iconw">-</span>'+lang[10]}))
                                            )
                                        )
                                    );

                     $bodym.append(container);

                // Set global vars
                    var $container = $('#mixelwcag');

                // Check cookies on load
                    cookies();

                // On click 0 key
                    $(window).bind('keypress', function(e) {
                        var code = e.keyCode || e.which;
                        if(code == 48) {
                            tablinks();
                            $container.toggleClass('active');
                        }
                    });

                // On click open
                    $container.on('click','.open',function(){
                        $container.toggleClass('active');
                        tablinks();
                        return false;
                    });

                // On click close
                    $container.on('click','.close',function(){
                        $container.removeClass('active');
                        return false;
                    });

                // On click outside all widgets
                    $(document).on('click tap', function(e) {
                        var $this = $(e.target);
                        if(!$this.closest('#mixelwcag').length && $('#mixelwcag').hasClass('active'))
                            $container.removeClass('active');

                    });

                // On click link function
                    $container.on('click','.box a',function(){
                        var $this = $(this),
                            thisClass = $this.attr('class').split(' ');

                        switch(thisClass[0])
                        {
                            case 'fontsize':
                                fontResize(false,false,thisClass[1]);
                                break;
                            case 'color':
                                invertColors(true);
                                color(0,false);
                                break;
                            case 'contrast':
                                color(0,true);
                                invertColors(false);
                                break;
                            //case 'motion':
                            //    stopmotion(0,false);
                            //    break;
                            case 'keyboard':
                                keyboard(0,false);
                                break;
                            case 'info':
                                window.location.href = "/accessibility/";
                                break;
                            case 'reset':
                                resetWcag();
                                break;
                        }

                        return false;
                    });

                // On resize
                    resize();

            };

            var resize = function () {
                $(window).resize(function() {
                    fontResize(true,false,true);
                });
            };

            var cookies = function () {
                // Font resize
                    var fontsize = parseInt(getCookie('MW_fontsize'));
                    if(fontsize > 0)
                        fontResize(false,fontsize,'plus');

                // Color
                    var colorbw = parseInt(getCookie('MW_color'));
                    if(colorbw > 0)
                        color(1,false);

                // Contrast
                    var contrast = parseInt(getCookie('MW_contrast'));
                    if(contrast > 0)
                        invertColors(false);

                // Motion
                    var motion = parseInt(getCookie('MW_motion'));
                    if(motion > 0)
                        stopmotion(1,false);

                // Keyboard
                    var bykeyboard = parseInt(getCookie('MW_keyboard'));
                    if(bykeyboard > 0)
                        keyboard(1,false);

            };

            var resetWcag = function () {
                // Font resize
                    fontResize(true,false,true);

                // Color
                    color(0,true);

                // Contrast
                    invertColors(true);

                // Motion
                    stopmotion(0,true);

                // Keyboard
                    keyboard(0,true);
            };

            var tablinks = function() {
                if(!$('#mixelwcag').hasClass('tabbed'))
                {
                    var i=3;
                    $('#mixelwcag').find('ul a').each(function(){
                        $(this).attr('tabindex',i++);
                    });
                    $('#mixelwcag').find('.close').attr('tabindex',i++);
                }
            }

            var fontResize = function (reset,setbynum,upordown) {
                var container = $('#mixelwcag .fontsize');
                var elementsAccessArr = '.inner-wrap span:not(:has(*:not(br))),.inner-wrap div:not(:has(*:not(br))),.nav_right span, nav span,.inner-wrap li:not(:has(*:not(br))),.container a:not(:has(*:not(br))),.inner-wrap .desc,.inner-wrap .text,.inner-wrap .label,.inner-wrap strong,h1,h2,h3,h4,h5,h6,input,textarea,select';
                var currentSize = parseInt($bodym.attr('data-fontsize')),
                currentSize = isNaN(currentSize) ? 0 : currentSize;
                var canResize = false;

                if(!reset)
                {
                    if(setbynum)
                            currentSize = 2;
                    if((upordown == 'plus' && currentSize<4) || (upordown == 'minus' && currentSize>0))
                    {
                        if(!setbynum)
                            currentSize = (upordown == 'plus') ? currentSize+2 : currentSize-2;
                        else
                            currentSize = setbynum;

                        $bodym.attr('data-fontsize',currentSize);
                        createCookie('MW_fontsize', currentSize, 365);
                        canResize = true;
                    }

                    if(canResize)
                    {
                        if(currentSize==0)
                        {
                            fontResize(true,false,true);
                        }
                        else
                        {
                            $bodym.addClass('fontresize');
                            $(elementsAccessArr).each(function(){
                                $(this).css({'font-size':'','transition':'none'}).css({'font-size':(parseInt($(this).css('font-size').replace("px", ""))+currentSize),'line-height':(parseInt($(this).css('line-height').replace("px", ""))+currentSize)+'px','transition':''});
                            });
                        }
                    }
                }
                else if(reset && $bodym.hasClass('fontresize'))
                {
                    createCookie('MW_fontsize', 0, 365);
                    $bodym.attr('data-fontsize',0).removeClass('fontresize');
                    $(elementsAccessArr).css('font-size','');
                }
            }

            var color = function (setcolor,reset) {
                var container = $('#mixelwcag .color');
                if((!$bodym.hasClass('black-white') || setcolor) && !reset)
                {
                    $bodym.addClass('black-white');
                    container.addClass('active');
                    createCookie('MW_color', 1, 365);
                }
                else
                {
                    $bodym.removeClass('black-white');
                    container.removeClass('active');
                    createCookie('MW_color', 0, 365);
                }
            }

            function invertElement()
            {
                var colorProperties = ['color', 'background-color'];
                var color = null;
                for (var prop in colorProperties) {
                    prop = colorProperties[prop];
                    if (!$(this).css(prop)) continue;
                    if ($(this).data(prop) != $(this).css(prop)) continue;

                    if (($(this).css(prop) === 'rgba(0, 0, 0, 0)') || ($(this).css(prop) === 'transparent')) {
                        if ($(this).is('body')) {
                            $(this).css(prop, 'black');
                            continue;
                        } else {
                            continue;
                        }
                    }
                    color = new RGBColor($(this).css(prop));
                    if (color.ok) {
                        $(this).css(prop, 'rgb(' + (255 - color.r) + ',' + (255 - color.g) + ',' + (255 - color.b) + ')');
                    }
                    color = null;
                }
            }
            function setColorData()
            {
                var colorProperties = ['color', 'background-color'];
                for (var prop in colorProperties) {
                    if($(this).parents('#mixelwcag').length > 0){

                    }
                    else if($(this).parents('.header').length > 0 && $(this).parents('.bottom').length > 0 && $(this).is( "a" )){
                        $(this).css('color', 'rgb(0, 0, 0)');
                    }
                    else if($(this).parents('.footer').length > 0 && $(this).parents('.bottom').length > 0){
                        $(this).css('color', 'rgb(255, 255, 255)');
                    }
                    else
                    {
                        prop = colorProperties[prop];
                        $(this).data(prop, $(this).css(prop));
                    }
                }
            }
            function isIE()
            {
                var myNav = navigator.userAgent.toLowerCase();
                return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
            }
            var invertColors = function(reset)
            {
                if(isIE())
                {
                    var container = $('#mixelwcag .contrast');
                    if(!$bodym.hasClass('contrast') && !reset)
                    {
                        $bodym.addClass('contrast');
                        container.addClass('active');
                        createCookie('MW_contrast', 1, 365);

                        $(document).on('DOMNodeInserted', function(e) {
                            var $toInvert = $(e.target).find('*').andSelf();
                            $toInvert.each(setColorData);
                            $toInvert.each(invertElement);
                        });
                        $('*').each(setColorData);
                        $('*').each(invertElement);
                        $('iframe').each(function () {
                            $(this).contents().find('*').each(setColorData);
                            $(this).contents().find('*').each(invertElement);
                        });
                    }
                    else
                    {
                        $bodym.removeClass('contrast');
                        container.removeClass('active');
                        createCookie('MW_contrast', 0, 365);
                        $('*').css({'color':'','background-color':''});
                    }
                }
                else
                {
                    var container = $('#mixelwcag .contrast');
                    if(!$bodym.hasClass('contrast') && !reset)
                    {
                        $bodym.addClass('contrast contrast_filter');
                        container.addClass('active');
                        createCookie('MW_contrast', 1, 365);
                    }
                    else
                    {
                        $bodym.removeClass('contrast contrast_filter');
                        container.removeClass('active');
                        createCookie('MW_contrast', 0, 365);
                    }
                }
            }

            var stopmotion = function (setmotion,reset) {
                var container = $('#mixelwcag .motion');
                if((!$bodym.hasClass('noanimations') || setmotion) && !reset)
                {
                    $bodym.addClass('noanimations');
                    container.addClass('active');
                    createCookie('MW_motion', 1, 365);
                }
                else
                {
                    $bodym.removeClass('noanimations');
                    container.removeClass('active');
                    createCookie('MW_motion', 0, 365);
                }
            }

            var keyboard = function (setkeyboard,reset) {
                var container = $('#mixelwcag .keyboard');
                if((!$bodym.hasClass('keyboard') || setkeyboard) && !reset)
                {
                    $bodym.addClass('keyboard');
                    container.addClass('active');
                    createCookie('MW_keyboard', 1, 365);
                }
                else
                {
                    $bodym.removeClass('keyboard');
                    container.removeClass('active');
                    createCookie('MW_keyboard', 0, 365);
                }
            }

            var createCookie = function(name, value, days) {
                var expires;
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toGMTString();
                }
                else {
                    expires = "";
                }
                document.cookie = name + "=" + value + expires + "; path=/";
            }

            var getCookie = function(c_name) {
                if (document.cookie.length > 0) {
                    c_start = document.cookie.indexOf(c_name + "=");
                    if (c_start != -1) {
                        c_start = c_start + c_name.length + 1;
                        c_end = document.cookie.indexOf(";", c_start);
                        if (c_end == -1) {
                            c_end = document.cookie.length;
                        }
                        return unescape(document.cookie.substring(c_start, c_end));
                    }
                }
                return "";
            }

            return {
                render: render,
            };
        }();

        mixelWcag.render();