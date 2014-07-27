(function($, window, document) {

    var prefix = "", _addEventListener, onwheel, support;

    // detect event model
    if (window.addEventListener) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
            document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
            "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    window.addWheelListener = function(elem, callback, useCapture) {

        _addWheelListener(elem, support, callback, useCapture);

        // handle MozMousePixelScroll in older Firefox
        if (support === "DOMMouseScroll") {
            _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
        }
    };

    function _addWheelListener(elem, eventName, callback, useCapture) {
        elem[ _addEventListener ](prefix + eventName, support === "wheel" ? callback : function(originalEvent) {
            !originalEvent && (originalEvent = window.event);

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type === "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                            originalEvent.preventDefault() :
                            originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if (support === "mousewheel") {
                event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback(event);

        }, useCapture || false);
    }

    function __CreateTemp(t) {
        for (var x in t) {
            if (x === 'HOUR') {
                for (var i = 0; i <= 24; i++) {
                    if (i < 10)
                        i = '0' + i.toString();
                    t[x][1] += '<div>' + i + '</div>';
                }
            } else {
                for (var i = 0; i <= 59; i++) {
                    if (i < 10)
                        i = '0' + i.toString();
                    t[x][1] += '<div>' + i + '</div>';
                }
            }

        }
        return t;
    }

    $(function() {
        var TEMP = __CreateTemp({'HOUR': ['<div class="inner hourr">', '', '</div>'],
            'MIN': ['<div class="inner minn">', '', '</div>'],
            'SEC': ['<div class="inner secc">', '', '</div>']});

        $('#time-picker')
                .find('.hour').append(TEMP['HOUR'].join('\n')).end()
                .find('.min').append(TEMP['MIN'].join('\n')).end()
                .find('.sec').append(TEMP['SEC'].join('\n')).end();
    });

    var cfg = {
    };

    document.addEventListener('DOMContentLoaded', function() {
        var EVENT_START = 'mousedown touchstart',
                EVENT_MOVE = 'mousemove touchmove',
                EVENT_END = 'mouseup touchend',
                TRANSITIONEND = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
                h = 75,
                last_cord;

        $(document).on(EVENT_START, '.time', function() {
            var thiz = $(this);
            thiz.on(EVENT_MOVE, function(e) {
                e.preventDefault();
                var margin_top = parseInt(thiz.find('.inner').css('margin-top')),
                        H,
                        maxWheel = -(thiz.hasClass('hour') ? (75 * 24) - 75 :  (75 * 59) - 75),
                        cur_cord = e.type === 'touchmove'
                        ? (function() {
                                var touch = e.originalEvent.touches[0]
                                        || e.originalEvent.changedTouches[0];
                                return touch.pageY;
                            }())
                        : e['pageY'];
                
                if (cur_cord > last_cord) {  
                    if(h > 0 ){
                        return;
                    }                    
                    H = h + 75;
                    thiz.find('.inner').css('margin-top', H);
                } else {
                    if(h <= maxWheel ){
                        return;
                    }
                    H = h - 75;
                    thiz.find('.inner').css('margin-top', H);
                }
                h = H;                
                last_cord = cur_cord;
            })
                    .on(EVENT_END, function(e) {
                thiz.off(EVENT_MOVE);
                thiz.off(EVENT_START);
                thiz.off(EVENT_END);
            });
        });

        var elem = document.getElementById('time-picker');

        window.addWheelListener(elem, function(e) {			
            var obj = e.target.parentNode,
                    len = obj.classList,
                    margin_top = parseInt(obj.style.marginTop, 10) || 0,
                    h = 75,
                    maxWheel = -($(obj).hasClass('hourr') ? (h * 24) - h :  (h * 59) - h)   ;
                    
            if (!$(obj).hasClass('inner')) return;
            if (e.deltaY > 0) {				
                if ((margin_top + h) > h)
                    return;
                obj.style.marginTop = (margin_top + h) + 'px';
            } else {				
                if ((margin_top - h) < maxWheel)
                    return;
                obj.style.marginTop = (margin_top - h) + 'px';
            }
        });

        $(elem).on(TRANSITIONEND, '.time', function() {
            
        });

    });


})(jQuery, window, document);


