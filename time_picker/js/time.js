//	a Lowercase Ante meridiem and Post meridiem 		am or pm 
//	A Uppercase Ante meridiem and Post meridiem 		AM or PM 
//	g 12-hour format of an hour without leading zeros 	1 through 12 
//	G 24-hour format of an hour without leading zeros 	0 through 23 
//	h 12-hour format of an hour with leading zeros 		01 through 12 
//	H 24-hour format of an hour with leading zeros 		00 through 23 
//	i Minutes with leading zeros 						00 to 59 
//	s Seconds, with leading zeros 						00 through 59 

+(function($, win, doc){
	
    var TimeCollector = function(elem, opts){
		this.options   = __setOptions();
		this.it 	   = elem;				
		
		// Ultilities function
		function __setOptions(){
			return $.extend({
				max_row 		: 3,
				hour_format 	: 'h:i:s',								
				appearance  	: 'modal',	
				ampm			: true											
			}, opts);
		};			
		
		return {
			build: function(){
				
			}
		};
	};
	
	TimeCollector.prototype.temp = {
        				
	};
	
	$.fn.extend({
		time_collector: function(opts){				
			return this.each({			
				//new TimeCollector(this, opts);
			});
		}
	});

}(jQuery, window, document));