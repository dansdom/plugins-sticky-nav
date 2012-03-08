// StickyNav jQuery plugin

(function ($) {
	// this ones for you 'uncle' Doug!
	'use strict';
	
	// Plugin namespace definition
	$.StickyNav = function (options, element, callback)
	{
		// wrap the element in the jQuery object
		this.el = $(element);
		// this is the namespace for all bound event handlers in the plugin
		this.namespace = "stickyNav";
		// extend the settings object with the options, make a 'deep' copy of the object using an empty 'holding' object
		this.opts = $.extend(true, {}, $.StickyNav.settings, options);
		this.init();
	};
	
	// these are the plugin default settings that will be over-written by user settings
	$.StickyNav.settings = {
		'fixedOffest' : 0,
		'fixedClass' : 'fixedNav',
		'scrollContainer': 'document'
	};
	
	// plugin functions go here
	$.StickyNav.prototype = {
		init : function() {
			// going to need to define this, as there are some anonymous closures in this function.
			// something interesting to consider
			var nav = this;
			// set a flag to test fixed position
			this.el.isFixed = false;
			if (this.opts.scrollContainer === "document")
			{
				this.el.container = $(document);
			}
			else
			{
				this.el.container = $(this.opts.scrollContainer);
			}
			
			// this seems a bit hacky, but for now I will unbind the namespace first before binding
			this.destroy();
			
			// find the offset of the element and the scroll container
			this.el.offsetTop = this.el.offset().top;
			//this.el.containerOffset = this.el.container.offset().top;
			
			this.el.container.bind('scroll.' + this.namespace, function()
			{
				// check to top position of the element
				var elOffset = nav.el.offsetTop,
					containerScroll = nav.el.container.scrollTop();
					
				//console.log(elOffset);
				//console.log(containerScroll);
				
				// setting the fixed class
				if (containerScroll > elOffset && nav.el.isFixed == false)
				{
					nav.el.isFixed = true;
					nav.el.addClass(nav.opts.fixedClass);
					//console.log("adding");
				}
				
				// removing the fixed class
				if (containerScroll < elOffset && nav.el.isFixed == true)
				{
					nav.el.isFixed = false;
					nav.el.removeClass(nav.opts.fixedClass);
					//console.log("removing");
				}
			});
			
		},
		option : function(args) {
			this.opts = $.extend(true, {}, this.opts, args);
		},
		destroy : function() {
			//console.log("unbinding namespaced events");
			this.el.unbind("." + this.namespace);
			this.el.container.unbind("." + this.namespace);
			this.el.removeClass(this.opts.fixedClass);
		}
	};
	
	// the plugin bridging layer to allow users to call methods and add data after the plguin has been initialised
	// props to https://github.com/jsor/jcarousel/blob/master/src/jquery.jcarousel.js for the base of the code & http://isotope.metafizzy.co/ for a good implementation
	$.fn.stickyNav = function(options, callback) {
		// define the plugin name here so I don't have to change it anywhere else. This name refers to the jQuery data object that will store the plugin data
		var pluginName = "StickyNav",
			args;
		
		// if the argument is a string representing a plugin method then test which one it is
		if ( typeof options === 'string' ) {
			// define the arguments that the plugin function call may make 
			args = Array.prototype.slice.call( arguments, 1 );
			// iterate over each object that the function is being called upon
			this.each(function() {
				// test the data object that the DOM element that the plugin has for the DOM element
				var pluginInstance = $.data(this, pluginName);
				
				// if there is no data for this instance of the plugin, then the plugin needs to be initialised first, so just call an error
				if (!pluginInstance) {
					alert("The plugin has not been initialised yet when you tried to call this method: " + options);
					return;
				}
				// if there is no method defined for the option being called, or it's a private function (but I may not use this) then return an error.
				if (!$.isFunction(pluginInstance[options]) || options.charAt(0) === "_") {
					alert("the plugin contains no such method: " + options);
					return;
				}
				// apply the method that has been called
				else {
					pluginInstance[options].apply(pluginInstance, args);
				}
			});
			
		}
		// initialise the function using the arguments as the plugin options
		else {
			// initialise each instance of the plugin
			this.each(function() {
				// define the data object that is going to be attached to the DOM element that the plugin is being called on
				var pluginInstance = $.data(this, pluginName);
				// if the plugin instance already exists then apply the options to it. I don't think I need to init again, but may have to on some plugins
				if (pluginInstance) {
					pluginInstance.option(options);
					// initialising the plugin here may be dangerous and stack multiple event handlers. if required then the plugin instance may have to be 'destroyed' first
					//pluginInstance.init(callback);
				}
				// initialise a new instance of the plugin
				else {
					$.data(this, pluginName, new $.StickyNav(options, this, callback));
				}
			});
		}
		
		// return the jQuery object from here so that the plugin functions don't have to
		return this;
	};

	// end of module
})(jQuery);
