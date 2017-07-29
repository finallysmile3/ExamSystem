if( $.browser.msie ){
	window.console = {} || window.console;//兼容其他浏览器
	console.debug = console.log || function(info){};
	console.log = console.log || function(info){};
}

//基础类
var Class = new Function();
Class.extend = function(proto) {
    var base = function() {},
        member,
        that = this,
        subclass = proto && proto.init ? proto.init : function () {
            that.apply(this, arguments);
        },
        fn;
    base.prototype = that.prototype;
    fn = subclass.fn = subclass.prototype = new base();
    for (member in proto) {
        if (proto[member] != null && proto[member].constructor === Object) {
            // Merge object members
            fn[member] = $.extend(true, {}, base.prototype[member], proto[member]);
        } else {
            fn[member] = proto[member];
        }
    }
    fn.constructor = subclass;
    subclass.extend = that.extend;
    return subclass;
};

// 去除前后空格
String.prototype.trim = function (){
	return this.replace(/(^\s*)|(\s*$)/g,"");
};

// 返回字符串实际长度,汉字2个字符
String.prototype.size = function(){
	return this.replace(/[^\x00-\xff]/g,"aa").length;
};

//是否包含字符串
String.prototype.contains = function() {
	for( var i = 0 ; i < arguments.length; i++ ){
		var s = arguments[i];
		if( this.indexOf(s) != -1 ){
			return true;
		}
	}
	return false;
};

// 首字母小写
String.prototype.lowerCaseFirstChar = function() {
	if( this.length > 0 )
		return this.charAt(0).toLowerCase() + this.substring(1,this.length);
	return this;
};

// 首字母大写
String.prototype.upperCaseFirstChar = function(){
	if( this.length > 0 )
		return this.charAt(0).toUpperCase() + this.substring(1,this.length);
	return this;
};

// 是否以字符串开始
String.prototype.startWith = function( value ){
	return this.indexOf(value) == 0;
};

//是否以字符串开始 兼容JAVA方法名称
String.prototype.startsWith = function( value ){
	return this.indexOf(value) == 0;
};

//是否以字符串结束
String.prototype.endWith = function( value ){
	return this.substring(this.length - value.length) == value;
};

//是否以字符串结束 兼容JAVA方法名称
String.prototype.endsWith = function( value ){
	return this.substring(this.length - value.length) == value;
};

// 返回Hash编码
String.prototype.hashCode = function(){
	var hash = 0;
	for( var i = 0 ; i < this.length ; i++ ){
		hash += this.charCodeAt(i);
	}
	return hash;
};

//返回字符唯一ID
String.prototype.uuid = function(){
	var keys = [];
	for( var i = 0 ; i < this.length ; i++ ){
		keys.push(this.charCodeAt(i));
	}
	var uuid = keys.hashCode() + "" +  this.hashCode();
	return uuid;
};

//取得数据
Array.prototype.fetch = function( key ){
	var values = [];
	for( var i = 0 ; i < this.length ; i++ ){
		values.push(this[i][key]);
	}
	return values;
};

//是否包含指定值
Array.prototype.contains = function( value ){
	for( var i = 0 ; i < this.length ; i++ ){
		if( this[i] == value ){
			return true;
		}
	}
	return false;
};

//是否为空
Array.prototype.isEmpty = function(){
	return this.length == 0;
};

//返回第一个元素
Array.prototype.first = function(){
	return this[0];
};

//返回最后一个元素
Array.prototype.last = function(){
	return this[this.length - 1];
};

//清空
Array.prototype.clear = function(){
	this.length = 0;
};

//添加数组
Array.prototype.pushAll = function( array ){
	for( var i = 0 ; i < array.length; i++ ){
		this.push(array[i]);
	}
};

//取数组中的最大值
Array.prototype.max = function(name) {
	var list = name ? this.fetch(name) : this;
	var max = th.number(list[0]) || list[0];
	for (var i = 1 ; i < list.length; i++){
		var num = th.number(list[i]);
        if (num != null && num > max) {   
            max = list[i];
        }    
    }
    return max;
};

