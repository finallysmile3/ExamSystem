var $p = function(){//取得作用域
	var tab = Tab.getCurrentTab();
	return tab;
};

window.Page = {};

//以页面元素为基准，在当前页面中查找匹配的元素
Page.find = function(element, selector){
	var page = $(element).parents("[page='true']").first();
	return $(selector, page);
};

//初始化页面
Page.init = function( $c, action){
	$c.attr("page", true);//设置页面标识，这是一个页面
	if( action ){//如果有对象则绑定
		Page.bindAction($c, action);
		Page.bindModel($c, action);
	}
	var $form = $c.is("form") ? $c : $("form",$c);
	if( $form.exist() ){
		$.initValid($form);
	}
	if( $c.hasClass("easyui-layout")  ){
		$c.attr("fit", $c.attr("fit") || "true");//默认fit=true
		Page.parse($c.parent());
	}else{
		Page.parse($c);
	}
};

//设置当前作用域的Action
Page.bindAction = function($c, action){
	$c.data("action", action);
	$c.attr("data-action", "action");
	Page.bindEvent($c, action);
	if( action.init ){//默认调用初始化的方法
		var params = Page.getParams($c);
		action.init(params);
	}
};

//绑定当前事件 的Action
Page.bindEvent = function($c, action){
	$c.andSelf().find("[data-event]").each(function(){
		var $this = $(this), text = $(this).attr("data-event");
		var events = $.parse(text, action);
		$this.off(".page");
		for( var name in events ){
			var handler = events[name] || $.noop;
			$this.on(name + ".page", {}, handler);
		}
	});
};

//取得页面参数
Page.getParams = function($c){
	var $page = $c.parents("[page-params=true]").first();
	var params = null;//优先级不能改变
	if( $page.exist() ){
		params = $page.data("page-params");
	}
	return params;
};

//数据绑定
Page.bindModel = function($c, action){
	var $service = $c.find("[data-service]").andSelf().filter("[data-service]");
	$service.each(function(){
		var $this = $(this);
		var name = $this.attr("data-name") || "model";
		var service = $this.attr("data-service");
		var serviceName = Service.getServiceName(service);
		var serviceArgs = Service.getServiceArgs(service);
		if( !$.isEmptyObject(serviceArgs) ){
			var text = Service.invoke(service, serviceArgs);
			var data = $.extend(action[name], $.eval(text));
			action[name] = new th.ViewModel($c).bind(data);
		}else{
			var data = action[name] || {};
			action[name] = new th.ViewModel($c).bind(data);
		}
		$this.data("model", action[name]);//保存当前模型到节点
	});
	if( $.type(action.model) == "undefined" ){
		return;
	}
	if( !$service.exist() ){
		var name = $c.attr("data-name") || "model";
		var data = action[name] || {};
		action[name] = new th.ViewModel($c).bind(data);//绑定数据模型
		$c.data("model", action[name]);//保存当前模型到节点
	}
};

/**
 * 刷新当前$c所在的panel,注意panel必须包含href
 * $c panel 里任意元素
 * params 刷新参数
 */
Page.refresh = function($c, params){
	if( $c ) {
		var $page = $c.parents("[page-params=true]").first();
		var panel = $c.parents("div.panel-body").first();
		if( $page.exist() && params ){
			panel.panel("setParams", params);
			$page.data("page-params", params);
		}
		panel.panel("refresh");
	}else{
		Tab.refreshCurrent();
	}
};

//清除
Page.clear = function($c){
	var model = $c.data("model");
	if( model ){
		model.clear();
	}
};

//初始化页面
Page.parse = function( target ){
	$c = $(target);
	$.parser.parse($c, true);
};

//关闭页面,支持dialog和tab
Page.close = function( element ){
	var $dialog = $(element).parents(".dialog-div");
	if( $dialog.length > 0){
		Dialog.close(element,false);
	}else{
		Tab.close();
	}
};

//取得分区区域ID
Page.getPrid = function( $c ){
	var prid = "";
	var $region = $("input[part='true']:first",$c);
	if( $region.exist() ){
		prid = $region.combo("getValue");
	}else{
		prid = $("#PRID",$c).val();
	}
	return prid;
};

/**
 * 返回下个可见的有效输入框
 * target 当前输入框
 * context 作用域
 */
