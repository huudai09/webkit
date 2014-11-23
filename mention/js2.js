;
(function($, win) {
    win.ZText = (function() {
        var params = Array.prototype.slice.call(arguments)
                , me = {}, _pv = {}, KEY = {}, _ = {}, _feature = {}
        , index = -1
                , _cfg = {
            url: 'response.php',
            preview_url:  'response.php',
            limit_search_in: 1,
            trigger_char: '@',
            max_grow: 1000,
            mode: 'full',
            preview: true,
            atts: {placeholder: 'Bạn đang nghĩ gì ?'},
            avatar: true
        };

        // private variables
        KEY = {BACKSPACE: 8, DEL: 46, TAB: 9, RETURN: 13, ESC: 27, UP: 38, DOWN: 40, SPACE: 32};
        !!params[1]['atts']['class']
                && (params[1]['atts']['class'] = 'mention-textarea ' + params[1]['atts']['class']);
        _cfg = $.extend(_cfg, params[1]);
        _pv.elem = $(params[0]);
        _pv.previewed = false;
        _pv.puzzle = [];
	   _pv.lastPosCarat = 0;
        _pv.patt = {syntax: /@\[(\d+)\:([\w\d]+):([^\]]+)\]/g
                    , tag: /^@([^\s]+)|\s@([^\s]+)/
                    , tag_ucase: /^([A-Z])|\s([A-Z])/
                    , link: /(https?\:\/\/|\s)[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})(\/+[a-z0-9_.\:\;-]*)*(\?[\&\%\|\+a-z0-9_=,\.\:\;-]*)?([\&\%\|\+&a-z0-9_=,\:\;\.-]*)([\!\#\/\&\%\|\+a-z0-9_=,\:\;\.-]*)}*/i
        };
        _pv.tmp = {container: '<div class="mention-area"><div class="mention-inner">'
                    , overlay: '<div class="mention-overlay">'
                    , textarea: '<textarea class="mention-textarea"></textarea>'
                    , mentionbox: '<div class="mention-box"></div>'
                    , preview: '<div class="mention-previewLink"><span class="mention-close">×</span></div>'
                    , syntax_input: '@[{id}:{type}:{value}]'
                    , syntax_highlight: '<b>{value}</b>'
                    , encode: {'<': '&lt;', '>': '&gt;'}
            , css: {
                reset: {
                    'border': '0px',
                    'margin': '0px',
                    'padding': '0px 0px 0px 2px',
                    'white-space': 'pre-wrap',
                    'font-size': '12px',
                    'font-family': 'Tahoma, Arial',
                    'line-height': '20px',
                    'overflow': 'hidden'
                }
                , textarea: {
                    'z-index': 2,
                    'background-color': 'transparent',
                    'resize': 'none'
                }
                , overlay: {
                    'z-index': -1,
                    'position': 'absolute',
                    'word-wrap': 'break-word',
                    'pointer-events': 'none',
                    'color': 'transparent'
                }
            }
        };

        // private methods
        _ = {
            setError: function(msg) {
                throw new Error(msg);
                return;
            }
            , loading: function(method) {
                $('.header-status .ajax-loading-status')[method]();
            }
            , getPointer: function(el) {
                if (el.selectionStart) {
                    return el.selectionStart;
                } else if (document.selection) {
                    el.focus();

                    var r = document.selection.createRange();
                    if (r == null) {
                        return 0;
                    }

                    var re = el.createTextRange(),
                            rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);

                    return rc.text.length;
                }
                return 0;
            }
            , escape: function(str) {
                return str.replace(/<|>/g, function(i) {
                    return _pv.tmp.encode[i];
                });
            }
            , inArray: function(needed, haystack) {
                return !!(Array.isArray(haystack)
                        && haystack.some(function(i) {
                    return needed === i;
                }));
            }
            , inPuzzle: function(id) {
                return _pv.puzzle.some(function(i) {
                    return i.id == id;
                });
            }
            , makeTemp: function(temp, data) {
                Object.keys(data).forEach(function(i) {
                    return !!~temp.indexOf(i) && (temp = temp.replace('{' + i + '}', data[i]));
                });
                return temp;
            }
            , isKey: function(key, ev) {
                return !!(!!ev.keyCode && ev.keyCode === key);
            }
            , isObject: function(o) {
                return !!(!Array.isArray(o) && typeof o === 'object');
            }
        };

        _feature.mention = {
            turn: 'on'
                    , init: function() {
                _pv.elem.hide().attr('js-mention', 'true') // >> fallback if input's type is not hidden type
                        .wrap(_pv.tmp.container)
                        .parent().prepend(_pv.tmp.overlay)
                        .append(_pv.tmp.textarea)
                        .append(_pv.tmp.mentionbox)
                        [_cfg.preview ? 'append' : 'end'](_cfg.preview ? _pv.tmp.preview : null);

                _cfg.atts['js-name'] = _pv.elem[0]['name'];

                this.parent = _pv.elem.parents('.mention-area');
                this.parent.find('.mention-inner').css('position', 'relative');
                this.parent.find('.mention-previewLink').hide();
                this.overlay = this.parent.find('.mention-overlay');
                this.textarea = this.parent.find('.mention-textarea').attr(_cfg.atts);
                this.mentionbox = this.parent.find('.mention-box');

                this.clearPuzzle();
                this.elastic();
                this.overlaying().synchronize().bindingEvts();
            }

            , elastic: function() {
                var thiz = this;
                // input.elastic keydown.elastic paste.elastic cut.elastic
                return this.textarea.on('keyup.elastic', function() {
                            
                    if (this.scrollHeight > this.clientHeight) {
					console.log('aaaaaaaa');
                        this.style.height = '';
                        this.style.height = this.scrollHeight + "px";                        
                    } else {
					console.log('bbbbbbbb');
                        // this.style.height = '';
                        // this.style.height = this.scrollHeight + "px";
                        // thiz.overlay.height(this.scrollHeight);
                    }
                });
            }
            // create a overlay layer
            , overlaying: function() {
                // reset style textarea and sync with the overlay
                this.textarea
                        .css($.extend(_pv.tmp.css.reset, _pv.tmp.css.textarea))
                        .val(_pv.elem.val().replace(_pv.patt.syntax, '$3'));

                this.overlay
                        .css($.extend(_pv.tmp.css.reset, _pv.tmp.css.overlay, {width: this.textarea.width() + 'px', height: this.textarea.height() + 'px'}))
                        .html(_pv.elem.val().replace(_pv.patt.syntax, '<b>$3</b>'));	
			  
			  // get last position carat
			  _pv.patt.tag.test(_pv.elem[0].value) && this.setLastCarat();
			  
			  // collect matched data
                this.collectPuzzle();
				
                return this;
            }
            , setLastCarat: function(){											
				var overlay = this.overlay[0];
				_pv.lastPosCarat = 0;
				
				overlay.childNodes.length > 0 && (function(){
				   var list = overlay.childNodes, 
					   n = list.length, start = false;
									  
				   while(n > 0){
						 var node = list[n-1];
						if(node['nodeType'] === 1 && !start){
							start = true;
						} 
						 
						if(start){
							if(node['nodeType'] === 1){
							   _pv.lastPosCarat += node['innerText'].length;
						  }else{
							   _pv.lastPosCarat += node['nodeValue'].length;
						   }									
						}
						n--;		 
				   }
				   console.log(_pv.lastPosCarat);

				}())				
						
			}				

            , select: function(e) {
                var n = this.mentionbox.children().length;
                if (!n)
                    return;
                this.mentionbox.children().removeClass('active');
                if (_.isKey(KEY.UP, e)) {
                    index = index < 0 ? n - 1 : index;
                    this.mentionbox.children().eq(--index).addClass('active');
                } else if (_.isKey(KEY.DOWN, e)) {
                    ++index;
                    index = index === n ? 0 : index;
                    this.mentionbox.children().eq(index).addClass('active');
                }
                e.preventDefault();
            }

            // update value
            , update: function() {
                var text_overlay = this.textarea.val(),
                        hidden_value = text_overlay, rm_idx = [];

                text_overlay = _.escape(text_overlay);
                _pv.puzzle.forEach(function(i, j) {
                    var overlay = _.makeTemp(_pv.tmp.syntax_highlight, {value: i.value}),
					 real_val = _.makeTemp(_pv.tmp.syntax_input, {id: i.id, type: i.type, value: i.value});

                    // get unmatched values
                    // do not remove when looping
                    if (!hidden_value.match(i.value)) {
                        rm_idx.push(j);
                        return;
                    }

                    text_overlay = text_overlay.replace(i.value, overlay);
                    hidden_value = hidden_value.replace(i.value, real_val);
                });

                // remove unmatched values                
                rm_idx.length > 0 && rm_idx.forEach(function(i) {
                    _pv.puzzle.splice(i, 1);
                });

                text_overlay = text_overlay.replace(/\n/, '<br/>');
//                this.overlay[0]['innerHTML'] = text_overlay;
                this.overlay.html(text_overlay);
                _pv.elem.val(hidden_value);

            }

            // convert mentioned item into textarea
            , makechoice: function(e) {
                if (index < 0)
                    return;
                var item = this.mentionbox.find('.active'),
                        value = this.textarea.val();
                
                if(!item.attr('uid') || !item.attr('utype') || !item.text()) return;
                // just push in if not exist
                if (_pv.puzzle.every(function(el) {
                    return el.id != item.attr('uid');
                })) {
                    this.collectPuzzle({
                        id: item.attr('uid'),
                        type: item.attr('utype'),
                        value: item.text()
                    });
                }

                value = value.substr(0, this.buffer[0]) + item.text() + value.substr(this.buffer[1], value.length);
                this.textarea.val(value);

                this.update();
                // reset initial index of mentioned item;
                index = -1;			  
                this.mentionbox.empty();                                
                if (!!e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }

            , clearPuzzle: function() {
                _pv.puzzle = [];
            }

            , collectPuzzle: function() {
                var collect = function(i) {
                    var idx = i.indexOf(':'),
                            idx2th = i.indexOf(':', idx + 1);

                    !_.inPuzzle(i.substr(2, idx - 2))
                            && _pv.puzzle.push({
                        id: i.substr(2, idx - 2),
                        type: i.substr(idx + 1, idx2th - (idx + 1)),
                        value: i.substr(idx2th + 1, i.length - idx2th - 2)
                    });
                };

                if (!arguments[0]) {
                    this.clearPuzzle();
                    var matched = _pv.elem.val().match(_pv.patt.syntax);
                    !!matched && matched.map(collect);
                    return;
                }

                _.isObject(arguments[0]) && _pv.puzzle.push(arguments[0]);

            }


            , suggest: function(search) {                
                var thiz = this, html = '';
                window.ajax_metion = $.ajax({
                    type: 'POST',
                    url: _cfg.url,
                    data: {s: search},
                    dataType: 'json',
                    beforeSend: function() {
                        if (window.ajax_metion) {
                            ajax_metion.abort();
                        }
                    },
                    success: function(data) {
                        if (!!data) {
                            thiz.mentionbox.empty();
                            var i = 0, len = data.length;
                            for (; i < len; i++) {
                                if (_.inPuzzle(data[i]['ID']))
                                    continue;
                                // only tag once                                
                                html += '<div utype="' + data[i]['type'] + '" uid="' + data[i]['ID'] + '" class="mention-item">'
                                        + (_cfg.avatar && !!data[i]['img'] ? '<img src="' + data[i]['img'] + '"/>' : '')
                                        + '<span>' + data[i]['name'] + '<span>'
                                        + '</div>';
                            }
                            thiz.mentionbox.append(html).children().each(function(idid) {
                                $(this).on({
                                    'mouseover': function() {
                                        thiz.mentionbox.find('.active').removeClass('active');
                                        index = idid;
                                        $(this).addClass('active');
                                    },
                                    'mousedown': function() {
                                        if ($(this).hasClass('active')) {
                                            thiz.makechoice();
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            }

            // synchronize the manipulation of textarea with the overlay
            , synchronize: function() {
                var thiz = this, ns = '.mention';
                this.textarea.on('keydown' + ns, function(e) {
                    if (_pv.patt.tag.exec(this.value)) {
                        // choose mentioned item by key up or down
                        (_.inArray(e.keyCode, [KEY.UP, KEY.DOWN])) && (thiz.select(e));
                        // escape suggest
                        (_.isKey(KEY.ESC, e)) && (thiz.mentionbox.empty()) && (index = -1);
                        // update when hit delete key
                        (_.isKey(KEY.DEL, e)) && (thiz.update());
                        // hit enter to convert item into textarea						
                        (_.isKey(KEY.RETURN, e)) && (!!thiz.mentionbox.find('.mention-item.active')) && (thiz.makechoice(e));
                    }

                }).on('keyup' + ns, function(e) {
                    // update when hit delete key
                    (_.isKey(KEY.DEL, e)) && (thiz.update());

                    if (!_.inArray(e.keyCode, [KEY.UP, KEY.DOWN, KEY.ESC])) {
                        thiz.update();

                        var 	value = this.value
                                , search = _pv.patt.tag.test(this.value);
                        thiz.mentionbox.empty();
                        if (!!search) {
						var pointer = _.getPointer(this),
                                trigger_char_index = value.substr(0, pointer).lastIndexOf('@');
                            search = value.substr(trigger_char_index, pointer - trigger_char_index).substr(1);

                            thiz.buffer = [trigger_char_index, pointer];
                            if (search.length >= _cfg.limit_search_in) {
                                thiz.suggest(search);
                            }
                        }

                    }

                    // >> preview Link
                    if (_.inArray(e.keyCode, [KEY.RETURN, KEY.SPACE]) && _cfg.preview !== false) {
                        if (_pv.patt.link.test(value) && _pv.previewed === false) {
                            _pv.previewed = true;
                            _feature.previewLink.req(value, thiz.parent);
                        }
                    }

                })

                        .on('paste' + ns, function(e) {
                    var value = e.originalEvent.clipboardData.getData('text/plain');
                    if (_cfg.preview !== false) {
                        if (_pv.patt.link.test(value) && _pv.previewed === false) {
                            _pv.previewed = true;
                            _feature.previewLink.req(value, thiz.parent);
                        }
                    }
                })
                        // automatic elastic if content is so long
                        .on('focus' + ns, function() {
//                    thiz.clearPuzzle();
                    if (!this.pullHeight) {
                        $(this).height(this.scrollHeight);
                        thiz.overlay.height(this.scrollHeight);                                                             
                        this.pullHeight = true;
                        return;
                    }
                    this.pullHeight && ($(this).off('focus' + ns));
                })

                        // close mentionbox if blur the textarea
                        .on('blur' + ns, function() {
                    !!thiz.mentionbox.children() && thiz.mentionbox.empty();
                });

                // remove current link
                //=========================================================================================
                if (_cfg.preview) {

                    thiz.parent.find('.mention-previewLink')
                            // close preview area
                            .on('click.preview', '.mention-close', function() {
                        _pv.previewed = false;
                        $(this.parentNode).find('.mention-preview-img').remove().end()
                                .find('.mention-preview-content').remove().end()
                                .hide();
                    })
                            // check thumbnail
                            .on('change.preview', '.mention-check-no-thumb', function() {
                        var parent = $(this).parents('.mention-previewLink');
                        if (this.checked) {
                            parent.find('.mention-preview-img').hide().end()
                                    .find('.mention-preview-content').addClass('no_image')
                                    .find('.mention-preview-controller').hide();
                            this.value = 1;
                        } else {
                            this.value = 0;
                            parent.find('.mention-preview-img').show().end()
                                    .find('.mention-preview-content').removeClass('no_image')
                                    .find('.mention-preview-controller').show();
                        }
                    })
                            // thumbnail slider
                            .on('click.previewController', '.preview-button', function(e) {
                        e.preventDefault();
                        if ($(this).hasClass('disabled'))
                            return;

                        var preview = this.parentNode.previewCached,
                                list_images = preview.listImages,
                                len = list_images.list.length;
                        if (len > 1) {
                            $('.preview-button').removeClass('disabled');
                            if ($(this).hasClass('next')) {

                                if (list_images['curr_item'] >= len - 1) {
                                    $(this).addClass('disabled');
                                    return;
                                }
                                ++list_images['curr_item'];
                                preview['previewIndex'].text(list_images['curr_item'] + 1);
                                preview['previewField'].val(list_images['list'][list_images['curr_item']]);

                                preview['currentImage'][0]['src'] = list_images['list'][list_images['curr_item']];

                            } else {
                                if (list_images['curr_item'] <= 0) {
                                    $(this).addClass('disabled');
                                    return;
                                }
                                --list_images['curr_item'];
                                preview['previewIndex'].text(list_images['curr_item'] + 1);
                                preview['previewField'].val(list_images['list'][list_images['curr_item']]);

                                preview['currentImage'][0]['src'] = list_images['list'][list_images['curr_item']];
                            }
                        }
                    })
                            // quick edit
                            .on('click.quickEditPara', '.mention-preview-para', function(e) {
                        e.stopPropagation();
                        $(this).before('<textarea class="preview-quickedit-para">' + $(this).text() + '</textarea>').remove();
                        $('.preview-quickedit-para').focus();
                        $('.preview-quickedit-para').click(function(e) {
                            e.stopPropagation();
                        });
                    })

                            .on('click.quickEditTitle', '.mention-preview-title', function(e) {
                        e.stopPropagation();
                        $(this).before('<input class="preview-quickedit-title" type="text" value="' + $(this).text() + '">').remove();
                        $('.preview-quickedit-title').focus();
                        $('.preview-quickedit-title').click(function(e) {
                            e.stopPropagation();
                        });
                    })
                            ;

                    $(document).on('click.removeQuickEdit', function() {
                        var parent = $('.mention-preview-content '),
                                title = parent.find('.preview-quickedit-title'),
                                para = parent.find('.preview-quickedit-para');
                        if (title.length > 0) {
                            $('.preview-hidden').find('input[name=preview_title]').val(title.val());
                            title.before('<h2 class="mention-preview-title">' + title.val() + '</h2>');
                            title.remove();
                        }
                        if (para.length > 0) {
                            $('.preview-hidden').find('input[name=preview_desc]').val(para.val());
                            para.before('<p class="mention-preview-para">' + para.val() + '</p>');
                            para.remove();
                        }

                    });

                }

                return this;
            }
            , bindingEvts: function() {
                var thiz = this;
                this.textarea.bind('mention::clear', function() {
                    this.value = '';
                    thiz.clearPuzzle();
                    thiz.mentionbox.empty();
                    thiz.overlay.empty();
                    thiz.parent.find('.mention-close').trigger('click.preview');
                    _pv.elem.val('');
                });

                this.textarea.bind('preview::getValue', function() {
                    return $(this.form).serializeObject();
                });
            }
        };

        _feature.previewLink = {
            req: function(v, context) {
                var preview_area = context.find('.mention-previewLink');
                _.loading('show');
                $.post(_cfg.preview_url, {val: v}
                , function(res) {                    
                    if (!_.isObject(res) || res.domain === null) {
                        _.loading('hide');
                        return false;
                    }
                    if (_.isObject(res) && res.domain !== null) {
                        var has_images = !!res['imgs'] && !!res['imgs'][0] ? true : false,
                                images = has_images ? '<div class="mention-preview-img"><img src="' + res['imgs'][0] + '"></div>' : '',
                                controller_images = '';

                        if (has_images) {
                            var id = new Date().getTime(), cls = res['imgs'].length == 1 ? ' disabled' : '';
                            controller_images += '<div class="mention-preview-controller">'
                                    + '<span class="preview-button prev' + cls + '"><</span>'
                                    + '<span class="preview-button next' + cls + '">></span>'
                                    + '<span class="preview-order"><span class="preview-index">' + 1 + '</span> của <span class="preview-total">' + res['imgs'].length + '</span></span>'
                                    + '</div>';
                            controller_images += '<div class="mention-preview-thumb">'
                                    + '<input id="' + id + '" class="mention-check-no-thumb" name="no_thumb" type="checkbox" value="0" />'
                                    + '<label for="' + id + '">Bỏ ảnh đại diện</label>'
                                    + '</div>';
                        }

                        var html = images;
                        html += '<div class="mention-preview-content ' + (has_images ? '' : 'no_image') + '">';
                        html += '<h2 class="mention-preview-title">' + res['title'] + '</h2>';
                        html += '<small class="mention-preview-url">' + res['domain'] + '</small>';
                        html += '<p class="mention-preview-para">' + res['desc'] + '</p>';
                        html += '<div class="preview-hidden">';
                        html += '  <input type="hidden" name="is_preview" value="1" />';
                        html += '  <input type="hidden" name="preview_link_image" value="' + (has_images ? res['imgs'][0] : '') + '" />';
                        html += '  <input type="hidden" name="preview_desc" value="' + res['desc'] + '" />';
                        html += '  <input type="hidden" name="preview_title" value="' + res['title'] + '" />';
                        html += '  <input type="hidden" name="preview_link" value="' + res['link'] + '" />';
                        html += '  <input type="hidden" name="preview_domain" value="' + res['domain'] + '" />';
                        html += '</div>';
                        html += controller_images;
                        html += '</div>';

                        preview_area.append(html).show();
                        _.loading('hide');

                        if (preview_area.find('.mention-preview-controller').length > 0) {
                            preview_area.find('.mention-preview-controller')[0]['previewCached'] = {
                                'listImages': has_images ? {curr_item: 0, list: res['imgs']} : null,
                                'currentImage': preview_area.find('.mention-preview-img > img'),
                                'previewIndex': preview_area.find('.preview-index'),
                                'previewField': preview_area.find('[name=preview_link_image]')
                            };
                        }
                    }
                }, 'json');
            }

        };


        me.run = function() {
            // initialize all feature in list
            Object.keys(_feature).forEach(function(i) {
                _feature[i]['turn'] === 'on' && _feature[i].init();
            });
            return false;
        }();

        return me;
    });
	
    $(function() {

        $(this).find('.mention-input[js-mention="false"]').each(function() {
            var cfg = JSON.parse(this.getAttribute('js-atts')) || {};
            new ZText(this, {
                url: cfg['url'] || 'response.php',
                mode: 'full',
                atts: cfg
            });
        });

    })


})(window.jQuery, window);
