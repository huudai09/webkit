(function($){

	function Slider(){
		this.elem = $(arguments[0]);
		this.bar = this.elem.find('.slider-inner');
		this.nav = this.elem.find('.slider-navigator');		
		this.config = $.extend(arguments[1], {});
		this.timer;
		
		this.run();
	}
	
	Slider.prototype.run = function(){
		var self = this, holding = false, w = this.elem.outerWidth();
				
		this.elem
      		.on('mousedown', function(e){							
				holding = true;
				self.preventSelection();
			})
			.on('mousemove', function(e){				
				(holding) && (console.log(e.offsetY), self.bar.width(e.offsetX));				
			})
			.on('mouseup', function(e){
				holding = false;
				self.preventSelection(false);
			});
	};
	
	Slider.prototype.preventSelection = function(){
		//
		return;
	};

	$.fn.slider = function(){
		return this.filter(':not(.slider-done)').each(function(){
			new Slider(this);
		});
	};
	
	
	$(function(){
		$('.slider').slider();
	});
})(jQuery);