Page.getNextInput = function(target, context){
	var elements = [];
	var inputs = ":text,:password,:button,:file,:checkbox,:radio,select";
	if( !context ){
		context = $();
		if( target.form ){
			context = $(target).parents("form").first();
		}
		if( context.length == 0 ){
			context = $(target).parents(".easyui-tableedit,.panel").first();
		}
	}
	var $list = $(context).find(inputs).not(":hidden").not(":disabled");
	var index = $list.index(target);
	var $next = $list.eq(index + 1);
	return $next.exist() ? $next : null;
};

//回车自动切换到下个输入框
Page.tab = function(target){
	var next = Page.getNextInput(target);
	if( next ){
		next.focus();
	}
};

//页面范围只读
Page.readonly = function($c, readonly){
	if(typeof readonly == "undefined"){
		readonly = true;
	}
	$("[input='true']", $c).readonly(readonly); 
	$(".easyui-table", $c).table("readonly",readonly); 
};

window.Form = {};

//提交表单
Form.doSubmit = function(target){
	var $form = $(target).closest("form").first();
	$form.submit();
};

//提交前动作处理，进行验证
Form.onSubmit = function(){
	return $(this).form("validate");
};

//取得表单参数
Form.getParams = function($c){
	var params = {};
	var array = $('input,select,textarea',$c).serializeArray();
	for(var i = 0 ; i < array.length; i++){
		var pair = array[i];
		if( params[pair.name] ){
			params[pair.name] += "," + pair.value;
		}else{
			params[pair.name] = pair.value;
		}
	}
	return params;
};



//取得查询参数
Form.getQueryParams = function( $form ){
	var getEntry = function( entrys, name){//取得键值对
		for(var i = 0 ; i < entrys.length; i++){
			if( entrys[i]["name"] == name)
				return entrys[i];
		}
		return null;
	};
	var getOperator = function(name){//取得操作符
		return $("#" + name, $form).attr("operator") || "";
	};
	var getCustom = function($form, name){// 自定义查询条件标记
		var custom = $("[id='" + name + "']", $form).attr("custom");
		return custom;
	};
	var entrys = [];
	var inputs = $('input,select,textarea',$form).serializeArray();
	for(var i = 0 ; i < inputs.length; i++){
		var name = inputs[i].name;
		var value = (inputs[i].value || "").trim();
		var entry = getEntry(entrys, name);
		if( entry == null ){
			if( !name.endsWith("_OP")  ){
				entry = {"name":name,"value":value,"op":getOperator(name),"custom":getCustom($form, name)};
				entrys.push(entry);
			}
		}else{
			entry["value"] += "," + value;
			//多个值的情况== 切换为 IN 否则保留原有操作符
			entry["op"] = entry["op"] == "1" ? "15" : entry["op"];
		}
	}
	return $.toJSON(entrys);
};

//设置保存Service
Form.setSaveService = function($form, saveService){
	var state = $form.data('form');
	if( state ){
		var opts = state.options;
		saveService = saveService.replace(/\(.*\)/g,"").trim();
		opts.url = opts.url.replace(/service=.+?\&/g,"service=" + saveService + "&");
		console.debug(opts.url);
	}
};

//取得表单当前状态
Form.getState = function( $c, others ){
	var state = [];
	var ids = others || [];
	var getText = function( input ){
		if( input.is("select") && input.val() ){
			return $("option:selected",input).text();
		}else if( input.data("combobox") || input.data("combotree") ){
			return input.combo("getText");
		}
		return input.val();
	};
	$('input,select,textarea',$c).each(function(){
		var $this = $(this);
		var input = $this.attr("input");
		if( input == "true"){
			var name = $this.attr("id");
			var label = $this.attr("label");
			var value = ($this.attr("value") || "").trim();
			if($this.data("combobox") || $this.data("combotree") ){
				value = $this.combo("getValue");
			}
			state.push({"name":name,"label":label,"value":value,"text":getText($this)});
		}
	});
	for( var i = 0 ; i < ids.length; i++ ){
		var input = $("#" + ids[i], $c);
		var name = input.attr("id");
		var label = input.attr("label") || "";
		var value = (input.val() || "").trim();
		state.push({"name":name,"label":label,"value":value,"text":getText(input)});
	}
	return state;
};

