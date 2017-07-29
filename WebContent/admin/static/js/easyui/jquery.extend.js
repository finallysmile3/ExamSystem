// 解析JSON
$.eval = function(s, target){
	if( !s ){
		return null;
	}
	if( !target ){
		return eval("(" + s + ")");
	}else{
		var action = th.getAction(target);;
		return $.parse(s, action);
	}
};

//解析对象类型的字符串
$.parse = function(s, scope){
	var options = {};
	if (s){
		if( !s.startsWith("[") && s.contains(":") ){
			s = s.trim();
			s = s.startsWith("{") ? s : "{" + s;
			s = s.endsWith("}") ? s : s + "}";
		}
		if( scope ){
			options = (new Function("scope","with(scope){ this._result = " + s + "}; return this._result;"))(scope);
		}else{
			options = $.eval(s);
		}
	}
	return options;
};

//初始化验证
$.initValid = function($c){
	//放到最前面，避免下面的组件初始化生成其他HTML
	$("input[input='true'],select[input='true'],textarea[input='true']",$c).each(function(){
		var $this = $(this), className = $this.attr("class") || "";
		if( !className.contains("easyui-combotree", "easyui-combobox",
				"easyui-selectx", "easyui-datebox", "easyui-search") ){
			$this.addClass("easyui-validatebox");
		}
	});
};

//设置dataOptions属性
$.setDataOptions = function(target, options){
	options = $.extend($(target).data("data-options") || {}, options);
	$(target).data("data-options", options);
	return options;
};

//元素是否存在
$.fn.hasAttr = function(name){
	var value = this.eq(0).attr(name);
	return $.type(value) != "undefined" && value != null;
};

//元素是否存在
$.fn.exist = function( selector ){
	return this.length > 0;
};

// 是否变更 @see jquery-easyui-min.js
$.fn.isValChange = function(){
	var oldValue = $(this).attr("oldValue");
	var nowValue = $(this).val();
	if( oldValue != nowValue ){
		$(this).attr("oldValue", nowValue);
		return true;
	}
	return false;
};

// 取得属性值 返回数组
$.fn.getAttrs = function( name ){
	var values = [];
	this.each(function(){
		values.push($(this).attr(name));
	});
	return values;
};


// 清除控件值
$.fn.clear = function(rule){
	if( rule != undefined ){
		var include = rule.include || [];
		var exclude = rule.exclude || [];
		$("input,select,textarea").each(function(){
			var name = $(this).attr("name");
			if(include){
				if( include.length > 0 && include.contains(name) ){
					$(this).val("");
				}
			}else{
				if( !exclude.contains(name) ){
					$(this).val("");
				}
			}
		});
	}else{
		$("input,select,textarea").each(function(){
			$(this).val("");
		});
	}
};

// 输入值变更
// callback 回调函数
// ing 是否立即触发事件
$.fn.modify = function(callbak,ing){
	this.each(function(){
		$(this).attr("oldValue", $(this).val());// 预设默认旧值
	});	
	if( ing ){
		this.each(function(){
			var time = null;
			$(this).focus(function(){
				var target = this;
				if (time){
					clearInterval(time);
				}
				time = setInterval(function(){
					var oldValue = $(target).attr("oldValue");
					var nowValue = $(target).val();
					if( oldValue != nowValue ){
						$(target).attr("oldValue", nowValue);
						callbak.call(target,(oldValue || ""), nowValue);
					}
				},500);
			}).blur(function(){
				clearInterval(time);
				time = null;
			});
		});
	}else{
		this.each(function(){
			$(this).change(function(){
				var oldValue = $(this).attr("oldValue");
				var nowValue = $(this).val();
				$(this).attr("oldValue", nowValue);
				callbak.call(this,(oldValue || ""), nowValue);
			});
		});
	}
};

// 取得URL中参数
$.getURLParam = function( url ){
	var entrys = url.split(/\?|\&/g);
	var param = {};
	for(var i = 0 ; i < entrys.length; i++){
		var entry = entrys[i];
		if(entry.indexOf("=") != -1){
			var values = entry.split(/=/g);
			param[values[0]] = values[1];
		}
	}
	return param;
};

// 添加URL参数
$.setURLParam = function(url, param){
	for(var name in param){
		var pair = name + "=" + param[name];
		if(url.indexOf(name + "=") != -1){
			var reg = new RegExp(name + "=\\w*","g");
			url = url.replace(reg, pair);
		}else{
			if( url.indexOf("?") == -1 ){
				url = url + "?" + pair;
			}else{
				url = url + "&" + pair;
			}
		}
	}
	return url;
};

//对象转换为JSON
$.toJSON = function( obj ){
	if(obj == null) {
		return null;
	}
	return JSON.stringify(obj);
};

// 编码URI
$.encodeURI = function( text ){
	var value = encodeURIComponent(text);
	return value;
};

$.fn.outerHtml = function(){
	return $("<p></p>").append(this.clone()).html(); 
};

// 显示身份证图片
$.fn.showPhoto = function( idcard ){
	this.each(function(){
		$(this).unbind("error.idcard").bind("error.idcard",function(){
			$(this).attr("src", ctx + "/css/global/nophoto.png");
		});
		$(this).attr("src", ctx + "/idcard/photo.do?idcard=" + idcard);
	});
	return this;
};