//取数组中的最小值
Array.prototype.min = function(name) {
	var list = name ? this.fetch(name) : this;
	var min = th.number(list[0]) || list[0];
	for (var i = 1 ; i < list.length; i++){
		var num = th.number(list[i]);
        if (num != null && num < max) {   
            min = list[i];
        }    
    }
    return max;
};

//取数组中平均值
Array.prototype.avg = function(name) {
	var list = name ? this.fetch(name) : this;
	var sum = 0;
	for (var i = 0 ; i < list.length; i++){
		var num = th.number(list[i]) || 0;
		sum += num; 
    }
	var avg = sum/list.length;
    return avg;
};

//扩展Date
/** Adds the number of days array to the Date object. */  
Date._MD = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);   
  
/** Constants used for time computations */  
Date.SECOND = 1000 /* milliseconds */;   
Date.MINUTE = 60 * Date.SECOND;   
Date.HOUR = 60 * Date.MINUTE;   
Date.DAY = 24 * Date.HOUR;   
Date.WEEK = 7 * Date.DAY;   
  
/**  
 * 扩展Date的toString方法用于格式化。测试 var a = new Date(); alert(a.toString("yyyy-MM-dd HH mm ss"));  
 */  
Date.prototype.toString = function() {
    if (arguments.length > 0 ) {   
    	return Date.format(this, arguments[0]);
    } else {   
        return this.toLocaleString();   
    }   
}; 

//格式化日期
Date.format = function(date, format){
	if( $.type(date) == "string" ){
		date = Date.parseDate(date);
	}
	if( !date ){
		return date;
	}
    var str = format;   
    str = str.replace(/yyyy|YYYY/, date.getFullYear());   
    str = str.replace(/yy|YY/, (date.getFullYear() % 100) > 9 ? (date  
            .getFullYear() % 100).toString() : "0"  
            + (date.getFullYear() % 100));   
    str = str.replace(/MM/, date.getMonth() + 1 > 9 ? (date.getMonth() + 1)   
            .toString() : "0" + (date.getMonth() + 1));   
    str = str.replace(/M/g, (date.getMonth() + 1).toString());   
    str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate()   
            .toString() : "0" + date.getDate());   
    str = str.replace(/d|D/g, date.getDate());   
    str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours()   
            .toString() : "0" + date.getHours());   
    str = str.replace(/h|H/g, date.getHours());   
    str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes()   
            .toString() : "0" + date.getMinutes());   
    str = str.replace(/m/g, date.getMinutes());   
    str = str.replace(/ss/, date.getSeconds() > 9 ? date.getSeconds()   
            .toString() : "0" + date.getSeconds());
    var mi = date.getMilliseconds();
    str = str.replace(/SSS/g, mi < 10 ? "00" + mi : (mi < 100 ? "0" + mi : mi) );   
    return str;   
};

//日期格式
Date.formats = {
	8:[/\d{4}\d{2}\d{2}/, /\d{4}-\d-\d/],
	9:[/\d{4}-\d-\d{2}/, /\d{4}-\d{2}-\d/],
    10:[/\d{4}-\d{2}-\d{2}/],
    16:[/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/],
	19:[/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/],
	21:[/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{1,3}/],
	22:[/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{1,3}/],
	23:[/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{1,3}/]
};

//是否是日期格式
Date.isDate = function( value ){
	var length = (value || "").length;
	var formats = Date.formats[length];
	if( !formats ){
		return false;
	}
	for(var i = 0; i < formats.length; i++ ){
		if( formats[i].test(value) ){
			return true;
		}
	}
	return false;
};

