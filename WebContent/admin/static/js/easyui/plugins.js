/**
 * draggable - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	var isDragging = false;
	function drag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		
		var dragData = e.data;
		var left = dragData.startLeft + e.pageX - dragData.startX;
		var top = dragData.startTop + e.pageY - dragData.startY;
		
		if (proxy){
			if (proxy.parent()[0] == document.body){
				if (opts.deltaX != null && opts.deltaX != undefined){
					left = e.pageX + opts.deltaX;
				} else {
					left = e.pageX - e.data.offsetWidth;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top = e.pageY + opts.deltaY;
				} else {
					top = e.pageY - e.data.offsetHeight;
				}
			} else {
				if (opts.deltaX != null && opts.deltaX != undefined){
					left += e.data.offsetWidth + opts.deltaX;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top += e.data.offsetHeight + opts.deltaY;
				}
			}
		}
		
//		if (opts.deltaX != null && opts.deltaX != undefined){
//			left = e.pageX + opts.deltaX;
//		}
//		if (opts.deltaY != null && opts.deltaY != undefined){
//			top = e.pageY + opts.deltaY;
//		}
		
		if (e.data.parent != document.body) {
			left += $(e.data.parent).scrollLeft();
			top += $(e.data.parent).scrollTop();
		}
		
		if (opts.axis == 'h') {
			dragData.left = left;
		} else if (opts.axis == 'v') {
			dragData.top = top;
		} else {
			dragData.left = left;
			dragData.top = top;
		}
	}
	
	function applyDrag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		if (!proxy){
			proxy = $(e.data.target);
		}
//		if (proxy){
//			proxy.css('cursor', opts.cursor);
//		} else {
//			proxy = $(e.data.target);
//			$.data(e.data.target, 'draggable').handle.css('cursor', opts.cursor);
//		}
		proxy.css({
			left:e.data.left,
			top:e.data.top
		});
		$('body').css('cursor', opts.cursor);
	}
	
	function doDown(e){
		isDragging = true;
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		
		var droppables = $('.droppable').filter(function(){
			return e.data.target != this;
		}).filter(function(){
			var accept = $.data(this, 'droppable').options.accept;
			if (accept){
				return $(accept).filter(function(){
					return this == e.data.target;
				}).length > 0;
			} else {
				return true;
			}
		});
		state.droppables = droppables;
		
		var proxy = state.proxy;
		if (!proxy){
			if (opts.proxy){
				if (opts.proxy == 'clone'){
					proxy = $(e.data.target).clone().insertAfter(e.data.target);
				} else {
					proxy = opts.proxy.call(e.data.target, e.data.target);
				}
				state.proxy = proxy;
			} else {
				proxy = $(e.data.target);
			}
		}
		
		proxy.css('position', 'absolute');
		drag(e);
		applyDrag(e);
		
		opts.onStartDrag.call(e.data.target, e);
		return false;
	}
	
	function doMove(e){
		var state = $.data(e.data.target, 'draggable');
		drag(e);
		if (state.options.onDrag.call(e.data.target, e) != false){
			applyDrag(e);
		}
		
		var source = e.data.target;
		state.droppables.each(function(){
			var dropObj = $(this);
			if (dropObj.droppable('options').disabled){return;}
			
			var p2 = dropObj.offset();
			if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
					&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
				if (!this.entered){
					$(this).trigger('_dragenter', [source]);
					this.entered = true;
				}
				$(this).trigger('_dragover', [source]);
			} else {
				if (this.entered){
					$(this).trigger('_dragleave', [source]);
					this.entered = false;
				}
			}
		});
		
		return false;
	}
	
	function doUp(e){
		isDragging = false;
//		drag(e);
		doMove(e);
		
		var state = $.data(e.data.target, 'draggable');
		var proxy = state.proxy;
		var opts = state.options;
		if (opts.revert){
			if (checkDrop() == true){
				$(e.data.target).css({
					position:e.data.startPosition,
					left:e.data.startLeft,
					top:e.data.startTop
				});
			} else {
				if (proxy){
					var left, top;
					if (proxy.parent()[0] == document.body){
						left = e.data.startX - e.data.offsetWidth;
						top = e.data.startY - e.data.offsetHeight;
					} else {
						left = e.data.startLeft;
						top = e.data.startTop;
					}
					proxy.animate({
						left: left,
						top: top
					}, function(){
						removeProxy();
					});
				} else {
					$(e.data.target).animate({
						left:e.data.startLeft,
						top:e.data.startTop
					}, function(){
						$(e.data.target).css('position', e.data.startPosition);
					});
				}
			}
		} else {
			$(e.data.target).css({
				position:'absolute',
				left:e.data.left,
				top:e.data.top
			});
			checkDrop();
		}
		
		opts.onStopDrag.call(e.data.target, e);
		
		$(document).unbind('.draggable');
		setTimeout(function(){
			$('body').css('cursor','');
		},100);
		
		function removeProxy(){
			if (proxy){
				proxy.remove();
			}
			state.proxy = null;
		}
		
		function checkDrop(){
			var dropped = false;
			state.droppables.each(function(){
				var dropObj = $(this);
				if (dropObj.droppable('options').disabled){return;}
				
				var p2 = dropObj.offset();
				if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
						&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
					if (opts.revert){
						$(e.data.target).css({
							position:e.data.startPosition,
							left:e.data.startLeft,
							top:e.data.startTop
						});
					}
					removeProxy();
					$(this).trigger('_drop', [e.data.target]);
					dropped = true;
					this.entered = false;
					return false;
				}
			});
			if (!dropped && !opts.revert){
				removeProxy();
			}
			return dropped;
		}
		
		return false;
	}
	
	$.fn.draggable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.draggable.methods[options](this, param);
		}
		
		return this.each(function(){
			var opts;
			var state = $.data(this, 'draggable');
			if (state) {
				state.handle.unbind('.draggable');
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.draggable.defaults, $.fn.draggable.parseOptions(this), options || {});
			}
			
			if (opts.disabled == true) {
				$(this).css('cursor', '');
//				$(this).css('cursor', 'default');
				return;
			}
			
			var handle = null;
            if (typeof opts.handle == 'undefined' || opts.handle == null){
                handle = $(this);
            } else {
                handle = (typeof opts.handle == 'string' ? $(opts.handle, this) : opts.handle);
            }
			$.data(this, 'draggable', {
				options: opts,
				handle: handle
			});
			
			handle.unbind('.draggable').bind('mousemove.draggable', {target:this}, function(e){
				if (isDragging) return;
				var opts = $.data(e.data.target, 'draggable').options;
				if (checkArea(e)){
					$(this).css('cursor', opts.cursor);
				} else {
					$(this).css('cursor', '');
				}
			}).bind('mouseleave.draggable', {target:this}, function(e){
				$(this).css('cursor', '');
			}).bind('mousedown.draggable', {target:this}, function(e){
				if (checkArea(e) == false) return;
				$(this).css('cursor', '');

				var position = $(e.data.target).position();
				var offset = $(e.data.target).offset();
				var data = {
					startPosition: $(e.data.target).css('position'),
					startLeft: position.left,
					startTop: position.top,
					left: position.left,
					top: position.top,
					startX: e.pageX,
					startY: e.pageY,
					offsetWidth: (e.pageX - offset.left),
					offsetHeight: (e.pageY - offset.top),
					target: e.data.target,
					parent: $(e.data.target).parent()[0]
				};
				
				$.extend(e.data, data);
				var opts = $.data(e.data.target, 'draggable').options;
				if (opts.onBeforeDrag.call(e.data.target, e) == false) return;
				
				$(document).bind('mousedown.draggable', e.data, doDown);
				$(document).bind('mousemove.draggable', e.data, doMove);
				$(document).bind('mouseup.draggable', e.data, doUp);
//				$('body').css('cursor', opts.cursor);
			});
			
			// check if the handle can be dragged
			function checkArea(e) {
				var state = $.data(e.data.target, 'draggable');
				var handle = state.handle;
				var offset = $(handle).offset();
				var width = $(handle).outerWidth();
				var height = $(handle).outerHeight();
				var t = e.pageY - offset.top;
				var r = offset.left + width - e.pageX;
				var b = offset.top + height - e.pageY;
				var l = e.pageX - offset.left;
				
				return Math.min(t,r,b,l) > state.options.edge;
			}
			
		});
	};
	
	$.fn.draggable.methods = {
		options: function(jq){
			return $.data(jq[0], 'draggable').options;
		},
		proxy: function(jq){
			return $.data(jq[0], 'draggable').proxy;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:true});
			});
		}
	};
	
	$.fn.draggable.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, 
				$.parser.parseOptions(target, ['cursor','handle','axis',
				       {'revert':'boolean','deltaX':'number','deltaY':'number','edge':'number'}]), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.draggable.defaults = {
		proxy:null,	// 'clone' or a function that will create the proxy object, 
					// the function has the source parameter that indicate the source object dragged.
		revert:false,
		cursor:'move',
		deltaX:null,
		deltaY:null,
		handle: null,
		disabled: false,
		edge:0,
		axis:null,	// v or h
		
		onBeforeDrag: function(e){},
		onStartDrag: function(e){},
		onDrag: function(e){},
		onStopDrag: function(e){}
	};
})(jQuery);

/**
 * droppable - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	function init(target){
		$(target).addClass('droppable');
		$(target).bind('_dragenter', function(e, source){
			$.data(target, 'droppable').options.onDragEnter.apply(target, [e, source]);
		});
		$(target).bind('_dragleave', function(e, source){
			$.data(target, 'droppable').options.onDragLeave.apply(target, [e, source]);
		});
		$(target).bind('_dragover', function(e, source){
			$.data(target, 'droppable').options.onDragOver.apply(target, [e, source]);
		});
		$(target).bind('_drop', function(e, source){
			$.data(target, 'droppable').options.onDrop.apply(target, [e, source]);
		});
	}
	
	$.fn.droppable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.droppable.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'droppable');
			if (state){
				$.extend(state.options, options);
			} else {
				init(this);
				$.data(this, 'droppable', {
					options: $.extend({}, $.fn.droppable.defaults, $.fn.droppable.parseOptions(this), options)
				});
			}
		});
	};
	
	$.fn.droppable.methods = {
		options: function(jq){
			return $.data(jq[0], 'droppable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:true});
			});
		}
	};
	
	$.fn.droppable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},	$.parser.parseOptions(target, ['accept']), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.droppable.defaults = {
		accept:null,
		disabled:false,
		onDragEnter:function(e, source){},
		onDragOver:function(e, source){},
		onDragLeave:function(e, source){},
		onDrop:function(e, source){}
	};
})(jQuery);

/**
 * resizable - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	var isResizing = false;
	$.fn.resizable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.resizable.methods[options](this, param);
		}
		
		function resize(e){
			var resizeData = e.data;
			var options = $.data(resizeData.target, 'resizable').options;
			if (resizeData.dir.indexOf('e') != -1) {
				var width = resizeData.startWidth + e.pageX - resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
			}
			if (resizeData.dir.indexOf('s') != -1) {
				var height = resizeData.startHeight + e.pageY - resizeData.startY;
				height = Math.min(
						Math.max(height, options.minHeight),
						options.maxHeight
				);
				resizeData.height = height;
			}
			if (resizeData.dir.indexOf('w') != -1) {
				resizeData.width = resizeData.startWidth - e.pageX + resizeData.startX;
				if (resizeData.width >= options.minWidth && resizeData.width <= options.maxWidth) {
					resizeData.left = resizeData.startLeft + e.pageX - resizeData.startX;
				}
			}
			if (resizeData.dir.indexOf('n') != -1) {
				resizeData.height = resizeData.startHeight - e.pageY + resizeData.startY;
				if (resizeData.height >= options.minHeight && resizeData.height <= options.maxHeight) {
					resizeData.top = resizeData.startTop + e.pageY - resizeData.startY;
				}
			}
		}
		
		function applySize(e){
			var resizeData = e.data;
			var target = resizeData.target;
			$(target).css({
				left: resizeData.left,
				top: resizeData.top
			});
			$(target)._outerWidth(resizeData.width)._outerHeight(resizeData.height);
		}
		
		function doDown(e){
			isResizing = true;
			$.data(e.data.target, 'resizable').options.onStartResize.call(e.data.target, e);
			return false;
		}
		
		function doMove(e){
			resize(e);
			if ($.data(e.data.target, 'resizable').options.onResize.call(e.data.target, e) != false){
				applySize(e)
			}
			return false;
		}
		
		function doUp(e){
			isResizing = false;
			resize(e, true);
			applySize(e);
			$.data(e.data.target, 'resizable').options.onStopResize.call(e.data.target, e);
			$(document).unbind('.resizable');
			$('body').css('cursor','');
//			$('body').css('cursor','auto');
			return false;
		}
		
		return this.each(function(){
			var opts = null;
			var state = $.data(this, 'resizable');
			if (state) {
				$(this).unbind('.resizable');
				opts = $.extend(state.options, options || {});
			} else {
				opts = $.extend({}, $.fn.resizable.defaults, $.fn.resizable.parseOptions(this), options || {});
				$.data(this, 'resizable', {
					options:opts
				});
			}
			
			if (opts.disabled == true) {
				return;
			}
			
			// bind mouse event using namespace resizable
			$(this).bind('mousemove.resizable', {target:this}, function(e){
				if (isResizing) return;
				var dir = getDirection(e);
				if (dir == '') {
					$(e.data.target).css('cursor', '');
				} else {
					$(e.data.target).css('cursor', dir + '-resize');
				}
			}).bind('mouseleave.resizable', {target:this}, function(e){
				$(e.data.target).css('cursor', '');
			}).bind('mousedown.resizable', {target:this}, function(e){
				var dir = getDirection(e);
				if (dir == '') return;
				
				function getCssValue(css) {
					var val = parseInt($(e.data.target).css(css));
					if (isNaN(val)) {
						return 0;
					} else {
						return val;
					}
				}
				
				var data = {
					target: e.data.target,
					dir: dir,
					startLeft: getCssValue('left'),
					startTop: getCssValue('top'),
					left: getCssValue('left'),
					top: getCssValue('top'),
					startX: e.pageX,
					startY: e.pageY,
					startWidth: $(e.data.target).outerWidth(),
					startHeight: $(e.data.target).outerHeight(),
					width: $(e.data.target).outerWidth(),
					height: $(e.data.target).outerHeight(),
					deltaWidth: $(e.data.target).outerWidth() - $(e.data.target).width(),
					deltaHeight: $(e.data.target).outerHeight() - $(e.data.target).height()
				};
				$(document).bind('mousedown.resizable', data, doDown);
				$(document).bind('mousemove.resizable', data, doMove);
				$(document).bind('mouseup.resizable', data, doUp);
				$('body').css('cursor', dir+'-resize');
			});
			
			// get the resize direction
			function getDirection(e) {
				var tt = $(e.data.target);
				var dir = '';
				var offset = tt.offset();
				var width = tt.outerWidth();
				var height = tt.outerHeight();
				var edge = opts.edge;
				if (e.pageY > offset.top && e.pageY < offset.top + edge) {
					dir += 'n';
				} else if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {
					dir += 's';
				}
				if (e.pageX > offset.left && e.pageX < offset.left + edge) {
					dir += 'w';
				} else if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {
					dir += 'e';
				}
				
				var handles = opts.handles.split(',');
				for(var i=0; i<handles.length; i++) {
					var handle = handles[i].replace(/(^\s*)|(\s*$)/g, '');
					if (handle == 'all' || handle == dir) {
						return dir;
					}
				}
				return '';
			}
			
			
		});
	};
	
	$.fn.resizable.methods = {
		options: function(jq){
			return $.data(jq[0], 'resizable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:true});
			});
		}
	};
	
	$.fn.resizable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},
				$.parser.parseOptions(target, [
					'handles',{minWidth:'number',minHeight:'number',maxWidth:'number',maxHeight:'number',edge:'number'}
				]), {
			disabled: (t.attr('disabled') ? true : undefined)
		})
	};
	
	$.fn.resizable.defaults = {
		disabled:false,
		handles:'n, e, s, w, ne, se, sw, nw, all',
		minWidth: 10,
		minHeight: 10,
		maxWidth: 10000,//$(document).width(),
		maxHeight: 10000,//$(document).height(),
		edge:5,
		onStartResize: function(e){},
		onResize: function(e){},
		onStopResize: function(e){}
	};
	
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		_2.each(function() {
			$(this).remove();
			if ($.browser.msie) {
				this.outerHTML = "";
			}
		});
	}
	;
	function _3(_4, _5) {
		var _6 = $.data(_4, "panel").options;
		var _7 = $.data(_4, "panel").panel;
		var _8 = _7.children("div.panel-header");
		var _9 = _7.children("div.panel-body");
		if (_5) {
			if (_5.width) {
				_6.width = _5.width;
			}
			if (_5.height) {
				_6.height = _5.height;
			}
			if (_5.left != null) {
				_6.left = _5.left;
			}
			if (_5.top != null) {
				_6.top = _5.top;
			}
		}
		_6.fit ? $.extend(_6, _7._fit()) : _7._fit(false);
		_7.css({
			left : _6.left,
			top : _6.top
		});
		if (!isNaN(_6.width)) {
			_7._outerWidth(_6.width);
		} else {
			_7.width("auto");
		}
		_8.add(_9)._outerWidth(_7.width());
		if (!isNaN(_6.height)) {
			_7._outerHeight(_6.height);
			_9._outerHeight(_7.height() - _8._outerHeight());
		} else {
			_9.height("auto");
		}
		_7.css("height", "");
		_6.onResize.apply(_4, [ _6.width, _6.height ]);
		_7.find(">div.panel-body>div").triggerHandler("_resize");
	}
	;
	function _a(_b, _c) {
		var _d = $.data(_b, "panel").options;
		var _e = $.data(_b, "panel").panel;
		if (_c) {
			if (_c.left != null) {
				_d.left = _c.left;
			}
			if (_c.top != null) {
				_d.top = _c.top;
			}
		}
		_e.css({
			left : _d.left,
			top : _d.top
		});
		_d.onMove.apply(_b, [ _d.left, _d.top ]);
	}
	;
	function _f(_10) {
		$(_10).addClass("panel-body");
		var _11 = $("<div class=\"panel\"></div>").insertBefore(_10);
		_11[0].appendChild(_10);
		_11.bind("_resize", function() {
			var _12 = $.data(_10, "panel").options;
			if (_12.fit == true) {
				_3(_10);
			}
			return false;
		});
		return _11;
	}
	;
	function _13(_14) {
		var _15 = $.data(_14, "panel").options;
		var _16 = $.data(_14, "panel").panel;
		if (_15.tools && typeof _15.tools == "string") {
			_16.find(">div.panel-header>div.panel-tool .panel-tool-a").appendTo(_15.tools);
		}
		_1(_16.children("div.panel-header"));
		if (_15.title && !_15.noheader) {
			var _17 = $("<div class=\"panel-header\"><div class=\"panel-title\">" + _15.title + "</div></div>").prependTo(_16);
			
			if( _15.headerCollapse ){//启用表头折叠
				_17.click(function(){
					_15.collapsed == true ? expand(_14, true) : collapse(_14, true);
				});
			}
			
			if (_15.iconCls) {
				_17.find(".panel-title").addClass("panel-with-icon");
				$("<div class=\"panel-icon\"></div>").addClass(_15.iconCls).appendTo(_17);
			}
			var _18 = $("<div class=\"panel-tool\"></div>").appendTo(_17);
			_18.bind("click", function(e) {
				e.stopPropagation();
			});
			if (_15.tools) {
				if (typeof _15.tools == "string") {
					$(_15.tools).children().each(function() {
						$(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(_18);
					});
				} else {
					for ( var i = 0; i < _15.tools.length; i++) {
						var t = $("<a href=\"javascript:void(0)\"></a>").addClass(_15.tools[i].iconCls).appendTo(_18);
						var handler = _15.tools[i].handler ? eval(_15.tools[i].handler) : function(){};
						t.bind("click", handler);
						if( _15.tools[i].text ){
							var $text = $("<span class='hand' style='color:#575765;'>" + _15.tools[i].text + "</span>").appendTo(_18);
							$text.bind("click", handler);
						}
					}
				}
			}
			
			if (_15.collapsible) {
				$("<a class=\"panel-tool-collapse\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click", function() {
					if (_15.collapsed == true) {
						expand(_14, true);
					} else {
						collapse(_14, true);
					}
					return false;
				});
			}
			if (_15.minimizable) {
				$("<a class=\"panel-tool-min\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click", function() {
					_47(_14);
					return false;
				});
			}
			if (_15.maximizable) {
				$("<a class=\"panel-tool-max\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click", function() {
					if (_15.maximized == true) {
						_4b(_14);
					} else {
						maximize(_14);
					}
					return false;
				});
			}
			if (_15.closable) {
				$("<a class=\"panel-tool-close\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click", function() {
					doClose(_14);
					return false;
				});
			}
			_16.children("div.panel-body").removeClass("panel-body-noheader");
		} else {
			_16.children("div.panel-body").addClass("panel-body-noheader");
		}
	}
	;
	function refresh(_1b) {
		var _1c = $.data(_1b, "panel");
		var _1d = _1c.options;
		if (_1d.href) {
			if (!_1c.isLoaded || !_1d.cache) {
				_1c.isLoaded = false;
				_1e(_1b);
				if (_1d.loadingMessage) {
					$(_1b).html($("<div class=\"panel-loading\"></div>").html(_1d.loadingMessage));
				}
				var params = _1d.params || {};
				$.ajax({
					url : _1d.href,
					cache : false,
					data : params,
					type : "POST",
					dataType : "html",
					success : function(_1f) {
						_20(_1d.extractor.call(_1b, _1f));
						_1d.onLoad.apply(_1b, arguments);
						_1c.isLoaded = true;
					},error:function(){
						_20($("#ERROR").html());
					}
				});
			}
		} else {
			if (_1d.content) {
				if (!_1c.isLoaded) {
					_1e(_1b);
					_20(_1d.content);
					_1c.isLoaded = true;
				}
			}
		}
		function _20(_21) {
			$(_1b).html(_21);
			if ($.parser) {
				$.parser.parse($(_1b));
			}
		}
		;
	}
	;
	function _1e(_22) {
		var t = $(_22);
		t.find(".combo-f").each(function() {
			$(this).combo("destroy");
		});
		t.find(".select-f").each(function() {
			$(this).selectx("destroy");
		});
		t.find(".search-f").each(function() {
			$(this).search("destroy");
		});
		t.find(".m-btn").each(function() {
			$(this).menubutton("destroy");
		});
		t.find(".s-btn").each(function() {
			$(this).splitbutton("destroy");
		});
		t.find("[destoryable]").each(function() {
			var destroy = $(this).data("destoryable");
			destroy();//调用销毁
		});
	}
	;
	function triggerResize(_24) {
		if( window["Constant"] && !Constant.PANEL_TRIGGER_RESIZE){
			if( $(_24).parents(".dialog-div").exist() ){ 
				setTimeout(function(){
					$(_24).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible").each(function() {
						$(this).triggerHandler("_resize", [ true ]);
					});
				},100);
			}
		}else{
			$(_24).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible").each(function() {
				$(this).triggerHandler("_resize", [ true ]);
			});
		}
	}
	;
	function open(target, forceOpen) {
		var options = $.data(target, "panel").options;
		var panel = $.data(target, "panel").panel;
		if (forceOpen != true) {
			if (options.onBeforeOpen.call(target) == false) {
				return;
			}
		}
		panel.show();
		options.closed = false;
		options.minimized = false;
		var _2a = panel.children("div.panel-header").find("a.panel-tool-restore");
		if (_2a.length) {
			options.maximized = true;
		}
		options.onOpen.call(target);
		if (options.maximized == true) {
			options.maximized = false;
			maximize(target);
		}
		if (options.collapsed == true) {
			options.collapsed = false;
			collapse(target);
		}
		
		var cache = (options.href || "").contains("cache=false");
		if( cache ){//如果URL包含cache=false则不缓存内容
			options.cache = false;
		}
		
		if (!options.collapsed) {
			refresh(target);
			triggerResize(target);
		}
	}
	;
	function doClose(target, forceClose) {
		var options = $.data(target, "panel").options;
		var panel = $.data(target, "panel").panel;
		if (forceClose != true) {
			if (options.onBeforeClose.call(target) == false) {
				return;
			}
		}
		panel._fit(false);
		panel.hide();
		options.closed = true;
		options.onClose.call(target, forceClose);
	}
	;
	function _31(_32, _33) {
		var _34 = $.data(_32, "panel").options;
		var _35 = $.data(_32, "panel").panel;
		if (_33 != true) {
			if (_34.onBeforeDestroy.call(_32) == false) {
				return;
			}
		}
		_1e(_32);
		_1(_35);
		_34.onDestroy.call(_32);
	}
	;
	function collapse(_36, _37) {
		var _38 = $.data(_36, "panel").options;
		var _39 = $.data(_36, "panel").panel;
		var _3a = _39.children("div.panel-body");
		var _3b = _39.children("div.panel-header").find("a.panel-tool-collapse");
		if (_38.collapsed == true) {
			return;
		}
		_3a.stop(true, true);
		if (_38.onBeforeCollapse.call(_36) == false) {
			return;
		}
		_3b.addClass("panel-tool-expand");
		if (_37 == true) {
			_3a.slideUp("normal", function() {
				_38.collapsed = true;
				_38.onCollapse.call(_36);
			});
		} else {
			_3a.hide();
			_38.collapsed = true;
			_38.onCollapse.call(_36);
		}
	}
	;
	function expand(_3d, _3e) {
		var _3f = $.data(_3d, "panel").options;
		var _40 = $.data(_3d, "panel").panel;
		var _41 = _40.children("div.panel-body");
		var _42 = _40.children("div.panel-header").find("a.panel-tool-collapse");
		if (_3f.collapsed == false) {
			return;
		}
		_41.stop(true, true);
		if (_3f.onBeforeExpand.call(_3d) == false) {
			return;
		}
		_42.removeClass("panel-tool-expand");
		if (_3e == true) {
			_41.slideDown("normal", function() {
				_3f.collapsed = false;
				_3f.onExpand.call(_3d);
				refresh(_3d);
				triggerResize(_3d);
			});
		} else {
			_41.show();
			_3f.collapsed = false;
			_3f.onExpand.call(_3d);
			refresh(_3d);
			triggerResize(_3d);
		}
	}
	;
	function maximize(_43) {
		var _44 = $.data(_43, "panel").options;
		var _45 = $.data(_43, "panel").panel;
		var _46 = _45.children("div.panel-header").find("a.panel-tool-max");
		if (_44.maximized == true) {
			return;
		}
		_46.addClass("panel-tool-restore");
		if (!$.data(_43, "panel").original) {
			$.data(_43, "panel").original = {
				width : _44.width,
				height : _44.height,
				left : _44.left,
				top : _44.top,
				fit : _44.fit
			};
		}
		_44.left = 0;
		_44.top = 0;
		_44.fit = true;
		_3(_43);
		_44.minimized = false;
		_44.maximized = true;
		_44.onMaximize.call(_43);
	}
	;
	function _47(_48) {
		var _49 = $.data(_48, "panel").options;
		var _4a = $.data(_48, "panel").panel;
		_4a._fit(false);
		_4a.hide();
		_49.minimized = true;
		_49.maximized = false;
		_49.onMinimize.call(_48);
	}
	;
	function _4b(_4c) {
		var _4d = $.data(_4c, "panel").options;
		var _4e = $.data(_4c, "panel").panel;
		var _4f = _4e.children("div.panel-header").find("a.panel-tool-max");
		if (_4d.maximized == false) {
			return;
		}
		_4e.show();
		_4f.removeClass("panel-tool-restore");
		$.extend(_4d, $.data(_4c, "panel").original);
		_3(_4c);
		_4d.minimized = false;
		_4d.maximized = false;
		$.data(_4c, "panel").original = null;
		_4d.onRestore.call(_4c);
	}
	;
	function _50(_51) {
		var _52 = $.data(_51, "panel").options;
		var _53 = $.data(_51, "panel").panel;
		var _54 = $(_51).panel("header");
		var _55 = $(_51).panel("body");
		_53.css(_52.style);
		_53.addClass(_52.cls);
		if (_52.border) {
			_54.removeClass("panel-header-noborder");
			_55.removeClass("panel-body-noborder");
		} else {
			_54.addClass("panel-header-noborder");
			_55.addClass("panel-body-noborder");
		}
		_54.addClass(_52.headerCls);
		_55.addClass(_52.bodyCls);
		if (_52.id) {
			$(_51).attr("id", _52.id);
		} else {
			$(_51).attr("id", "");
		}
	}
	;
	function _56(_57, _58) {
		$.data(_57, "panel").options.title = _58;
		$(_57).panel("header").find("div.panel-title").html(_58);
	}
	;
	var TO = false;
	var _59 = true;
	$(window).unbind(".panel").bind("resize.panel", function() {
		if (!_59) {
			return;
		}
		if (TO !== false) {
			clearTimeout(TO);
		}
		TO = setTimeout(function() {
			_59 = false;
			var _5a = $("body.layout");
			if (_5a.length) {
				_5a.layout("resize");
			} else {
				$("body").children("div.panel,div.accordion,div.tabs-container,div.layout").triggerHandler("_resize");
			}
			_59 = true;
			TO = false;
		}, 200);
	});
	$.fn.panel = function(_5b, _5c) {
		if (typeof _5b == "string") {
			return $.fn.panel.methods[_5b](this, _5c);
		}
		_5b = _5b || {};
		return this.each(function() {
			var _5d = $.data(this, "panel");
			var _5e;
			if (_5d) {
				_5e = $.extend(_5d.options, _5b);
				_5d.isLoaded = false;
			} else {
				_5e = $.extend({}, $.fn.panel.defaults, $.fn.panel.parseOptions(this), _5b);
				$(this).attr("title", "");
				_5d = $.data(this, "panel", {
					options : _5e,
					panel : _f(this),
					isLoaded : false
				});
			}
			_13(this);
			_50(this);
			if (_5e.doSize == true) {
				_5d.panel.css("display", "block");
				_3(this);
			}
			if (_5e.closed == true || _5e.minimized == true) {
				_5d.panel.hide();
			} else {
				open(this);
			}
		});
	};
	$.fn.panel.methods = {
		options : function(jq) {
			return $.data(jq[0], "panel").options;
		},
		panel : function(jq) {
			return $.data(jq[0], "panel").panel;
		},
		header : function(jq) {
			return $.data(jq[0], "panel").panel.find(">div.panel-header");
		},
		body : function(jq) {
			return $.data(jq[0], "panel").panel.find(">div.panel-body");
		},
		setTitle : function(jq, _5f) {
			return jq.each(function() {
				_56(this, _5f);
			});
		},
		open : function(jq, forceOpen) {
			return jq.each(function() {
				open(this, forceOpen);
			});
		},
		close : function(jq, forceClose) {
			return jq.each(function() {
				doClose(this, forceClose);
			});
		},
		destroy : function(jq, _62) {
			return jq.each(function() {
				_31(this, _62);
			});
		},
		refresh : function(jq, param) {
			return jq.each(function() {
				$.data(this, "panel").isLoaded = false;
				var options = $.data(this, "panel").options;
				if (typeof param == "string" ) {
					options.href = param;
				}else if (typeof param == "object"){
					if( param.href ){
						options.href = param.href;
					}
					options.params = param.params || {};
				}
				refresh(this);
			});
		},
		resize : function(jq, _64) {
			return jq.each(function() {
				_3(this, _64);
			});
		},
		move : function(jq, _65) {
			return jq.each(function() {
				_a(this, _65);
			});
		},
		maximize : function(jq) {
			return jq.each(function() {
				maximize(this);
			});
		},
		minimize : function(jq) {
			return jq.each(function() {
				_47(this);
			});
		},
		restore : function(jq) {
			return jq.each(function() {
				_4b(this);
			});
		},
		collapse : function(jq, _66) {
			return jq.each(function() {
				collapse(this, _66);
			});
		},
		expand : function(jq, _67) {
			return jq.each(function() {
				expand(this, _67);
			});
		}
	};
	$.fn.panel.parseOptions = function(_68) {
		var t = $(_68);
		return $.extend({}, $.parser.parseOptions(_68, [ "id", "width", "height", "left", "top", "title", "iconCls", "cls", "headerCls", "bodyCls", "tools",
				"href", {
					cache : "boolean",
					fit : "boolean",
					border : "boolean",
					noheader : "boolean"
				}, {
					collapsible : "boolean",
					minimizable : "boolean",
					maximizable : "boolean"
				}, {
					closable : "boolean",
					collapsed : "boolean",
					minimized : "boolean",
					maximized : "boolean",
					closed : "boolean"
				} ]), {
			loadingMessage : (t.attr("loadingMessage") != undefined ? t.attr("loadingMessage") : undefined)
		});
	};
	$.fn.panel.defaults = {
		id : null,
		title : null,
		iconCls : null,
		width : "auto",
		height : "auto",
		left : null,
		top : null,
		cls : null,
		headerCls : null,
		bodyCls : null,
		style : {},
		href : null,
		cache : true,
		fit : false,
		border : true,
		doSize : true,
		noheader : false,
		content : null,
		collapsible : false,
		minimizable : false,
		maximizable : false,
		closable : false,
		collapsed : false,
		minimized : false,
		maximized : false,
		closed : false,
		tools : null,
		href : null,
		loadingMessage : "Loading...",
		extractor : function(html) {
			var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
			var body = pattern.exec(html);
			var text = null;
			if (body) {
				text = body[1];
			} else {
				text = html;
			}
			text = text.replace(/\{pageId\}/g, new Date().getTime() + "");
			return text;
		},
		onLoad : function() {
		},
		onBeforeOpen : function() {
		},
		onOpen : function() {
		},
		onBeforeClose : function() {
		},
		onClose : function() {
		},
		onBeforeDestroy : function() {
		},
		onDestroy : function() {
		},
		onResize : function(_6c, _6d) {
		},
		onMove : function(_6e, top) {
		},
		onMaximize : function() {
		},
		onRestore : function() {
		},
		onMinimize : function() {
		},
		onBeforeCollapse : function() {
		},
		onBeforeExpand : function() {
		},
		onCollapse : function() {
		},
		onExpand : function() {
		}
	};
})(jQuery);
﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "pagination");
		var _4 = _3.options;
		var bb = _3.bb = {};
		var _5 = $(_2).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
		var tr = _5.find("tr");
		function _6(_7) {
			var _8 = _4.nav[_7];
			var a = $("<a href=\"javascript:void(0)\"></a>").appendTo(tr);
			a.wrap("<td></td>");
			a.linkbutton({
				iconCls : _8.iconCls,
				plain : true
			}).unbind(".pagination").bind("click.pagination", function() {
				_8.handler.call(_2);
			});
			return a;
		}
		;
		if (_4.showPageList) {
			var ps = $("<select class=\"pagination-page-list\"></select>");
			ps.bind("change", function() {
				_4.pageSize = parseInt($(this).val());
				_4.onChangePageSize.call(_2, _4.pageSize);
				_b(_2, _4.pageNumber);
			});
			for ( var i = 0; i < _4.pageList.length; i++) {
				$("<option></option>").text(_4.pageList[i]).appendTo(ps);
			}
			$("<td class='redundant'></td>").append(ps).appendTo(tr);
			$("<td class='redundant'><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		}
		bb.first = _6("first").addClass('redundant');
		bb.prev = _6("prev");
		$("<td class='redundant'><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		$("<span style=\"padding-left:6px;\"></span>").html(_4.beforePageText).appendTo(tr).wrap("<td class='redundant'></td>");
		bb.num = $("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td  class='redundant'></td>");
		bb.num.unbind(".pagination").bind("keydown.pagination", function(e) {
			if (e.keyCode == 13) {
				var _9 = parseInt($(this).val()) || 1;
				_b(_2, _9);
				return false;
			}
		});
		bb.after = $("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
		$("<td class='redundant'><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
		bb.next = _6("next");
		bb.last = _6("last").addClass('redundant');
		if (_4.showRefresh) {
			$("<td class='redundant'><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
			bb.refresh = _6("refresh");
			bb.refresh.addClass('redundant');
		}
		if (_4.buttons) {
			if( $.type(_4.buttons) == "array" ){
				$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
				for ( var i = 0; i < _4.buttons.length; i++) {
					var _a = _4.buttons[i];
					if (_a == "-") {
						$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
					} else {
						var td = $("<td></td>").appendTo(tr);
						var text = _a.text || "";
						$("<a href=\"javascript:void(0)\">" + text + "</a>").appendTo(td).linkbutton($.extend(_a, {
							plain : true
						})).bind("click", eval(_a.handler || function() {
						}));
					}
				}
			}else if( $.type(_4.buttons) == "object" ){
				$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
				var td = $("<td></td>").appendTo(tr);
				_4.buttons.appendTo(td);
			}else if( $.type(_4.buttons) == "string" ){
				$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
				var td = $("<td></td>").appendTo(tr);
				var buttons = $(_4.buttons).clone();
				buttons.appendTo(td);
			}
		}
		$("<div class=\"pagination-info redundant\"></div>").appendTo(_5);
		$("<div style=\"clear:both;\"></div>").appendTo(_5);
		if( _4.simple ){
			$(".redundant", _2).hide();
		}
	}
	;
	function _b(_c, _d) {
		var _e = $.data(_c, "pagination").options;
		var _f = Math.ceil(_e.total / _e.pageSize) || 1;
		_e.pageNumber = _d;
		if (_e.pageNumber < 1) {
			_e.pageNumber = 1;
		}
		if (_e.pageNumber > _f) {
			_e.pageNumber = _f;
		}
		_10(_c, {
			pageNumber : _e.pageNumber
		});
		_e.onSelectPage.call(_c, _e.pageNumber, _e.pageSize);
	}
	;
	function _10(_11, _12) {
		var _13 = $.data(_11, "pagination").options;
		var bb = $.data(_11, "pagination").bb;
		$.extend(_13, _12 || {});
		var ps = $(_11).find("select.pagination-page-list");
		if (ps.length) {
			ps.val(_13.pageSize + "");
			_13.pageSize = parseInt(ps.val());
		}
		var _14 = Math.ceil(_13.total / _13.pageSize) || 1;
		bb.num.val(_13.pageNumber);
		var text = _13.afterPageText;
		text = text.replace(/{pages}/, _14);
		text = text.replace(/{total}/, _13.total);
		bb.after.html(text);
		var _15 = _13.displayMsg;
		_15 = _15.replace(/{from}/, _13.total == 0 ? 0 : _13.pageSize * (_13.pageNumber - 1) + 1);
		_15 = _15.replace(/{to}/, Math.min(_13.pageSize * (_13.pageNumber), _13.total));
		_15 = _15.replace(/{total}/, _13.total);
		$(_11).find("div.pagination-info").html(_15);
		bb.first.add(bb.prev).linkbutton({
			disabled : (_13.pageNumber == 1)
		});
		bb.next.add(bb.last).linkbutton({
			disabled : (_13.pageNumber == _14)
		});
		_16(_11, _13.loading);
	}
	;
	function _16(_17, _18) {
		var _19 = $.data(_17, "pagination").options;
		var bb = $.data(_17, "pagination").bb;
		_19.loading = _18;
		if (_19.showRefresh) {
			if (_19.loading) {
				bb.refresh.linkbutton({
					iconCls : "pagination-loading"
				});
			} else {
				bb.refresh.linkbutton({
					iconCls : "pagination-load"
				});
			}
		}
	}
	;
	$.fn.pagination = function(_1a, _1b) {
		if (typeof _1a == "string") {
			return $.fn.pagination.methods[_1a](this, _1b);
		}
		_1a = _1a || {};
		return this.each(function() {
			var _1c;
			var _1d = $.data(this, "pagination");
			if (_1d) {
				_1c = $.extend(_1d.options, _1a);
			} else {
				_1c = $.extend({}, $.fn.pagination.defaults, $.fn.pagination.parseOptions(this), _1a);
				$.data(this, "pagination", {
					options : _1c
				});
			}
			_1(this);
			_10(this);
		});
	};
	$.fn.pagination.methods = {
		options : function(jq) {
			return $.data(jq[0], "pagination").options;
		},
		loading : function(jq) {
			return jq.each(function() {
				_16(this, true);
			});
		},
		loaded : function(jq) {
			return jq.each(function() {
				_16(this, false);
			});
		},
		refresh : function(jq, _1e) {
			return jq.each(function() {
				_10(this, _1e);
			});
		},
		select : function(jq, _1f) {
			return jq.each(function() {
				_b(this, _1f);
			});
		}
	};
	$.fn.pagination.parseOptions = function(_20) {
		var t = $(_20);
		return $.extend({}, $.parser.parseOptions(_20, [ {
			total : "number",
			pageSize : "number",
			pageNumber : "number"
		}, {
			loading : "boolean",
			showPageList : "boolean",
			showRefresh : "boolean"
		} ]), {
			pageList : (t.attr("pageList") ? eval(t.attr("pageList")) : undefined)
		});
	};
	$.fn.pagination.defaults = {
		total : 1,
		pageSize : 10,
		pageNumber : 1,
		pageList : [ 10, 20, 30, 50 ],
		loading : false,
		buttons : null,
		showPageList : true,
		showRefresh : true,
		onSelectPage : function(_21, _22) {
		},
		onBeforeRefresh : function(_23, _24) {
		},
		onRefresh : function(_25, _26) {
		},
		onChangePageSize : function(_27) {
		},
		beforePageText : "Page",
		afterPageText : "of {pages}",
		displayMsg : "Displaying {from} to {to} of {total} items",
		nav : {
			first : {
				iconCls : "pagination-first",
				handler : function() {
					var _28 = $(this).pagination("options");
					if (_28.pageNumber > 1) {
						$(this).pagination("select", 1);
					}
				}
			},
			prev : {
				iconCls : "pagination-prev",
				handler : function() {
					var _29 = $(this).pagination("options");
					if (_29.pageNumber > 1) {
						$(this).pagination("select", _29.pageNumber - 1);
					}
				}
			},
			next : {
				iconCls : "pagination-next",
				handler : function() {
					var _2a = $(this).pagination("options");
					var _2b = Math.ceil(_2a.total / _2a.pageSize);
					if (_2a.pageNumber < _2b) {
						$(this).pagination("select", _2a.pageNumber + 1);
					}
				}
			},
			last : {
				iconCls : "pagination-last",
				handler : function() {
					var _2c = $(this).pagination("options");
					var _2d = Math.ceil(_2c.total / _2c.pageSize);
					if (_2c.pageNumber < _2d) {
						$(this).pagination("select", _2d);
					}
				}
			},
			refresh : {
				iconCls : "pagination-refresh",
				handler : function() {
					var _2e = $(this).pagination("options");
					if (_2e.onBeforeRefresh.call(this, _2e.pageNumber, _2e.pageSize) != false) {
						$(this).pagination("select", _2e.pageNumber);
						_2e.onRefresh.call(this, _2e.pageNumber, _2e.pageSize);
					}
				}
			}
		}
	};
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		$(_2).addClass("validatebox-text");
	}
	;
	function _3(_4) {
		var _5 = $.data(_4, "validatebox");
		_5.validating = false;
		var _6 = _5.tip;
		if (_6) {
			_6.remove();
		}
		$(_4).unbind();
		$(_4).remove();
	}
	;
	function init(target) {
		var $t = $(target);
		var state = $.data(target, "validatebox");
		if( state.options.required ){
			$t.addClass("validatebox-required");
		}else{
			$t.removeClass("validatebox-required");
		}
		$t.unbind(".validatebox").bind("focus.validatebox", function() {
			state.validating = true;
			state.value = undefined;
			(function() {
				if (state.validating) {
					if (state.value != $t.val()) {
						state.value = $t.val();
						if (state.timer) {
							clearTimeout(state.timer);
						}
						state.timer = setTimeout(function() {
							$(target).validatebox("validate");
						}, state.options.delay);
					} else {
						_10(target);
					}
					setTimeout(arguments.callee, 200);
				}
			})();
		}).bind("blur.validatebox", function() {
			if (state.timer) {
				clearTimeout(state.timer);
				state.timer = undefined;
			}
			state.validating = false;
			_b(target);
		}).bind("mouseenter.validatebox", function() {
			if ($t.hasClass("validatebox-invalid")) {
				_c(target);
			}
		}).bind("mouseleave.validatebox", function() {
			if (!state.validating) {
				_b(target);
			}
		});
	}
	;
	function _c(_d) {
		var _e = $.data(_d, "validatebox").message;
		var _f = $.data(_d, "validatebox").tip;
		if (!_f) {
			_f = $(
					"<div class=\"validatebox-tip\">" + "<span class=\"validatebox-tip-content\">" + "</span>" + "<span class=\"validatebox-tip-pointer\">"
							+ "</span>" + "</div>").appendTo("body");
			$.data(_d, "validatebox").tip = _f;
		}
		_f.find(".validatebox-tip-content").html(_e);
		_10(_d);
	}
	;
	function _10(_11) {
		var _12 = $.data(_11, "validatebox");
		if (!_12) {
			return;
		}
		var tip = _12.tip;
		if (tip) {
			var box = $(_11);
			var _13 = tip.find(".validatebox-tip-pointer");
			var _14 = tip.find(".validatebox-tip-content");
			tip.show();
			tip.css("top", box.offset().top - (_14._outerHeight() - box._outerHeight()) / 2);
			if (_12.options.tipPosition == "left") {
				tip.css("left", box.offset().left - tip._outerWidth());
				tip.addClass("validatebox-tip-left");
			} else {
				tip.css("left", box.offset().left + box._outerWidth());
				tip.removeClass("validatebox-tip-left");
			}
			_13.css("top", (_14._outerHeight() - _13._outerHeight()) / 2);
		}
	}
	;
	function _b(_15) {
		var tip = $.data(_15, "validatebox").tip;
		if (tip) {
			tip.remove();
			$.data(_15, "validatebox").tip = null;
		}
	}
	;
	
	//取得输入框所属组件
	function getOwner( t ){
		if( t.hasClass("selectx-text") || t.hasClass("combo-text") ){
			return t.parent().prev();
		}
		return t;
	};
	
	function _16(_17) {
		var _state = $.data(_17, "validatebox");
		if( !_state ){//没有初始化验证
			return true;
		}
		var _19 = _state.options;
		var tip = _state.tip;
		var box = $(_17);
		if( box.is(":hidden") || box.parents("div:hidden").exist() ){
			return true;
		}
		var _1a = box.val();
		var owner= getOwner($(_17));
		function _1b(msg) {
			_state.message = msg;
		}
		;
		function _1c(rule) {
			var _1e = /([a-zA-Z_]+)(.*)/.exec(rule);
			var _1f = _19.rules[_1e[1]];
			if ((_1f && _1a) || rule.contains("custom[") ) {
				var _20 = eval(_1e[2]);
				var invalid = !_1f["validator"].call(owner, _1a, _20, _17);
				if ( invalid ) {
					box.addClass("validatebox-invalid");
					var _21 = _1f["message"];
					if (_20) {
						for ( var i = 0; i < _20.length; i++) {
							_21 = _21.replace(new RegExp("\\{" + i + "\\}", "g"), _20[i]);
						}
					}
					_1b(_19.invalidMessage || _21);
					if (_state.validating) {
						_c(_17);
					}
					return false;
				}
			}
			return true;
		}
		;
		if (_19.required) {
			if (_1a == "") {
				box.addClass("validatebox-invalid");
				_1b(_19.missingMessage);
				if (_state.validating) {
					_c(_17);
				}
				return false;
			}
		}
		if (_19.validType) {
			var type = _19.validType;
			if (typeof _19.validType == "string") {
				var types = type.split("&&");
				for ( var i = 0; i < types.length; i++) {
					if (!_1c(types[i].trim())) {
						return false;
					}
				}
			} else {
				for ( var i = 0; i < _19.validType.length; i++) {
					if (!_1c(_19.validType[i])) {
						return false;
					}
				}
			}
		}
		box.removeClass("validatebox-invalid");
		_b(_17);
		return true;
	}
	;
	$.fn.validatebox = function(_22, _23) {
		if (typeof _22 == "string") {
			return $.fn.validatebox.methods[_22](this, _23);
		}
		_22 = _22 || {};
		return this.each(function() {
			var _24 = $.data(this, "validatebox");
			if (_24) {
				$.extend(_24.options, _22);
			} else {
				_1(this);
				$.data(this, "validatebox", {
					options : $.extend({}, $.fn.validatebox.defaults, $.fn.validatebox.parseOptions(this), _22)
				});
			}
			init(this);
		});
	};
	$.fn.validatebox.methods = {
		destroy : function(jq) {
			return jq.each(function() {
				_3(this);
			});
		},
		validate : function(jq) {
			return jq.each(function() {
				_16(this);
			});
		},
		isValid : function(jq) {
			return _16(jq[0]);
		}
	};
	$.fn.validatebox.parseOptions = function(_25) {
		var t = $(_25);
		return $.extend({}, $.parser.parseOptions(_25, [ "validType", "missingMessage", "invalidMessage", "tipPosition", {
			delay : "number"
		} ]), {
			required : (t.attr("required") ? true : undefined)
		});
	};
	$.fn.validatebox.defaults = {
		required : false,
		validType : null,
		delay : 500,
		missingMessage : "This field is required.",
		invalidMessage : null,
		tipPosition : "right",
		rules : {
			email : {
				validator : function(_26) {
					return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
							.test(_26);
				},
				message : "Please enter a valid email address."
			},
			url : {
				validator : function(_27) {
					return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
							.test(_27);
				},
				message : "Please enter a valid URL."
			},
			length : {
				validator : function(_28, _29) {
					var len = $.trim(_28).length;
					return len >= _29[0] && len <= _29[1];
				},
				message : "Please enter a value between {0} and {1}."
			},
			remote : {
				validator : function(_2a, _2b) {
					var _2c = {};
					_2c[_2b[1]] = _2a;
					var _2d = $.ajax({
						url : _2b[0],
						dataType : "json",
						data : _2c,
						async : false,
						cache : false,
						type : "post"
					}).responseText;
					return _2d == "true";
				},
				message : "Please fix this field."
			}
		}
	};
})(jQuery);

/**
 * form - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	
	/**
	 * submit the form
	 */
	function iframeSubmit(target, options){
		options = options || {};
		
		var param = {};
		
		if (options.onSubmit){
			if (options.onSubmit.call(target, param) == false) {
				return;
			}
		}
		
		if (options.onBeforeSubmit){
			if (options.onBeforeSubmit.call(target, param) == false) {
				return;
			}
		}
		var $t = $(target);
		//校验表单提交前后是否有变更
		if( $t.attr("changeCheck") == "true"){
			if( $t.data("DATA_OLD") == $t.serialize() ){
				$.messager.alert("提示","表单数据没有修改.","info");
				return;
			}
		}
		
		var prid = window.Page ? Page.getPrid(target) : "";
		if( prid ){//提交表单前设置PRID
			param["PRID"] = prid;
		}
		var model = th.getModel($t);
		if( model ){
			param["MODEL"] = model.json();
		}
		
		var form = $(target);
		if (options.url){
			form.attr('action', options.url);
		}
		var frameId = 'easyui_frame_' + (new Date().getTime());
		var frame = $('<iframe id='+frameId+' name='+frameId+'></iframe>')
				.attr('src', window.ActiveXObject ? 'javascript:false' : 'about:blank')
				.css({
					position:'absolute',
					top:-1000,
					left:-1000
				});
		var t = form.attr('target'), a = form.attr('action');
		form.attr('target', frameId);
		
		var paramFields = $();
		try {
			frame.appendTo('body');
			frame.bind('load', cb);
			for(var n in param){
				var f = $('<input type="hidden" name="' + n + '">').val(param[n]).appendTo(form);
				paramFields = paramFields.add(f);
			}
			if( !$(target).attr("submited") ){
				$(target).attr("submited", true);
				form[0].submit();
			}else{
				alert("表单正在提交中，请勿重复提交！ ");
			}
		} finally {
			form.attr('action', a);
			t ? form.attr('target', t) : form.removeAttr('target');
			paramFields.remove();
		}
		
		var checkCount = 10;
		function cb(){
			frame.unbind();
			var body = $('#'+frameId).contents().find('body');
			var data = body.html();
			if (data == ''){
				if (--checkCount){
					setTimeout(cb, 100);
					return;
				}
				return;
			}
			var ta = body.find('>textarea');
			if (ta.length){
				data = ta.val();
			} else {
				var pre = body.find('>pre');
				if (pre.length){
					data = pre.html();
				}
			}
			
			if( data.indexOf('{"success":false') >= 0 ){
				options.onError.call(target, data);
			}else {
				options.success.call(target, data);
			}
			$(target).attr("submited",null);//防重复提交
			setTimeout(function(){
				frame.unbind();
				frame.remove();
			}, 100);
		}
	};
	
	//ajax同步提交表单, options.success options.error
	function ajaxSubmit(target, param){
		var options = $.extend({}, $.data(target, 'form').options, param);
		if (options.onSubmit.call(target) == false) {
			return;
		}
		var url = $(target).attr('action');
		var paramFields = $();
		var model = th.getModel(target);
		if( model && false){//暂时不支持模型
			var field = $('<input type="hidden" name="MODEL">').appendTo(target);
			field.val(model.json());
			paramFields = paramFields.add(field);
		}
		function alertError(){
			$.messager.alert("错误", "表单提交失败，请稍后重试...", "error");
		}
		options.error = options.error || alertError;
		try{
			var data = $(target).serialize();
			var _success = options.success;
			options = $.extend(options, {"url":url,"cache":false,"async":false,"data":data,"type":"POST",success:function(text){
				if( (text || "").contains("!!exception") ){
					alertError();
				}else{
					_success(text);
				}
			}});
			var text = $.ajax(options).responseText;
			return text;
		}finally{
			paramFields.remove();
		}
	};
	
	/**
	 * load form data
	 * if data is a URL string type load from remote site, 
	 * otherwise load from local data object. 
	 */
	function load(target, data){
		if (!$.data(target, 'form')){
			$.data(target, 'form', {
				options: $.extend({}, $.fn.form.defaults)
			});
		}
		var opts = $.data(target, 'form').options;
		
		if (typeof data == 'string'){
			var param = {};
			if (opts.onBeforeLoad.call(target, param) == false) return;
			
			$.ajax({
				url: data,
				data: param,
				dataType: 'json',
				success: function(data){
					_load(data);
				},
				error: function(){
					opts.onLoadError.apply(target, arguments);
				}
			});
		} else {
			_load(data);
		}
		
		function _load(data){
			var form = $(target);
			for(var name in data){
				var val = data[name];
				var rr = _checkField(name, val);
				if (!rr.length){
					var f = form.find('input[numberboxName="'+name+'"]');
					if (f.length){
						f.numberbox('setValue', val);	// set numberbox value
					} else {
						$('input[name="'+name+'"]', form).val(val);
						$('textarea[name="'+name+'"]', form).val(val);
						$('select[name="'+name+'"]', form).val(val);
					}
				}
				_loadCombo(name, val);
			}
			opts.onLoadSuccess.call(target, data);
			validate(target);
		}
		
		/**
		 * check the checkbox and radio fields
		 */
		function _checkField(name, val){
			var form = $(target);
			var rr = $('input[name="'+name+'"][type=radio], input[name="'+name+'"][type=checkbox]', form);
			$.fn.prop ? rr.prop('checked',false) : rr.attr('checked',false);
			rr.each(function(){
				var f = $(this);
				if (f.val() == String(val)){
					$.fn.prop ? f.prop('checked',true) : f.attr('checked',true);
				}
			});
			return rr;
		}
		
		function _loadCombo(name, val){
			var form = $(target);
			var cc = ['combobox','combotree','combogrid','datetimebox','datebox','combo'];
			var c = form.find('[comboName="' + name + '"]');
			if (c.length){
				for(var i=0; i<cc.length; i++){
					var type = cc[i];
					if (c.hasClass(type+'-f')){
						if (c[type]('options').multiple){
							c[type]('setValues', val);
						} else {
							c[type]('setValue', val);
						}
						return;
					}
				}
			}
		}
	}
	
	/**
	 * clear the form fields
	 */
	function clear(target){
		$('input,select,textarea', target).each(function(){
			var t = this.type, tag = this.tagName.toLowerCase();
			if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea'){
				this.value = '';
			} else if (t == 'file'){
				var file = $(this);
				file.after(file.clone().val(''));
				file.remove();
			} else if (t == 'checkbox' || t == 'radio'){
				this.checked = false;
			} else if (tag == 'select'){
				this.selectedIndex = -1;
			}
			
		});
		if ($.fn.combo) $('.combo-f', target).combo('clear');
		if ($.fn.combobox) $('.combobox-f', target).combobox('clear');
		if ($.fn.combotree) $('.combotree-f', target).combotree('clear');
		if ($.fn.combogrid) $('.combogrid-f', target).combogrid('clear');
		validate(target);
	}
	
	function reset(target){
		target.reset();
		var t = $(target);
		if ($.fn.combo){t.find('.combo-f').combo('reset');}
		if ($.fn.combobox){t.find('.combobox-f').combobox('reset');}
		if ($.fn.combotree){t.find('.combotree-f').combotree('reset');}
		if ($.fn.combogrid){t.find('.combogrid-f').combogrid('reset');}
		if ($.fn.spinner){t.find('.spinner-f').spinner('reset');}
		if ($.fn.timespinner){t.find('.timespinner-f').timespinner('reset');}
		if ($.fn.numberbox){t.find('.numberbox-f').numberbox('reset');}
		if ($.fn.numberspinner){t.find('.numberspinner-f').numberspinner('reset');}
		validate(target);
	}
	
	/**
	 * set the form to make it can submit with ajax.
	 */
	function setForm(target){
		var options = $.data(target, 'form').options;
		var form = $(target);
		form.unbind('.form').bind('submit.form', function(){
			th.delay(function(){
				iframeSubmit(target, options);
			}, 200);
			return false;
		});
	}
	
	function validate(target){
		if ($.fn.validatebox){
			var t = $(target);
			t.find('.validatebox-text:not(:disabled)').validatebox('validate');
			var invalidbox = t.find('.validatebox-invalid');
			invalidbox.filter(':not(:disabled):first').focus();
			return invalidbox.length == 0;
		}
		return true;
	}
	
	$.fn.form = function(options, param){
		if (typeof options == 'string'){
			return $.fn.form.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			if (!$.data(this, 'form')){
				$.data(this, 'form', {
					options: $.extend({}, $.fn.form.defaults, $.parser.parseOptions(this), options)
				});
			}
			var service = $(this).attr("service");
			if( service ){//默认支持 service 提交表单
				var url = ctx + "/easyui/form?service=" + service;
				$(this).attr("action", url);
			}
			setForm(this);
		});
	};
	
	$.fn.form.methods = {
		submit: function(jq, options){
			return jq.each(function(){
				iframeSubmit(this, $.extend({}, $.fn.form.defaults, options||{}));
			});
		},
		ajaxSubmit: function(jq, options){
			return ajaxSubmit(jq[0], options);
		},
		load: function(jq, data){
			return jq.each(function(){
				load(this, data);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				reset(this);
			});
		},
		validate: function(jq){
			return validate(jq[0]);
		}
	};
	
	$.fn.form.defaults = {
		url: null,
		onSubmit: function(param){return $(this).form('validate');},
		success: function(data){},
		onBeforeLoad: function(param){},
		onLoadSuccess: function(data){},
		onLoadError: function(){},
		errorMessage:"表单提交失败!",
		onError:function(data){
			var result = $.eval(data);
			$.messager.alert("提示", result.msg, "error");
		}
	};
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _resize(target, offset) {
		var opts = $.data(target, "combo").options;
		var $combo = $.data(target, "combo").combo;
		var $panel = $.data(target, "combo").panel;
		opts.width = offset || opts.width;
		$combo.appendTo("body");
		var $text = $combo.find("input.combo-text");
		var $arrow = $combo.find(".combo-arrow");
		var width = opts.hasDownArrow ? $arrow._outerWidth() : 0;
		$combo._outerWidth(opts.width)._outerHeight(opts.height);
		$text._outerWidth($combo.width() - width);
		$text.css({
			height : $combo.height() + "px",
			lineHeight : $combo.height() + "px"
		});
		$arrow._outerHeight($combo.height());
		$combo.insertAfter(target);
	}
	;
	function _a(_b) {
		var _c = $.data(_b, "combo").options;
		var _d = $.data(_b, "combo").combo;
		if (_c.hasDownArrow) {
			_d.find(".combo-arrow").show();
		} else {
			_d.find(".combo-arrow").hide();
		}
	}
	;
	function _init(target, opts) {
		var textName = $(target).attr("textName") || "";
		$(target).addClass("combo-f").hide();
		var $combo = $("<span class=\"combo\" style=\"" + (opts.comboStyle || "") + "\"></span>").insertAfter(target);
		var $text = $("<input name='" + textName + "' type=\"text\" class=\"combo-text\" style='cursor:default;'>").appendTo($combo);
		$text.attr("title", opts.title || "");
		$("<span><span class=\"combo-arrow\"></span></span>").appendTo($combo);
		$("<input type=\"hidden\" class=\"combo-value\">").appendTo($combo);
		var iframeHtml = "<iframe name='kill_activex' frameborder='0' style='position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;scrolling:no;'></iframe>";
		var clearHtml = "<div class='combo-clear' style='right:20px;top:0px;position:absolute;padding:2px;cursor:pointer;color:blue;display:none;'>清空</div>\n";
		var $panel = $("<div class=\"combo-panel\">" + iframeHtml + clearHtml +  "</div>").appendTo("body");
		$panel.panel({
			doSize : false,
			closed : true,
			cls : "combo-p",
			style : {
				position : "absolute",
				zIndex : 10
			},
			onOpen : function() {
				$(this).panel("resize");
			}
		});
		var name = $(target).attr("name");
		if (name) {
			$combo.find("input.combo-value").attr("name", name);
			$(target).removeAttr("name").attr("comboName", name);
		}
		if( opts.hasClear ){
			$(".combo-clear", $panel).show().click(function(){
				_clear(target);
				$panel.panel("close");
			});
		}
		$text.attr("autocomplete", "off");
		return {combo : $combo,panel : $panel};
	}
	;
	function _14(_15) {
		var _16 = $.data(_15, "combo").combo.find("input.combo-text");
		_16.validatebox("destroy");
		$.data(_15, "combo").panel.panel("destroy");
		$.data(_15, "combo").combo.remove();
		$(_15).remove();
	}
	;
	
	function _17(_18) {
		var _19 = $.data(_18, "combo");
		var _1a = _19.options;
		var _1b = $.data(_18, "combo").combo;
		var _1c = $.data(_18, "combo").panel;
		var $text = _1b.find(".combo-text");
		var _1e = _1b.find(".combo-arrow");
		$(document).unbind(".combo").bind("mousedown.combo", function(e) {
			var p = $(e.target).closest("span.combo,div.combo-panel");
			if (p.length) {
				return;
			}
			var _1f = $("body>div.combo-p>div.combo-panel");
			_1f.panel("close");
		});
		_1b.unbind(".combo");
		_1c.unbind(".combo");
		$text.unbind(".combo");
		_1e.unbind(".combo");
		if (!_1a.disabled) {
			$text.bind("mousedown.combo", function(e) {
				$("div.combo-panel").not(_1c).panel("close");
				e.stopPropagation();
			}).bind("keydown.combo", function(e) {
				switch (e.keyCode) {
				case 38:
					_1a.keyHandler.up.call(_18);
					break;
				case 40:
					_1a.keyHandler.down.call(_18);
					break;
				case 13:
					e.preventDefault();
					_1a.keyHandler.enter.call(_18);
					return true;
				case 9:
				case 27:
					_28(_18);
					break;
				default:
					if (_1a.editable) {
						if (_19.timer) {
							clearTimeout(_19.timer);
						}
						_19.timer = setTimeout(function() {
							var q = $text.val();
							if (_19.previousValue != q) {
								_19.previousValue = q;
								$(_18).combo("showPanel");
								_1a.keyHandler.query.call(_18, $text.val());
								_2c(_18, true);
							}
						}, _1a.delay);
					}
				}
			}).bind("focus.combo",function(){
				$("div.combo-panel").panel("close");
				$(_18).combo("showPanel");
				$text.select();
			});
			_1e.bind("click.combo", function() {
				if (_1c.is(":visible")) {
					_28(_18);
				} else {
					$("div.combo-panel").panel("close");
					$(_18).combo("showPanel");
				}
				$text.focus();
				$text.select();
			}).bind("mouseenter.combo", function() {
				$(this).addClass("combo-arrow-hover");
			}).bind("mouseleave.combo", function() {
				$(this).removeClass("combo-arrow-hover");
			}).bind("mousedown.combo", function() {
			});
		}
	}
	;
	function _showPanel(target) {
		var opts = $.data(target, "combo").options;
		var $combo = $.data(target, "combo").combo;
		var $panel = $.data(target, "combo").panel;
		if ($.fn.window) {
			$panel.panel("panel").css("z-index", $.fn.window.defaults.zIndex++);
		}
		$panel.panel("move", {
			left : $combo.offset().left,
			top : _top()
		});
		if ($panel.panel("options").closed) {
			$panel.panel("resize", {
				width : (opts.panelWidth ? opts.panelWidth : $combo.outerWidth()),
				height : opts.panelHeight
			});
			$panel.panel("open");
			opts.onShowPanel.call(target);
		}
		(function() {
			if ($panel.is(":visible")) {
				$panel.panel("move", {
					left : _left(),
					top : _top()
				});
				setTimeout(arguments.callee, 200);
			}
		})();
		function _left() {
			var _27 = $combo.offset().left;
			if (_27 + $panel._outerWidth() > $(window)._outerWidth() + $(document).scrollLeft()) {
				_27 = $(window)._outerWidth() + $(document).scrollLeft() - $panel._outerWidth();
			}
			if (_27 < 0) {
				_27 = 0;
			}
			return _27;
		}
		;
		function _top() {
			var top = $combo.offset().top + $combo._outerHeight();
			if (top + $panel._outerHeight() > $(window)._outerHeight() + $(document).scrollTop()) {
				top = $combo.offset().top - $panel._outerHeight();
			}
			if (top < $(document).scrollTop()) {
				top = $combo.offset().top + $combo._outerHeight();
			}
			return top;
		}
		;
	}
	;
	function _28(_29) {
		var _2a = $.data(_29, "combo").options;
		var _2b = $.data(_29, "combo").panel;
		_2b.panel("close");
		_2a.onHidePanel.call(_29);
	}
	;
	function _2c(_2d, _2e) {
		var _2f = $.data(_2d, "combo").options;
		var _30 = $.data(_2d, "combo").combo.find("input.combo-text");
		_30.validatebox(_2f);
		if (_2e) {
			_30.validatebox("validate");
		}
	}
	;
	
	function readonly(target, read){
		var state = $.data(target, "combo");
		var opts = state.options;
		var $combo = state.combo;
		var $arrow = $combo.find(".combo-arrow");
		var $text = $combo.find(".combo-text");
		if( read ){
			$text.attr("disabled", true);
			$text.width($text.width() + 20);
			$arrow.hide();
		}else{
			$arrow.show();
			$text.removeAttr("disabled");
			$text.width($text.width() - 20);
		}
	}
	
	function _31(_32, _33) {
		var _34 = $.data(_32, "combo").options;
		var _35 = $.data(_32, "combo").combo;
		if (_33) {
			_34.disabled = true;
			$(_32).attr("disabled", true);
			_35.find(".combo-value").attr("disabled", true);
			_35.find(".combo-text").attr("disabled", true);
		} else {
			_34.disabled = false;
			$(_32).removeAttr("disabled");
			_35.find(".combo-value").removeAttr("disabled");
			_35.find(".combo-text").removeAttr("disabled");
		}
	}
	;
	function _clear(_37) {
		var _38 = $.data(_37, "combo").options;
		var _39 = $.data(_37, "combo").combo;
		if (_38.multiple) {
			_39.find("input.combo-value").remove();
		} else {
			_39.find("input.combo-value").val("");
		}
		_39.find("input.combo-text").val("");
	}
	;
	function _3a(_3b) {
		var _3c = $.data(_3b, "combo").combo;
		return _3c.find("input.combo-text").val();
	}
	;
	function _3d(_3e, _3f) {
		var _40 = $.data(_3e, "combo").combo;
		_40.find("input.combo-text").val(_3f);
		_40.find("input.combo-text").attr("title",_3f);
		_2c(_3e, true);
		$.data(_3e, "combo").previousValue = _3f;
	}
	;
	function _41(_42) {
		var _43 = [];
		var _44 = $.data(_42, "combo").combo;
		_44.find("input.combo-value").each(function() {
			_43.push($(this).val());
		});
		return _43;
	}
	;
	function _45(_46, _47) {
		var _48 = $.data(_46, "combo").options;
		var _49 = _41(_46);
		var _4a = $.data(_46, "combo").combo;
		_4a.find("input.combo-value").remove();
		var _4b = $(_46).attr("comboName");
		for ( var i = 0; i < _47.length; i++) {
			var _4c = $("<input type=\"hidden\" class=\"combo-value\">").appendTo(_4a);
			if (_4b) {
				_4c.attr("name", _4b);
			}
			_4c.val(_47[i]);
		}
		var tmp = [];
		for ( var i = 0; i < _49.length; i++) {
			tmp[i] = _49[i];
		}
		var aa = [];
		for ( var i = 0; i < _47.length; i++) {
			for ( var j = 0; j < tmp.length; j++) {
				if (_47[i] == tmp[j]) {
					aa.push(_47[i]);
					tmp.splice(j, 1);
					break;
				}
			}
		}
		if (aa.length != _47.length || _47.length != _49.length) {
			if (_48.multiple) {
				_48.onChange.call(_46, _47, _49);
			} else {
				_48.onChange.call(_46, _47[0], _49[0]);
			}
		}
	}
	;
	function _4d(_4e) {
		var _4f = _41(_4e);
		return _4f[0];
	}
	;
	function _50(_51, _52) {
		_45(_51, [ _52 ]);
	}
	;
	function _53(_54) {
		var _55 = $.data(_54, "combo").options;
		var fn = _55.onChange;
		_55.onChange = function() {
		};
		if (_55.multiple) {
			if (_55.value) {
				if (typeof _55.value == "object") {
					_45(_54, _55.value);
				} else {
					_50(_54, _55.value);
				}
			} else {
				_45(_54, []);
			}
			_55.originalValue = _41(_54);
		} else {
			_50(_54, _55.value);
			_55.originalValue = _55.value;
		}
		_55.onChange = fn;
	}
	;
	$.fn.combo = function(options, param) {
		if (typeof options == "string") {
			return $.fn.combo.methods[options](this, param);
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "combo");
			if (state) {
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.combo.defaults, $.fn.combo.parseOptions(this), options);
				var r = _init(this, opts);
				state = $.data(this, "combo", {
					options : opts,
					combo : r.combo,
					panel : r.panel,
					previousValue : null
				});
				$(this).removeAttr("disabled");
			}
			$("input.combo-text", state.combo).attr("readonly", !state.options.editable);
			_a(this);
			_31(this, state.options.disabled);
			_resize(this);
			_17(this);
			_2c(this);
			_53(this);
		});
	};
	$.fn.combo.methods = {
		options : function(jq) {
			return $.data(jq[0], "combo").options;
		},
		panel : function(jq) {
			return $.data(jq[0], "combo").panel;
		},
		textbox : function(jq) {
			return $.data(jq[0], "combo").combo.find("input.combo-text");
		},
		destroy : function(jq) {
			return jq.each(function() {
				_14(this);
			});
		},
		resize : function(jq, _59) {
			return jq.each(function() {
				_resize(this, _59);
			});
		},
		showPanel : function(jq) {
			return jq.each(function() {
				_showPanel(this);
			});
		},
		hidePanel : function(jq) {
			return jq.each(function() {
				_28(this);
			});
		},
		disable : function(jq) {
			return jq.each(function() {
				_31(this, true);
				_17(this);
			});
		},
		enable : function(jq) {
			return jq.each(function() {
				_31(this, false);
				_17(this);
			});
		},readonly : function(jq, param) {
			return jq.each(function() {
				readonly(this, param);
			});
		},
		validate : function(jq) {
			return jq.each(function() {
				_2c(this, true);
			});
		},
		isValid : function(jq) {
			var _5a = $.data(jq[0], "combo").combo.find("input.combo-text");
			return _5a.validatebox("isValid");
		},
		clear : function(jq) {
			return jq.each(function() {
				_clear(this);
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _5b = $.data(this, "combo").options;
				if (_5b.multiple) {
					$(this).combo("setValues", _5b.originalValue);
				} else {
					$(this).combo("setValue", _5b.originalValue);
				}
			});
		},
		getText : function(jq) {
			return _3a(jq[0]);
		},
		setText : function(jq, _5c) {
			return jq.each(function() {
				_3d(this, _5c);
			});
		},
		getValues : function(jq) {
			return _41(jq[0]);
		},
		setValues : function(jq, _5d) {
			return jq.each(function() {
				_45(this, _5d);
			});
		},
		getValue : function(jq) {
			return _4d(jq[0]);
		},
		setValue : function(jq, _5e) {
			return jq.each(function() {
				_50(this, _5e);
			});
		}
	};
	$.fn.combo.parseOptions = function(_5f) {
		var t = $(_5f);
		return $.extend({}, $.fn.validatebox.parseOptions(_5f), $.parser.parseOptions(_5f, [ "width", "height", "separator","comboStyle", {
			panelWidth : "number",
			editable : "boolean",
			hasDownArrow : "boolean",
			delay : "number"
		} ]), {
			panelHeight : (t.attr("panelHeight") == "auto" ? "auto" : parseInt(t.attr("panelHeight")) || undefined),
			multiple : (t.attr("multiple") ? true : undefined),
			disabled : (t.attr("disabled") ? true : undefined),
			value : (t.val() || undefined),
			tooltip : t.attr("tooltip"),
			title : t.attr("title")
		});
	};
	$.fn.combo.defaults = $.extend({}, $.fn.validatebox.defaults, {
		width : "auto",
		height : 22,
		panelWidth : null,
		panelHeight : 200,
		multiple : false,
		separator : ",",
		editable : false,
		disabled : false,
		hasDownArrow : true,
		hasClear : false,
		value : "",
		delay : 200,
		keyHandler : {
			up : function() {
			},
			down : function() {
			},
			enter : function() {
			},
			query : function(q) {
			}
		},
		onShowPanel : function() {
		},
		onHidePanel : function() {
		},
		onChange : function(_60, _61) {
		}
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(el, _2, _3, _4) {
		var _5 = $(el).window("window");
		if (!_5) {
			return;
		}
		switch (_2) {
		case null:
			_5.show();
			break;
		case "slide":
			_5.slideDown(_3);
			break;
		case "fade":
			_5.fadeIn(_3);
			break;
		case "show":
			_5.show(_3);
			break;
		}
		var _6 = null;
		if (_4 > 0) {
			_6 = setTimeout(function() {
				_7(el, _2, _3);
			}, _4);
		}
		_5.hover(function() {
			if (_6) {
				clearTimeout(_6);
			}
		}, function() {
			if (_4 > 0) {
				_6 = setTimeout(function() {
					_7(el, _2, _3);
				}, _4);
			}
		});
	}
	;
	function _7(el, _8, _9) {
		if (el.locked == true) {
			return;
		}
		el.locked = true;
		var _a = $(el).window("window");
		if (!_a) {
			return;
		}
		switch (_8) {
		case null:
			_a.hide();
			break;
		case "slide":
			_a.slideUp(_9);
			break;
		case "fade":
			_a.fadeOut(_9);
			break;
		case "show":
			_a.hide(_9);
			break;
		}
		setTimeout(function() {
			$(el).window("destroy");
		}, _9);
	}
	;
	function _b(_c) {
		var _d = $.extend({}, $.fn.window.defaults, {
			collapsible : false,
			minimizable : false,
			maximizable : false,
			shadow : false,
			draggable : false,
			resizable : false,
			closed : true,
			style : {
				left : "",
				top : "",
				right : 0,
				zIndex : $.fn.window.defaults.zIndex++,
				bottom : -document.body.scrollTop - document.documentElement.scrollTop
			},
			onBeforeOpen : function() {
				_1(this, _d.showType, _d.showSpeed, _d.timeout);
				return false;
			},
			onBeforeClose : function() {
				_7(this, _d.showType, _d.showSpeed);
				return false;
			}
		}, {
			title : "",
			width : 250,
			height : 100,
			showType : "slide",
			showSpeed : 600,
			msg : "",
			timeout : 4000
		}, _c);
		_d.style.zIndex = $.fn.window.defaults.zIndex++;
		var _e = $("<div class=\"messager-body\"></div>").html(_d.msg).appendTo("body");
		_e.window(_d);
		_e.window("window").css(_d.style);
		_e.window("open");
		return _e;
	}
	;
	function _f(_10, _11, _12) {
		var win = $("<div class=\"messager-body\"></div>").appendTo("body");
		win.append(_11);
		if (_12) {
			var tb = $("<div class=\"messager-button\"></div>").appendTo(win);
			for ( var _13 in _12) {
				$("<a></a>").attr("href", "javascript:void(0)").text(_13).css("margin-left", 10).bind("click", eval(_12[_13])).appendTo(tb).linkbutton();
			}
		}
		win.window({
			title : _10,
			noheader : (_10 ? false : true),
			width : 300,
			height : "auto",
			modal : true,
			collapsible : false,
			minimizable : false,
			maximizable : false,
			resizable : false,
			onClose : function() {
				setTimeout(function() {
					win.window("destroy");
				}, 100);
			}
		});
		win.window("window").addClass("messager-window");
		win.children("div.messager-button").children("a:first").focus();
		return win;
	}
	;
	$.messager = {
		show : function(_14) {
			return _b(_14);
		},
		alert : function(_15, msg, _16, fn) {
			var _17 = "<div>" + msg + "</div>";
			switch (_16) {
			case "error":
				_17 = "<div class=\"messager-icon messager-error\"></div>" + _17;
				break;
			case "info":
				_17 = "<div class=\"messager-icon messager-info\"></div>" + _17;
				break;
			case "question":
				_17 = "<div class=\"messager-icon messager-question\"></div>" + _17;
				break;
			case "warning":
				_17 = "<div class=\"messager-icon messager-warning\"></div>" + _17;
				break;
			}
			_17 += "<div style=\"clear:both;\"/>";
			var _18 = {};
			_18[$.messager.defaults.ok] = function() {
				win.window("close");
				if (fn) {
					fn();
					return false;
				}
			};
			var win = _f(_15, _17, _18);
			return win;
		},
		confirm : function(_19, msg, fn) {
			var _1a = "<div class=\"messager-icon messager-question\"></div>" + "<div>" + msg + "</div>" + "<div style=\"clear:both;\"/>";
			var _1b = {};
			_1b[$.messager.defaults.ok] = function() {
				win.window("close");
				if (fn) {
					fn(true);
					return false;
				}
			};
			_1b[$.messager.defaults.cancel] = function() {
				win.window("close");
				if (fn) {
					fn(false);
					return false;
				}
			};
			var win = _f(_19, _1a, _1b);
			return win;
		},
		prompt : function(_1c, msg, fn) {
			var _1d = "<div class=\"messager-icon messager-question\"></div>" + "<div>" + msg + "</div>" + "<br/>" + "<div style=\"clear:both;\"/>"
					+ "<div><input class=\"messager-input\" type=\"text\"/></div>";
			var _1e = {};
			_1e[$.messager.defaults.ok] = function() {
				win.window("close");
				if (fn) {
					fn($(".messager-input", win).val());
					return false;
				}
			};
			_1e[$.messager.defaults.cancel] = function() {
				win.window("close");
				if (fn) {
					fn();
					return false;
				}
			};
			var win = _f(_1c, _1d, _1e);
			win.children("input.messager-input").focus();
			return win;
		},
		progress : function(_1f) {
			var _20 = {
				bar : function() {
					return $("body>div.messager-window").find("div.messager-p-bar");
				},
				close : function() {
					var win = $("body>div.messager-window>div.messager-body:has(div.messager-progress)");
					if (win.length) {
						win.window("close");
					}
				}
			};
			if (typeof _1f == "string") {
				var _21 = _20[_1f];
				return _21();
			}
			var _22 = $.extend({
				title : "",
				msg : "",
				text : undefined,
				interval : 300
			}, _1f || {});
			var _23 = "<div class=\"messager-progress\"><div class=\"messager-p-msg\"></div><div class=\"messager-p-bar\"></div></div>";
			var win = _f(_22.title, _23, null);
			win.find("div.messager-p-msg").html(_22.msg);
			var bar = win.find("div.messager-p-bar");
			bar.progressbar({
				text : _22.text
			});
			win.window({
				closable : false,
				onClose : function() {
					if (this.timer) {
						clearInterval(this.timer);
					}
					$(this).window("destroy");
				}
			});
			if (_22.interval) {
				win[0].timer = setInterval(function() {
					var v = bar.progressbar("getValue");
					v += 10;
					if (v > 100) {
						v = 0;
					}
					bar.progressbar("setValue", v);
				}, _22.interval);
			}
			return win;
		}
	};
	$.messager.defaults = {
		ok : "Ok",
		cancel : "Cancel"
	};
})(jQuery);

/**
 * parser - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */

(function($){
	$.parser = {
		auto: true,
		onComplete: function(context){},
		plugins:["editform","queryform",'draggable','droppable','resizable','pagination',
		         'linkbutton','menu','menubutton','splitbutton','progressbar',
				 'tree','combobox','combotree','combogrid','numberbox','validatebox','searchbox',
				 'numberspinner','timespinner','calendar','datebox','datetimebox','slider',
				 'layout','panel','datagrid','propertygrid','treegrid','tabs','accordion',
				 'window','dialog','datepicker','uploadify','panelx','chooser','selectx','form',"table","cardview","search","number","chart","select","editor"
		],
		parse: function(context){
			Debug.begin("parse context");
			var aa = [];
			for(var i=0; i<$.parser.plugins.length; i++){
				var name = $.parser.plugins[i];
				var r = $('.easyui-' + name + "[parse!='false']", context);
				if (r.length){
					var debug = "	" + r.length + " " +  name;
					Debug.begin(debug);
					if ( r[name] ){
						r.each(function(){
							var $this = $(this), target = this;
							$this[name]();
							var state = $this.data(name);
							var callback = state ? state.options.onParseComplete : $.noop;
							if( callback ){
								setTimeout(function(){
									callback.call($this, target);
								},0);
							}
						});
					} else {
						aa.push({name:name,jq:r});
					}
					Debug.end(debug);
				}
			}
			if (aa.length && window.easyloader){
				var names = [];
				for(var i=0; i<aa.length; i++){
					names.push(aa[i].name);
				}
				easyloader.load(names, function(){
					for(var i=0; i<aa.length; i++){
						var name = aa[i].name;
						var jq = aa[i].jq;
						jq[name]();
					}
					$.parser.onComplete.call($.parser, context);
				});
			} else {
				$.parser.onComplete.call($.parser, context);
			}
			Debug.end("parse context");
			Debug.print();
		},
		
		/**
		 * parse options, including standard 'data-options' attribute.
		 * 
		 * calling examples:
		 * $.parser.parseOptions(target);
		 * $.parser.parseOptions(target, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
		 */
		parseOptions: function(target, properties){
			var t = $(target);
			var options = {};
			
			var s = $.trim(t.attr('data-options'));
			if (s){
				var first = s.substring(0,1);
				var last = s.substring(s.length-1,1);
				if (first != '{') s = '{' + s;
				if (last != '}') s = s + '}';
				options = (new Function('return ' + s))();
			}
				
			if (properties){
				var opts = {};
				for(var i=0; i<properties.length; i++){
					var pp = properties[i];
					if (typeof pp == 'string'){
						if (pp == 'width' || pp == 'height' || pp == 'left' || pp == 'top'){
							opts[pp] = parseInt(target.style[pp]) || undefined;
						} else {
							opts[pp] = t.attr(pp);
						}
					} else {
						for(var name in pp){
							var type = pp[name];
							if (type == 'boolean'){
								opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
							} else if (type == 'number'){
								opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
							}else if (type == 'object'){
								opts[name] = t.attr(name) ? eval("(" + t.attr(name) + ")") : undefined;
							}else if (type == 'array'){
								var v = t.attr(name);
								if( v ){
									if( v.startsWith("[") ){
										opts[name] = $.eval(v);
									}else{
										opts[name] = v.split(/,/g);
									}
								}
							}
						}
					}
				}
				$.extend(options, opts);
			}
			
			if( t.data("data-options") ){//data中定义的配置
				$.extend(options, t.data("data-options"));
			}
			return options;
		}
	};
	$(function(){
		if (!window.easyloader && $.parser.auto){
			$.parser.parse();
		}
	});
	
	/**
	 * extend plugin to set box model width
	 */
	$.fn._outerWidth = function(width){
		if (width == undefined){
			if (this[0] == window){
				return this.width() || document.body.clientWidth;
			}
			return this.outerWidth()||0;
		}
		return this.each(function(){
			if (!$.support.boxModel && $.browser.msie){
				$(this).width(width);
			} else {
				$(this).width(width - ($(this).outerWidth() - $(this).width()));
			}
		});
	};
	
	/**
	 * extend plugin to set box model height
	 */
	$.fn._outerHeight = function(height){
		if (height == undefined){
			if (this[0] == window){
				return this.height() || document.body.clientHeight;
			}
			return this.outerHeight()||0;
		}
		return this.each(function(){
			if (!$.support.boxModel && $.browser.msie){
				$(this).height(height);
			} else {
				$(this).height(height - ($(this).outerHeight() - $(this).height()));
			}
		});
	};
	
	$.fn._scrollLeft = function(left){
		if (left == undefined){
			return this.scrollLeft();
		} else {
			return this.each(function(){$(this).scrollLeft(left)});
		}
	}
	
	$.fn._propAttr = $.fn.prop || $.fn.attr;
	
	/**
	 * set or unset the fit property of parent container, return the width and height of parent container
	 */
	$.fn._fit = function(fit){
		fit = fit == undefined ? true : fit;
		var p = this.parent()[0];
		var t = this[0];
		var fcount = p.fcount || 0;
		if (fit){
			if (!t.fitted){
				t.fitted = true;
				p.fcount = fcount + 1;
				$(p).addClass('panel-noscroll');
				if (p.tagName == 'BODY'){
					$('html').addClass('panel-fit');
				}
			}
		} else {
			if (t.fitted){
				t.fitted = false;
				p.fcount = fcount - 1;
				if (p.fcount == 0){
					$(p).removeClass('panel-noscroll');
					if (p.tagName == 'BODY'){
						$('html').removeClass('panel-fit');
					}
				}
			}
		}
		return {
			width: $(p).width(),
			height: $(p).height()
		}
	}
	
})(jQuery);

/**
 * linkbutton - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	
	function createButton(target) {
		var opts = $.data(target, 'linkbutton').options;
		
		$(target).empty();
		$(target).addClass('l-btn');
		if (opts.id){
			$(target).attr('id', opts.id);
		} else {
//			$.fn.removeProp ? $(target).removeProp('id') : $(target).removeAttr('id'); 
//			$(target).removeAttr('id');
			$(target).attr('id', '');
		}
		if (opts.plain){
			$(target).addClass('l-btn-plain');
		} else {
			$(target).removeClass('l-btn-plain');
		}
		
		if (opts.text){
			$(target).empty().append(
					'<span class="l-btn-left">' +
					'<i class="l-btn-text">' +
					'</i>' +opts.text+
					'</span>'
			);
			if (opts.iconCls){
				$(target).find('.l-btn-text').addClass(opts.iconCls).addClass(opts.iconAlign=='left' ? 'l-btn-icon-left' : 'l-btn-icon-right');
			}
		} else {
			$(target).html('&nbsp;').wrapInner(
					'<span class="l-btn-left">' +
					'<span class="l-btn-text">' +
					'<span class="l-btn-empty"></span>' +
					'</span>' +
					'</span>'
			);
			if (opts.iconCls){
				$(target).find('.l-btn-empty').addClass(opts.iconCls);
			}
		}
		$(target).unbind('.linkbutton').bind('focus.linkbutton',function(){
			if (!opts.disabled){
				$(this).find('span.l-btn-text').addClass('l-btn-focus');
			}
		}).bind('blur.linkbutton',function(){
			$(this).find('span.l-btn-text').removeClass('l-btn-focus');
		});
		
		setDisabled(target, opts.disabled);
	}
	
	function setDisabled(target, disabled){
		var state = $.data(target, 'linkbutton');
		if (disabled){
			state.options.disabled = true;
			var href = $(target).attr('href');
			if (href){
				state.href = href;
				$(target).attr('href', 'javascript:void(0)');
			}
			if (target.onclick){
				state.onclick = target.onclick;
				target.onclick = null;
			}
//			var onclick = $(target).attr('onclick');
//			if (onclick) {
//				state.onclick = onclick;
//				$(target).attr('onclick', '');
//			}
			$(target).addClass('l-btn-disabled');
		} else {
			state.options.disabled = false;
			if (state.href) {
				$(target).attr('href', state.href);
			}
			if (state.onclick) {
				target.onclick = state.onclick;
			}
			$(target).removeClass('l-btn-disabled');
		}
	}
	
	$.fn.linkbutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.linkbutton.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'linkbutton');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'linkbutton', {
					options: $.extend({}, $.fn.linkbutton.defaults, $.fn.linkbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			
			createButton(this);
		});
	};
	
	$.fn.linkbutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'linkbutton').options;
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		}
	};
	
	$.fn.linkbutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, ['id','iconCls','iconAlign',{plain:'boolean'}]), {
			disabled: (t.attr('disabled') ? true : undefined),
			text: $.trim(t.html()),
			iconCls: (t.attr('icon') || t.attr('iconCls'))
		});
	};
	
	$.fn.linkbutton.defaults = {
		id: null,
		disabled: false,
		plain: false,
		text: '',
		iconCls: null,
		iconAlign: 'left'
	};
	
})(jQuery);

/**
 * menu - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	
	/**
	 * initialize the target menu, the function can be invoked only once
	 */
	function init(target){
		$(target).appendTo('body');
		$(target).addClass('menu-top');	// the top menu
		
		$(document).unbind('.menu').bind('mousedown.menu', function(e){
			var allMenu = $('body>div.menu:visible');
			var m = $(e.target).closest('div.menu', allMenu);
			if (m.length){return}
			$('body>div.menu-top:visible').menu('hide');
		});
		
		var menus = splitMenu($(target));
		for(var i=0; i<menus.length; i++){
			createMenu(menus[i]);
		}
		
		function splitMenu(menu){
			var menus = [];
			menu.addClass('menu');
			if (!menu[0].style.width){
				menu[0].autowidth = true;
			}
			menus.push(menu);
			if (!menu.hasClass('menu-content')){
				menu.children('div').each(function(){
					var submenu = $(this).children('div');
					if (submenu.length){
						submenu.insertAfter(target);
						this.submenu = submenu;		// point to the sub menu
						var mm = splitMenu(submenu);
						menus = menus.concat(mm);
					}
				});
			}
			return menus;
		}
		
		function createMenu(menu){
			if (!menu.hasClass('menu-content')){
				menu.children('div').each(function(){
					var item = $(this);
					if (item.hasClass('menu-sep')){
//						item.html('&nbsp;');
					} else {
						var itemOpts = $.extend({}, $.parser.parseOptions(this,['name','iconCls','href']), {
							disabled: (item.attr('disabled') ? true : undefined)
						});
						item.attr('name',itemOpts.name || '').attr('href',itemOpts.href || '');
						
						var text = item.addClass('menu-item').html();
						item.empty().append($('<div class="menu-text"></div>').html(text));
						if (itemOpts.iconCls){
							$('<div class="menu-icon"></div>').addClass(itemOpts.iconCls).appendTo(item);
						}
						if (itemOpts.disabled){
							setDisabled(target, item[0], true);
						}
						if (item[0].submenu){
							$('<div class="menu-rightarrow"></div>').appendTo(item);	// has sub menu
						}
						
						item._outerHeight(22);
						bindMenuItemEvent(target, item);
					}
				});
				$('<div class="menu-line"></div>').prependTo(menu);
			}
			setMenuWidth(target, menu);
			menu.hide();
			
			bindMenuEvent(target, menu);
		}
	}
	
	function setMenuWidth(target, menu){
		var opts = $.data(target, 'menu').options;
		var d = menu.css('display');
		menu.css({
			display: 'block',
			left:-10000
		});
		
		var width = menu._outerWidth();
		var autoWidth = 0;
		menu.find('div.menu-text').each(function(){
			if (autoWidth < $(this)._outerWidth()){
				autoWidth = $(this)._outerWidth();
			}
		});
		autoWidth += 65;
		menu._outerWidth(Math.max(width, autoWidth, opts.minWidth));
		
		menu.css('display', d);
	}
	
	/**
	 * bind menu event
	 */
	function bindMenuEvent(target, menu){
		var state = $.data(target, 'menu');
		menu.unbind('.menu').bind('mouseenter.menu', function(){
			if (state.timer){
				clearTimeout(state.timer);
				state.timer = null;
			}
		}).bind('mouseleave.menu', function(){
			state.timer = setTimeout(function(){
				hideAll(target);
			}, 100);
		});
	}
	
	/**
	 * bind menu item event
	 */
	function bindMenuItemEvent(target, item){
		item.unbind('.menu');
		item.bind('click.menu', function(){
			if ($(this).hasClass('menu-item-disabled')){
				return;
			}
			// only the sub menu clicked can hide all menus
			if (!this.submenu){
				hideAll(target);
				var href = $(this).attr('href');
				if (href){
					location.href = href;
				}
			}
			var item = $(target).menu('getItem', this);
			$.data(target, 'menu').options.onClick.call(target, item);
		}).bind('mouseenter.menu', function(e){
			// hide other menu
			item.siblings().each(function(){
				if (this.submenu){
					hideMenu(this.submenu);
				}
				$(this).removeClass('menu-active');
			});
			// show this menu
			item.addClass('menu-active');
			
			if ($(this).hasClass('menu-item-disabled')){
				item.addClass('menu-active-disabled');
				return;
			}
			
			var submenu = item[0].submenu;
			if (submenu){
				$(target).menu('show', {
					menu: submenu,
					parent: item
				});
			}
		}).bind('mouseleave.menu', function(e){
			item.removeClass('menu-active menu-active-disabled');
			var submenu = item[0].submenu;
			if (submenu){
				if (e.pageX>=parseInt(submenu.css('left'))){
					item.addClass('menu-active');
				} else {
					hideMenu(submenu);
				}
				
			} else {
				item.removeClass('menu-active');
			}
		});
	}
	
	/**
	 * hide top menu and it's all sub menus
	 */
	function hideAll(target){
		var state = $.data(target, 'menu');
		if (state){
			if ($(target).is(':visible')){
				hideMenu($(target));
				state.options.onHide.call(target);
			}
		}
		return false;
	}
	
	/**
	 * show the menu, the 'param' object has one or more properties:
	 * left: the left position to display
	 * top: the top position to display
	 * menu: the menu to display, if not defined, the 'target menu' is used
	 * parent: the parent menu item to align to
	 * alignTo: the element object to align to
	 */
	function showMenu(target, param){
		var left,top;
		var menu = $(param.menu || target);
		if (menu.hasClass('menu-top')){
			var opts = $.data(target, 'menu').options;
			left = opts.left;
			top = opts.top;
			if (param.alignTo){
				var at = $(param.alignTo);
				left = at.offset().left;
				top = at.offset().top + at._outerHeight();
			}
			if (param.left != undefined){left = param.left}
			if (param.top != undefined){top = param.top}
			if (left + menu.outerWidth() > $(window)._outerWidth() + $(document)._scrollLeft()){
				left = $(window)._outerWidth() + $(document).scrollLeft() - menu.outerWidth() - 5;
			}
			if (top + menu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				top -= menu.outerHeight();
			}
		} else {
			var parent = param.parent;	// the parent menu item
			left = parent.offset().left + parent.outerWidth() - 2;
			if (left + menu.outerWidth() + 5 > $(window)._outerWidth() + $(document).scrollLeft()){
				left = parent.offset().left - menu.outerWidth() + 2;
			}
			var top = parent.offset().top - 3;
			if (top + menu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				top = $(window)._outerHeight() + $(document).scrollTop() - menu.outerHeight() - 5;
			}
		}
		menu.css({left:left,top:top});
		menu.show(0, function(){
			if (!menu[0].shadow){
				menu[0].shadow = $('<div class="menu-shadow"></div>').insertAfter(menu);
			}
			menu[0].shadow.css({
				display:'block',
				zIndex:$.fn.menu.defaults.zIndex++,
				left:menu.css('left'),
				top:menu.css('top'),
				width:menu.outerWidth(),
				height:menu.outerHeight()
			});
			menu.css('z-index', $.fn.menu.defaults.zIndex++);
			if (menu.hasClass('menu-top')){
				$.data(menu[0], 'menu').options.onShow.call(menu[0]);
			}
		});
	}
	
	function hideMenu(menu){
		if (!menu) return;
		
		hideit(menu);
		menu.find('div.menu-item').each(function(){
			if (this.submenu){
				hideMenu(this.submenu);
			}
			$(this).removeClass('menu-active');
		});
		
		function hideit(m){
			m.stop(true,true);
			if (m[0].shadow){
				m[0].shadow.hide();
			}
			m.hide();
		}
	}
	
	function findItem(target, text){
		var result = null;
		var tmp = $('<div></div>');
		function find(menu){
			menu.children('div.menu-item').each(function(){
				var item = $(target).menu('getItem', this);
				var s = tmp.empty().html(item.text).text();
				if (text == $.trim(s)) {
					result = item;
				} else if (this.submenu && !result){
					find(this.submenu);
				}
			});
		}
		find($(target));
		tmp.remove();
		return result;
	}
	
	function setDisabled(target, itemEl, disabled){
		var t = $(itemEl);
		
		if (disabled){
			t.addClass('menu-item-disabled');
			if (itemEl.onclick){
				itemEl.onclick1 = itemEl.onclick;
				itemEl.onclick = null;
			}
		} else {
			t.removeClass('menu-item-disabled');
			if (itemEl.onclick1){
				itemEl.onclick = itemEl.onclick1;
				itemEl.onclick1 = null;
			}
		}
	}
	
	function appendItem(target, param){
		var menu = $(target);
		if (param.parent){
			if (!param.parent.submenu){
				var submenu = $('<div class="menu"><div class="menu-line"></div></div>').appendTo('body');
				submenu[0].autowidth = true;
				submenu.hide();
				param.parent.submenu = submenu;
				$('<div class="menu-rightarrow"></div>').appendTo(param.parent);
			}
			menu = param.parent.submenu;
		}
		var item = $('<div class="menu-item"></div>').appendTo(menu);
		$('<div class="menu-text"></div>').html(param.text).appendTo(item);
		if (param.iconCls) $('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(item);
		if (param.id) item.attr('id', param.id);
		if (param.href) item.attr('href', param.href);
		if (param.name) item.attr('name', param.name);
		if (param.onclick){
			if (typeof param.onclick == 'string'){
				item.attr('onclick', param.onclick);
			} else {
				item[0].onclick = eval(param.onclick);
			}
		}
		if (param.handler) item[0].onclick = eval(param.handler);
		
		bindMenuItemEvent(target, item);
		
		if (param.disabled){
			setDisabled(target, item[0], true);
		}
		bindMenuEvent(target, menu);
		setMenuWidth(target, menu);
	}
	
	function removeItem(target, itemEl){
		function removeit(el){
			if (el.submenu){
				el.submenu.children('div.menu-item').each(function(){
					removeit(this);
				});
				var shadow = el.submenu[0].shadow;
				if (shadow) shadow.remove();
				el.submenu.remove();
			}
			$(el).remove();
		}
		removeit(itemEl);
	}
	
	function destroyMenu(target){
		$(target).children('div.menu-item').each(function(){
			removeItem(target, this);
		});
		if (target.shadow) target.shadow.remove();
		$(target).remove();
	}
	
	$.fn.menu = function(options, param){
		if (typeof options == 'string'){
			return $.fn.menu.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menu');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'menu', {
					options: $.extend({}, $.fn.menu.defaults, $.fn.menu.parseOptions(this), options)
				});
				init(this);
			}
			$(this).css({
				left: state.options.left,
				top: state.options.top
			});
		});
	};
	
	$.fn.menu.methods = {
		options: function(jq){
			return $.data(jq[0], 'menu').options;
		},
		show: function(jq, pos){
			return jq.each(function(){
				showMenu(this, pos);
			});
		},
		hide: function(jq){
			return jq.each(function(){
				hideAll(this);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyMenu(this);
			});
		},
		/**
		 * set the menu item text
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	text: string, the new text
		 * }
		 */
		setText: function(jq, param){
			return jq.each(function(){
				$(param.target).children('div.menu-text').html(param.text);
			});
		},
		/**
		 * set the menu icon class
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	iconCls: the menu item icon class
		 * }
		 */
		setIcon: function(jq, param){
			return jq.each(function(){
				var item = $(this).menu('getItem', param.target);
				if (item.iconCls){
					$(item.target).children('div.menu-icon').removeClass(item.iconCls).addClass(param.iconCls);
				} else {
					$('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(param.target);
				}
			});
		},
		/**
		 * get the menu item data that contains the following property:
		 * {
		 * 	target: DOM object, the menu item
		 *  id: the menu id
		 * 	text: the menu item text
		 * 	iconCls: the icon class
		 *  href: a remote address to redirect to
		 *  onclick: a function to be called when the item is clicked
		 * }
		 */
		getItem: function(jq, itemEl){
			var t = $(itemEl);
			var item = {
				target: itemEl,
				id: t.attr('id'),
				text: $.trim(t.children('div.menu-text').html()),
				disabled: t.hasClass('menu-item-disabled'),
				href: t.attr('href'),
				name: t.attr('name'),
				onclick: itemEl.onclick
			}
			var icon = t.children('div.menu-icon');
			if (icon.length){
				var cc = [];
				var aa = icon.attr('class').split(' ');
				for(var i=0; i<aa.length; i++){
					if (aa[i] != 'menu-icon'){
						cc.push(aa[i]);
					}
				}
				item.iconCls = cc.join(' ');
			}
			return item;
		},
		findItem: function(jq, text){
			return findItem(jq[0], text);
		},
		/**
		 * append menu item, the param contains following properties:
		 * parent,id,text,iconCls,href,onclick
		 * when parent property is assigned, append menu item to it
		 */
		appendItem: function(jq, param){
			return jq.each(function(){
				appendItem(this, param);
			});
		},
		removeItem: function(jq, itemEl){
			return jq.each(function(){
				removeItem(this, itemEl);
			});
		},
		enableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, false);
			});
		},
		disableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, true);
			});
		}
	};
	
	$.fn.menu.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, ['left','top',{minWidth:'number'}]));
	};
	
	$.fn.menu.defaults = {
		zIndex:110000,
		left: 0,
		top: 0,
		minWidth: 120,
		onShow: function(){},
		onHide: function(){},
		onClick: function(item){}
	};
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "menubutton").options;
		var _4 = $(_2);
		_4.removeClass("m-btn-active m-btn-plain-active").addClass("m-btn");
		_4.linkbutton($.extend({}, _3, {
			text : _3.text + "<span class=\"m-btn-downarrow\">&nbsp;</span>"
		}));
		if (_3.menu) {
			$(_3.menu).menu({
				onShow : function() {
					_4.addClass((_3.plain == true) ? "m-btn-plain-active" : "m-btn-active");
				},
				onHide : function() {
					_4.removeClass((_3.plain == true) ? "m-btn-plain-active" : "m-btn-active");
				}
			});
		}
		_5(_2, _3.disabled);
	}
	;
	function _5(_6, _7) {
		var _8 = $.data(_6, "menubutton").options;
		_8.disabled = _7;
		var _9 = $(_6);
		if (_7) {
			_9.linkbutton("disable");
			_9.unbind(".menubutton");
		} else {
			_9.linkbutton("enable");
			_9.unbind(".menubutton");
			_9.bind("click.menubutton", function() {
				_a();
				return false;
			});
			var _b = null;
			_9.bind("mouseenter.menubutton", function() {
				_b = setTimeout(function() {
					_a();
				}, _8.duration);
				return false;
			}).bind("mouseleave.menubutton", function() {
				if (_b) {
					clearTimeout(_b);
				}
			});
		}
		function _a() {
			if (!_8.menu) {
				return;
			}
			$("body>div.menu-top").menu("hide");
			$(_8.menu).menu("show", {
				alignTo : _9
			});
			_9.blur();
		}
		;
	}
	;
	$.fn.menubutton = function(_c, _d) {
		if (typeof _c == "string") {
			return $.fn.menubutton.methods[_c](this, _d);
		}
		_c = _c || {};
		return this.each(function() {
			var _e = $.data(this, "menubutton");
			if (_e) {
				$.extend(_e.options, _c);
			} else {
				$.data(this, "menubutton", {
					options : $.extend({}, $.fn.menubutton.defaults, $.fn.menubutton.parseOptions(this), _c)
				});
				$(this).removeAttr("disabled");
			}
			_1(this);
		});
	};
	$.fn.menubutton.methods = {
		options : function(jq) {
			return $.data(jq[0], "menubutton").options;
		},
		enable : function(jq) {
			return jq.each(function() {
				_5(this, false);
			});
		},
		disable : function(jq) {
			return jq.each(function() {
				_5(this, true);
			});
		},
		destroy : function(jq) {
			return jq.each(function() {
				var _f = $(this).menubutton("options");
				if (_f.menu) {
					$(_f.menu).menu("destroy");
				}
				$(this).remove();
			});
		}
	};
	$.fn.menubutton.parseOptions = function(_10) {
		var t = $(_10);
		return $.extend({}, $.fn.linkbutton.parseOptions(_10), $.parser.parseOptions(_10, [ "menu", {
			plain : "boolean",
			duration : "number"
		} ]));
	};
	$.fn.menubutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
		plain : true,
		menu : null,
		duration : 100
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "splitbutton").options;
		var _4 = $(_2);
		_4.removeClass("s-btn-active s-btn-plain-active").addClass("s-btn");
		_4.linkbutton($.extend({}, _3, {
			text : _3.text + "<span class=\"s-btn-downarrow\">&nbsp;</span>"
		}));
		if (_3.menu) {
			$(_3.menu).menu({
				onShow : function() {
					_4.addClass((_3.plain == true) ? "s-btn-plain-active" : "s-btn-active");
				},
				onHide : function() {
					_4.removeClass((_3.plain == true) ? "s-btn-plain-active" : "s-btn-active");
				}
			});
		}
		_5(_2, _3.disabled);
	}
	;
	function _5(_6, _7) {
		var _8 = $.data(_6, "splitbutton").options;
		_8.disabled = _7;
		var _9 = $(_6);
		var _a = _9.find(".s-btn-downarrow");
		if (_7) {
			_9.linkbutton("disable");
			_a.unbind(".splitbutton");
		} else {
			_9.linkbutton("enable");
			_a.unbind(".splitbutton");
			_a.bind("click.splitbutton", function() {
				_b();
				return false;
			});
			var _c = null;
			_a.bind("mouseenter.splitbutton", function() {
				_c = setTimeout(function() {
					_b();
				}, _8.duration);
				return false;
			}).bind("mouseleave.splitbutton", function() {
				if (_c) {
					clearTimeout(_c);
				}
			});
		}
		function _b() {
			if (!_8.menu) {
				return;
			}
			$("body>div.menu-top").menu("hide");
			$(_8.menu).menu("show", {
				alignTo : _9
			});
			_9.blur();
		}
		;
	}
	;
	$.fn.splitbutton = function(_d, _e) {
		if (typeof _d == "string") {
			return $.fn.splitbutton.methods[_d](this, _e);
		}
		_d = _d || {};
		return this.each(function() {
			var _f = $.data(this, "splitbutton");
			if (_f) {
				$.extend(_f.options, _d);
			} else {
				$.data(this, "splitbutton", {
					options : $.extend({}, $.fn.splitbutton.defaults, $.fn.splitbutton.parseOptions(this), _d)
				});
				$(this).removeAttr("disabled");
			}
			_1(this);
		});
	};
	$.fn.splitbutton.methods = {
		options : function(jq) {
			return $.data(jq[0], "splitbutton").options;
		},
		enable : function(jq) {
			return jq.each(function() {
				_5(this, false);
			});
		},
		disable : function(jq) {
			return jq.each(function() {
				_5(this, true);
			});
		},
		destroy : function(jq) {
			return jq.each(function() {
				var _10 = $(this).splitbutton("options");
				if (_10.menu) {
					$(_10.menu).menu("destroy");
				}
				$(this).remove();
			});
		}
	};
	$.fn.splitbutton.parseOptions = function(_11) {
		var t = $(_11);
		return $.extend({}, $.fn.linkbutton.parseOptions(_11), $.parser.parseOptions(_11, [ "menu", {
			plain : "boolean",
			duration : "number"
		} ]));
	};
	$.fn.splitbutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
		plain : true,
		menu : null,
		duration : 100
	});
})(jQuery);

/**
 * progressbar - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 none
 * 
 */
(function($){
	function init(target){
		$(target).addClass('progressbar');
		$(target).html('<div class="progressbar-text"></div><div class="progressbar-value"><div class="progressbar-text"></div></div>');
		return $(target);
	}
	
	function setSize(target,width){
		var opts = $.data(target, 'progressbar').options;
		var bar = $.data(target, 'progressbar').bar;
		if (width) opts.width = width;
		bar._outerWidth(opts.width)._outerHeight(opts.height);
		
		bar.find('div.progressbar-text').width(bar.width());
		bar.find('div.progressbar-text,div.progressbar-value').css({
			height: bar.height()+'px',
			lineHeight: bar.height()+'px'
		});
	}
	
	$.fn.progressbar = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.progressbar.methods[options];
			if (method){
				return method(this, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'progressbar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'progressbar', {
					options: $.extend({}, $.fn.progressbar.defaults, $.fn.progressbar.parseOptions(this), options),
					bar: init(this)
				});
			}
			$(this).progressbar('setValue', state.options.value);
			setSize(this);
		});
	};
	
	$.fn.progressbar.methods = {
		options: function(jq){
			return $.data(jq[0], 'progressbar').options;
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		getValue: function(jq){
			return $.data(jq[0], 'progressbar').options.value;
		},
		setValue: function(jq, value){
			if (value < 0) value = 0;
			if (value > 100) value = 100;
			return jq.each(function(){
				var opts = $.data(this, 'progressbar').options;
				var text = opts.text.replace(/{value}/, value);
				var oldValue = opts.value;
				opts.value = value;
				$(this).find('div.progressbar-value').width(value+'%');
				$(this).find('div.progressbar-text').html(text);
				if (oldValue != value){
					opts.onChange.call(this, value, oldValue);
				}
			});
		}
	};
	
	$.fn.progressbar.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, ['width','height','text',{value:'number'}]));
	};
	
	$.fn.progressbar.defaults = {
		width: 'auto',
		height: 22,
		value: 0,	// percentage value
		text: '{value}%',
		onChange:function(newValue,oldValue){}
	};
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $(_2);
		_3.addClass("tree");
		return _3;
	}
	;
	function _4(_5) {
		var _6 = [];
		_7(_6, $(_5));
		function _7(aa, _8) {
			_8.children("li").each(function() {
				var _9 = $(this);
				var _a = $.extend({}, $.parser.parseOptions(this, [ "id", "iconCls", "state" ]), {
					checked : (_9.attr("checked") ? true : undefined)
				});
				_a.text = _9.children("span").html();
				if (!_a.text) {
					_a.text = _9.html();
				}
				var _b = _9.children("ul");
				if (_b.length) {
					_a.children = [];
					_7(_a.children, _b);
				}
				aa.push(_a);
			});
		}
		;
		return _6;
	}
	;
	function _c(_d) {
		var _e = $.data(_d, "tree").options;
		$(_d).unbind().bind("mouseover", function(e) {
			var tt = $(e.target);
			var _f = tt.closest("div.tree-node");
			if (!_f.length) {
				return;
			}
			_f.addClass("tree-node-hover");
			if (tt.hasClass("tree-hit")) {
				if (tt.hasClass("tree-expanded")) {
					tt.addClass("tree-expanded-hover");
				} else {
					tt.addClass("tree-collapsed-hover");
				}
			}
			e.stopPropagation();
		}).bind("mouseout", function(e) {
			var tt = $(e.target);
			var _10 = tt.closest("div.tree-node");
			if (!_10.length) {
				return;
			}
			_10.removeClass("tree-node-hover");
			if (tt.hasClass("tree-hit")) {
				if (tt.hasClass("tree-expanded")) {
					tt.removeClass("tree-expanded-hover");
				} else {
					tt.removeClass("tree-collapsed-hover");
				}
			}
			e.stopPropagation();
		}).bind("click", function(e) {
			var tt = $(e.target);
			var _11 = tt.closest("div.tree-node");
			if (!_11.length) {
				return;
			}
			if (tt.hasClass("tree-hit")) {
				_85(_d, _11[0]);
				return false;
			} else {
				if (tt.hasClass("tree-checkbox")) {
					_39(_d, _11[0], !tt.hasClass("tree-checkbox1"));
					return false;
				} else {
					_ce(_d, _11[0]);
					_e.onClick.call(_d, _14(_d, _11[0]));
				}
			}
			e.stopPropagation();
		}).bind("dblclick", function(e) {
			var _12 = $(e.target).closest("div.tree-node");
			if (!_12.length) {
				return;
			}
			_ce(_d, _12[0]);
			_e.onDblClick.call(_d, _14(_d, _12[0]));
			e.stopPropagation();
		}).bind("contextmenu", function(e) {
			var _13 = $(e.target).closest("div.tree-node");
			if (!_13.length) {
				return;
			}
			_e.onContextMenu.call(_d, e, _14(_d, _13[0]));
			e.stopPropagation();
		});
	}
	;
	function _15(_16) {
		var _17 = $(_16).find("div.tree-node");
		_17.draggable("disable");
		_17.css("cursor", "pointer");
	}
	;
	function _18(_19) {
		var _1a = $.data(_19, "tree");
		var _1b = _1a.options;
		var _1c = _1a.tree;
		_1a.disabledNodes = [];
		_1c.find("div.tree-node").draggable({
			disabled : false,
			revert : true,
			cursor : "pointer",
			proxy : function(_1d) {
				var p = $("<div class=\"tree-node-proxy\"></div>").appendTo("body");
				p.html("<span class=\"tree-dnd-icon tree-dnd-no\">&nbsp;</span>" + $(_1d).find(".tree-title").html());
				p.hide();
				return p;
			},
			deltaX : 15,
			deltaY : 15,
			onBeforeDrag : function(e) {
				if (_1b.onBeforeDrag.call(_19, _14(_19, this)) == false) {
					return false;
				}
				if ($(e.target).hasClass("tree-hit") || $(e.target).hasClass("tree-checkbox")) {
					return false;
				}
				if (e.which != 1) {
					return false;
				}
				$(this).next("ul").find("div.tree-node").droppable({
					accept : "no-accept"
				});
				var _1e = $(this).find("span.tree-indent");
				if (_1e.length) {
					e.data.offsetWidth -= _1e.length * _1e.width();
				}
			},
			onStartDrag : function() {
				$(this).draggable("proxy").css({
					left : -10000,
					top : -10000
				});
				_1b.onStartDrag.call(_19, _14(_19, this));
				var _1f = _14(_19, this);
				if (_1f.id == undefined) {
					_1f.id = "easyui_tree_node_id_temp";
					_c2(_19, _1f);
				}
				_1a.draggingNodeId = _1f.id;
			},
			onDrag : function(e) {
				var x1 = e.pageX, y1 = e.pageY, x2 = e.data.startX, y2 = e.data.startY;
				var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
				if (d > 3) {
					$(this).draggable("proxy").show();
				}
				this.pageY = e.pageY;
			},
			onStopDrag : function() {
				$(this).next("ul").find("div.tree-node").droppable({
					accept : "div.tree-node"
				});
				for ( var i = 0; i < _1a.disabledNodes.length; i++) {
					$(_1a.disabledNodes[i]).droppable("enable");
				}
				_1a.disabledNodes = [];
				var _20 = _cb(_19, _1a.draggingNodeId);
				if (_20.id == "easyui_tree_node_id_temp") {
					_20.id = "";
					_c2(_19, _20);
				}
				_1b.onStopDrag.call(_19, _20);
			}
		}).droppable({
			accept : "div.tree-node",
			onDragEnter : function(e, _21) {
				if (_1b.onDragEnter.call(_19, this, _14(_19, _21)) == false) {
					_22(_21, false);
					$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
					$(this).droppable("disable");
					_1a.disabledNodes.push(this);
				}
			},
			onDragOver : function(e, _23) {
				if ($(this).droppable("options").disabled) {
					return;
				}
				var _24 = _23.pageY;
				var top = $(this).offset().top;
				var _25 = top + $(this).outerHeight();
				_22(_23, true);
				$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
				if (_24 > top + (_25 - top) / 2) {
					if (_25 - _24 < 5) {
						$(this).addClass("tree-node-bottom");
					} else {
						$(this).addClass("tree-node-append");
					}
				} else {
					if (_24 - top < 5) {
						$(this).addClass("tree-node-top");
					} else {
						$(this).addClass("tree-node-append");
					}
				}
				if (_1b.onDragOver.call(_19, this, _14(_19, _23)) == false) {
					_22(_23, false);
					$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
					$(this).droppable("disable");
					_1a.disabledNodes.push(this);
				}
			},
			onDragLeave : function(e, _26) {
				_22(_26, false);
				$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
				_1b.onDragLeave.call(_19, this, _14(_19, _26));
			},
			onDrop : function(e, _27) {
				var _28 = this;
				var _29, _2a;
				if ($(this).hasClass("tree-node-append")) {
					_29 = _2b;
				} else {
					_29 = _2c;
					_2a = $(this).hasClass("tree-node-top") ? "top" : "bottom";
				}
				_29(_27, _28, _2a);
				$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
			}
		});
		function _22(_2d, _2e) {
			var _2f = $(_2d).draggable("proxy").find("span.tree-dnd-icon");
			_2f.removeClass("tree-dnd-yes tree-dnd-no").addClass(_2e ? "tree-dnd-yes" : "tree-dnd-no");
		}
		;
		function _2b(_30, _31) {
			if (_14(_19, _31).state == "closed") {
				_79(_19, _31, function() {
					_32();
				});
			} else {
				_32();
			}
			function _32() {
				var _33 = $(_19).tree("pop", _30);
				$(_19).tree("append", {
					parent : _31,
					data : [ _33 ]
				});
				_1b.onDrop.call(_19, _31, _33, "append");
			}
			;
		}
		;
		function _2c(_34, _35, _36) {
			var _37 = {};
			if (_36 == "top") {
				_37.before = _35;
			} else {
				_37.after = _35;
			}
			var _38 = $(_19).tree("pop", _34);
			_37.data = _38;
			$(_19).tree("insert", _37);
			_1b.onDrop.call(_19, _35, _38, _36);
		}
		;
	}
	;
	function _39(_3a, _3b, _3c) {
		var _3d = $.data(_3a, "tree").options;
		if (!_3d.checkbox) {
			return;
		}
		var _3e = _14(_3a, _3b);
		if (_3d.onBeforeCheck.call(_3a, _3e, _3c) == false) {
			return;
		}
		var _3f = $(_3b);
		var ck = _3f.find(".tree-checkbox");
		ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
		if (_3c) {
			ck.addClass("tree-checkbox1");
		} else {
			ck.addClass("tree-checkbox0");
		}
		if (_3d.cascadeCheck) {
			_40(_3f);
			_41(_3f);
		}
		_3d.onCheck.call(_3a, _3e, _3c);
		function _41(_42) {
			var _43 = _42.next().find(".tree-checkbox");
			_43.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
			if (_42.find(".tree-checkbox").hasClass("tree-checkbox1")) {
				_43.addClass("tree-checkbox1");
			} else {
				_43.addClass("tree-checkbox0");
			}
		}
		;
		function _40(_44) {
			var _45 = _90(_3a, _44[0]);
			if (_45) {
				var ck = $(_45.target).find(".tree-checkbox");
				ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
				if (_46(_44)) {
					ck.addClass("tree-checkbox1");
				} else {
					if (_47(_44)) {
						ck.addClass("tree-checkbox0");
					} else {
						ck.addClass("tree-checkbox2");
					}
				}
				_40($(_45.target));
			}
			function _46(n) {
				var ck = n.find(".tree-checkbox");
				if (ck.hasClass("tree-checkbox0") || ck.hasClass("tree-checkbox2")) {
					return false;
				}
				var b = true;
				n.parent().siblings().each(function() {
					if (!$(this).children("div.tree-node").children(".tree-checkbox").hasClass("tree-checkbox1")) {
						b = false;
					}
				});
				return b;
			}
			;
			function _47(n) {
				var ck = n.find(".tree-checkbox");
				if (ck.hasClass("tree-checkbox1") || ck.hasClass("tree-checkbox2")) {
					return false;
				}
				var b = true;
				n.parent().siblings().each(function() {
					if (!$(this).children("div.tree-node").children(".tree-checkbox").hasClass("tree-checkbox0")) {
						b = false;
					}
				});
				return b;
			}
			;
		}
		;
	}
	;
	function _48(_49, _4a) {
		var _4b = $.data(_49, "tree").options;
		var _4c = $(_4a);
		if (_4d(_49, _4a)) {
			var ck = _4c.find(".tree-checkbox");
			if (ck.length) {
				if (ck.hasClass("tree-checkbox1")) {
					_39(_49, _4a, true);
				} else {
					_39(_49, _4a, false);
				}
			} else {
				if (_4b.onlyLeafCheck) {
					$("<span class=\"tree-checkbox tree-checkbox0\"></span>").insertBefore(_4c.find(".tree-title"));
				}
			}
		} else {
			var ck = _4c.find(".tree-checkbox");
			if (_4b.onlyLeafCheck) {
				ck.remove();
			} else {
				if (ck.hasClass("tree-checkbox1")) {
					_39(_49, _4a, true);
				} else {
					if (ck.hasClass("tree-checkbox2")) {
						var _4e = true;
						var _4f = true;
						var _50 = _51(_49, _4a);
						for ( var i = 0; i < _50.length; i++) {
							if (_50[i].checked) {
								_4f = false;
							} else {
								_4e = false;
							}
						}
						if (_4e) {
							_39(_49, _4a, true);
						}
						if (_4f) {
							_39(_49, _4a, false);
						}
					}
				}
			}
		}
	}
	;
	function _52(_53, ul, _54, _55) {
		var _56 = $.data(_53, "tree").options;
		_54 = _56.loadFilter.call(_53, _54, $(ul).prev("div.tree-node")[0]);
		if (!_55) {
			$(ul).empty();
		}
		var _57 = [];
		var _58 = $(ul).prev("div.tree-node").find("span.tree-indent, span.tree-hit").length;
		_59(ul, _54, _58);
		if (_56.dnd) {
			_18(_53);
		} else {
			_15(_53);
		}
		for ( var i = 0; i < _57.length; i++) {
			_39(_53, _57[i], true);
		}
		setTimeout(function() {
			_61(_53, _53);
		}, 0);
		var _5a = null;
		if (_53 != ul) {
			var _5b = $(ul).prev();
			_5a = _14(_53, _5b[0]);
		}
		_56.onLoadSuccess.call(_53, _5a, _54);
		
		function filter( node ){//过滤器
			var includes = _56.includes || [];
			var excludes = _56.excludes || [];
			if( includes.length > 0 && !includes.contains(node.id) ){
				return true;
			}
			if( excludes.length > 0 && excludes.contains(node.id) ){
				return true;
			}
			return false;
		}
		
		function _59(ul, _5c, _5d) {
		
			for ( var i = 0; i < _5c.length; i++) {
				if( filter(_5c[i]) ){
					continue;
				}
				var li = $("<li></li>").appendTo(ul);
				var _5e = _5c[i];
				if (_5e.state != "open" && _5e.state != "closed") {
					_5e.state = "open";
				}
				var _5f = $("<div class=\"tree-node\"></div>").appendTo(li);
				_5f.attr("node-id", _5e.id);
				$.data(_5f[0], "tree-node", {
					id : _5e.id,
					text : _5e.text,
					iconCls : _5e.iconCls,
					attributes : _5e.attributes
				});
				$("<span class=\"tree-title\"></span>").html(_5e.text).appendTo(_5f);
				if (_56.checkbox) {
					if (_56.onlyLeafCheck) {
						if (_5e.state == "open" && (!_5e.children || !_5e.children.length)) {
							if (_5e.checked) {
								$("<span class=\"tree-checkbox tree-checkbox1\"></span>").prependTo(_5f);
							} else {
								$("<span class=\"tree-checkbox tree-checkbox0\"></span>").prependTo(_5f);
							}
						}
					} else {
						if (_5e.checked) {
							$("<span class=\"tree-checkbox tree-checkbox1\"></span>").prependTo(_5f);
							_57.push(_5f[0]);
						} else {
							$("<span class=\"tree-checkbox tree-checkbox0\"></span>").prependTo(_5f);
						}
					}
				}
				if (_5e.children && _5e.children.length) {
					var _60 = $("<ul></ul>").appendTo(li);
					if (_5e.state == "open") {
						$("<span class=\"tree-icon tree-folder tree-folder-open\"></span>").addClass(_5e.iconCls).prependTo(_5f);
						$("<span class=\"tree-hit tree-expanded\"></span>").prependTo(_5f);
					} else {
						$("<span class=\"tree-icon tree-folder\"></span>").addClass(_5e.iconCls).prependTo(_5f);
						$("<span class=\"tree-hit tree-collapsed\"></span>").prependTo(_5f);
						_60.css("display", "none");
					}
					_59(_60, _5e.children, _5d + 1);
				} else {
					if (_5e.state == "closed") {
						$("<span class=\"tree-icon tree-folder\"></span>").addClass(_5e.iconCls).prependTo(_5f);
						$("<span class=\"tree-hit tree-collapsed\"></span>").prependTo(_5f);
					} else {
						$("<span class=\"tree-icon tree-file\"></span>").addClass(_5e.iconCls).prependTo(_5f);
						$("<span class=\"tree-indent\"></span>").prependTo(_5f);
					}
				}
				for ( var j = 0; j < _5d; j++) {
					$("<span class=\"tree-indent\"></span>").prependTo(_5f);
				}
			}
		}
		;
	}
	;
	function _61(_62, ul, _63) {
		var _64 = $.data(_62, "tree").options;
		if (!_64.lines) {
			return;
		}
		if (!_63) {
			_63 = true;
			$(_62).find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
			$(_62).find("div.tree-node").removeClass("tree-node-last tree-root-first tree-root-one");
			var _65 = $(_62).tree("getRoots");
			if (_65.length > 1) {
				$(_65[0].target).addClass("tree-root-first");
			} else {
				if (_65.length == 1) {
					$(_65[0].target).addClass("tree-root-one");
				}
			}
		}
		$(ul).children("li").each(function() {
			var _66 = $(this).children("div.tree-node");
			var ul = _66.next("ul");
			if (ul.length) {
				if ($(this).next().length) {
					_67(_66);
				}
				_61(_62, ul, _63);
			} else {
				_68(_66);
			}
		});
		var _69 = $(ul).children("li:last").children("div.tree-node").addClass("tree-node-last");
		_69.children("span.tree-join").removeClass("tree-join").addClass("tree-joinbottom");
		function _68(_6a, _6b) {
			var _6c = _6a.find("span.tree-icon");
			_6c.prev("span.tree-indent").addClass("tree-join");
		}
		;
		function _67(_6d) {
			var _6e = _6d.find("span.tree-indent, span.tree-hit").length;
			_6d.next().find("div.tree-node").each(function() {
				$(this).children("span:eq(" + (_6e - 1) + ")").addClass("tree-line");
			});
		}
		;
	}
	;
	function _6f(_70, ul, _71, _72) {
		var _73 = $.data(_70, "tree").options;
		_71 = _71 || {};
		var _74 = null;
		if (_70 != ul) {
			var _75 = $(ul).prev();
			_74 = _14(_70, _75[0]);
		}
		if (_73.onBeforeLoad.call(_70, _74, _71) == false) {
			return;
		}
		var _76 = $(ul).prev().children("span.tree-folder");
		_76.addClass("tree-loading");
		var _77 = _73.loader.call(_70, _71, function(_78) {
			_76.removeClass("tree-loading");
			_52(_70, ul, _78);
			if (_72) {
				_72();
			}
		}, function() {
			_76.removeClass("tree-loading");
			_73.onLoadError.apply(_70, arguments);
			if (_72) {
				_72();
			}
		});
		if (_77 == false) {
			_76.removeClass("tree-loading");
		}
	}
	;
	function _79(_7a, _7b, _7c) {
		var _7d = $.data(_7a, "tree").options;
		var hit = $(_7b).children("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-expanded")) {
			return;
		}
		var _7e = _14(_7a, _7b);
		if (_7d.onBeforeExpand.call(_7a, _7e) == false) {
			return;
		}
		hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
		hit.next().addClass("tree-folder-open");
		var ul = $(_7b).next();
		if (ul.length) {
			if (_7d.animate) {
				ul.slideDown("normal", function() {
					_7d.onExpand.call(_7a, _7e);
					if (_7c) {
						_7c();
					}
				});
			} else {
				ul.css("display", "block");
				_7d.onExpand.call(_7a, _7e);
				if (_7c) {
					_7c();
				}
			}
		} else {
			var _7f = $("<ul style=\"display:none\"></ul>").insertAfter(_7b);
			_6f(_7a, _7f[0], {
				id : _7e.id
			}, function() {
				if (_7f.is(":empty")) {
					_7f.remove();
				}
				if (_7d.animate) {
					_7f.slideDown("normal", function() {
						_7d.onExpand.call(_7a, _7e);
						if (_7c) {
							_7c();
						}
					});
				} else {
					_7f.css("display", "block");
					_7d.onExpand.call(_7a, _7e);
					if (_7c) {
						_7c();
					}
				}
			});
		}
	}
	;
	function _80(_81, _82) {
		var _83 = $.data(_81, "tree").options;
		var hit = $(_82).children("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-collapsed")) {
			return;
		}
		var _84 = _14(_81, _82);
		if (_83.onBeforeCollapse.call(_81, _84) == false) {
			return;
		}
		hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
		hit.next().removeClass("tree-folder-open");
		var ul = $(_82).next();
		if (_83.animate) {
			ul.slideUp("normal", function() {
				_83.onCollapse.call(_81, _84);
			});
		} else {
			ul.css("display", "none");
			_83.onCollapse.call(_81, _84);
		}
	}
	;
	function _85(_86, _87) {
		var hit = $(_87).children("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-expanded")) {
			_80(_86, _87);
		} else {
			_79(_86, _87);
		}
	}
	;
	function _88(_89, _8a) {
		var _8b = _51(_89, _8a);
		if (_8a) {
			_8b.unshift(_14(_89, _8a));
		}
		for ( var i = 0; i < _8b.length; i++) {
			_79(_89, _8b[i].target);
		}
	}
	;
	function _8c(_8d, _8e) {
		var _8f = [];
		var p = _90(_8d, _8e);
		while (p) {
			_8f.unshift(p);
			p = _90(_8d, p.target);
		}
		for ( var i = 0; i < _8f.length; i++) {
			_79(_8d, _8f[i].target);
		}
	}
	;
	function _91(_92, _93) {
		var _94 = _51(_92, _93);
		if (_93) {
			_94.unshift(_14(_92, _93));
		}
		for ( var i = 0; i < _94.length; i++) {
			_80(_92, _94[i].target);
		}
	}
	;
	function _95(_96) {
		var _97 = _98(_96);
		if (_97.length) {
			return _97[0];
		} else {
			return null;
		}
	}
	;
	function _98(_99) {
		var _9a = [];
		$(_99).children("li").each(function() {
			var _9b = $(this).children("div.tree-node");
			_9a.push(_14(_99, _9b[0]));
		});
		return _9a;
	}
	;
	function _51(_9c, _9d) {
		var _9e = [];
		if (_9d) {
			_9f($(_9d));
		} else {
			var _a0 = _98(_9c);
			for ( var i = 0; i < _a0.length; i++) {
				_9e.push(_a0[i]);
				_9f($(_a0[i].target));
			}
		}
		function _9f(_a1) {
			_a1.next().find("div.tree-node").each(function() {
				_9e.push(_14(_9c, this));
			});
		}
		;
		return _9e;
	}
	;
	function _90(_a2, _a3) {
		var ul = $(_a3).parent().parent();
		if (ul[0] == _a2) {
			return null;
		} else {
			return _14(_a2, ul.prev()[0]);
		}
	}
	;
	function _a4(_a5, _a6) {
		_a6 = _a6 || "checked";
		var _a7 = "";
		if (_a6 == "checked") {
			_a7 = "span.tree-checkbox1";
		} else {
			if (_a6 == "unchecked") {
				_a7 = "span.tree-checkbox0";
			} else {
				if (_a6 == "indeterminate") {
					_a7 = "span.tree-checkbox2";
				}
			}
		}
		var _a8 = [];
		$(_a5).find(_a7).each(function() {
			var _a9 = $(this).parent();
			_a8.push(_14(_a5, _a9[0]));
		});
		return _a8;
	}
	;
	function _aa(_ab) {
		var _ac = $(_ab).find("div.tree-node-selected");
		if (_ac.length) {
			return _14(_ab, _ac[0]);
		} else {
			return null;
		}
	}
	;
	function _ad(_ae, _af) {
		var _b0 = $(_af.parent);
		var ul;
		if (_b0.length == 0) {
			ul = $(_ae);
		} else {
			ul = _b0.next();
			if (ul.length == 0) {
				ul = $("<ul></ul>").insertAfter(_b0);
			}
		}
		if (_af.data && _af.data.length) {
			var _b1 = _b0.find("span.tree-icon");
			if (_b1.hasClass("tree-file")) {
				_b1.removeClass("tree-file").addClass("tree-folder tree-folder-open");
				var hit = $("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_b1);
				if (hit.prev().length) {
					hit.prev().remove();
				}
			}
		}
		_52(_ae, ul[0], _af.data, true);
		_48(_ae, ul.prev());
	}
	;
	function _b2(_b3, _b4) {
		var ref = _b4.before || _b4.after;
		var _b5 = _90(_b3, ref);
		var li;
		if (_b5) {
			_ad(_b3, {
				parent : _b5.target,
				data : [ _b4.data ]
			});
			li = $(_b5.target).next().children("li:last");
		} else {
			_ad(_b3, {
				parent : null,
				data : [ _b4.data ]
			});
			li = $(_b3).children("li:last");
		}
		if (_b4.before) {
			li.insertBefore($(ref).parent());
		} else {
			li.insertAfter($(ref).parent());
		}
	}
	;
	function _b6(_b7, _b8) {
		var _b9 = _90(_b7, _b8);
		var _ba = $(_b8);
		var li = _ba.parent();
		var ul = li.parent();
		li.remove();
		if (ul.children("li").length == 0) {
			var _ba = ul.prev();
			_ba.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
			_ba.find(".tree-hit").remove();
			$("<span class=\"tree-indent\"></span>").prependTo(_ba);
			if (ul[0] != _b7) {
				ul.remove();
			}
		}
		if (_b9) {
			_48(_b7, _b9.target);
		}
		_61(_b7, _b7);
	}
	;
	function _bb(_bc, _bd) {
		function _be(aa, ul) {
			ul.children("li").each(function() {
				var _bf = $(this).children("div.tree-node");
				var _c0 = _14(_bc, _bf[0]);
				var sub = $(this).children("ul");
				if (sub.length) {
					_c0.children = [];
					_be(_c0.children, sub);
				}
				aa.push(_c0);
			});
		}
		;
		if (_bd) {
			var _c1 = _14(_bc, _bd);
			_c1.children = [];
			_be(_c1.children, $(_bd).next());
			return _c1;
		} else {
			return null;
		}
	}
	;
	function _c2(_c3, _c4) {
		var _c5 = $(_c4.target);
		var _c6 = _14(_c3, _c4.target);
		if (_c6.iconCls) {
			_c5.find(".tree-icon").removeClass(_c6.iconCls);
		}
		var _c7 = $.extend({}, _c6, _c4);
		$.data(_c4.target, "tree-node", _c7);
		_c5.attr("node-id", _c7.id);
		_c5.find(".tree-title").html(_c7.text);
		if (_c7.iconCls) {
			_c5.find(".tree-icon").addClass(_c7.iconCls);
		}
		if (_c6.checked != _c7.checked) {
			_39(_c3, _c4.target, _c7.checked);
		}
	}
	;
	function _14(_c8, _c9) {
		var _ca = $.extend({}, $.data(_c9, "tree-node"), {
			target : _c9,
			checked : $(_c9).find(".tree-checkbox").hasClass("tree-checkbox1")
		});
		if (!_4d(_c8, _c9)) {
			_ca.state = $(_c9).find(".tree-hit").hasClass("tree-expanded") ? "open" : "closed";
		}
		return _ca;
	}
	;
	function _cb(_cc, id) {
		var _cd = $(_cc).find("div.tree-node[node-id=" + id + "]");
		if (_cd.length) {
			return _14(_cc, _cd[0]);
		} else {
			return null;
		}
	}
	;
	function _ce(_cf, _d0) {
		var _d1 = $.data(_cf, "tree").options;
		var _d2 = _14(_cf, _d0);
		if (_d1.onBeforeSelect.call(_cf, _d2) == false) {
			return;
		}
		$("div.tree-node-selected", _cf).removeClass("tree-node-selected");
		$(_d0).addClass("tree-node-selected");
		_d1.onSelect.call(_cf, _d2);
	}
	;
	function _4d(_d3, _d4) {
		var _d5 = $(_d4);
		var hit = _d5.children("span.tree-hit");
		return hit.length == 0;
	}
	;
	function _d6(_d7, _d8) {
		var _d9 = $.data(_d7, "tree").options;
		var _da = _14(_d7, _d8);
		if (_d9.onBeforeEdit.call(_d7, _da) == false) {
			return;
		}
		$(_d8).css("position", "relative");
		var nt = $(_d8).find(".tree-title");
		var _db = nt.outerWidth();
		nt.empty();
		var _dc = $("<input class=\"tree-editor\">").appendTo(nt);
		_dc.val(_da.text).focus();
		_dc.width(_db + 20);
		_dc.height(document.compatMode == "CSS1Compat" ? (18 - (_dc.outerHeight() - _dc.height())) : 18);
		_dc.bind("click", function(e) {
			return false;
		}).bind("mousedown", function(e) {
			e.stopPropagation();
		}).bind("mousemove", function(e) {
			e.stopPropagation();
		}).bind("keydown", function(e) {
			if (e.keyCode == 13) {
				_dd(_d7, _d8);
				return false;
			} else {
				if (e.keyCode == 27) {
					_e3(_d7, _d8);
					return false;
				}
			}
		}).bind("blur", function(e) {
			e.stopPropagation();
			_dd(_d7, _d8);
		});
	}
	;
	function _dd(_de, _df) {
		var _e0 = $.data(_de, "tree").options;
		$(_df).css("position", "");
		var _e1 = $(_df).find("input.tree-editor");
		var val = _e1.val();
		_e1.remove();
		var _e2 = _14(_de, _df);
		_e2.text = val;
		_c2(_de, _e2);
		_e0.onAfterEdit.call(_de, _e2);
	}
	;
	function _e3(_e4, _e5) {
		var _e6 = $.data(_e4, "tree").options;
		$(_e5).css("position", "");
		$(_e5).find("input.tree-editor").remove();
		var _e7 = _14(_e4, _e5);
		_c2(_e4, _e7);
		_e6.onCancelEdit.call(_e4, _e7);
	}
	;
	$.fn.tree = function(_e8, _e9) {
		if (typeof _e8 == "string") {
			return $.fn.tree.methods[_e8](this, _e9);
		}
		var _e8 = _e8 || {};
		return this.each(function() {
			var _ea = $.data(this, "tree");
			var _eb;
			if (_ea) {
				_eb = $.extend(_ea.options, _e8);
				_ea.options = _eb;
			} else {
				_eb = $.extend({}, $.fn.tree.defaults, $.fn.tree.parseOptions(this), _e8);
				$.data(this, "tree", {
					options : _eb,
					tree : _1(this)
				});
				var _ec = _4(this);
				if (_ec.length && !_eb.data) {
					_eb.data = _ec;
				}
			}
			_c(this);
			if (_eb.lines) {
				$(this).addClass("tree-lines");
			}
			if (_eb.data) {
				_52(this, this, _eb.data);
			} else {
				if (_eb.dnd) {
					_18(this);
				} else {
					_15(this);
				}
			}
			_6f(this, this);
		});
	};
	$.fn.tree.methods = {
		options : function(jq) {
			return $.data(jq[0], "tree").options;
		},
		loadData : function(jq, _ed) {
			return jq.each(function() {
				_52(this, this, _ed);
			});
		},
		getNode : function(jq, _ee) {
			return _14(jq[0], _ee);
		},
		getData : function(jq, _ef) {
			return _bb(jq[0], _ef);
		},
		reload : function(jq, _f0) {
			return jq.each(function() {
				if (_f0) {
					var _f1 = $(_f0);
					var hit = _f1.children("span.tree-hit");
					hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
					_f1.next().remove();
					_79(this, _f0);
				} else {
					$(this).empty();
					_6f(this, this);
				}
			});
		},
		getRoot : function(jq) {
			return _95(jq[0]);
		},
		getRoots : function(jq) {
			return _98(jq[0]);
		},
		getParent : function(jq, _f2) {
			return _90(jq[0], _f2);
		},
		getChildren : function(jq, _f3) {
			return _51(jq[0], _f3);
		},
		getChecked : function(jq, _f4) {
			return _a4(jq[0], _f4);
		},
		getSelected : function(jq) {
			return _aa(jq[0]);
		},
		isLeaf : function(jq, _f5) {
			return _4d(jq[0], _f5);
		},
		find : function(jq, id) {
			return _cb(jq[0], id);
		},
		select : function(jq, _f6) {
			return jq.each(function() {
				_ce(this, _f6);
			});
		},
		check : function(jq, _f7) {
			return jq.each(function() {
				_39(this, _f7, true);
			});
		},
		uncheck : function(jq, _f8) {
			return jq.each(function() {
				_39(this, _f8, false);
			});
		},
		collapse : function(jq, _f9) {
			return jq.each(function() {
				_80(this, _f9);
			});
		},
		expand : function(jq, _fa) {
			return jq.each(function() {
				_79(this, _fa);
			});
		},
		collapseAll : function(jq, _fb) {
			return jq.each(function() {
				_91(this, _fb);
			});
		},
		expandAll : function(jq, _fc) {
			return jq.each(function() {
				_88(this, _fc);
			});
		},
		expandTo : function(jq, _fd) {
			return jq.each(function() {
				_8c(this, _fd);
			});
		},
		toggle : function(jq, _fe) {
			return jq.each(function() {
				_85(this, _fe);
			});
		},
		append : function(jq, _ff) {
			return jq.each(function() {
				_ad(this, _ff);
			});
		},
		insert : function(jq, _100) {
			return jq.each(function() {
				_b2(this, _100);
			});
		},
		remove : function(jq, _101) {
			return jq.each(function() {
				_b6(this, _101);
			});
		},
		pop : function(jq, _102) {
			var node = jq.tree("getData", _102);
			jq.tree("remove", _102);
			return node;
		},
		update : function(jq, _103) {
			return jq.each(function() {
				_c2(this, _103);
			});
		},
		enableDnd : function(jq) {
			return jq.each(function() {
				_18(this);
			});
		},
		disableDnd : function(jq) {
			return jq.each(function() {
				_15(this);
			});
		},
		beginEdit : function(jq, _104) {
			return jq.each(function() {
				_d6(this, _104);
			});
		},
		endEdit : function(jq, _105) {
			return jq.each(function() {
				_dd(this, _105);
			});
		},
		cancelEdit : function(jq, _106) {
			return jq.each(function() {
				_e3(this, _106);
			});
		}
	};
	$.fn.tree.parseOptions = function(_107) {
		var t = $(_107);
		return $.extend({}, $.parser.parseOptions(_107, [ "url", "method", {
			checkbox : "boolean",
			cascadeCheck : "boolean",
			onlyLeafCheck : "boolean"
		}, {
			animate : "boolean",
			lines : "boolean",
			dnd : "boolean"
		} ]));
	};
	$.fn.tree.defaults = {
		url : null,
		method : "post",
		animate : false,
		checkbox : false,
		cascadeCheck : true,
		onlyLeafCheck : false,
		lines : false,
		dnd : false,
		data : null,
		loader : function(_108, _109, _10a) {
			var opts = $(this).tree("options");
			var data = $.extend(opts.params || {}, _108);
			if (!opts.url) {
				return false;
			}
			$.ajax({
				type : opts.method,
				url : opts.url,
				data : data,
				dataType : "json",
				success : function(data) {
					_109(data);
				},
				error : function() {
					_10a.apply(this, arguments);
				}
			});
		},
		loadFilter : function(data, _10b) {
			return data;
		},
		onBeforeLoad : function(node, _10c) {
		},
		onLoadSuccess : function(node, data) {
		},
		onLoadError : function() {
		},
		onClick : function(node) {
		},
		onDblClick : function(node) {
		},
		onBeforeExpand : function(node) {
		},
		onExpand : function(node) {
		},
		onBeforeCollapse : function(node) {
		},
		onCollapse : function(node) {
		},
		onBeforeCheck : function(node, _10d) {
		},
		onCheck : function(node, _10e) {
		},
		onBeforeSelect : function(node) {
		},
		onSelect : function(node) {
		},
		onContextMenu : function(e, node) {
		},
		onBeforeDrag : function(node) {
		},
		onStartDrag : function(node) {
		},
		onStopDrag : function(node) {
		},
		onDragEnter : function(_10f, _110) {
		},
		onDragOver : function(_111, _112) {
		},
		onDragLeave : function(_113, _114) {
		},
		onDrop : function(_115, _116, _117) {
		},
		onBeforeEdit : function(node) {
		},
		onAfterEdit : function(node) {
		},
		onCancelEdit : function(node) {
		}
	};
})(jQuery);

/**
 * combobox - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *   combo
 * 
 */
(function($){
	/**
	 * scroll panel to display the specified item
	 */
	function scrollTo(target, value){
		var panel = $(target).combo('panel');
		var item = panel.find('div.combobox-item[value="' + value + '"]');
		if (item.length){
			if (item.position().top <= 0){
				var h = panel.scrollTop() + item.position().top;
				panel.scrollTop(h);
			} else if (item.position().top + item.outerHeight() > panel.height()){
				var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
				panel.scrollTop(h);
			}
		}
	}
	
	/**
	 * select previous item
	 */
	function selectPrev(target){
		var panel = $(target).combo('panel');
		var values = $(target).combo('getValues');
		var item = panel.find('div.combobox-item[value="' + values.pop() + '"]');
		if (item.length){
			var prev = item.prev(':visible');
			if (prev.length){
				item = prev;
			}
		} else {
			item = panel.find('div.combobox-item:visible:last');
		}
		var value = item.attr('value');
		select(target, value);
//		setValues(target, [value]);
		scrollTo(target, value);
	}
	
	/**
	 * select next item
	 */
	function selectNext(target){
		var panel = $(target).combo('panel');
		var values = $(target).combo('getValues');
		var item = panel.find('div.combobox-item[value="' + values.pop() + '"]');
		if (item.length){
			var next = item.next(':visible');
			if (next.length){
				item = next;
			}
		} else {
			item = panel.find('div.combobox-item:visible:first');
		}
		var value = item.attr('value');
		select(target, value);
//		setValues(target, [value]);
		scrollTo(target, value);
	}
	
	/**
	 * select the specified value
	 */
	function select(target, value){
		var opts = $.data(target, 'combobox').options;
		var data = $.data(target, 'combobox').data;
		
		if (opts.multiple){
			var values = $(target).combo('getValues');
			for(var i=0; i<values.length; i++){
				if (values[i] == value) return;
			}
			values.push(value);
			setValues(target, values);
		} else {
			setValues(target, [value]);
		}
		
		for(var i=0; i<data.length; i++){
			if (data[i][opts.valueField] == value){
				opts.onSelect.call(target, data[i]);
				return;
			}
		}
	}
	
	/**
	 * unselect the specified value
	 */
	function unselect(target, value){
		var opts = $.data(target, 'combobox').options;
		var data = $.data(target, 'combobox').data;
		var values = $(target).combo('getValues');
		for(var i=0; i<values.length; i++){
			if (values[i] == value){
				values.splice(i, 1);
				setValues(target, values);
				break;
			}
		}
		for(var i=0; i<data.length; i++){
			if (data[i][opts.valueField] == value){
				opts.onUnselect.call(target, data[i]);
				return;
			}
		}
	}
	
	/**
	 * set values
	 */
	function setValues(target, values, remainText){
		var opts = $.data(target, 'combobox').options;
		var data = $.data(target, 'combobox').data;
		var panel = $(target).combo('panel');
		
		panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
		panel.find(':checkbox:checked').removeAttr('checked');
		var vv = [], ss = [];
		for(var i=0; i<values.length; i++){
			var v = values[i];
			var s = v;
			for(var j=0; j<data.length; j++){
				if (data[j][opts.valueField] == v){
					s = data[j][opts.textField];
					break;
				}
			}
			vv.push(v);
			ss.push(s);
			var item = panel.find('div.combobox-item[value="' + v + '"]');
			item.addClass('combobox-item-selected');
			opts.onAfterSelect.call(target, item);
		}
		
		$(target).combo('setValues', vv);
		if (!remainText){
			$(target).combo('setText', ss.join(opts.separator));
		}
	}
	
	function transformData(target){
		var opts = $.data(target, 'combobox').options;
		var data = [];
		$('>option', target).each(function(){
			var item = {};
			item[opts.valueField] = $(this).attr('value')!=undefined ? $(this).attr('value') : $(this).html();
			item[opts.textField] = $(this).html();
			item['selected'] = $(this).attr('selected');
			data.push(item);
		});
		return data;
	}
	
	/**
	 * load data, the old list items will be removed.
	 */
	function loadData(target, data, remainText){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combo('panel');
		
		$.data(target, 'combobox').data = data;
		
		var selected = $(target).combobox('getValues');
		panel.empty();	// clear old data
		panel.append(getGroup(target));//添加分组
		for(var i=0; i<data.length; i++){
			var v = data[i][opts.valueField];
			var s = data[i][opts.textField];
			var item = $('<div class="combobox-item"></div>').appendTo(panel);
			item.attr('value', v);
			if (opts.formatter){
				item.html(opts.formatter.call(target, data[i]));
			} else {
				item.html(s);
			}
			if (data[i]['selected']){
				(function(){
					for(var i=0; i<selected.length; i++){
						if (v == selected[i]) return;
					}
					selected.push(v);
				})();
			}
		}
		if (opts.multiple){
			setValues(target, selected, remainText);
		} else {
			if (selected.length){
				setValues(target, [selected[selected.length-1]], remainText);
			} else {
				setValues(target, [], remainText);
			}
		}
		
		opts.onLoadSuccess.call(target, data);
		
		$('.combobox-item', panel).hover(
			function(){$(this).addClass('combobox-item-hover');},
			function(){$(this).removeClass('combobox-item-hover');}
		).click(function(){
			var item = $(this);
			if (opts.multiple){
				if (item.hasClass('combobox-item-selected')){
					unselect(target, item.attr('value'));
					opts.onAfterUnselect.call(target, item);
				} else {
					select(target, item.attr('value'));
					opts.onAfterSelect.call(target, item);
				}
			} else {
				select(target, item.attr('value'));
				opts.onAfterSelect.call(target, item);
				$(target).combo('hidePanel');
			}
		});
	}
	
	//创建分组标签
	function getGroup(target){
		var state = $.data(target, 'combobox'), opts = state.options;
		if( !opts.groupDict ) return "";
		var html = "<div class='combobox-group oh'>";
		var list = Source.getData(opts.groupDict);
		$.each(list, function(i, item){
			html += "<a class='combobox-group-item l-btn' value='" + item.value + "'>" + item.text + "</a>";
		});
		html += "<a class='combobox-group-item l-btn' style='color:#666;'>清空</a>";
		html += "</div>";
		var $group = $(html);
		$(".combobox-group-item", $group).click(function(){
			var value = $(this).attr("value");
			var values = value ? value.split(",") : [];
			setValues(target, values);
			opts.onSelect.call(target, values);
		});
		return $group;
	}
	
	//初始化联级
	 function initSubSelect(target){
		var state = $.data(target, 'combobox'), opts = state.options;
		var $this = $(target);
		var $c = $this.parents("[page=true]");
		var subId = $this.attr("subId");
		var $sub = $("#" + subId, $c);
		$.extend(state.options, {"onSelect":function(){//选择
			$sub.combobox("clear");
			onSubSelect($this, $sub);
		},"onUnselect":function(){//取消选择
			$sub.combobox("clear");
			onSubSelect($this, $sub);
		}});
	};

	//初始化 复杂复选框
	function onSubSelect($parent, $sub){
		var values = $parent.combo("getValues");
		var subDict = $sub.attr("dict");
		var list = Source.getData(subDict);
		if( values.length ){
			var subList = [];
			$.each(list, function(i, item){
				if( values.contains(item.pid) ){
					subList.push(item);
				}
			});
			$sub.combobox("loadData", subList);
		}else{
			$sub.combobox("loadData", list);//全部加载
		}
	};
	/**
	 * request remote data if the url property is setted.
	 */
	function request(target, url, param, remainText){
		var opts = $.data(target, 'combobox').options;
		if (url){
			opts.url = url;
		}
//		if (!opts.url) return;
		param = param || {};
		
		if (opts.onBeforeLoad.call(target, param) == false) return;

		opts.loader.call(target, param, function(data){
			loadData(target, data, remainText);
		}, function(){
			opts.onLoadError.apply(this, arguments);
		});
	}
	
	/**
	 * do the query action
	 */
	function doQuery(target, q){
		var opts = $.data(target, 'combobox').options;
		
		if (opts.multiple && !q){
			setValues(target, [], true);
		} else {
			setValues(target, [q], true);
		}
		
		if (opts.mode == 'remote'){
			request(target, null, {q:q}, true);
		} else {
			var panel = $(target).combo('panel');
			panel.find('div.combobox-item').hide();
			var data = $.data(target, 'combobox').data;
			for(var i=0; i<data.length; i++){
				if (opts.filter.call(target, q, data[i])){
					var v = data[i][opts.valueField];
					var s = data[i][opts.textField];
					var item = panel.find('div.combobox-item[value="' + v + '"]');
					item.show();
					if (s == q){
						setValues(target, [v], true);
						item.addClass('combobox-item-selected');
					}
				}
			}
		}
	}
	
	/**
	 * create the component
	 */
	function create(target){
		var opts = $.data(target, 'combobox').options;
		$(target).addClass('combobox-f');
		$(target).combo($.extend({}, opts, {
			onShowPanel: function(){
				$(target).combo('panel').find('div.combobox-item').show();
				scrollTo(target, $(target).combobox('getValue'));
				opts.onShowPanel.call(target);
			}
		}));
	}
	
	$.fn.combobox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combobox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combobox');
			if (state){
				$.extend(state.options, options);
				create(this);
			} else {
				state = $.data(this, 'combobox', {
					options: $.extend({}, $.fn.combobox.defaults, $.fn.combobox.parseOptions(this), options)
				});
				create(this);
				loadData(this, transformData(this));
				initSubSelect(this);
			}
			if (state.options.data){
				var data = $.type(state.options.data) == "string" ? eval("(" + state.options.data + ")") : state.options.data;
				loadData(this, data);
			}
			if( state.options.dict ){
				var list = Source.getData(state.options.dict);
				loadData(this, list);
			}
			request(this);
		});
	};
	
	
	$.fn.combobox.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'combobox').options;
			opts.originalValue = jq.combo('options').originalValue;
			return opts;
		},
		getData: function(jq){
			return $.data(jq[0], 'combobox').data;
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).combo('clear');
				var panel = $(this).combo('panel');
				panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
				panel.find(':checkbox').removeAttr('checked');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combobox('options');
				if (opts.multiple){
					$(this).combobox('setValues', opts.originalValue);
				} else {
					$(this).combobox('setValue', opts.originalValue);
				}
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				request(this, url);
			});
		},
		select: function(jq, value){
			return jq.each(function(){
				select(this, value);
			});
		},
		unselect: function(jq, value){
			return jq.each(function(){
				unselect(this, value);
			});
		}
	};
	
	$.fn.combobox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target,[
			'valueField','textField','mode','method','url',"dict","groupDict"
		]));
	};
	
	$.fn.combobox.defaults = $.extend({}, $.fn.combo.defaults, {
		valueField: 'value',
		textField: 'text',
		mode: 'local',	// or 'remote'
		method: 'post',
		url: null,
		data: null,
		keyHandler: {
			up: function(){selectPrev(this);},
			down: function(){selectNext(this);},
			enter: function(){
				var values = $(this).combobox('getValues');
				$(this).combobox('setValues', values);
				$(this).combobox('hidePanel');
			},
			query: function(q){doQuery(this, q);}
		},
		filter: function(q, row){
			var opts = $(this).combobox('options');
			return row[opts.textField].indexOf(q) == 0;
		},
		formatter: function(row){
			var opts = $(this).combobox('options');
			return row[opts.textField];
		},
		loader: function(param, success, error){
			var opts = $(this).combobox('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onSelect: function(record){},
		onUnselect: function(record){},
		onAfterSelect:function(item){},
		onAfterUnselect:function(item){}
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function init(target) {
		var opts = $.data(target, "combotree").options;
		var $tree = $.data(target, "combotree").tree;
		$(target).addClass("combotree-f");
		$(target).combo(opts);
		var $panel = $(target).combo("panel");
		if (!$tree) {
			$tree = $("<ul></ul>").appendTo($panel);
			$.data(target, "combotree").tree = $tree;
		}
		$tree.tree($.extend({}, opts, {
			checkbox : opts.multiple,
			onLoadSuccess : function(_6, _7) {
				var _8 = $(target).combotree("getValues");
				if (opts.multiple) {
					var _9 = $tree.tree("getChecked");
					for ( var i = 0; i < _9.length; i++) {
						var id = _9[i].id;
						(function() {
							for ( var i = 0; i < _8.length; i++) {
								if (id == _8[i]) {
									return;
								}
							}
							_8.push(id);
						})();
					}
				}
				$(target).combotree("setValues", _8);
				if( $(target).attr("text") ){
					$(target).combotree("setText",$(target).attr("text"));
				}
				opts.onLoadSuccess.call(this, _6, _7);
				opts.onSelectNode.call(target, $tree.tree("getSelected"));
			},
			onClick : function(_a) {
				selectNode(target);
				$(target).combo("hidePanel");
				opts.onClick.call(this, _a);
			},
			onCheck : function(_b, _c) {
				selectNode(target);
				opts.onCheck.call(this, _b, _c);
			}
		}));
	}
	;
	function selectNode(target) {
		var opts = $.data(target, "combotree").options;
		var $tree = $.data(target, "combotree").tree;
		var vv = [], ss = [];
		if (opts.multiple) {
			var _11 = $tree.tree("getChecked");
			for ( var i = 0; i < _11.length; i++) {
				vv.push(_11[i].id);
				ss.push( (_11.attributes && _11.attributes.text) ? _11.attributes.text : _11.text );
			}
		} else {
			var _12 = $tree.tree("getSelected");
			if (_12) {
				vv.push(_12.id);
				ss.push( (_12.attributes && _12.attributes.text) ? _12.attributes.text : _12.text );
			}
		}
		$(target).combo("setValues", vv).combo("setText", ss.join(opts.separator));
		opts.onSelectNode.call(target, $tree.tree("getSelected"));
	}
	;
	function setComboValue(_14, _15) {
		var _16 = $.data(_14, "combotree").options;
		var _17 = $.data(_14, "combotree").tree;
		_17.find("span.tree-checkbox").addClass("tree-checkbox0").removeClass("tree-checkbox1 tree-checkbox2");
		var vv = [], ss = [];
		for ( var i = 0; i < _15.length; i++) {
			var v = _15[i];
			var s = v;
			var _18 = _17.tree("find", v);
			if (_18) {
				s = (_18.attributes && _18.attributes.text) ? _18.attributes.text : _18.text;
				_17.tree("check", _18.target);
				_17.tree("select", _18.target);
			}
			vv.push(v);
			ss.push(s);
		}
		$(_14).combo("setValues", vv).combo("setText", ss.join(_16.separator));
	}
	;
	$.fn.combotree = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.combotree.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "combotree");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "combotree", {
					options : $.extend({}, $.fn.combotree.defaults, $.fn.combotree.parseOptions(this), options)
				});
			}
			init(this);
		});
	};
	$.fn.combotree.methods = {
		options : function(jq) {
			var opts = $.data(jq[0], "combotree").options;
			opts.originalValue = jq.combo("options").originalValue;
			return opts;
		},
		tree : function(jq) {
			return $.data(jq[0], "combotree").tree;
		},
		loadData : function(jq, _1e) {
			return jq.each(function() {
				var _1f = $.data(this, "combotree").options;
				_1f.data = _1e;
				var _20 = $.data(this, "combotree").tree;
				_20.tree("loadData", _1e);
			});
		},
		reload : function(jq, url) {
			return jq.each(function() {
				var _21 = $.data(this, "combotree").options;
				var _22 = $.data(this, "combotree").tree;
				if (url) {
					_21.url = url;
				}
				_22.tree({
					url : _21.url
				});
			});
		},
		setValues : function(jq, values) {
			return jq.each(function() {
				setComboValue(this, values);
			});
		},
		setValue : function(jq, value) {
			return jq.each(function() {
				setComboValue(this, [ value ]);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				var $tree = $.data(this, "combotree").tree;
				$tree.find("div.tree-node-selected").removeClass("tree-node-selected");
				var cc = $tree.tree("getChecked");
				for ( var i = 0; i < cc.length; i++) {
					$tree.tree("uncheck", cc[i].target);
				}
				$(this).combo("clear");
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var opts = $(this).combotree("options");
				if (opts.multiple) {
					$(this).combotree("setValues", opts.originalValue);
				} else {
					$(this).combotree("setValue", opts.originalValue);
				}
			});
		}
	};
	$.fn.combotree.parseOptions = function(target) {
		return $.extend({}, $.fn.combo.parseOptions(target), $.fn.tree.parseOptions(target));
	};
	$.fn.combotree.defaults = $.extend({}, $.fn.combo.defaults, $.fn.tree.defaults, {
		editable : false,
		onSelectNode:function(){}
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		$(_2).hide();
		var _3 = $("<span class=\"searchbox\"></span>").insertAfter(_2);
		var _4 = $("<input type=\"text\" class=\"searchbox-text\">").appendTo(_3);
		$("<span><span class=\"searchbox-button\"></span></span>").appendTo(_3);
		var _5 = $(_2).attr("name");
		if (_5) {
			_4.attr("name", _5);
			$(_2).removeAttr("name").attr("searchboxName", _5);
		}
		return _3;
	}
	;
	function _6(_7, _8) {
		var _9 = $.data(_7, "searchbox").options;
		var sb = $.data(_7, "searchbox").searchbox;
		if (_8) {
			_9.width = _8;
		}
		sb.appendTo("body");
		if (isNaN(_9.width)) {
			_9.width = sb._outerWidth();
		}
		var _a = sb.find("span.searchbox-button");
		var _b = sb.find("a.searchbox-menu");
		var _c = sb.find("input.searchbox-text");
		sb._outerWidth(_9.width)._outerHeight(_9.height);
		_c._outerWidth(sb.width() - _b._outerWidth() - _a._outerWidth());
		_c.css({
			height : sb.height() + "px",
			lineHeight : sb.height() + "px"
		});
		_b._outerHeight(sb.height());
		_a._outerHeight(sb.height());
		var _d = _b.find("span.l-btn-left");
		_d._outerHeight(sb.height());
		_d.find("span.l-btn-text,span.m-btn-downarrow").css({
			height : _d.height() + "px",
			lineHeight : _d.height() + "px"
		});
		sb.insertAfter(_7);
	}
	;
	function _e(_f) {
		var _10 = $.data(_f, "searchbox");
		var _11 = _10.options;
		if (_11.menu) {
			_10.menu = $(_11.menu).menu({
				onClick : function(_12) {
					_13(_12);
				}
			});
			var _14 = _10.menu.children("div.menu-item:first");
			_10.menu.children("div.menu-item").each(function() {
				var _15 = $.extend({}, $.parser.parseOptions(this), {
					selected : ($(this).attr("selected") ? true : undefined)
				});
				if (_15.selected) {
					_14 = $(this);
					return false;
				}
			});
			_14.triggerHandler("click");
		} else {
			_10.searchbox.find("a.searchbox-menu").remove();
			_10.menu = null;
		}
		function _13(_16) {
			_10.searchbox.find("a.searchbox-menu").remove();
			var mb = $("<a class=\"searchbox-menu\" href=\"javascript:void(0)\"></a>").html(_16.text);
			mb.prependTo(_10.searchbox).menubutton({
				menu : _10.menu,
				iconCls : _16.iconCls
			});
			_10.searchbox.find("input.searchbox-text").attr("name", $(_16.target).attr("name") || _16.text);
			_6(_f);
		}
		;
	}
	;
	function _17(_18) {
		var _19 = $.data(_18, "searchbox");
		var _1a = _19.options;
		var _1b = _19.searchbox.find("input.searchbox-text");
		var _1c = _19.searchbox.find(".searchbox-button");
		_1b.unbind(".searchbox").bind("blur.searchbox", function(e) {
			_1a.value = $(this).val();
			if (_1a.value == "") {
				$(this).val(_1a.prompt);
				$(this).addClass("searchbox-prompt");
			} else {
				$(this).removeClass("searchbox-prompt");
			}
		}).bind("focus.searchbox", function(e) {
			if ($(this).val() != _1a.value) {
				$(this).val(_1a.value);
			}
			$(this).removeClass("searchbox-prompt");
		}).bind("keydown.searchbox", function(e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				var _1d = $.fn.prop ? _1b.prop("name") : _1b.attr("name");
				_1a.value = $(this).val();
				_1a.searcher.call(_18, _1a.value, _1d);
				return false;
			}
		});
		_1c.unbind(".searchbox").bind("click.searchbox", function() {
			var _1e = $.fn.prop ? _1b.prop("name") : _1b.attr("name");
			_1a.searcher.call(_18, _1a.value, _1e);
		}).bind("mouseenter.searchbox", function() {
			$(this).addClass("searchbox-button-hover");
		}).bind("mouseleave.searchbox", function() {
			$(this).removeClass("searchbox-button-hover");
		});
	}
	;
	function _1f(_20) {
		var _21 = $.data(_20, "searchbox");
		var _22 = _21.options;
		var _23 = _21.searchbox.find("input.searchbox-text");
		if (_22.value == "") {
			_23.val(_22.prompt);
			_23.addClass("searchbox-prompt");
		} else {
			_23.val(_22.value);
			_23.removeClass("searchbox-prompt");
		}
	}
	;
	$.fn.searchbox = function(_24, _25) {
		if (typeof _24 == "string") {
			return $.fn.searchbox.methods[_24](this, _25);
		}
		_24 = _24 || {};
		return this.each(function() {
			var _26 = $.data(this, "searchbox");
			if (_26) {
				$.extend(_26.options, _24);
			} else {
				_26 = $.data(this, "searchbox", {
					options : $.extend({}, $.fn.searchbox.defaults, $.fn.searchbox.parseOptions(this), _24),
					searchbox : _1(this)
				});
			}
			_e(this);
			_1f(this);
			_17(this);
			_6(this);
		});
	};
	$.fn.searchbox.methods = {
		options : function(jq) {
			return $.data(jq[0], "searchbox").options;
		},
		menu : function(jq) {
			return $.data(jq[0], "searchbox").menu;
		},
		textbox : function(jq) {
			return $.data(jq[0], "searchbox").searchbox.find("input.searchbox-text");
		},
		getValue : function(jq) {
			return $.data(jq[0], "searchbox").options.value;
		},
		setValue : function(jq, _27) {
			return jq.each(function() {
				$(this).searchbox("options").value = _27;
				$(this).searchbox("textbox").val(_27);
				$(this).searchbox("textbox").blur();
			});
		},
		getName : function(jq) {
			return $.data(jq[0], "searchbox").searchbox.find("input.searchbox-text").attr("name");
		},
		selectName : function(jq, _28) {
			return jq.each(function() {
				var _29 = $.data(this, "searchbox").menu;
				if (_29) {
					_29.children("div.menu-item[name=\"" + _28 + "\"]").triggerHandler("click");
				}
			});
		},
		destroy : function(jq) {
			return jq.each(function() {
				var _2a = $(this).searchbox("menu");
				if (_2a) {
					_2a.menu("destroy");
				}
				$.data(this, "searchbox").searchbox.remove();
				$(this).remove();
			});
		},
		resize : function(jq, _2b) {
			return jq.each(function() {
				_6(this, _2b);
			});
		}
	};
	$.fn.searchbox.parseOptions = function(_2c) {
		var t = $(_2c);
		return $.extend({}, $.parser.parseOptions(_2c, [ "width", "height", "prompt", "menu" ]), {
			value : t.val(),
			searcher : (t.attr("searcher") ? eval(t.attr("searcher")) : undefined)
		});
	};
	$.fn.searchbox.defaults = {
		width : "auto",
		height : 22,
		prompt : "",
		value : "",
		menu : null,
		searcher : function(_2d, _2e) {
		}
	};
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		$(_2).addClass("numberbox-f");
		var v = $("<input type=\"hidden\">").insertAfter(_2);
		var _3 = $(_2).attr("name");
		if (_3) {
			v.attr("name", _3);
			$(_2).removeAttr("name").attr("numberboxName", _3);
		}
		return v;
	}
	;
	function _4(_5) {
		var _6 = $.data(_5, "numberbox").options;
		var fn = _6.onChange;
		_6.onChange = function() {
		};
		_7(_5, _6.parser.call(_5, _6.value));
		_6.onChange = fn;
		_6.originalValue = _8(_5);
	}
	;
	function _8(_9) {
		return $.data(_9, "numberbox").field.val();
	}
	;
	function _7(_a, _b) {
		var _c = $.data(_a, "numberbox");
		var _d = _c.options;
		var _e = _8(_a);
		_b = _d.parser.call(_a, _b);
		_d.value = _b;
		_c.field.val(_b);
		$(_a).val(_d.formatter.call(_a, _b));
		if (_e != _b) {
			_d.onChange.call(_a, _b, _e);
		}
	}
	;
	function _f(_10) {
		var _11 = $.data(_10, "numberbox").options;
		$(_10).unbind(".numberbox").bind("keypress.numberbox", function(e) {
			if (e.which == 45) {
				if ($(this).val().indexOf("-") == -1) {
					return true;
				} else {
					return false;
				}
			}
			if (e.which == 46) {
				if ($(this).val().indexOf(".") == -1) {
					return true;
				} else {
					return false;
				}
			} else {
				if ((e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false) || e.which == 0 || e.which == 8) {
					return true;
				} else {
					if (e.ctrlKey == true && (e.which == 99 || e.which == 118)) {
						return true;
					} else {
						return false;
					}
				}
			}
		}).bind("blur.numberbox", function() {
			_7(_10, $(this).val());
			$(this).val(_11.formatter.call(_10, _8(_10)));
		}).bind("focus.numberbox", function() {
			var vv = _8(_10);
			if ($(this).val() != vv) {
				$(this).val(vv);
			}
		});
	}
	;
	function _12(_13) {
		if ($.fn.validatebox) {
			var _14 = $.data(_13, "numberbox").options;
			$(_13).validatebox(_14);
		}
	}
	;
	function _15(_16, _17) {
		var _18 = $.data(_16, "numberbox").options;
		if (_17) {
			_18.disabled = true;
			$(_16).attr("disabled", true);
		} else {
			_18.disabled = false;
			$(_16).removeAttr("disabled");
		}
	}
	;
	$.fn.numberbox = function(_19, _1a) {
		if (typeof _19 == "string") {
			var _1b = $.fn.numberbox.methods[_19];
			if (_1b) {
				return _1b(this, _1a);
			} else {
				return this.validatebox(_19, _1a);
			}
		}
		_19 = _19 || {};
		return this.each(function() {
			var _1c = $.data(this, "numberbox");
			if (_1c) {
				$.extend(_1c.options, _19);
			} else {
				_1c = $.data(this, "numberbox", {
					options : $.extend({}, $.fn.numberbox.defaults, $.fn.numberbox.parseOptions(this), _19),
					field : _1(this)
				});
				$(this).removeAttr("disabled");
				$(this).css({
					imeMode : "disabled"
				});
			}
			_15(this, _1c.options.disabled);
			_f(this);
			_12(this);
			_4(this);
		});
	};
	$.fn.numberbox.methods = {
		options : function(jq) {
			return $.data(jq[0], "numberbox").options;
		},
		destroy : function(jq) {
			return jq.each(function() {
				$.data(this, "numberbox").field.remove();
				$(this).validatebox("destroy");
				$(this).remove();
			});
		},
		disable : function(jq) {
			return jq.each(function() {
				_15(this, true);
			});
		},
		enable : function(jq) {
			return jq.each(function() {
				_15(this, false);
			});
		},
		fix : function(jq) {
			return jq.each(function() {
				_7(this, $(this).val());
			});
		},
		setValue : function(jq, _1d) {
			return jq.each(function() {
				_7(this, _1d);
			});
		},
		getValue : function(jq) {
			return _8(jq[0]);
		},
		clear : function(jq) {
			return jq.each(function() {
				var _1e = $.data(this, "numberbox");
				_1e.field.val("");
				$(this).val("");
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _1f = $(this).numberbox("options");
				$(this).numberbox("setValue", _1f.originalValue);
			});
		}
	};
	$.fn.numberbox.parseOptions = function(_20) {
		var t = $(_20);
		return $.extend({}, $.fn.validatebox.parseOptions(_20), $.parser.parseOptions(_20, [ "decimalSeparator", "groupSeparator", "suffix", {
			min : "number",
			max : "number",
			precision : "number"
		} ]), {
			prefix : (t.attr("prefix") ? t.attr("prefix") : undefined),
			disabled : (t.attr("disabled") ? true : undefined),
			value : (t.val() || undefined)
		});
	};
	$.fn.numberbox.defaults = $.extend({}, $.fn.validatebox.defaults, {
		disabled : false,
		value : "",
		min : null,
		max : null,
		precision : 0,
		decimalSeparator : ".",
		groupSeparator : "",
		prefix : "",
		suffix : "",
		formatter : function(_21) {
			if (!_21) {
				return _21;
			}
			_21 = _21 + "";
			var _22 = $(this).numberbox("options");
			var s1 = _21, s2 = "";
			var _23 = _21.indexOf(".");
			if (_23 >= 0) {
				s1 = _21.substring(0, _23);
				s2 = _21.substring(_23 + 1, _21.length);
			}
			if (_22.groupSeparator) {
				var p = /(\d+)(\d{3})/;
				while (p.test(s1)) {
					s1 = s1.replace(p, "$1" + _22.groupSeparator + "$2");
				}
			}
			if (s2) {
				return _22.prefix + s1 + _22.decimalSeparator + s2 + _22.suffix;
			} else {
				return _22.prefix + s1 + _22.suffix;
			}
		},
		parser : function(s) {
			s = s + "";
			var _24 = $(this).numberbox("options");
			if (_24.groupSeparator) {
				s = s.replace(new RegExp("\\" + _24.groupSeparator, "g"), "");
			}
			if (_24.decimalSeparator) {
				s = s.replace(new RegExp("\\" + _24.decimalSeparator, "g"), ".");
			}
			if (_24.prefix) {
				s = s.replace(new RegExp("\\" + $.trim(_24.prefix), "g"), "");
			}
			if (_24.suffix) {
				s = s.replace(new RegExp("\\" + $.trim(_24.suffix), "g"), "");
			}
			s = s.replace(/\s/g, "");
			var val = parseFloat(s).toFixed(_24.precision);
			if (isNaN(val)) {
				val = "";
			} else {
				if (typeof (_24.min) == "number" && val < _24.min) {
					val = _24.min.toFixed(_24.precision);
				} else {
					if (typeof (_24.max) == "number" && val > _24.max) {
						val = _24.max.toFixed(_24.precision);
					}
				}
			}
			return val;
		},
		onChange : function(_25, _26) {
		}
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $(
				"<span class=\"spinner\">" + "<span class=\"spinner-arrow\">" + "<span class=\"spinner-arrow-up\"></span>"
						+ "<span class=\"spinner-arrow-down\"></span>" + "</span>" + "</span>").insertAfter(_2);
		$(_2).addClass("spinner-text spinner-f").prependTo(_3);
		return _3;
	}
	;
	function _4(_5, _6) {
		var _7 = $.data(_5, "spinner").options;
		var _8 = $.data(_5, "spinner").spinner;
		if (_6) {
			_7.width = _6;
		}
		var _9 = $("<div style=\"display:none\"></div>").insertBefore(_8);
		_8.appendTo("body");
		if (isNaN(_7.width)) {
			_7.width = $(_5).outerWidth();
		}
		var _a = _8.find(".spinner-arrow");
		_8._outerWidth(_7.width)._outerHeight(_7.height);
		$(_5)._outerWidth(_8.width() - _a.outerWidth());
		$(_5).css({
			height : _8.height() + "px",
			lineHeight : _8.height() + "px"
		});
		_a._outerHeight(_8.height());
		_a.find("span")._outerHeight(_a.height() / 2);
		_8.insertAfter(_9);
		_9.remove();
	}
	;
	function _b(_c) {
		var _d = $.data(_c, "spinner").options;
		var _e = $.data(_c, "spinner").spinner;
		_e.find(".spinner-arrow-up,.spinner-arrow-down").unbind(".spinner");
		if (!_d.disabled) {
			_e.find(".spinner-arrow-up").bind("mouseenter.spinner", function() {
				$(this).addClass("spinner-arrow-hover");
			}).bind("mouseleave.spinner", function() {
				$(this).removeClass("spinner-arrow-hover");
			}).bind("click.spinner", function() {
				_d.spin.call(_c, false);
				_d.onSpinUp.call(_c);
				$(_c).validatebox("validate");
			});
			_e.find(".spinner-arrow-down").bind("mouseenter.spinner", function() {
				$(this).addClass("spinner-arrow-hover");
			}).bind("mouseleave.spinner", function() {
				$(this).removeClass("spinner-arrow-hover");
			}).bind("click.spinner", function() {
				_d.spin.call(_c, true);
				_d.onSpinDown.call(_c);
				$(_c).validatebox("validate");
			});
		}
	}
	;
	function _f(_10, _11) {
		var _12 = $.data(_10, "spinner").options;
		if (_11) {
			_12.disabled = true;
			$(_10).attr("disabled", true);
		} else {
			_12.disabled = false;
			$(_10).removeAttr("disabled");
		}
	}
	;
	$.fn.spinner = function(_13, _14) {
		if (typeof _13 == "string") {
			var _15 = $.fn.spinner.methods[_13];
			if (_15) {
				return _15(this, _14);
			} else {
				return this.validatebox(_13, _14);
			}
		}
		_13 = _13 || {};
		return this.each(function() {
			var _16 = $.data(this, "spinner");
			if (_16) {
				$.extend(_16.options, _13);
			} else {
				_16 = $.data(this, "spinner", {
					options : $.extend({}, $.fn.spinner.defaults, $.fn.spinner.parseOptions(this), _13),
					spinner : _1(this)
				});
				$(this).removeAttr("disabled");
			}
			_16.options.originalValue = _16.options.value;
			$(this).val(_16.options.value);
			$(this).attr("readonly", !_16.options.editable);
			_f(this, _16.options.disabled);
			_4(this);
			$(this).validatebox(_16.options);
			_b(this);
		});
	};
	$.fn.spinner.methods = {
		options : function(jq) {
			var _17 = $.data(jq[0], "spinner").options;
			return $.extend(_17, {
				value : jq.val()
			});
		},
		destroy : function(jq) {
			return jq.each(function() {
				var _18 = $.data(this, "spinner").spinner;
				$(this).validatebox("destroy");
				_18.remove();
			});
		},
		resize : function(jq, _19) {
			return jq.each(function() {
				_4(this, _19);
			});
		},
		enable : function(jq) {
			return jq.each(function() {
				_f(this, false);
				_b(this);
			});
		},
		disable : function(jq) {
			return jq.each(function() {
				_f(this, true);
				_b(this);
			});
		},
		getValue : function(jq) {
			return jq.val();
		},
		setValue : function(jq, _1a) {
			return jq.each(function() {
				var _1b = $.data(this, "spinner").options;
				_1b.value = _1a;
				$(this).val(_1a);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				var _1c = $.data(this, "spinner").options;
				_1c.value = "";
				$(this).val("");
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _1d = $(this).spinner("options");
				$(this).spinner("setValue", _1d.originalValue);
			});
		}
	};
	$.fn.spinner.parseOptions = function(_1e) {
		var t = $(_1e);
		return $.extend({}, $.fn.validatebox.parseOptions(_1e), $.parser.parseOptions(_1e, [ "width", "height", "min", "max", {
			increment : "number",
			editable : "boolean"
		} ]), {
			value : (t.val() || undefined),
			disabled : (t.attr("disabled") ? true : undefined)
		});
	};
	$.fn.spinner.defaults = $.extend({}, $.fn.validatebox.defaults, {
		width : "auto",
		height : 22,
		value : "",
		min : null,
		max : null,
		increment : 1,
		editable : true,
		disabled : false,
		spin : function(_1f) {
		},
		onSpinUp : function() {
		},
		onSpinDown : function() {
		}
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		$(_2).addClass("numberspinner-f");
		var _3 = $.data(_2, "numberspinner").options;
		$(_2).spinner(_3).numberbox(_3);
	}
	;
	function _4(_5, _6) {
		var _7 = $.data(_5, "numberspinner").options;
		var v = parseFloat($(_5).numberbox("getValue") || _7.value) || 0;
		if (_6 == true) {
			v -= _7.increment;
		} else {
			v += _7.increment;
		}
		$(_5).numberbox("setValue", v);
	}
	;
	$.fn.numberspinner = function(_8, _9) {
		if (typeof _8 == "string") {
			var _a = $.fn.numberspinner.methods[_8];
			if (_a) {
				return _a(this, _9);
			} else {
				return this.spinner(_8, _9);
			}
		}
		_8 = _8 || {};
		return this.each(function() {
			var _b = $.data(this, "numberspinner");
			if (_b) {
				$.extend(_b.options, _8);
			} else {
				$.data(this, "numberspinner", {
					options : $.extend({}, $.fn.numberspinner.defaults, $.fn.numberspinner.parseOptions(this), _8)
				});
			}
			_1(this);
		});
	};
	$.fn.numberspinner.methods = {
		options : function(jq) {
			var _c = $.data(jq[0], "numberspinner").options;
			return $.extend(_c, {
				value : jq.numberbox("getValue"),
				originalValue : jq.numberbox("options").originalValue
			});
		},
		setValue : function(jq, _d) {
			return jq.each(function() {
				$(this).numberbox("setValue", _d);
			});
		},
		getValue : function(jq) {
			return jq.numberbox("getValue");
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).spinner("clear");
				$(this).numberbox("clear");
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _e = $(this).numberspinner("options");
				$(this).numberspinner("setValue", _e.originalValue);
			});
		}
	};
	$.fn.numberspinner.parseOptions = function(_f) {
		return $.extend({}, $.fn.spinner.parseOptions(_f), $.fn.numberbox.parseOptions(_f), {});
	};
	$.fn.numberspinner.defaults = $.extend({}, $.fn.spinner.defaults, $.fn.numberbox.defaults, {
		spin : function(_10) {
			_4(this, _10);
		}
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "timespinner").options;
		$(_2).addClass("timespinner-f");
		$(_2).spinner(_3);
		$(_2).unbind(".timespinner");
		$(_2).bind("click.timespinner", function() {
			var _4 = 0;
			if (this.selectionStart != null) {
				_4 = this.selectionStart;
			} else {
				if (this.createTextRange) {
					var _5 = _2.createTextRange();
					var s = document.selection.createRange();
					s.setEndPoint("StartToStart", _5);
					_4 = s.text.length;
				}
			}
			if (_4 >= 0 && _4 <= 2) {
				_3.highlight = 0;
			} else {
				if (_4 >= 3 && _4 <= 5) {
					_3.highlight = 1;
				} else {
					if (_4 >= 6 && _4 <= 8) {
						_3.highlight = 2;
					}
				}
			}
			_7(_2);
		}).bind("blur.timespinner", function() {
			_6(_2);
		});
	}
	;
	function _7(_8) {
		var _9 = $.data(_8, "timespinner").options;
		var _a = 0, _b = 0;
		if (_9.highlight == 0) {
			_a = 0;
			_b = 2;
		} else {
			if (_9.highlight == 1) {
				_a = 3;
				_b = 5;
			} else {
				if (_9.highlight == 2) {
					_a = 6;
					_b = 8;
				}
			}
		}
		if (_8.selectionStart != null) {
			_8.setSelectionRange(_a, _b);
		} else {
			if (_8.createTextRange) {
				var _c = _8.createTextRange();
				_c.collapse();
				_c.moveEnd("character", _b);
				_c.moveStart("character", _a);
				_c.select();
			}
		}
		$(_8).focus();
	}
	;
	function _d(_e, _f) {
		var _10 = $.data(_e, "timespinner").options;
		if (!_f) {
			return null;
		}
		var vv = _f.split(_10.separator);
		for ( var i = 0; i < vv.length; i++) {
			if (isNaN(vv[i])) {
				return null;
			}
		}
		while (vv.length < 3) {
			vv.push(0);
		}
		return new Date(1900, 0, 0, vv[0], vv[1], vv[2]);
	}
	;
	function _6(_11) {
		var _12 = $.data(_11, "timespinner").options;
		var _13 = $(_11).val();
		var _14 = _d(_11, _13);
		if (!_14) {
			_14 = _d(_11, _12.value);
		}
		if (!_14) {
			_12.value = "";
			$(_11).val("");
			return;
		}
		var _15 = _d(_11, _12.min);
		var _16 = _d(_11, _12.max);
		if (_15 && _15 > _14) {
			_14 = _15;
		}
		if (_16 && _16 < _14) {
			_14 = _16;
		}
		var tt = [ _17(_14.getHours()), _17(_14.getMinutes()) ];
		if (_12.showSeconds) {
			tt.push(_17(_14.getSeconds()));
		}
		var val = tt.join(_12.separator);
		_12.value = val;
		$(_11).val(val);
		function _17(_18) {
			return (_18 < 10 ? "0" : "") + _18;
		}
		;
	}
	;
	function _19(_1a, _1b) {
		var _1c = $.data(_1a, "timespinner").options;
		var val = $(_1a).val();
		if (val == "") {
			val = [ 0, 0, 0 ].join(_1c.separator);
		}
		var vv = val.split(_1c.separator);
		for ( var i = 0; i < vv.length; i++) {
			vv[i] = parseInt(vv[i], 10);
		}
		if (_1b == true) {
			vv[_1c.highlight] -= _1c.increment;
		} else {
			vv[_1c.highlight] += _1c.increment;
		}
		$(_1a).val(vv.join(_1c.separator));
		_6(_1a);
		_7(_1a);
	}
	;
	$.fn.timespinner = function(_1d, _1e) {
		if (typeof _1d == "string") {
			var _1f = $.fn.timespinner.methods[_1d];
			if (_1f) {
				return _1f(this, _1e);
			} else {
				return this.spinner(_1d, _1e);
			}
		}
		_1d = _1d || {};
		return this.each(function() {
			var _20 = $.data(this, "timespinner");
			if (_20) {
				$.extend(_20.options, _1d);
			} else {
				$.data(this, "timespinner", {
					options : $.extend({}, $.fn.timespinner.defaults, $.fn.timespinner.parseOptions(this), _1d)
				});
				_1(this);
			}
		});
	};
	$.fn.timespinner.methods = {
		options : function(jq) {
			var _21 = $.data(jq[0], "timespinner").options;
			return $.extend(_21, {
				value : jq.val(),
				originalValue : jq.spinner("options").originalValue
			});
		},
		setValue : function(jq, _22) {
			return jq.each(function() {
				$(this).val(_22);
				_6(this);
			});
		},
		getHours : function(jq) {
			var _23 = $.data(jq[0], "timespinner").options;
			var vv = jq.val().split(_23.separator);
			return parseInt(vv[0], 10);
		},
		getMinutes : function(jq) {
			var _24 = $.data(jq[0], "timespinner").options;
			var vv = jq.val().split(_24.separator);
			return parseInt(vv[1], 10);
		},
		getSeconds : function(jq) {
			var _25 = $.data(jq[0], "timespinner").options;
			var vv = jq.val().split(_25.separator);
			return parseInt(vv[2], 10) || 0;
		}
	};
	$.fn.timespinner.parseOptions = function(_26) {
		return $.extend({}, $.fn.spinner.parseOptions(_26), $.parser.parseOptions(_26, [ "separator", {
			showSeconds : "boolean",
			highlight : "number"
		} ]));
	};
	$.fn.timespinner.defaults = $.extend({}, $.fn.spinner.defaults, {
		separator : ":",
		showSeconds : false,
		highlight : 0,
		spin : function(_27) {
			_19(this, _27);
		}
	});
})(jQuery);

/**
 * calendar - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($){
	
	function setSize(target){
		var opts = $.data(target, 'calendar').options;
		var t = $(target);
		if (opts.fit == true){
			var p = t.parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		var header = t.find('.calendar-header');
		t._outerWidth(opts.width);
		t._outerHeight(opts.height);
		t.find('.calendar-body')._outerHeight(t.height() - header._outerHeight());
	}
	
	function init(target){
		$(target).addClass('calendar').wrapInner(
				'<div class="calendar-header">' +
					'<div class="calendar-prevmonth"></div>' +
					'<div class="calendar-nextmonth"></div>' +
					'<div class="calendar-prevyear"></div>' +
					'<div class="calendar-nextyear"></div>' +
					'<div class="calendar-title">' +
						'<span>Aprial 2010</span>' +
					'</div>' +
				'</div>' +
				'<div class="calendar-body">' +
					'<div class="calendar-menu">' +
						'<div class="calendar-menu-year-inner">' +
							'<span class="calendar-menu-prev"></span>' +
							'<span><input class="calendar-menu-year" type="text"></input></span>' +
							'<span class="calendar-menu-next"></span>' +
						'</div>' +
						'<div class="calendar-menu-month-inner">' +
						'</div>' +
					'</div>' +
				'</div>'
		);
		
		$(target).find('.calendar-title span').hover(
			function(){$(this).addClass('calendar-menu-hover');},
			function(){$(this).removeClass('calendar-menu-hover');}
		).click(function(){
			var menu = $(target).find('.calendar-menu');
			if (menu.is(':visible')){
				menu.hide();
			} else {
				showSelectMenus(target);
			}
		});
		
		$('.calendar-prevmonth,.calendar-nextmonth,.calendar-prevyear,.calendar-nextyear', target).hover(
			function(){$(this).addClass('calendar-nav-hover');},
			function(){$(this).removeClass('calendar-nav-hover');}
		);
		$(target).find('.calendar-nextmonth').click(function(){
			showMonth(target, 1);
		});
		$(target).find('.calendar-prevmonth').click(function(){
			showMonth(target, -1);
		});
		$(target).find('.calendar-nextyear').click(function(){
			showYear(target, 1);
		});
		$(target).find('.calendar-prevyear').click(function(){
			showYear(target, -1);
		});
		
		$(target).bind('_resize', function(){
			var opts = $.data(target, 'calendar').options;
			if (opts.fit == true){
				setSize(target);
			}
			return false;
		});
	}
	
	/**
	 * show the calendar corresponding to the current month.
	 */
	function showMonth(target, delta){
		var opts = $.data(target, 'calendar').options;
		opts.month += delta;
		if (opts.month > 12){
			opts.year++;
			opts.month = 1;
		} else if (opts.month < 1){
			opts.year--;
			opts.month = 12;
		}
		show(target);
		
		var menu = $(target).find('.calendar-menu-month-inner');
		menu.find('td.calendar-selected').removeClass('calendar-selected');
		menu.find('td:eq(' + (opts.month-1) + ')').addClass('calendar-selected');
	}
	
	/**
	 * show the calendar corresponding to the current year.
	 */
	function showYear(target, delta){
		var opts = $.data(target, 'calendar').options;
		opts.year += delta;
		show(target);
		
		var menu = $(target).find('.calendar-menu-year');
		menu.val(opts.year);
	}
	
	/**
	 * show the select menu that can change year or month, if the menu is not be created then create it.
	 */
	function showSelectMenus(target){
		var opts = $.data(target, 'calendar').options;
		$(target).find('.calendar-menu').show();
		
		if ($(target).find('.calendar-menu-month-inner').is(':empty')){
			$(target).find('.calendar-menu-month-inner').empty();
			var t = $('<table></table>').appendTo($(target).find('.calendar-menu-month-inner'));
			var idx = 0;
			for(var i=0; i<3; i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<4; j++){
					$('<td class="calendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr',idx).appendTo(tr);
				}
			}
			
			$(target).find('.calendar-menu-prev,.calendar-menu-next').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			);
			$(target).find('.calendar-menu-next').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val()) + 1);
				}
			});
			$(target).find('.calendar-menu-prev').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val() - 1));
				}
			});
			
			$(target).find('.calendar-menu-year').keypress(function(e){
				if (e.keyCode == 13){
					setDate();
				}
			});
			
			$(target).find('.calendar-menu-month').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			).click(function(){
				var menu = $(target).find('.calendar-menu');
				menu.find('.calendar-selected').removeClass('calendar-selected');
				$(this).addClass('calendar-selected');
				setDate();
			});
		}
		
		function setDate(){
			var menu = $(target).find('.calendar-menu');
			var year = menu.find('.calendar-menu-year').val();
			var month = menu.find('.calendar-selected').attr('abbr');
			if (!isNaN(year)){
				opts.year = parseInt(year);
				opts.month = parseInt(month);
				show(target);
			}
			menu.hide();
		}
		
		var body = $(target).find('.calendar-body');
		var sele = $(target).find('.calendar-menu');
		var seleYear = sele.find('.calendar-menu-year-inner');
		var seleMonth = sele.find('.calendar-menu-month-inner');
		
		seleYear.find('input').val(opts.year).focus();
		seleMonth.find('td.calendar-selected').removeClass('calendar-selected');
		seleMonth.find('td:eq('+(opts.month-1)+')').addClass('calendar-selected');
		
		sele._outerWidth(body._outerWidth());
		sele._outerHeight(body._outerHeight());
		seleMonth._outerHeight(sele.height() - seleYear._outerHeight());
	}
	
	/**
	 * get weeks data.
	 */
	function getWeeks(target, year, month){
		var opts = $.data(target, 'calendar').options;
		var dates = [];
		var lastDay = new Date(year, month, 0).getDate();
		for(var i=1; i<=lastDay; i++) dates.push([year,month,i]);
		
		// group date by week
		var weeks = [], week = [];
//		var memoDay = 0;
		var memoDay = -1;
		while(dates.length > 0){
			var date = dates.shift();
			week.push(date);
			var day = new Date(date[0],date[1]-1,date[2]).getDay();
			if (memoDay == day){
				day = 0;
			} else if (day == (opts.firstDay==0 ? 7 : opts.firstDay) - 1){
				weeks.push(week);
				week = [];
			}
			memoDay = day;
		}
		if (week.length){
			weeks.push(week);
		}
		
		var firstWeek = weeks[0];
		if (firstWeek.length < 7){
			while(firstWeek.length < 7){
				var firstDate = firstWeek[0];
				var date = new Date(firstDate[0],firstDate[1]-1,firstDate[2]-1)
				firstWeek.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
		} else {
			var firstDate = firstWeek[0];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(firstDate[0], firstDate[1]-1, firstDate[2]-i);
				week.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.unshift(week);
		}
		
		var lastWeek = weeks[weeks.length-1];
		while(lastWeek.length < 7){
			var lastDate = lastWeek[lastWeek.length-1];
			var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+1);
			lastWeek.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
		}
		if (weeks.length < 6){
			var lastDate = lastWeek[lastWeek.length-1];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+i);
				week.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.push(week);
		}
		
		return weeks;
	}
	
	//是否禁用
	function isDisabled(target, d){
		var opts = $.data(target, 'calendar').options;
		var year = new String(d[0]);
		var month = new String(d[1] > 9 ? d[1] : "0" + d[1]);
		var day = new String(d[2] > 9 ? d[2] : "0" + d[2]);
		var date = parseInt(year + month + day);
		var min = parseInt(opts.minDate.replace(/\-/g, ""));
		var max = parseInt(opts.maxDate.replace(/\-/g, ""));
		if( date < min || date > max){
			return true
		}
		return false;
	}
	
	/**
	 * show the calendar day.
	 */
	function show(target){
		var opts = $.data(target, 'calendar').options;
		$(target).find('.calendar-title span').html(opts.months[opts.month-1] + ' ' + opts.year);
		
		var body = $(target).find('div.calendar-body');
		body.find('>table').remove();
		
		var t = $('<table cellspacing="0" cellpadding="0" border="0"><thead></thead><tbody></tbody></table>').prependTo(body);
		var tr = $('<tr></tr>').appendTo(t.find('thead'));
		for(var i=opts.firstDay; i<opts.weeks.length; i++){
			tr.append('<th>'+opts.weeks[i]+'</th>');
		}
		for(var i=0; i<opts.firstDay; i++){
			tr.append('<th>'+opts.weeks[i]+'</th>');
		}
		
		var weeks = getWeeks(target, opts.year, opts.month);
		for(var i=0; i<weeks.length; i++){
			var week = weeks[i];
			var tr = $('<tr></tr>').appendTo(t.find('tbody'));
			for(var j=0; j<week.length; j++){
				var day = week[j];
				var td = $('<td class="calendar-day calendar-other-month"></td>').attr('abbr',day[0]+','+day[1]+','+day[2]).html(day[2]).appendTo(tr);
				if( isDisabled(target, day) ){
					td.addClass("calendar-disbaled");
				}
			}
		}
		t.find('td[abbr^="'+opts.year+','+opts.month+'"]').removeClass('calendar-other-month');
		
		var now = new Date();
		var today = now.getFullYear()+','+(now.getMonth()+1)+','+now.getDate();
		t.find('td[abbr="'+today+'"]').addClass('calendar-today');
		
		if (opts.current){
			t.find('.calendar-selected').removeClass('calendar-selected');
			var current = opts.current.getFullYear()+','+(opts.current.getMonth()+1)+','+opts.current.getDate();
			t.find('td[abbr="'+current+'"]').addClass('calendar-selected');
		}
		
		// calulate the saturday and sunday index
		var saIndex = 6 - opts.firstDay;
		var suIndex = saIndex + 1;
		if (saIndex >= 7) saIndex -= 7;
		if (suIndex >= 7) suIndex -= 7;
		t.find('tr').find('td:eq('+saIndex+')').addClass('calendar-saturday');
		t.find('tr').find('td:eq('+suIndex+')').addClass('calendar-sunday');
		
		t.find('td').hover(
			function(){$(this).addClass('calendar-hover');},
			function(){$(this).removeClass('calendar-hover');}
		).click(function(){
			if( $(this).hasClass("calendar-disbaled") ){
				return false;
			}
			t.find('.calendar-selected').removeClass('calendar-selected');
			$(this).addClass('calendar-selected');
			var parts = $(this).attr('abbr').split(',');
			opts.current = new Date(parts[0], parseInt(parts[1])-1, parts[2]);
			opts.onSelect.call(target, opts.current);
		});
	}
	
	$.fn.calendar = function(options, param){
		if (typeof options == 'string'){
			return $.fn.calendar.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'calendar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'calendar', {
					options:$.extend({}, $.fn.calendar.defaults, $.fn.calendar.parseOptions(this), options)
				});
				init(this);
			}
			if (state.options.border == false){
				$(this).addClass('calendar-noborder');
			}
			setSize(this);
			show(this);
			$(this).find('div.calendar-menu').hide();	// hide the calendar menu
		});
	};
	
	$.fn.calendar.methods = {
		options: function(jq){
			return $.data(jq[0], 'calendar').options;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
			});
		},
		moveTo: function(jq, date){
			return jq.each(function(){
				$(this).calendar({
					year: date.getFullYear(),
					month: date.getMonth()+1,
					current: date
				});
			});
		}
	};
	
	$.fn.calendar.parseOptions = function(target){
		var t = $(target);
		var opts = $.extend({}, $.parser.parseOptions(target, [
			'width','height',"minDate","maxDate",{firstDay:'number',fit:'boolean',border:'boolean'}
		]));
		return opts;
	};
	
	$.fn.calendar.defaults = {
		width:180,
		height:180,
		fit:false,
		border:true,
		minDate: "1900-01-01",
		maxDate: new Date().toString("yyyy-MM-dd"),
		firstDay:0,
		weeks:['S','M','T','W','T','F','S'],
		months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		year:new Date().getFullYear(),
		month:new Date().getMonth()+1,
		current:new Date(),
		
		onSelect: function(date){}
	};
})(jQuery);

/**
 * datebox - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 calendar
 *   combo
 * 
 */
(function($){
	/**
	 * create date box
	 */
	function createBox(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		
		$(target).addClass('datebox-f');
		$(target).combo($.extend({}, opts, {
			onShowPanel:function(){
				var c = getCalendar(target);
				c.calendar('resize');
				var value = $(target).combo('getValue');
				c.calendar('moveTo', opts.parser(value));
				opts.onShowPanel.call(target);
			}
		}));
		$(target).combo('textbox').parent().addClass('datebox');
		var $text = $(target).combo('textbox').val(opts.value);
		//自动解析日期
		$text.off(".datebox").on("keydown.datebox",function(e){
			var code = parseInt(e.keyCode || -1);
			if( code == 13 ){
				return true;
			}
			if( !$.isDateKey(code) ){
				return false;
			}
		}).on("keyup.datebox",function(e){
			var code = parseInt(e.keyCode || -1);
			if( $.isDateKey(code) ) {
				var text = $(this).val();
				if( text.length == 8 && !isNaN(text) ){
					var date = Date.parseDate(text);
					if( date ){
						var value = opts.formatter.call(target, date);
						$(target).combo('setValue', value).combo('setText', value);
						var c = getCalendar(target);
						c.calendar('moveTo', date);
						opts.onSelect.call(target, date);
					}
				}
			}
			return true;
		}).on("blur.datebox",function(e){
			var that = this;
			setTimeout(function(){
				var text = $(that).val();
				var date = Date.parseDate(text);
				if( date ){
					var value = opts.formatter.call(target, date);
					$(target).combo('setValue', value).combo('setText', value);
				}else{
					$(target).combo('setValue', "").combo('setText', "");
				}
			},100);
		});
	}
	
	//取得日历
	function getCalendar(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		if( !state.calendar ){
			state.calendar = createCalendar(target);
		}
		return state.calendar;
	}
	
	function createCalendar(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		var panel = $(target).combo('panel');
		state.calendar = $('<div></div>').appendTo(panel).wrap('<div class="datebox-calendar-inner"></div>');
		state.calendar.calendar({
			fit:true,
			border:false,
			onSelect:function(date){
				var value = opts.formatter.call(target,date);
				setValue(target, value);
				$(target).combo('hidePanel');
				opts.onSelect.call(target, date);
			},
			minDate:opts.minDate,
			maxDate:opts.maxDate
		});
		
		var button = $('<div class="datebox-button"></div>').appendTo(panel);
		$('<a href="javascript:void(0)" class="datebox-current"></a>').html(opts.currentText).appendTo(button);
		$('<a href="javascript:void(0)" class="datebox-close"></a>').html(opts.closeText).appendTo(button);
		$('<a href="javascript:void(0)" class="datebox-clear" style="float:right;margin-right:5px;"></a>').html(opts.clearText).appendTo(button);
		button.find('.datebox-current,.datebox-close').hover(
				function(){$(this).addClass('datebox-button-hover');},
				function(){$(this).removeClass('datebox-button-hover');}
		);
		button.find('.datebox-current').click(function(){
			state.calendar.calendar({
				year:new Date().getFullYear(),
				month:new Date().getMonth()+1,
				current:new Date()
			});
		});
		button.find('.datebox-close').click(function(){
			$(target).combo('hidePanel');
		});
		button.find('.datebox-clear').click(function(){
			$(target).combo('hidePanel');
			$(target).combo('setValue', "").combo('setText', "");
		});
		return state.calendar;
	}
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var opts = $.data(target, 'datebox').options;
		var c = getCalendar(target);
		var value = opts.formatter.call(target, c.calendar('options').current);
		setValue(target, value);
		$(target).combo('hidePanel');
	}
	
	function setValue(target, value){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		var c = getCalendar(target);
		$(target).combo('setValue', value).combo('setText', value);
	}
	
	$.fn.datebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datebox', {
					options: $.extend({}, $.fn.datebox.defaults, $.fn.datebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	};
	
	$.fn.datebox.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'datebox').options;
			opts.originalValue = jq.combo('options').originalValue;
			return opts;
		},
		calendar: function(jq){	// get the calendar object
			return getCalendar(jq[0]);
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).datebox('options');
				$(this).datebox('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.datebox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), {
		});
	};
	
	$.fn.datebox.defaults = $.extend({}, $.fn.combo.defaults, {
		panelWidth:180,
		panelHeight:'auto',
		format:"yyyy-MM-dd",
		maxDate:'2050-10-01',
		editable:true,
		keyHandler: {
			up:function(){},
			down:function(){},
			enter:function(){doEnter(this);},
			query:function(q){doQuery(this, q);}
		},
		
		currentText:'Today',
		closeText:'Close',
		clearText:'置空',
		okText:'Ok',
		formatter:function(date){
			var format = $(this).data("datebox").options.format;
			return date.toString(format || "yyyy-MM-dd");
		},
		parser:function(s){
			var date = Date.parseDate(s);
			if( date ){
				return date;
			}
			return new Date();
		},
		
		onSelect:function(date){}
	});
})(jQuery);
﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(target) {
		var _3 = $.data(target, "datetimebox");
		var _4 = _3.options;
		$(target).datebox($.extend({}, _4, {
			onShowPanel : function() {
				var _5 = $(target).datetimebox("getValue");
				_9(target, _5, true);
				_4.onShowPanel.call(target);
			},
			formatter : $.fn.datebox.defaults.formatter,
			parser : $.fn.datebox.defaults.parser,
			format : _4.format
		}));
		var $text = $(target).combo('textbox').attr("readonly",true);
		$(target).removeClass("datebox-f").addClass("datetimebox-f");
		$(target).datebox("calendar").calendar({
			onSelect : function(_6) {
				_4.onSelect.call(target, _6);
			},
			minDate:_4.minDate,
			maxDate:_4.maxDate
		});
		var _7 = $(target).datebox("panel");
		if (!_3.spinner) {
			var p = $("<div style=\"padding:2px\"><input style=\"width:80px\"></div>").insertAfter(_7.children("div.datebox-calendar-inner"));
			_3.spinner = p.children("input");
			var _8 = _7.children("div.datebox-button");
			var ok = $("<a href=\"javascript:void(0)\" class=\"datebox-ok\"></a>").html(_4.okText).appendTo(_8);
			ok.hover(function() {
				$(this).addClass("datebox-button-hover");
			}, function() {
				$(this).removeClass("datebox-button-hover");
			}).click(function() {
				_f(target);
			});
		}
		_3.spinner.timespinner({
			showSeconds : _4.showSeconds,
			separator : _4.timeSeparator
		}).unbind(".datetimebox").bind("mousedown.datetimebox", function(e) {
			e.stopPropagation();
		});
		_9(target, _4.value);
	}
	;
	function _a(_b) {
		var c = $(_b).datetimebox("calendar");
		var t = $(_b).datetimebox("spinner");
		var _c = c.calendar("options").current;
		return new Date(_c.getFullYear(), _c.getMonth(), _c.getDate(), t.timespinner("getHours"), t.timespinner("getMinutes"), t.timespinner("getSeconds"));
	}
	;
	function _d(_e, q) {
		_9(_e, q, true);
	}
	;
	function _f(_10) {
		var _11 = $.data(_10, "datetimebox").options;
		var _12 = _a(_10);
		_9(_10, _11.formatter.call(_10, _12));
		$(_10).combo("hidePanel");
	}
	;
	function _9(_13, _14, _15) {
		var _16 = $.data(_13, "datetimebox").options;
		$(_13).combo("setValue", _14);
		if (!_15) {
			if (_14) {
				var _17 = _16.parser.call(_13, _14);
				$(_13).combo("setValue", _16.formatter.call(_13, _17));
				$(_13).combo("setText", _16.formatter.call(_13, _17));
			} else {
				$(_13).combo("setText", _14);
			}
		}
		var _17 = _16.parser.call(_13, _14);
		$(_13).datetimebox("calendar").calendar("moveTo", _17);
		$(_13).datetimebox("spinner").timespinner("setValue", _18(_17));
		function _18(_19) {
			function _1a(_1b) {
				return (_1b < 10 ? "0" : "") + _1b;
			}
			;
			var tt = [ _1a(_19.getHours()), _1a(_19.getMinutes()) ];
			if (_16.showSeconds) {
				tt.push(_1a(_19.getSeconds()));
			}
			return tt.join($(_13).datetimebox("spinner").timespinner("options").separator);
		}
		;
	}
	;
	$.fn.datetimebox = function(_1c, _1d) {
		if (typeof _1c == "string") {
			var _1e = $.fn.datetimebox.methods[_1c];
			if (_1e) {
				return _1e(this, _1d);
			} else {
				return this.datebox(_1c, _1d);
			}
		}
		_1c = _1c || {};
		return this.each(function() {
			var _1f = $.data(this, "datetimebox");
			if (_1f) {
				$.extend(_1f.options, _1c);
			} else {
				$.data(this, "datetimebox", {
					options : $.extend({}, $.fn.datetimebox.defaults, $.fn.datetimebox.parseOptions(this), _1c)
				});
			}
			_1(this);
		});
	};
	$.fn.datetimebox.methods = {
		options : function(jq) {
			var _20 = $.data(jq[0], "datetimebox").options;
			_20.originalValue = jq.datebox("options").originalValue;
			return _20;
		},
		spinner : function(jq) {
			return $.data(jq[0], "datetimebox").spinner;
		},
		setValue : function(jq, _21) {
			return jq.each(function() {
				_9(this, _21);
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _22 = $(this).datetimebox("options");
				$(this).datetimebox("setValue", _22.originalValue);
			});
		}
	};
	$.fn.datetimebox.parseOptions = function(_23) {
		var t = $(_23);
		return $.extend({}, $.fn.datebox.parseOptions(_23), $.parser.parseOptions(_23, [ "timeSeparator", "format", {
			showSeconds : "boolean"
		} ]));
	};
	$.fn.datetimebox.defaults = $.extend({}, $.fn.datebox.defaults, {
		showSeconds : true,
		timeSeparator : ":",
		format:"yyyy-MM-dd HH:mm:ss",
		keyHandler : {
			up : function() {
			},
			down : function() {
			},
			enter : function() {
				_f(this);
			},
			query : function(q) {
				_d(this, q);
			}
		},
		formatter : function(date) {
			var format = $(this).data("datetimebox").options.format;
			var val = date.toString(format || "yyyy-MM-dd HH:mm:ss");
			return val;
		},
		parser : function(s) {
			if ($.trim(s) == "") {
				return new Date();
			}
			var date = Date.parseDate(s);
			return date;
		}
	});
})(jQuery);
/**
 * slider - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *  draggable
 * 
 */
(function($){
	function init(target){
		var slider = $('<div class="slider">' +
				'<div class="slider-inner">' +
				'<a href="javascript:void(0)" class="slider-handle"></a>' +
				'<span class="slider-tip"></span>' +
				'</div>' +
				'<div class="slider-rule"></div>' +
				'<div class="slider-rulelabel"></div>' +
				'<div style="clear:both"></div>' +
				'<input type="hidden" class="slider-value">' +
				'</div>').insertAfter(target);
		var name = $(target).hide().attr('name');
		if (name){
			slider.find('input.slider-value').attr('name', name);
			$(target).removeAttr('name').attr('sliderName', name);
		}
		return slider;
	}
	
	/**
	 * set the slider size, for vertical slider, the height property is required
	 */
	function setSize(target, param){
		var opts = $.data(target, 'slider').options;
		var slider = $.data(target, 'slider').slider;
		
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
		}
		if (opts.mode == 'h'){
			slider.css('height', '');
			slider.children('div').css('height', '');
			if (!isNaN(opts.width)){
				slider.width(opts.width);
			}
		} else {
			slider.css('width', '');
			slider.children('div').css('width', '');
			if (!isNaN(opts.height)){
				slider.height(opts.height);
				slider.find('div.slider-rule').height(opts.height);
				slider.find('div.slider-rulelabel').height(opts.height);
				slider.find('div.slider-inner')._outerHeight(opts.height);
			}
		}
		initValue(target);
	}
	
	/**
	 * show slider rule if needed
	 */
	function showRule(target){
		var opts = $.data(target, 'slider').options;
		var slider = $.data(target, 'slider').slider;
		
		var aa = opts.mode == 'h' ? opts.rule : opts.rule.slice(0).reverse();
		if (opts.reversed){
			aa = aa.slice(0).reverse();
		}
		_build(aa);
		
		function _build(aa){
			var rule = slider.find('div.slider-rule');
			var label = slider.find('div.slider-rulelabel');
			rule.empty();
			label.empty();
			for(var i=0; i<aa.length; i++){
				var distance = i*100/(aa.length-1)+'%';
				var span = $('<span></span>').appendTo(rule);
				span.css((opts.mode=='h'?'left':'top'), distance);
				
				// show the labels
				if (aa[i] != '|'){
					span = $('<span></span>').appendTo(label);
					span.html(aa[i]);
					if (opts.mode == 'h'){
						span.css({
							left: distance,
							marginLeft: -Math.round(span.outerWidth()/2)
						});
					} else {
						span.css({
							top: distance,
							marginTop: -Math.round(span.outerHeight()/2)
						});
					}
				}
			}
		}
	}
	
	/**
	 * build the slider and set some properties
	 */
	function buildSlider(target){
		var opts = $.data(target, 'slider').options;
		var slider = $.data(target, 'slider').slider;
		
		slider.removeClass('slider-h slider-v slider-disabled');
		slider.addClass(opts.mode == 'h' ? 'slider-h' : 'slider-v');
		slider.addClass(opts.disabled ? 'slider-disabled' : '');
		
		slider.find('a.slider-handle').draggable({
			axis:opts.mode,
			cursor:'pointer',
			disabled: opts.disabled,
			onDrag:function(e){
				var left = e.data.left;
				var width = slider.width();
				if (opts.mode!='h'){
					left = e.data.top;
					width = slider.height();
				}
				if (left < 0 || left > width) {
					return false;
				} else {
					var value = pos2value(target, left);
					adjustValue(value);
					return false;
				}
			},
			onStartDrag:function(){
				opts.onSlideStart.call(target, opts.value);
			},
			onStopDrag:function(e){
				var value = pos2value(target, (opts.mode=='h'?e.data.left:e.data.top));
				adjustValue(value);
				opts.onSlideEnd.call(target, opts.value);
			}
		});
		
		function adjustValue(value){
			var s = Math.abs(value % opts.step);
			if (s < opts.step/2){
				value -= s;
			} else {
				value = value - s + opts.step;
			}
			setValue(target, value);
		}
	}
	
	/**
	 * set a specified value to slider
	 */
	function setValue(target, value){
		var opts = $.data(target, 'slider').options;
		var slider = $.data(target, 'slider').slider;
		var oldValue = opts.value;
		if (value < opts.min) value = opts.min;
		if (value > opts.max) value = opts.max;
		
		opts.value = value;
		$(target).val(value);
		slider.find('input.slider-value').val(value);
		
		var pos = value2pos(target, value);
		var tip = slider.find('.slider-tip');
		if (opts.showTip){
			tip.show();
			tip.html(opts.tipFormatter.call(target, opts.value));
		} else {
			tip.hide();
		}
		
		if (opts.mode == 'h'){
			var style = 'left:'+pos+'px;';
			slider.find('.slider-handle').attr('style', style);
			tip.attr('style', style +  'margin-left:' + (-Math.round(tip.outerWidth()/2)) + 'px');
		} else {
			var style = 'top:' + pos + 'px;';
			slider.find('.slider-handle').attr('style', style);
			tip.attr('style', style + 'margin-left:' + (-Math.round(tip.outerWidth())) + 'px');
		}
		
		if (oldValue != value){
			opts.onChange.call(target, value, oldValue);
		}
	}
	
	function initValue(target){
		var opts = $.data(target, 'slider').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		setValue(target, opts.value);
		opts.onChange = fn;
	}
	
	/**
	 * translate value to slider position
	 */
	function value2pos(target, value){
		var opts = $.data(target, 'slider').options;
		var slider = $.data(target, 'slider').slider;
		if (opts.mode == 'h'){
			var pos = (value-opts.min)/(opts.max-opts.min)*slider.width();
			if (opts.reversed){
				pos = slider.width() - pos;
			}
		} else {
			var pos = slider.height() - (value-opts.min)/(opts.max-opts.min)*slider.height();
			if (opts.reversed){
				pos = slider.height() - pos;
			}
		}
		return pos.toFixed(0);
	}
	
	/**
	 * translate slider position to value
	 */
	function pos2value(target, pos){
		var opts = $.data(target, 'slider').options;
		var slider = $.data(target, 'slider').slider;
		if (opts.mode == 'h'){
			var value = opts.min + (opts.max-opts.min)*(pos/slider.width());
		} else {
			var value = opts.min + (opts.max-opts.min)*((slider.height()-pos)/slider.height());
		}
		return opts.reversed ? opts.max - value.toFixed(0) : value.toFixed(0);
	}
	
	$.fn.slider = function(options, param){
		if (typeof options == 'string'){
			return $.fn.slider.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'slider');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'slider', {
					options: $.extend({}, $.fn.slider.defaults, $.fn.slider.parseOptions(this), options),
					slider: init(this)
				});
				$(this).removeAttr('disabled');
			}
			buildSlider(this);
			showRule(this);
			setSize(this);
		});
	};
	
	$.fn.slider.methods = {
		options: function(jq){
			return $.data(jq[0], 'slider').options;
		},
		destroy: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').slider.remove();
				$(this).remove();
			});
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		getValue: function(jq){
			return jq.slider('options').value;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = false;
				buildSlider(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = true;
				buildSlider(this);
			});
		}
	};
	
	$.fn.slider.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height','mode',{reversed:'boolean',showTip:'boolean',min:'number',max:'number',step:'number'}
		]), {
			value: (t.val() || undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			rule: (t.attr('rule') ? eval(t.attr('rule')) : undefined)
		});
	};
	
	$.fn.slider.defaults = {
		width: 'auto',
		height: 'auto',
		mode: 'h',	// 'h'(horizontal) or 'v'(vertical)
		reversed: false,
		showTip: false,
		disabled: false,
		value: 0,
		min: 0,
		max: 100,
		step: 1,
		rule: [],	// [0,'|',100]
		tipFormatter: function(value){return value},
		onChange: function(value, oldValue){},
		onSlideStart: function(value){},
		onSlideEnd: function(value){}
	};
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	var _1 = false;
	function _resize(_3) {
		var _4 = $.data(_3, "layout").options;
		var _5 = $.data(_3, "layout").panels;
		var cc = $(_3);
		_4.fit ? cc.css(cc._fit()) : cc._fit(false);
		var _6 = {
			top : 0,
			left : 0,
			width : cc.width(),
			height : cc.height()
		};
		function _7(pp) {
			if (pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width : cc.width(),
				height : pp.panel("options").height,
				left : 0,
				top : 0
			});
			_6.top += pp.panel("options").height;
			_6.height -= pp.panel("options").height;
		}
		;
		if (_b(_5.expandNorth)) {
			_7(_5.expandNorth);
		} else {
			_7(_5.north);
		}
		function _8(pp) {
			if (pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width : cc.width(),
				height : pp.panel("options").height,
				left : 0,
				top : cc.height() - pp.panel("options").height
			});
			_6.height -= pp.panel("options").height;
		}
		;
		if (_b(_5.expandSouth)) {
			_8(_5.expandSouth);
		} else {
			_8(_5.south);
		}
		function _9(pp) {
			if (pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width : pp.panel("options").width,
				height : _6.height,
				left : cc.width() - pp.panel("options").width,
				top : _6.top
			});
			_6.width -= pp.panel("options").width;
		}
		;
		if (_b(_5.expandEast)) {
			_9(_5.expandEast);
		} else {
			_9(_5.east);
		}
		function _a(pp) {
			if (pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width : pp.panel("options").width,
				height : _6.height,
				left : 0,
				top : _6.top
			});
			_6.left += pp.panel("options").width;
			_6.width -= pp.panel("options").width;
		}
		;
		if (_b(_5.expandWest)) {
			_a(_5.expandWest);
		} else {
			_a(_5.west);
		}
		_5.center.panel("resize", _6);
	}
	;
	function _init(target) {
		var cc = $(target);
		if (cc[0].tagName == "BODY") {
			$("html").addClass("panel-fit");
		}
		cc.addClass("layout");
		function _e(cc) {
			cc.children("div").each(function() {
				var _f = $.parser.parseOptions(this, [ "region" ]);
				var r = _f.region;
				if (r == "north" || r == "south" || r == "east" || r == "west" || r == "center") {
					
					_addPanel(target, {
						region : r
					}, this);
				}
			});
		}
		;
		cc.children("form").length ? _e(cc.children("form")) : _e(cc);
		$("<div class=\"layout-split-proxy-h\"></div>").appendTo(cc);
		$("<div class=\"layout-split-proxy-v\"></div>").appendTo(cc);
		cc.bind("_resize", function(e, forceResize) {
			var state = $.data(target, "layout").options;
			if (state.fit == true || forceResize) {
				_resize(target);
			}
			return false;
		});
	}
	;
	function _addPanel(target, param, _div) {
		param.region = param.region || "center";
		var _panels = $.data(target, "layout").panels;
		var $t = $(target);
		var dir = param.region;
		if (_panels[dir].length) {
			return;
		}
		var pp = $(_div);
		if (!pp.length) {
			pp = $("<div></div>").appendTo($t);
		}
		pp.panel($.extend({}, {
			width : (pp.length ? parseInt(pp[0].style.width) || pp.outerWidth() : "auto"),
			height : (pp.length ? parseInt(pp[0].style.height) || pp.outerHeight() : "auto"),
			split : (pp.attr("split") ? pp.attr("split") == "true" : undefined),
			doSize : false,
			cls : ("layout-panel layout-panel-" + dir),
			bodyCls : "layout-body",
			onOpen : function() {
				var _16 = {
					north : "up",
					south : "down",
					east : "right",
					west : "left"
				};
				if (!_16[dir]) {
					return;
				}
				var _17 = "layout-button-" + _16[dir];
				var _18 = $(this).panel("header").children("div.panel-tool");
				if (!_18.children("a." + _17).length) {
					var t = $("<a href=\"javascript:void(0)\"></a>").addClass(_17).appendTo(_18);
					t.bind("click", {
						dir : dir
					}, function(e) {
						_collapse(target, e.data.dir);
						return false;
					});
				}
			}
		}, param));
		_panels[dir] = pp;
		if (pp.panel("options").split) {
			var _19 = pp.panel("panel");
			_19.addClass("layout-split-" + dir);
			var _1a = "";
			if (dir == "north") {
				_1a = "s";
			}
			if (dir == "south") {
				_1a = "n";
			}
			if (dir == "east") {
				_1a = "w";
			}
			if (dir == "west") {
				_1a = "e";
			}
			_19.resizable({
				handles : _1a,
				onStartResize : function(e) {
					_1 = true;
					if (dir == "north" || dir == "south") {
						var _1b = $(">div.layout-split-proxy-v", target);
					} else {
						var _1b = $(">div.layout-split-proxy-h", target);
					}
					var top = 0, _1c = 0, _1d = 0, _1e = 0;
					var pos = {
						display : "block"
					};
					if (dir == "north") {
						pos.top = parseInt(_19.css("top")) + _19.outerHeight() - _1b.height();
						pos.left = parseInt(_19.css("left"));
						pos.width = _19.outerWidth();
						pos.height = _1b.height();
					} else {
						if (dir == "south") {
							pos.top = parseInt(_19.css("top"));
							pos.left = parseInt(_19.css("left"));
							pos.width = _19.outerWidth();
							pos.height = _1b.height();
						} else {
							if (dir == "east") {
								pos.top = parseInt(_19.css("top")) || 0;
								pos.left = parseInt(_19.css("left")) || 0;
								pos.width = _1b.width();
								pos.height = _19.outerHeight();
							} else {
								if (dir == "west") {
									pos.top = parseInt(_19.css("top")) || 0;
									pos.left = _19.outerWidth() - _1b.width();
									pos.width = _1b.width();
									pos.height = _19.outerHeight();
								}
							}
						}
					}
					_1b.css(pos);
					$("<div class=\"layout-mask\"></div>").css({
						left : 0,
						top : 0,
						width : $t.width(),
						height : $t.height()
					}).appendTo($t);
				},
				onResize : function(e) {
					if (dir == "north" || dir == "south") {
						var _1f = $(">div.layout-split-proxy-v", target);
						_1f.css("top", e.pageY - $(target).offset().top - _1f.height() / 2);
					} else {
						var _1f = $(">div.layout-split-proxy-h", target);
						_1f.css("left", e.pageX - $(target).offset().left - _1f.width() / 2);
					}
					return false;
				},
				onStopResize : function() {
					$(">div.layout-split-proxy-v", target).css("display", "none");
					$(">div.layout-split-proxy-h", target).css("display", "none");
					var _20 = pp.panel("options");
					_20.width = _19.outerWidth();
					_20.height = _19.outerHeight();
					_20.left = _19.css("left");
					_20.top = _19.css("top");
					pp.panel("resize");
					_resize(target);
					_1 = false;
					$t.find(">div.layout-mask").remove();
				}
			});
		}
	}
	;
	function _remove(_22, _23) {
		var _24 = $.data(_22, "layout").panels;
		if (_24[_23].length) {
			_24[_23].panel("destroy");
			_24[_23] = $();
			var _25 = "expand" + _23.substring(0, 1).toUpperCase() + _23.substring(1);
			if (_24[_25]) {
				_24[_25].panel("destroy");
				_24[_25] = undefined;
			}
		}
	}
	;
	function _collapse(_27, _28, _29) {
		if (_29 == undefined) {
			_29 = "normal";
		}
		var _2a = $.data(_27, "layout").panels;
		var p = _2a[_28];
		if (p.panel("options").onBeforeCollapse.call(p) == false) {
			return;
		}
		var _2b = "expand" + _28.substring(0, 1).toUpperCase() + _28.substring(1);
		if (!_2a[_2b]) {
			_2a[_2b] = _2c(_28);
			_2a[_2b].panel("panel").click(function() {
				var _2d = _2e();
				p.panel("expand", false).panel("open").panel("resize", _2d.collapse);
				p.panel("panel").animate(_2d.expand);
				return false;
			});
		}
		var _2f = _2e();
		if (!_b(_2a[_2b])) {
			_2a.center.panel("resize", _2f.resizeC);
		}
		p.panel("panel").animate(_2f.collapse, _29, function() {
			p.panel("collapse", false).panel("close");
			_2a[_2b].panel("open").panel("resize", _2f.expandP);
		});
		function _2c(dir) {
			var _30;
			if (dir == "east") {
				_30 = "layout-button-left";
			} else {
				if (dir == "west") {
					_30 = "layout-button-right";
				} else {
					if (dir == "north") {
						_30 = "layout-button-down";
					} else {
						if (dir == "south") {
							_30 = "layout-button-up";
						}
					}
				}
			}
			var p = $("<div></div>").appendTo(_27).panel({
				cls : "layout-expand",
				title : "&nbsp;",
				closed : true,
				doSize : false,
				tools : [ {
					iconCls : _30,
					handler : function() {
						_expand(_27, _28);
						return false;
					}
				} ]
			});
			p.panel("panel").hover(function() {
				$(this).addClass("layout-expand-over");
			}, function() {
				$(this).removeClass("layout-expand-over");
			});
			return p;
		}
		;
		function _2e() {
			var cc = $(_27);
			if (_28 == "east") {
				return {
					resizeC : {
						width : _2a.center.panel("options").width + _2a["east"].panel("options").width - 28
					},
					expand : {
						left : cc.width() - _2a["east"].panel("options").width
					},
					expandP : {
						top : _2a["east"].panel("options").top,
						left : cc.width() - 28,
						width : 28,
						height : _2a["center"].panel("options").height
					},
					collapse : {
						left : cc.width()
					}
				};
			} else {
				if (_28 == "west") {
					return {
						resizeC : {
							width : _2a.center.panel("options").width + _2a["west"].panel("options").width - 28,
							left : 28
						},
						expand : {
							left : 0
						},
						expandP : {
							left : 0,
							top : _2a["west"].panel("options").top,
							width : 28,
							height : _2a["center"].panel("options").height
						},
						collapse : {
							left : -_2a["west"].panel("options").width
						}
					};
				} else {
					if (_28 == "north") {
						var hh = cc.height() - 28;
						if (_b(_2a.expandSouth)) {
							hh -= _2a.expandSouth.panel("options").height;
						} else {
							if (_b(_2a.south)) {
								hh -= _2a.south.panel("options").height;
							}
						}
						_2a.east.panel("resize", {
							top : 28,
							height : hh
						});
						_2a.west.panel("resize", {
							top : 28,
							height : hh
						});
						if (_b(_2a.expandEast)) {
							_2a.expandEast.panel("resize", {
								top : 28,
								height : hh
							});
						}
						if (_b(_2a.expandWest)) {
							_2a.expandWest.panel("resize", {
								top : 28,
								height : hh
							});
						}
						return {
							resizeC : {
								top : 28,
								height : hh
							},
							expand : {
								top : 0
							},
							expandP : {
								top : 0,
								left : 0,
								width : cc.width(),
								height : 28
							},
							collapse : {
								top : -_2a["north"].panel("options").height
							}
						};
					} else {
						if (_28 == "south") {
							var hh = cc.height() - 28;
							if (_b(_2a.expandNorth)) {
								hh -= _2a.expandNorth.panel("options").height;
							} else {
								if (_b(_2a.north)) {
									hh -= _2a.north.panel("options").height;
								}
							}
							_2a.east.panel("resize", {
								height : hh
							});
							_2a.west.panel("resize", {
								height : hh
							});
							if (_b(_2a.expandEast)) {
								_2a.expandEast.panel("resize", {
									height : hh
								});
							}
							if (_b(_2a.expandWest)) {
								_2a.expandWest.panel("resize", {
									height : hh
								});
							}
							return {
								resizeC : {
									height : hh
								},
								expand : {
									top : cc.height() - _2a["south"].panel("options").height
								},
								expandP : {
									top : cc.height() - 28,
									left : 0,
									width : cc.width(),
									height : 28
								},
								collapse : {
									top : cc.height()
								}
							};
						}
					}
				}
			}
		}
		;
	}
	;
	function _expand(_32, _33) {
		var _34 = $.data(_32, "layout").panels;
		var _35 = _36();
		var p = _34[_33];
		if (p.panel("options").onBeforeExpand.call(p) == false) {
			return;
		}
		var _37 = "expand" + _33.substring(0, 1).toUpperCase() + _33.substring(1);
		_34[_37].panel("close");
		p.panel("panel").stop(true, true);
		p.panel("expand", false).panel("open").panel("resize", _35.collapse);
		p.panel("panel").animate(_35.expand, function() {
			_resize(_32);
		});
		function _36() {
			var cc = $(_32);
			if (_33 == "east" && _34.expandEast) {
				return {
					collapse : {
						left : cc.width()
					},
					expand : {
						left : cc.width() - _34["east"].panel("options").width
					}
				};
			} else {
				if (_33 == "west" && _34.expandWest) {
					return {
						collapse : {
							left : -_34["west"].panel("options").width
						},
						expand : {
							left : 0
						}
					};
				} else {
					if (_33 == "north" && _34.expandNorth) {
						return {
							collapse : {
								top : -_34["north"].panel("options").height
							},
							expand : {
								top : 0
							}
						};
					} else {
						if (_33 == "south" && _34.expandSouth) {
							return {
								collapse : {
									top : cc.height()
								},
								expand : {
									top : cc.height() - _34["south"].panel("options").height
								}
							};
						}
					}
				}
			}
		}
		;
	}
	;
	function _initEvent(_39) {
		var _3a = $.data(_39, "layout").panels;
		var cc = $(_39);
		if (_3a.east.length) {
			_3a.east.panel("panel").bind("mouseover", "east", _3b);
		}
		if (_3a.west.length) {
			_3a.west.panel("panel").bind("mouseover", "west", _3b);
		}
		if (_3a.north.length) {
			_3a.north.panel("panel").bind("mouseover", "north", _3b);
		}
		if (_3a.south.length) {
			_3a.south.panel("panel").bind("mouseover", "south", _3b);
		}
		_3a.center.panel("panel").bind("mouseover", "center", _3b);
		function _3b(e) {
			if (_1 == true) {
				return;
			}
			if (e.data != "east" && _b(_3a.east) && _b(_3a.expandEast)) {
				_collapse(_39, "east");
			}
			if (e.data != "west" && _b(_3a.west) && _b(_3a.expandWest)) {
				_collapse(_39, "west");
			}
			if (e.data != "north" && _b(_3a.north) && _b(_3a.expandNorth)) {
				_collapse(_39, "north");
			}
			if (e.data != "south" && _b(_3a.south) && _b(_3a.expandSouth)) {
				_collapse(_39, "south");
			}
			return false;
		}
		;
	}
	;
	function _b(pp) {
		if (!pp) {
			return false;
		}
		if (pp.length) {
			return pp.panel("panel").is(":visible");
		} else {
			return false;
		}
	}
	;
	function _collapseAll(_3d) {
		var _3e = $.data(_3d, "layout").panels;
		if (_3e.east.length && _3e.east.panel("options").collapsed) {
			_collapse(_3d, "east", 0);
		}
		if (_3e.west.length && _3e.west.panel("options").collapsed) {
			_collapse(_3d, "west", 0);
		}
		if (_3e.north.length && _3e.north.panel("options").collapsed) {
			_collapse(_3d, "north", 0);
		}
		if (_3e.south.length && _3e.south.panel("options").collapsed) {
			_collapse(_3d, "south", 0);
		}
	}
	;
	$.fn.layout = function(_3f, _40) {
		if (typeof _3f == "string") {
			return $.fn.layout.methods[_3f](this, _40);
		}
		_3f = _3f || {};
		return this.each(function() {
			var _41 = $.data(this, "layout");
			if (_41) {
				$.extend(_41.options, _3f);
			} else {
				var _42 = $.extend({}, $.fn.layout.defaults, $.fn.layout.parseOptions(this), _3f);
				$.data(this, "layout", {
					options : _42,
					panels : {
						center : $(),
						north : $(),
						south : $(),
						east : $(),
						west : $()
					}
				});
				_init(this);
				_initEvent(this);
			}
			_resize(this);
			_collapseAll(this);
		});
	};
	$.fn.layout.methods = {
		resize : function(jq) {
			return jq.each(function() {
				_resize(this);
			});
		},
		panel : function(jq, region) {
			return $.data(jq[0], "layout").panels[region];
		},
		collapse : function(jq, _44) {
			return jq.each(function() {
				_collapse(this, _44);
			});
		},
		expand : function(jq, _45) {
			return jq.each(function() {
				_expand(this, _45);
			});
		},
		add : function(jq, _46) {
			return jq.each(function() {
				_addPanel(this, _46);
				_resize(this);
				if ($(this).layout("panel", _46.region).panel("options").collapsed) {
					_collapse(this, _46.region, 0);
				}
			});
		},
		remove : function(jq, _47) {
			return jq.each(function() {
				_remove(this, _47);
				_resize(this);
			});
		}
	};
	$.fn.layout.parseOptions = function(_48) {
		return $.extend({}, $.parser.parseOptions(_48, [ {
			fit : "boolean"
		} ]));
	};
	$.fn.layout.defaults = {
		fit : false
	};
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	var _1 = 0;
	function _2(a, o) {
		for ( var i = 0, _3 = a.length; i < _3; i++) {
			if (a[i] == o) {
				return i;
			}
		}
		return -1;
	}
	;
	function _4(a, o, id) {
		if (typeof o == "string") {
			for ( var i = 0, _5 = a.length; i < _5; i++) {
				if (a[i][o] == id) {
					a.splice(i, 1);
					return;
				}
			}
		} else {
			var _6 = _2(a, o);
			if (_6 != -1) {
				a.splice(_6, 1);
			}
		}
	}
	;
	function _7(a, o, r) {
		for ( var i = 0, _8 = a.length; i < _8; i++) {
			if (a[i][o] == r[o]) {
				return;
			}
		}
		a.push(r);
	}
	;
	function _9(_a, _b) {
		var _c = $.data(_a, "datagrid").options;
		var _d = $.data(_a, "datagrid").panel;
		if (_b) {
			if (_b.width) {
				_c.width = _b.width;
			}
			if (_b.height) {
				_c.height = _b.height;
			}
		}
		if (_c.fit == true) {
			var p = _d.panel("panel").parent();
			_c.width = p.width();
			_c.height = p.height();
		}
		_d.panel("resize", {
			width : _c.width,
			height : _c.height
		});
	}
	;
	function _e(_f) {
		var _10 = $.data(_f, "datagrid").options;
		var dc = $.data(_f, "datagrid").dc;
		var _11 = $.data(_f, "datagrid").panel;
		var _12 = _11.width();
		var _13 = _11.height();
		var _14 = dc.view;
		var _15 = dc.view1;
		var _16 = dc.view2;
		var _17 = _15.children("div.datagrid-header");
		var _18 = _16.children("div.datagrid-header");
		var _19 = _17.find("table");
		var _1a = _18.find("table");
		_14.width(_12);
		var _1b = _17.children("div.datagrid-header-inner").show();
		_15.width(_1b.find("table").width());
		if (!_10.showHeader) {
			_1b.hide();
		}
		_16.width(_12 - _15._outerWidth());
		_15.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(_15.width());
		_16.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(_16.width());
		var hh;
		_17.css("height", "");
		_18.css("height", "");
		_19.css("height", "");
		_1a.css("height", "");
		hh = Math.max(_19.height(), _1a.height());
		_19.height(hh);
		_1a.height(hh);
		_17.add(_18)._outerHeight(hh);
		if (_10.height != "auto") {
			var _1c = _13 - _16.children("div.datagrid-header")._outerHeight() - _16.children("div.datagrid-footer")._outerHeight()
					- _11.children("div.datagrid-toolbar")._outerHeight();
			_11.children("div.datagrid-pager").each(function() {
				_1c -= $(this)._outerHeight();
			});
			dc.body1.add(dc.body2).children("table.datagrid-btable-frozen").css({
				position : "absolute",
				top : dc.header2._outerHeight()
			});
			var _1d = dc.body2.children("table.datagrid-btable-frozen")._outerHeight();
			_15.add(_16).children("div.datagrid-body").css({
				marginTop : _1d,
				height : (_1c - _1d)
			});
		}
		_14.height(_16.height());
	}
	;
	function fixRowHeight(_1f, _20, _21) {
		var _22 = $.data(_1f, "datagrid").data.rows;
		var _23 = $.data(_1f, "datagrid").options;
		var dc = $.data(_1f, "datagrid").dc;
		if (!dc.body1.is(":empty") && (!_23.nowrap || _23.autoRowHeight || _21)) {
			if (_20 != undefined) {
				var tr1 = _23.finder.getTr(_1f, _20, "body", 1);
				var tr2 = _23.finder.getTr(_1f, _20, "body", 2);
				_24(tr1, tr2);
			} else {
				var tr1 = _23.finder.getTr(_1f, 0, "allbody", 1);
				var tr2 = _23.finder.getTr(_1f, 0, "allbody", 2);
				_24(tr1, tr2);
				if (_23.showFooter) {
					var tr1 = _23.finder.getTr(_1f, 0, "allfooter", 1);
					var tr2 = _23.finder.getTr(_1f, 0, "allfooter", 2);
					_24(tr1, tr2);
				}
			}
		}
		_e(_1f);
		if (_23.height == "auto") {
			var _25 = dc.body1.parent();
			var _26 = dc.body2;
			var _27 = 0;
			var _28 = 0;
			_26.children().each(function() {
				var c = $(this);
				if (c.is(":visible")) {
					_27 += c._outerHeight();
					if (_28 < c._outerWidth()) {
						_28 = c._outerWidth();
					}
				}
			});
			if (_28 > _26.width()) {
				_27 += 18;
			}
			_25.height(_27);
			_26.height(_27);
			dc.view.height(dc.view2.height());
		}
		dc.body2.triggerHandler("scroll");
		function _24(_29, _2a) {
			for ( var i = 0; i < _2a.length; i++) {
				var tr1 = $(_29[i]);
				var tr2 = $(_2a[i]);
				tr1.css("height", "");
				tr2.css("height", "");
				var _2b = Math.max(tr1.height(), tr2.height());
				tr1.css("height", _2b);
				tr2.css("height", _2b);
			}
		}
		;
	}
	;
	function _2c(_2d, _2e) {
		var _2f = $.data(_2d, "datagrid");
		var _30 = _2f.options;
		var dc = _2f.dc;
		if (!dc.body2.children("table.datagrid-btable-frozen").length) {
			dc.body1.add(dc.body2).prepend("<table class=\"datagrid-btable datagrid-btable-frozen\" cellspacing=\"0\" cellpadding=\"0\"></table>");
		}
		_31(true);
		_31(false);
		_e(_2d);
		function _31(_32) {
			var _33 = _32 ? 1 : 2;
			var tr = _30.finder.getTr(_2d, _2e, "body", _33);
			(_32 ? dc.body1 : dc.body2).children("table.datagrid-btable-frozen").append(tr);
		}
		;
	}
	;
	function _34(_35, _36) {
		function _37() {
			var _38 = [];
			var _39 = [];
			$(_35).children("thead").each(function() {
				var opt = $.parser.parseOptions(this, [ {
					frozen : "boolean"
				} ]);
				$(this).find("tr").each(function() {
					var _3a = [];
					$(this).find("th").each(function() {
						var th = $(this);
						var col = $.extend({}, $.parser.parseOptions(this, [ "field", "align", "halign", "order", {
							sortable : "boolean",
							checkbox : "boolean",
							resizable : "boolean"
						}, {
							rowspan : "number",
							colspan : "number",
							width : "number"
						} ]), {
							title : (th.html() || undefined),
							hidden : (th.attr("hidden") ? true : undefined),
							formatter : (th.attr("formatter") ? $.eval(th.attr("formatter"), th) : undefined),
							styler : (th.attr("styler") ? $.eval(th.attr("styler"), th) : undefined),
							sorter : (th.attr("sorter") ? $.eval(th.attr("sorter"), th) : undefined)
						});
						if (th.attr("editor")) {
							var s = $.trim(th.attr("editor"));
							if (s.substr(0, 1) == "{") {
								col.editor = $.eval(s, _35);
							} else {
								col.editor = s;
							}
						}
						_3a.push(col);
					});
					opt.frozen ? _38.push(_3a) : _39.push(_3a);
				});
			});
			return [ _38, _39 ];
		}
		;
		var _3b = $(
				"<div class=\"datagrid-wrap\">" + "<div class=\"datagrid-view\">" + "<div class=\"datagrid-view1\">" + "<div class=\"datagrid-header\">"
						+ "<div class=\"datagrid-header-inner\"></div>" + "</div>" + "<div class=\"datagrid-body\">"
						+ "<div class=\"datagrid-body-inner\"></div>" + "</div>" + "<div class=\"datagrid-footer\">"
						+ "<div class=\"datagrid-footer-inner\"></div>" + "</div>" + "</div>" + "<div class=\"datagrid-view2\">"
						+ "<div class=\"datagrid-header\">" + "<div class=\"datagrid-header-inner\"></div>" + "</div>" + "<div class=\"datagrid-body\"></div>"
						+ "<div class=\"datagrid-footer\">" + "<div class=\"datagrid-footer-inner\"></div>" + "</div>" + "</div>" + "</div>" + "</div>")
				.insertAfter(_35);
		_3b.panel({
			doSize : false
		});
		_3b.panel("panel").addClass("datagrid").bind("_resize", function(e, _3c) {
			var _3d = $.data(_35, "datagrid").options;
			if (_3d.fit == true || _3c) {
				_9(_35);
				setTimeout(function() {
					if ($.data(_35, "datagrid")) {
						_3e(_35);
					}
				}, 0);
			}
			return false;
		});
		$(_35).hide().appendTo(_3b.children("div.datagrid-view"));
		var cc = _37();
		var _3f = _3b.children("div.datagrid-view");
		var _40 = _3f.children("div.datagrid-view1");
		var _41 = _3f.children("div.datagrid-view2");
		return {
			panel : _3b,
			frozenColumns : cc[0],
			columns : cc[1],
			dc : {
				view : _3f,
				view1 : _40,
				view2 : _41,
				header1 : _40.children("div.datagrid-header").children("div.datagrid-header-inner"),
				header2 : _41.children("div.datagrid-header").children("div.datagrid-header-inner"),
				body1 : _40.children("div.datagrid-body").children("div.datagrid-body-inner"),
				body2 : _41.children("div.datagrid-body"),
				footer1 : _40.children("div.datagrid-footer").children("div.datagrid-footer-inner"),
				footer2 : _41.children("div.datagrid-footer").children("div.datagrid-footer-inner")
			}
		};
	}
	;
	function _42(_43) {
		var _44 = {
			total : 0,
			rows : []
		};
		var _45 = _46(_43, true).concat(_46(_43, false));
		$(_43).find("tbody tr").each(function() {
			_44.total++;
			var col = {};
			for ( var i = 0; i < _45.length; i++) {
				col[_45[i]] = $("td:eq(" + i + ")", this).html();
			}
			_44.rows.push(col);
		});
		return _44;
	}
	;
	function _47(_48) {
		var _49 = $.data(_48, "datagrid");
		var _4a = _49.options;
		var dc = _49.dc;
		var _4b = _49.panel;
		_4b.panel($.extend({}, _4a, {
			id : null,
			doSize : false,
			onResize : function(_4c, _4d) {
				setTimeout(function() {
					if ($.data(_48, "datagrid")) {
						_e(_48);
						_73(_48);
						_4a.onResize.call(_4b, _4c, _4d);
					}
				}, 0);
			},
			onExpand : function() {
				fixRowHeight(_48);
				_4a.onExpand.call(_4b);
			}
		}));
		_49.rowIdPrefix = "datagrid-row-r" + (++_1);
		_4e(dc.header1, _4a.frozenColumns, true);
		_4e(dc.header2, _4a.columns, false);
		_4f();
		dc.header1.add(dc.header2).css("display", _4a.showHeader ? "block" : "none");
		dc.footer1.add(dc.footer2).css("display", _4a.showFooter ? "block" : "none");
		if (_4a.toolbar) {
			if (typeof _4a.toolbar == "string") {
				$(_4a.toolbar).addClass("datagrid-toolbar").prependTo(_4b);
				$(_4a.toolbar).show();
			} else {
				$("div.datagrid-toolbar", _4b).remove();
				var tb = $("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(_4b);
				var tr = tb.find("tr");
				for ( var i = 0; i < _4a.toolbar.length; i++) {
					var btn = _4a.toolbar[i];
					if (btn == "-") {
						$("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
						continue;
					}
					var id = btn.id || "", disable = btn.disabled ? " disabled='true'" : "";
					var td = $("<td></td>").appendTo(tr);
					if( true || btn.type == "linkbutton" ){
						var _50 = $("<a id='" + id + "' href=\"javascript:void(0)\" " + disable + ">" + btn.text + "</a>").appendTo(td);
						_50.linkbutton($.extend({}, btn, {
							plain : true
						}));
						_50[0].onclick = eval(btn.handler || function() {
						});
					}else{
						if( btn.handler ){
							var _50 = $("<button id='" + id + "' href=\"javascript:void(0)\" class='button' " + disable + ">" + btn.text + "</button>").appendTo(td);
							_50[0].onclick = eval(btn.handler || function() {
							});
						}else{//显示文本
							var text = $("<span id='" + id + "' class='toolbar-text' " + disable + ">" + btn.text + "</span>").appendTo(td);
						}
					}
				}
			}
		} else {
			$("div.datagrid-toolbar", _4b).remove();
		}
		$("div.datagrid-pager", _4b).remove();
		if (_4a.pagination) {
			var _51 = $("<div class=\"datagrid-pager\"></div>");
			if (_4a.pagePosition == "bottom") {
				_51.appendTo(_4b);
			} else {
				if (_4a.pagePosition == "top") {
					_51.addClass("datagrid-pager-top").prependTo(_4b);
				} else {
					var _52 = $("<div class=\"datagrid-pager datagrid-pager-top\"></div>").prependTo(_4b);
					_51.appendTo(_4b);
					_51 = _51.add(_52);
				}
			}
			var pageOptions = {
					total : 0,
					pageNumber : _4a.pageNumber,
					pageSize : _4a.pageSize,
					pageList : _4a.pageList,
					onSelectPage : function(_53, _54) {
						_4a.pageNumber = _53;
						_4a.pageSize = _54;
						_51.pagination("refresh", {
							pageNumber : _53,
							pageSize : _54
						});
						_150(_48);
					}
			};
			_51.pagination($.extend(_4a.pageOptions || {}, pageOptions));
			_4a.pageSize = _51.pagination("options").pageSize;
		}
		function _4e(_55, _56, _57) {
			if (!_56) {
				return;
			}
			$(_55).show();
			$(_55).empty();
			var t = $("<table class=\"datagrid-htable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(_55);
			for ( var i = 0; i < _56.length; i++) {
				var tr = $("<tr class=\"datagrid-header-row\"></tr>").appendTo($("tbody", t));
				var _58 = _56[i];
				for ( var j = 0; j < _58.length; j++) {
					var col = _58[j];
					var _59 = "";
					if (col.rowspan) {
						_59 += "rowspan=\"" + col.rowspan + "\" ";
					}
					if (col.colspan) {
						_59 += "colspan=\"" + col.colspan + "\" ";
					}
					if (col.style) {
						_59 += "style=\"" + col.style + "\" ";
					}
					if (col.className) {
						_59 += "class=\"" + col.className + "\" ";
					}
					var td = $("<td " + _59 + "></td>").appendTo(tr);
					if (col.checkbox) {
						td.attr("field", col.field);
						$("<div class=\"datagrid-header-check\"></div>").html("<input type=\"checkbox\"/>").appendTo(td);
					} else {
						if (col.field) {
							td.attr("field", col.field);
							td.append("<div class=\"datagrid-cell\"><span></span><span class=\"datagrid-sort-icon\"></span></div>");
							$("span", td).html(col.title);
							$("span.datagrid-sort-icon", td).html("&nbsp;");
							var _5a = td.find("div.datagrid-cell");
							if (col.resizable == false) {
								_5a.attr("resizable", "false");
							}
							if (col.width) {
								_5a._outerWidth(col.width);
								col.boxWidth = parseInt(_5a[0].style.width);
							} else {
								col.auto = true;
							}
							_5a.css("text-align", (col.halign || col.align || ""));
							col.cellClass = "datagrid-cell-c" + _1 + "-" + col.field.replace(/\./g, "-");
							col.cellSelector = "div." + col.cellClass;
						} else {
							$("<div class=\"datagrid-cell-group\"></div>").html(col.title).appendTo(td);
						}
					}
					if (col.hidden) {
						td.hide();
					}
				}
			}
			if (_57 && _4a.rownumbers) {
				var td = $("<td rowspan=\"" + _4a.frozenColumns.length + "\"><div class=\"datagrid-header-rownumber\"></div></td>");
				if ($("tr", t).length == 0) {
					td.wrap("<tr class=\"datagrid-header-row\"></tr>").parent().appendTo($("tbody", t));
				} else {
					td.prependTo($("tr:first", t));
				}
			}
		}
		;
		function _4f() {
			var ss = [ "<style type=\"text/css\">" ];
			var _5b = _46(_48, true).concat(_46(_48));
			for ( var i = 0; i < _5b.length; i++) {
				var col = getColumnOption(_48, _5b[i]);
				if (col && !col.checkbox) {
					ss.push(col.cellSelector + " {width:" + col.boxWidth + "px;}");
				}
			}
			ss.push("</style>");
			$(ss.join("\n")).prependTo(dc.view);
		}
		;
	}
	;
	function _5d(_5e) {
		var _5f = $.data(_5e, "datagrid");
		var _60 = _5f.panel;
		var _61 = _5f.options;
		var dc = _5f.dc;
		var _62 = dc.header1.add(dc.header2);
		_62.find("input[type=checkbox]").unbind(".datagrid").bind("click.datagrid", function(e) {
			if (_61.singleSelect && _61.selectOnCheck) {
				return false;
			}
			if ($(this).is(":checked")) {
				_e5(_5e);
			} else {
				_ed(_5e);
			}
			e.stopPropagation();
		});
		var _63 = _62.find("div.datagrid-cell");
		_63.closest("td").unbind(".datagrid").bind("mouseenter.datagrid", function() {
			if (_5f.resizing) {
				return;
			}
			$(this).addClass("datagrid-header-over");
		}).bind("mouseleave.datagrid", function() {
			$(this).removeClass("datagrid-header-over");
		}).bind("contextmenu.datagrid", function(e) {
			var _64 = $(this).attr("field");
			_61.onHeaderContextMenu.call(_5e, e, _64);
		});
		_63.unbind(".datagrid").bind("click.datagrid", function(e) {
			var p1 = $(this).offset().left + 5;
			var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
			if (e.pageX < p2 && e.pageX > p1) {
				var _65 = $(this).parent().attr("field");
				var col = getColumnOption(_5e, _65);
				if (!col.sortable || _5f.resizing) {
					return;
				}
				_61.sortName = _65;
				_61.sortOrder = col.order || "asc";
				var cls = "datagrid-sort-" + _61.sortOrder;
				if ($(this).hasClass("datagrid-sort-asc")) {
					cls = "datagrid-sort-desc";
					_61.sortOrder = "desc";
				} else {
					if ($(this).hasClass("datagrid-sort-desc")) {
						cls = "datagrid-sort-asc";
						_61.sortOrder = "asc";
					}
				}
				_63.removeClass("datagrid-sort-asc datagrid-sort-desc");
				$(this).addClass(cls);
				if (_61.remoteSort) {
					_150(_5e);
				} else {
					var _66 = $.data(_5e, "datagrid").data;
					_ab(_5e, _66);
				}
				_61.onSortColumn.call(_5e, _61.sortName, _61.sortOrder);
			}
		}).bind("dblclick.datagrid", function(e) {
			var p1 = $(this).offset().left + 5;
			var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
			var _67 = _61.resizeHandle == "right" ? (e.pageX > p2) : (_61.resizeHandle == "left" ? (e.pageX < p1) : (e.pageX < p1 || e.pageX > p2));
			if (_67) {
				var _68 = $(this).parent().attr("field");
				var col = getColumnOption(_5e, _68);
				if (col.resizable == false) {
					return;
				}
				$(_5e).datagrid("autoSizeColumn", _68);
				col.auto = false;
			}
		});
		var _69 = _61.resizeHandle == "right" ? "e" : (_61.resizeHandle == "left" ? "w" : "e,w");
		_63.each(function() {
			$(this).resizable({
				handles : _69,
				disabled : ($(this).attr("resizable") ? $(this).attr("resizable") == "false" : false),
				minWidth : 25,
				onStartResize : function(e) {
					_5f.resizing = true;
					_62.css("cursor", $("body").css("cursor"));
					if (!_5f.proxy) {
						_5f.proxy = $("<div class=\"datagrid-resize-proxy\"></div>").appendTo(dc.view);
					}
					_5f.proxy.css({
						left : e.pageX - $(_60).offset().left - 1,
						display : "none"
					});
					setTimeout(function() {
						if (_5f.proxy) {
							_5f.proxy.show();
						}
					}, 500);
				},
				onResize : function(e) {
					_5f.proxy.css({
						left : e.pageX - $(_60).offset().left - 1,
						display : "block"
					});
					return false;
				},
				onStopResize : function(e) {
					_62.css("cursor", "");
					var _6a = $(this).parent().attr("field");
					var col = getColumnOption(_5e, _6a);
					col.width = $(this)._outerWidth();
					col.boxWidth = parseInt(this.style.width);
					col.auto = undefined;
					_3e(_5e, _6a);
					_5f.proxy.remove();
					_5f.proxy = null;
					if ($(this).parents("div:first.datagrid-header").parent().hasClass("datagrid-view1")) {
						_e(_5e);
					}
					_73(_5e);
					_61.onResizeColumn.call(_5e, _6a, col.width);
					setTimeout(function() {
						_5f.resizing = false;
					}, 0);
				}
			});
		});
		dc.body1.add(dc.body2).unbind().bind("mouseover", function(e) {
			if (_5f.resizing) {
				return;
			}
			var tr = $(e.target).closest("tr.datagrid-row");
			if (!tr.length) {
				return;
			}
			var _6b = _6c(tr);
			_61.finder.getTr(_5e, _6b).addClass("datagrid-row-over");
			e.stopPropagation();
		}).bind("mouseout", function(e) {
			var tr = $(e.target).closest("tr.datagrid-row");
			if (!tr.length) {
				return;
			}
			var _6d = _6c(tr);
			_61.finder.getTr(_5e, _6d).removeClass("datagrid-row-over");
			e.stopPropagation();
		}).bind("click", function(e) {
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!tr.length) {
				return;
			}
			var _6e = _6c(tr);
			if (tt.parent().hasClass("datagrid-cell-check")) {
				if (_61.singleSelect && _61.selectOnCheck) {
					if (!_61.checkOnSelect) {
						_ed(_5e, true);
					}
					_checkRow(_5e, _6e);
				} else {
					if (tt.is(":checked")) {
						_checkRow(_5e, _6e);
					} else {
						_dd(_5e, _6e);
					}
				}
			} else {
				var row = _61.finder.getRow(_5e, _6e);
				var td = tt.closest("td[field]", tr);
				if (td.length) {
					var _6f = td.attr("field");
					_61.onClickCell.call(_5e, _6e, _6f, row[_6f]);
				}
				if (_61.singleSelect == true) {
					_selectRow(_5e, _6e);
				} else {
					if (tr.hasClass("datagrid-row-selected")) {
						_d6(_5e, _6e);
					} else {
						_selectRow(_5e, _6e);
					}
				}
				_61.onClickRow.call(_5e, _6e, row);
			}
			e.stopPropagation();
		}).bind("dblclick", function(e) {
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!tr.length) {
				return;
			}
			var _70 = _6c(tr);
			var row = _61.finder.getRow(_5e, _70);
			var td = tt.closest("td[field]", tr);
			if (td.length) {
				var _71 = td.attr("field");
				_61.onDblClickCell.call(_5e, _70, _71, row[_71]);
			}
			_61.onDblClickRow.call(_5e, _70, row);
			e.stopPropagation();
		}).bind("contextmenu", function(e) {
			var tr = $(e.target).closest("tr.datagrid-row");
			if (!tr.length) {
				return;
			}
			var _72 = _6c(tr);
			var row = _61.finder.getRow(_5e, _72);
			_61.onRowContextMenu.call(_5e, e, _72, row);
			e.stopPropagation();
		});
		dc.body2.bind("scroll", function() {
			dc.view1.children("div.datagrid-body").scrollTop($(this).scrollTop());
			dc.view2.children("div.datagrid-header,div.datagrid-footer")._scrollLeft($(this)._scrollLeft());
			dc.body2.children("table.datagrid-btable-frozen").css("left", -$(this)._scrollLeft());
		});
		function _6c(tr) {
			if (tr.attr("datagrid-row-index")) {
				return parseInt(tr.attr("datagrid-row-index"));
			} else {
				return tr.attr("node-id");
			}
		}
		;
	}
	;
	function _73(_74) {
		var _75 = $.data(_74, "datagrid").options;
		var dc = $.data(_74, "datagrid").dc;
		if (!_75.fitColumns) {
			return;
		}
		var _76 = dc.view2.children("div.datagrid-header");
		var _77 = 0;
		var _78;
		var _79 = _46(_74, false);
		for ( var i = 0; i < _79.length; i++) {
			var col = getColumnOption(_74, _79[i]);
			if (_7a(col)) {
				_77 += col.width;
				_78 = col;
			}
		}
		var _7b = _76.children("div.datagrid-header-inner").show();
		var _7c = _76.width() - _76.find("table").width() - _75.scrollbarSize;
		var _7d = _7c / _77;
		if (!_75.showHeader) {
			_7b.hide();
		}
		for ( var i = 0; i < _79.length; i++) {
			var col = getColumnOption(_74, _79[i]);
			if (_7a(col)) {
				var _7e = Math.floor(col.width * _7d);
				_7f(col, _7e);
				_7c -= _7e;
			}
		}
		if (_7c && _78) {
			_7f(_78, _7c);
		}
		_3e(_74);
		function _7f(col, _80) {
			col.width += _80;
			col.boxWidth += _80;
			_76.find("td[field=\"" + col.field + "\"] div.datagrid-cell").width(col.boxWidth);
		}
		;
		function _7a(col) {
			if (!col.hidden && !col.checkbox && !col.auto) {
				return true;
			}
		}
		;
	}
	;
	function _81(_82, _83) {
		var _84 = $.data(_82, "datagrid").options;
		var dc = $.data(_82, "datagrid").dc;
		if (_83) {
			_9(_83);
			if (_84.fitColumns) {
				_e(_82);
				_73(_82);
			}
		} else {
			var _85 = false;
			var _86 = _46(_82, true).concat(_46(_82, false));
			for ( var i = 0; i < _86.length; i++) {
				var _83 = _86[i];
				var col = getColumnOption(_82, _83);
				if (col.auto) {
					_9(_83);
					_85 = true;
				}
			}
			if (_85 && _84.fitColumns) {
				_e(_82);
				_73(_82);
			}
		}
		function _9(_87) {
			var _88 = dc.view.find("div.datagrid-header td[field=\"" + _87 + "\"] div.datagrid-cell");
			_88.css("width", "");
			var col = $(_82).datagrid("getColumnOption", _87);
			col.width = undefined;
			col.boxWidth = undefined;
			col.auto = true;
			$(_82).datagrid("fixColumnSize", _87);
			var _89 = Math.max(_88._outerWidth(), _8a("allbody"), _8a("allfooter"));
			_88._outerWidth(_89);
			col.width = _89;
			col.boxWidth = parseInt(_88[0].style.width);
			$(_82).datagrid("fixColumnSize", _87);
			_84.onResizeColumn.call(_82, _87, col.width);
			function _8a(_8b) {
				var _8c = 0;
				_84.finder.getTr(_82, 0, _8b).find("td[field=\"" + _87 + "\"] div.datagrid-cell").each(function() {
					var w = $(this)._outerWidth();
					if (_8c < w) {
						_8c = w;
					}
				});
				return _8c;
			}
			;
		}
		;
	}
	;
	function _3e(_8d, _8e) {
		var _8f = $.data(_8d, "datagrid").options;
		var dc = $.data(_8d, "datagrid").dc;
		var _90 = dc.view.find("table.datagrid-btable,table.datagrid-ftable");
		_90.css("table-layout", "fixed");
		if (_8e) {
			fix(_8e);
		} else {
			var ff = _46(_8d, true).concat(_46(_8d, false));
			for ( var i = 0; i < ff.length; i++) {
				fix(ff[i]);
			}
		}
		_90.css("table-layout", "auto");
		_91(_8d);
		setTimeout(function() {
			fixRowHeight(_8d);
			fixRowWidth(_8d);
		}, 0);
		function fix(_92) {
			var col = getColumnOption(_8d, _92);
			if (col.checkbox) {
				return;
			}
			var _93 = dc.view.children("style")[0];
			var _94 = _93.styleSheet ? _93.styleSheet : (_93.sheet || document.styleSheets[document.styleSheets.length - 1]);
			var _95 = _94.cssRules || _94.rules;
			for ( var i = 0, len = _95.length; i < len; i++) {
				var _96 = _95[i];
				if ( col.cellSelector && _96.selectorText.toLowerCase() == col.cellSelector.toLowerCase()) {
					_96.style["width"] = col.boxWidth ? col.boxWidth + "px" : "auto";
					break;
				}
			}
		}
		;
	}
	;
	function _91(_97) {
		var dc = $.data(_97, "datagrid").dc;
		dc.body1.add(dc.body2).find("td.datagrid-td-merged").each(function() {
			var td = $(this);
			var _98 = td.attr("colspan") || 1;
			var _99 = getColumnOption(_97, td.attr("field")).width;
			for ( var i = 1; i < _98; i++) {
				td = td.next();
				_99 += getColumnOption(_97, td.attr("field")).width + 1;
			}
			$(this).children("div.datagrid-cell")._outerWidth(_99);
		});
	}
	;
	function fixRowWidth(target) {
		var dc = $.data(target, "datagrid").dc;
		dc.view.find("div.datagrid-editable").each(function() {
			var $this = $(this);
			var field = $this.parent().attr("field");
			var col = $(target).datagrid("getColumnOption", field);
			$this._outerWidth(col.width);
			var ed = $.data(this, "datagrid.editor");
			if (ed.actions.resize) {
				ed.actions.resize(ed.target, $this.width());
			}
		});
	}
	;
	function getColumnOption(target, field) {
		function _getColumn(columns) {
			if (columns) {
				for ( var i = 0; i < columns.length; i++) {
					var cc = columns[i];
					for ( var j = 0; j < cc.length; j++) {
						var c = cc[j];
						if (c.field == field) {
							return c;
						}
					}
				}
			}
			return null;
		}
		;
		var options = $.data(target, "datagrid").options;
		var col = _getColumn(options.columns);
		if (!col) {
			col = _getColumn(options.frozenColumns);
		}
		return col;
	}
	;
	function _46(_a3, _a4) {
		var _a5 = $.data(_a3, "datagrid").options;
		var _a6 = (_a4 == true) ? (_a5.frozenColumns || [ [] ]) : _a5.columns;
		if (_a6.length == 0) {
			return [];
		}
		var _a7 = [];
		function _a8(_a9) {
			var c = 0;
			var i = 0;
			while (true) {
				if (_a7[i] == undefined) {
					if (c == _a9) {
						return i;
					}
					c++;
				}
				i++;
			}
		}
		;
		function _aa(r) {
			var ff = [];
			var c = 0;
			for ( var i = 0; i < _a6[r].length; i++) {
				var col = _a6[r][i];
				if (col.field) {
					ff.push([ c, col.field ]);
				}
				c += parseInt(col.colspan || "1");
			}
			for ( var i = 0; i < ff.length; i++) {
				ff[i][0] = _a8(ff[i][0]);
			}
			for ( var i = 0; i < ff.length; i++) {
				var f = ff[i];
				_a7[f[0]] = f[1];
			}
		}
		;
		for ( var i = 0; i < _a6.length; i++) {
			_aa(i);
		}
		return _a7;
	}
	;
	function _ab(target, _ad) {
		var _ae = $.data(target, "datagrid");
		var opts = _ae.options;
		var dc = _ae.dc;
		_ad = opts.loadFilter.call(target, _ad);
		_ad.total = parseInt(_ad.total);
		_ae.data = _ad;
		if (_ad.footer) {
			_ae.footer = _ad.footer;
		}
		if (!opts.remoteSort) {
			var opt = getColumnOption(target, opts.sortName);
			if (opt) {
				var _b0 = opt.sorter || function(a, b) {
					return (a > b ? 1 : -1);
				};
				_ad.rows.sort(function(r1, r2) {
					return _b0(r1[opts.sortName], r2[opts.sortName]) * (opts.sortOrder == "asc" ? 1 : -1);
				});
			}
		}
		if (opts.view.onBeforeRender) {
			opts.view.onBeforeRender.call(opts.view, target, _ad.rows);
		}
		opts.view.render.call(opts.view, target, dc.body2, false);
		opts.view.render.call(opts.view, target, dc.body1, true);
		if (opts.showFooter) {
			opts.view.renderFooter.call(opts.view, target, dc.footer2, false);
			opts.view.renderFooter.call(opts.view, target, dc.footer1, true);
		}
		if (opts.view.onAfterRender) {
			opts.view.onAfterRender.call(opts.view, target);
		}
		if (opts.view.onRenderPlaceholder) {//渲染placeholder
			opts.view.onRenderPlaceholder.call(opts.view, target);
		}
		dc.view.children("style:gt(0)").remove();
		opts.onLoadSuccess.call(target, _ad);
		opts.onLoadComplete.call(target, _ad);
		var _b1 = $(target).datagrid("getPager");
		if (_b1.length) {
			if (_b1.pagination("options").total != _ad.total) {
				_b1.pagination("refresh", {
					total : _ad.total
				});
			}
		}
		fixRowHeight(target);
		dc.body2.triggerHandler("scroll");
		_setSelected();
		$(target).datagrid("autoSizeColumn");
		function _setSelected() {
			if (opts.idField) {
				for ( var i = 0; i < _ad.rows.length; i++) {
					var row = _ad.rows[i];
					if (__exist(_ae.selectedRows, row)) {
						_selectRow(target, i, true);
					}
					if (__exist(_ae.checkedRows, row)) {
						_checkRow(target, i, true);
					}
				}
				$.each(_ad.rows, function(i, row){//选中默认选中行
					var checked = opts.rowChecker.call(target, row, i);
					if( checked != undefined && checked){
						_selectRecord(target, row[opts.idField], false);
					}
				});
			}
			function __exist(a, r) {
				for ( var i = 0; i < a.length; i++) {
					if (a[i][opts.idField] == r[opts.idField]) {
						a[i] = r;
						return true;
					}
				}
				return false;
			}
			;
		}
		;
	}
	;
	function _getRowIndex(_b5, row) {
		var _b6 = $.data(_b5, "datagrid").options;
		var _b7 = $.data(_b5, "datagrid").data.rows;
		if (typeof row == "object") {
			return _2(_b7, row);
		} else {
			for ( var i = 0; i < _b7.length; i++) {
				if (_b7[i][_b6.idField] == row) {
					return i;
				}
			}
			return -1;
		}
	}
	;
	function _b8(_b9) {
		var _ba = $.data(_b9, "datagrid");
		var _bb = _ba.options;
		var _bc = _ba.data;
		if (_bb.idField) {
			return _ba.selectedRows;
		} else {
			var _bd = [];
			_bb.finder.getTr(_b9, "", "selected", 2).each(function() {
				var _be = parseInt($(this).attr("datagrid-row-index"));
				_bd.push(_bc.rows[_be]);
			});
			return _bd;
		}
	}
	;
	function _bf(_c0) {
		var _c1 = $.data(_c0, "datagrid");
		var _c2 = _c1.options;
		if (_c2.idField) {
			return _c1.checkedRows;
		} else {
			var _c3 = [];
			_c1.dc.view.find("div.datagrid-cell-check input:checked").each(function() {
				var _c4 = $(this).closest("tr.datagrid-row").attr("datagrid-row-index");
				_c3.push(_c2.finder.getRow(_c0, _c4));
			});
			return _c3;
		}
	}
	;
	function _selectRecord(_c6, _c7, fire) {
		var _c8 = $.data(_c6, "datagrid").options;
		if (_c8.idField) {
			var _c9 = _getRowIndex(_c6, _c7);
			if (_c9 >= 0) {
				_selectRow(_c6, _c9, null, fire);
			}
		}
	}
	;
	function _selectRow(_cb, _cc, _cd, fire) {
		var _ce = $.data(_cb, "datagrid");
		var dc = _ce.dc;
		var _cf = _ce.options;
		var _d0 = _ce.selectedRows;
		if (_cf.singleSelect) {
			_d1(_cb);
			_d0.splice(0, _d0.length);
		}
		if (!_cd && _cf.checkOnSelect) {
			_checkRow(_cb, _cc, true);
		}
		var row = _cf.finder.getRow(_cb, _cc);
		if (_cf.idField) {
			_7(_d0, _cf.idField, row);
		}
		if( $.type(fire) == "undefined" || fire){
			_cf.onSelect.call(_cb, _cc, row);
		}
		var tr = _cf.finder.getTr(_cb, _cc).addClass("datagrid-row-selected");
		if (tr.length) {
			if (tr.closest("table").hasClass("datagrid-btable-frozen")) {
				return;
			}
			var _d3 = dc.view2.children("div.datagrid-header")._outerHeight();
			var _d4 = dc.body2;
			var _d5 = _d4.outerHeight(true) - _d4.outerHeight();
			var top = tr.position().top - _d3 - _d5;
			if (top < 0) {
				_d4.scrollTop(_d4.scrollTop() + top);
			} else {
				if (top + tr._outerHeight() > _d4.height() - 18) {
					_d4.scrollTop(_d4.scrollTop() + top + tr._outerHeight() - _d4.height() + 18);
				}
			}
		}
	}
	;
	function _d6(_d7, _d8, _d9) {
		var _da = $.data(_d7, "datagrid");
		var dc = _da.dc;
		var _db = _da.options;
		var _dc = $.data(_d7, "datagrid").selectedRows;
		if (!_d9 && _db.checkOnSelect) {
			_dd(_d7, _d8, true);
		}
		_db.finder.getTr(_d7, _d8).removeClass("datagrid-row-selected");
		var row = _db.finder.getRow(_d7, _d8);
		if (_db.idField) {
			_4(_dc, _db.idField, row[_db.idField]);
		}
		_db.onUnselect.call(_d7, _d8, row);
	}
	;
	function _de(_df, _e0) {
		var _e1 = $.data(_df, "datagrid");
		var _e2 = _e1.options;
		var _e3 = _e1.data.rows;
		var _e4 = $.data(_df, "datagrid").selectedRows;
		if (!_e0 && _e2.checkOnSelect) {
			_e5(_df, true);
		}
		_e2.finder.getTr(_df, "", "allbody").addClass("datagrid-row-selected");
		if (_e2.idField) {
			for ( var _e6 = 0; _e6 < _e3.length; _e6++) {
				_7(_e4, _e2.idField, _e3[_e6]);
			}
		}
		_e2.onSelectAll.call(_df, _e3);
	}
	;
	function _d1(_e7, _e8) {
		var _e9 = $.data(_e7, "datagrid");
		var _ea = _e9.options;
		var _eb = _e9.data.rows;
		var _ec = $.data(_e7, "datagrid").selectedRows;
		if (!_e8 && _ea.checkOnSelect) {
			_ed(_e7, true);
		}
		_ea.finder.getTr(_e7, "", "selected").removeClass("datagrid-row-selected");
		if (_ea.idField) {
			for ( var _ee = 0; _ee < _eb.length; _ee++) {
				_4(_ec, _ea.idField, _eb[_ee][_ea.idField]);
			}
		}
		_ea.onUnselectAll.call(_e7, _eb);
	}
	;
	function _checkRow(_ef, _f0, _f1) {
		var _f2 = $.data(_ef, "datagrid");
		var _f3 = _f2.options;
		if (!_f1 && _f3.selectOnCheck) {
			_selectRow(_ef, _f0, true);
		}
		var ck = _f3.finder.getTr(_ef, _f0).find("div.datagrid-cell-check input[type=checkbox]");
		ck._propAttr("checked", true);
		ck = _f3.finder.getTr(_ef, "", "allbody").find("div.datagrid-cell-check input[type=checkbox]:not(:checked)");
		if (!ck.length) {
			var dc = _f2.dc;
			var _f4 = dc.header1.add(dc.header2);
			_f4.find("input[type=checkbox]")._propAttr("checked", true);
		}
		var row = _f3.finder.getRow(_ef, _f0);
		if (_f3.idField) {
			_7(_f2.checkedRows, _f3.idField, row);
		}
		_f3.onCheck.call(_ef, _f0, row);
	}
	;
	function _dd(_f5, _f6, _f7) {
		var _f8 = $.data(_f5, "datagrid");
		var _f9 = _f8.options;
		if (!_f7 && _f9.selectOnCheck) {
			_d6(_f5, _f6, true);
		}
		var ck = _f9.finder.getTr(_f5, _f6).find("div.datagrid-cell-check input[type=checkbox]");
		ck._propAttr("checked", false);
		var dc = _f8.dc;
		var _fa = dc.header1.add(dc.header2);
		_fa.find("input[type=checkbox]")._propAttr("checked", false);
		var row = _f9.finder.getRow(_f5, _f6);
		if (_f9.idField) {
			_4(_f8.checkedRows, _f9.idField, row[_f9.idField]);
		}
		_f9.onUncheck.call(_f5, _f6, row);
	}
	;
	function _e5(_fb, _fc) {
		var _fd = $.data(_fb, "datagrid");
		var _fe = _fd.options;
		var _ff = _fd.data.rows;
		if (!_fc && _fe.selectOnCheck) {
			_de(_fb, true);
		}
		var dc = _fd.dc;
		var hck = dc.header1.add(dc.header2).find("input[type=checkbox]");
		var bck = _fe.finder.getTr(_fb, "", "allbody").find("div.datagrid-cell-check input[type=checkbox]");
		hck.add(bck)._propAttr("checked", true);
		if (_fe.idField) {
			for ( var i = 0; i < _ff.length; i++) {
				_7(_fd.checkedRows, _fe.idField, _ff[i]);
			}
		}
		_fe.onCheckAll.call(_fb, _ff);
	}
	;
	function _ed(_100, _101) {
		var _102 = $.data(_100, "datagrid");
		var opts = _102.options;
		var rows = _102.data.rows;
		if (!_101 && opts.selectOnCheck) {
			_d1(_100, true);
		}
		var dc = _102.dc;
		var hck = dc.header1.add(dc.header2).find("input[type=checkbox]");
		var bck = opts.finder.getTr(_100, "", "allbody").find("div.datagrid-cell-check input[type=checkbox]");
		hck.add(bck)._propAttr("checked", false);
		if (opts.idField) {
			for ( var i = 0; i < rows.length; i++) {
				_4(_102.checkedRows, opts.idField, rows[i][opts.idField]);
			}
		}
		opts.onUncheckAll.call(_100, rows);
	}
	;
	function beginEdit(target, index) {
		var opts = $.data(target, "datagrid").options;
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (tr.hasClass("datagrid-row-editing")) {
			return;
		}
		if (opts.onBeforeEdit.call(target, index, row) == false) {
			return;
		}
		tr.addClass("datagrid-row-editing");
		initEditRow(target, index);
		fixRowWidth(target);
		tr.find("div.datagrid-editable").each(function() {
			var field = $(this).parent().attr("field");
			var ed = $.data(this, "datagrid.editor");
			ed.actions.setValue(ed.target, row[field]);
		});
		validateRow(target, index);
	}
	;
	function _109(_10a, _10b, _10c) {
		var opts = $.data(_10a, "datagrid").options;
		var _10d = $.data(_10a, "datagrid").updatedRows;
		var _10e = $.data(_10a, "datagrid").insertedRows;
		var tr = opts.finder.getTr(_10a, _10b);
		var row = opts.finder.getRow(_10a, _10b);
		if (!tr.hasClass("datagrid-row-editing")) {
			return;
		}
		if (!_10c) {
			if (!validateRow(_10a, _10b)) {
				return;
			}
			var _10f = false;
			var _110 = {};
			tr.find("div.datagrid-editable").each(function() {
				var _111 = $(this).parent().attr("field");
				var ed = $.data(this, "datagrid.editor");
				var _112 = ed.actions.getValue(ed.target);
				if (row[_111] != _112) {
					row[_111] = _112;
					_10f = true;
					_110[_111] = _112;
				}
			});
			if (_10f) {
				if (_2(_10e, row) == -1) {
					if (_2(_10d, row) == -1) {
						_10d.push(row);
					}
				}
			}
		}
		tr.removeClass("datagrid-row-editing");
		_113(_10a, _10b);
		$(_10a).datagrid("refreshRow", _10b);
		if (!_10c) {
			opts.onAfterEdit.call(_10a, _10b, row, _110);
		} else {
			opts.onCancelEdit.call(_10a, _10b, row);
		}
	}
	;
	function _114(_115, _116) {
		var opts = $.data(_115, "datagrid").options;
		var tr = opts.finder.getTr(_115, _116);
		var _117 = [];
		tr.children("td").each(function() {
			var cell = $(this).find("div.datagrid-editable");
			if (cell.length) {
				var ed = $.data(cell[0], "datagrid.editor");
				_117.push(ed);
			}
		});
		return _117;
	}
	;
	function _118(_119, _11a) {
		var _11b = _114(_119, _11a.index);
		for ( var i = 0; i < _11b.length; i++) {
			if (_11b[i].field == _11a.field) {
				return _11b[i];
			}
		}
		return null;
	}
	;
	function initEditRow(target, index, value) {
		var opts = $.data(target, "datagrid").options;
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		tr.children("td").each(function() {
			var cell = $(this).find("div.datagrid-cell");
			var field = $(this).attr("field");
			var col = getColumnOption(target, field);
			if (col && col.editor) {
				var type, editorOptions;
				if (typeof col.editor == "string") {
					type = col.editor;
				} else {
					type = col.editor.type;
					editorOptions = col.editor.options;
				}
				var editor = opts.editors[type];
				if (editor) {
					var oldHtml = cell.html();
					var outerWidth = cell._outerWidth();
					cell.addClass("datagrid-editable");
					cell._outerWidth(outerWidth);
					cell.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
					cell.children("table").bind("click dblclick contextmenu", function(e) {
						e.stopPropagation();
					});
					$.data(cell[0], "datagrid.editor", {
						actions : editor,
						target : editor.init(cell.find("td"), editorOptions, row[field]),
						field : field,
						type : type,
						oldHtml : oldHtml
					});
				}
			}
		});
		fixRowHeight(target, index, true);
	}
	;
	function _113(_124, _125) {
		var opts = $.data(_124, "datagrid").options;
		var tr = opts.finder.getTr(_124, _125);
		tr.children("td").each(function() {
			var cell = $(this).find("div.datagrid-editable");
			if (cell.length) {
				var ed = $.data(cell[0], "datagrid.editor");
				if (ed.actions.destroy) {
					ed.actions.destroy(ed.target);
				}
				cell.html(ed.oldHtml);
				$.removeData(cell[0], "datagrid.editor");
				cell.removeClass("datagrid-editable");
				cell.css("width", "");
			}
		});
	}
	;
	function validateRow(_126, _127) {
		var tr = $.data(_126, "datagrid").options.finder.getTr(_126, _127);
		if (!tr.hasClass("datagrid-row-editing")) {
			return true;
		}
		var vbox = tr.find(".validatebox-text");
		vbox.validatebox("validate");
		vbox.trigger("mouseleave");
		var _128 = tr.find(".validatebox-invalid");
		return _128.length == 0;
	}
	;
	function _129(_12a, _12b) {
		var _12c = $.data(_12a, "datagrid").insertedRows;
		var _12d = $.data(_12a, "datagrid").deletedRows;
		var _12e = $.data(_12a, "datagrid").updatedRows;
		if (!_12b) {
			var rows = [];
			rows = rows.concat(_12c);
			rows = rows.concat(_12d);
			rows = rows.concat(_12e);
			return rows;
		} else {
			if (_12b == "inserted") {
				return _12c;
			} else {
				if (_12b == "deleted") {
					return _12d;
				} else {
					if (_12b == "updated") {
						return _12e;
					}
				}
			}
		}
		return [];
	}
	;
	function deleteRow(_130, _131) {
		var _132 = $.data(_130, "datagrid");
		var opts = _132.options;
		var data = _132.data;
		var _133 = _132.insertedRows;
		var _134 = _132.deletedRows;
		$(_130).datagrid("cancelEdit", _131);
		var row = data.rows[_131];
		if (_2(_133, row) >= 0) {
			_4(_133, row);
		} else {
			_134.push(row);
		}
		_4(_132.selectedRows, opts.idField, data.rows[_131][opts.idField]);
		_4(_132.checkedRows, opts.idField, data.rows[_131][opts.idField]);
		opts.view.deleteRow.call(opts.view, _130, _131);
		if (opts.height == "auto") {
			fixRowHeight(_130);
		}
		$(_130).datagrid("getPager").pagination("refresh", {
			total : data.total
		});
	}
	;
	function _135(_136, _137) {
		var data = $.data(_136, "datagrid").data;
		var view = $.data(_136, "datagrid").options.view;
		var _138 = $.data(_136, "datagrid").insertedRows;
		view.insertRow.call(view, _136, _137.index, _137.row);
		_138.push(_137.row);
		$(_136).datagrid("getPager").pagination("refresh", {
			total : data.total
		});
	}
	;
	function _139(_13a, row) {
		var data = $.data(_13a, "datagrid").data;
		var view = $.data(_13a, "datagrid").options.view;
		var _13b = $.data(_13a, "datagrid").insertedRows;
		view.insertRow.call(view, _13a, null, row);
		_13b.push(row);
		$(_13a).datagrid("getPager").pagination("refresh", {
			total : data.total
		});
	}
	;
	function _13c(_13d) {
		var _13e = $.data(_13d, "datagrid");
		var data = _13e.data;
		var rows = data.rows;
		var _13f = [];
		for ( var i = 0; i < rows.length; i++) {
			_13f.push($.extend({}, rows[i]));
		}
		_13e.originalRows = _13f;
		_13e.updatedRows = [];
		_13e.insertedRows = [];
		_13e.deletedRows = [];
	}
	;
	function _140(_141) {
		var data = $.data(_141, "datagrid").data;
		var ok = true;
		for ( var i = 0, len = data.rows.length; i < len; i++) {
			if (validateRow(_141, i)) {
				_109(_141, i, false);
			} else {
				ok = false;
			}
		}
		if (ok) {
			_13c(_141);
		}
	}
	;
	function _142(_143) {
		var _144 = $.data(_143, "datagrid");
		var opts = _144.options;
		var _145 = _144.originalRows;
		var _146 = _144.insertedRows;
		var _147 = _144.deletedRows;
		var _148 = _144.selectedRows;
		var _149 = _144.checkedRows;
		var data = _144.data;
		function _14a(a) {
			var ids = [];
			for ( var i = 0; i < a.length; i++) {
				ids.push(a[i][opts.idField]);
			}
			return ids;
		}
		;
		function _14b(ids, _14c) {
			for ( var i = 0; i < ids.length; i++) {
				var _14d = _getRowIndex(_143, ids[i]);
				(_14c == "s" ? _selectRow : _checkRow)(_143, _14d, true);
			}
		}
		;
		for ( var i = 0; i < data.rows.length; i++) {
			_109(_143, i, true);
		}
		var _14e = _14a(_148);
		var _14f = _14a(_149);
		_148.splice(0, _148.length);
		_149.splice(0, _149.length);
		data.total += _147.length - _146.length;
		data.rows = _145;
		_ab(_143, data);
		_14b(_14e, "s");
		_14b(_14f, "c");
		_13c(_143);
	}
	;
	function _150(_151, _152) {
		var opts = $.data(_151, "datagrid").options;
		if (_152) {
			opts.queryParams = _152;
		}
		var _153 = $.extend({}, opts.queryParams);
		if (opts.pagination) {
			$.extend(_153, {
				page : opts.pageNumber,
				rows : opts.pageSize
			});
		}
		if (opts.sortName) {
			$.extend(_153, {
				sort : opts.sortName,
				order : opts.sortOrder
			});
		}
		if (opts.onBeforeLoad.call(_151, _153) == false) {
			return;
		}
		$(_151).datagrid("loading");
		setTimeout(function() {
			_154();
		}, 0);
		function _154() {
			var _155 = opts.loader.call(_151, _153, function(data) {
				setTimeout(function() {
					$(_151).datagrid("loaded");
				}, 0);
				_ab(_151, data);
				setTimeout(function() {
					_13c(_151);
				}, 0);
			}, function() {
				setTimeout(function() {
					$(_151).datagrid("loaded");
				}, 0);
				opts.onLoadError.apply(_151, arguments);
			});
			if (_155 == false) {
				$(_151).datagrid("loaded");
			}
		}
		;
	}
	;
	function _156(_157, _158) {
		var opts = $.data(_157, "datagrid").options;
		_158.rowspan = _158.rowspan || 1;
		_158.colspan = _158.colspan || 1;
		if (_158.rowspan == 1 && _158.colspan == 1) {
			return;
		}
		var tr = opts.finder.getTr(_157, (_158.index != undefined ? _158.index : _158.id));
		if (!tr.length) {
			return;
		}
		var row = opts.finder.getRow(_157, tr);
		var _159 = row[_158.field];
		var td = tr.find("td[field=\"" + _158.field + "\"]");
		td.attr("rowspan", _158.rowspan).attr("colspan", _158.colspan);
		td.addClass("datagrid-td-merged");
		for ( var i = 1; i < _158.colspan; i++) {
			td = td.next();
			td.hide();
			row[td.attr("field")] = _159;
		}
		for ( var i = 1; i < _158.rowspan; i++) {
			tr = tr.next();
			if (!tr.length) {
				break;
			}
			var row = opts.finder.getRow(_157, tr);
			var td = tr.find("td[field=\"" + _158.field + "\"]").hide();
			row[td.attr("field")] = _159;
			for ( var j = 1; j < _158.colspan; j++) {
				td = td.next();
				td.hide();
				row[td.attr("field")] = _159;
			}
		}
		_91(_157);
	}
	;
	$.fn.datagrid = function(_15a, _15b) {
		if (typeof _15a == "string") {
			return $.fn.datagrid.methods[_15a](this, _15b);
		}
		_15a = _15a || {};
		return this.each(function() {
			var _15c = $.data(this, "datagrid");
			var opts;
			if (_15c) {
				opts = $.extend(_15c.options, _15a);
				_15c.options = opts;
			} else {
				opts = $.extend({}, $.extend({}, $.fn.datagrid.defaults, {
					queryParams : {}
				}), $.fn.datagrid.parseOptions(this), _15a);
				$(this).css("width", "").css("height", "");
				var _15d = _34(this, opts.rownumbers);
				if (!opts.columns) {
					opts.columns = _15d.columns;
				}
				if (!opts.frozenColumns) {
					opts.frozenColumns = _15d.frozenColumns;
				}
				opts.columns = $.extend(true, [], opts.columns);
				opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
				opts.view = $.extend({}, opts.view);
				$.data(this, "datagrid", {
					options : opts,
					panel : _15d.panel,
					dc : _15d.dc,
					selectedRows : [],
					checkedRows : [],
					data : {
						total : 0,
						rows : []
					},
					originalRows : [],
					updatedRows : [],
					insertedRows : [],
					deletedRows : []
				});
			}
			_47(this);
			if (opts.data) {
				_ab(this, opts.data);
				_13c(this);
			} else {
				var data = _42(this);
				if (data.total > 0) {
					_ab(this, data);
					_13c(this);
				}
			}
			_9(this);
			_150(this);
			_5d(this);
		});
	};
	var _15e = {
		text : {
			init : function(_15f, _160) {
				var _161 = $("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_15f);
				return _161;
			},
			getValue : function(_162) {
				return $(_162).val();
			},
			setValue : function(_163, _164) {
				$(_163).val(_164);
			},
			resize : function(_165, _166) {
				$(_165)._outerWidth(_166);
			}
		},
		textarea : {
			init : function(_167, _168) {
				var _169 = $("<textarea class=\"datagrid-editable-input\"></textarea>").appendTo(_167);
				if( _168 && (_168.required || _168.validType) ){
					_169.validatebox(_168);
				}
				return _169;
			},
			getValue : function(_16a) {
				return $(_16a).val();
			},
			setValue : function(_16b, _16c) {
				$(_16b).val(_16c);
			},
			resize : function(_16d, _16e) {
				$(_16d)._outerWidth(_16e);
			}
		},
		checkbox : {
			init : function(_16f, _170) {
				var _171 = $("<input type=\"checkbox\">").appendTo(_16f);
				_171.val(_170.on);
				_171.attr("offval", _170.off);
				return _171;
			},
			getValue : function(_172) {
				if ($(_172).is(":checked")) {
					return $(_172).val();
				} else {
					return $(_172).attr("offval");
				}
			},
			setValue : function(_173, _174) {
				var _175 = false;
				if ($(_173).val() == _174) {
					_175 = true;
				}
				$(_173)._propAttr("checked", _175);
			}
		},
		numberbox : {
			init : function(_176, _177) {
				var _178 = $("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_176);
				_178.numberbox(_177);
				return _178;
			},
			destroy : function(_179) {
				$(_179).numberbox("destroy");
			},
			getValue : function(_17a) {
				$(_17a).blur();
				return $(_17a).numberbox("getValue");
			},
			setValue : function(_17b, _17c) {
				$(_17b).numberbox("setValue", _17c);
			},
			resize : function(_17d, _17e) {
				$(_17d)._outerWidth(_17e);
			}
		},
		validatebox : {
			init : function(_17f, _180) {
				var _181 = $("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_17f);
				_181.validatebox(_180);
				return _181;
			},
			destroy : function(_182) {
				$(_182).validatebox("destroy");
			},
			getValue : function(_183) {
				return $(_183).val();
			},
			setValue : function(_184, _185) {
				$(_184).val(_185);
			},
			resize : function(_186, _187) {
				$(_186)._outerWidth(_187);
			}
		},
		datebox : {
			init : function(_188, _189) {
				var _18a = $("<input type=\"text\">").appendTo(_188);
				_18a.datebox(_189);
				return _18a;
			},
			destroy : function(_18b) {
				$(_18b).datebox("destroy");
			},
			getValue : function(_18c) {
				return $(_18c).datebox("getValue");
			},
			setValue : function(_18d, _18e) {
				$(_18d).datebox("setValue", _18e);
			},
			resize : function(_18f, _190) {
				$(_18f).datebox("resize", _190);
			}
		},
		combobox : {
			init : function(_191, _192) {
				var _193 = $("<input type=\"text\">").appendTo(_191);
				_193.combobox(_192 || {});
				return _193;
			},
			destroy : function(_194) {
				$(_194).combobox("destroy");
			},
			getValue : function(_195) {
				return $(_195).combobox("getValue");
			},
			setValue : function(_196, _197) {
				$(_196).combobox("setValue", _197);
			},
			resize : function(_198, _199) {
				$(_198).combobox("resize", _199);
			}
		},
		combotree : {
			init : function(_19a, _19b) {
				var _19c = $("<input type=\"text\">").appendTo(_19a);
				_19c.combotree(_19b);
				return _19c;
			},
			destroy : function(_19d) {
				$(_19d).combotree("destroy");
			},
			getValue : function(_19e) {
				return $(_19e).combotree("getValue");
			},
			setValue : function(_19f, _1a0) {
				$(_19f).combotree("setValue", _1a0);
			},
			resize : function(_1a1, _1a2) {
				$(_1a1).combotree("resize", _1a2);
			}
		}
	};
	$.fn.datagrid.methods = {
		options : function(jq) {
			var _1a3 = $.data(jq[0], "datagrid").options;
			var _1a4 = $.data(jq[0], "datagrid").panel.panel("options");
			var opts = $.extend(_1a3, {
				width : _1a4.width,
				height : _1a4.height,
				closed : _1a4.closed,
				collapsed : _1a4.collapsed,
				minimized : _1a4.minimized,
				maximized : _1a4.maximized
			});
			return opts;
		},
		getPanel : function(jq) {
			return $.data(jq[0], "datagrid").panel;
		},
		getPager : function(jq) {
			return $.data(jq[0], "datagrid").panel.children("div.datagrid-pager");
		},
		getColumnFields : function(jq, _1a5) {
			return _46(jq[0], _1a5);
		},
		getColumnOption : function(jq, _1a6) {
			return getColumnOption(jq[0], _1a6);
		},
		resize : function(jq, _1a7) {
			return jq.each(function() {
				_9(this, _1a7);
			});
		},
		load : function(jq, _1a8) {
			return jq.each(function() {
				var opts = $(this).datagrid("options");
				opts.pageNumber = 1;
				var _1a9 = $(this).datagrid("getPager");
				_1a9.pagination({
					pageNumber : 1
				});
				_150(this, _1a8);
			});
		},
		reload : function(jq, _1aa) {
			return jq.each(function() {
				_150(this, _1aa);
			});
		},
		reloadFooter : function(jq, _1ab) {
			return jq.each(function() {
				var opts = $.data(this, "datagrid").options;
				var dc = $.data(this, "datagrid").dc;
				if (_1ab) {
					$.data(this, "datagrid").footer = _1ab;
				}
				if (opts.showFooter) {
					opts.view.renderFooter.call(opts.view, this, dc.footer2, false);
					opts.view.renderFooter.call(opts.view, this, dc.footer1, true);
					if (opts.view.onAfterRender) {
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).datagrid("fixRowHeight");
				}
			});
		},
		loading : function(jq) {
			return jq.each(function() {
				var opts = $.data(this, "datagrid").options;
				$(this).datagrid("getPager").pagination("loading");
				if (opts.loadMsg) {
					var _1ac = $(this).datagrid("getPanel");
					$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(_1ac);
					var msg = $("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html(opts.loadMsg).appendTo(_1ac);
					msg.css("marginLeft", -msg.outerWidth() / 2);
				}
			});
		},
		loaded : function(jq) {
			return jq.each(function() {
				$(this).datagrid("getPager").pagination("loaded");
				var _1ad = $(this).datagrid("getPanel");
				_1ad.children("div.datagrid-mask-msg").remove();
				_1ad.children("div.datagrid-mask").remove();
			});
		},
		fitColumns : function(jq) {
			return jq.each(function() {
				_73(this);
			});
		},
		fixColumnSize : function(jq, _1ae) {
			return jq.each(function() {
				_3e(this, _1ae);
			});
		},
		fixRowHeight : function(jq, _1af) {
			return jq.each(function() {
				fixRowHeight(this, _1af);
			});
		},
		freezeRow : function(jq, _1b0) {
			return jq.each(function() {
				_2c(this, _1b0);
			});
		},
		autoSizeColumn : function(jq, _1b1) {
			return jq.each(function() {
				_81(this, _1b1);
			});
		},
		loadData : function(jq, data) {
			return jq.each(function() {
				_ab(this, data);
				_13c(this);
			});
		},
		getData : function(jq) {
			return $.data(jq[0], "datagrid").data;
		},
		getRows : function(jq) {
			return $.data(jq[0], "datagrid").data.rows;
		},
		getFooterRows : function(jq) {
			return $.data(jq[0], "datagrid").footer;
		},
		getRowIndex : function(jq, id) {
			return _getRowIndex(jq[0], id);
		},
		getChecked : function(jq) {
			return _bf(jq[0]);
		},
		getSelected : function(jq) {
			var rows = _b8(jq[0]);
			return rows.length > 0 ? rows[0] : null;
		},
		getSelections : function(jq) {
			return _b8(jq[0]);
		},
		clearSelections : function(jq) {
			return jq.each(function() {
				var _1b2 = $.data(this, "datagrid").selectedRows;
				_1b2.splice(0, _1b2.length);
				_d1(this);
			});
		},
		clearChecked : function(jq) {
			return jq.each(function() {
				var _1b3 = $.data(this, "datagrid").checkedRows;
				_1b3.splice(0, _1b3.length);
				_ed(this);
			});
		},
		selectAll : function(jq) {
			return jq.each(function() {
				_de(this);
			});
		},
		unselectAll : function(jq) {
			return jq.each(function() {
				_d1(this);
			});
		},
		selectRow : function(jq, _1b4) {
			return jq.each(function() {
				_selectRow(this, _1b4);
			});
		},
		selectRecord : function(jq, id) {
			return jq.each(function() {
				_selectRecord(this, id);
			});
		},
		unselectRow : function(jq, _1b5) {
			return jq.each(function() {
				_d6(this, _1b5);
			});
		},
		checkRow : function(jq, _1b6) {
			return jq.each(function() {
				_checkRow(this, _1b6);
			});
		},
		uncheckRow : function(jq, _1b7) {
			return jq.each(function() {
				_dd(this, _1b7);
			});
		},
		checkAll : function(jq) {
			return jq.each(function() {
				_e5(this);
			});
		},
		uncheckAll : function(jq) {
			return jq.each(function() {
				_ed(this);
			});
		},
		beginEdit : function(jq, param) {
			return jq.each(function() {
				beginEdit(this, param);
			});
		},
		endEdit : function(jq, _1b9) {
			return jq.each(function() {
				_109(this, _1b9, false);
			});
		},
		cancelEdit : function(jq, _1ba) {
			return jq.each(function() {
				_109(this, _1ba, true);
			});
		},
		getEditors : function(jq, _1bb) {
			return _114(jq[0], _1bb);
		},
		getEditor : function(jq, _1bc) {
			return _118(jq[0], _1bc);
		},
		refreshRow : function(jq, _1bd) {
			return jq.each(function() {
				var opts = $.data(this, "datagrid").options;
				opts.view.refreshRow.call(opts.view, this, _1bd);
			});
		},
		validateRow : function(jq, _1be) {
			return validateRow(jq[0], _1be);
		},
		updateRow : function(jq, _1bf) {
			return jq.each(function() {
				var opts = $.data(this, "datagrid").options;
				opts.view.updateRow.call(opts.view, this, _1bf.index, _1bf.row);
			});
		},
		appendRow : function(jq, row) {
			return jq.each(function() {
				_139(this, row);
			});
		},
		insertRow : function(jq, _1c0) {
			return jq.each(function() {
				_135(this, _1c0);
			});
		},
		deleteRow : function(jq, _1c1) {
			return jq.each(function() {
				deleteRow(this, _1c1);
			});
		},
		getChanges : function(jq, _1c2) {
			return _129(jq[0], _1c2);
		},
		acceptChanges : function(jq) {
			return jq.each(function() {
				_140(this);
			});
		},
		rejectChanges : function(jq) {
			return jq.each(function() {
				_142(this);
			});
		},
		mergeCells : function(jq, _1c3) {
			return jq.each(function() {
				_156(this, _1c3);
			});
		},
		showColumn : function(jq, _1c4) {
			return jq.each(function() {
				var _1c5 = $(this).datagrid("getPanel");
				_1c5.find("td[field=\"" + _1c4 + "\"]").show();
				$(this).datagrid("getColumnOption", _1c4).hidden = false;
				$(this).datagrid("fitColumns");
			});
		},
		hideColumn : function(jq, _1c6) {
			return jq.each(function() {
				var _1c7 = $(this).datagrid("getPanel");
				_1c7.find("td[field=\"" + _1c6 + "\"]").hide();
				$(this).datagrid("getColumnOption", _1c6).hidden = true;
				$(this).datagrid("fitColumns");
			});
		}
	};
	$.fn.datagrid.parseOptions = function(_1c8) {
		var t = $(_1c8);
		return $.extend({}, $.fn.panel.parseOptions(_1c8), $.parser.parseOptions(_1c8, [ "url", "toolbar", "idField", "sortName", "sortOrder", "pagePosition",
				"resizeHandle", {
					fitColumns : "boolean",
					autoRowHeight : "boolean",
					striped : "boolean",
					nowrap : "boolean"
				}, {
					rownumbers : "boolean",
					singleSelect : "boolean",
					checkOnSelect : "boolean",
					selectOnCheck : "boolean"
				}, {
					pagination : "boolean",
					pageSize : "number",
					pageNumber : "number"
				}, {
					remoteSort : "boolean",
					showHeader : "boolean",
					showFooter : "boolean"
				}, {
					scrollbarSize : "number"
				} ]), {
			pageList : (t.attr("pageList") ? eval(t.attr("pageList")) : undefined),
			loadMsg : (t.attr("loadMsg") != undefined ? t.attr("loadMsg") : undefined),
			rowStyler : (t.attr("rowStyler") ? $.eval(t.attr("rowStyler"), t) : undefined)
		});
	};
	var _1c9 = {
		render : function(_1ca, _1cb, _1cc) {
			var _1cd = $.data(_1ca, "datagrid");
			var opts = _1cd.options;
			var rows = _1cd.data.rows;
			var _1ce = $(_1ca).datagrid("getColumnFields", _1cc);
			if (_1cc) {
				if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))) {
					return;
				}
			}
			var _1cf = [ "<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>" ];
			for ( var i = 0; i < rows.length; i++) {
				var cls = (i % 2 && opts.striped) ? "class=\"datagrid-row datagrid-row-alt\"" : "class=\"datagrid-row\"";
				var _1d0 = opts.rowStyler ? opts.rowStyler.call(_1ca, i, rows[i]) : "";
				var _1d1 = _1d0 ? "style=\"" + _1d0 + "\"" : "";
				var _1d2 = _1cd.rowIdPrefix + "-" + (_1cc ? 1 : 2) + "-" + i;
				_1cf.push("<tr id=\"" + _1d2 + "\" datagrid-row-index=\"" + i + "\" " + cls + " " + _1d1 + ">");
				_1cf.push(this.renderRow.call(this, _1ca, _1ce, _1cc, i, rows[i]));
				_1cf.push("</tr>");
			}
			_1cf.push("</tbody></table>");
			$(_1cb).html(_1cf.join(""));
			th.bindEvent(_1cb);//绑定上下文的事件
		},
		renderFooter : function(_1d3, _1d4, _1d5) {
			var opts = $.data(_1d3, "datagrid").options;
			var rows = $.data(_1d3, "datagrid").footer || [];
			var _1d6 = $(_1d3).datagrid("getColumnFields", _1d5);
			var _1d7 = [ "<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>" ];
			for ( var i = 0; i < rows.length; i++) {
				_1d7.push("<tr class=\"datagrid-row\" datagrid-row-index=\"" + i + "\">");
				_1d7.push(this.renderRow.call(this, _1d3, _1d6, _1d5, i, rows[i]));
				_1d7.push("</tr>");
			}
			_1d7.push("</tbody></table>");
			$(_1d4).html(_1d7.join(""));
			th.bindEvent(_1d4);//绑定上下文的事件
		},
		renderRow : function(target, fields, _1da, index, row) {
			var opts = $.data(target, "datagrid").options;
			var cc = [];
			if (_1da && opts.rownumbers) {
				var _1dd = index + 1;
				if (opts.pagination) {
					_1dd += (opts.pageNumber - 1) * opts.pageSize;
				}
				cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">" + _1dd + "</div></td>");
			}
			for ( var i = 0; i < fields.length; i++) {
				var field = fields[i];
				var col = $(target).datagrid("getColumnOption", field);
				if (col) {
					var value = row[field];
					var css = col.styler ? (col.styler(value, row, index) || "") : "";
					var style = col.hidden ? "style=\"display:none;" + css + "\"" : (css ? "style=\"" + css + "\"" : "");
					cc.push("<td field=\"" + field + "\" " + style + ">");
					if (col.checkbox) {
						var style = "";
					} else {
						var style = "";
						if (col.align) {
							style += "text-align:" + col.align + ";";
						}
						if (!opts.nowrap) {
							style += "white-space:normal;height:auto;";
						} else {
							if (opts.autoRowHeight) {
								style += "height:auto;";
							}
						}
					}
					cc.push("<div style=\"" + style + "\" ");
					if (col.checkbox) {
						cc.push("class=\"datagrid-cell-check ");
					} else {
						cc.push("class=\"datagrid-cell " + col.cellClass);
					}
					cc.push("\">");
					if (col.checkbox) {
						cc.push("<input type=\"checkbox\" name=\"" + field + "\" value=\"" + (value != undefined ? value : "") + "\"/>");
					} else {
						if (col.formatter) {
							var text = col.formatter(value, row, index);
							cc.push( opts.formatter ? opts.formatter(text, row, index) : text );//全局的formatter情况
						} else {
							cc.push( opts.formatter ? opts.formatter(value, row, index) : value );//全局的formatter情况
						}
					}
					cc.push("</div>");
					cc.push("</td>");
				}
			}
			return cc.join("");
		},
		refreshRow : function(_1e2, _1e3) {
			this.updateRow.call(this, _1e2, _1e3, {});
		},
		updateRow : function(_1e4, _1e5, row) {
			var opts = $.data(_1e4, "datagrid").options;
			var rows = $(_1e4).datagrid("getRows");
			$.extend(rows[_1e5], row);
			var _1e6 = opts.rowStyler ? opts.rowStyler.call(_1e4, _1e5, rows[_1e5]) : "";
			function _1e7(_1e8) {
				var _1e9 = $(_1e4).datagrid("getColumnFields", _1e8);
				var tr = opts.finder.getTr(_1e4, _1e5, "body", (_1e8 ? 1 : 2));
				var _1ea = tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
				tr.html(this.renderRow.call(this, _1e4, _1e9, _1e8, _1e5, rows[_1e5]));
				th.bindEvent(tr);//绑定上下文的事件
				tr.attr("style", _1e6 || "");
				if (_1ea) {
					tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked", true);
				}
			}
			;
			_1e7.call(this, true);
			_1e7.call(this, false);
			$(_1e4).datagrid("fixRowHeight", _1e5);
		},
		insertRow : function(_1eb, _1ec, row) {
			var _1ed = $.data(_1eb, "datagrid");
			var opts = _1ed.options;
			var dc = _1ed.dc;
			var data = _1ed.data;
			if (_1ec == undefined || _1ec == null) {
				_1ec = data.rows.length;
			}
			if (_1ec > data.rows.length) {
				_1ec = data.rows.length;
			}
			function _1ee(_1ef) {
				var _1f0 = _1ef ? 1 : 2;
				for ( var i = data.rows.length - 1; i >= _1ec; i--) {
					var tr = opts.finder.getTr(_1eb, i, "body", _1f0);
					tr.attr("datagrid-row-index", i + 1);
					tr.attr("id", _1ed.rowIdPrefix + "-" + _1f0 + "-" + (i + 1));
					if (_1ef && opts.rownumbers) {
						var _1f1 = i + 2;
						if (opts.pagination) {
							_1f1 += (opts.pageNumber - 1) * opts.pageSize;
						}
						tr.find("div.datagrid-cell-rownumber").html(_1f1);
					}
				}
			}
			;
			function _1f2(_1f3) {
				var _1f4 = _1f3 ? 1 : 2;
				var _1f5 = $(_1eb).datagrid("getColumnFields", _1f3);
				var _1f6 = _1ed.rowIdPrefix + "-" + _1f4 + "-" + _1ec;
				var tr = "<tr id=\"" + _1f6 + "\" class=\"datagrid-row\" datagrid-row-index=\"" + _1ec + "\"></tr>";
				if (_1ec >= data.rows.length) {
					if (data.rows.length) {
						opts.finder.getTr(_1eb, "", "last", _1f4).after(tr);
					} else {
						var cc = _1f3 ? dc.body1 : dc.body2;
						cc.html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>" + tr + "</tbody></table>");
					}
				} else {
					opts.finder.getTr(_1eb, _1ec + 1, "body", _1f4).before(tr);
				}
			}
			;
			_1ee.call(this, true);
			_1ee.call(this, false);
			_1f2.call(this, true);
			_1f2.call(this, false);
			data.total += 1;
			data.rows.splice(_1ec, 0, row);
			this.refreshRow.call(this, _1eb, _1ec);
		},
		deleteRow : function(_1f7, _1f8) {
			var _1f9 = $.data(_1f7, "datagrid");
			var opts = _1f9.options;
			var data = _1f9.data;
			function _1fa(_1fb) {
				var _1fc = _1fb ? 1 : 2;
				for ( var i = _1f8 + 1; i < data.rows.length; i++) {
					var tr = opts.finder.getTr(_1f7, i, "body", _1fc);
					tr.attr("datagrid-row-index", i - 1);
					tr.attr("id", _1f9.rowIdPrefix + "-" + _1fc + "-" + (i - 1));
					if (_1fb && opts.rownumbers) {
						var _1fd = i;
						if (opts.pagination) {
							_1fd += (opts.pageNumber - 1) * opts.pageSize;
						}
						tr.find("div.datagrid-cell-rownumber").html(_1fd);
					}
				}
			}
			;
			opts.finder.getTr(_1f7, _1f8).remove();
			_1fa.call(this, true);
			_1fa.call(this, false);
			data.total -= 1;
			data.rows.splice(_1f8, 1);
		},
		onBeforeRender : function(_1fe, rows) {
		},
		onAfterRender : function(_1ff) {
			var opts = $.data(_1ff, "datagrid").options;
			if (opts.showFooter) {
				var _200 = $(_1ff).datagrid("getPanel").find("div.datagrid-footer");
				_200.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility", "hidden");
			}
		}
	};
	$.fn.datagrid.defaults = $.extend({}, $.fn.panel.defaults, {
		frozenColumns : undefined,
		columns : undefined,
		fitColumns : false,
		resizeHandle : "right",
		autoRowHeight : true,
		toolbar : null,
		striped : false,
		method : "post",
		nowrap : true,
		idField : null,
		url : null,
		data : null,
		loadMsg : "Processing, please wait ...",
		rownumbers : false,
		singleSelect : false,
		selectOnCheck : true,
		checkOnSelect : true,
		pagination : false,
		pagePosition : "bottom",
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10, 20, 30, 40, 50 ],
		queryParams : {},
		sortName : null,
		sortOrder : "asc",
		remoteSort : true,
		showHeader : true,
		showFooter : false,
		scrollbarSize : 18,
		rowStyler : function(_201, _202) {
		},
		rowChecker : function(_201, _202) {
		},
		loader : function(_203, _204, _205) {
			var opts = $(this).datagrid("options");
			if (!opts.url) {
				return false;
			}
			$.ajax({
				type : opts.method,
				url : opts.url,
				data : _203,
				dataType : "json",
				success : function(data) {
					_204(data);
				},
				error : function() {
					_205.apply(this, arguments);
				}
			});
		},
		loadFilter : function(data) {
			if (typeof data.length == "number" && typeof data.splice == "function") {
				return {
					total : data.length,
					rows : data
				};
			} else {
				return data;
			}
		},
		editors : _15e,
		finder : {
			getTr : function(_206, _207, type, _208) {
				type = type || "body";
				_208 = _208 || 0;
				var _209 = $.data(_206, "datagrid");
				var dc = _209.dc;
				var opts = _209.options;
				if (_208 == 0) {
					var tr1 = opts.finder.getTr(_206, _207, type, 1);
					var tr2 = opts.finder.getTr(_206, _207, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == "body") {
						var tr = $("#" + _209.rowIdPrefix + "-" + _208 + "-" + _207);
						if (!tr.length) {
							tr = (_208 == 1 ? dc.body1 : dc.body2).find(">table>tbody>tr[datagrid-row-index=" + _207 + "]");
						}
						return tr;
					} else {
						if (type == "footer") {
							return (_208 == 1 ? dc.footer1 : dc.footer2).find(">table>tbody>tr[datagrid-row-index=" + _207 + "]");
						} else {
							if (type == "selected") {
								return (_208 == 1 ? dc.body1 : dc.body2).find(">table>tbody>tr.datagrid-row-selected");
							} else {
								if (type == "last") {
									return (_208 == 1 ? dc.body1 : dc.body2).find(">table>tbody>tr[datagrid-row-index]:last");
								} else {
									if (type == "allbody") {
										return (_208 == 1 ? dc.body1 : dc.body2).find(">table>tbody>tr[datagrid-row-index]");
									} else {
										if (type == "allfooter") {
											return (_208 == 1 ? dc.footer1 : dc.footer2).find(">table>tbody>tr[datagrid-row-index]");
										}
									}
								}
							}
						}
					}
				}
			},
			getRow : function(_20a, p) {
				var _20b = (typeof p == "object") ? p.attr("datagrid-row-index") : p;
				return $.data(_20a, "datagrid").data.rows[parseInt(_20b)];
			}
		},
		view : _1c9,
		onBeforeLoad : function(_20c) {
		},
		onLoadSuccess : function() {
		},
		onLoadError : function() {
		},
		onClickRow : function(_20d, _20e) {
		},
		onDblClickRow : function(_20f, _210) {
		},
		onClickCell : function(_211, _212, _213) {
		},
		onDblClickCell : function(_214, _215, _216) {
		},
		onSortColumn : function(sort, _217) {
		},
		onResizeColumn : function(_218, _219) {
		},
		onSelect : function(_21a, _21b) {
		},
		onUnselect : function(_21c, _21d) {
		},
		onSelectAll : function(rows) {
		},
		onUnselectAll : function(rows) {
		},
		onCheck : function(_21e, _21f) {
		},
		onUncheck : function(_220, _221) {
		},
		onCheckAll : function(rows) {
		},
		onUncheckAll : function(rows) {
		},
		onBeforeEdit : function(_222, _223) {
		},
		onAfterEdit : function(_224, _225, _226) {
		},
		onCancelEdit : function(_227, _228) {
		},
		onHeaderContextMenu : function(e, _229) {
		},
		onRowContextMenu : function(e, _22a, _22b) {
		},
		onLoadComplete : function(e, _22a, _22b) {
		}
	});
})(jQuery);

/**
 * propertygrid - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	var currTarget;
	
	function buildGrid(target){
		var state = $.data(target, 'propertygrid');
		var opts = $.data(target, 'propertygrid').options;
		$(target).datagrid($.extend({}, opts, {
			cls:'propertygrid',
			view:(opts.showGroup ? groupview : undefined),
			onClickRow:function(index, row){
				if (currTarget != this){
//					leaveCurrRow();
					stopEditing(currTarget);
					currTarget = this;
				}
				if (opts.editIndex != index && row.editor){
					var col = $(this).datagrid('getColumnOption', "value");
					col.editor = row.editor;
//					leaveCurrRow();
					stopEditing(currTarget);
					$(this).datagrid('beginEdit', index);
					$(this).datagrid('getEditors', index)[0].target.focus();
					opts.editIndex = index;
				}
				opts.onClickRow.call(target, index, row);
			},
			loadFilter:function(data){
				stopEditing(this);
				return opts.loadFilter.call(this, data);
			},
			onLoadSuccess:function(data){
//				$(target).datagrid('getPanel').find('div.datagrid-group').css('border','');
				$(target).datagrid('getPanel').find('div.datagrid-group').attr('style','');
				opts.onLoadSuccess.call(target,data);
			}
		}));
		$(document).unbind('.propertygrid').bind('mousedown.propertygrid', function(e){
			var p = $(e.target).closest('div.datagrid-view,div.combo-panel');
//			var p = $(e.target).closest('div.propertygrid,div.combo-panel');
			if (p.length){return;}
			stopEditing(currTarget);
			currTarget = undefined;
		});
		
//		function leaveCurrRow(){
//			var t = $(currTarget);
//			if (!t.length){return;}
//			var opts = $.data(currTarget, 'propertygrid').options;
//			var index = opts.editIndex;
//			if (index == undefined){return;}
//			var ed = t.datagrid('getEditors', index)[0];
//			if (ed){
//				ed.target.blur();
//				if (t.datagrid('validateRow', index)){
//					t.datagrid('endEdit', index);
//				} else {
//					t.datagrid('cancelEdit', index);
//				}
//			}
//			opts.editIndex = undefined;
//		}
	}
	
	function stopEditing(target){
		var t = $(target);
		if (!t.length){return}
		var opts = $.data(target, 'propertygrid').options;
		var index = opts.editIndex;
		if (index == undefined){return;}
		var ed = t.datagrid('getEditors', index)[0];
		if (ed){
			ed.target.blur();
			if (t.datagrid('validateRow', index)){
				t.datagrid('endEdit', index);
			} else {
				t.datagrid('cancelEdit', index);
			}
		}
		opts.editIndex = undefined;
	}
	
	$.fn.propertygrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.propertygrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'propertygrid');
			if (state){
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.propertygrid.defaults, $.fn.propertygrid.parseOptions(this), options);
				opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
				opts.columns = $.extend(true, [], opts.columns);
				$.data(this, 'propertygrid', {
					options: opts
				});
			}
			buildGrid(this);
		});
	}
	
	$.fn.propertygrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'propertygrid').options;
		}
	};
	
	$.fn.propertygrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.datagrid.parseOptions(target), $.parser.parseOptions(target,[{showGroup:'boolean'}]));
	};
	
	// the group view definition
	var groupview = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var rows = state.data.rows;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = [];
			var index = 0;
			var groups = this.groups;
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				
				table.push('<div class="datagrid-group" group-index=' + i + ' style="height:25px;overflow:hidden;border-bottom:1px solid #ccc;">');
				table.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%"><tbody>');
				table.push('<tr>');
				table.push('<td style="border:0;">');
				if (!frozen){
					table.push('<span style="color:#666;font-weight:bold;">');
					table.push(opts.groupFormatter.call(target, group.fvalue, group.rows));
					table.push('</span>');
				}
				table.push('</td>');
				table.push('</tr>');
				table.push('</tbody></table>');
				table.push('</div>');
				
				table.push('<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>');
				for(var j=0; j<group.rows.length; j++) {
					// get the class and style attributes for this row
					var cls = (index % 2 && opts.striped) ? 'class="datagrid-row datagrid-row-alt"' : 'class="datagrid-row"';
					var styleValue = opts.rowStyler ? opts.rowStyler.call(target, index, group.rows[j]) : '';
					var style = styleValue ? 'style="' + styleValue + '"' : '';
					var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + index;
					table.push('<tr id="' + rowId + '" datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
					table.push(this.renderRow.call(this, target, fields, frozen, index, group.rows[j]));
					table.push('</tr>');
					index++;
				}
				table.push('</tbody></table>');
			}
			
			$(container).html(table.join(''));
		},
		
		onAfterRender: function(target){
			var opts = $.data(target, 'datagrid').options;
			var dc = $.data(target, 'datagrid').dc;
			var view = dc.view;
			var view1 = dc.view1;
			var view2 = dc.view2;
			
			$.fn.datagrid.defaults.view.onAfterRender.call(this, target);
			
			if (opts.rownumbers || opts.frozenColumns.length){
				var group = view1.find('div.datagrid-group');
			} else {
				var group = view2.find('div.datagrid-group');
			}
			$('<td style="border:0;text-align:center;width:25px"><span class="datagrid-row-expander datagrid-row-collapse" style="display:inline-block;width:16px;height:16px;cursor:pointer">&nbsp;</span></td>').insertBefore(group.find('td'));
			
			view.find('div.datagrid-group').each(function(){
				var groupIndex = $(this).attr('group-index');
				$(this).find('span.datagrid-row-expander').bind('click', {groupIndex:groupIndex}, function(e){
					if ($(this).hasClass('datagrid-row-collapse')){
						$(target).datagrid('collapseGroup', e.data.groupIndex);
					} else {
						$(target).datagrid('expandGroup', e.data.groupIndex);
					}
				});
			});
		},
		
		onBeforeRender: function(target, rows){
			var opts = $.data(target, 'datagrid').options;
			var groups = [];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var group = getGroup(row[opts.groupField]);
				if (!group){
					group = {
						fvalue: row[opts.groupField],
						rows: [row],
						startRow: i
					};
					groups.push(group);
				} else {
					group.rows.push(row);
				}
			}
			
			function getGroup(fvalue){
				for(var i=0; i<groups.length; i++){
					var group = groups[i];
					if (group.fvalue == fvalue){
						return group;
					}
				}
				return null;
			}
			
			this.groups = groups;
			
			var newRows = [];
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				for(var j=0; j<group.rows.length; j++){
					newRows.push(group.rows[j]);
				}
			}
			$.data(target, 'datagrid').data.rows = newRows;
		}
	});

	$.extend($.fn.datagrid.methods, {
	    expandGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            if (groupIndex!=undefined){
	                var group = view.find('div.datagrid-group[group-index="'+groupIndex+'"]');
	            } else {
	                var group = view.find('div.datagrid-group');
	            }
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-expand')){
	                expander.removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
	                group.next('table').show();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    },
	    collapseGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            if (groupIndex!=undefined){
	                var group = view.find('div.datagrid-group[group-index="'+groupIndex+'"]');
	            } else {
	                var group = view.find('div.datagrid-group');
	            }
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-collapse')){
	                expander.removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
	                group.next('table').hide();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    }
	});
	// end of group view definition
	
	$.fn.propertygrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		singleSelect:true,
		remoteSort:false,
		fitColumns:true,
		loadMsg:'',
		frozenColumns:[[
		    {field:'f',width:16,resizable:false}
		]],
		columns:[[
		    {field:'name',title:'Name',width:100,sortable:true},
		    {field:'value',title:'Value',width:100,resizable:false}
		]],
		
		showGroup:false,
		groupField:'group',
		groupFormatter:function(fvalue,rows){return fvalue}
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(a, o) {
		for ( var i = 0, _2 = a.length; i < _2; i++) {
			if (a[i] == o) {
				return i;
			}
		}
		return -1;
	}
	;
	function _3(a, o) {
		var _4 = _1(a, o);
		if (_4 != -1) {
			a.splice(_4, 1);
		}
	}
	;
	function _5(_6) {
		var _7 = $.data(_6, "treegrid").options;
		$(_6).datagrid($.extend({}, _7, {
			url : null,
			data : null,
			loader : function() {
				return false;
			},
			onLoadSuccess : function() {
			},
			onResizeColumn : function(_8, _9) {
				_21(_6);
				_7.onResizeColumn.call(_6, _8, _9);
			},
			onSortColumn : function(_a, _b) {
				_7.sortName = _a;
				_7.sortOrder = _b;
				if (_7.remoteSort) {
					_20(_6);
				} else {
					var _c = $(_6).treegrid("getData");
					_3a(_6, 0, _c);
				}
				_7.onSortColumn.call(_6, _a, _b);
			},
			onBeforeEdit : function(_d, _e) {
				if (_7.onBeforeEdit.call(_6, _e) == false) {
					return false;
				}
			},
			onAfterEdit : function(_f, row, _10) {
				_7.onAfterEdit.call(_6, row, _10);
			},
			onCancelEdit : function(_11, row) {
				_7.onCancelEdit.call(_6, row);
			},
			onSelect : function(_12) {
				_7.onSelect.call(_6, _41(_6, _12));
			},
			onUnselect : function(_13) {
				_7.onUnselect.call(_6, _41(_6, _13));
			},
			onSelectAll : function() {
				_7.onSelectAll.call(_6, $.data(_6, "treegrid").data);
			},
			onUnselectAll : function() {
				_7.onUnselectAll.call(_6, $.data(_6, "treegrid").data);
			},
			onCheck : function(_14) {
				_7.onCheck.call(_6, _41(_6, _14));
			},
			onUncheck : function(_15) {
				_7.onUncheck.call(_6, _41(_6, _15));
			},
			onCheckAll : function() {
				_7.onCheckAll.call(_6, $.data(_6, "treegrid").data);
			},
			onUncheckAll : function() {
				_7.onUncheckAll.call(_6, $.data(_6, "treegrid").data);
			},
			onClickRow : function(_16) {
				_7.onClickRow.call(_6, _41(_6, _16));
			},
			onDblClickRow : function(_17) {
				_7.onDblClickRow.call(_6, _41(_6, _17));
			},
			onClickCell : function(_18, _19) {
				_7.onClickCell.call(_6, _19, _41(_6, _18));
			},
			onDblClickCell : function(_1a, _1b) {
				_7.onDblClickCell.call(_6, _1b, _41(_6, _1a));
			},
			onRowContextMenu : function(e, _1c) {
				_7.onContextMenu.call(_6, e, _41(_6, _1c));
			}
		}));
		if (_7.pagination) {
			var _1d = $(_6).datagrid("getPager");
			_1d.pagination({
				pageNumber : _7.pageNumber,
				pageSize : _7.pageSize,
				pageList : _7.pageList,
				onSelectPage : function(_1e, _1f) {
					_7.pageNumber = _1e;
					_7.pageSize = _1f;
					_20(_6);
				}
			});
			_7.pageSize = _1d.pagination("options").pageSize;
		}
	}
	;
	function _21(_22, _23) {
		var _24 = $.data(_22, "datagrid").options;
		var dc = $.data(_22, "datagrid").dc;
		if (!dc.body1.is(":empty") && (!_24.nowrap || _24.autoRowHeight)) {
			if (_23 != undefined) {
				var _25 = _26(_22, _23);
				for ( var i = 0; i < _25.length; i++) {
					_27(_25[i][_24.idField]);
				}
			}
		}
		$(_22).datagrid("fixRowHeight", _23);
		function _27(_28) {
			var tr1 = _24.finder.getTr(_22, _28, "body", 1);
			var tr2 = _24.finder.getTr(_22, _28, "body", 2);
			tr1.css("height", "");
			tr2.css("height", "");
			var _29 = Math.max(tr1.height(), tr2.height());
			tr1.css("height", _29);
			tr2.css("height", _29);
		}
		;
	}
	;
	function _2a(_2b) {
		var dc = $.data(_2b, "datagrid").dc;
		var _2c = $.data(_2b, "treegrid").options;
		if (!_2c.rownumbers) {
			return;
		}
		dc.body1.find("div.datagrid-cell-rownumber").each(function(i) {
			$(this).html(i + 1);
		});
	}
	;
	function _2d(_2e) {
		var dc = $.data(_2e, "datagrid").dc;
		var _2f = dc.body1.add(dc.body2);
		var _30 = ($.data(_2f[0], "events") || $._data(_2f[0], "events")).click[0].handler;
		dc.body1.add(dc.body2).bind("mouseover", function(e) {
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!tr.length) {
				return;
			}
			if (tt.hasClass("tree-hit")) {
				tt.hasClass("tree-expanded") ? tt.addClass("tree-expanded-hover") : tt.addClass("tree-collapsed-hover");
			}
			e.stopPropagation();
		}).bind("mouseout", function(e) {
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!tr.length) {
				return;
			}
			if (tt.hasClass("tree-hit")) {
				tt.hasClass("tree-expanded") ? tt.removeClass("tree-expanded-hover") : tt.removeClass("tree-collapsed-hover");
			}
			e.stopPropagation();
		}).unbind("click").bind("click", function(e) {
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!tr.length) {
				return;
			}
			if (tt.hasClass("tree-hit")) {
				_31(_2e, tr.attr("node-id"));
			} else {
				_30(e);
			}
			e.stopPropagation();
		});
	}
	;
	function _32(_33, _34) {
		var _35 = $.data(_33, "treegrid").options;
		var tr1 = _35.finder.getTr(_33, _34, "body", 1);
		var tr2 = _35.finder.getTr(_33, _34, "body", 2);
		var _36 = $(_33).datagrid("getColumnFields", true).length + (_35.rownumbers ? 1 : 0);
		var _37 = $(_33).datagrid("getColumnFields", false).length;
		_38(tr1, _36);
		_38(tr2, _37);
		function _38(tr, _39) {
			$("<tr class=\"treegrid-tr-tree\">" + "<td style=\"border:0px\" colspan=\"" + _39 + "\">" + "<div></div>" + "</td>" + "</tr>").insertAfter(tr);
		}
		;
	}
	;
	function _3a(_3b, _3c, _3d, _3e) {
		var _3f = $.data(_3b, "treegrid").options;
		var dc = $.data(_3b, "datagrid").dc;
		_3d = _3f.loadFilter.call(_3b, _3d, _3c);
		var _40 = _41(_3b, _3c);
		if (_40) {
			var _42 = _3f.finder.getTr(_3b, _3c, "body", 1);
			var _43 = _3f.finder.getTr(_3b, _3c, "body", 2);
			var cc1 = _42.next("tr.treegrid-tr-tree").children("td").children("div");
			var cc2 = _43.next("tr.treegrid-tr-tree").children("td").children("div");
		} else {
			var cc1 = dc.body1;
			var cc2 = dc.body2;
		}
		if (!_3e) {
			$.data(_3b, "treegrid").data = [];
			cc1.empty();
			cc2.empty();
		}
		if (_3f.view.onBeforeRender) {
			_3f.view.onBeforeRender.call(_3f.view, _3b, _3c, _3d);
		}
		_3f.view.render.call(_3f.view, _3b, cc1, true);
		_3f.view.render.call(_3f.view, _3b, cc2, false);
		if (_3f.showFooter) {
			_3f.view.renderFooter.call(_3f.view, _3b, dc.footer1, true);
			_3f.view.renderFooter.call(_3f.view, _3b, dc.footer2, false);
		}
		if (_3f.view.onAfterRender) {
			_3f.view.onAfterRender.call(_3f.view, _3b);
		}
		_3f.onLoadSuccess.call(_3b, _40, _3d);
		if (!_3c && _3f.pagination) {
			var _44 = $.data(_3b, "treegrid").total;
			var _45 = $(_3b).datagrid("getPager");
			if (_45.pagination("options").total != _44) {
				_45.pagination({
					total : _44
				});
			}
		}
		_21(_3b);
		_2a(_3b);
		$(_3b).treegrid("autoSizeColumn");
	}
	;
	function _20(_46, _47, _48, _49, _4a) {
		var _4b = $.data(_46, "treegrid").options;
		var _4c = $(_46).datagrid("getPanel").find("div.datagrid-body");
		if (_48) {
			_4b.queryParams = _48;
		}
		var _4d = $.extend({}, _4b.queryParams);
		if (_4b.pagination) {
			$.extend(_4d, {
				page : _4b.pageNumber,
				rows : _4b.pageSize
			});
		}
		if (_4b.sortName) {
			$.extend(_4d, {
				sort : _4b.sortName,
				order : _4b.sortOrder
			});
		}
		var row = _41(_46, _47);
		if (_4b.onBeforeLoad.call(_46, row, _4d) == false) {
			return;
		}
		var _4e = _4c.find("tr[node-id=" + _47 + "] span.tree-folder");
		_4e.addClass("tree-loading");
		$(_46).treegrid("loading");
		var _4f = _4b.loader.call(_46, _4d, function(_50) {
			_4e.removeClass("tree-loading");
			$(_46).treegrid("loaded");
			_3a(_46, _47, _50, _49);
			if (_4a) {
				_4a();
			}
		}, function() {
			_4e.removeClass("tree-loading");
			$(_46).treegrid("loaded");
			_4b.onLoadError.apply(_46, arguments);
			if (_4a) {
				_4a();
			}
		});
		if (_4f == false) {
			_4e.removeClass("tree-loading");
			$(_46).treegrid("loaded");
		}
	}
	;
	function _51(_52) {
		var _53 = _54(_52);
		if (_53.length) {
			return _53[0];
		} else {
			return null;
		}
	}
	;
	function _54(_55) {
		return $.data(_55, "treegrid").data;
	}
	;
	function _56(_57, _58) {
		var row = _41(_57, _58);
		if (row._parentId) {
			return _41(_57, row._parentId);
		} else {
			return null;
		}
	}
	;
	function _26(_59, _5a) {
		var _5b = $.data(_59, "treegrid").options;
		var _5c = $(_59).datagrid("getPanel").find("div.datagrid-view2 div.datagrid-body");
		var _5d = [];
		if (_5a) {
			_5e(_5a);
		} else {
			var _5f = _54(_59);
			for ( var i = 0; i < _5f.length; i++) {
				_5d.push(_5f[i]);
				_5e(_5f[i][_5b.idField]);
			}
		}
		function _5e(_60) {
			var _61 = _41(_59, _60);
			if (_61 && _61.children) {
				for ( var i = 0, len = _61.children.length; i < len; i++) {
					var _62 = _61.children[i];
					_5d.push(_62);
					_5e(_62[_5b.idField]);
				}
			}
		}
		;
		return _5d;
	}
	;
	function _63(_64) {
		var _65 = _66(_64);
		if (_65.length) {
			return _65[0];
		} else {
			return null;
		}
	}
	;
	function _66(_67) {
		var _68 = [];
		var _69 = $(_67).datagrid("getPanel");
		_69.find("div.datagrid-view2 div.datagrid-body tr.datagrid-row-selected").each(function() {
			var id = $(this).attr("node-id");
			_68.push(_41(_67, id));
		});
		return _68;
	}
	;
	function _6a(_6b, _6c) {
		if (!_6c) {
			return 0;
		}
		var _6d = $.data(_6b, "treegrid").options;
		var _6e = $(_6b).datagrid("getPanel").children("div.datagrid-view");
		var _6f = _6e.find("div.datagrid-body tr[node-id=" + _6c + "]").children("td[field=" + _6d.treeField + "]");
		return _6f.find("span.tree-indent,span.tree-hit").length;
	}
	;
	function _41(_70, _71) {
		var _72 = $.data(_70, "treegrid").options;
		var _73 = $.data(_70, "treegrid").data;
		var cc = [ _73 ];
		while (cc.length) {
			var c = cc.shift();
			for ( var i = 0; i < c.length; i++) {
				var _74 = c[i];
				if (_74[_72.idField] == _71) {
					return _74;
				} else {
					if (_74["children"]) {
						cc.push(_74["children"]);
					}
				}
			}
		}
		return null;
	}
	;
	function _75(_76, _77) {
		var _78 = $.data(_76, "treegrid").options;
		var row = _41(_76, _77);
		var tr = _78.finder.getTr(_76, _77);
		var hit = tr.find("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-collapsed")) {
			return;
		}
		if (_78.onBeforeCollapse.call(_76, row) == false) {
			return;
		}
		hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
		hit.next().removeClass("tree-folder-open");
		row.state = "closed";
		tr = tr.next("tr.treegrid-tr-tree");
		var cc = tr.children("td").children("div");
		if (_78.animate) {
			cc.slideUp("normal", function() {
				$(_76).treegrid("autoSizeColumn");
				_21(_76, _77);
				_78.onCollapse.call(_76, row);
			});
		} else {
			cc.hide();
			$(_76).treegrid("autoSizeColumn");
			_21(_76, _77);
			_78.onCollapse.call(_76, row);
		}
	}
	;
	function _79(_7a, _7b) {
		var _7c = $.data(_7a, "treegrid").options;
		var tr = _7c.finder.getTr(_7a, _7b);
		var hit = tr.find("span.tree-hit");
		var row = _41(_7a, _7b);
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-expanded")) {
			return;
		}
		if (_7c.onBeforeExpand.call(_7a, row) == false) {
			return;
		}
		hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
		hit.next().addClass("tree-folder-open");
		var _7d = tr.next("tr.treegrid-tr-tree");
		if (_7d.length) {
			var cc = _7d.children("td").children("div");
			_7e(cc);
		} else {
			_32(_7a, row[_7c.idField]);
			var _7d = tr.next("tr.treegrid-tr-tree");
			var cc = _7d.children("td").children("div");
			cc.hide();
			_20(_7a, row[_7c.idField], {
				id : row[_7c.idField]
			}, true, function() {
				if (cc.is(":empty")) {
					_7d.remove();
				} else {
					_7e(cc);
				}
			});
		}
		function _7e(cc) {
			row.state = "open";
			if (_7c.animate) {
				cc.slideDown("normal", function() {
					$(_7a).treegrid("autoSizeColumn");
					_21(_7a, _7b);
					_7c.onExpand.call(_7a, row);
				});
			} else {
				cc.show();
				$(_7a).treegrid("autoSizeColumn");
				_21(_7a, _7b);
				_7c.onExpand.call(_7a, row);
			}
		}
		;
	}
	;
	function _31(_7f, _80) {
		var _81 = $.data(_7f, "treegrid").options;
		var tr = _81.finder.getTr(_7f, _80);
		var hit = tr.find("span.tree-hit");
		if (hit.hasClass("tree-expanded")) {
			_75(_7f, _80);
		} else {
			_79(_7f, _80);
		}
	}
	;
	function _82(_83, _84) {
		var _85 = $.data(_83, "treegrid").options;
		var _86 = _26(_83, _84);
		if (_84) {
			_86.unshift(_41(_83, _84));
		}
		for ( var i = 0; i < _86.length; i++) {
			_75(_83, _86[i][_85.idField]);
		}
	}
	;
	function _87(_88, _89) {
		var _8a = $.data(_88, "treegrid").options;
		var _8b = _26(_88, _89);
		if (_89) {
			_8b.unshift(_41(_88, _89));
		}
		for ( var i = 0; i < _8b.length; i++) {
			_79(_88, _8b[i][_8a.idField]);
		}
	}
	;
	function _8c(_8d, _8e) {
		var _8f = $.data(_8d, "treegrid").options;
		var ids = [];
		var p = _56(_8d, _8e);
		while (p) {
			var id = p[_8f.idField];
			ids.unshift(id);
			p = _56(_8d, id);
		}
		for ( var i = 0; i < ids.length; i++) {
			_79(_8d, ids[i]);
		}
	}
	;
	function _90(_91, _92) {
		var _93 = $.data(_91, "treegrid").options;
		if (_92.parent) {
			var tr = _93.finder.getTr(_91, _92.parent);
			if (tr.next("tr.treegrid-tr-tree").length == 0) {
				_32(_91, _92.parent);
			}
			var _94 = tr.children("td[field=" + _93.treeField + "]").children("div.datagrid-cell");
			var _95 = _94.children("span.tree-icon");
			if (_95.hasClass("tree-file")) {
				_95.removeClass("tree-file").addClass("tree-folder");
				var hit = $("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_95);
				if (hit.prev().length) {
					hit.prev().remove();
				}
			}
		}
		_3a(_91, _92.parent, _92.data, true);
	}
	;
	function _96(_97, _98) {
		var ref = _98.before || _98.after;
		var _99 = $.data(_97, "treegrid").options;
		var _9a = _56(_97, ref);
		_90(_97, {
			parent : (_9a ? _9a[_99.idField] : null),
			data : [ _98.data ]
		});
		_9b(true);
		_9b(false);
		_2a(_97);
		function _9b(_9c) {
			var _9d = _9c ? 1 : 2;
			var tr = _99.finder.getTr(_97, _98.data[_99.idField], "body", _9d);
			var _9e = tr.closest("table.datagrid-btable");
			tr = tr.parent().children();
			var _9f = _99.finder.getTr(_97, ref, "body", _9d);
			if (_98.before) {
				tr.insertBefore(_9f);
			} else {
				var sub = _9f.next("tr.treegrid-tr-tree");
				tr.insertAfter(sub.length ? sub : _9f);
			}
			_9e.remove();
		}
		;
	}
	;
	function _a0(_a1, _a2) {
		var _a3 = $.data(_a1, "treegrid").options;
		var tr = _a3.finder.getTr(_a1, _a2);
		tr.next("tr.treegrid-tr-tree").remove();
		tr.remove();
		var _a4 = del(_a2);
		if (_a4) {
			if (_a4.children.length == 0) {
				tr = _a3.finder.getTr(_a1, _a4[_a3.idField]);
				tr.next("tr.treegrid-tr-tree").remove();
				var _a5 = tr.children("td[field=" + _a3.treeField + "]").children("div.datagrid-cell");
				_a5.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
				_a5.find(".tree-hit").remove();
				$("<span class=\"tree-indent\"></span>").prependTo(_a5);
			}
		}
		_2a(_a1);
		function del(id) {
			var cc;
			var _a6 = _56(_a1, _a2);
			if (_a6) {
				cc = _a6.children;
			} else {
				cc = $(_a1).treegrid("getData");
			}
			for ( var i = 0; i < cc.length; i++) {
				if (cc[i][_a3.idField] == id) {
					cc.splice(i, 1);
					break;
				}
			}
			return _a6;
		}
		;
	}
	;
	$.fn.treegrid = function(_a7, _a8) {
		if (typeof _a7 == "string") {
			var _a9 = $.fn.treegrid.methods[_a7];
			if (_a9) {
				return _a9(this, _a8);
			} else {
				return this.datagrid(_a7, _a8);
			}
		}
		_a7 = _a7 || {};
		return this.each(function() {
			var _aa = $.data(this, "treegrid");
			if (_aa) {
				$.extend(_aa.options, _a7);
			} else {
				_aa = $.data(this, "treegrid", {
					options : $.extend({}, $.fn.treegrid.defaults, $.fn.treegrid.parseOptions(this), _a7),
					data : []
				});
			}
			_5(this);
			if (_aa.options.data) {
				$(this).treegrid("loadData", _aa.options.data);
			}
			_20(this);
			_2d(this);
		});
	};
	$.fn.treegrid.methods = {
		options : function(jq) {
			return $.data(jq[0], "treegrid").options;
		},
		resize : function(jq, _ab) {
			return jq.each(function() {
				$(this).datagrid("resize", _ab);
			});
		},
		fixRowHeight : function(jq, _ac) {
			return jq.each(function() {
				_21(this, _ac);
			});
		},
		loadData : function(jq, _ad) {
			return jq.each(function() {
				_3a(this, null, _ad);
			});
		},
		reload : function(jq, id) {
			return jq.each(function() {
				if (id && typeof id != "object") {
					var _ae = $(this).treegrid("find", id);
					if (_ae.children) {
						_ae.children.splice(0, _ae.children.length);
					}
					var _af = $(this).datagrid("getPanel").find("div.datagrid-body");
					var tr = _af.find("tr[node-id=" + id + "]");
					tr.next("tr.treegrid-tr-tree").remove();
					var hit = tr.find("span.tree-hit");
					hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
					_79(this, id);
				} else {
					_20(this, null, id || {});
				}
			});
		},
		reloadFooter : function(jq, _b0) {
			return jq.each(function() {
				var _b1 = $.data(this, "treegrid").options;
				var dc = $.data(this, "datagrid").dc;
				if (_b0) {
					$.data(this, "treegrid").footer = _b0;
				}
				if (_b1.showFooter) {
					_b1.view.renderFooter.call(_b1.view, this, dc.footer1, true);
					_b1.view.renderFooter.call(_b1.view, this, dc.footer2, false);
					if (_b1.view.onAfterRender) {
						_b1.view.onAfterRender.call(_b1.view, this);
					}
					$(this).treegrid("fixRowHeight");
				}
			});
		},
		getData : function(jq) {
			return $.data(jq[0], "treegrid").data;
		},
		getFooterRows : function(jq) {
			return $.data(jq[0], "treegrid").footer;
		},
		getRoot : function(jq) {
			return _51(jq[0]);
		},
		getRoots : function(jq) {
			return _54(jq[0]);
		},
		getParent : function(jq, id) {
			return _56(jq[0], id);
		},
		getChildren : function(jq, id) {
			return _26(jq[0], id);
		},
		getSelected : function(jq) {
			return _63(jq[0]);
		},
		getSelections : function(jq) {
			return _66(jq[0]);
		},
		getLevel : function(jq, id) {
			return _6a(jq[0], id);
		},
		find : function(jq, id) {
			return _41(jq[0], id);
		},
		isLeaf : function(jq, id) {
			var _b2 = $.data(jq[0], "treegrid").options;
			var tr = _b2.finder.getTr(jq[0], id);
			var hit = tr.find("span.tree-hit");
			return hit.length == 0;
		},
		select : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("selectRow", id);
			});
		},
		unselect : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("unselectRow", id);
			});
		},
		collapse : function(jq, id) {
			return jq.each(function() {
				_75(this, id);
			});
		},
		expand : function(jq, id) {
			return jq.each(function() {
				_79(this, id);
			});
		},
		toggle : function(jq, id) {
			return jq.each(function() {
				_31(this, id);
			});
		},
		collapseAll : function(jq, id) {
			return jq.each(function() {
				_82(this, id);
			});
		},
		expandAll : function(jq, id) {
			return jq.each(function() {
				_87(this, id);
			});
		},
		expandTo : function(jq, id) {
			return jq.each(function() {
				_8c(this, id);
			});
		},
		append : function(jq, _b3) {
			return jq.each(function() {
				_90(this, _b3);
			});
		},
		insert : function(jq, _b4) {
			return jq.each(function() {
				_96(this, _b4);
			});
		},
		remove : function(jq, id) {
			return jq.each(function() {
				_a0(this, id);
			});
		},
		pop : function(jq, id) {
			var row = jq.treegrid("find", id);
			jq.treegrid("remove", id);
			return row;
		},
		refresh : function(jq, id) {
			return jq.each(function() {
				var _b5 = $.data(this, "treegrid").options;
				_b5.view.refreshRow.call(_b5.view, this, id);
			});
		},
		update : function(jq, _b6) {
			return jq.each(function() {
				var _b7 = $.data(this, "treegrid").options;
				_b7.view.updateRow.call(_b7.view, this, _b6.id, _b6.row);
			});
		},
		beginEdit : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("beginEdit", id);
				$(this).treegrid("fixRowHeight", id);
			});
		},
		endEdit : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("endEdit", id);
			});
		},
		cancelEdit : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("cancelEdit", id);
			});
		},
		clearChanges : function(jq) {
			return jq.each(function() {
				clearChanges(this);
			});
		}
	};
	
	$.fn.treegrid.parseOptions = function(_b8) {
		return $.extend({}, $.fn.datagrid.parseOptions(_b8), $.parser.parseOptions(_b8, [ "treeField", {
			animate : "boolean"
		} ]));
	};
	var _b9 = $.extend({}, $.fn.datagrid.defaults.view, {
		render : function(_ba, _bb, _bc) {
			var _bd = $.data(_ba, "treegrid").options;
			var _be = $(_ba).datagrid("getColumnFields", _bc);
			var _bf = $.data(_ba, "datagrid").rowIdPrefix;
			if (_bc) {
				if (!(_bd.rownumbers || (_bd.frozenColumns && _bd.frozenColumns.length))) {
					return;
				}
			}
			var _c0 = this;
			var _c1 = _c2(_bc, this.treeLevel, this.treeNodes);
			$(_bb).append(_c1.join(""));
			function _c2(_c3, _c4, _c5) {
				var _c6 = [ "<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>" ];
				for ( var i = 0; i < _c5.length; i++) {
					var row = _c5[i];
					if (row.state != "open" && row.state != "closed") {
						row.state = "open";
					}
					var _c7 = _bd.rowStyler ? _bd.rowStyler.call(_ba, row) : "";
					var _c8 = _c7 ? "style=\"" + _c7 + "\"" : "";
					var _c9 = _bf + "-" + (_c3 ? 1 : 2) + "-" + row[_bd.idField];
					_c6.push("<tr id=\"" + _c9 + "\" class=\"datagrid-row\" node-id=" + row[_bd.idField] + " " + _c8 + ">");
					_c6 = _c6.concat(_c0.renderRow.call(_c0, _ba, _be, _c3, _c4, row));
					_c6.push("</tr>");
					if (row.children && row.children.length) {
						var tt = _c2(_c3, _c4 + 1, row.children);
						var v = row.state == "closed" ? "none" : "block";
						_c6.push("<tr class=\"treegrid-tr-tree\"><td style=\"border:0px\" colspan=" + (_be.length + (_bd.rownumbers ? 1 : 0))
								+ "><div style=\"display:" + v + "\">");
						_c6 = _c6.concat(tt);
						_c6.push("</div></td></tr>");
					}
				}
				_c6.push("</tbody></table>");
				return _c6;
			}
			;
		},
		renderFooter : function(_ca, _cb, _cc) {
			var _cd = $.data(_ca, "treegrid").options;
			var _ce = $.data(_ca, "treegrid").footer || [];
			var _cf = $(_ca).datagrid("getColumnFields", _cc);
			var _d0 = [ "<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>" ];
			for ( var i = 0; i < _ce.length; i++) {
				var row = _ce[i];
				row[_cd.idField] = row[_cd.idField] || ("foot-row-id" + i);
				_d0.push("<tr class=\"datagrid-row\" node-id=" + row[_cd.idField] + ">");
				_d0.push(this.renderRow.call(this, _ca, _cf, _cc, 0, row));
				_d0.push("</tr>");
			}
			_d0.push("</tbody></table>");
			$(_cb).html(_d0.join(""));
		},
		renderRow : function(target, _d2, _d3, _d4, row) {
			var opts = $.data(target, "treegrid").options;
			var cc = [];
			if (_d3 && opts.rownumbers) {
				cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">0</div></td>");
			}
			for ( var i = 0; i < _d2.length; i++) {
				var _d6 = _d2[i];
				var col = $(target).datagrid("getColumnOption", _d6);
				if (col) {
					var _d7 = col.styler ? (col.styler(row[_d6], row) || "") : "";
					var _d8 = col.hidden ? "style=\"display:none;" + _d7 + "\"" : (_d7 ? "style=\"" + _d7 + "\"" : "");
					cc.push("<td field=\"" + _d6 + "\" " + _d8 + ">");
					if (col.checkbox) {
						var _d8 = "";
					} else {
						var _d8 = "";
						if (col.align) {
							_d8 += "text-align:" + col.align + ";";
						}
						if (!opts.nowrap) {
							_d8 += "white-space:normal;height:auto;";
						} else {
							if (opts.autoRowHeight) {
								_d8 += "height:auto;";
							}
						}
					}
					cc.push("<div style=\"" + _d8 + "\" ");
					if (col.checkbox) {
						cc.push("class=\"datagrid-cell-check ");
					} else {
						cc.push("class=\"datagrid-cell " + col.cellClass);
					}
					cc.push("\">");
					if (col.checkbox) {
						if (row.checked) {
							cc.push("<input type=\"checkbox\" checked=\"checked\"");
						} else {
							cc.push("<input type=\"checkbox\"");
						}
						cc.push(" name=\"" + _d6 + "\" value=\"" + (row[_d6] != undefined ? row[_d6] : "") + "\"/>");
					} else {
						var val = null;
						if (col.formatter) {
							val = col.formatter(row[_d6], row);
						} else {
							val = row[_d6];
						}
						if (_d6 == opts.treeField) {
							for ( var j = 0; j < _d4; j++) {
								cc.push("<span class=\"tree-indent\"></span>");
							}
							if (row.state == "closed") {
								cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
								cc.push("<span class=\"tree-icon tree-folder " + (row.iconCls ? row.iconCls : "") + "\"></span>");
							} else {
								if (row.children && row.children.length) {
									cc.push("<span class=\"tree-hit tree-expanded\"></span>");
									cc.push("<span class=\"tree-icon tree-folder tree-folder-open " + (row.iconCls ? row.iconCls : "") + "\"></span>");
								} else {
									cc.push("<span class=\"tree-indent\"></span>");
									cc.push("<span class=\"tree-icon tree-file " + (row.iconCls ? row.iconCls : "") + "\"></span>");
								}
							}
							if( opts.checkbox ){
								var id = row[opts.idField];
								var checkbox = "<input type='checkbox' class='hand' id='treegrid-node-" + id + "' name='treegrid-node-checkbox' value='" + id 
													+ "' onclick=\"$(this).parents('.datagrid-view').find('.easyui-treegrid').treegrid('check','" + id + "')\"/>";
								cc.push("<span class=\"tree-title\">" + checkbox + " " +  val + "</span>");
							}else{
								cc.push("<span class=\"tree-title\">" + val + "</span>");
							}
						} else {
							cc.push(val);
						}
					}
					cc.push("</div>");
					cc.push("</td>");
				}
			}
			return cc.join("");
		},
		refreshRow : function(_d9, id) {
			this.updateRow.call(this, _d9, id, {});
		},
		updateRow : function(_da, id, row) {
			var _db = $.data(_da, "treegrid").options;
			var _dc = $(_da).treegrid("find", id);
			$.extend(_dc, row);
			var _dd = $(_da).treegrid("getLevel", id) - 1;
			var _de = _db.rowStyler ? _db.rowStyler.call(_da, _dc) : "";
			function _df(_e0) {
				var _e1 = $(_da).treegrid("getColumnFields", _e0);
				var tr = _db.finder.getTr(_da, id, "body", (_e0 ? 1 : 2));
				var _e2 = tr.find("div.datagrid-cell-rownumber").html();
				var _e3 = tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
				tr.html(this.renderRow(_da, _e1, _e0, _dd, _dc));
				tr.attr("style", _de || "");
				tr.find("div.datagrid-cell-rownumber").html(_e2);
				if (_e3) {
					tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked", true);
				}
			}
			;
			_df.call(this, true);
			_df.call(this, false);
			$(_da).treegrid("fixRowHeight", id);
		},
		onBeforeRender : function(_e4, _e5, _e6) {
			if (!_e6) {
				return false;
			}
			var _e7 = $.data(_e4, "treegrid").options;
			if (_e6.length == undefined) {
				if (_e6.footer) {
					$.data(_e4, "treegrid").footer = _e6.footer;
				}
				if (_e6.total) {
					$.data(_e4, "treegrid").total = _e6.total;
				}
				_e6 = this.transfer(_e4, _e5, _e6.rows);
			} else {
				function _e8(_e9, _ea) {
					for ( var i = 0; i < _e9.length; i++) {
						var row = _e9[i];
						row._parentId = _ea;
						if (row.children && row.children.length) {
							_e8(row.children, row[_e7.idField]);
						}
					}
				}
				;
				_e8(_e6, _e5);
			}
			var _eb = _41(_e4, _e5);
			if (_eb) {
				if (_eb.children) {
					_eb.children = _eb.children.concat(_e6);
				} else {
					_eb.children = _e6;
				}
			} else {
				$.data(_e4, "treegrid").data = $.data(_e4, "treegrid").data.concat(_e6);
			}
			if (!_e7.remoteSort) {
				this.sort(_e4, _e6);
			}
			this.treeNodes = _e6;
			this.treeLevel = $(_e4).treegrid("getLevel", _e5);
		},
		sort : function(_ec, _ed) {
			var _ee = $.data(_ec, "treegrid").options;
			var opt = $(_ec).treegrid("getColumnOption", _ee.sortName);
			if (opt) {
				var _ef = opt.sorter || function(a, b) {
					return (a > b ? 1 : -1);
				};
				_f0(_ed);
			}
			function _f0(_f1) {
				_f1.sort(function(r1, r2) {
					return _ef(r1[_ee.sortName], r2[_ee.sortName]) * (_ee.sortOrder == "asc" ? 1 : -1);
				});
				for ( var i = 0; i < _f1.length; i++) {
					var _f2 = _f1[i].children;
					if (_f2 && _f2.length) {
						_f0(_f2);
					}
				}
			}
			;
		},
		transfer : function(_f3, _f4, _f5) {
			var _f6 = $.data(_f3, "treegrid").options;
			var _f7 = [];
			for ( var i = 0; i < _f5.length; i++) {
				_f7.push(_f5[i]);
			}
			var _f8 = [];
			for ( var i = 0; i < _f7.length; i++) {
				var row = _f7[i];
				if (!_f4) {
					if (!row._parentId) {
						_f8.push(row);
						_3(_f7, row);
						i--;
					}
				} else {
					if (row._parentId == _f4) {
						_f8.push(row);
						_3(_f7, row);
						i--;
					}
				}
			}
			var _f9 = [];
			for ( var i = 0; i < _f8.length; i++) {
				_f9.push(_f8[i]);
			}
			while (_f9.length) {
				var _fa = _f9.shift();
				for ( var i = 0; i < _f7.length; i++) {
					var row = _f7[i];
					if (row._parentId == _fa[_f6.idField]) {
						if (_fa.children) {
							_fa.children.push(row);
						} else {
							_fa.children = [ row ];
						}
						_f9.push(row);
						_3(_f7, row);
						i--;
					}
				}
			}
			return _f8;
		}
	});
	
	$.fn.treegrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		treeField : null,
		animate : false,
		singleSelect : true,
		view : _b9,
		changeNodes : null,
		loader : function(_fb, _fc, _fd) {
			var _fe = $(this).treegrid("options");
			if (!_fe.url) {
				return false;
			}
			$.ajax({
				type : _fe.method,
				url : _fe.url,
				data : _fb,
				dataType : "json",
				success : function(_ff) {
					_fc(_ff);
				},
				error : function() {
					_fd.apply(this, arguments);
				}
			});
		},
		loadFilter : function(data, _100) {
			return data;
		},
		finder : {
			getTr : function(_101, id, type, _102) {
				type = type || "body";
				_102 = _102 || 0;
				var dc = $.data(_101, "datagrid").dc;
				if (_102 == 0) {
					var opts = $.data(_101, "treegrid").options;
					var tr1 = opts.finder.getTr(_101, id, type, 1);
					var tr2 = opts.finder.getTr(_101, id, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == "body") {
						var tr = $("#" + $.data(_101, "datagrid").rowIdPrefix + "-" + _102 + "-" + id);
						if (!tr.length) {
							tr = (_102 == 1 ? dc.body1 : dc.body2).find("tr[node-id=" + id + "]");
						}
						return tr;
					} else {
						if (type == "footer") {
							return (_102 == 1 ? dc.footer1 : dc.footer2).find("tr[node-id=" + id + "]");
						} else {
							if (type == "selected") {
								return (_102 == 1 ? dc.body1 : dc.body2).find("tr.datagrid-row-selected");
							} else {
								if (type == "last") {
									return (_102 == 1 ? dc.body1 : dc.body2).find("tr:last[node-id]");
								} else {
									if (type == "allbody") {
										return (_102 == 1 ? dc.body1 : dc.body2).find("tr[node-id]");
									} else {
										if (type == "allfooter") {
											return (_102 == 1 ? dc.footer1 : dc.footer2).find("tr[node-id]");
										}
									}
								}
							}
						}
					}
				}
			},
			getRow : function(_103, p) {
				var id = (typeof p == "object") ? p.attr("node-id") : p;
				return $(_103).treegrid("find", id);
			}
		},
		onBeforeLoad : function(row, _104) {
		},
		onLoadSuccess : function(row, data) {
		},
		onLoadError : function() {
		},
		onBeforeCollapse : function(row) {
		},
		onCollapse : function(row) {
		},
		onBeforeExpand : function(row) {
		},
		onExpand : function(row) {
		},
		onClickRow : function(row) {
		},
		onDblClickRow : function(row) {
		},
		onClickCell : function(_105, row) {
		},
		onDblClickCell : function(_106, row) {
		},
		onContextMenu : function(e, row) {
		},
		onBeforeEdit : function(row) {
		},
		onAfterEdit : function(row, _107) {
		},
		onCancelEdit : function(row) {
		},
		onChecked : function(id, checked) {
		}
	});
	
	// 树节点的复选框控制
	$.fn.treegrid.methods.check = function(jq, id){
		jq.each(function(){
			var opts = $.data(this, "treegrid").options;
			var view = $(this).parents(".datagrid-view");
			var checked = $("#treegrid-node-" + id, view).attr("checked");
			var children = _26(this, id);
			var currentNode = null;
			// 保存当前节点
			if( id ) {
				currentNode = $(this).treegrid('find', id);
				currentNode.checked = (checked ? true : false);
				$("#treegrid-node-" + id, view).attr("checked", checked ? true : null);
				saveChangeNode(this, currentNode);
			}
			// 保存子节点
			for(var i = 0 ; i < children.length; i++){
				var node = children[i];
				var nodeId = node[opts.idField];
				$("#treegrid-node-" + nodeId, view).attr("checked", checked ? true : null);
				node.checked = (checked ? true : false);
				saveChangeNode(this, node);
			}
			// 如果所有子节点都取消选中，父节点也应该取消选中
			selectPNode(this, currentNode);
			unselectPNode(this, currentNode);
			if( opts.onChecked ){
				opts.onChecked.call(this, id, (checked ? true : false));
			}
		});
	};
	
	// 取得改变的节点
	$.fn.treegrid.methods.getChanged = function(jq) {
		var options = $.data(jq[0], "treegrid").options;
		var nodes = new Array();
		if( options.changeNodes != undefined ) {
			nodes = options.changeNodes.values();
		}
		return nodes;
	};
	
	// 取得选中的节点
	$.fn.treegrid.methods.getChecked = function(jq){
		var view = $(jq[0]).parents(".datagrid-view");
		var rows = [];
		 $("input[name='treegrid-node-checkbox']:checked",view).each(function(){
			 var row = $(jq[0]).treegrid("find",this.value);
			 rows.push(row);
		 });
	};
	
	// 遍历所有子节点，如果所有子节点都被选中，则选中父节点，同时将父节点加入改变行
	function selectPNode(target, node) {
		var opts = $.data(target, "treegrid").options;
		var view = $(target).parents(".datagrid-view");
		var nodeId = node[opts.idField];
		var parent = $(target).treegrid('getParent', nodeId); 
		if( parent ) {
			if( node.checked == true ) {
				parent.checked = true;
				$("#treegrid-node-" + parent[opts.idField], view).attr("checked", true);
				saveChangeNode(target, parent);
			}
		}
	}
	
	// 取消父节点
	function unselectPNode(target, node) {
		var opts = $.data(target, "treegrid").options;
		var view = $(target).parents(".datagrid-view");
		var nodeId = node[opts.idField];
		var parent = $(target).treegrid('getParent', nodeId); 
		if( parent ) {
			var children = _26(target, parent[opts.idField]);
			var unselect = true;
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				if (child.checked == true) {
					unselect = false;
					break;
				}
			}	
			if( unselect == true ) {
				$("#treegrid-node-" + parent[opts.idField], view).attr("checked", false);
				parent.checked = false;
				saveChangeNode(target, parent);
			}
		}
	}
	
	// 保存改变的节点
	function saveChangeNode(target, node) {
		var opts = $.data(target, "treegrid").options;
		if( opts.changeNodes == null ) {
			opts.changeNodes = new HashMap();
		}
		opts.changeNodes.put(node[opts.idField], node);
	}

	// 清除所有选中项
	function clearChanges(target) {
		var opts = $.data(target, "treegrid").options;
		if( opts.changeNodes != null ) {
			opts.changeNodes.clear();
		}
	}
	
})(jQuery);

/**
 * tabs - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 * Dependencies:
 * 	 panel
 *   linkbutton
 * 
 */
(function($){
	
	/**
	 * set the tabs scrollers to show or not,
	 * dependent on the tabs count and width
	 */
	function setScrollers(container) {
		var opts = $.data(container, 'tabs').options;
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right'){return}
		
		var header = $(container).children('div.tabs-header');
		var tool = header.children('div.tabs-tool');
		var sLeft = header.children('div.tabs-scroller-left');
		var sRight = header.children('div.tabs-scroller-right');
		var wrap = header.children('div.tabs-wrap');
		
		// set the tool height
		tool._outerHeight(header.outerHeight() - (opts.plain ? 2 : 0));
		
		var tabsWidth = 0;
		$('ul.tabs li', header).each(function(){
			tabsWidth += $(this).outerWidth(true);
		});
		var cWidth = header.width() - tool._outerWidth();
		
		if (tabsWidth > cWidth) {
			sLeft.show();
			sRight.show();
			if (opts.toolPosition == 'left'){
				tool.css({
					left: sLeft.outerWidth(),
					right: ''
				});
				wrap.css({
					marginLeft: sLeft.outerWidth() + tool._outerWidth(),
					marginRight: sRight._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			} else {
				tool.css({
					left: '',
					right: sRight.outerWidth()
				});
				wrap.css({
					marginLeft: sLeft.outerWidth(),
					marginRight: sRight.outerWidth() + tool._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			}
		} else {
			sLeft.hide();
			sRight.hide();
			if (opts.toolPosition == 'left'){
				tool.css({
					left: 0,
					right: ''
				});
				wrap.css({
					marginLeft: tool._outerWidth(),
					marginRight: 0,
					width: cWidth
				});
			} else {
				tool.css({
					left: '',
					right: 0
				});
				wrap.css({
					marginLeft: 0,
					marginRight: tool._outerWidth(),
					width: cWidth
				});
			}
//			wrap.scrollLeft(0);
		}
	}
	
	function addTools(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		if (opts.tools) {
			if (typeof opts.tools == 'string'){
				$(opts.tools).addClass('tabs-tool').appendTo(header);
				$(opts.tools).show();
			} else {
				header.children('div.tabs-tool').remove();
				var tools = $('<div class="tabs-tool"></div>').appendTo(header);
				for(var i=0; i<opts.tools.length; i++){
					var tool = $('<a href="javascript:void(0);"></a>').appendTo(tools);
					tool[0].onclick = eval(opts.tools[i].handler || function(){});
					tool.linkbutton($.extend({}, opts.tools[i], {
						plain: true
					}));
				}
			}
		} else {
			header.children('div.tabs-tool').remove();
		}
	}
	
	function setSize(container) {
		var opts = $.data(container, 'tabs').options;
		var cc = $(container);
		
		opts.fit ? $.extend(opts, cc._fit()) : cc._fit(false);
//		if (opts.fit == true){
//			var p = cc.parent();
//			p.addClass('panel-noscroll');
//			if (p[0].tagName == 'BODY') $('html').addClass('panel-fit');
//			opts.width = p.width();
//			opts.height = p.height();
//		}
		cc.width(opts.width).height(opts.height);
		
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right'){
			header._outerWidth(opts.headerWidth);
			panels._outerWidth(cc.width() - opts.headerWidth);
			header.add(panels)._outerHeight(opts.height);
			var wrap = header.find('div.tabs-wrap');
			wrap._outerWidth(header.width());
			header.find('.tabs')._outerWidth(wrap.width());
		} else {
			header.css('height','');
			header.find('div.tabs-wrap').css('width','');
			header.find('.tabs').css('width','');
			
			header._outerWidth(opts.width);
			
			setScrollers(container);
			
			var height = opts.height;
			if (!isNaN(height)) {
				panels._outerHeight(height - header.outerHeight());
			} else {
				panels.height('auto');
			}
			var width = opts.width;
			if (!isNaN(width)){
				panels._outerWidth(width);
			} else {
				panels.width('auto');
			}
		}
	}
	
	/**
	 * set selected tab panel size
	 */
	function setSelectedSize(container){
		var opts = $.data(container, 'tabs').options;
		var tab = getSelectedTab(container);
		if (tab){
			var panels = $(container).children('div.tabs-panels');
			var width = opts.width=='auto' ? 'auto' : panels.width();
			var height = opts.height=='auto' ? 'auto' : panels.height();
			tab.panel('resize', {
				width: width,
				height: height
			});
		}
	}
	
	/**
	 * wrap the tabs header and body
	 */
	function wrapTabs(container) {
		var tabs = $.data(container, 'tabs').tabs;
		var cc = $(container);
		cc.addClass('tabs-container');
		cc.wrapInner('<div class="tabs-panels"/>');
		$('<div class="tabs-header">'
				+ '<div class="tabs-scroller-left"></div>'
				+ '<div class="tabs-scroller-right"></div>'
				+ '<div class="tabs-wrap">'
				+ '<ul class="tabs"></ul>'
				+ '</div>'
				+ '</div>').prependTo(container);
		
		cc.children('div.tabs-panels').children('div').each(function(i){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			var pp = $(this);
			tabs.push(pp);
			createTab(container, pp, opts);
		});
		
		cc.children('div.tabs-header').find('.tabs-scroller-left, .tabs-scroller-right').hover(
			function(){$(this).addClass('tabs-scroller-over');},
			function(){$(this).removeClass('tabs-scroller-over');}
		);
		cc.bind('_resize', function(e,force){
			var opts = $.data(container, 'tabs').options;
			if (opts.fit == true || force){
				setSize(container);
				setSelectedSize(container);
			}
			return false;
		});
	}
	
	function setProperties(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		
		header.removeClass('tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right');
		panels.removeClass('tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right');
		if (opts.tabPosition == 'top'){
			header.insertBefore(panels);
		}else if (opts.tabPosition == 'bottom'){
			header.insertAfter(panels);
			header.addClass('tabs-header-bottom');
			panels.addClass('tabs-panels-top');
		} else if (opts.tabPosition == 'left'){
			header.addClass('tabs-header-left');
			panels.addClass('tabs-panels-right');
		} else if (opts.tabPosition == 'right'){
			header.addClass('tabs-header-right');
//			header.addClass('tabs-header-left tabs-header-right');
			panels.addClass('tabs-panels-left');
		}
		
		if (opts.plain == true) {
			header.addClass('tabs-header-plain');
		} else {
			header.removeClass('tabs-header-plain');
		}
		if (opts.border == true){
			header.removeClass('tabs-header-noborder');
			panels.removeClass('tabs-panels-noborder');
		} else {
			header.addClass('tabs-header-noborder');
			panels.addClass('tabs-panels-noborder');
		}
		
		$('.tabs-scroller-left', header).unbind('.tabs').bind('click.tabs', function(){
			$(container).tabs('scrollBy', -opts.scrollIncrement);
		});
		
		$('.tabs-scroller-right', header).unbind('.tabs').bind('click.tabs', function(){
			$(container).tabs('scrollBy', opts.scrollIncrement);
		});
	}
	
	function createTab(container, pp, options) {
		var state = $.data(container, 'tabs');
		options = options || {};
		
		// create panel
		pp.panel($.extend({}, options, {
			border: false,
			noheader: true,
			closed: true,
			doSize: false,
			iconCls: (options.icon ? options.icon : undefined),
			onLoad: function(){
				if (options.onLoad){
					options.onLoad.call(this, arguments);
				}
				state.options.onLoad.call(container, $(this));
			}
		}));
		
		var opts = pp.panel('options');
		
		var tabs = $(container).children('div.tabs-header').find('ul.tabs');
		
		opts.tab = $('<li></li>').appendTo(tabs);	// set the tab object in panel options
		opts.tab.append(
				'<a href="javascript:void(0)" class="tabs-inner">' +
				'<span class="tabs-title"></span>' +
				'<span class="tabs-icon"></span>' +
				'</a>'
		);
		if(opts.disabled){//如果disbabled属性有效
			opts.tab.addClass('tabs-disabled');
		}
		opts.tab.unbind('.tabs').bind('click.tabs', {p:pp}, function(e){
			if ($(this).hasClass('tabs-disabled')){return;}
			selectTab(container, getTabIndex(container, e.data.p));
		}).bind('contextmenu.tabs', {p:pp}, function(e){
			if ($(this).hasClass('tabs-disabled')){return;}
			state.options.onContextMenu.call(container, e, $(this).find('span.tabs-title').html(), getTabIndex(container, e.data.p));
		});
		
//		updateTab(container, {
//			tab: pp,
//			options: opts
//		});
		$(container).tabs('update', {
			tab: pp,
			options: opts
		});
	}
	
	function addTab(container, options) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		if (options.selected == undefined) options.selected = true;
		
		var pp = $('<div></div>').appendTo($(container).children('div.tabs-panels'));
		tabs.push(pp);
		pp.attr("page-params", true).data("page-params", options.params);
		createTab(container, pp, options);
		opts.onAdd.call(container, options.title, tabs.length-1);
		
		setScrollers(container);
		if (options.selected){
			selectTab(container, tabs.length-1);	// select the added tab panel
		}
	}
	
	/**
	 * update tab panel, param has following properties:
	 * tab: the tab panel to be updated
	 * options: the tab panel options
	 */
	function updateTab(container, param){
		var selectHis = $.data(container, 'tabs').selectHis;
		var pp = param.tab;	// the tab panel
		var oldTitle = pp.panel('options').title; 
		pp.panel($.extend({}, param.options, {
			iconCls: (param.options.icon ? param.options.icon : undefined)
		}));
		
		var opts = pp.panel('options');	// get the tab panel options
		var tab = opts.tab;
		
		var s_title = tab.find('span.tabs-title');
		var s_icon = tab.find('span.tabs-icon');
		s_title.html(opts.title);
		s_icon.attr('class', 'tabs-icon');
		
		tab.find('a.tabs-close').remove();
		if (opts.closable){
			s_title.addClass('tabs-closable');
			var a_close = $('<a href="javascript:void(0)" class="tabs-close"></a>').appendTo(tab);
			a_close.bind('click.tabs', {p:pp}, function(e){
				if ($(this).parent().hasClass('tabs-disabled')){return;}
				closeTab(container, getTabIndex(container, e.data.p));
				return false;
			});
		} else{
			s_title.removeClass('tabs-closable');
		}
		if (opts.iconCls){
			s_title.addClass('tabs-with-icon');
			s_icon.addClass(opts.iconCls);
		} else {
			s_title.removeClass('tabs-with-icon');
		}
		
		if (oldTitle != opts.title){
			for(var i=0; i<selectHis.length; i++){
				if (selectHis[i] == oldTitle){
					selectHis[i] = opts.title;
				}
			}
		}
		
		tab.find('span.tabs-p-tool').remove();
		if (opts.tools){
			var p_tool = $('<span class="tabs-p-tool"></span>').insertAfter(tab.find('a.tabs-inner'));
			if (typeof opts.tools == 'string'){
				$(opts.tools).children().appendTo(p_tool);
			} else {
				for(var i=0; i<opts.tools.length; i++){
					var t = $('<a href="javascript:void(0)"></a>').appendTo(p_tool);
					t.addClass(opts.tools[i].iconCls);
					if (opts.tools[i].handler){
//						t.bind('click', eval(opts.tools[i].handler));
						t.bind('click', {handler:opts.tools[i].handler}, function(e){
							if ($(this).parents('li').hasClass('tabs-disabled')){return;}
							e.data.handler.call(this);
						});
					}
				}
			}
			var pr = p_tool.children().length * 12;
			if (opts.closable) {
				pr += 8;
			} else {
				pr -= 3;
				p_tool.css('right','5px');
			}
			s_title.css('padding-right', pr+'px');
		}
		
//		setProperties(container);
		setScrollers(container);
		
		$.data(container, 'tabs').options.onUpdate.call(container, opts.title, getTabIndex(container, pp));
	}
	
	/**
	 * close a tab with specified index or title
	 */
	function closeTab(container, which) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		
		if (!exists(container, which)) return;
		
		var tab = getTab(container, which);
		var title = tab.panel('options').title;
		var index = getTabIndex(container, tab);
		
		if (opts.onBeforeClose.call(container, title, index) == false) return;
		
		var tab = getTab(container, which, true);
		tab.panel('options').tab.remove();
		tab.panel('destroy');
		
		opts.onClose.call(container, title, index);
		
		setScrollers(container);
		
		// remove the select history item
		for(var i=0; i<selectHis.length; i++){
			if (selectHis[i] == title){
				selectHis.splice(i, 1);
				i --;
			}
		}
		
		// select the nearest tab panel
		var hisTitle = selectHis.pop();
		if (hisTitle){
			selectTab(container, hisTitle);
		} else if (tabs.length){
			selectTab(container, 0);
		}
	}
	
	/**
	 * get the specified tab panel
	 */
	function getTab(container, which, removeit){
		var tabs = $.data(container, 'tabs').tabs;
		if (typeof which == 'number'){
			if (which < 0 || which >= tabs.length){
				return null;
			} else {
				var tab = tabs[which];
				if (removeit) {
					tabs.splice(which, 1);
				}
				return tab;
			}
		}
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').title == which){
				if (removeit){
					tabs.splice(i, 1);
				}
				return tab;
			}
		}
		return null;
	}
	
	function getTabIndex(container, tab){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i][0] == $(tab)[0]){
				return i;
			}
		}
		return -1;
	}
	
	function getSelectedTab(container){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').closed == false){
				return tab;
			}
		}
		return null;
	}
	
	/**
	 * do first select action, if no tab is setted the first tab will be selected.
	 */
	function doFirstSelect(container){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i].panel('options').selected){
				selectTab(container, i);
				return;
			}
		}
		if (tabs.length){
			selectTab(container, 0);
		}
	}
	
	function selectTab(container, which){
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		
		if (tabs.length == 0) return;
		
		var panel = getTab(container, which); // get the panel to be activated
		if (!panel) return;
		
		var selected = getSelectedTab(container);
		if (selected){
			selected.panel('close');
			selected.panel('options').tab.removeClass('tabs-selected');
		}
		
		panel.panel('open');
		var title = panel.panel('options').title;	// the panel title
		selectHis.push(title);	// push select history
		
		var tab = panel.panel('options').tab;	// get the tab object
		tab.addClass('tabs-selected');
		
		// scroll the tab to center position if required.
		var wrap = $(container).find('>div.tabs-header>div.tabs-wrap');
		var left = tab.position().left;
		var right = left + tab.outerWidth();
		if (left < 0 || right > wrap.width()){
			var deltaX = left - (wrap.width()-tab.width()) / 2;
			$(container).tabs('scrollBy', deltaX);
		} else {
			$(container).tabs('scrollBy', 0);
		}
		
		setSelectedSize(container);
		
		opts.onSelect.call(container, title, getTabIndex(container, panel));
	}
	
	function exists(container, which){
		return getTab(container, which) != null;
	}
	
	
	$.fn.tabs = function(options, param1, param2){
		if (typeof options == 'string') {
			return $.fn.tabs.methods[options](this, param1, param2);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tabs');
			var opts;
			if (state) {
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				$.data(this, 'tabs', {
					options: $.extend({},$.fn.tabs.defaults, $.fn.tabs.parseOptions(this), options),
					tabs: [],
					selectHis: []
				});
				wrapTabs(this);
			}
			
			addTools(this);
			setProperties(this);
			setSize(this);
			
			doFirstSelect(this);
		});
	};
	
	$.fn.tabs.methods = {
		options: function(jq){
			return $.data(jq[0], 'tabs').options;
		},
		tabs: function(jq){
			return $.data(jq[0], 'tabs').tabs;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
				setSelectedSize(this);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				addTab(this, options);
			});
		},
		close: function(jq, which){
			return jq.each(function(){
				closeTab(this, which);
			});
		},
		getTab: function(jq, which){
			return getTab(jq[0], which);
		},
		getTabIndex: function(jq, tab){
			return getTabIndex(jq[0], tab);
		},
		getSelected: function(jq){
			return getSelectedTab(jq[0]);
		},
		select: function(jq, which){
			return jq.each(function(){
				selectTab(this, which);
			});
		},
		exists: function(jq, which){
			return exists(jq[0], which);
		},
		update: function(jq, options){
			return jq.each(function(){
				updateTab(this, options);
			});
		},
		enableTab: function(jq, which){
			return jq.each(function(){
				$(this).tabs('getTab', which).panel('options').tab.removeClass('tabs-disabled');
			});
		},
		disableTab: function(jq, which){
			return jq.each(function(){
				$(this).tabs('getTab', which).panel('options').tab.addClass('tabs-disabled');
			});
		},
		scrollBy: function(jq, deltaX){	// scroll the tab header by the specified amount of pixels
			return jq.each(function(){
				var opts = $(this).tabs('options');
				var wrap = $(this).find('>div.tabs-header>div.tabs-wrap');
				var pos = Math.min(wrap._scrollLeft() + deltaX, getMaxScrollWidth());
				wrap.animate({scrollLeft: pos}, opts.scrollDuration);
				
				function getMaxScrollWidth(){
					var w = 0;
					var ul = wrap.children('ul');
					ul.children('li').each(function(){
						w += $(this).outerWidth(true);
					});
					return w - wrap.width() + (ul.outerWidth() - ul.width());
				}
			});
		}
	};
	
	$.fn.tabs.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height','tools','toolPosition','tabPosition',
			{fit:'boolean',border:'boolean',plain:'boolean',headerWidth:'number'}
		]));
	};
	
	$.fn.tabs.defaults = {
		width: 'auto',
		height: 'auto',
		headerWidth: 150,	// the tab header width, it is valid only when tabPosition set to 'left' or 'right' 
		plain: false,
		fit: false,
		border: true,
		tools: null,
		toolPosition: 'right',	// left,right
		tabPosition: 'top',		// possible values: top,bottom
		scrollIncrement: 100,
		scrollDuration: 400,
		onLoad: function(panel){},
		onSelect: function(title, index){},
		onBeforeClose: function(title, index){},
		onClose: function(title, index){},
		onAdd: function(title, index){},
		onUpdate: function(title, index){},
		onContextMenu: function(e, title, index){}
	};
})(jQuery);

/**
 * accordion - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 panel
 * 
 */
(function($){
	
	function setSize(container){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;
		
		var cc = $(container);
		opts.fit ? $.extend(opts, cc._fit()) : cc._fit(false);
//		if (opts.fit == true){
//			var p = cc.parent();
//			p.addClass('panel-noscroll');
//			if (p[0].tagName == 'BODY') $('html').addClass('panel-fit');
//			opts.width = p.width();
//			opts.height = p.height();
//		}
		
		if (opts.width > 0){
			cc._outerWidth(opts.width);
		}
		var panelHeight = 'auto';
		if (opts.height > 0){
			cc._outerHeight(opts.height);
			// get the first panel's header height as all the header height
			var headerHeight = panels.length ? panels[0].panel('header').css('height', '')._outerHeight() : 'auto';
			var panelHeight = cc.height() - (panels.length-1)*headerHeight;
		}
		for(var i=0; i<panels.length; i++){
			var panel = panels[i];
			var header = panel.panel('header');
			header._outerHeight(headerHeight);
			panel.panel('resize', {
				width: cc.width(),
				height: panelHeight
			});
		}
	}
	
	/**
	 * get the current panel
	 */
	function getCurrent(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			var panel = panels[i];
			if (panel.panel('options').collapsed == false){
				return panel;
			}
		}
		return null;
	}
	
	/**
	 * get panel index, start with 0
	 */
	function getPanelIndex(container, panel){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			if (panels[i][0] == $(panel)[0]){
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * get the specified panel, remove it from panel array if removeit setted to true.
	 */
	function getPanel(container, which, removeit){
		var panels = $.data(container, 'accordion').panels;
		if (typeof which == 'number'){
			if (which < 0 || which >= panels.length){
				return null;
			} else {
				var panel = panels[which];
				if (removeit){
					panels.splice(which,1);
				}
				return panel;
			}
		}
		for(var i=0; i<panels.length; i++){
			var panel = panels[i];
			if (panel.panel('options').title == which){
				if (removeit){
					panels.splice(i, 1);
				}
				return panel;
			}
		}
		return null;
	}
	
	function setProperties(container){
		var opts = $.data(container, 'accordion').options;
		var cc = $(container);
		if (opts.border){
			cc.removeClass('accordion-noborder');
		} else {
			cc.addClass('accordion-noborder');
		}
	}
	
	function wrapAccordion(container){
		var cc = $(container);
		cc.addClass('accordion');
		
		var panels = [];
		cc.children('div').each(function(){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			var pp = $(this);
			panels.push(pp);
			createPanel(container, pp, opts);
		});
		
		cc.bind('_resize', function(e,force){
			var opts = $.data(container, 'accordion').options;
			if (opts.fit == true || force){
				setSize(container);
			}
			return false;
		});
		
		return {
			accordion: cc,
			panels: panels
		}
	}
	
	function createPanel(container, pp, options){
		pp.attr("page-params", true).data("page-params",options.params);
		pp.panel($.extend({}, options, {
			collapsible: false,
			minimizable: false,
			maximizable: false,
			closable: false,
			doSize: false,
			collapsed: true,
			headerCls: 'accordion-header',
			bodyCls: 'accordion-body',
			onBeforeExpand: function(){
				var curr = getCurrent(container);
				if (curr){
					var header = $(curr).panel('header');
					header.removeClass('accordion-header-selected');
					header.find('.accordion-collapse').triggerHandler('click');
				}
				var header = pp.panel('header');
				header.addClass('accordion-header-selected');
				header.find('.accordion-collapse').removeClass('accordion-expand');
			},
			onExpand: function(){
				var opts = $.data(container, 'accordion').options;
				opts.onSelect.call(container, pp.panel('options').title, getPanelIndex(container, this));
			},
			onBeforeCollapse: function(){
				var header = pp.panel('header');
				header.removeClass('accordion-header-selected');
				header.find('.accordion-collapse').addClass('accordion-expand');
			}
		}));
		
		var header = pp.panel('header');
		var t = $('<a class="accordion-collapse accordion-expand" href="javascript:void(0)"></a>').appendTo(header.children('div.panel-tool'));
		t.bind('click', function(e){
			var animate = $.data(container, 'accordion').options.animate;
			stopAnimate(container);
			if (pp.panel('options').collapsed){
				pp.panel('expand', animate);
			} else {
				pp.panel('collapse', animate);
			}
			return false;
		});
		
		header.click(function(){
			$(this).find('.accordion-collapse').triggerHandler('click');
			return false;
		});
	}
	
	/**
	 * select and set the specified panel active
	 */
	function select(container, which){
		var panel = getPanel(container, which);
		if (!panel) return;
		
		var curr = getCurrent(container);
		if (curr && curr[0] == panel[0]){
			return;
		}
		
		panel.panel('header').triggerHandler('click');
	}
	
	function doFirstSelect(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			if (panels[i].panel('options').selected){
				_select(i);
				return;
			}
		}
		if (panels.length){
			_select(0);
		}
		
		function _select(index){
			var opts = $.data(container, 'accordion').options;
			var animate = opts.animate;
			opts.animate = false;
			select(container, index);
			opts.animate = animate;
		}
	}
	
	/**
	 * stop the animation of all panels
	 */
	function stopAnimate(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			panels[i].stop(true,true);
		}
	}
	
	function add(container, options){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;
		if (options.selected == undefined) options.selected = true;

		stopAnimate(container);
		
		var pp = $('<div></div>').appendTo(container);
		panels.push(pp);
		createPanel(container, pp, options);
		setSize(container);
		
		opts.onAdd.call(container, options.title, panels.length-1);
		
		if (options.selected){
			select(container, panels.length-1);
		}
	}
	
	function remove(container, which){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;
		
		stopAnimate(container);
		
		var panel = getPanel(container, which);
		var title = panel.panel('options').title;
		var index = getPanelIndex(container, panel);
		
		if (opts.onBeforeRemove.call(container, title, index) == false) return;
		
		var panel = getPanel(container, which, true);
		if (panel){
			panel.panel('destroy');
			if (panels.length){
				setSize(container);
				var curr = getCurrent(container);
				if (!curr){
					select(container, 0);
				}
			}
		}
		
		opts.onRemove.call(container, title, index);
	}
	
	$.fn.accordion = function(options, param){
		if (typeof options == 'string'){
			return $.fn.accordion.methods[options](this, param);
		}
		
		options = options || {};
		
		return this.each(function(){
			var state = $.data(this, 'accordion');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
				state.opts = opts;
			} else {
				opts = $.extend({}, $.fn.accordion.defaults, $.fn.accordion.parseOptions(this), options);
				var r = wrapAccordion(this);
				$.data(this, 'accordion', {
					options: opts,
					accordion: r.accordion,
					panels: r.panels
				});
			}
			
			setProperties(this);
			setSize(this);
			doFirstSelect(this);
		});
	};
	
	$.fn.accordion.methods = {
		options: function(jq){
			return $.data(jq[0], 'accordion').options;
		},
		panels: function(jq){
			return $.data(jq[0], 'accordion').panels;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
			});
		},
		getSelected: function(jq){
			return getCurrent(jq[0]);
		},
		getPanel: function(jq, which){
			return getPanel(jq[0], which);
		},
		getPanelIndex: function(jq, panel){
			return getPanelIndex(jq[0], panel);
		},
		select: function(jq, which){
			return jq.each(function(){
				select(this, which);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				add(this, options);
			});
		},
		remove: function(jq, which){
			return jq.each(function(){
				remove(this, which);
			});
		}
	};
	
	$.fn.accordion.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height',{fit:'boolean',border:'boolean',animate:'boolean'}
		]));
	};
	
	$.fn.accordion.defaults = {
		width: 'auto',
		height: 'auto',
		fit: false,
		border: true,
		animate: true,
		
		onSelect: function(title, index){},
		onAdd: function(title, index){},
		onBeforeRemove: function(title, index){},
		onRemove: function(title, index){}
	};
})(jQuery);

/**
 * window - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 panel
 *   draggable
 *   resizable
 * 
 */
(function($){
	function setSize(target, param){
		var opts = $.data(target, 'window').options;
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
			if (param.left != null) opts.left = param.left;
			if (param.top != null) opts.top = param.top;
		}
		$(target).panel('resize', opts);
	}
	
	function moveWindow(target, param){
		var state = $.data(target, 'window');
		if (param){
			if (param.left != null) state.options.left = param.left;
			if (param.top != null) state.options.top = param.top;
		}
		$(target).panel('move', state.options);
		if (state.shadow){
			state.shadow.css({
				left: state.options.left,
				top: state.options.top
			});
		}
	}
	
	/**
	 *  center the window only horizontally
	 */
	function hcenter(target, tomove){
		var state = $.data(target, 'window');
		var opts = state.options;
		var width = opts.width;
		if (isNaN(width)){
			width = state.window._outerWidth();
		}
		if (opts.inline){
			var parent = state.window.parent();
			opts.left = (parent.width() - width) / 2 + parent.scrollLeft();
		} else {
			opts.left = ($(window)._outerWidth() - width) / 2 + $(document).scrollLeft();
		}
		if (tomove){moveWindow(target);}
	}
	
	/**
	 * center the window only vertically
	 */
	function vcenter(target, tomove){
		var state = $.data(target, 'window');
		var opts = state.options;
		var height = opts.height;
		if (isNaN(height)){
			height = state.window._outerHeight();
		}
		if (opts.inline){
			var parent = state.window.parent();
			opts.top = (parent.height() - height) / 2 + parent.scrollTop();
		} else {
			opts.top = ($(window)._outerHeight() - height) / 2 + $(document).scrollTop();
		}
		if (tomove){moveWindow(target);}
	}
	
	function create(target){
		var state = $.data(target, 'window');
		var iframe = "<iframe name='kill_activex' frameborder='0' style='position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;scrolling:no;'></iframe>";
		$(iframe).appendTo(target);
		var win = $(target).panel($.extend({}, state.options, {
			border: false,
			doSize: true,	// size the panel, the property undefined in window component
			closed: true,	// close the panel
			cls: 'window',
			headerCls: 'window-header',
			bodyCls: 'window-body ' + (state.options.noheader ? 'window-body-noheader' : ''),
			
			onBeforeDestroy: function(){
				if (state.options.onBeforeDestroy.call(target) == false) return false;
				if (state.shadow) state.shadow.remove();
				if (state.mask) state.mask.remove();
			},
			onClose: function(message){
				if (state.shadow) state.shadow.hide();
				if (state.mask) state.mask.hide();
				state.options.onClose.call(target, message);
			},
			onOpen: function(){
				if (state.mask){
					state.mask.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++
					});
				}
				if (state.shadow){
					state.shadow.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++,
						left: state.options.left,
						top: state.options.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				
				state.options.onOpen.call(target);
			},
			onResize: function(width, height){
				var opts = $(this).panel('options');
				$.extend(state.options, {
					width: opts.width,
					height: opts.height,
					left: opts.left,
					top: opts.top
				});
				if (state.shadow){
					state.shadow.css({
						left: state.options.left,
						top: state.options.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				
				state.options.onResize.call(target, width, height);
			},
			onMinimize: function(){
				if (state.shadow) state.shadow.hide();
				if (state.mask) state.mask.hide();
				
				state.options.onMinimize.call(target);
			},
			onBeforeCollapse: function(){
				if (state.options.onBeforeCollapse.call(target) == false) return false;
				if (state.shadow) state.shadow.hide();
			},
			onExpand: function(){
				if (state.shadow) state.shadow.show();
				state.options.onExpand.call(target);
			}
		}));
		
		state.window = win.panel('panel');
		
		// create mask
		if (state.mask) state.mask.remove();
		if (state.options.modal == true){
			state.mask = $('<div class="window-mask"></div>').insertAfter(state.window);
			state.mask.css({
				width: (state.options.inline ? state.mask.parent().width() : getPageArea().width),
				height: (state.options.inline ? state.mask.parent().height() : getPageArea().height),
				display: 'none'
			});
		}
		
		// create shadow
		if (state.shadow) state.shadow.remove();
		if (state.options.shadow == true){
			state.shadow = $('<div class="window-shadow"></div>').insertAfter(state.window);
			state.shadow.css({
				display: 'none'
			});
		}
		
		// if require center the window
		if (state.options.left == null){hcenter(target);}
		if (state.options.top == null){vcenter(target);}
		moveWindow(target);
		
		if (state.options.closed == false){
			win.window('open');	// open the window
		}
	}
	
	
	/**
	 * set window drag and resize property
	 */
	function setProperties(target){
		var state = $.data(target, 'window');
		
		state.window.draggable({
			handle: '>div.panel-header>div.panel-title',
			disabled: state.options.draggable == false,
			onStartDrag: function(e){
				if (state.mask) state.mask.css('z-index', $.fn.window.defaults.zIndex++);
				if (state.shadow) state.shadow.css('z-index', $.fn.window.defaults.zIndex++);
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				
				if (!state.proxy){
					state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				}
				state.proxy.css({
					display:'none',
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(state.window._outerWidth());
				state.proxy._outerHeight(state.window._outerHeight());
				setTimeout(function(){
					if (state.proxy) state.proxy.show();
				}, 500);
			},
			onDrag: function(e){
				state.proxy.css({
					display:'block',
					left: e.data.left,
					top: e.data.top
				});
				return false;
			},
			onStopDrag: function(e){
				state.options.left = e.data.left;
				state.options.top = e.data.top;
				$(target).window('move');
				state.proxy.remove();
				state.proxy = null;
			}
		});
		
		state.window.resizable({
			disabled: state.options.resizable == false,
			onStartResize:function(e){
				state.pmask = $('<div class="window-proxy-mask"></div>').insertAfter(state.window);
				state.pmask.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: state.window._outerWidth(),
					height: state.window._outerHeight()
				});
				if (!state.proxy){
					state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				}
				state.proxy.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(e.data.width);
				state.proxy._outerHeight(e.data.height);
			},
			onResize: function(e){
				state.proxy.css({
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(e.data.width);
				state.proxy._outerHeight(e.data.height);
				return false;
			},
			onStopResize: function(e){
				$.extend(state.options, {
					left: e.data.left,
					top: e.data.top,
					width: e.data.width,
					height: e.data.height
				});
				setSize(target);
				state.pmask.remove();
				state.pmask = null;
				state.proxy.remove();
				state.proxy = null;
			}
		});
	}
	
	function getPageArea() {
		if (document.compatMode == 'BackCompat') {
			return {
				width: Math.max(document.body.scrollWidth, document.body.clientWidth),
				height: Math.max(document.body.scrollHeight, document.body.clientHeight)
			}
		} else {
			return {
				width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
				height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
			}
		}
	}
	
	// when window resize, reset the width and height of the window's mask
	$(window).resize(function(){
		$('body>div.window-mask').css({
			width: $(window)._outerWidth(),
			height: $(window)._outerHeight()
		});
		setTimeout(function(){
			$('body>div.window-mask').css({
				width: getPageArea().width,
				height: getPageArea().height
			});
		}, 50);
	});
	
	$.fn.window = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.window.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.panel(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'window');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'window', {
					options: $.extend({}, $.fn.window.defaults, $.fn.window.parseOptions(this), options)
				});
				if (!state.options.inline){
//					$(this).appendTo('body');
					document.body.appendChild(this);
				}
			}
			create(this);
			setProperties(this);
		});
	};
	
	$.fn.window.methods = {
		options: function(jq){
			var popts = jq.panel('options');
			var wopts = $.data(jq[0], 'window').options;
			return $.extend(wopts, {
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
		},
		window: function(jq){
			return $.data(jq[0], 'window').window;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		move: function(jq, param){
			return jq.each(function(){
				moveWindow(this, param);
			});
		},
		hcenter: function(jq){
			return jq.each(function(){
				hcenter(this, true);
			});
		},
		vcenter: function(jq){
			return jq.each(function(){
				vcenter(this, true);
			});
		},
		center: function(jq){
			return jq.each(function(){
				hcenter(this);
				vcenter(this);
				moveWindow(this);
			});
		}
	};
	
	$.fn.window.parseOptions = function(target){
		return $.extend({}, $.fn.panel.parseOptions(target), $.parser.parseOptions(target, [
			{draggable:'boolean',resizable:'boolean',shadow:'boolean',modal:'boolean',inline:'boolean'}
		]));
	};
	
	// Inherited from $.fn.panel.defaults
	$.fn.window.defaults = $.extend({}, $.fn.panel.defaults, {
		zIndex: 9000,
		draggable: true,
		resizable: true,
		shadow: true,
		modal: false,
		inline: false,	// true to stay inside its parent, false to go on top of all elements
		
		// window's property which difference from panel
		title: 'New Window',
		collapsible: true,
		minimizable: true,
		maximizable: true,
		closable: true,
		closed: false
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function getContentPanel(target) {
		var div = document.createElement("div");
		while (target.firstChild) {
			div.appendChild(target.firstChild);
		}
		target.appendChild(div);
		var $div = $(div);
		$div.attr("style", $(target).attr("style"));
		$(target).removeAttr("style").css("overflow", "hidden");
		$div.panel({
			border : false,
			doSize : false,
			bodyCls : "dialog-content"
		});
		return $div;
	}
	;
	function init(target) {
		var options = $.data(target, "dialog").options;
		var $contentPanel = $.data(target, "dialog").contentPanel;
		if (options.toolbar) {
			if (typeof options.toolbar == "string" || typeof options.toolbar == "object") {
				$(options.toolbar).addClass("dialog-toolbar").prependTo(target);
				$(options.toolbar).show();
			} else {
				$(target).find("div.dialog-toolbar").remove();
				var $toolbar = $("<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(target);
				var tr = $toolbar.find("tr");
				for ( var i = 0; i < options.toolbar.length; i++) {
					var bar = options.toolbar[i];
					if (bar == "-") {
						$("<td><div class=\"dialog-tool-separator\"></div></td>").appendTo(tr);
					} else {
						var td = $("<td></td>").appendTo(tr);
						var $a = $("<a href=\"javascript:void(0)\"></a>").appendTo(td);
						$a[0].onclick = eval(bar.handler || function() {
						});
						$a.linkbutton($.extend({}, bar, {
							plain : true
						}));
					}
				}
			}
		} else {
			$(target).find("div.dialog-toolbar").remove();
		}
		if (options.buttons) {
			if (typeof options.buttons == "string" || typeof options.buttons == "object") {
				$(options.buttons).addClass("dialog-button").appendTo(target);
				$(options.buttons).show();
			} else {
				$(target).find("div.dialog-button").remove();
				var $button = $("<div class=\"dialog-button\"></div>").appendTo(target);
				for ( var i = 0; i < options.buttons.length; i++) {
					var p = options.buttons[i];
					var $a = $("<a href=\"javascript:void(0)\"></a>").appendTo($button);
					if (p.handler) {
						$a[0].onclick = p.handler;
					}
					$a.linkbutton(p);
				}
			}
		} else {
			$(target).find("div.dialog-button").remove();
		}
		var href = options.href;
		var content = options.content;
		options.href = null;
		options.content = null;
		$contentPanel.panel({
			closed : options.closed,
			cache : options.cache,
			href : href,
			params:options.params,
			content : content,
			onLoad : function() {
				if (options.height == "auto") {
					$(target).window("resize");
				}
				options.onLoad.apply(target, arguments);
			}
		});
		$(target).window(
				$.extend({}, options, {
					onOpen : function() {
						if ($contentPanel.panel("options").closed) {
							$contentPanel.panel("open");
						}
						if (options.onOpen) {
							options.onOpen.call(target);
						}
					},
					onResize : function(width, height) {
						var $target = $(target);
						$contentPanel.panel("panel").show();
						$contentPanel.panel("resize", {
							width : $target.width(),
							height : (height == "auto") ? "auto" : $target.height() - $target.children("div.dialog-toolbar")._outerHeight()
									- $target.children("div.dialog-button")._outerHeight()
						});
						if (options.onResize) {
							options.onResize.call(target, width, height);
						}
					}
				}));
		options.href = href;
		options.content = content;
	}
	;
	function refresh(target, href) {
		var contentPanel = $.data(target, "dialog").contentPanel;
		contentPanel.panel("refresh", href);
	}
	;
	$.fn.dialog = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.dialog.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.window(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "dialog");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "dialog", {
					options : $.extend({}, $.fn.dialog.defaults, $.fn.dialog.parseOptions(this), options),
					contentPanel : getContentPanel(this)
				});
			}
			init(this);
		});
	};
	$.fn.dialog.methods = {
		options : function(jq) {
			var options = $.data(jq[0], "dialog").options;
			var panelOptions = jq.panel("options");
			$.extend(options, {
				closed : panelOptions.closed,
				collapsed : panelOptions.collapsed,
				minimized : panelOptions.minimized,
				maximized : panelOptions.maximized
			});
			var contentPanel = $.data(jq[0], "dialog").contentPanel;
			return options;
		},
		dialog : function(jq) {
			return jq.window("window");
		},
		refresh : function(jq, href) {
			return jq.each(function() {
				refresh(this, href);
			});
		}
	};
	$.fn.dialog.parseOptions = function(target) {
		return $.extend({}, $.fn.window.parseOptions(target), $.parser.parseOptions(target, [ "toolbar", "buttons" ]));
	};
	$.fn.dialog.defaults = $.extend({}, $.fn.window.defaults, {
		title : "New Dialog",
		collapsible : false,
		minimizable : false,
		maximizable : false,
		resizable : false,
		toolbar : null,
		buttons : null
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "combogrid").options;
		var _4 = $.data(_2, "combogrid").grid;
		$(_2).addClass("combogrid-f");
		$(_2).combo(_3);
		var _5 = $(_2).combo("panel");
		if (!_4) {
			_4 = $("<table></table>").appendTo(_5);
			$.data(_2, "combogrid").grid = _4;
		}
		_4.datagrid($.extend({}, _3, {
			border : false,
			fit : true,
			singleSelect : (!_3.multiple),
			onLoadSuccess : function(_6) {
				var _7 = $.data(_2, "combogrid").remainText;
				var _8 = $(_2).combo("getValues");
				_1c(_2, _8, _7);
				_3.onLoadSuccess.apply(_2, arguments);
			},
			onClickRow : _9,
			onSelect : function(_a, _b) {
				_c();
				_3.onSelect.call(this, _a, _b);
			},
			onUnselect : function(_d, _e) {
				_c();
				_3.onUnselect.call(this, _d, _e);
			},
			onSelectAll : function(_f) {
				_c();
				_3.onSelectAll.call(this, _f);
			},
			onUnselectAll : function(_10) {
				if (_3.multiple) {
					_c();
				}
				_3.onUnselectAll.call(this, _10);
			}
		}));
		function _9(_11, row) {
			$.data(_2, "combogrid").remainText = false;
			_c();
			if (!_3.multiple) {
				$(_2).combo("hidePanel");
			}
			_3.onClickRow.call(this, _11, row);
		}
		;
		function _c() {
			var _12 = $.data(_2, "combogrid").remainText;
			var _13 = _4.datagrid("getSelections");
			var vv = [], ss = [];
			for ( var i = 0; i < _13.length; i++) {
				vv.push(_13[i][_3.idField]);
				ss.push(_13[i][_3.textField]);
			}
			if (!_3.multiple) {
				$(_2).combo("setValues", (vv.length ? vv : [ "" ]));
			} else {
				$(_2).combo("setValues", vv);
			}
			if (!_12) {
				$(_2).combo("setText", ss.join(_3.separator));
			}
		}
		;
	}
	;
	function _14(_15, _16) {
		var _17 = $.data(_15, "combogrid").options;
		var _18 = $.data(_15, "combogrid").grid;
		var _19 = _18.datagrid("getRows").length;
		if (!_19) {
			return;
		}
		$.data(_15, "combogrid").remainText = false;
		var _1a;
		var _1b = _18.datagrid("getSelections");
		if (_1b.length) {
			_1a = _18.datagrid("getRowIndex", _1b[_1b.length - 1][_17.idField]);
			_1a += _16;
			if (_1a < 0) {
				_1a = 0;
			}
			if (_1a >= _19) {
				_1a = _19 - 1;
			}
		} else {
			if (_16 > 0) {
				_1a = 0;
			} else {
				if (_16 < 0) {
					_1a = _19 - 1;
				} else {
					_1a = -1;
				}
			}
		}
		if (_1a >= 0) {
			_18.datagrid("clearSelections");
			_18.datagrid("selectRow", _1a);
		}
	}
	;
	function _1c(_1d, _1e, _1f) {
		var _20 = $.data(_1d, "combogrid").options;
		var _21 = $.data(_1d, "combogrid").grid;
		var _22 = _21.datagrid("getRows");
		var ss = [];
		for ( var i = 0; i < _1e.length; i++) {
			var _23 = _21.datagrid("getRowIndex", _1e[i]);
			if (_23 >= 0) {
				_21.datagrid("selectRow", _23);
				ss.push(_22[_23][_20.textField]);
			} else {
				ss.push(_1e[i]);
			}
		}
		if ($(_1d).combo("getValues").join(",") == _1e.join(",")) {
			return;
		}
		$(_1d).combo("setValues", _1e);
		if (!_1f) {
			$(_1d).combo("setText", ss.join(_20.separator));
		}
	}
	;
	function _24(_25, q) {
		var _26 = $.data(_25, "combogrid").options;
		var _27 = $.data(_25, "combogrid").grid;
		$.data(_25, "combogrid").remainText = true;
		if (_26.multiple && !q) {
			_1c(_25, [], true);
		} else {
			_1c(_25, [ q ], true);
		}
		if (_26.mode == "remote") {
			_27.datagrid("clearSelections");
			_27.datagrid("load", $.extend({}, _26.queryParams, {
				q : q
			}));
		} else {
			if (!q) {
				return;
			}
			var _28 = _27.datagrid("getRows");
			for ( var i = 0; i < _28.length; i++) {
				if (_26.filter.call(_25, q, _28[i])) {
					_27.datagrid("clearSelections");
					_27.datagrid("selectRow", i);
					return;
				}
			}
		}
	}
	;
	$.fn.combogrid = function(_29, _2a) {
		if (typeof _29 == "string") {
			var _2b = $.fn.combogrid.methods[_29];
			if (_2b) {
				return _2b(this, _2a);
			} else {
				return $.fn.combo.methods[_29](this, _2a);
			}
		}
		_29 = _29 || {};
		return this.each(function() {
			var _2c = $.data(this, "combogrid");
			if (_2c) {
				$.extend(_2c.options, _29);
			} else {
				_2c = $.data(this, "combogrid", {
					options : $.extend({}, $.fn.combogrid.defaults, $.fn.combogrid.parseOptions(this), _29)
				});
			}
			_1(this);
		});
	};
	$.fn.combogrid.methods = {
		options : function(jq) {
			var _2d = $.data(jq[0], "combogrid").options;
			_2d.originalValue = jq.combo("options").originalValue;
			return _2d;
		},
		grid : function(jq) {
			return $.data(jq[0], "combogrid").grid;
		},
		setValues : function(jq, _2e) {
			return jq.each(function() {
				_1c(this, _2e);
			});
		},
		setValue : function(jq, _2f) {
			return jq.each(function() {
				_1c(this, [ _2f ]);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).combogrid("grid").datagrid("clearSelections");
				$(this).combo("clear");
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _30 = $(this).combogrid("options");
				if (_30.multiple) {
					$(this).combogrid("setValues", _30.originalValue);
				} else {
					$(this).combogrid("setValue", _30.originalValue);
				}
			});
		}
	};
	$.fn.combogrid.parseOptions = function(_31) {
		var t = $(_31);
		return $.extend({}, $.fn.combo.parseOptions(_31), $.fn.datagrid.parseOptions(_31), $.parser.parseOptions(_31, [ "idField", "textField", "mode" ]));
	};
	$.fn.combogrid.defaults = $.extend({}, $.fn.combo.defaults, $.fn.datagrid.defaults, {
		loadMsg : null,
		idField : null,
		textField : null,
		mode : "local",
		keyHandler : {
			up : function() {
				_14(this, -1);
			},
			down : function() {
				_14(this, 1);
			},
			enter : function() {
				_14(this, 0);
				$(this).combo("hidePanel");
			},
			query : function(q) {
				_24(this, q);
			}
		},
		filter : function(q, row) {
			var _32 = $(this).combogrid("options");
			return row[_32.textField].indexOf(q) == 0;
		}
	});
})(jQuery);

﻿/**
 * jQuery EasyUI 1.3.2
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 * 
 * Licensed under the GPL or commercial licenses To use it on other terms please
 * contact us: jeasyui@gmail.com http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($) {
	function init(target) {
		var opts = $.data(target, "comboselect").options;
		var $select = $.data(target, "comboselect").select;
		$(target).addClass("combotree-f");
		$(target).combo(opts);
		var $panel = $(target).combo("panel");
		if (!$select) {
			$select = $("<ul></ul>").appendTo($panel);
			$.data(target, "comboselect").select = $select;
		}
	}
	
	function transformData(target){
		var opts = $.data(target, "comboselect").options;
		var data = [];
		$('>option', target).each(function(){
			var item = {};
			item[opts.valueField] = $(this).attr('value')!=undefined ? $(this).attr('value') : $(this).html();
			item[opts.textField] = $(this).html();
			item['selected'] = $(this).attr('selected');
			data.push(item);
		});
		return data;
	}
	
	/**
	 * load data, the old list items will be removed.
	 */
	function loadData(target, data, remainText){
		var opts = $.data(target, "comboselect").options;
		var panel = $(target).combo('panel');
		$.data(target, "comboselect").data = data;
		var selected = $(target).comboselect('getValues');
		panel.empty();	// clear old data
		var table = "<table width='100%'>";
		for(var i=0; i<data.length; i++){
			var value = data[i][opts.valueField];
			var text = data[i][opts.textField];
			if (opts.formatter ){
				text = (opts.formatter.call(target, data[i]));
			}
			if( opts.multiple ){
				table += "<tr style='height:20px;'><td><input type='checkbox' value='" + value + "'/></td><td>" + text + "</td></tr>";
			}else{
				table += "<tr><td></td><td>" + text + "</td></tr>";
			}
			var item = $('<div class="combobox-item"></div>').appendTo(panel);
			item.attr('value', v);
			if (data[i]['selected']){
				(function(){
					for(var i=0; i<selected.length; i++){
						if (v == selected[i]) return;
					}
					selected.push(v);
				})();
			}
		}
		table += "</table>";
		var $table = $(table).appendTo(panel);
		$table.find("tr").hover(function(){
			
		},function(){
			
		});
		if (opts.multiple){
			setValues(target, selected, remainText);
		} else {
			if (selected.length){
				setValues(target, [selected[selected.length-1]], remainText);
			} else {
				setValues(target, [], remainText);
			}
		}
		
		opts.onLoadSuccess.call(target, data);
		
		$('.comboselect-item', panel).hover(
			function(){$(this).addClass('combobox-item-hover');},
			function(){$(this).removeClass('combobox-item-hover');}
		).click(function(){
			var item = $(this);
			if (opts.multiple){
				if (item.hasClass('combobox-item-selected')){
					unselect(target, item.attr('value'));
				} else {
					select(target, item.attr('value'));
				}
			} else {
				select(target, item.attr('value'));
				$(target).combo('hidePanel');
			}
		});
	}

	function setComboValue(_14, _15) {
		var _16 = $.data(_14, "comboselect").options;
		var _17 = $.data(_14, "comboselect").tree;
		_17.find("span.tree-checkbox").addClass("tree-checkbox0").removeClass("tree-checkbox1 tree-checkbox2");
		var vv = [], ss = [];
		for ( var i = 0; i < _15.length; i++) {
			var v = _15[i];
			var s = v;
			var _18 = _17.tree("find", v);
			if (_18) {
				s = (_18.attributes && _18.attributes.text) ? _18.attributes.text : _18.text;
				_17.tree("check", _18.target);
				_17.tree("select", _18.target);
			}
			vv.push(v);
			ss.push(s);
		}
		$(_14).combo("setValues", vv).combo("setText", ss.join(_16.separator));
	}
	;
	
	$.fn.comboselect = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.comboselect.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "comboselect");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "comboselect", {
					options : $.extend({}, $.fn.comboselect.defaults, $.fn.comboselect.parseOptions(this), options)
				});
			}
			init(this);
		});
	};
	
	$.fn.comboselect.methods = {
		options : function(jq) {
			var opts = $.data(jq[0], "comboselect").options;
			opts.originalValue = jq.combo("options").originalValue;
			return opts;
		},
		loadData : function(jq, _1e) {
			return jq.each(function() {
				var _1f = $.data(this, "comboselect").options;
				_1f.data = _1e;
				var _20 = $.data(this, "comboselect").tree;
				_20.tree("loadData", _1e);
			});
		},
		reload : function(jq, url) {
			return jq.each(function() {
				var _21 = $.data(this, "comboselect").options;
				var _22 = $.data(this, "comboselect").tree;
				if (url) {
					_21.url = url;
				}
				_22.tree({
					url : _21.url
				});
			});
		},
		setValues : function(jq, values) {
			return jq.each(function() {
				setComboValue(this, values);
			});
		},
		setValue : function(jq, value) {
			return jq.each(function() {
				setComboValue(this, [ value ]);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				var $tree = $.data(this, "comboselect").tree;
				$tree.find("div.tree-node-selected").removeClass("tree-node-selected");
				var cc = $tree.tree("getChecked");
				for ( var i = 0; i < cc.length; i++) {
					$tree.tree("uncheck", cc[i].target);
				}
				$(this).combo("clear");
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var opts = $(this).combotree("options");
				if (opts.multiple) {
					$(this).combotree("setValues", opts.originalValue);
				} else {
					$(this).combotree("setValue", opts.originalValue);
				}
			});
		}
	};
	
	$.fn.comboselect.parseOptions = function(target) {
		return $.extend({}, $.fn.combo.parseOptions(target), {});
	};
	
	$.fn.comboselect.defaults = $.extend({}, $.fn.combo.defaults, {
		valueField: 'value',
		textField: 'text',
		mode: 'local',	// or 'remote'
		method: 'post',
		url: null,
		data: null,
		keyHandler: {
			up: function(){selectPrev(this);},
			down: function(){selectNext(this);},
			enter: function(){
				var values = $(this).comboselect('getValues');
				$(this).comboselect('setValues', values);
				$(this).comboselect('hidePanel');
			},
			query: function(q){doQuery(this, q);}
		},
		filter: function(q, row){
			var opts = $(this).comboselect('options');
			return row[opts.textField].indexOf(q) == 0;
		},
		formatter: function(row){
			var opts = $(this).comboselect('options');
			return row[opts.textField];
		},
		loader: function(param, success, error){
			var opts = $(this).comboselect('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onSelect: function(record){},
		onUnselect: function(record){}
	});
})(jQuery);

(function($){

	//取得状态
	var togglePanel = function(target, param){
		var state = $.data(target, 'chooser');
		if( !state.options.disabled ){
			if ( state.panel.panel("options").closed ) {
				showPanel(target, param);
			}else{
				hidePanel(target, param);
			}
		}
	};
	
	//显示面板
	var showPanel = function(target, param){
		var state = $.data(target, 'chooser');
		setPanelPostion(target, param);
		state.panel.panel("open");
		state.options.onShowPanel.call(target);
	};
	
	//重新定位Panel
	var setPanelPostion = function(target){
		var state = $.data(target, 'chooser');
		state.panel.panel("panel").css("z-index", $.fn.window.defaults.zIndex++);
		state.panel.panel("move", {
			left : state.combo.offset().left,
			top : getTop(target) - 2//避免出现边框在一起很难看
		});
	};
	
	//取得顶部位置
	var getTop = function( target ) {
		var state = $.data(target, 'chooser');
		var combo = state.combo;
		var top = combo.offset().top + combo._outerHeight();
		if (top + combo._outerHeight() > $(window)._outerHeight() + $(document).scrollTop()) {
			top = combo.offset().top - state.panel._outerHeight();
		}
		if (top < $(document).scrollTop()) {
			top = combo.offset().top + combo._outerHeight();
		}
		return top;
	};
	
	//设置值value
	var setValue = function( target, value ){
		setValues([value]);
	};
	
	//设置值values
	var setValues = function( target, values ){
		for( var i = 0 ; i < values.length; i++ ){
			var data = getData(target, values[i]);
			if( data ){
				addSelectItem(target, data);
			}
		}
	};
	
	//设置选中的值
	var saveChooserValue = function(target){
		var state = $.data(target, 'chooser');
		var values = [];
		$("a.item",state.combo).each(function(){
			values.push($(this).attr("value"));
		});
		$(".chooser-value", state.combo).val($.toJSON(values));
	};
	
	//找到数据
	var getData = function( target, id){
		var state = $.data(target, 'chooser');
		var data = state.data;
		for(var i = 0; i < data.length; i++ ){
			if( data[i].id == id ){
				return data[i];
			}
		}
		return null;
	};
	
	//隐藏面板
	var hidePanel = function(target, param) {
		var state = $.data(target, 'chooser');
		state.panel.panel("close");
		state.options.onHidePanel.call(target);
	};
	
	//添加选中的item
	var addSelectItem = function(target , data){
		var state = $.data(target, 'chooser');
		var count = $(".item",state.combo).length;
		if( count >= state.options.max ){//选择数量限制
			return;
		}
		var $select = $("<a class='item' href='#' value='" + data.id + "'><span class='item-text'>" + data.text + "</span><span class='item-del'></span></a>");
		$select.appendTo(state.combo);
		$select.find(".item-del").click(function(e){
			e.preventDefault();
			removeSelectItem(target, data.id);
			return false;
		});
		data.selected = true;
		state.panel.find("a[value='" + data.id + "']").addClass("item-selected");
		saveChooserValue(target);
		setPanelPostion(target);
		state.options.onSelect.call(target, data);
	};
	
	// 删除选中的item
	var removeSelectItem = function(target , id){
		var data = getData(target, id);
		if( data ){
			var state = $.data(target, 'chooser');
			state.combo.find("a[value='" + data.id + "']").remove();
			state.panel.find("a[value='" + data.id + "']").removeClass("item-selected");
			data.selected = false;
		}
		saveChooserValue(target);
		setPanelPostion(target);
	};
	
	//设置有效状态
	var setDisabled = function(target, disabled ){
		var state = $.data(target, 'chooser');
		if( disabled ){
			state.combo.removeClass("easyui-chooser-enable");
			state.combo.find(".item-del").hide();
		}else{
			state.combo.addClass("easyui-chooser-enable");
			state.combo.find(".item-del").show();
		}
		state.options.disabled = disabled;
	};

	//initialize
	var init = function( target ){
		var state = $.data(target, 'chooser');
		var opts = state.options;
		var width = opts.panelWidth || state.combo.outerWidth();
		var height = opts.panelHeight || 100;
		var $panel = state.panel;
		$panel.panel("resize", {
			width : width,
			height : height
		});
		state.combo.click(function(){
			togglePanel(target);
		});
		$panel.empty();
		var $title = $('<div class="chooser-title"></div>').appendTo($panel);
		var $body = $('<div class="chooser-body"></div>').appendTo($panel);
		var $footer = $('<div class="chooser-footer"></div>').appendTo($panel);
		$title.html( opts.title || "");
		$footer.html( opts.footer || "");
		var data = state.data;
		for(var i = 0; i < data.length; i++ ){
			var $item = $("<a class='body-item' href='#' value='" + data[i].id + "'>" + data[i].text + "</a>").appendTo($body);
			$item.data("data", data[i]);
			if( data[i].selected ){
				$item.addClass("item-selected");
				addSelectItem(target, data[i]);
			}
		}
		$(".body-item", $panel).click(function(){
			var data = $(this).data("data");
			if( $(this).hasClass("item-selected") ){
				removeSelectItem(target, data.id );
			}else{
				addSelectItem(target, data );
			}
		});
		$(document).unbind(".combo").bind("mousedown.combo", function(e) {
			var p = $(e.target).closest("div.easyui-chooser,div.combo-panel");
			if (p.length) {
				return;
			}
			var $panel = $("body>div.combo-p>div.combo-panel");
			$panel.panel("close");
		});
		setDisabled(target, opts.disabled);
	};
	
	//销毁组件
	var destroy = function(target){
		var state = $.data(target, 'chooser');
		state.panel.panel("destroy");
	};

	$.fn.chooser = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.chooser.methods[options](this, param);
			return method;
		}
		options = options || {};
		return this.each(function(){
			var target = this;
			var state = $.data(target, 'chooser');
			if (state){
				$.extend(state, options);
			} else {
				var comp = getComponent(target);
				state = $.data(this, 'chooser', {
					combo: comp.combo,
					panel: comp.panel,
					data: comp.data,//[{id:'1',text:'小米',selected:true}]
					options: $.extend({}, $.fn.chooser.defaults, $.fn.chooser.parseOptions(target), options)
				});
				init(target);
			}
		});
	};
	
	var getComponent = function( target ){
		var $combo = $("<div class='easyui-chooser'></div>").insertAfter(target);
		$combo.cssText( $(target).cssText() );//设置CSS样式
		$combo.css("width", $(target).width() );//设置宽度
		$(target).addClass("chooser-f").hide();//隐藏自己
		var name = $(target).attr("name");
		$(target).removeAttr("name");
		$("<input type=\"hidden\" name=\"" + name + "\" class=\"chooser-value\">").appendTo($combo).val("[]");//默认为[]
		var iframe = "<iframe name='kill_activex' frameborder='0' style='position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;scrolling:no;'></iframe>";
		var panel = $("<div class=\"combo-panel\">" + iframe + "</div>").appendTo("body");
		panel.panel({
			doSize : false,
			closed : true,
			cls : "combo-p",
			style : {
				position : "absolute",
				zIndex : 10
			},
			onOpen : function() {
				$(this).panel("resize");
			}
		});
		var data = getChooserData(target);
		return {"panel":panel, "data":data, "combo":$combo};
	};
	
	//取得数据
	var getChooserData = function( target ){
		var data = [];
		$("option", target).each(function(){
			data.push({"id":$(this).attr("value"),"text":$(this).text(),"selected":$(this).attr("selected")});
		});
		return data;
	};
	
	$.fn.chooser.methods = {
		options:function(jq, param){
			return getOptions(jq[0], param);
		},refresh:function(jq, param){
			return jq.each(function(){
				refresh(this, param);
			});
		},enable:function(jq, param){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},disable:function(jq, param){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},destroy:function(jq, param){
			return jq.each(function(){
				destroy(this);
			});
		},setValue:function(jq, param){
			return jq.each(function(){
				setValue(this, param);
			});
		},setValues:function(jq, param){
			return jq.each(function(){
				setValues(this, param);
			});
		}
	};
	
	$.fn.chooser.parseOptions = function(target){
		var options = $.parser.parseOptions(target,["name","style","iconCls","panelWidth","panelHeight","onHidePanel","onShowPanel","title","footer","url",{"params":'object',"max":"number"}]);
		options.disabled = $(target).attr("readonly");
		return options;
	};
	
	$.fn.chooser.defaults = {
		panelWidth:0,
		panelHeight:0,
		max:100,
		readonly:false,
		onShowPanel : function(){},
		onHidePanel : function(){},
		onSelect : function(){}
	};
})(jQuery);
(function($){

	//设置标题
	var setTitle = function(target, param){
		var state = getState(target);
		$(".panelx-title", state.header).html(param);
	};
	
	//设置子标题
	var setSubTitle = function(target, param){
		var state = getState(target);
		$(".panelx-subtitle", state.header).html(param);
	};
	
	//设置参数
	var setParams = function(target, param){
		var opts = getOptions(target);
		opts.params = $.extend({}, param);
	};
	
	//设置内容
	var setContent = function(target, param){
		var state = getState(target);
		state.content.html(param);
	};
	
	//设置是否已经加载
	var setLoaded = function(target, param){
		var state = getState(target);
		state.loaded = param;
	};
	
	//设置折叠状态
	var setCollapsed = function(target, collapsed){
		var state = getState(target);
		if( collapsed ){
			$(".panelx-icon", state.header).removeClass("panelx-collapsed");
			$(".panelx-icon", state.header).addClass("panelx-expand");
		}else{
			$(".panelx-icon", state.header).removeClass("panelx-expand");
			$(".panelx-icon", state.header).addClass("panelx-collapsed");
		}
		state.collapsed = collapsed;
	};
	
	//刷新
	var refresh = function( target, param ){
		var state = getState(target);
		var opts = state.options;
		if( $.type(param) == "string" ){
			opts.url = param;
		}else if( $.type(param) == "object" ){
			setParams(target, param);
		}
		state.loaded = false;
		expand(target, false);
	};
	
	//展开
	var expand = function( target, animate ){
		var state = getState(target);
		var opts = state.options;
		if( !state.loaded ){
			state.content.html("正在加载数据...");
			var data = opts.params || {};
			$.post(opts.url, data, function(text){
				state.content.html(text);
				opts.onLoadSuccess.call(target, text);
			});
			state.loaded = true;
		}
		animate ? state.content.slideDown("fast") : state.content.show();
		setCollapsed(target, false);
	};
	
	//收缩
	var collapse = function( target, animate ){
		var state = getState(target);
		animate ? state.content.slideUp("fast") : state.content.hide();
		setCollapsed(target, true);
	};
	
	//取得配置
	var getOptions = function(target, param){
		var state = $.data(target, 'panelx');
		return state.options;
	};
	
	//取得状态
	var getState = function(target, param){
		var state = $.data(target, 'panelx');
		return state;
	};

	//initialize
	var init = function( target ){
		var state = $.data(target, 'panelx');
		var opts = state.options;
		state.loaded = !opts.url;
		if( opts.collapsed ){//如果折叠状态
			state.content.hide();//隐藏
			setCollapsed(target, true);
		}else{
			if( opts.url ){//从URL加载
				expand(target, false);
			}
			setCollapsed(target, false);
		}
		state.header.click(function(){
			if( state.collapsed ){
				expand(target);
			}else{
				collapse(target);
			}
		});
	};

	$.fn.panelx = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.panelx.methods[options](this, param);
			return method;
		}
		options = options || {};
		return this.each(function(){
			var target = this;
			var state = $.data(target, 'panelx');
			if (state){
				$.extend(state, options);
			} else {
				state = $.data(this, 'panelx', {
					header: $(".panelx-header",target),
					content: $(".panelx-content",target),
					options: $.extend({}, $.fn.panelx.defaults, $.fn.panelx.parseOptions(target), options)
				});
				init(target);
			}
		});
	};
	
	$.fn.panelx.methods = {
		options:function(jq, param){
			return getOptions(jq[0], param);
		},refresh:function(jq, param){
			return jq.each(function(){
				refresh(this, param);
			});
		},setLoaded:function(jq, param){
			return jq.each(function(){
				setLoaded(this, param);
			});
		},setParams:function(jq, param){
			return jq.each(function(){
				setParams(this, param);
			});
		},setContent:function(jq, param){
			return jq.each(function(){
				setContent(this, param);
			});
		},setTitle:function(jq, param){
			return jq.each(function(){
				setTitle(this, param);
			});
		},setSubTitle:function(jq, param){
			return jq.each(function(){
				setSubTitle(this, param);
			});
		},expand:function(jq, param){
			return jq.each(function(){
				expand(this, param);
			});
		},collapse:function(jq, param){
			return jq.each(function(){
				collapse(this, param);
			});
		}
	};
	
	$.fn.panelx.parseOptions = function(target){
		var options = $.parser.parseOptions(target,["name","style","iconCls","title","subTitle","titleStyle","subTitleStyle","url",{"collapsed":"boolean","params":'object'}]);
		return options;
	};
	
	$.fn.panelx.defaults = {
		collapsed:false,
		animate:true,
		onLoadSuccess:function(){}
	};
})(jQuery);
(function($){

	function scrollTo(target, item){
		var panel = getPanel(target);
		if (item.length){
			if (item.position().top <= 0){
				var h = panel.scrollTop() + item.position().top;
				panel.scrollTop(h);
			} else if (item.position().top + item.outerHeight() > panel.height()){
				var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
				panel.scrollTop(h);
			}
		}
	};
	
	//选择上
	function selectPrev(target){
		var panel = getPanel(target);
		if( panel.is(":hidden") ){
			showPanel(target, false);//隐藏的时候，先显示了再说
			return;
		}
		var $selected = $(".combobox-item-selected", panel);
		var $item = $selected.exist() ? $selected : $(".combobox-item:first",panel).first();
		var $prev = $item.prev(':visible');
		if( $prev.exist() ){
			$selected.removeClass("combobox-item-selected");
			$prev.addClass("combobox-item-selected");
			scrollTo(target, $prev);
		}else{
			scrollTo(target, $("thead",panel));//表格的情况
		}
	};
	
	// 选择下
	function selectNext(target){
		var panel = getPanel(target);
		if( panel.is(":hidden") ){
			showPanel(target, false);//隐藏的时候，先显示了再说
			return;
		}
		var $select = $(".combobox-item-selected", panel);
		var $next = $select.exist() ? $select.next() : $(".combobox-item:first",panel).first();
		if( $next.exist() ){
			$select.removeClass("combobox-item-selected");
			$next.addClass("combobox-item-selected");
			scrollTo(target, $next);
		}
	};
	
	//隐藏面板
	var hidePanel = function(target) {
		var state = $.data(target, 'selectx');
		var panel = getPanel(target);
		panel.panel("close");
		state.options.onHidePanel.call(target);
	};
	
	//取得顶部位置
	var getTop = function( target ) {
		var state = $.data(target, 'selectx');
		var $panel = getPanel(target);
		var $combo = state.combo;
		var top = $combo.offset().top + $combo._outerHeight();
		if (top + $panel._outerHeight() > $(window)._outerHeight() + $(document).scrollTop()) {
			top = $combo.offset().top - $panel._outerHeight();
		}
		if (top < $(document).scrollTop()) {
			top = $combo.offset().top + $combo._outerHeight();
		}
		return top;
	};
	
	//取得面板
	var getPanel = function(target){
		var state = $.data(target, 'selectx');
		if( state.panel ){
			return state.panel;
		}
		var panel = state.panel = $("<div class=\"combo-panel\"></div>").appendTo("body");
		panel.panel({
			doSize : false,
			closed : true,
			cls : "combo-p",
			style : {
				position : "absolute",
				zIndex : 10
			},
			onOpen : function() {
				$(this).panel("resize");
			}
		});
		return panel;
	};
	
	//编辑模式
	var isEditable = function(target){
		var state = $.data(target, 'selectx'), opts = state.options;
		var editable = $.isFunction(opts.editable) ? opts.editable(target) : opts.editable;
		return editable;
	};
	
	//显示面板   refresh 刷新数据  match 是否进行一次匹配
	var showPanel = function(target, refresh, match){
		var state = $.data(target, 'selectx'), opts = state.options;
		if( isEditable(target) ) return;//编辑模式
		var panel = getPanel(target);
		panel.panel("panel").css("z-index", $.fn.window.defaults.zIndex++);
		panel.panel("move", {
			left : state.combo.offset().left,
			top : getTop(target) - 1//避免出现边框在一起很难看
		});
		var $combo = $.data(target, 'selectx').combo;
		var key = state.text.val();
		if( (refresh || !opts.loaded) && opts.server && opts.dict ){
			opts.loaded = true;
			opts.loader(target,function(list){
				state.list = list;
				var list = match ? getMatchList(target, key) : state.list;//匹配数据
				renderPanel(target, list);//渲染面板
			});//加载数据
		}else{
			var list = match ? getMatchList(target, key) : state.list;//匹配数据
			renderPanel(target, opts.filter.call(target, list));//渲染面板
		}
	};
	
	//渲染面板
	var renderPanel = function(target, list){
		var state = $.data(target, 'selectx'), opts = state.options;
		var panel = getPanel(target);
		if( !list.length ){
			panel.panel("close");
			return;
		}
		panel.panel("open");
		(function() {
			if (panel.is(":visible")) {
				panel.panel("move", {
					left : state.combo.offset().left,
					top : getTop(target) - 1//避免出现边框在一起很难看
				});
				setTimeout(arguments.callee, 200);
			}
		})();
		var container = panel.empty();
		if( opts.template.contains("</tr>") ){
			var table = [];
			table.push("<table class='view-table'>\n");
			table.push("<thead>\n");
			table.push("<tr>\n");
			for( var i = 0 ; i < opts.columns.length; i++ ){
				var col = opts.columns[i];
				table.push("<th width='" + col.width + "'>" + col.title + "</th>\n");
			}
			table.push("</tr>\n");
			table.push("</thead>\n");
			table.push("</table>\n");
			$(table.join("")).appendTo(panel);
			container = panel.find(".view-table");
			panel.css("border","none");
			var height = list.length*24 || 120;
			opts.panelHeight = (height > 200 ? 200 : height) + 30;
		}
		var template = th.template(opts.template);
		$.each(list, function(i, data){
			var html = template(data);
			var item = $(html).appendTo(container);
			item.addClass("combobox-item");
			item.attr("value", data.value);
			item.data('data', data);
			item.bind("mousedown.combo",function(e){
				e.preventDefault();
				setValue(target, data.value);
				hidePanel(target);
				initSubSelect(target);
				//pressTab(target);
			}).hover(function(){
				$(this).addClass("combobox-item-hover");
			},function(){
				$(this).removeClass("combobox-item-hover");
			});	
		});
		var width = opts.panelWidth || state.combo.outerWidth();
		var height = opts.panelHeight || 120;
		panel.panel("resize", {width:width, height:height});
		var value = $(target).val();
		var $item = $("[value='" + value + "']", panel);
		if( !$item.exist() ){
			$item = $(".combobox-item:first", panel);
		}
		$item.addClass("combobox-item-selected");
		scrollTo(target, $item);
		state.options.onShowPanel.call(target);
	}
	
	//设置值value
	var setValue = function(target, value ){
		var state = $.data(target, 'selectx'),opts = state.options;
		var panel = getPanel(target);
		var oldValue = $(target).val();
		var $text = state.text;
		if( value != oldValue){
			var result = opts.onBeforeChange.call(target, value, oldValue);
			if( result === false){
				return;
			}
		}
		$(".combobox-item-selected", panel).removeClass("combobox-item-selected");
		$("[value='" + value + "']", panel).addClass("combobox-item-selected");
		$(target).val(value);
		var data = getData(target, value);
		opts.onSelect.call(target, value, oldValue, data);
		if( oldValue != value){
			opts.onChange.call(target, value, oldValue, data);
		}
		if( $text.data("validatebox") ){
			$text.validatebox("validate");//执行验证
		}
		setComboText(target, (data ? data.text : undefined) );//设置文本显示
	};
	//找到数据
	var getData = function(target, value){
		var state = $.data(target, 'selectx');
		if( value == "" || value == undefined){
			return {value:"", text:""};
		}
		if( isEditable(target) ){//编辑模式
			return {value:state.text.val(), text:state.text.val(), editable:true};
		}
		if( state ){
			var data = state.list;
			for(var i = 0; i < data.length; i++ ){
				if( data[i].value == value ){
					return data[i];
				}
			}
		}
		
		return null;
	};
	
	//取得值
	var getValue = function(target){
		return $(target).val();
	};
	//取得文本内容
	var getText = function(target,param){
		var data = getSelected(target,param);
		return data.text;
	};
	//设置selectx-text显示值
	var setComboText = function(target, text){
		var state = $.data(target, 'selectx'), opts = state.options;
		var $text = state.text;
		if( text == undefined ){
			var oldValue = $(target).val();
			if( opts.dict ){//数据字典,从缓存中获取
				var newText = $text.val();
				var text = DictConfig.getText(opts.dict, oldValue);
				var selected = $(".combobox-item-selected:first",state.panel);
				if( opts.editSelect && selected.exist()){
					var value = selected.attr("value"),data = getData(target, value);;
					if(newText == data.text ){
						setValue(target, value);
						hidePanel(target);
					}else{
						$(target).val("");
						value = "";
						data ={value:"", text:newText};
					}
					opts.onChange.call(target, value , oldValue, data);
				}else{
					$text.val(text);
				}
			}else{
				var data = getData(target, value);
				text = (data != null ? data.text : "");
				$text.val(text);
			}
		}else{
			$text.val(text);
		}
	};
	
	//找到匹配的数据
	var getMatchList = function(target, key){
		var state = $.data(target, 'selectx'), opts = state.options;
		var data = opts.filter.call(target, state.list);//过滤数据
		if( key == null || key == "" ){
			return data;//为空返回全部数据
		}
		var matchs = [];
		for(var i = 0; i < data.length; i++ ){
			var pym = data[i].pym || "", text = data[i].text;
			if(!text){
				continue;
			}
			if( pym.contains(key.toUpperCase()) || text.contains(key) ){
				matchs.push(data[i]);
			}
		}
		return matchs;
	};
	
	//设置有效状态
	var setDisabled = function(target, disabled ){
		var state = $.data(target, 'selectx');
		var $text = state.text;
		if( disabled ){
			$text.removeClass("selectx-enable").removeClass("validatebox-invalid")
				.addClass("selectx-disable").attr("disabled", true);
		}else{
			$text.removeClass("selectx-disable").addClass("selectx-enable").removeAttr("disabled");
		}
	};
	
	//是否必选
	var required = function( target, required ){
		var state = $.data(target, 'selectx');
		var $text = state.text;
		$text.validatebox({required:required});
	};
	
	//触发TAB效果
	var pressTab = function(target){
		var state = $.data(target, 'selectx');
		var $text = state.text;
		//Page.tab($text.get(0));
	};
	
	//设置异步查询的参数
	var setQueryParams = function(target, queryParams){
		var state = $.data(target, 'selectx'), opts = state.options;
		opts.queryParams = $.extend({}, opts.queryParams, queryParams || {});
	};
	
	//是否需要加载
	var isLoadable = function(target){
		var state = $.data(target, 'selectx'), opts = state.options;
		return !opts.loaded && opts.server && opts.dict 
	};
	//初始化级联
	var initSubSelect = function(target){
		var state = $.data(target,"selectx"), opts = state.options;
		var $c = $(target).parents("[page=true]");
		if( opts.subId ){//级联
				var pid = $(target).val();
				var $sub = $("#" + opts.subId, $c);
				var dict = $sub.attr("dict");
				var list = Source.getData(dict),subList = [];
				if(pid && pid.length){
					$.each(list, function(i, item){
						if( item.pid == pid ){
							subList.push(item);
						}
					});
					$sub.selectx("loadData",subList);
				}else{
					$sub.selectx("loadData",list);
				}
		}
	};
	//initialize
	var init = function( target ){
		var state = $.data(target, 'selectx');
		var opts = state.options;
		var $text = state.text;
		if( $text.data("validatebox") || opts.required || opts.validType){
			$text.validatebox(opts);
		}
		$text.off(".combo").on("focus.combo click.combo",function(e){
			if( !isEditable(target) ){//选择模式
				th.delay(function(){
					$("div.combo-panel").not(state.panel).panel("close");
					showPanel(target, isLoadable(target));
					setTimeout(function(){$text.select();},0);//选中文本
				},100);
			}
		}).on("keydown.combo", function(e) {
			switch (e.keyCode) {
				case 38://上箭头
					selectPrev(target);
					break;
				case 40://下箭头
					if( isLoadable(target) ){//没有数据加载数据
						showPanel(target, true);
					}else{
						selectNext(target);
					}
					break;
				case 9://TAB键盘
					hidePanel(target);
					break;
				case 13://回车键
					if( isEditable(target) ){//编辑模式
						pressTab(target);//跳掉下个输入框
					}else{//选择模式
						e.preventDefault();
						if( !state.list.length ){//没有数据加载数据
							//showPanel(target, true);
							//return false;//不跳到下个输入框
						}else{
							var value = $(".combobox-item-selected:first",state.panel).attr("value");
							setValue(target, value);
							hidePanel(target);
							pressTab(target);//跳掉下个输入框
						}
					}
					return true;
					break;
			}
		}).on("blur.combo",function(e){
			setComboText(target, isEditable(target) ? $text.val() : undefined);//失去焦点重新设置文本值
			initSubSelect(target);
		}).on("keyup.combo",function(e){
			var code = parseInt(e.keyCode || -1);
			if( (code >=48 && code <=90) || (code >=96 && code <=111) //0-9 A-Z
					|| [8,46,32].contains(code)){//backspace,del,space
				if( isEditable(target) ){//编辑模式
					th.delay(function(){
						setValue(target, $text.val());//当前输入文本为值
					},500);
				}else{//选择模式
					if( $text.val() == "" ){//空值清空
						setValue(target, "");
					}
					th.delay(function(){//检索数据
						showPanel(target, true, true);//刷新，匹配数据
					},100);
				}
			}
		});
		target.onpropertychange = function(e){//IE浏览器
			setComboText(target);
			initSubSelect(target);
		};
		$(document).unbind(".combo").bind("mousedown.combo", function(e) {
			var p = $(e.target).closest("span.combo,div.combo-panel");
			if (p.length) {
				return;
			}
			$("body>div.combo-p>div.combo-panel").panel("close");
		});
		setDisabled(target, opts.disabled);
		setComboText(target, isEditable(target) ? $(target).val() : undefined);
	};
	
	//加载数据
	var loadData = function(target, param, reset){
		var list = [];
		var state = $.data(target, 'selectx');
		var opts = state.options;
		if( $.type(param) == "array" ){
			list = param;
			$.each(list, function(i, item){
				item.pym = item.pym || th.getPym(item.text || "");
			});
		}else if( opts.source ){//默认数据
			list = $.eval(opts.source || "[]");
			$.each(list, function(i, item){
				if( !item.pym )
					item.pym = th.getPym(item.text);
			});
		}
		if( reset ){
			opts.dict = null;//数据字典属性置空，单独加载后原来的就失效了
		}
		state.list = list;//重新设置数据
	};
	
	//根据参数加载数据
	var reload = function(target, param){
		var state = $.data(target, 'selectx'), opts = state.options;
		setQueryParams(target, param);
		opts.loader(target, function(list){//加载数据
			state.list = list;
		});
	};
	
	//取得选中行数据
	var getSelected = function(target, param){
		var value = $(target).val();
		var data = getData(target, value);
		return data;
	};
	
	//销毁组件
	var destroy = function(target){
		var state = $.data(target, 'selectx');
		if( state.panel ){
			state.panel.panel("destroy");
		}
		state.combo.remove();
	};
	
	$.fn.selectx = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.selectx.methods[options](this, param);
			return method;
		}
		options = options || {};
		return this.each(function(){
			var target = this;
			var state = $.data(target, 'selectx');
			if (state){
				$.extend(state.options, options);
				init(target);
			} else {
				var opts = $.extend({}, $.fn.selectx.defaults, $.fn.validatebox.parseOptions(target), $.fn.selectx.parseOptions(target), options);
				var comp = getComponent(target, opts);
				state = $.data(this, 'selectx', {
					combo: comp.combo,
					panel: comp.panel,
					list: comp.list,//[{id:'1',text:'小米',selected:true}]
					text: comp.text,
					options: opts
				});
				loadData(target, (opts.dict ? Source.getData(opts.dict) : undefined) );//加载数据
				init(target);//初始化
			}
		});
	};
	
	var getComponent = function( target, opts ){
		var $combo = $("<span class='combo'/>").insertAfter(target);
		var $text = $("<input type='text' id='" + opts.textName + "' name='" + opts.textName + "' class='text selectx-text selectx-enable' style='border:0' validType=\"" + opts.validType + "\"/>").appendTo($combo);//文本显示
		$combo.cssText( $(target).cssText() + ";border:1px solid #ccc;" );//设置CSS样式
		$text.css({"width":"100%"});
		$text.attr("placeholder", $(target).attr("placeholder") );
		$(target).addClass("select-f").removeAttr("required").removeAttr("validType").hide();//隐藏自己
		return {"panel":null, "combo":$combo, list:[], "text":$text};
	};
	
	$.fn.selectx.methods = {
		options:function(jq, param){
			var options = $(jq[0]).data("selectx").options;
			return options;
		},required:function(jq, param){
			return jq.each(function(){
				required(this, param);
			});
		},enable:function(jq, param){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},disable:function(jq, param){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},destroy:function(jq, param){
			return jq.each(function(){
				destroy(this);
			});
		},setValue:function(jq, param){
			return jq.each(function(){
				setValue(this, param);
			});
		},getValue:function(jq, param){
			return getValue(jq[0], param);
		},getText:function(jq,param){
			return getText(jq[0], param);
		},loadData:function(jq, param){
			return jq.each(function(){
				loadData(this, param, true);
			});
		},getSelected:function(jq, param){
			return getSelected(jq[0], param);
		},setQueryParams:function(jq, param){
			return jq.each(function(){
				setQueryParams(this, param);
			});
		},focus:function(jq, param){
			return jq.each(function(){
				var _this = this;
				setTimeout(function(){
					$(_this).data("selectx").text.focus();
					showPanel(_this, param);
				},0);
			});
		},reload:function(jq, param){//仅用于异步数据查询
			return jq.each(function(){
				reload(this, param);
			});
		}
	};
	
	$.fn.selectx.parseOptions = function(target){
		var opts = $.parser.parseOptions(target,["name","style","dict","subId","uid","iconCls","source","textName","editSelect","panelWidth","panelHeight","validType",{"onSelect":"object","required":"boolean","server":"boolean","queryParams":'object',"maxRows":"number","includes":"array","excludes":"array"}]);
		opts.disabled = $(target).hasAttr("readonly");
		opts.required = $(target).hasAttr("required");
		opts.template = $("#template-" + opts.uid).text() || "<div>#text#</div>";
		var panelWidth = 0;
		opts.columns = (function(text){
			var cols = [];
			if( text.contains("</tr>") ){
				$(text).find("td").each(function(){
					var $this = $(this);
					var col = {};
					col.title = $this.attr("title") || $this.text();
					col.width = parseInt($this.attr("width") || "80");
					panelWidth += col.width;
					cols.push(col);
				});
			}
			return cols;
		})(opts.template);
		opts.panelWidth = opts.panelWidth || panelWidth;
		opts.source = $("#source-" + opts.uid).text();
		return opts;
	};
	
	$.fn.selectx.defaults = {
		panelWidth:0,
		panelHeight:0,
		maxRows:100,
		readonly:false,
		required:false,
		loaded:false,
		editable:false,//允许编辑输入
		queryParams:{},
		onShowPanel : function(){},
		onHidePanel : function(){},
		onSelect : function(value, oldValue, data){},
		onBeforeChange : function(value, old){
			//console.log("selectx onBeforeChange value=" + value + ";old=" + old);
		},
		onChange : function(value, old){
			console.log("selectx onChange value=" + value + ";old=" + old);
		},
		filter:function(list){
			var target = this;
			var state = $.data(target, 'selectx');
			var opts = state.options;
			var data = [];
			var includes = opts.includes || [], excludes = opts.excludes || [];
			for( var i = 0 ; i < list.length; i++ ){
				var value = list[i].value;
				if( excludes.contains(value) ){
					continue;
				}
				if( !includes.isEmpty() && !includes.contains(value) ){
					continue;
				}
				if( "0" == list[i].status ){//编辑隐藏
					continue;
				}
				data.push(list[i]);
			}
			return data;
		},
		loader:function(target, success, error){
			var state = $.data(target, 'selectx'), opts = state.options;
			var text = state.text.val();
			var key = text || "";
			var maxRows = opts.maxRows || "";
			var data = {"code":opts.dict, "key": key, "queryParams":$.toJSON(opts.queryParams), "maxRows":maxRows};
			Service.invoke("DictService.find", data, function(text){
				var list = $.eval(text) || [];
				success(list);
			});
		}
	};
})(jQuery);
(function($){
	
	//禁用/启用Row
	var enableRow = function(target, param, enable){
		var state = getState(target), opts = state.options;
		var row = state.model.getRow(param);
		if( row ){
			row.tr.find("[input='true']").readonly(enable);
		}
	};
	
	//合并行
	var mergeRow = function(target, param){
		var state = getState(target), opts = state.options;
		var rowModel = state.model.getRowModel(param);
		if( rowModel ){
			rowModel.bind(param, true);
		}
	};
	
	//清空
	var clear = function(target){
		var state = getState(target), opts = state.options;
		if( state.model ){
			state.model.clear();
			state.input.val("");
		}
	};
	
	//取得数据
	var getRows = function(target, param){
		var state = getState(target);
		var opts = state.options;
		return state.model.getRows();
	};
	
	//取得变更数据
	var getChangeRows = function(target, param){
		var state = getState(target);
		var opts = state.options;
		return state.model.getChangeRows();
	};
	
	//取得行数
	var getRowsCount = function(target, param){
		return getRows(target, param).length;
	};
		
	//删除行
	var removeRow = function(target, param){
		var state = getState(target), opts = state.options;
		if( param instanceof jQuery ){
			var model = param.data("model");
			var row = model ? model.data : null;
			if( opts.onBeforeRemoveRow.call(target, row) == false ){
				return;
			}
		}
		state.model.remove(param);
	};
	
	//添加行
	var addRow = function(target, row){
		var state = getState(target), opts = state.options;
		if( opts.onBeforeAddRow.call(target, row) == false ){
			return;
		}
		var tr = state.model.add(row);
		var first = $("input:visible,select:visible", tr).first();
		th.delay(function(){//最后一个获取焦点
			first.focus();
		},500);
		return row;
	};
	
	//添加组
	var getGroup = function(target, text){
		var state = getState(target), opts = state.options;
		var groupId = "GROUP_" + text.hashCode();
		var $group = $("tr[group='" + groupId + "']", target);
		if( !$group.exist() ){
			var cols = state.columns;
			var html = "";
			html += "<tr group='" + groupId + "'>";
			html += "<td><div class='op-remove'>-</div></td>";
			html += "<td colspan='" + (cols.length-1) + "'>";
			html += "<div class='group-ctrl group-expand'>" + text + "</div>";
			html += "</td>";
			html += "</tr>";
			$group = $(html).appendTo(state.tbody);
			$(".op-remove", $group).click(function(){
				$group.remove();
				$("tr[group-parent='" + groupId + "']", target).each(function(){
					removeRow(target, $(this));
				});
			});
			$(".group-ctrl", $group).click(function(){
				if( $(this).hasClass("group-collapse") ){
					doExpand(target, text);
				}else{
					doCollapse(target, text);
				}
			});
			$group.click(function(){
				$(".row-selected",target).removeClass("row-selected");
				$(this).addClass("row-selected");
			});
			$group.data("group", {"id":groupId, "text":text, "tr": $group});
		}
		return $group.data("group");
	};
	
	//添加一行 供 Model 调用
	var addTr = function(target, row){
		var state = getState(target), opts = state.options;
		var $tr = null;
		if( opts.groupField ){
			var text = row[opts.groupField];
			if( text ){//数据中组属性不为空的情况
				var group = getGroup(target, text);
				var items = $("tr[group-parent='" + group.id + "']");
				if( items.exist() ){
					$tr = $(state.template).insertAfter(items.last());
				}else{
					$tr = $(state.template).insertAfter(group.tr);
				}
				$tr.data("group", group);
				$tr.attr("group-parent", group.id);
			}else{//数据中组属性为空，通常为添加一行数据
				var $after = $("tr.row-selected,tr:last", state.tbody).first();
				if( $after.exist() ){
					var group = $after.data("group");
					$tr = $(state.template).insertAfter($after);
					$tr.data("group", group);
					$tr.attr("group-parent", group.id);
				}else{
					var group = getGroup(target, "默认");
					$tr = $(state.template).insertAfter(group.tr);
					$tr.data("group", group)
					$tr.attr("group-parent", group.id);
				}
			}
		}else{
			$tr = $(state.template).appendTo(state.tbody);
		}
		$tr.click(function(){
			$(".row-selected",target).removeClass("row-selected");
			$(this).addClass("row-selected");
		})
		return $tr;
	};
	
	//展开
	var doExpand = function(target, text){
		var groupId = "GROUP_" + text.hashCode();
		var $group = $("tr[group='" + groupId + "']", target);
		$(".group-ctrl", $group).removeClass("group-collapse").addClass("group-expand");
		$("tr[group-parent='" + groupId + "']", target).show();
	};
	
	//折叠
	var doCollapse = function(target, text){
		var groupId = "GROUP_" + text.hashCode();
		var $group = $("tr[group='" + groupId + "']", target);
		$(".group-ctrl", $group).removeClass("group-expand").addClass("group-collapse");
		$("tr[group-parent='" + groupId + "']", target).hide();
	};
	
	//取得选中行
	var getSelected = function(target){
		var tr = $(".row-selected", target);
		var model = tr.data("model");
		return model ? model.data : null;
	};
	
	//取得绑定的数据
	var getSource = function(target){
		var state = getState(target), opts = state.options;
		var source = null;
		if( opts.bind ){
			var name = opts.bind.substring(opts.bind.indexOf(":") + 1).trim();
			var model = th.getModel(target);
			source = {"name":name, "rows":model.get(name)};
		}
		return source;
	};
	
	//取得状态
	var getState = function(target){
		return $.data(target, "table");
	};
	
	//保存数据
	var saveData = function(target){
		var state = getState(target), opts = state.options;
		var rows = [];
		if( opts.saveChange ){
			rows = state.model.getChangeRows();
		}else{
			rows = state.model.getRows();
		}
		var text = $.toJSON(rows);
		state.input.val(text);
		//console.log(text);
		var model = th.getModel(target);
		if( model ){
			model.data[opts.input] = rows;//放置input数据
			if( state.source ){//如果绑定了数据
				model.set(state.source.name, state.model.getRows());//绑定的数据
			}
		}
	};
	
	//加载数据
	var load = function(target, param){
		var state = getState(target), opts = state.options;
		if( $.type(param) == "array" ){
			var rows = param;
			state.model.bind(rows, opts.idField);
			saveData(target);
		}else {
			query(target, param);
		}
	};
	
	//刷新数据
	var refresh = function(target, param){
		clear(target)
		load(target, param);
	};
	
	//表格查询数据
	var query = function(target, param){
		var state = getState(target), opts = state.options;
		if( !opts.sql ){//没有SQL不查询
			return;
		}
		var args = $.extend(opts.queryParams, param || {});
		var parameters = th.toQueryParams(args);
		$.post(opts.url, {"parameters":$.toJSON(parameters)}, function(text){
			var result = $.eval(text);
			var rows = result.rows;
			state.model.bind(rows, opts.idField);
			saveData(target);
			if( opts.readonly ){
				readonly(target, true);
			}
			opts.onLoadSuccess.call(target, result);
		});
	};
	
	//只读
	var readonly = function(target, readonly){
		var state = getState(target), opts = state.options;
		if(typeof readonly == "undefined"){
			readonly = true;
		}
		opts.readonly = readonly;//保存只读属性
		if( readonly ){
			$("[name='op']", target).parent().hide();
			$("[input='true']", target).readonly();
		}else{
			$("[name='op']", target).parent().show();
			$("[input='true']", target).readonly(false);
		}
	};
	
	//initialize
	var init = function( target ){
		var state = getState(target), opts = state.options;
		if( !state.input ){//避免重复初始化的问题
			state.input = $("<input type='hidden' name='" + opts.input +"'/>").appendTo(target);
		}
		var columns = [];
		$("thead>tr>th",target).each(function(){
			var $this = $(this);
			var field = $this.attr("field");
			var width = $this.attr("width");
			var dataType = $this.attr("dataType");
			columns.push({"field":field,"width":width, "dataType":dataType});
		});
		state.columns = columns;
		var events = {
				onChange:function(){
					saveData(target);//保存变成数据
					opts.onChange.apply(target, arguments);
				},
				onAdd:opts.onAddRow,
				onUpdate:opts.onUpdateRow,
				onRemove:opts.onRemoveRow
		};
		state.model = new TableModel(target, state, events);
		if( opts.autoQuery ){//自动查询
			query(target);
		}
		if( opts.initRows ){//添加空行
			for( var i = 0 ; i < opts.initRows; i++ ){
				addRow(target,{});
			}
		}
		initKeyEvent(target);
	};
	
	// 初始化事件
	var initKeyEvent = function(target){
		var state = getState(target), opts = state.options;
		$(target).keydown(function(event){
			if(  event.keyCode == 13 ){//回车键
				if( opts.autoAddRow ){
					var element = $(event.target);
					if( element.is("input") || element.is("select") ){
						var next = Page.getNextInput(element, target);//取得下个输入框
						if( !next ){//如果是最后元素，增加一行
							addRow(target,{});
						}
					}
				}
				return true;
			}else if( event.keyCode == 38 ){//上箭头
				
			}else if( event.keyCode == 40 ){//下箭头
				
			}
		});
	};
	
	//main
	$.fn.table = function(options, param1, param2){
		if (typeof options == "string") {
			var method = $.fn.table.methods[options];
			return method(this, param1, param2);
		}
		options = options || {};
		return this.each(function(){
			var that = this;
			var state = $.data(that, 'table');
			if (state){
				$.extend(state.options, options);
				init(that);
			} else {
				state = $.data(that, 'table', {
					options : $.extend({},$.fn.table.defaults,$.fn.table.parseOptions(that))
				});
				state.template = $("#" + state.options.templateId).val();
				state.source = getSource(that);
				state.tbody = $("tbody", that).exist() ? $("tbody", that) : $("<tbody></tbody>").appendTo(that);
				init(that);
			}
		});
	};
	
	//解析属性
	$.fn.table.parseOptions = function(target) {
		var t = $(target);
		var options = $.extend({}, $.parser.parseOptions(t, 
				["url","templateId","idField","input","queryParams",
				 {"rowModel":"object","fit":"boolean","autoAddRow":"boolean","autoQuery":"boolean","saveChange":"boolean", "sql":"boolean","initRows":"number"}]));
		options.queryParams = $.parse(options.queryParams || "");
		options.input = options.input || "TABLE_CHANGE";
		options.bind = t.attr("data-bind");
		options.groupField = t.attr("groupField");
		return options;
	};
	
	$.fn.table.methods = {
		options:function(jq, param1, param2){
			return getState(jq[0]).options;
		},
		addRow:function(jq, param1, param2){
			return addRow(jq[0], param1, param2);
		},
		removeRow:function(jq, param1, param2){
			return jq.each(function(){
				removeRow(this, param1, param2);
			});
		},
		clear:function(jq, param1, param2){
			return jq.each(function(){
				clear(this, param1, param2);
			});
		},
		mergeRow:function(jq, param1, param2){
			return jq.each(function(){
				mergeRow(this, param1, param2);
			});
		},
		disableRow:function(jq, param1, param2){
			return jq.each(function(){
				disableRow(this, param1, param2);
			});
		},
		enableRow:function(jq, param1, param2){
			return jq.each(function(){
				enableRow(this, param1, param2);
			});
		},
		getRows:function(jq, param1, param2){
			return getRows(jq[0], param1, param2);
		},
		getRowsCount:function(jq, param1, param2){
			return getRowsCount(jq[0], param1, param2);
		},
		getChangeRows:function(jq, param1, param2){
			return getChangeRows(jq[0], param1, param2);
		},
		refresh:function(jq, param1, param2){
			return jq.each(function(){
				refresh(this, param1, param2);
			});
		},
		loadData:function(jq, param1, param2){
			return jq.each(function(){
				refresh(this, param1, param2);
			});
		},
		getSelected:function(jq, param1, param2){
			return getSelected(jq[0], param1, param2);
		},
		expand:function(jq, param1, param2){
			return jq.each(function(){
				doExpand(this, param1, param2);
			});
		},
		collapse:function(jq, param1, param2){
			return jq.each(function(){
				doCollapse(this, param1, param2);
			});
		},
		readonly:function(jq, param1, param2){
			return jq.each(function(){
				readonly(this, param1, param2);
			});
		}
	};
	
	$.fn.table.defaults = {
		idFiled : "id",
		saveChange : true,
		readonly: false,
		groupField:"",//分组字段
		onLoadSuccess:function(){
			//数据加载完成
		},
		onChange : function(event, row, name, val, old){
			//console.log("onChange event=" + event + " name=" + name + "; val=" + val + "; old=" + old);
		},
		onAddRow:function(row){
			//console.log("onAddRow row=" + $.toJSON(row) );
		},
		onBeforeAddRow:function(row){
			//console.log("onBeforeAddRow row=" + $.toJSON(row) );
		},
		onUpdateRow:function(row, name, val, old){
			//console.log("onUpdateRow name=" + name + "; val=" + val + "; old=" + old);
		},
		onRemoveRow:function(row){
			//console.log("onRemoveRow row=" + $.toJSON(row) );
		},
		onBeforeRemoveRow:function(row){
			//console.log("onRemoveRow row=" + $.toJSON(row) );
		}
	};
	
	//表格模型
	var TableModel = Class.extend({
		init : function(table, state, events){
			var that = this;
			that.table = table;//上下文
			that.options = state.options;
			that.template = state.template;
			that.tbody = $("tbody", table);//tbody
			that.list = [];
			that.idField = "id";
			$.extend(that,{
				onAdd : function(row){},
				onUpdate : function(row, path, val, old){},
				onRemove : function(row){},
				onBind : function(rows){},
				onChange : function(event, row, path, val, old){}
			}, events);
			that.fire = function(name){
				var args = Array.prototype.slice.call(arguments, 1);
				var event = "on" + name.upperCaseFirstChar();
				that[event].apply(this, args);
				that.onChange.apply(this, arguments);
				//console.log(event + " row=" + $.toJSON( arguments[1]) );
				//console.log(event + " rows=" + $.toJSON(that.list) );
				//console.log( that.list );
				if( ["add","update"].contains(name) ){
					var row = arguments[1];
					that.setReadonly(row);
				}
			};
		},
		bind : function(list, idField){
			var that = this;
			that.idField = idField;
			if( that.list.isEmpty() ){
				that.list = list;
			}else{//这样做为了保持第一次的引用
				that.list.clear();
				that.list.pushAll(list);
			}
			that.tbody.empty();
			$.each(that.list, function(i, row){
				row = row || {};
				row.onChange = function(path, val, old){
					row.op = "update";
					that.fire("update", row, path, val, old);
				};
				var tr = that.newtr(row);
				that.wrap(row, tr);
				return tr;
			});
			that.fire("bind", that.list);
		},
		add : function(data){
			var that = this;
			var row = data || {};
			row.onChange = function(path, val, old){
				that.fire("update", row, path, val, old);
			};
			row.op = "insert";
			that.list.push(row);
			var tr = that.newtr(row);
			that.wrap(row, tr);
			that.fire("add", row);
			return tr;
		},
		wrap : function(row, tr){
			var that = this;
			$.extend(row, that.options.rowModel);//设置默认模型
			var model = tr.data("model");
			if( model ){
				model.bind(row);
			}else{
				model = new th.ViewModel(tr).bind(row);
			}
			tr.data("model", model);
			$.extend(row,{
				tr : function(){ return tr; },
				model : function(){ return tr.data("model"); },
				bind : function(data, append){
					//必须保留原有对象的引用，只能覆盖它的值
					//否则 that.list 数组中的对象引用就失效了。
					var model = tr.data("model");
					$.extend(model.data, data);
					model.refresh();
				},
				clear:function(){
					var model = tr.data("model");
					var op = model.data.op;//保存OP
					model.clear();//清除行数据
					model.data.op = op;//还原op
				},
				set: function(name, value, fire){
					var model = tr.data("model");
					model.set(name, value, fire);
				},
				refresh: function(){
					var model = tr.data("model");
					model.refresh();
				}
			});
			that.parse(tr);
			that.setReadonly(row);
			return model;
		},
		remove:function(tr){
			var that = this;
			var list = that.list;
			var index = 0;
			var row = null;
			for( ; index < list.length; index++ ){
				var item = list[index];
				if( item.tr().get(0) == tr.get(0) ){
					row = item;
					break;
				}
			}
			if( row && !row[that.idField] ){//后来增加的数据,没有ID
				var removed = list.splice(index, 1);//删除当前元素
			}
			if( row ){
				row.op = "delete";
				tr.remove();
				that.fire("remove", row);
			}
		},
		setReadonly : function(row){
			var model = row.model();
			var readonly = model.get("readonly");
			if( readonly ){
				$("[input='true']", row.tr()).readonly(true);
				$("[name='op']", row.tr()).hide();
			}
		},
		newtr:function(row){
			var that = this;
			return addTr(that.table, row);
		},
		getRowModel : function(param){
			var that = this;
			var row = that.getRow(param);
			return row ? row.tr().data("model") : null;
		},
		getRow:function(param){
			var that = this;
			var finder = {};
			var idField = that.idField;
			if( $.type(param) == "string" ){
				finder[idField] = param;
			}else if( param[idField] ){
				finder[idField] = param[idField];
			}else{
				finder = param;
			}
			var row = null;
			$.each(that.list, function(i, item){
				for( var name in finder ){
					if( finder[name] != item[name] ){
						return;
					}
				}
				row = item;
				return false;
			});
			return row;
		},
		getRows:function(){
			var that = this;
			var list = that.list;
			var rows = [];
			for(var i = 0; i < list.length; i++){
				if( list[i].op != "delete" ){
					rows.push(list[i]);
				}
			}
			return rows;
		},
		getChangeRows:function(){
			var that = this;
			var list = that.list;
			var rows = [];
			for(var i = 0; i < list.length; i++){
				if( ["insert","delete","update"].contains( list[i].op ) ){
					rows.push(list[i]);
				}
			}
			return rows;
		},
		clear:function(){
			var that = this;
			that.tbody.empty();
			that.list.clear();
		},
		parse:function(tr){
			$.initValid(tr);
			$.parser.parse(tr, true);
		},
		json : function(){
			var that = this;
			return JSON.stringify(that.list);
		}
	});
})(jQuery)


$.fn.datagrid.defaults.detailFormatter = function(i, row){
	return "";
};
var detailview = $.extend({}, $.fn.datagrid.defaults.view, {
	render: function(target, container, frozen){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		if (frozen){
			if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
				return;
			}
		}
		
		var rows = state.data.rows;
		var fields = $(target).datagrid('getColumnFields', frozen);
		var table = [];
		table.push('<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>');
		for(var i=0; i<rows.length; i++) {
			// get the class and style attributes for this row
			var css = opts.rowStyler ? opts.rowStyler.call(target, i, rows[i]) : '';
			var classValue = '';
			var styleValue = '';
			if (typeof css == 'string'){
				styleValue = css;
			} else if (css){
				classValue = css['class'] || '';
				styleValue = css['style'] || '';
			}
			
			var cls = 'class="datagrid-row ' + (i % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
			var style = styleValue ? 'style="' + styleValue + '"' : '';
			var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + i;
			table.push('<tr id="' + rowId + '" datagrid-row-index="' + i + '" ' + cls + ' ' + style + '>');
			table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
			table.push('</tr>');
			
			table.push('<tr style="display:none;">');
			if (frozen){
				table.push('<td colspan=' + (fields.length+2) + ' style="border-right:0">');
			} else {
				table.push('<td colspan=' + (fields.length) + '>');
			}
			table.push('<div class="datagrid-row-detail">');
			if (frozen){
				table.push('&nbsp;');
			} else {
				table.push(opts.detailFormatter.call(target, i, rows[i]));
			}
			table.push('</div>');
			table.push('</td>');
			table.push('</tr>');
			
		}
		table.push('</tbody></table>');
		
		$(container).html(table.join(''));
		th.bindEvent(container);//绑定上下文的事件
	},
	
	renderRow: function(target, fields, frozen, rowIndex, rowData){
		var opts = $.data(target, 'datagrid').options;
		
		var cc = [];
		if (frozen && opts.rownumbers){
			var rownumber = rowIndex + 1;
			if (opts.pagination){
				rownumber += (opts.pageNumber-1)*opts.pageSize;
			}
			cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">'+rownumber+'</div></td>');
		}
		for(var i=0; i<fields.length; i++){
			var field = fields[i];
			var col = $(target).datagrid('getColumnOption', field);
			if (col){
				var value = rowData[field];	// the field value
				var css = col.styler ? (col.styler(value, rowData, rowIndex)||'') : '';
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (cc){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				var cls = classValue ? 'class="' + classValue + '"' : '';
				var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
				
				cc.push('<td field="' + field + '" ' + cls + ' ' + style + '>');
				
				if (col.checkbox){
					style = '';
				} else if (col.expander){
					style = "text-align:center;height:16px;";
				} else {
					style = styleValue;
					if (col.align){style += ';text-align:' + col.align + ';'}
					if (!opts.nowrap){
						style += ';white-space:normal;height:auto;';
					} else if (opts.autoRowHeight){
						style += ';height:auto;';
					}
				}
				
				cc.push('<div style="' + style + '" ');
				if (col.checkbox){
					cc.push('class="datagrid-cell-check ');
				} else {
					cc.push('class="datagrid-cell ' + col.cellClass);
				}
				cc.push('">');
				
				if (col.checkbox){
					cc.push('<input type="checkbox" name="' + field + '" value="' + (value!=undefined ? value : '') + '">');
				} else if (col.expander) {
					//cc.push('<div style="text-align:center;width:16px;height:16px;">');
					cc.push('<span class="datagrid-row-expander datagrid-row-expand" style="display:inline-block;width:16px;height:16px;cursor:pointer;" />');
					//cc.push('</div>');
				} else if (col.formatter){
					cc.push(col.formatter(value, rowData, rowIndex));
				} else {
					cc.push(value);
				}
				
				cc.push('</div>');
				cc.push('</td>');
			}
		}
		return cc.join('');
	},
	
	insertRow: function(target, index, row){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var panel = $(target).datagrid('getPanel');
		var view1 = dc.view1;
		var view2 = dc.view2;
		
		var isAppend = false;
		var rowLength = $(target).datagrid('getRows').length;
		if (rowLength == 0){
			$(target).datagrid('loadData',{total:1,rows:[row]});
			return;
		}
		
		if (index == undefined || index == null || index >= rowLength) {
			index = rowLength;
			isAppend = true;
			this.canUpdateDetail = false;
		}
		
		$.fn.datagrid.defaults.view.insertRow.call(this, target, index, row);
		
		_insert(true);
		_insert(false);
		
		this.canUpdateDetail = true;
		
		function _insert(frozen){
			var v = frozen ? view1 : view2;
			var tr = v.find('tr[datagrid-row-index='+index+']');
			
			if (isAppend){
				var newDetail = tr.next().clone();
				tr.insertAfter(tr.next());
			} else {
				var newDetail = tr.next().next().clone();
			}
			newDetail.insertAfter(tr);
			newDetail.hide();
			if (!frozen){
				newDetail.find('div.datagrid-row-detail').html(opts.detailFormatter.call(target, index, row));
			}
		}
	},
	
	deleteRow: function(target, index){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var tr = opts.finder.getTr(target, index);
		tr.next().remove();
		$.fn.datagrid.defaults.view.deleteRow.call(this, target, index);
		dc.body2.triggerHandler('scroll');
	},
	
	updateRow: function(target, rowIndex, row){
		var dc = $.data(target, 'datagrid').dc;
		var opts = $.data(target, 'datagrid').options;
		var cls = $(target).datagrid('getExpander', rowIndex).attr('class');
		$.fn.datagrid.defaults.view.updateRow.call(this, target, rowIndex, row);
		$(target).datagrid('getExpander', rowIndex).attr('class',cls);
		
		// update the detail content
		if (this.canUpdateDetail){
			var row = $(target).datagrid('getRows')[rowIndex];
			var detail = $(target).datagrid('getRowDetail', rowIndex);
			detail.html(opts.detailFormatter.call(target, rowIndex, row));
		}
	},
	
	bindEvents: function(target){
		var state = $.data(target, 'datagrid');
		var dc = state.dc;
		var opts = state.options;
		var body = dc.body1.add(dc.body2);
		var clickHandler = ($.data(body[0],'events')||$._data(body[0],'events')).click[0].handler;
		body.unbind('click').bind('click', function(e){
			var tt = $(e.target);
			var tr = tt.closest('tr.datagrid-row');
			if (!tr.length){return}
			if (tt.hasClass('datagrid-row-expander')){
				var rowIndex = parseInt(tr.attr('datagrid-row-index'));
				if (tt.hasClass('datagrid-row-expand')){
					$(target).datagrid('expandRow', rowIndex);
				} else {
					$(target).datagrid('collapseRow', rowIndex);
				}
				$(target).datagrid('fixRowHeight');
				
			} else {
				clickHandler(e);
			}
			e.stopPropagation();
		});
	},
	
	onBeforeRender: function(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var t = $(target);
		var hasExpander = false;
		var fields = t.datagrid('getColumnFields',true).concat(t.datagrid('getColumnFields'));
		for(var i=0; i<fields.length; i++){
			var col = t.datagrid('getColumnOption', fields[i]);
			if (col.expander){
				hasExpander = true;
				break;
			}
		}
		if (!hasExpander){
			if (opts.frozenColumns && opts.frozenColumns.length){
				opts.frozenColumns[0].splice(0,0,{field:'_expander',expander:true,width:24,resizable:false,fixed:true});
			} else {
				opts.frozenColumns = [[{field:'_expander',expander:true,width:24,resizable:false,fixed:true}]];
			}
			
			var t = dc.view1.children('div.datagrid-header').find('table');
			var td = $('<td rowspan="'+opts.frozenColumns.length+'"><div class="datagrid-header-expander" style="width:24px;"></div></td>');
			if ($('tr',t).length == 0){
				td.wrap('<tr></tr>').parent().appendTo($('tbody',t));
			} else if (opts.rownumbers){
				td.insertAfter(t.find('td:has(div.datagrid-header-rownumber)'));
			} else {
				td.prependTo(t.find('tr:first'));
			}
		}
		
		var that = this;
		setTimeout(function(){
			that.bindEvents(target);
		},0);
	},
	
	onAfterRender: function(target){
		var that = this;
		var state = $.data(target, 'datagrid');
		var dc = state.dc;
		var opts = state.options;
		var panel = $(target).datagrid('getPanel');
		
		$.fn.datagrid.defaults.view.onAfterRender.call(this, target);
		
		if (!state.onResizeColumn){
			state.onResizeColumn = opts.onResizeColumn;
		}
		if (!state.onResize){
			state.onResize = opts.onResize;
		}
		function setBodyTableWidth(){
			var columnWidths = dc.view2.children('div.datagrid-header').find('table').width();
			dc.body2.children('table').width(columnWidths);
		}
		
		opts.onResizeColumn = function(field, width){
			setBodyTableWidth();
			var rowCount = $(target).datagrid('getRows').length;
			for(var i=0; i<rowCount; i++){
				$(target).datagrid('fixDetailRowHeight', i);
			}
			
			// call the old event code
			state.onResizeColumn.call(target, field, width);
		};
		opts.onResize = function(width, height){
			setBodyTableWidth();
			state.onResize.call(panel, width, height);
		};
		
		this.canUpdateDetail = true;	// define if to update the detail content when 'updateRow' method is called;
		
		dc.footer1.find('span.datagrid-row-expander').css('visibility', 'hidden');
		$(target).datagrid('resize');
	}
});

$.extend($.fn.datagrid.methods, {
	fixDetailRowHeight: function(jq, index){
		return jq.each(function(){
			var opts = $.data(this, 'datagrid').options;
			if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
				return;
			}
			var dc = $.data(this, 'datagrid').dc;
			var tr1 = opts.finder.getTr(this, index, 'body', 1).next();
			var tr2 = opts.finder.getTr(this, index, 'body', 2).next();
			// fix the detail row height
			if (tr2.is(':visible')){
				tr1.css('height', '');
				tr2.css('height', '');
				var height = Math.max(tr1.height(), tr2.height());
				tr1.css('height', height);
				tr2.css('height', height);
			}
			dc.body2.triggerHandler('scroll');
		});
	},
	getExpander: function(jq, index){	// get row expander object
		var opts = $.data(jq[0], 'datagrid').options;
		return opts.finder.getTr(jq[0], index).find('span.datagrid-row-expander');
	},
	// get row detail container
	getRowDetail: function(jq, index){
		var opts = $.data(jq[0], 'datagrid').options;
		var tr = opts.finder.getTr(jq[0], index, 'body', 2);
		return tr.next().find('div.datagrid-row-detail');
	},
	expandRow: function(jq, index){
		return jq.each(function(){
			var opts = $(this).datagrid('options');
			var dc = $.data(this, 'datagrid').dc;
			var expander = $(this).datagrid('getExpander', index);
			if (expander.hasClass('datagrid-row-expand')){
				expander.removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
				var tr1 = opts.finder.getTr(this, index, 'body', 1).next();
				var tr2 = opts.finder.getTr(this, index, 'body', 2).next();
				tr1.show();
				tr2.show();
				$(this).datagrid('fixDetailRowHeight', index);
				if (opts.onExpandRow){
					var row = $(this).datagrid('getRows')[index];
					opts.onExpandRow.call(this, index, row);
				}
			}
		});
	},
	collapseRow: function(jq, index){
		return jq.each(function(){
			var opts = $(this).datagrid('options');
			var dc = $.data(this, 'datagrid').dc;
			var expander = $(this).datagrid('getExpander', index);
			if (expander.hasClass('datagrid-row-collapse')){
				expander.removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
				var tr1 = opts.finder.getTr(this, index, 'body', 1).next();
				var tr2 = opts.finder.getTr(this, index, 'body', 2).next();
				tr1.hide();
				tr2.hide();
				dc.body2.triggerHandler('scroll');
				if (opts.onCollapseRow){
					var row = $(this).datagrid('getRows')[index];
					opts.onCollapseRow.call(this, index, row);
				}
			}
		});
	}
});
/**
 * CardView
 * 
 * @author 沈飞
 * @since 1.0 2014-06-12
 */
(function($) {

	// 渲染组件
	function render(target) {
		var caption = $("<div class='cardview-caption'></div>").appendTo(target);
		var container = $("<div style='width:100%;height:auto;overflow-y:auto;max-height:100%;'></div>").insertAfter(caption);
		var table = $("<table class='cardview-table'></table>").appendTo(container);
		var pagination = $("<div class='cardview-pagenation'></div>").insertAfter(container);
		return {
			caption : caption,
			container : container,
			table : table,
			pagination : pagination
		};
	}

	// 加载数据
	function init(target, parameters) {
		var options = $.data(target, "cardview").options;
		var pagination = $(target).cardview('getPager');
		// 缓存查询参数，在参数不存在的情况下就会使用上一次的查询参数
		_cacheParams(target, parameters);
		// 加载数据回调
		options.loader.call(target, parameters, function(json) {
			$(target).cardview("loading");
			var total = json.total;
			// 渲染组件
			_render(target, total);
			// 加载数据同时取得卡片数组
			_bind(target, json.rows);
			// 重置控件大小
			resize(target);
			// 加载成功
			if (options.onLoadSuccess) {
				var cards = $.data(target, "cardview").cards;
				options.onLoadSuccess.call(target, cards);
			}
			$.data(target, "cardview").rows = json.rows;
			$(target).cardview("loaded");
		});

		// 缓存查询参数
		function _cacheParams(target, parameters) {
			var options = $.data(target, "cardview").options;
			// 缓存查询参数，在参数不存在的情况下就会使用上一次的查询参数
			options.queryParams = $.extend({}, options.queryParams, parameters);
			if (options.queryParams.pageNumber) {
				options.queryParams.pageNumber = options.pageNumber;
			}
			if (options.queryParams.pageSize) {
				var pageSize = options.rowNumber * options.columnNumber;
				options.queryParams.pageSize = pageSize;
			}
		}

		// 渲染控件
		function _render(target, total) {
			var options = $.data(target, "cardview").options;
			var table = $(target).cardview("getTable");
			var rowNumber = null;
			var columnNumber = options.columnNumber;
			var pageable = options.pagination;
			if (pageable == true) {
				rowNumber = options.rowNumber;
			} else {
				rowNumber = total / options.columnNumber;
			}
			var cells = [];
			$(table).empty();
			for (var i = 0; i < rowNumber; i++) {
				var tr = $("<tr></tr>").appendTo(table);
				for (var n = 0; n < columnNumber; n++) {
					var td = $("<td align='center'></td>").appendTo(tr);
					var cell = $("<div class='cardview-card cardview-noborder'></div>").appendTo(td);
					cells.push(cell);
				}
			}
			if (options.pagination) {
				pagination.pagination({
					total : total
				});
			}
			table.data('cells', cells);
		}

		// 绑定卡片
		function _bind(target, rows) {
			_clear(target);
			var table = $(target).cardview("getTable");
			var options = $.data(target, "cardview").options;
			var template = options.template;
			var cells = table.data('cells');
			var cardArray = [];
			for (var i = 0; i < rows.length; i++) {
				var cell = cells[i];
				if (i < cells.length) {
					var data = rows[i];
					if (template) {
						var temp = th.template(template);
						var html = temp(data);
						$(cell).append(html);
					}
					cardArray.push(cell);
					$(cell).removeClass("cardview-noborder").addClass("cardview-unselected");
					$(cell).css('cursor', 'pointer');
					$(cell).data('data', data);
					// 绑定事件
					_bindEvent(target, cell, cardArray);
					// 渲染行样式
					_rowStyler(target, cell, data);
				}
			}
			$.data(target, "cardview").cards = cardArray;
		}

		// 渲染行样式
		function _rowStyler(target, cell, data) {
			var options = $.data(target, "cardview").options;
			if (options.rowStyler) {
				var style = options.rowStyler.call(target, data);
				for ( var prop in style) {
					$(cell).css(prop, style[prop]);
				}
			}
		}

		// 绑定事件
		function _bindEvent(target, cell, cardArray) {
			var options = $.data(target, "cardview").options;
			var singleSelect = options.singleSelect;
			$(cell).bind('click', function() {
				var data = $(this).data('data');
				if (singleSelect == true) {
					$(cardArray).each(function() {
						$(this).removeClass("cardview-selected").addClass("cardview-unselected");
					});
				}
				if ($(this).hasClass("cardview-selected")) {
					$(this).addClass("cardview-unselected").removeClass("cardview-selected");
				} else if ($(this).hasClass("cardview-unselected")) {
					$(this).addClass("cardview-selected").removeClass("cardview-unselected");
					if (options.onSelect) {
						options.onSelect.call(target, $(this));
					}
				}
				if (options.onClick) {
					options.onClick.call(target, $(this));
				}
			});
			$(cell).bind('dblclick', function() {
				if (options.onDbClick) {
					options.onDbClick.call(target, $(this));
				}
			});
		}

		// 清除控件
		function _clear(target) {
			var table = $(target).cardview("getTable");
			var cells = table.data('cells');
			$(cells).each(function() {
				$(this).addClass("cardview-noborder").removeClass("cardview-unselected");
				$(this).empty();
			});
		}
	}

	// 初始化分页控件
	function pagination(target) {
		var options = $.data(target, "cardview").options;
		var size = options.rowNumber * options.columnNumber;
		if (options.pagination == true) {
			var pagination = $(target).cardview('getPager');
			pagination.pagination({
				pageSize : size,
				// pageList : [ size, size * 2, size * 3 ],
				showPageList : false,
				onSelectPage : function(pageNumber, pageSize) {
					var parameters = options.queryParams;
					if (parameters) {
						var params = $.extend({}, parameters, {
							pageNumber : pageNumber,
							pageSize : pageSize
						});
						init(target, params);
					}
				}
			});
		}
	}

	// 重新计算控件大小
	function resize(target) {
		var options = $.data(target, "cardview").options;
		// 自动填充到上层控件
		var parent = $(target).parent();
		if (options.fit == true) {
			var width = parent.width();
			var height = parent.height();
			$(target).width(width);
			$(target).height(height);
		}
		_resizePanel(target);
		_resizeCard(target);

		// 重新定义View控件高宽
		function _resizePanel(target) {
			var options = $.data(target, "cardview").options;
			var container = $(target).cardview("getContainer");
			var table = $(target).cardview("getTable");
			var pagination = $(target).cardview('getPager');
			var caption = $(target).cardview("getCaption");
			var targetHeight = $(target).outerHeight();
			var captionHeight = caption.outerHeight();
			var pageHeight = pagination.outerHeight();
			var otherHeight = captionHeight + pageHeight;
			var tableHeight = targetHeight - otherHeight;
			container.height(tableHeight);
			if (options.pagination == true) {
				table.css("height", tableHeight);
			} else {
				table.css("max-height", tableHeight);
			}
		}

		// 重新定义卡片控件的高宽
		function _resizeCard(target) {
			var options = $.data(target, "cardview").options;
			var table = $(target).cardview("getTable");
			var parent = $(target).parent();
			var cwidth = (parent.width() / options.columnNumber) * 0.90;
			var cheight = (table.height() / options.rowNumber) * 0.90;
			if (options.pagination == false) {
				cheight = (table.parent().height() / options.rowNumber) * 0.90;
			}
			var cells = table.data('cells');
			// var realHeight = [];
			$(cells).each(function() {
				$(this).width(cwidth);
				if (options.pagination == false) {
					$(this).css("min-height", cheight + "px");
				} else {
					$(this).height(cheight);
				}
				// $(this).css("min-height", cheight + "px");
				// realHeight.push($(this).height());
			});
			/*
			 * var maxHeight = _max(realHeight); $(cells).each(function() {
			 * $(this).height(maxHeight); });
			 */
		}

		// 取数组最大值
		/*
		 * function _max(array) { var max = parseInt(array[0]); var len =
		 * array.length; for (var i = 1; i < len; i++) { if (parseInt(array[i]) >
		 * max) { max = array[i]; } } return max; }
		 */
	}

	// 获得所有选中项目
	function getSelections(target) {
		var selections = [];
		var cards = $.data(target, "cardview").cards;
		for (var i = 0; i < cards.length; i++) {
			var card = cards[i];
			if (card.hasClass("cardview-selected")) {
				selections.push(card);
			}
		}
		return selections;
	}

	$.fn.cardview = function(options, param) {
		if (typeof options == 'string') {
			return $.fn.cardview.methods[options](this, param);
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "cardview");
			if (state) {
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.cardview.defaults, $.fn.cardview.parseOptions(this), options);
				var _target = render(this);
				state = $.data(this, "cardview", {
					options : opts,
					caption : _target.caption,
					table : _target.table,
					pagination : _target.pagination,
					container : _target.container
				});
				init(this);
				pagination(this);
			}
		});
	};

	$.fn.cardview.methods = {
		options : function(jq) {
			var options = $.data(jq[0], 'cardview').options;
			var opts = $.extend({}, options);
			return opts;
		},
		resize : function(jq) {
			return jq.each(function() {
				resize(this);
			});
		},
		load : function(jq, parameters) {
			return jq.each(function() {
				var options = $.data(this, 'cardview').options;
				if (options.pagination == true) {
					var pagination = $(this).cardview('getPager');
					options.pageNumber = 1;
					pagination.pagination({
						pageNumber : 1
					});
				}
				init(this, parameters);
			});
		},
		reload : function(jq, parameters) {
			return $(jq).cardview("load", parameters);
		},
		getCards : function(jq) {
			return $.data(jq[0], "cardview").cards;
		},
		getSelections : function(jq) {
			return getSelections(jq[0]);
		},
		getSelected : function(jq) {
			var selections = getSelections(jq[0]);
			return selections[0];
		},
		getData : function(jq, card) {
			return card.data('data');
		},
		getContainer : function(jq) {
			return $.data(jq[0], "cardview").container;
		},
		getTable : function(jq) {
			return $.data(jq[0], "cardview").table;
		},
		getPager : function(jq) {
			return $.data(jq[0], "cardview").pagination;
		},
		getCaption : function(jq) {
			return $.data(jq[0], "cardview").caption;
		},
		loading : function(jq) {
			return jq.each(function() {
				var opts = $.data(this, "cardview").options;
				if (opts.loadMsg) {
					var container = $(this).cardview("getContainer");
					$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(container);
					var msg = $("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html(opts.loadMsg).appendTo(container);
					msg.css("marginLeft", -msg.outerWidth() / 2);
				}
			});
		},
		loaded : function(jq) {
			return jq.each(function() {
				var container = $(this).cardview("getContainer");
				container.children("div.datagrid-mask-msg").remove();
				container.children("div.datagrid-mask").remove();
			});
		}
	};

	$.fn.cardview.parseOptions = function(target) {
		var options = $.extend({}, $.parser.parseOptions(target, [ "uid", "url", "queryParams", "template", "loadMsg", {
			fit : "boolean",
			panelWidth : "number",
			panelHeight : "number",
			rowNumber : "number",
			columnNumber : "number",
			pagination : "boolean",
			singleSelect : "boolean"
		} ]));
		if (options.uid) {
			options.template = $("#template-" + options.uid).text() || "";
		}
		if ($.type(options.queryParams) == 'string') {
			var parameters = eval('(' + options.queryParams + ')');
			options.queryParams = parameters;
		}
		return options;
	};

	$.fn.cardview.defaults = {
		url : null,
		method : 'post',
		pagination : true,
		pageNumber : 1,
		rowNumber : 4,
		columnNumber : 4,
		singleSelect : true,
		queryParams : {},
		template : null,
		loadMsg : "卡片加载中, 请稍候 ...",
		fit : true,
		loader : function(parameters, callback) {
			var opts = $(this).cardview("options");
			if (!opts.url) {
				return false;
			}
			parameters = parameters || {};
			var params = $.extend({}, opts.queryParams, parameters);
			$.ajax({
				type : opts.method,
				url : opts.url,
				data : params,
				dataType : "json",
				success : function(json) {
					if (json != null) {
						callback(json);
					}
				}
			});
		},
		rowStyler : function(data) {
		},
		onClick : function(card) {
		},
		onDbClick : function(card) {
		},
		onSelect : function(card) {
		},
		onLoadSuccess : function(cardArray) {
		}
	};

})(jQuery);

(function($){
	//filter
	var filter = function(target, params){
		var state = getState(target), opts = state.options;
		var list = Source.getData(opts.dict);
		var filters = th.filter(list, params);
		load(target, filters);
	};
	
	//reload
	var load = function(target, list){
		var state = getState(target), opts = state.options;
		var value = $(target).attr("data-value") || $(target).val();
		$(target).empty().append("<option value=''>请选择</option>");
		$.each(list, function(i, item){
			if( opts.pid ){
				if( item.pid == pid ){
					$("<option value='" + item.value + "'>" + item.text + "</option>").appendTo(target);
				}
			}else{
				$("<option value='" + item.value + "'>" + item.text + "</option>").appendTo(target);
			}
		});
		$(target).val(value);
	};
	
	//reload
	var reload = function(target, list){
		var state = getState(target), opts = state.options;
		var list = Source.getData(opts.dict);
		load(target, list);
	};
	
	//clear
	var clear = function(target, title){
		$(target).empty();
	};
	
	//取得状态
	var getState = function(target){
		return $.data(target, "select");
	};
	
	//initialize
	var init = function( target ){
		var state = getState(target), opts = state.options;
		reload(target);
		initSubSelect(target);
	};
	
	//初始化级联
	var initSubSelect = function(target){
		var state = getState(target), opts = state.options;
		var $c = $(target).parents("[page=true]");
		if( opts.subId ){//级联
			$(target).change(function(){
				var pid = $(target).val();
				var $sub = $("#" + opts.subId, $c);
				var dict = $sub.attr("dict");
				var list = Source.getData(dict);
				$sub.empty().append("<option value='' selected>请选择</option>");
				$.each(list, function(i, item){
					if( item.pid == pid ){
						$("<option value='" + item.value + "'>" + item.text + "</option>").appendTo($sub);
					}
				});
			});
		}
	};

	$.fn.select = function(options, param, properties){
		if (typeof options == 'string'){
			var method = $.fn.select.methods[options](this, param);
			return method;
		}
		options = options || {};
		return this.each(function(){
			var target = this;
			var state = $.data(target, 'select');
			if (state){
				$.extend(state.options, options);
				init(target);
			} else {
				var opts = $.extend({}, $.fn.select.defaults, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target,["dict","pid","subId"]), options);
				state = $.data(this,'select', {options: opts});
				init(target);//初始化
			}
		});
	};
	
	$.fn.select.methods = {
		reload:function(jq, param, properties){
			return jq.each(function(){
				reload(this, param, properties);
			});
		},filter:function(jq, param, properties){
			return jq.each(function(){
				filter(this, param, properties);
			});
		},clear:function(jq, param, properties){
			return jq.each(function(){
				clear(this, param, properties);
			});
		}
	};
	
	$.fn.select.defaults = {
	};
})(jQuery);
(function($){
	
	//上一步
	var pre = function(target){
		var state = $.data(target, 'wizard');
		if( state.step.pre )
			goStep(target, state.step.pre, false);
	};
	
	//下一步
	var next = function(target){
		var state = $.data(target, 'wizard');
		var $c = $("#" + state.step.name, target);
		if( !$c.form("validate") ){//先验证下
			return;
		}
		var step = state.step;
		if( step.onBeforeNext ){
			var data = getParameter(target, step);//取得当前步骤的参数
			var next = step.onBeforeNext.call(target, step, data);
			if( next == false){
				return false;
			}
		}
		if( step.next ){
			goStep(target, step.next, true);
		}
	};
	
	//关闭
	var close = function(target){
		Dialog.close(target, false);
	};
	
	//步骤添加参数
	var addParams = function(target, param){
		var steps = $.data(target, 'wizard').steps;
		for( var i = 0 ; i < steps.length; i++ ){
			if( steps[i].name == param.step ){
				$.extend(steps[i].params, param.params);
			}
		}
	};
	
	//步骤添加参数
	var setTitle = function(target, title){
		$(".wizard-title",target).html(title);
	};
	
	//设置子标题
	var setSubTitle = function(target, param){
		$(".wizard-title-sub",target).html(param);
	};
	
	//设置子Footer
	var setSubFooter = function(target, param){
		$(".wizard-footer-sub",target).html(param);
	};
	
	//跳转到指定步骤
	var goStep = function(target, step, reload){
		var $c = target;
		var state = $.data(target, 'wizard');
		var url = ctx + step.jsp;
		$(".wizard-title",$c).html(step.title);
		$(".wizard-next",$c).val(step.button || step.title);
		var $content = $(".wizard-content",$c);
		$content.children().hide();
		var div = $("#" + step.name, $content);
		var data = getParameter(target, step.pre);//取得上一个页面的参数
		if( !div.exist() || reload){
			div.remove();//删除之前已经存在的DIV
			$(target).parent().mask("正在加载数据...");
			$.post(url, data, function(text){
				var $div = $("<div id='" + step.name + "' style='height:100%;'>" + text + "</div>");
				$div.appendTo($content);
				$.initValid($("#" + step.name, $content));
				if( !text.contains("Page.init(") ){
					Page.parse($div);//如果没有初始化页面则需要初始化
				}
				if( step.onLoad ){
					step.onLoad.call(target, step, data);
				}
				if( step.pre && step.pre.onNext ){
					step.pre.onNext.call(target, step, data);
				}
				$(target).parent().unmask();
			});
		}else{
			$("#" + step.name ,$content).show();
		}
		state.step = step;
		if( step.first ){
			$(".wizard-pre",$c).hide();
		}else{
			$(".wizard-pre",$c).show();
		}
		return data;
	};
	
	//取得参数
	var getParameter = function(target, step){
		var params = $.data(target, 'wizard').params || {};
		if( step ){
			var $c = $("#" + step.name, target);
			var parameter = Form.getParams($c);
			return $.extend(parameter, params, step.params);
		}
		return params;
	};
	
	//取得参数
	var getOptions = function(target, step){
		var options = $.data(target, 'wizard');
		return options;
	};
	
	//步骤是否存在
	var getStep = function(target, name){
		var steps = $.data(target, 'wizard').steps;
		for( var i = 0 ; i < steps.length; i++ ){
			if( steps[i].name == name ){
				return steps[i];
			}
		}
		return null;
	};
	
	//添加步骤
	var addStep = function(target, param){
		var steps = $.data(target, 'wizard').steps;
		if( param.after ){
			var step = getStep(target, param.step.name);
			if( step == null){//步骤不存在则添加
				var list = [];
				for(var i = 0; i < steps.length; i++){
					list.push(steps[i]);
					if( steps[i].name == param.after ){//在指定步骤后插入
						list.push(param.step);
					}
				}
				$.data(target, 'wizard').steps = list;
				initSteps(target);
				return true;
			}else{
				$.extend(step, param.step);//覆盖当前步骤的参数
				initSteps(target);
			}
		}
		return false;
	};
	
	//删除步骤
	var removeStep = function(target, name){
		var list = [];
		var removedStep = null;
		var steps = $.data(target, 'wizard').steps;
		for(var i = 0; i < steps.length; i++){
			if( steps[i].name == name ){
				removedStep = steps[i];
			}else{
				list.push(steps[i]);
			}
		}
		$.data(target, 'wizard').steps = list;
		initSteps(target);
		return removedStep;
	};
	
	//初始化步骤链表
	var initSteps = function( target ){
		var steps = $.data(target, 'wizard').steps;
		for(var i = 0, previous = null ; i < steps.length; i++){
			steps[i].pre = previous;
			previous ? previous.next = steps[i] : null;
			previous = steps[i];
			steps[i].params = steps[i].params || {};
		}
		steps[0].first = true;
		steps[steps.length - 1].last = true;
	};

	//initialize
	var init = function( target ){
		var $c = target;
		$(".wizard-pre",$c).click(function(){
			pre(target);
		});
		$(".wizard-next",$c).click(function(){
			next(target);
		});
		$(".wizard-close",$c).click(function(){
			close(target);
		});
		initSteps(target);
	};

	$.fn.wizard = function(options, param){
		if (typeof options == 'string'){
			return $.fn.wizard.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'wizard');
			if (state){
				$.extend(state, options);
			} else {
				state = $.data(this, 'wizard', $.extend({}, $.fn.wizard.defaults, $.fn.wizard.parseOptions(this), options));
				init(this);
			}
			goStep(this, state.steps[0]);
		});
	};
	
	$.fn.wizard.methods = {
		options:function(jq, param){
			return getOptions(jq[0], param);
		},
		next:function(jq){
			return jq.each(function(){
				next(this);
			});
		},pre:function(jq){
			return jq.each(function(){
				pre(this);
			});
		},close:function(jq){
			return jq.each(function(){
				close(this);
			});
		},addParams:function(jq, param){
			return jq.each(function(){
				addParams(this, param);
			});
		},setTitle:function(jq, param){
			return jq.each(function(){
				setTitle(this, param);
			});
		},setSubTitle:function(jq, param){
			return jq.each(function(){
				setSubTitle(this, param);
			});
		},setSubFooter:function(jq, param){
			return jq.each(function(){
				setSubFooter(this, param);
			});
		},addStep:function(jq, param){
			return jq.each(function(){
				addStep(this, param);
			});
		},removeStep:function(jq, param){
			return jq.each(function(){
				removeStep(this, param);
			});
		}
	};
	
	$.fn.wizard.parseOptions = function(target){
		var params = $(".wizard-params",target).val() || "{}";
		var options = $.parser.parseOptions(target,[{steps:'object'}]);
		options.params = $.eval(params);
		return options;
	};
	
	$.fn.wizard.defaults = {
	};
})(jQuery);
(function($){
	function scrollTo(target, item){
		var panel = getPanel(target);
		if (item.length){
			if (item.position().top <= 0){
				var h = panel.scrollTop() + item.position().top;
				panel.scrollTop(h);
			} else if (item.position().top + item.outerHeight() > panel.height()){
				var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
				panel.scrollTop(h);
			}
		}
	};
	
	//选择上
	function selectPrev(target){
		var panel = getPanel(target);
		if( panel.is(":hidden") ){
			showPanel(target, false);//隐藏的时候，先显示了再说
			return;
		}
		var $selected = $(".combobox-item-selected", panel);
		var $item = $selected.exist() ? $selected : $(".combobox-item:first",panel).first();
		var $prev = $item.prev(':visible');
		if( $prev.exist() ){
			$selected.removeClass("combobox-item-selected");
			$prev.addClass("combobox-item-selected");
			scrollTo(target, $prev);
		}else{
			scrollTo(target, $("thead",panel));
		}
	};
	
	// 选择下
	function selectNext(target){
		var panel = getPanel(target);
		if( panel.is(":hidden") ){
			showPanel(target, false);//隐藏的时候，先显示了再说
			return;
		}
		var $select = $(".combobox-item-selected", panel);
		var $next = $select.exist() ? $select.next() : $(".combobox-item:first",panel).first();
		if( $next.exist() ){
			$select.removeClass("combobox-item-selected");
			$next.addClass("combobox-item-selected");
			scrollTo(target, $next);
		}
	};
	
	//隐藏面板
	var hidePanel = function(target) {
		var state = $.data(target, 'search');
		var panel = getPanel(target);
		panel.panel("close");
		state.options.onHidePanel.call(target);
	};
	
	//取得顶部位置
	var getTop = function( target ) {
		var state = $.data(target, 'search');
		var panel = getPanel(target);
		var combo = state.combo;
		var top = combo.offset().top + combo._outerHeight();
		if (top + combo._outerHeight() > $(window)._outerHeight() + $(document).scrollTop()) {
			top = combo.offset().top - panel._outerHeight();
		}
		if (top < $(document).scrollTop()) {
			top = combo.offset().top + combo._outerHeight();
		}
		return top;
	};
	
	//取得面板
	var getPanel = function(target){
		var state = $.data(target, 'search');
		if( state.panel ){
			return state.panel;
		}
		var panel = state.panel = $("<div class=\"combo-panel\"></div>").appendTo("body");
		panel.panel({
			doSize : false,
			closed : true,
			cls : "combo-p",
			style : {
				position : "absolute",
				zIndex : 10
			},
			onOpen : function() {
				$(this).panel("resize");
			}
		});
		return panel;
	};
	
	//显示面板
	var showPanel = function(target, refresh){
		//console.log(new Date().getTime() + " showPanel....");
		var state = $.data(target, 'search'), opts = state.options;
		var panel = getPanel(target);
		panel.panel("panel").css("z-index", $.fn.window.defaults.zIndex++);
		panel.panel("move", {
			left : state.combo.offset().left,
			top : getTop(target) - 1//避免出现边框在一起很难看
		});
		var key = state.text.val();
		if( refresh  ){
			opts.loaded = true;
			opts.loader(target, function(data){
				state.list = data.rows;
				renderPanel(target, state.list);//渲染面板
			});
		}else{
			renderPanel(target, state.list);//渲染面板
		}
	};
	
	//渲染面板
	var renderPanel = function(target, list){
		var state = $.data(target, 'search'), opts = state.options;
		var panel = getPanel(target);
		if( !list.length ){
			panel.panel("close");
			return;
		}
		panel.panel("open");
		if( !$(".search-table", panel).exist() ){
			opts.table.appendTo(panel);
		}
		var table = [];
		panel.css("border","none");
		var height = list.length*24 || 120;
		opts.panelHeight = (height > 200 ? 200 : height) + 30;
		opts.panelWidth = opts.panelWidth ? opts.panelWidth : (opts.columns.length * 80);
		var template = th.template(opts.template);
		opts.tbody.empty();
		$.each(list, function(i, data){
			var html = template(data);
			var item = $(html).appendTo(opts.tbody);
			item.addClass("combobox-item");
			item.attr("value", data[opts.valueField]);
			item.data('data', data);
			item.bind("mousedown.combo",function(e){
				e.preventDefault();
				setValue(target, data[opts.valueField]);
				hidePanel(target);
				//pressTab(target);
			}).hover(function(){
				$(this).addClass("combobox-item-hover");
			},function(){
				$(this).removeClass("combobox-item-hover");
			});	
		});
		var width = opts.panelWidth || state.combo.outerWidth();
		var height = opts.panelHeight || 120;
		panel.panel("resize", {width:width, height:height});
		var value = $(target).val();
		var $item = $("[value='" + value + "']", panel);
		if( !$item.exist() ){
			$item = $(".combobox-item:first", panel);
		}
		$item.addClass("combobox-item-selected");
		scrollTo(target, $item);
		state.options.onShowPanel.call(target);
	}
	
	//设置值value
	var setValue = function(target, value ){
		var state = $.data(target, 'search');
		var opts = state.options;
		var panel = getPanel(target);
		var oldValue = $(target).val();
		if( value != oldValue){
			var result = opts.onBeforeChange.call(target, value, oldValue);
			if( result === false){
				return;
			}
		}
		$(".combobox-item-selected", panel).removeClass("combobox-item-selected");
		$("[value='" + value + "']", panel).addClass("combobox-item-selected");
		$(target).val(value);
		var data = getData(target, value);
		opts.onSelect.call(target, value, oldValue, data);
		if( oldValue != value){
			opts.onChange.call(target, value, oldValue, data);
		}
		if( state.text.data("validatebox") ){
			state.text.validatebox("validate");//执行验证
		}
		setComboText(target, data ? data[opts.textField] : "");//设置文本显示
	};
	
	//取得值
	var getValue = function(target){
		return $(target).val();
	};

	//设置显示值
	var setComboText = function(target, text){
		var state = $.data(target, 'search');
		var opts = state.options;
		if( text == undefined ){
			var value = $(target).val();
			var data = getData(target, value);
			text = (data != null ? data[opts.textField] : "");
			state.text.val(text);
		}else{
			state.text.val(text);
		}
	};

	//找到数据
	var getData = function(target, value){
		var state = $.data(target, 'search'), opts = state.options;
		if( value == ""){
			return {value:"", text:""};
		}
		if( state ){
			var list = state.list || [];
			for(var i = 0; i < list.length; i++ ){
				if( list[i][opts.valueField]== value ){
					return list[i];
				}
			}
		}
		return null;
	};
	
	//设置有效状态
	var setDisabled = function(target, disabled ){
		var state = $.data(target, 'search');
		var $text = state.text;
		if( disabled ){
			$text.attr("disabled", true);
		}else{
			$text.removeAttr("disabled");
		}
	};
	
	//是否必选
	var required = function( target, required ){
		var state = $.data(target, 'search');
		var $text = state.text;
		$text.validatebox({required:required});
	};
	
	//触发TAB效果
	var pressTab = function(target){
		var state = $.data(target, 'search');
		var $text = state.text;
		//Page.tab($text.get(0));
	};
	
	//设置异步查询的参数
	var setQueryParams = function(target, queryParams){
		var state = $.data(target, 'search'), opts = state.options;
		opts.queryParams = $.extend({}, opts.queryParams, queryParams || {});
	};

	//initialize
	var init = function( target ){
		var state = $.data(target, 'search');
		var opts = state.options;
		var $text = state.text;
		if( $text.data("validatebox") || opts.required || opts.validType){
			$text.validatebox(opts);
		}
		$text.off(".combo").on("focus.combo click.combo",function(e){
			th.delay(function(){
				$("div.combo-panel").not(state.panel).panel("close");
				showPanel(target, !opts.loaded);
				$text.select();//获取焦点时选择文本
			},100);
		}).on("keydown.combo", function(e) {
			switch (e.keyCode) {
				case 38://上箭头
					selectPrev(target);
					break;
				case 40://下箭头
					if( !opts.loaded ){//没有数据加载数据
						showPanel(target, true);
					}else{
						selectNext(target);
					}
					break;
				case 9://TAB键盘
					hidePanel(target);
					break;
				case 13://回车键
					e.preventDefault();
					if( !state.list.length ){//没有数据加载数据
						//showPanel(target, true);
						//return false;//不跳到下个输入框
					}else if(state.panel.is(":hidden")){
						//showPanel(target, false);
						//return false;//不跳到下个输入框
					}else{//有数据选中数据
						var value = $(".combobox-item-selected:first",state.panel).attr("value");
						setValue(target, value);
						hidePanel(target);
						pressTab(target);//跳掉下个输入框
					}
					return true;
					break;
			}
		}).on("blur.combo",function(e){
			setComboText(target);//失去焦点重新设置文本值
		}).on("keyup.combo",function(e){
			var code = parseInt(e.keyCode || -1);
			if( (code >=48 && code <=90) //0-9 A-Z
					|| [8,46,32].contains(e.keyCode)){//backspace,del,space
				th.delay(function(){
					showPanel(target, true);
					if( $text.val() == "" ){//空值清空
						setValue(target, "");
					}
				},500);
			}
		});
		target.onpropertychange = function(e){//IE浏览器
			setComboText(target);
		};
		$(document).unbind(".combo").bind("mousedown.combo", function(e) {
			var p = $(e.target).closest("span.combo,div.combo-panel");
			if (p.length) {
				return;
			}
			$("body>div.combo-p>div.combo-panel").panel("close");
		});
		setDisabled(target, opts.disabled);
		setComboText(target, opts.text || undefined);
	};
	
	//重新加载数据
	var reload = function(target, params){
		var state = $.data(target, 'search'), opts = state.options;
		opts.queryParams = params || opts.queryParams;
		opts.loader(target, function(data){
			state.list = data.rows;
			renderPanel(target, state.list);//渲染面板
		});
	};
	
	//加载数据
	var loadData = function(target, list){
		state.list = list;//重新设置数据
	};
	
	//取得选中行数据
	var getSelected = function(target, param){
		var value = $(target).val();
		var data = getData(target, value);
		return data;
	};
	
	//销毁组件
	var destroy = function(target){
		var state = $.data(target, 'search');
		if( state.panel ){
			state.panel.panel("destroy");
		}
		state.combo.remove();
	};

	$.fn.search = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.search.methods[options](this, param);
			return method;
		}
		options = options || {};
		return this.each(function(){
			var target = this;
			var state = $.data(target, 'search');
			if (state){
				$.extend(state.options, options);
				init(target);
			} else {
				var opts = $.extend({}, $.fn.search.defaults, $.fn.validatebox.parseOptions(target), $.fn.search.parseOptions(target), options);
				var comp = getComponent(target, opts);
				state = $.data(this, 'search', {
					combo: comp.combo,
					panel: comp.panel,
					data: comp.data,//[{id:'1',text:'小米',selected:true}]
					options: opts,
					text: $("input", comp.combo)
				});
				init(target);
				state.list = [];//空数据
			}
		});
	};
	
	var getComponent = function(target, opts ){
		var $combo = $("<span class='combo'/>").insertAfter(target);
		var $text = $("<input type='text' class='text search-text search-enable' validType=\"" + opts.validType + "\"/>").appendTo($combo);//文本显示
		$combo.cssText( $(target).cssText() + ";border:0px;" );//设置CSS样式
		$text.css({"width":"100%"});
		$text.attr("placeholder", $(target).attr("placeholder") );
		$(target).addClass("search-f hidden").removeAttr("required").removeAttr("validType");//隐藏自己
		return {"panel":null, "combo":$combo};
	};
	
	$.fn.search.methods = {
		options:function(jq, param){
			return $.data(jq[0],"search").options
		},required:function(jq, param){
			return jq.each(function(){
				required(this, param);
			});
		},enable:function(jq, param){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},disable:function(jq, param){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},destroy:function(jq, param){
			return jq.each(function(){
				destroy(this);
			});
		},setValue:function(jq, param){
			return jq.each(function(){
				setValue(this, param);
			});
		},getValue:function(jq, param){
			return getValue(jq[0], param);
		},setText:function(jq, param){
			return jq.each(function(){
				setComboText(this, param);
			});
		},getText:function(jq, param){
			return $.data(jq[0],"search").text.val();
		},loadData:function(jq, param){
			return jq.each(function(){
				loadData(this, param);
			});
		},reload:function(jq, param){
			return jq.each(function(){
				reload(this, param);
			});
		},getSelected:function(jq, param){
			return getSelected(jq[0], param);
		},setQueryParams:function(jq, param){
			return jq.each(function(){
				setQueryParams(this, param);
			});
		},focus:function(jq, param){
			return jq.each(function(){
				var _this = this;
				setTimeout(function(){
					$(_this).data("search").text.focus();
					showPanel(_this, param);
				},0);
			});
		}
	};
	
	$.fn.search.parseOptions = function(target){
		var opts = $.parser.parseOptions(target,["name","url","style","uid","valueField","textField","panelWidth","panelHeight"
		    ,"validType","text",{"onSelect":"object","required":"boolean","server":"boolean","queryColumns":'object',"queryParams":'object'
		    	,"maxRows":"number","includes":"array","excludes":"array"}]);
		opts.disabled = $(target).hasAttr("readonly");
		opts.required = $(target).hasAttr("required");
		opts.table = $( $("#table-" + opts.uid).text() );
		opts.tbody = $("<tbody></tbody>").appendTo(opts.table);
		var panelWidth = 0;
		opts.columns = (function(text){
			var cols = [];
			$(text).find("th").each(function(){
				var $this = $(this);
				var col = {};
				col.title = $this.text();
				col.field = $this.attr("field");
				col.width = parseInt($this.attr("width") || "80");
				panelWidth += col.width;
				cols.push(col);
			});
			return cols;
		})(opts.table);
		opts.panelWidth = panelWidth;
		opts.template = (function(){
			var tr= ["<tr>\n"];
			for( var i = 0 ; i < opts.columns.length; i++ ){
				var col = opts.columns[i];
				tr.push("<td width='" + col.width + "'>");
				tr.push("#" + col.field + "#");
				tr.push("</td>\n");
			}
			tr.push("</tr>\n");
			return tr.join("");
		})();
		return opts;
	};
	
	$.fn.search.defaults = {
		panelWidth:0,
		panelHeight:0,
		maxRows:50,
		readonly:false,
		required:false,
		valueField:"value",
		textField:"text",
		loaded:false,
		queryParams:{},
		autoQuery:false,
		onShowPanel : function(){},
		onHidePanel : function(){},
		onSelect : function(){},
		onBeforeChange : function(value, old){
			//console.log("selectx onBeforeChange value=" + value + ";old=" + old);
		},
		onChange : function(value, old){
			console.log("search onChange value=" + value + ";old=" + old);
		},
		filter:function(list){
			var target = this;
			var state = $.data(target, 'search');
			var opts = state.options;
			var data = [];
			var includes = opts.includes || [], excludes = opts.excludes || [];
			for( var i = 0 ; i < list.length; i++ ){
				var value = list[i].value;
				if( excludes.contains(value) ){
					continue;
				}
				if( !includes.isEmpty() && !includes.contains(value) ){
					continue;
				}
				if( "0" == list[i].status ){//编辑隐藏
					continue;
				}
				data.push(list[i]);
			}
			return data;
		},
		loader:function(target, success, error){
			var state = $.data(target, 'search'), opts = state.options;
			var parameters = [], cols = opts.queryColumns;
			var key = state.text.val();
			for(var i = 0; i < cols.length; i = i + 2){
				parameters.push({"name":cols[i], "op":cols[i+1], "value":key, "type":"$OR"});
			}
			parameters = parameters.concat( th.toQueryParams(opts.queryParams || {}) );
			$.post(opts.url, {"parameters":$.toJSON(parameters),"maxRows":opts.maxRows},function(text){
				var data = $.eval(text);
				state.list = data.rows;
				state.total = data.total;
				success ? success(data) : null;
			});
		}
	};
})(jQuery);
(function($){
	
	//initialize
	var init = function(target){
		var $text = $(target);
		$text.off(".number").on("blur.number",function(e){
			var val = $text.val();
			if( isNaN(val) ){//不是数字
				$text.val("");
			}
		}).on("keydown.number",function(e){
			var code = parseInt(e.keyCode || -1);
			if( $.isNumberKey(code) //0-9
					|| [13,8,173,190,32,109,110].contains(code)){//enter,backspace,减号,小数点,del，小键盘(-.)
				return true;
			}
			return false;
		});
	};

	$.fn.number = function(options, param, properties){
		if (typeof options == 'string'){
			return $.fn.number.methods[options](this, param, properties);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'number');
			if (state){
				$.extend(state, options);
			}
			state = $.data(this, 'number', {options:$.extend({},$.fn.number.defaults,options)} );
			init(this);
		});
	};
	
	$.fn.number.methods = {
	};
	
	$.fn.number.defaults = {
	};
})(jQuery);
(function($){
	
	//显示图表
	var show = function(target, refresh){
		var state = $.data(target, 'chart'), opts = state.options;
		if( refresh && opts.url ){
			opts.loaded = true;
			state.chart.showLoading({text: '正在努力的读取数据中...', effect:"bar"});
			opts.loader(target, function(data){
				state.data = data.rows;
				render(target, state.data);//渲染面板
				state.chart.hideLoading();
			});
		}else{
			render(target, state.data);//渲染面板
		}
	};
	
	//渲染图表
	var render = function(target, data){
		var state = $.data(target, 'chart'), opts = state.options;
		var option = state.option;
		if( opts.onBeforeRender.call(target, data) == false ){
			return;
		}
		if( (option.contains("$data") || option.contains("$list")) && !data){
			return;//如果配置有变量，但是无数据直接返回不做渲染
		}
		var $list = new $List([]), $data = data;
		if( $.type(data) == "array" ){
			if( !data.length ){
				$(target).mask($("<div>暂无数据.</div>"));
				return;
			}
			$list = new $List(data);
		}
		try{
			$(target).unmask();
			var options = (new Function("$list, $data"," return " + option + ";"))($list, data);
			setChartOption(target, options, true);
		}catch(E){
			$(target).mask($("<div>暂无数据.</div>"));
		}
	}
	
	//设置图表属性
	var setChartOption = function(target, option, merge){
		var state = $.data(target, 'chart'), opts = state.options;
		if( state.chart && !$.isEmptyObject(option) ){
			state.chart.setOption(option, merge);
		}
	};
	
	//设置异步查询的参数
	var setQueryParams = function(target, queryParams){
		var state = $.data(target, 'chart'), opts = state.options;
		opts.queryParams = $.extend(opts.queryParams, queryParams || {});
	};

	//重新加载数据
	var reload = function(target, params){
		var state = $.data(target, 'chart'), opts = state.options;
		opts.queryParams = params || opts.queryParams;
		show(target, true);
	};
	
	//加载数据
	var loadData = function(target, data){
		var state = $.data(target, 'chart'), opts = state.options;
		opts.loaded = true;
		state.data = data;
		render(target, state.data);//渲染面板
	};
	
	//取得图表配置
	var getChartOption = function(target){
		var state = $.data(target, 'chart'), opts = state.options;
		var option = ($("#options-" + opts.uid).text() || "").trim();
		option = (option.startsWith("{") ? "" : "{") + option + (option.endsWith("}") ? "" : "}");
		return option;
	}
	
	//取得图表对象
	var getChart = function(target){
		var state = $.data(target, 'chart');
		return state.chart;
	};

	//initialize
	var init = function( target ){
		var state = $.data(target, 'chart'), opts = state.options;
		if( !window.echarts ){
			state.chart = echarts.init(target, echarts.theme);
			show(target, true);
		}else{
			state.chart = echarts.init(target, echarts.theme);
			show(target, opts.autoQuery);
		}
	};
	
	//销毁组件
	var destroy = function(target){
		var state = $.data(target, 'chart');
		if( state.chart ){
			state.chart.dispose();
		}
		$(target).remove();
	};
	
	$.fn.chart = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.chart.methods[options](this, param);
			return method;
		}
		options = options || {};
		return this.each(function(){
			var target = this;
			var state = $.data(target, 'chart');
			if (state){
				$.extend(state.options, options);
				init(target);
			} else {
				var opts = $.extend({}, $.fn.chart.defaults, $.fn.chart.parseOptions(target), options);
				state = $.data(this, 'chart', {options: opts});
				state.option = getChartOption(this);
				init(target);
			}
		});
	};
	
	$.fn.chart.methods = {
		options:function(jq, param){
			return $.data(jq[0],"chart").options
		},destroy:function(jq, param){
			return jq.each(function(){
				destroy(this);
			});
		},loadData:function(jq, param){
			return jq.each(function(){
				loadData(this, param);
			});
		},reload:function(jq, param){
			return jq.each(function(){
				reload(this, param);
			});
		},setQueryParams:function(jq, param){
			return jq.each(function(){
				setQueryParams(this, param);
			});
		},getChart:function(jq, param){
			return getChart(jq[0], param);
		}
	};
	
	$.fn.chart.parseOptions = function(target){
		var opts = $.parser.parseOptions(target,["name", "url", "style", "uid", {"maxRows":"number","autoQuery":"boolean"}]);
		opts.queryParams = $.parse($(target).attr("queryParams"));
		return opts;
	};
	
	$.fn.chart.defaults = {
		maxRows:50,
		loaded:false,
		queryParams:{},
		autoQuery:false,
		onBeforeRender:function(){},
		loader:function(target, success, error){
			var state = $.data(target, 'chart'), opts = state.options;
			var parameters = th.toQueryParams(opts.queryParams || {});
			$.post(opts.url, {"parameters":$.toJSON(parameters),"maxRows":opts.maxRows},function(text){
				var data = $.eval(text);
				state.list = data.rows;
				state.total = data.total;
				success ? success(data) : null;
			});
		}
	};
})(jQuery);
(function($){
	
	//禁用
	var disable = function(target){
		var state = $.data(target, 'editor'), opts = state.options;
		return state.editor.setDisabled();
	};
	
	//启用
	var enable = function(target){
		var state = $.data(target, 'editor'), opts = state.options;
		return state.editor.setEnabled();
	};

	//取得值
	var getValue = function(target){
		var state = $.data(target, 'editor'), opts = state.options;
		return state.editor.getContent();
	};
	
	//取得文本
	var getText = function(target){
		var state = $.data(target, 'editor'), opts = state.options;
		return state.editor.getContentTxt();
	};
	
	//设置值
	var setValue = function(target, value){
		var state = $.data(target, 'editor'), opts = state.options;
		state.editor.setContent(value);
	};
	
	//取得编辑器
	var getEditor = function(target){
		var state = $.data(target, 'editor'), opts = state.options;
		return state.editor;
	};
	
	//initialize
	var init = function( target ){
		var state = $.data(target, 'editor'), opts = state.options;
		var name = $(target).attr("name");
		var value = $(target).removeAttr("name").hide().val();
		state.editorId = $(target).attr("id") + "_editor_" + new Date().getTime() + "_" + Math.ceil(Math.random()*1000);
		$("<script id='" + state.editorId + "' name='" + name + "' type='text/plain'>" + value + "</script>").insertAfter(target);
		var options = $.extend({
		    autoHeightEnabled: true,
		    autoFloatEnabled: true,
			initialFrameWidth: opts.width,
			initialFrameHeight: opts.height
		}, opts);
		if( $.type(options.toolbar) == "string" ){
			options.toolbar = options["toolbar_" + opts.toolbar] || [];
		}else if( $.type(options.toolbar) == "undefined" ){
			options.toolbar = options.toolbar_normal;
		}
		state.editor = UM.getEditor(state.editorId, options);
		var imageUrl = state.editor.options.imageUrl;
		if( opts.uploadService ){
			state.editor.options.imageUrl = imageUrl + "?service=" + opts.uploadService;
		}
		if( opts.maxLength ){
			setTimeout(function(){
				initContentLengthTip(target);//初始化内容提示
			},500);
		}
		$(target).attr("destoryable", true);
		$(target).data("destoryable", function(){
			UM.clearCache(state.editorId);
			state.editor.container.innerHTML = '';
		});
	};
	
	var initContentLengthTip = function(target){
		var state = $.data(target, 'editor'), opts = state.options;
		var left = opts.width - 80;
		state.tip = $("<div style='display:inline-block;padding-right:18px;' name='editor_validate'>可输 " +opts.maxLength +" 字</div>").appendTo($(".edui-btn-toolbar",state.editor.container));
		state.tip.css({"position":"absolute", "right": "2px", "color":"gray"});
		state.editor.addListener("contentchange", function(){
			onContentChange(target);
		});
		$(state.editor.container).on("keyup", function(){
			onContentChange(target);
		});
		onContentChange(target);//调用一次
	};
	
	//内容发生变化
	var onContentChange = function(target){
		var state = $.data(target, 'editor'), opts = state.options;
		var showLength = getShowLength(target);
		if( showLength >= 0 ){
			state.tip.css("color","gray");
			state.tip.text("可输 " + showLength + " 字");
			state.tip.removeClass("validatebox-invalid");
		}else{
			state.tip.text("超长 " + -showLength + " 字");
			state.tip.css("color","red");
			state.tip.addClass("validatebox-invalid");
		}
	};
	
	//取得显示长度
	var getShowLength = function(target){
		var state = $.data(target, 'editor'), opts = state.options;
		var content = state.editor.getContentTxt();
		var contentLength = content.length;
		var showLength = opts.maxLength - contentLength;
		return showLength;
	};
	
	//销毁组件
	var destroy = function(target){
		var state = $.data(target, 'editor');
		if( state.editor ){
			state.editor.destroy();
		}
		$(target).remove();
	};

	$.fn.editor = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.editor.methods[options](this, param);
			return method;
		}
		options = options || {};
		return this.each(function(){
			var target = this;
			var state = $.data(target, 'editor');
			if (state){
				$.extend(state.options, options);
				init(target);
			} else {
				var opts = $.extend({}, $.fn.editor.defaults, $.fn.validatebox.parseOptions(target), $.fn.editor.parseOptions(target), options);
				state = $.data(this, 'editor', {options: opts});
				init(target);
			}
		});
	};
	
	$.fn.editor.methods = {
		options:function(jq, param){
			return $.data(jq[0],"editor").options
		},destroy:function(jq, param){
			return jq.each(function(){
				destroy(this);
			});
		},getValue:function(jq, param){
			return getValue(jq[0], param);
		},setValue:function(jq, param){
			return jq.each(function(){
				setValue(this, param);
			});
		},getText:function(jq, param){
			return getText(jq[0], param);
		},disable:function(jq, param){
			return jq.each(function(){
				disable(this, param);
			});
		},enable:function(jq, param){
			return jq.each(function(){
				enable(this, param);
			});
		},getEditor:function(jq, param){
			return getEditor(jq[0], param);
		}
	};
	
	$.fn.editor.parseOptions = function(target){
		var opts = $.parser.parseOptions(target);
		return opts;
	};
	
	$.fn.editor.defaults = {
	    width:670,
	    height:200,
	    autoHeightEnabled: true,//自动适应行高
	    autoFloatEnabled:false,//是否保持toolbar的位置不动
	    toolbar_simple:['bold forecolor insertorderedlist insertunorderedlist | justifyleft justifycenter justifyright image | removeformat'],
	    toolbar_normal:['bold forecolor insertorderedlist insertunorderedlist | justifyleft justifycenter justifyright justifyjustify link unlink image attachment video | removeformat', '| preview'],
		toolbar_full : ['source | bold italic underline strikethrough | forecolor backcolor justifyleft justifycenter justifyright justifyjustify link unlink horizontal emotion image attachment video | removeformat', 'fontfamily fontsize | preview']
	};
})(jQuery);
(function($){
	
	//根据cols动态渲染table布局
	var render = function(target){
		var state = getState(target), opts = state.options,cols=parseInt(opts.cols);
		var table = $('<table class="edit-table query-table"></table>').prependTo($(target));
		$(target).css("padding","5px");
		var len = state.inputs.length;
		var requires = state.inputs.getAttrs("required"),labels = state.inputs.getAttrs("label"),
			widths = state.inputs.getAttrs("width"),colspans = state.inputs.getAttrs("colspan");
		if(!cols){
			cols = 4;
		}
		var html = "",n = 0,rows = getRows(target,len,cols);
		for(var i = 0;i < rows;i++){
			var colspanTotal = 0;
			html+="<tr>";
			for(var j = 0;j < cols;j++){
				var m = n;
				var colspan = parseInt(colspans[m]);
				if(m > len-1) break;
				if(!isNaN(colspan)){
					html+="<td class='td1'></td><td class='td2' colspan='"+colspan+"'></td>";
					colspanTotal += colspan;
					n ++;
				}else{
					html+="<td class='td1'></td><td class='td2'></td>";
					colspanTotal ++;
					n ++;
				}
				if(cols <= colspanTotal){
					break;
				}
			}
			html+="</tr>";
		}
		$(html).appendTo(table);
		$(".td1", table).each(function(i, item){
			if(requires[i]){
				$("<span class='required'>*</span>").appendTo(this);
			}
			if(labels[i]){
				$("<span class='label'>"+labels[i]+"：</span>").appendTo(this);
			}
		});
		$(".td2", table).each(function(i, item){
			if(widths[i]){
				$(this).css("width",widths[i]);
			}
			$(state.inputs[i]).appendTo(this);
		});
		
	};
	//获取内容布局的行数
	var getRows = function(target,len,cols){
		var state = getState(target);
		var colspans = state.inputs.getAttrs("colspan"),count = 0,rows = 0;
		for(var i = 0;i < colspans.length;i++){
			var item = parseInt(colspans[i]);
			var count = parseInt((item-1)/2);
			if(!isNaN(item)){
				len += count;
			}
		}
		rows = parseInt(len/cols);
		rows = len % cols == 0 ? rows : rows + 1;
		return rows;
	};
	//清除指定target的内容
	var clear = function(target, title){
		$(target).empty();
	};
	
	//取得当前节点的数据状态
	var getState = function(target){
		return $.data(target, "query-form");
	};
	
	//初始化加载
	var init = function(target){
		render(target);
	};

	$.fn.queryform = function(options, param, properties){
		if (typeof options == 'string'){
			var method = $.fn.queryform.methods[options](this, param);
			return method;
		}
		options = options || {};
		return this.each(function(){
			var target = this;
			var state = getState(target);
			if (state){
				$.extend(state.options, options);
				init(target);
			} else {
				var opts = $.extend({}, $.parser.parseOptions(target,["cols"]), options);
				var inputs = $(target).children();
				state = $.data(target,'query-form', {options: opts, "inputs":inputs});
				init(target);//初始化
			}
		});
	};
	
	$.fn.queryform.methods = {
		init:function(jq, param, properties){
			return jq.each(function(){
				render(this, param, properties);
			});
		}
	};
	
	$.fn.queryform.defaults = {
	};
})(jQuery);
(function($){
	
	//根据cols动态渲染table布局
	var render = function(target){
		var state = getState(target), opts = state.options,cols=parseInt(opts.cols);
		var table = $('<table class="edit-table"></table>').prependTo($(target));
		var len = state.inputs.length;
		var requires = state.inputs.getAttrs("required"),labels = state.inputs.getAttrs("label"),
			widths = state.inputs.getAttrs("width"),colspans = state.inputs.getAttrs("colspan");
		if(!cols){
			cols = 4;
		}
		var html = "",n = 0,rows = getRows(target,len,cols);
		for(var i = 0;i < rows;i++){
			var colspanTotal = 0;
			html+="<tr>";
			for(var j = 0;j < cols;j++){
				var m = n;
				var colspan = parseInt(colspans[m]);
				if(m > len-1) break;
				if(!isNaN(colspan)){
					html+="<td class='td1'></td><td class='td2' colspan='"+colspan+"'></td>";
					colspanTotal += colspan;
					n ++;
				}else{
					html+="<td class='td1'></td><td class='td2'></td>";
					colspanTotal ++;
					n ++;
				}
				if(cols <= colspanTotal){
					break;
				}
			}
			html+="</tr>";
		}
		$(html).appendTo(table);
		$(".td1", table).each(function(i, item){
			if(requires[i]){
				$("<span class='required'>*</span>").appendTo(this);
			}
			if(labels[i]){
				$("<span class='label'>"+labels[i]+"：</span>").appendTo(this);
			}
		});
		$(".td2", table).each(function(i, item){
			if(widths[i]){
				$(this).css("width",widths[i]);
			}
			$(state.inputs[i]).appendTo(this);
		});
		
	};
	//获取内容布局的行数
	var getRows = function(target,len,cols){
		var state = getState(target);
		var colspans = state.inputs.getAttrs("colspan"),count = 0,rows = 0;
		for(var i = 0;i < colspans.length;i++){
			var item = parseInt(colspans[i]);
			var count = parseInt((item-1)/2);
			if(!isNaN(item)){
				len += count;
			}
		}
		rows = parseInt(len/cols);
		rows = len % cols == 0 ? rows : rows + 1;
		return rows;
	};
	//根据id隐藏指定列
	var hideColumn = function(target,id){
		var subEl = $("#" + id, $(target));
		if( subEl.exist() ){
			var parentEl = subEl.parent(".td2");
			parentEl.prev().hide();
			parentEl.hide();
		}
	};
	//根据id显示指定列
	var showColumn =function(target,id){
		var subEl = $("#" + id, $(target));
		if( subEl.exist() ){
			var parentEl = subEl.parent(".td2");
			parentEl.prev().show();
			parentEl.show();
		}
	};
	//清除指定target的内容
	var clear = function(target, title){
		$(target).empty();
	};
	
	//取得当前节点的数据状态
	var getState = function(target){
		return $.data(target, "edit-form");
	};
	
	//初始化加载
	var init = function(target){
		render(target);
	};

	$.fn.editform = function(options, param, properties){
		if (typeof options == 'string'){
			var method = $.fn.editform.methods[options](this, param);
			return method;
		}
		options = options || {};
		return this.each(function(){
			var target = this;
			var state = getState(target);
			if (state){
				$.extend(state.options, options);
				init(target);
			} else {
				var opts = $.extend({}, $.parser.parseOptions(target,["cols"]), options);
				var inputs = $(target).children();
				state = $.data(target,'edit-form', {options: opts, "inputs":inputs});
				init(target);//初始化
			}
		});
	};
	
	$.fn.editform.methods = {
		reload:function(jq, param, properties){
			return jq.each(function(){
				render(this, param, properties);
			});
		},showColumn:function(jq,param){
			return jq.each(function(){
				showColumn(this, param);
			});
		},hideColumn:function(jq,param){
			return jq.each(function(){
				hideColumn(this, param);
			});
		}
	};
	
	$.fn.editform.defaults = {
	};
})(jQuery);
