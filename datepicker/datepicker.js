;
(function($, win, doc) {
    // 1         2        3        4        5        6      0
    // 0         1        2        3        4        5      6
    var cfg = {dayoftheweek: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
                , max_row: 6
                , clock: true
                , reveal_in: 'slide'
                , deep_reveal: 'modal'
    }
    , now = (new Date().getDate()) + '/' + new Date().getMonth() + '/' + (new Date().getFullYear())
            , Datepicker;
    cfg.cell = cfg.dayoftheweek.length * cfg.max_row;

    Datepicker = function() {
        var args = Array.prototype.slice.call(arguments);
        this.it = $(args[0]);
        this.date = args[1];
        this.time = [new Date().getHours(), new Date().getMinutes()];
        this.options = $.extend(cfg, args[2]);

        this.buildDate().addEvent('.datepicker');
    };

    Datepicker.prototype = {
        constructor: Datepicker
                , buildDate: function() {
					var header = ['<div class="date-title">',
						'<div class="date-btn date-prev">&lt;</div>',
						'<div class="date-center">' + this.getRealDate() + '</div>',
						'<div class="date-btn date-next">&gt;</div>',
						'</div>']
							, dayoftheweek = this.options.dayoftheweek.map(function(item, index, arr) {
									return index === 0 ? '<div class="date-days"><div class="day">' + item + '</div>'
											: index === (arr.length - 1)
											? '<div class="day">' + item + '</div></div>'
											: '<div class="day">' + item + '</div>';
								})
							, days = this.getDays()                    
							, collection = header.concat(dayoftheweek, days);            
							
					collection.unshift('<div class="date-wrap">');
					collection.push('</div>');
					collection = collection.concat(this.buildClock() || []);
					
					this.datepicker = $(collection.join(''));					
					this.bindHolder();            
					this.it.attr('data-date', this.getRealDate());
					this.datepicker.appendTo(this.it);
					return this;
				}

        , buildClock: function() {
            return;
            if (!!this.options.clock) {
                var time = this.time, html = [], i = 0, len = time.length;
                    html.push('<div class="date-time hour">' + time[0] + '</div>');
                    html.push('<div class="date-time min">' + time[1] + '</div>');
                    
                if(len > 0){
                    html[len] = ['<div class="date-time slider">', '', '</div>'];
                    for(; i < len; i++){
                        html[len][1] += '<div class="date-slider" data-value="' + time[i] + '"></div>';
                    }                                                  
                    html[len] = html[len].join('');                    
                }
                return ['<div class="date-clock">', html.join(''),'</div>'];
            }
            return false;
        }

        , getRealDate: function() {
            var d = this.date.split('/');
            return d[0] + '/' + (parseInt(d[1]) + 1) + '/' + d[2];
        }

        , getDays: function() {
            var thiz = this
                    , date = this.date.split('/').map(function(i) {
                return i.replace(/^0/, '');
            })
                    , first_day = new Date(date[2], date[1], 1).getDay()
                    , first_day = first_day > 0 ? first_day - 1 : 6 // get index

                    , current_month = this.getDaysInMonth(date[2], date[1] == 0 ? 11 : date[1])
                    , prev_month = this.getDaysInMonth(date[2], date[1] == 0 ? 11 : date[1] - 1)
                    , next_month = this.options.cell - (current_month + first_day)
                    , cells = new Array(this.options.cell)

                    , i = first_day
                    , j = current_month + first_day
                    , z = cells.length
                    , n = current_month + first_day
                    , cls;

            if (first_day !== 0) {
                // loop prev month				
                while (i - 1 >= 0) {
                    cells[i] = '<div class="prev d"><span>' + prev_month-- + '</span></div>';
                    i--;
                }
            }

            while (j >= (first_day + 1)) {
                cls = '';
                (current_month == date[0]) && (cls = ' curr');
                cells[j] = '<div class="now d' + cls + '"><span>' + current_month-- + '</span></div>';
                j--;
            }

            if (next_month !== 0) {
                while (z > n) {
                    cells[z] = '<div class="next d"><span>' + next_month-- + '<span></div>';
                    z--;
                }
            }
            var flag = ['data:image/jpeg;base64,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',
                        'data:image/jpeg;base64,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',
                        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhUIBwgWFRUUGBgbGRgVFxUdFhkfHR0dGRcbHhkYHzQiJB8xJxwnLTkkLS8sLy4xGSA7OTQtQyotLjcBCgoKDg0OGxAQGy4kHyQ3LDcxMTQtNSs3MjQvNyw2LDAvKy80NCwyLDcvLyw0LDEuLCwsLC83Li03LCwsLCw3NP/AABEIALcBEwMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcBAgUECAP/xAA7EAEAAgEBBQUEBggHAAAAAAAAAQIDEQQFBiExBxJBUYFhcZGhMkJTgpKxExUiQ1KiwdEUFyMlYpPS/8QAGwEBAAICAwAAAAAAAAAAAAAAAAQFAQYCAwf/xAA4EQEAAQICBQoEBAcBAAAAAAAAAQIDBBEFITFBUQYSE3GBkaGxweEiYdHwMjNCUhQWI1NigpIV/9oADAMBAAIRAxEAPwC8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYmYiNZkEF4l7Stg3bedn3XT9PeOUzrpjj1j6Xpy9qFdxlNOqnXLZNH8m79+IrvTzKfHu3dvcgO8ePOI9utMzt844/hxRFYj1+l80KrFXat+TabGgcDaj8HOnjOv28HKnf2+ZnX9bZ/+3J/d1dLX+6e9N/8/C/2qf8AmPo6GwcbcRbDaJpvO1ojwyaXifxc/m7KcTdp3ot/QeBuxrtxHVq8tSc8O9qGzbTaMG/MMYrT+8prOP1iedfn6JlrGxOqvU1rH8mLluJrw086OE7fpPgsLFkplxxkxXiYmNYmJ1iY84mE+JzarVTNM5VRlMNxgAAAAAAAAAAAAAAAAAAAAAAAAAABT/aJxrfeOa26d15NMVZmL2j95McpiJ/g/P3KvFYnnfBTsb5oLQkWaYxF+PjnZHD38utAEFtIMgAAwl3AnGWbh/aI2Xa7TbZ7TzjrOOZ+tX2ecf1SsNiJtzlOxQaa0NTjKZuW4yuR4/KfSfRd+O9MlIvjtExMaxMdJiekriJzedTE0zlO1sMAAAAAAAAAAAAAAAAAAAAAAAAAIj2mb8tufh+cWC+mTPrSunWI+vb4cvvQi4u7zKMo2yvOT+BjE4rnVfho1z17oUcp3pIMgAAAAwt7sj37bbN3W3VtF9bYedPOaT4ek/K0LTBXedTzJ3NC5T4GLV6MRRGqvb1+8eUrBTmrgAAAAAAAAAAAAAAAAAAAAAAAAKa7Xtstn4krs3e5Y8ccvbaZtM/DT4KnHVZ3MuD0DktZinCTc31TPdGz1QVDbMAAAAAAlHZrtltk4wwxE8snepPumJ0+cQkYSrK7Ck5QWYuYCv5ZT3e2a91080AAAAAAAAAAAAAAAAAAAAAAAAAUX2oVmvGmWZ8YxzH4Kx/RTYz82ex6TycmJ0fR/t5yiiMvQAAAAAHa4LrNuLNmiv2tflOsu3D/AJtPWrdLzEYG7n+2X0KvXlYAAAAAAAAAAAAAAAAAAAAAAAACo+2Td9sW9sW8Kx+zkp3Z99Z16+2Lfyyq8dR8UVN65KYiJs12d8Tn2T7x4q8QW2AAAAAAJj2VbvttnFdc+nLDW158tZjuVj+bX7qVg6M7mfBr/KTERbwU0b6piPWfJdy4ecgAAAAAAAAAAAAAAAAAAAAAAAAOFxnuKOINxX2OsR34/axzPhaOnx6erpv2ukomFjorHTg8TTc3bJ6p+83z/lx3w5ZxZaTFqzMTE9YmOUxKjmMpyep0VRXTFVM5xLUcgAAAAYXn2ccPW3FuTv7TTTLm0tfzrH1K+muvvmVxhbXR0a9svNdPaQjF4jKifgp1R8+M/e5LEpSAAAAAAAAAAAAAAAAAAAAAAAAAAIH2gcD/AK413luqsRmj6VekZP7W/NCxOG5/xU7WzaE05/DZWb8/Bunh7eSn8+HLs+WcOfHNbVnSa2iYmPfEquYmJylvtFdNdMVUznE72jDmAAzWtr2itI1mekR1kcZmIjOVo9n/AAHfDkrvXfmLS0c8eKfDytePPyjw8VlhsLl8dfc0rTmnoricPhp1b6vSPWVmrBqAAAAAAAAAAAAAAAAAAAAAAAAAAAADj7+4Z3Vv6n+4bNE28L15Xj70flOsOq5ZoufihOweksThJ/pVauG2O5A95dk+WLTbdm84mPCuWsxP4q66/CEKvAT+mWz2OVlOWV632xPpP1cv/K7f/wBrh/Hb/wAuv+CufJN/mnBcKu6Pq6Gwdk+2XmJ3hvKlY8Yx1m0/G2mnzc6cBP6pRL/Ky3H5VuZ65y8s044f4P3PuGYybJs/ev8AaZOd/Twj0iEy1h6Leza1vG6XxWM1XKsqeEao9+1IHerAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADUDUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHi2jZ75c/e/STEfs9LWjxt3uUezRwmJmXbRcimnLLXr3RPDLb2vHOz7bGSs5bzPhaIyWiJnTlPLp0nppr5eLhlVv83f0lrKco8In7+9b9J2Ta7TEWzT7Z7941nuzHKI5RGvNnm1OPS243eEcfoz/hds6ztGsc+WsxyieUaxz5xrrPnp5anNq4nS2v2/e/V15ePFiNj2iMk5JyTPh9O3T/T5RPh9Gefjylnmz99h01GWWXhH+WvxjVub12fPGClK20mtdOVraROkaW/5e6erOU5Q4zcomqZnfPDdw+XYxXZM9p1tktEa10iMl+Uax3uevPXn182ObLPS0Rsjjujs6nswVvTBWuWdZiI1nXrOnNzjZrR65iapmnY//9k='];
            // test			
            var div = '<div class="date-detail"><div class="left"><span class="lv max"></span>7:30 AM</div>\n\
                            <div class="right"><table><tr><td><img width="100px" height="50px" src="'+flag[0]+'"></td>\n\
                                <td><span class="score">1</span>:<span class="score">1</span></td>\n\
                            <td><img width="100px" height="50px" src="'+flag[1]+'"></td></tr></table></div>\n\
                       </div>';
                div += '<div class="date-detail"><div class="left"><span class="lv medium"></span>7:30 AM</div>\n\
                            <div class="right"><table><tr><td><img width="100px" height="50px" src="'+flag[1]+'"></td>\n\
                                <td><span class="score">2</span>:<span class="score">1</span></td>\n\
                            <td><img width="100px" height="50px" src="'+flag[2]+'"></td></tr></table></div>\n\
                       </div>';
                div += '<div class="date-detail"><div class="left"><span class="lv low"></span>7:30 AM</div>\n\
                            <div class="right"><table><tr><td><img width="100px" height="50px" src="'+flag[0]+'"></td>\n\
                                <td><span class="score">0</span>:<span class="score">5</span></td>\n\
                            <td><img width="100px" height="50px" src="'+flag[2]+'"></td></tr></table></div>\n\
                       </div>';
            // ===	
            cells.filter(Boolean);
            cells = cells.map(function(item, index, arr) {
                if (index % 7 === 0 && index != 0) {
                    return item + '<div class="date-sepa">' + div + '</div>';
                }
                return item;
            });

            return cells;
        }

        , bindHolder: function() {
            var ids = new Date().getTime(),						
			   d = Array.prototype.filter.call(this.datepicker[0]['children'], function(el){
				return el.classList.contains('d') || el.classList.contains('date-sepa');
			  });			   		  		  
			  
			   Array.prototype.forEach.call(d, function(el){
					if ($(el).hasClass('d')) {                     
						el.dataset.target = '#' + ids;
					}
					if ($(el).hasClass('date-sepa')) {                    
						el.id = ids;
						ids += 100;
					}					
			   });			   

            return this;
        }

        , addEvent: function(ns) {
            var thiz = this;
            this.it.off('click' + ns);

            // REVEAL MORE INFOMATION ABOUT DAY
            // ================================
            this.it.on('click' + ns, '.d', function() {

                // - showed: + reload
                //			 + replace the caret on day that clicked
                // - yet: 	 + close all 
                //			 + replace the caret on day that clicked
                //			 + show it on

                // it's error now => fixing ....
                var elem = $(this),
                  target = $(this.dataset.target),
                  otherd = thiz.it.find('.d'),
                  others = thiz.it.find('.date-sepa').not(target[0]);
				  
                otherd.removeClass('caret');
                others.removeClass('date-reveal');

                if (target[0]['revealed']) {
                    target.removeClass('date-reveal');
                    target[0]['revealed'] = false;
                } else {
                    elem.addClass('caret');
                    target.addClass('date-reveal');
                    target[0]['revealed'] = true;
                }
                // =======================
            });


            // NEXT + PREV MONTH
            // =================
            this.it.on('click' + ns, '.date-btn', function(e) {
                e.preventDefault();
                var target = thiz.it,
                        d = target.attr('data-date').split('/').map(function(e) {
                    return parseInt(e);
                }),
                        m;

                if ($(this).hasClass('date-next')) {
                    m = [d[0]
                                , (d[1] + 1) > 12 ? 1 : (d[1] + 1)
                                , d[1] >= 12 ? d[2] + 1 : d[2]].join('/');
                } else {
                    m = [d[0]
                                , (d[1] - 1) === 0 ? 12 : (d[1] - 1)
                                , d[1] === 12 ? d[2] - 1 : d[2]].join('/');
                }

                target.attr('data-date', m);
                target.empty().datepicker();
            });

        }

        , isLeapYear: function(year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        }

        , getDaysInMonth: function(year, month) {
            return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        }

    };

    $.fn.extend({
        datepicker: function() {
            return this.each(function() {
                var date = now;
                (this.dataset.date)
                        && (date = this.dataset.date.split('/').map(function(item, index) {
                    return index == 1 ? item - 1 : item;
                }).join('/'))

                new Datepicker(this, date);
            });
        }
    });

    $(function() {
        $('.date-picker').datepicker();
    });

}(jQuery, window, document));