//解析日期
Date.parseDate = function( value ){
	if(value == null || value == ""){
		return null;
	}
	if( value instanceof Date ){
		return value;
	}
	if( !Date.isDate(value) ){
		return null;
	}
	try{
		if(value.length == 8){//yyyyMMdd
			if( /\d{4}\d{2}\d{2}/.test(value) ){
				var year = parseInt(value.substring(0,4),10);
				var month = parseInt(value.substring(4,6),10) - 1;
				var date = parseInt(value.substring(6,8),10);
				return new Date(year, month, date, 0, 0, 0);
			}else if( /\d{4}-\d-\d/.test(value) ){//yyyy-M-d
				var year = parseInt(value.substring(0,4),10);
				var month = parseInt(value.substring(5,6),10) - 1;
				var date = parseInt(value.substring(7,8),10);
				return new Date(year, month, date, 0, 0, 0);
			}
		}else if(value.length == 9){
			if( /\d{4}-\d-\d{2}/.test(value) ){//yyyy-M-dd
				var year = parseInt(value.substring(0,4),10);
				var month = parseInt(value.substring(5,6),10) - 1;
				var date = parseInt(value.substring(7,9),10);
				return new Date(year, month, date, 0, 0, 0);
			}else if( /\d{4}-\d{2}-\d/.test(value) ){//yyyy-MM-d
				var year = parseInt(value.substring(0,4),10);
				var month = parseInt(value.substring(5,7),10) - 1;
				var date = parseInt(value.substring(8,9),10);
				return new Date(year, month, date, 0, 0, 0);
			}
		}else if(value.length == 10){//yyyy-MM-dd
			if( /\d{4}-\d{2}-\d{2}/.test(value) ){
				var year = parseInt(value.substring(0,4),10);
				var month = parseInt(value.substring(5,7),10) - 1;
				var date = parseInt(value.substring(8,10),10);
				return new Date(year, month, date, 0, 0, 0);
			}
		}else if(value.length == 19){//yyyy-MM-dd HH:mm:ss
			if( /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(value) ){
				var yyyy = parseInt(value.substring(0,4));
				var MM = parseInt(value.substring(5,7)) - 1;
				var dd = parseInt(value.substring(8,10));
				var HH = parseInt(value.substring(11,13));
				var mm = parseInt(value.substring(14,16));
				var ss = parseInt(value.substring(17,19));
				return new Date(yyyy, MM, dd, HH, mm, ss);
			}
		}else if(value.length == 16){//yyyy-MM-dd HH:mm
			if( /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/.test(value) ){
				var yyyy = parseInt(value.substring(0,4));
				var MM = parseInt(value.substring(5,7)) - 1;
				var dd = parseInt(value.substring(8,10));
				var HH = parseInt(value.substring(11,13));
				var mm = parseInt(value.substring(14,16));
				return new Date(yyyy, MM, dd, HH, mm, 0);
			}
		}else if(value.length >= 20 && value.length <=23 ){//yyyy-MM-dd HH:mm:ss
			if( /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{1,3}/.test(value) ){
				var yyyy = parseInt(value.substring(0,4));
				var MM = parseInt(value.substring(5,7)) - 1;
				var dd = parseInt(value.substring(8,10));
				var HH = parseInt(value.substring(11,13));
				var mm = parseInt(value.substring(14,16));
				var ss = parseInt(value.substring(17,19));
				var SSS = parseInt(value.substring(20));
				return new Date(yyyy, MM, dd, HH, mm, ss, SSS);
			}
		}
	}catch(E){
	}
	return null;
};

//日期差计算
Date.sub = function(d1, d2, type){
	d1 = Date.parseDate(d1);//开始日期
	d2 = Date.parseDate(d2);//截止日期
	if( !d1 || !d2 ){
		return null;
	}
	var result = null;
	var daysub = (function(){
		var DAY = 24*60*60*1000;
		var sub = d1.getTime() - d2.getTime();
		return Math.floor((sub/DAY));
	})();
	var monthsub = (function(){
		var y1 = d1.getFullYear(), y2 = d2.getFullYear();
		var m1 = d1.getMonth(), m2 = d2.getMonth();
		return (y1 - y2)*12 + (m1 -m2);
	})();
	if( type == "m" ){//月
		result = monthsub;
	}else if( type == "y" ){//年
		result = Math.floor(monthsub/12);
	}else{//默认天
		return daysub;
	}
	return result;
};

//当前日期增加天数
Date.prototype.addDay = function( value ){
	var ms = this.getTime();
	return new Date(value*24*60*60*1000 + ms);
};