// 设置值,兼容各种组件
$.fn.setValue = function( value ){
	this.each(function(){
		var $this = $(this);
		if($this.data("combobox") || $this.data("combotree") || $this.data("datebox")){
			$this.combo("setValue", value);
		}if($this.data("selectx") ){
			$this.selectx("setValue", value);
		}else if( $this.data("editor") ){
			$this.editor("setValue", value);
		}else if( $this.is("select") ){
			var readonly = $this.attr("readonly") == "true";
			if( readonly ){
				$("option", $this).attr("disabled",false);
				$this.val(value);
				$("option[value='" + value + "']", $this).attr("selected",true);
				$("option[value!='" + value + "']", $this).attr("disabled",true);
			}else{
				$this.val(value);
			}
		}else{
			$this.val(value);
		}
	});
};

// 取得值支持各类组件
$.fn.getValue = function(){
	var $this = $(this.eq(0));
	var value = null;
	if($this.data("combobox") || $this.data("combotree")  || $this.data("datebox") 
			|| $this.data("datetimebox") ){
		value = $this.combo("getValue");
	}if( $this.data("selectx") ){
		value = $this.selectx("getValue");
	}else if( $this.data("editor") ){
		value = $this.editor("getValue");
	}else{
		value = $this.val();
	}
	return value;
};

// 设置、获取样式
$.fn.cssText = function( text ){
	if( text ){
		this.each(function(){
			this.style.cssText = text;
		});
	}else{
		return this.get(0).style.cssText;
	}
};

// 设置映射值 nocover不覆盖已有的值
$.fn.setMapping = function(src, mapping, nocover){
	if( typeof mapping != "undefined"){
		this.each(function(){
			for(var name in mapping){
				var $input = $("#" + name, this);
				var object = mapping[name];
				if( nocover ){
					if( !$input.val() ){// 有值的情况下不做覆盖
						$.setMappingValue(src, $input, object);
					}
				}else{
					$.setMappingValue(src, $input, object);
				}
			}
		});
	}else{
		var mapping = {};
		for( var name in src ){
			mapping[name] = name;
		}
		this.setMapping(src,mapping);
	}
};

// 设置值
$.setMappingValue = function(src, $input, object){
	if( (typeof object == "object") ){// 如果是对象类型，组件设置值
		var type = object.type;
		for( var name in object ){
			if( name != "type" ){
				var value = src[object[name]];
				$input[type](name,value);
			}
		}
	}else if( $input.is("select") ){
		var value = src[object];
		if( $("option[value='" + value + "']",$input).length > 0 ){
			$input.val(value);
		}
	}else{
		$input.val(src[object]);
	}
};

//鼠标单击和双击事件组件
$.fn.onClick = function(onClick, onDblclick){ 
    return this.each(function(){
    	var timer = null;
        var target = this; 
        $(this).click(function(e){ 
            clearTimeout(timer); 
            timer = setTimeout(function(){
            	(onClick || $.noop).call(target, e);
            }, 400); 
        }).dblclick(function(e) { 
            clearTimeout(timer); 
            (onDblclick || $.noop).call(target, e); 
        });
    }); 
};

// 加载JS
$.loadJs = function( url, callback){
	var done = false;
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.language = 'javascript';
	script.src = url;
	script.onload = script.onreadystatechange = function(){
		if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')){
			done = true;
			script.onload = script.onreadystatechange = null;
			if (callback){
				callback.call(script);
			}
		}
	};
	document.getElementsByTagName("head")[0].appendChild(script);
};

// 加载CSS
$.loadCss = function(url, callback){
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.media = 'screen';
	link.href = url;
	document.getElementsByTagName('head')[0].appendChild(link);
	if (callback){
		callback.call(link);
	}
};

//校验数字输入
$.isNumberKey = function( code ){
	return (code >=48 && code <=57) /*0-9主键盘*/ || (code >=96 && code <=105)/*0-9小键盘*/;
};

//校验日期输入
$.isDateKey = function( code ){
	return (code >=48 && code <=57) /*0-9主键盘*/ 
	|| (code >=96 && code <=105)/*0-9小键盘*/
	|| [32,8,46,109,173].contains(code);//space,backspace,del,小键盘-,大键盘-
};

$.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        options.expires = options.expires || 7;// 默认7天过期
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires
															// attribute,
															// max-age is not
															// supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

(function($){
	$.fn.mask = function(label){
		$(this).each(function() {
			$.maskElement($(this), label);
		});
	};

	$.fn.unmask = function(){
		$(this).each(function() {
			$.unmaskElement($(this));
		});
	};
	
	$.fn.isMasked = function(){
		return this.hasClass("masked");
	};

	$.maskElement = function(element, label){
		if(element.isMasked()) {
			$.unmaskElement(element);
		}
		if(element.css("position") == "static") {
			element.addClass("masked-relative");
		}
		element.addClass("masked");
		var maskDiv = $('<div class="loadmask"></div>').appendTo(element);
		var table = $("<table class='loadmask-table' style='display:none;'><tr><td class='loadmask-table-content'></td></tr></table>").appendTo(element);
		var content = $(".loadmask-table-content", table);
		if( $.type(label) == "string" ){
			maskDiv.addClass("loadmask-opacity");
			element.attr("mask-type", "string");
			$('<span class="loadmask-msg">' + label + '</span>').appendTo(content);
		}else if( label instanceof jQuery ){
			element.attr("mask-type", "jquery");
			label.show().appendTo(content);
			th.bindEvent(content);
		}
		table.show();
	};
	
	$.unmaskElement = function(element){
		element.find(".loadmask-msg,.loadmask-table,.loadmask").remove();
		element.removeClass("masked");
		element.removeClass("masked-relative");
	};
 
})(jQuery);