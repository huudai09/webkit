(function($) {
    var ZText = (function() {
        var params = Array.prototype.slice.call(arguments)
          , self = {}, _pv = {}, KEY = {}, _ = {}, _feature = {}
		  , index = -1
          , _cfg = {
				url: 'response.php',
				limit_search_in: 1,
				trigger_char: '@'
          };

        // private variables
         KEY = {BACKSPACE: 8, DEL: 46, TAB : 9, RETURN : 13, ESC : 27, UP : 38, DOWN : 40, SPACE : 32};
        _cfg = $.extend(_cfg, params[1]);
        _pv.elem = $(params[0]);
		_pv.buffer = [];
        _pv.patt = {fill_data: /@\[(\d+)\:([^\]]+)\]/g,
                    tag		 : /^@([^\s]+)|\s@([^\s]+)/};
        _pv.tmp = {container: '<div class="mention-area"><div class="mention-inner">'
                    , overlay: '<div class="mention-overlay">'
                    , textarea: '<textarea class="mention-textarea"></textarea>'
                    , mentionbox: '<div class="mention-box"></div>'
                    , css: {
						reset: {
							'border': '0px',
							'margin': '0px',
							'padding': '0px',
							'white-space': 'pre-wrap',
							'font-size': '11px',
							'font-family': 'Tahoma, Arial',
							'line-height': '16px'
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
            , inArray: function(needed, haystack) {
				return !!(Array.isArray(haystack) 
					   && haystack.some(function(i) { return needed === i; }));
            }
			
			, isKey: function(key, ev){
				return !!(!!ev.keyCode && ev.keyCode === key);
			}
			
            , removeCharAt: function(str, at, key) {
                var from = key === KEY.BACKSPACE ? at - 1 : at,
                    to = key === KEY.BACKSPACE ? at : at + 1;

                return str.substr(0, from) + str.substr(to, str.length);
            }
        };

        _feature.mention = {
            turn: 'on'
          , init: function() {
                _pv.elem
                   .wrap(_pv.tmp.container)
                   .parent().prepend(_pv.tmp.overlay)
                   .append(_pv.tmp.textarea)
                   .append(_pv.tmp.mentionbox);

                this.parent = _pv.elem.parents('.mention-area');
                this.parent.find('.mention-inner').css('position', 'relative');
                this.overlay = this.parent.find('.mention-overlay');
                this.textarea = this.parent.find('.mention-textarea');
                this.mentionbox = this.parent.find('.mention-box');				
                
                this.elastic();
                this.overlaying().synchronize();
            }			

            , elastic: function() {
                return this.textarea.on('keyup.elastic input.elastic keydown.elastic paste.elastic cut.elastic', function() {
                    this.style.height = '';
                    this.style.height = Math.min(this.scrollHeight, Number.MAX_VALUE) + 'px';
                });
            }
            // create a overlay layer
            , overlaying: function() {
                // reset style textarea and sync with the overlay
                this.textarea.css($.extend(_pv.tmp.css.reset, _pv.tmp.css.textarea));
                this.overlay.css($.extend(_pv.tmp.css.reset, _pv.tmp.css.overlay, {width: this.textarea.width() + 'px', height: this.textarea.height() + 'px'}));
				// parse and fill data
                this.overlay.html(_pv.elem.val().replace(_pv.patt.fill_data, '<b>$2</b>'));
                this.textarea.val(_pv.elem.val().replace(_pv.patt.fill_data, '$2'));
				
				!_pv.mention_collec && (_pv.mention_collec = _pv.elem.val().match(_pv.patt.fill_data));
				console.log(_pv.mention_collec);
                return this;
            }	
			
			// , update: function(){
				  // var input_content = _pv.elem.val();
					
				  // _.each(mentionsCollection, function (mention) {
					// var textSyntax = settings.templates.mentionItemSyntax(mention);
					// input_content = input_content.replace(mention.value, textSyntax);
				  // });

				  // var mentionText = utils.htmlEncode(input_content);

				  // _.each(mentionsCollection, function (mention) {
					// var formattedMention = _.extend({}, mention, {value: utils.htmlEncode(mention.value)});
					// var textSyntax = settings.templates.mentionItemSyntax(formattedMention);
					// var textHighlight = settings.templates.mentionItemHighlight(formattedMention);

					// mentionText = mentionText.replace(textSyntax, textHighlight);
				  // });

				  // mentionText = mentionText.replace(/\n/g, '<br />');
				  // mentionText = mentionText.replace(/ {2}/g, '&nbsp; ');

				  // elmInputBox.data('messageText', input_content);
				  // elmMentionsOverlay.find('div').html(mentionText);
			
			// }
			
			//	select item using up or down key
			, select: function(e){
				var n = this.mentionbox.children().length;						
					this.mentionbox.children().removeClass('active');
				if(_.isKey(KEY.UP, e)){
					index = index < 0 ? n - 1 : index;							
					this.mentionbox.children().eq(--index).addClass('active');
				}else if(_.isKey(KEY.DOWN, e)){
					++index;
					index = index === n ? 0 : index;																			
					this.mentionbox.children().eq(index).addClass('active');							
				}
				e.preventDefault();
			}
			// convert mentioned item into textarea
			, makechoice: function(e){
				var item = this.mentionbox.find('.active')[0];	
										
				e.preventDefault();
			}
            // synchronize the manipulation of textarea with the overlay
            , synchronize: function() {
                var thiz = this, ns = '.mention';
                this.textarea
                 .on('keydown' + ns, function(e) {
                    var pointer = _.getPointer(this)
                      , start_pos = 0, width
                      , overlay = thiz.overlay[0]['childNodes'];

                    if (_.inArray(e.keyCode, [KEY.BACKSPACE, KEY.DEL])) {
                        Array.prototype.forEach.call(overlay, function(node) {
                            width = node.textContent.length || node.innerText.length || node.text.length || '';
                            // if pointer inside html node
                            if (pointer >= start_pos && pointer <= start_pos + width) {
                                if (node.nodeType === 1) {
                                    node.outerHTML = _.removeCharAt($(node).text(), pointer - start_pos, e.keyCode);
                                } else {
                                    node.nodeValue = _.removeCharAt(node.nodeValue, pointer - start_pos, e.keyCode);
                                }
                            }
                            start_pos += width;
                        });
                    }   									
					
					// choose mentioned item by key up or down
					(_.inArray(e.keyCode, [KEY.UP, KEY.DOWN])) && (thiz.select(e));
					// hit enter to convert item into textarea
					(_.isKey(KEY.RETURN, e)) && (!!thiz.mentionbox.find('.mention-item.active')) && (thiz.makechoice(e));
										
                })
                .on('keyup' + ns, function(e) {		
					// 
					if(!_.inArray(e.keyCode, [KEY.UP, KEY.DOWN])){
						var pointer = _.getPointer(this)
						  , value = this.value, html = ''                      
						  , search = _pv.patt.tag.exec(this.value);   

						thiz.mentionbox.empty();                        
						if(!!search){
							var trigger_char_index = value.substr(0, pointer).lastIndexOf('@');
							search = value.substr(trigger_char_index, pointer).substr(1);						
													
							if(search.length >= _cfg.limit_search_in){								
								$.ajax({
									type : 'POST',
									url: _cfg.url,
									data : {s: search},
									dataType: 'json',
									success: function(data){
										if(!!data){
											var i = 0, len = data.length;
											for(; i<len; i++){
												html += '<div uid="'+data[i]['ID']+'" class="mention-item">'+data[i]['name']+'</div>';
											}                                    
											thiz.mentionbox.append(html);
										}
									}
								});                                                      
							}
						}					
					}
                })
				.on('blur' + ns, function(){ !!thiz.mentionbox.children() && thiz.mentionbox.empty();});
				return this;			
            }			
        };

        _feature.previewLink = {
            turn: 'on'
          , init: function() {
                //console.log('aaaaaaaa');
            }
        };


        self.run = function() {
            // initialize all feature in list
            Object.keys(_feature).map(function(i) {
                _feature[i]['turn'] === 'on' && _feature[i].init();
            });
            return false;
        }();

        return self;
    });


    Array.prototype.map.call(document.getElementsByClassName('mention-input'), function(i) {
        return new ZText(i);
    });
})(jQuery);
