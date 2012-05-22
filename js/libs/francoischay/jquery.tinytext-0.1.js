(function($) {

  	var TINTYTEXT_EXPAND = "expand";
  	var TINTYTEXT_SHRINK = "shrink";

	var methods = {

		init : function(_options){
	  		var options = $.extend({}, $.fn.tinytext.defaults, _options);
	  		this.data("options", options)

	  		var expandBtn = $(options.expandEl);
	  			expandBtn.html(options.expandText)
	  			expandBtn.addClass("tiny-text-expand");
	  			expandBtn = $('<div>').append(expandBtn.clone()).remove().html();
	  		var shrinkBtn = $(options.shrinkEl);
	  			shrinkBtn.html(options.shrinkText);
	  			shrinkBtn.addClass("tiny-text-shrink");
	  			shrinkBtn = $('<div>').append(shrinkBtn.clone()).remove().html();

	  		$.each(this, function(_key, _value){
	  			var textContainer = $(_value);
	  			var text = $.trim(textContainer.html());
				
				if(text.length > options.max){
					fullText  = text + shrinkBtn;
					shortText = text.substr(0, options.max)
					var shortTextWords = shortText.split(" ");
						shortTextWords.splice(-1, 1);
					shortText = shortTextWords.join(" ") + " ";
					shortText = shortText + expandBtn;
					
					textContainer
						.html("")
						.append("<p class='tinytext-original-text'>")
						.append("<p class='tinytext-text'>")
					var originalText = textContainer.find(".tinytext-original-text");
						originalText
							.hide()
							.html(text)
					var shrinkText = textContainer.find(".tinytext-text");
						shrinkText
							.addClass("tinytext-shrinked")
							.html(shortText)

					if(originalText.height() <= textContainer.height()){
						textContainer.tinytext("destroy");
					}

					while(isTextTooLong(textContainer, ".tiny-text-expand")){
						shortTextWords.splice(-1, 1);
						shortText = shortTextWords.join(" ") + " ";
						shortText = shortText + expandBtn;
						shrinkText.html(shortText)
					}

					textContainer.data({
						"maxHeight" : originalText.height(),
						"minHeight" : textContainer.height(),
						"fullText"  : fullText,
						"shortText" : shortText
					});
				}
			})

	  		$(document)
	  			.on("click", ".tiny-text-expand", $.proxy(function(_e){
	  				expand($(_e.currentTarget).parent().parent());
				}, this))
	  			.on("click", ".tiny-text-shrink", $.proxy(function(_e){
	  				shrink($(_e.currentTarget).parent().parent());
				}, this))

			return this;
		},

		open : function(){
			expand(this);

			return this;
		},

		close : function(){
			shrink(this);

			return this;
		},

		destroy : function(){
			$.each(this, function(_key, _value){
				var text = $(_value).find(".tinytext-original-text").html();
				$(_value)
					.html("")
					.html(text)
	  				.removeData()
			})

	  		$(document)
	  			.off("click", ".tiny-text-expand", $.proxy(function(_e){
	  				expand($(_e.currentTarget).parent().parent());
				}, this))
	  			.off("click", ".tiny-text-shrink", $.proxy(function(_e){
	  				shrink($(_e.currentTarget).parent().parent());
				}, this))

			return this;
		}

	};

	function isTextTooLong(_container, _selector){
		if(_container.find(_selector).length == 0) return;
		if(_container.find(_selector).offset().top - _container.offset().top > _container.height()){
			return true;
		}
		else {
			return false;
		}
	};

  	function expand(_textContainer){
		_textContainer.find(".tinytext-text").html(_textContainer.data("fullText"))
		
		// if the shrink button ends up on a new line, we add an extra-line to the height
  		var maxHeight = _textContainer.data("maxHeight");
		if(isTextTooLong(_textContainer, ".tiny-text-shrink")) maxHeight += parseInt(_textContainer.css("line-height").replace("px", ""));
		
		_textContainer
			.css("height", maxHeight)
			.removeClass("tinytext-shrinked")
			.addClass("tinytext-expanded")

		_textContainer.trigger(TINTYTEXT_EXPAND);
  	}

  	function shrink(_textContainer){
		_textContainer
			.css("height", _textContainer.data("minHeight"))
			.removeClass("tinytext-expanded")
			.addClass("tinytext-shrinked")
			.find(".tinytext-text")
				.html(_textContainer.data("shortText"))

		_textContainer.trigger(TINTYTEXT_SHRINK)
  	}

	$.fn.tinytext = function(_method) {
	    if ( methods[_method] ) {
			return methods[ _method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } 
	    else if ( typeof _method === 'object' || ! _method ) {
			return methods.init.apply( this, arguments );
	    } 
	    else {
			$.error( 'Method ' +  _method + ' does not exist on jQuery.tinytext' );
	    }    
	  	return this;
  	};

	$.fn.tinytext.defaults = {
		max 	 	: 500,
		expandText  : "more",
		expandEl    : "<button class='expand-text'>",
		shrinkText  : "less",
		shrinkEl    : "<button class='shrink-text'>"
	};
  	

})(jQuery);