//当前日期增加月
Date.prototype.addMonth = function( value ){
	var year = this.getFullYear();
	var month = this.getMonth() + value;
	var date = this.getDate();
	return new Date(year, month, date);
};

//当前日期增加年
Date.prototype.addYear = function( value ){
	var year = this.getFullYear();
	var month = this.getMonth();
	var date = this.getDate();
	return new Date(value + year, month, date);
};

//取得年
Date.getYear = function( value ){
	if( value && value.length == 10 ){
		return value.substring(0,4);
	}
};

//取得月
Date.getMonth = function( value ){
	if( value && value.length == 10 ){
		return value.substring(5,7);
	}
};

//取得日
Date.getDay = function( value ){
	if( value && value.length == 10 ){
		return value.substring(8,10);
	}
};

//取得年龄
Date.getAge = function( value ){
	var months = Date.getAgeMonth(value);
	if( months == null ){
		return null;
	}
	var age = Math.floor(months/12);
	return age;
};

//取得月龄
Date.getAgeMonth = function( value ){
	var date = Date.parseDate(value);
	if( date == null ){
		return null;
	}
	var now = window["app"] ? Date.parseDate(app.date) : new Date();
	var year1 = date.getYear(), year2 = now.getYear();
	var month1 = date.getMonth(), month2 = now.getMonth();
	var date1 = date.getDate(), date2 = now.getDate();
	var months = (year2 - year1)*12 + month2 - month1;
	if( date1 > date2 ){
		months = months - 1;
	}
	return months;
};

/**
*作者 ：王文成
*日期:2011-03-07
*Email: wellse@qq.com
*/
var HashMap = function (){
	/** Map 大小 **/
	this.length = 0;
	/** 映射 **/
	this.entry = {};
	
	/** 存 **/
	this.put = function (key , value){
		if(!this.containsKey(key)){
			this.length ++ ;
		}
		this.entry[key] = value;
	};
	
	/** 取 **/
	this.get = function (key){
		return this.containsKey(key) ? this.entry[key] : null;
	};
	
	/** 删除 **/
	this.remove = function ( key ){
		var removedKey = this.entry[key];
		if( this.containsKey(key) && ( delete this.entry[key] ) ){
			this.length --;
		}
		return removedKey ? removedKey : null;
	};
	
	/** 是否包含 Key **/
	this.containsKey = function ( key ){
		return (key in this.entry);
	};
	
	/** 是否包含 Value **/
	this.containsValue = function ( value ){
		for(var prop in this.entry){
			if(this.entry[prop] == value){
				return true;
			}
		}
		return false;
	};
	
	/** 所有 Value **/
	this.values = function (){
		var values = [];
		for(var prop in this.entry){
			values.push(this.entry[prop]);
		}
		return values;
	};
	
	/** 所有 Key **/
	this.keys = function (){
		var keys = [];
		for(var prop in this.entry){
			keys.push(prop);
		}
		return keys;
	};
	
	/** Map Size **/
	this.size = function (){
		return this.length;
	};
	
	/* 清空 */
	this.clear = function (){
		this.length = 0;
		this.entry = {};
	};
};

var HashSet = function (){
	/** Map **/
	this.map = new HashMap();
	
	this.add = function( value ){
		this.map.put( value , {});
	};
	
	/** 删除 **/
	this.remove = function ( value ){
		return this.map.remove(value);
	};
	
	/** 是否包含 value **/
	this.contains = function ( value ){
		return this.map.containsKey(value);
	};
	
	/** 所有 Value **/
	this.values = function (){
		return this.map.keys();
	};

	/** Size **/
	this.size = function (){
		return this.map.size();
	};
	
	/* 清空 */
	this.clear = function (){
		this.map.clear();
	};
};

