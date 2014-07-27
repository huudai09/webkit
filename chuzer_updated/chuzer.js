 /** 
  * Chuzer plugins  
  * */
;(function($, window, document, undefined) {
    var Chuzer = (function() {
        // template 
        var df_search             = '. . .',
            df_failed_search      = 'Không tìm thấy kết quả cho ',
            df_accept_btn         = 'Chọn',
            df_cancel_btn         = 'Hủy bỏ',            
            df_remove_all         = 'Bỏ chọn hết',            
            df_select_all         = 'Chọn hết',            
            class_name_patt       = /select-chuzer/,
            cache_elem            = {},
            cache_matched_item    = [],
            js_remove_item = {},
            temp = {common: {input: ['<div class="chuzer', '', '" data-active-select="', '', '" data-multiple="', '', '" >', // [1 -> class] [3 -> id] [5 -> multiple]
                                        '', // [ 7 -> selected]                                          
                                    '</div>'],
                             item: ['<div class="chuzer-selected-item" >', 
                                        '<div class="chuzer-text">',
                                            '',   // [2 -> text]
                                        '</div>',
                                        '<div class="chuzer-close" ',
                                            '',   // [5 -> addition attributes]
                                        '>×</div>',                                        
                                    '</div>']
                                },
                    disabled: ['<div class="chuzer disabled">',
                                '</div>'],
                    default:  '<option value></option>',
                    etc :     ['<div class="chuzer-etc" ', '','>...</div>']
                    },
            mask = ['<div class="chuzer-backdrop hidden auto-clean" id="', '', '" >', 
                        '<div class="chuzer-ma">', 
                            '<div class="chuzer-sa">\n\
                                <span class="chuzer-search-icon"></span><input class="chuzer-search" type="text" placeholder="' + df_search + '"/>\n\
                                \n\
                             </div>',
                            '<div class="chuzer-list">',
                                '',                                
                            '</div>',
                            '<div class="chuzer-act"><button class="chuzer-btn chuzer-accept">' + df_accept_btn + '</button><button class="chuzer-btn">' + df_cancel_btn + '</button></div>',
                            '',
                        '</div>',
                    '</div>'], // [1 -> id] [6 -> options] [9 -> addition settings]
             removed_keys = [],
             hidden_keys = [],
             events = {},
             df_options;

        // create template 
        function _MakeTemp(elem) {                          
            var elem_id         = _UID(),                 
                elem_class      = elem.classList.toString() || '',
                elem_len        = elem.length,
                options         = [],
                optgroup,
                remove_default  = [],
                df_item         = temp['common']['item'],
                bool, label,
                input, placeholder, content, rebuild = arguments[1];
                temp['common']['input'][7] = '',                
                isDf = function(v){ return v === 'false'; };                        
            
                    for (var i = 1; i < elem_len; i++) {      
                        bool = false;       
                        remove_default.push('false');
                        if (elem[i].selected && elem[i].defaultSelected) {
                            remove_default.push('true');
                            bool = true;      
                            df_item[2] = elem[i].text;
                            df_item[5] = ['data-origin="' + elem_id + '"',
                                          'data-index="' + elem[i].index + '"'].join('');
                            temp['common']['input'][7] = temp['common']['input'][7] + df_item.join('');
                            df_item[2] = df_item[5] = '';                              
                        }                                         
                        optgroup = '';
                        if (elem[i]['parentNode']['nodeName'] === 'OPTGROUP') {                                   
                            if(!!elem[i - 1]['parentNode']){
                                if(elem[i]['parentNode']['label'] !== elem[i - 1]['parentNode']['label']){                                                            
                                    optgroup = ['<div class="chuzer-group">',elem[i]['parentNode']['label'],'</div>'].join('');                            
                                }                         
                            }
                            label = !!elem[i]['parentNode'] ? 'data-label="' + elem[i]['parentNode']['label'] + '"' : '';
                        }                        
                        
                        options[i] = [optgroup,
                                      '<div class="chuzer-item" ', 
                                            'data-selected="' , bool , '"' ,                                                                                                                         
                                            'data-disabled="' , elem[i].disabled , '"' ,                                                                                                                         
                                            'data-multiple="' , elem.multiple , '"' ,                                                                                                                         
                                            'data-index="'    , elem[i].index    , '"' ,                                                                                                                         
                                            'data-text="'     , elem[i].text    , '"' ,
                                                              , label    ,
                                            'data-modal="'    , elem_id                  , '"' ,                                                                                                                         
                                            'data-value="'    , elem[i].value    , '">' ,   
                                        elem[i].text , 
                                      '</div>'].join('');
                    }     

                    // remove default selected item
                    if(remove_default.every(isDf)){
                        elem.selectedIndex = 0;         
                        elem.value = '';         
                        placeholder = ['<div class="chuzer-placeholder">', $(elem).data('placeholder'), '</div>'].join('');                    
                    }else{
                        placeholder = ['<div class="chuzer-placeholder" style="display: none;">', $(elem).data('placeholder'), '</div>'].join('');
                    }                                                         

                    // add class or id if exists
                    temp['common']['input'][1] = elem_class.replace(class_name_patt,'');
                    temp['common']['input'][3] = elem_id;                
                    temp['common']['input'][5] = elem.multiple;                                                                                                                

                    mask[1] = elem_id;                
                    elem.setAttribute('data-origin', elem_id);                    
                    cache_elem[elem_id] = elem;
                    
                    // add item for mask                    
                    mask[6] = options.join('');                                                     
                    mask[9] = '';
                    if (elem.multiple) {                
                        mask[9] = ['<div class="chuzer-setting">',
                                        '<div class="chuzer-seticon"></div>',
                                        '<div class="chuzer-setarea hidden">',
                                            '<div class="chuzer-seti seti-sla">' + df_select_all + '</div>',
                                            '<div class="chuzer-seti seti-rma">' + df_remove_all + '</div>',                                            
                                        '</div>',
                                   '</div>'].join('');      
                        mask[8] = '<div class="chuzer-act"><button class="chuzer-btn chuzer-accept">' + df_accept_btn + '</button><button class="chuzer-btn">' + df_cancel_btn + '</button></div>';
                    }else{
                        mask[8] = '';
                    }                                        
                    
                    // add callback when 
                    !!elem.getAttribute('js-remove-item') && (function(){        
                        js_remove_item[elem_id] = [elem.getAttribute('js-remove-item'), elem];
                    }());                                                            
                                        
                    // fake input
                    input = temp['common']['input'].join('');

                    content = $(input).append(placeholder);
                    
                    if (rebuild) {                    
                        _EmbedEvents(elem);
                    }
                    
                    // create
                    $(mask.join(''))
                        .appendTo('body')
                        .find('.chuzer-ma')
                        .css({                    
                            maxHeight: $(window).height() - 30
                        })
                        .end()
                        .find('.chuzer-list').css({
                            overflow: 'auto',
                            maxHeight: $(window).height() - 145
                        })
                        .prepend('<div class="chuzer-search-result" style="display: none"></div>')
                        ;
                    return $(elem).hide() && $(elem).before(content);    
        };       
        
        function _Contains(arr, val){
            var i = 0, a = arr, v = val;
            for (i = 0; i < a.length; i++) {
                if(a[i] === v) return true;
            }
            return false;
        }
        
        function _Unique(arr){
            var a = arr, n = [];
            for(var i = 0; i < a.length; i++) {
                if(!_Contains(n, a[i])) {
                    n.push(a[i]);
                }
            }
            return n;            
        }

        // create unique id
        function _UID() {            
            function S4() {
                return (((1 + window.Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
        };                        
        
        // search key 
        function _Search(items, val){              
            if (items) {                
                var value       =   val.toLowerCase().toString(),
                    patt        =   new RegExp('(' + value + ')', 'ig'),
                    item_len    =   items.length,
                    no_result   =   [],                    
                    s_result    =   $(items[0]['parentNode']['firstChild']);                
                
                cache_matched_item = [];
                !!$('.chuzer-group') && $('.chuzer-group').hide();
                // remove the last highlighted characters if `val` is empty
                if (!value) {
                    cache_matched_item = [];
                    !!$('.chuzer-group') && $('.chuzer-group').show();
                    var removed_keys_len = removed_keys.length,
                        hidden_keys_len  = hidden_keys.length;
                
                    s_result.hide();
                    if(removed_keys_len > 0){
                        for (var i = 0; i < removed_keys_len; i++) {                        
                            var item = $(items[removed_keys[i]]);                            
                                item.html(item.text());
                        }                        
                    }
                    
                    if (hidden_keys_len > 0) {
                        for (var j = 0; j < hidden_keys_len; j++) {
                            $(items[hidden_keys[j]]).show();
                        }                        
                    }
                    
                    removed_keys = hidden_keys = [];
                    return;
                }
                
                // search
                for (var i = 0; i < item_len; i++) {                        
                    var item = $(items[i]), text = item.text();
                    if (text.toLowerCase().indexOf(value) !== -1) {
                        item.show();
                        removed_keys.push(i);                      
                        cache_matched_item.push(items[i]);
                        item.html(text.replace(patt, '<u>$1</u>'));
                    }else{                        
                        item.hide();
                        hidden_keys.push(i);
                        item.html(text);
                    }
                    no_result.push(items[i]['style']['display']);
                }
                                
                no_result.every(function(i){ return i === 'none';}) 
                ? s_result.show().html(df_failed_search + '"<u>' + value + '</u>"') 
                : s_result.hide().text('');
                                
                removed_keys = _Unique(removed_keys);
            }
        };        
        
        function _EmbedEvents(elem){            
            var atts    = elem.attributes, 
                obj     = {}, 
                _events = {'click': 'onclick', 'change': 'onchange'};                 
                
                obj = {
                    click: [false, $(elem)],
                    change: [false, $(elem)]
                };             
            for(var x in _events){
                var namedItem = atts.getNamedItem(_events[x]);
                if (!!namedItem) {                    
                    obj[x] = [true, namedItem.value];
                }
            }
            
            events[elem['dataset']['origin']] = obj;    
            
            $(elem).bind('liszt:updated', function(e){
                  var ev = e || window.event, 
                      select = ev.currentTarget, 
                      fake_select = $('.chuzer[data-active-select="'+select['dataset']['origin'] +'"]'),
                      backdrop = $('#'+select['dataset']['origin']);                      
                      
                      if(!!fake_select){
                          fake_select.remove() && backdrop.remove() && _MakeTemp(select, true);
                      }else{
                          _MakeTemp(select, true);
                      } 
            });           
        };                  
        
        function _DetachEvents(){
            if (window.Object.keys(events)[0] !== undefined) {
                events = {};
            }
        }
        
        function _AttachEvents(id, ev){
            var bool = events[id][ev][0];             
            if (bool) {
                if(events[id][ev][1] !== undefined){                      
                   var fn, origin_select = cache_elem[id];                     
                       eval('fn=' + events[id][ev][1]);                                                           
                   if (fn) { 
                       fn.call(origin_select);
                   }
                }                    
            }else{                
                events[id][ev][1].trigger(ev);
            }                        
        };
        
        function _Resize(){
            var wH      = $(window).innerHeight(),
                ma      = $('.chuzer-ma'),                 
                margin  = parseInt(ma.css('marginTop'), 10) + parseInt(ma.css('marginBottom'), 10),
                sa      = parseInt(ma.find('.chuzer-sa').innerHeight(), 10),
                act     = parseInt(ma.find('.chuzer-act').innerHeight(), 10) || 0,
                rH      = (wH - (margin + sa + act));   
                        
            ma.find('.chuzer-list').each(function(){        
                this['style']['maxHeight'] = rH + 'px';
            });
        };
        
        function _SoRAll(items, bool){            
            if (items) {
                var i = 0, elem = items, len = elem.length;
                for ( ; i < len; i++) {
                    elem[i]['dataset']['selected'] = bool;
                }
            }
        };

        // public method =================================================================================================
        return {
            
            init: function(elem, opts) {                
                if (elem.disabled) {
                    $(elem).hide().before(temp['disabled'].join(''));
                    return;
                }
                
                df_options = opts;
                 $(elem).prepend(temp['default']);
                _MakeTemp(elem);    
                _EmbedEvents(elem);
            },
            unactive: function(){
                var ev = ['click.toggleSelectArea', 'click.preventClick', 'keyup.searchKey', 
                          'click.selectVal', 'click.okIChoose', 'click.toRemove', 
                          'click.additionFeature', 'click.toSelectOrRemove', 'focus.onSearch'], 
                    len = ev.length, i = 0;
                for( ; i<=len; i++){
                    $(document).off(ev[i]);
                }                
            },
            active: function() {
                var items;            
                this.unactive();
                $(document)
                   // toggle select area
                   .on('click.toggleSelectArea', '.chuzer:not(.chuzer.disabled), .chuzer-backdrop, button.chuzer-btn', function(){                                 
                        var default_keys, 
                            thiz  = $(this), 
                            modal = thiz.data('active-select') 
                                            ? $('#' + thiz.data('active-select')) 
                                            : (thiz.hasClass('chuzer-btn') 
                                                ? thiz.parents('.chuzer-backdrop') : thiz),                                                
                            origin_select = cache_elem[modal[0]['id']];                            
                            
                            if (modal.hasClass('hidden')) {
                                modal.removeClass('hidden').addClass('visible');
                                items = modal.find('.chuzer-item:not([data-disabled="true"])');  
                                                                                                              
                                // attach click event                                       
                                _AttachEvents(modal[0]['id'], 'click');
                                                                
                            }else{
                                modal
                                   .find('.chuzer-search').val('').end()
                                   .find('.chuzer-search-result').hide().end()
                                   .find('.chuzer-group').show().end()
                                   .find('.chuzer-item').each(function(){
                                        var thiz = $(this);
                                        thiz.html(thiz.text());
                                   }).show();
                                
                                modal.removeClass('visible').addClass('hidden');
                                !modal.find('.chuzer-setarea').hasClass('hidden') && modal.find('.chuzer-setarea').addClass('hidden');
                                items = null;
                                
                                if(thiz.hasClass('chuzer-accept')) return;                                     
                            }
                                // reset default keys
                                default_keys = Chuzer.getSelectedKeys(origin_select);                                       
                                modal.find('.chuzer-item').each(function(){
                                    if (default_keys !== -1) {                                                                                
                                        if (!_Contains(default_keys, parseInt(this.dataset.index))) {
                                            this.dataset.selected = 'false';
                                        }else{
                                            this.dataset.selected = 'true';
                                        }
                                    }
                                    
                                    if (default_keys === -1) {
                                        this.dataset.selected = 'false';
                                    }
                                });                            
                                                        
                      })           
                      
                   // prevent `.chuzer-item`, `.chuzer-search`, '.chuzer-close' from propagating 
                   .on('click.preventClick', '.chuzer-ma, .chuzer-close, .chuzer-etc', function(ev){ev.stopPropagation();})
                   .on('focus.onSearch', '.chuzer-search', function(ev){ev.stopPropagation();})
           
                   // search keyword
                   .on('keyup.searchKey', '.chuzer-search', function(){
                        var _items = items, _value = this.value;                               
                            _Search(_items, _value);
                   })
                   
                   // choose item
                   .on('click.selectVal', '.chuzer-item', function(){                           
                        var item = $(this), data = item.data(), 
                            is_multiple     = data['multiple'],      
                            fake_select     = $('.chuzer[data-active-select="' + data['modal'] + '"]'),
							plz_holder      = fake_select.find('.chuzer-placeholder'),
                            modal           = $('#' + data['modal']),
                            origin_select   = cache_elem[data['modal']],
                            chuzer_selected = '.chuzer-item[data-selected="true"]',
                            fake_input;                                                        
                            
                            if (data['disabled']) return;                             
                            
                            (item[0].getAttribute('data-selected') === 'true') 
                                ? item[0].setAttribute('data-selected', 'false') 
                                : item[0].setAttribute('data-selected', 'true');
                                
                            if (!is_multiple) {
								!!plz_holder && plz_holder.hide();								
                                chuzer_selected = item.parent().find(chuzer_selected).not(this);
                                if( chuzer_selected.length > 0 ){
                                    chuzer_selected.each(function(){                                        
                                        this['dataset']['selected'] = 'false';
                                    });
                                }                                                                  
                                
                                origin_select[data['index']]['selected'] = true;
                                origin_select[data['index']]['defaultSelected'] = true;
                                origin_select['selectedIndex'] = data['index'];   

                                fake_input = temp['common']['item'];
                                fake_input[2] = origin_select[data['index']].text;
                                fake_input[5] = ['data-origin="' + data['modal'] + '"',
                                                 'data-index="' + origin_select[data['index']].index + '"'].join('');

                                fake_select.find('.chuzer-selected-item').remove().end().append(fake_input.join(''));

                                modal.removeClass('visible').addClass('hidden');
                                
                            }                                                                                                                    
                                
                   })
                   
                   // OK ! i choose it 
                   .on('click.okIChoose', '.chuzer-accept', function(){
                        var parent            = $(this).closest('.chuzer-backdrop'), i = 0, j, k = 0,
                            chosen_item       = parent.find('.chuzer-item[data-selected="true"]'),
                            len               = chosen_item.length,
                            selected_keys     = [], fake_input, inputs = [],
                            fake_select       = $('.chuzer[data-active-select="' + parent[0]['id'] + '"]'),
                            plz_holder        = fake_select.find('.chuzer-placeholder'),                            
                            etc_btn           = fake_select.find('.chuzer-etc'),                            
                            origin_select     = cache_elem[parent[0]['id']],
                            origin_select_len = origin_select.length,
                            overload          = [];     
                                 
                            !!etc_btn && etc_btn.remove();
                            if (len <= 0){
                                if (origin_select_len > 0) {
                                    for (i; i < origin_select_len; i++) {
                                        origin_select[i].selected = false;
                                        origin_select[i].defaultSelected = false;  
                                    }
                                }
                                fake_select.find('.chuzer-selected-item').remove();                                
                                !!plz_holder && plz_holder.show();                                
                                return;
                            };        
                            
                            for (i = 0; i < len; i++) {
                                selected_keys.push(parseInt(chosen_item[i]['dataset']['index']));                                
                            }   
                            
                            for (j = 1; j < origin_select_len; j++) {
                                if (_Contains(selected_keys, j)) {                                    
                                    origin_select[j].selected = true;
                                    origin_select[j].defaultSelected = true;      
                                    ++k;
                                    if( k < df_options.limited_item){
                                        fake_input = temp['common']['item'];
                                        fake_input[2] = origin_select[j].text;
                                        fake_input[5] = ['data-origin="' + parent[0]['id'] + '"',
                                                         'data-index="' + origin_select[j].index + '"'].join('');
                                        inputs.push(fake_input.join(''));
                                    }else{
                                        overload.push(j);
                                    }
                                }else{
                                    origin_select[j].selected = false;
                                    origin_select[j].defaultSelected = false;                                                                        
                                }
                            }                                                        
                            
                            // if total of item > limited_item ==> display etc button
                            if(overload[0] !== undefined){
                                temp['etc'][1] = 'data-remain="[' + overload.join(',') + ']" '
                                                +'data-origin="' + parent[0]['id'] + '"';
                                inputs.push(temp['etc'].join(''));
                            } 
                            
                            !!plz_holder && plz_holder.hide();
                            
                            fake_select.find('.chuzer-selected-item').remove();
                            fake_select.append(inputs.join(''));
                                                            
                            // attach change event                            
                            _AttachEvents(parent[0]['id'], 'change');
                            
                   })
                   
                   // remove selected item
                   .on('click.toRemove', '.chuzer-close', function(){    
                        var elem = $(this), parent = elem.parents('.chuzer'), fn,
                            data = elem.data(), origin_select = $('select[data-origin="'+ data['origin'] +'"]')[0];                        

                            if(js_remove_item[data['origin']]){                                
                                eval('fn=' + js_remove_item[data['origin']][0]);
                                !!fn && fn.call(js_remove_item[data['origin']][1]);
                            }                       
                       
                            elem.parent().remove(); 
                            origin_select[data['index']].selected = false;                            
                            origin_select[data['index']].defaultSelected = false;                                                 
                            
                            if (parent.find('.chuzer-selected-item').length <= 0) {                                
                                parent.find('.chuzer-placeholder').show();
                                origin_select.selectedIndex = 0;                                                   
                            }        
                            
                   })
                   
                   // addition feature for multiple select
                   .on('click.additionFeature', '.chuzer-seticon', function(){
                        var thiz = $(this), 
                            setarea = thiz.closest('.chuzer-setting').find('.chuzer-setarea');
                        setarea.toggleClass('hidden'); 
                   })
                   
                   // select or remove all items
                   .on('click.toSelectOrRemove', '.chuzer-seti', function(){
                        var thiz = $(this), _items = cache_matched_item.length > 0 ? cache_matched_item : items, 
                            parent = thiz.closest('.chuzer-setarea');                                                            
                        
                            thiz.hasClass('seti-sla') && _SoRAll(_items, true);
                            thiz.hasClass('seti-rma') && _SoRAll(_items, false);
                        !parent.hasClass('hidden') && parent.addClass('hidden');
                   })
                   
                   // view more item by default
                   .on('click.viewMore', '.chuzer-etc', function(){
                        var thiz = $(this), fake_input, inputs = [],
                            data = this.dataset,
                            remain = eval(data['remain']),
                            origin_select = cache_elem[data['origin']],
                            limit = df_options.limited_display < remain.length ? df_options.limited_display : remain.length;                        
                                              
                        for (var i = 0; i < limit; i++) {
                             fake_input     = temp['common']['item'];                                                                                           
                             fake_input[2]  = origin_select[remain[i]].text;
                             fake_input[5]  = ['data-origin="' + origin_select + '"',
                                               'data-index="' + origin_select[remain[i]].index + '"'].join('');
                             inputs.push(fake_input.join(''));                             
                        }                                                
                        
                        thiz.before(inputs.join(''));
                        if (limit >= remain.length){ 
                            thiz.remove();
                        }else{                         
                            remain.splice(0, df_options.limited_display - 1);
                            data['remain'] = '[' + remain.join(',') + ']';
                        }
                   })
                   ;                   
                $(window).resize(_Resize);
            },                          
                    
            getSelectedKeys: function(elem){   
                // elem must be DOM Object
                var options = elem.selectedOptions,
                    i = 0, keys, len = options.length;
                    if (len >= 1) {
                        keys = [];
                        for (i; i < len; i++) {
                            keys.push(options[i]['index']);
                        }
                    }                    
                    if (len < 1){
                        keys = -1;
                    }                                                                          
                return keys;                
            },
            isSupport: function(){
                return window.navigator.msPointerEnabled ? true : false; // if IE 10+ or not
            }
        };
        
    })();
    
    $.fn.extend({
       chuzer : function(opts) {
//            if (!Chuzer.isSupport()) {                
//                return;
//            }
            var defaults = {'mask': true,
                            'animate': 'none',
                            'limited_item' : 40,
                            'limited_display' : 20},
                options = $.extend(defaults, opts);            

            this.each(function() {
                Chuzer.init(this, options);
            });
                Chuzer.active();
            return this;
       }
    });    
    
    
    
})(jQuery, window, document);