//提交表单
Form.submit = function(event){
	var $dialog = $(this).parents(".dialog-div");
	var $tab = $(this).parents("div[tab=true]");
	if( $dialog.exist() ){
		$dialog.find("form").submit();
	}else if( $dialog.exist() ){
		$tab.find("form").submit();
	}
};

//缺省默认
Form.success = function(){
	$.messager.alert("提示", "保存成功!","info");
};

//加载表单数据
Form.load = function($c, data){
	if( $.type(data) == "object" ){
		for(var name in data){
			var value = data[name];
			var $item = $("#" + name, $c);
			$item.setValue(value)
			$item.attr("data-value", value);
		}
	}
};

window.Tab = {};

//打开TAB
//Tab.open("用户信息查询","/admin/user.jsp", params, true);
Tab.open = function(title, url, params, closable){
	closable = (closable == undefined ? true : closable);
	if( $('#Tabs').tabs('exists',title) ){
		$('#Tabs').tabs('select',title);//存在就选，不存在就新增
	}else{
		$('#Tabs').tabs('add',{title:title, href:url, "closable":closable, "params":params});
	}
};
//关闭TAB
Tab.close = function( title ){
	var tab = $('#Tabs').tabs('getSelected');
	title = title || tab.panel('options').title;
	$('#Tabs').tabs('close',title);
};

//刷新指定Tab
Tab.refresh = function($tab, title){
	var tab = null;
	if( !title ){
		tab = $tab.tabs('getSelected');
	}else{
		tab = $tab.tabs('getTab', title) 
	}
	var opts = tab.panel('options');
	var title = opts.title;
	var params = opts.params || {};
	var url = opts.href;
	Tab.close(title);//关闭当前
	$tab.tabs('add',{title:title, href:url, "closable":true, "params":params});//重新打开
};

//刷新当前Tab
Tab.refreshCurrent = function(){
	var $tab = $('#Tabs');
	var tab = $tab.tabs('getSelected');
	var title = tab.panel('options').title;
	Tab.refresh($tab, title);
};

//取得当前选中Tab的Title
Tab.getSelectedTitle = function(){
	var tab = $('#Tabs').tabs('getSelected');
	return tab.panel('options').title;
};

//取得Tab
Tab.getTab = function( title ){
	var tab = title ? $('#Tabs').tabs('getTab', title) : $('#Tabs').tabs('getSelected');
	return tab;
};

//取得当前TAB
Tab.getCurrentTab = function(){
	var tab = $('#Tabs').tabs('getSelected');
	return tab;
};

//右键菜单
Tab.onContextMenu = function(e, title){
	e.preventDefault();
	var $tabs = $('#Tabs');
	var $menu = Tab.getMenu($tabs);
	$menu.data("title", title);
	$menu.menu('show', {left: e.pageX, top: e.pageY});
};

//点击菜单
Tab.clickMenu = function($tabs, curTitle, action){
	var curTab = $tabs.tabs('getTab', curTitle);
	var alltabs = $tabs.tabs('tabs');
	var optsList = [];
	$.each(alltabs, function(i,tab){
		optsList.push(tab.panel('options'));
	})
	switch (action) {
	    case "close"://关闭
	    	if( curTab.panel('options').closable ){
	    		$tabs.tabs('close', curTitle);
	    	}
	        break;
	    case "close_all"://关闭全部
	        $.each(optsList, function(i, opts) {
	        	if( opts.closable ){
	        		$tabs.tabs('close', opts.title);
	        	}
	        });
	        break;
	    case "close_other"://关闭其他
	    	$.each(optsList, function (i, opts) {
	        	if( curTitle != opts.title && opts.closable){
	        		$tabs.tabs('close', opts.title);
	        	}
	        });
	        break;
	    case "close_right"://关闭右侧
	        var index = $tabs.tabs('getTabIndex', curTab);
	        $.each(optsList, function (i, opts) {
	            if (i > index && opts.closable) {
	            	$tabs.tabs('close', opts.title);
	            }
	        });
	        break;
	    case "close_left"://关闭左侧
	    	var index = $tabs.tabs('getTabIndex', curTab);
	        $.each(optsList, function (i, opts) {
	            if (i < index && opts.closable) {
	            	$tabs.tabs('close', opts.title);
	            }
	        });
	        break;
	    case "exit"://退出
	        break;
	}
};