var ArrayList = function (){
	this.array = [];
	
	this.add = function( value ){
		this.array.push( value );
	};
	
	this.get = function( index ){
		return this.array[index];
	};
	
	/** 删除 **/
	this.remove = function ( index ){
		var removedValue = this.array[index];
		this.array.splice(index , 1);
		return removedValue;
	};
	
	/** 是否包含 value **/
	this.contains = function ( value ){
		for( var i = 0 ; i < this.array.length ; i++ ){
			if( this.array[i] == value ){
				return true;
			}
		}
		return false;
	};
	
	/** Size **/
	this.size = function (){
		return this.array.length;
	};
	
	/* 清空 */
	this.clear = function (){
		this.array = [];
	};
};

var ArrayMap = function (){
	/** Map **/
	this.map = new HashMap();
	
	this.put = function( key , value ){
		if( this.map.containsKey( key ) ){
			this.map.get(key).push(value);
		}else{
			var array = new Array(value);
			this.map.put( key , array );
		}
	};
	
	this.get = function( key ){
		return this.map.get(key);
	};
	
	/** 删除 **/
	this.remove = function ( key ){
		return this.map.remove(key);
	};
	
	/** 是否包含 value **/
	this.contains = function ( key ){
		return this.map.containsKey(key);
	};
	
	/** 所有 Value **/
	this.values = function (){
		var values = this.map.values();
		var allValues = [];
		for( var i = 0 ; i < values.length ; i++ ){
			allValues.concat( values[i] );
		}
		return allValues;
	};

	/** Size **/
	this.size = function (){
		return this.map.size();
	};
	
	/* 清空 */
	this.clear = function (){
		this.map.clear();
	};
};


//自定义List
var $List = Class.extend({
	list : [],
	length : 0,
	init : function( list ){
		var that = this;
		that.list = list || [];
		that.length = that.list.length;
		for( var i = 0; i < that.list.length; i++ ){
			that[i] = that.list[i];//复制数组对象
		}
	},
	attr: function(name, param){
		var that = this;
		if( $.type(param) == "undefined" ){
			var list = [];
			$.each(that.list, function(i, item){
				var data = th.clone(item);
				data.value = data[name];
				list.push(data);
			});
			return list;
		}else if( $.type(param) == "object" ){
			var list = [];
			$.each(that.list, function(i, item){
				var data = th.clone(item);
				if( match(data) ){//数据匹配
					var data = th.clone(item);
					data.value = data[name];
					list.push(data);
				}
			});
			return list;
		}else if( !isNaN(param) ){
			var item = new that.list[param];
			return item ? item[name] : "";
		}
		function match(item){
			for ( var prop in param) {
				if( !param[prop].contains(item[prop]) ){
					return false;
				}
			}
			return true;
		};
	},
	map: function( obj ){
		var that = this;
		var attrs = [];
		for( var i = 0; i < that.list.length; i++ ){
			var item = that.list[i];
			var attr = {};
			for(var name in obj){
				var prop = obj[name];
				attr[prop] = item[name];
			}
			attrs.push(attr);
		}
		return attrs;
	}
	,
	min: function(name){
		return this.list.min(name);
	}
	,
	max: function(name){
		return this.list.max(name);
	}
	,
	avg: function(name, scale){
		return this.list.avg(name);
	}
});

(function(){
	//调试工具
	var DebugClass = Class.extend({
		map : {},
		begin : function( name ){
			var map = this.map;
			if( Debug.enable ){
				map[name] = {begin:new Date().getTime()};
			}
			return this;
		},
		end : function( name ){
			var map = this.map;
			if( Debug.enable && map[name]){
				map[name].end = new Date().getTime();
			}
			return this;
		},
		print : function(){
			var map = this.map;
			if( Debug.enable ){
				for(var name in map){
					var record = map[name];
					if( record.end  && record.begin ){
						var cost = record.end - record.begin;
						console.log(name + " cost " + cost + " ms");
					}
				}
			}
			this.map = {};
		}
	});

	window.Debug = {enable:false, inst:new DebugClass()};

	Debug.create = function(){//创建实例
		return new DebugClass();
	};

	Debug.begin = function( name ){//开始
		this.inst.begin(name);
		return this.inst;
	};
	Debug.end = function( name ){//完成
		this.inst.end(name);
		return this.inst;
	};
	Debug.print = function(){//打印；
		this.inst.print();
	};
})();