//取得菜单对象
Tab.getMenu = function($tabs){
	var $menu = $tabs.data("tabs-menu");
	if( !$menu ){
		var html = "";
		html += "<div id='easyui-tabs-menu' class='easyui-menu' style='width:150px;'> \n";
		html += "    <div id='close'>关闭标签</div> \n";
		html += "    <div id='close_other'>关闭其他标签</div> \n";
		html += "    <div class='menu-sep'></div> \n";
		html += "    <div id='close_left'>关闭左侧标签</div> \n";
		html += "    <div id='close_right'>关闭右侧标签</div> \n";
		html += "    <div class='menu-sep'></div> \n";
		html += "    <div id='exit'>退出</div> \n";
		html += "</div> \n";
		$menu = $(html).appendTo($("body")).menu({"onClick":function(item){
			var title = $(this).data("title");
			Tab.clickMenu($tabs, title, item.id);
		}});
		$tabs.data("tabs-menu", $menu);
	}
	return $menu;
}

window.QueryForm = {};

//自定义查询条件
QueryForm.custom = function($table, $form){
	var pageId = $table.attr("pageId");
	$(".addbtn", $form).show().click(function(){
		var options = {title:"请选择查询条件！",modal:true,width:300,height:400,iconCls:'icon-tip',onClose:function(field){
			if( !field ){//未选择字段
				return;
			}
			var fieldId = (field.tableName + "-" + field.colName);
			if( $("#" + fieldId, $form).exist() ){
				$.messager.alert("提示",field.name + " 查询条件已经存在!","info");
			}else{
				Service.invoke("PageService.getFieldHtml",{"id":field.id},function( html ){
					if( html ){
						var $field = $(html);
						var title = field.tableDesc + " - " + field.name;
						$("input,text,select", $field).last().attr("title", title);
						QueryForm.addField($form, $field);
					}
				});
			}
		}};
		Dialog.open(ctx + "/common/fields.jsp",options,{"pageId":pageId});
	});
};

QueryForm.addField = function($form, $field){
	var trs = $(".query-table tr", $form);
	for(var i = 0; i < trs.length; i++ ){
		var tds = $("td:empty", trs[i]);
		if( tds.length >= 3 ){//有可用的空间
			$("td:empty:lt(3)", trs[i]).remove();//删除3个空的TD
			var condition = $field.insertAfter($(".condition:last", trs[i]));//插入到最后一个条件的后面
			QueryForm.initField($form, trs[i]);
			$.parser.parse(condition);
			return;
		}
	}
	var emptys = "<td></td><td></td><td></td><td></td><td></td><td></td><td></td>";
	var $tr = $("<tr></tr>").append($field).append(emptys).appendTo( $(".query-table",$form) );
	QueryForm.initField($form, $tr);
	QueryForm.resize($form, "add");
	$.parser.parse($tr);
	
};

//调整面板大小
QueryForm.resize = function($form, type){
	var $layout = $form.parents(".easyui-layout:first");
	var $north = $layout.layout("panel","north");
	if( type == "add" ){
		$north.panel("resize", {"height":$north.height() + 25} );
		$layout.layout("resize");
	}else if( type == "remove" ){
		var trs = $(".query-table tr", $form);
		for(var i = 0; i < trs.length; i++ ){
			var tds = $("td:not(:empty)", trs[i]);
			if( tds.length == 0 ){//全部是空的
				$(trs[i]).remove();
				$north.panel("resize", {"height":$north.height() - 25} );
				$layout.layout("resize");
				break;
			}
		}
	}
};

//初始化字段
QueryForm.initField = function($form, tr ){
	var td = $(".condition:last", tr);
	$("input,text,select", tr).last().attr("custom", true);
	var $remove = $("<img name='remove' src='/css/global/del.gif' align='absmiddle' class='hand'/>");
	$remove.appendTo(td).click(function(){
		var td = $(this).parent();
		td.add(td.prev()).add(td.prev().prev()).empty().removeClass();
		QueryForm.resize($form, "remove");
	});
};

//备注功能
var Note = {};
Note.handler = function(code, title){
	return function(){
		title = title || "统计说明";
		var url = ctx + "/jsp/admin/note/note_view.jsp?code=" + code;
		var options = {title:title,modal:false,width:640,height:400,'iconCls':'icon-tip',onClose:function(){
		}};
		Dialog.open(url, options);
	};
};