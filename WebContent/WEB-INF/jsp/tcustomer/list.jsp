<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ include file="../common/common_css.jsp"%>

<script src="<%=request.getContextPath() %>/resources/js/jquery-1.9.1.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/jquery.ui.dialog.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/ui/jquery.ui.dialog.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/dialog/jquery-1.4.2.min.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/dialog/jquery.jBox-2.3.min.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/dialog/jquery.jBox-zh-CN.js"></script>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/js/dialog/jbox.css" /> 

<script type="text/javascript">

//声明对象实例
var cartypeid = 0;
var xmlhttp = false;
//产生一个XMLHttpRequest对象实例
getHTTPRequestObject();

function getHTTPRequestObject()
{
    try
    {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e)
    {
        try
        {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch(E)
        {
            xmlhttp = false;
        }
    }
    if(!xmlhttp && typeof XMLHttpRequest!= 'undefined')
    {
        xmlhttp = new XMLHttpRequest();
    }
}
function callback1()
{
        if(xmlhttp.readyState == 4) 
        {
            if(xmlhttp.status == 200)
            { 
              // 转换Json数据为javascript对象
              eval("var objResults =" + xmlhttp.responseText);  
              var code=objResults.header.code;
              var message=objResults.header.message;
              if(code==200)
            	  {
            	  jBox.tip("删除成功");   
            	  window.location.reload();
            	  }
              else
            	  {
            	  jBox.tip(message); 
            	  }
            } 
        }
}
//回调处理
function callback()
{
        if(xmlhttp.readyState == 4) 
        {
            if(xmlhttp.status == 200)
            { 
              // 转换Json数据为javascript对象
              eval("var objResults =" + xmlhttp.responseText);            
              var displaytext = "";
              //获取用于显示菜单的下拉列表  
              var displaySelect = document.getElementById("cartypeid");  
              //将目标下拉列表清空  
              displaySelect.innerHTML = null;  
              displaySelect.options.add(new Option('全部',''));
              for (var i=0; i < objResults.data.length; i++)
              {
                /* displaytext += objResults.Results.computer[i].Manufacturer + " " +
                    objResults.Results.computer[i].Model + ": $" + 
                    objResults.Results.computer[i].Price + "<br>";  */
                    displaySelect.options.add(new Option(objResults.data[i].carTypename,objResults.data[i].cartypeid));
              } 
                //var finddiv = document.getElementById("divResponse");//寻找显示容器
                //finddiv.innerHTML = displaytext;//引用解析好了的数据
            } 
        }
}
//触发事件
function onCardlogochanged(carlogoId)
{
    // retrieve the JSON text from the local file.
     var url = "getCartypeByLogoId/"+carlogoId;
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = callback;
    xmlhttp.send(null);
}
function windowOpen(url)
{
	var openUrl = "";//弹出窗口的url
	var iWidth=800; //弹出窗口的宽度;
	var iHeight=700; //弹出窗口的高度;
	var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
	 jBox("get:"+url, { title: "客户",width: iWidth,height: iHeight,submit: myfunc ,
         buttons: { '确定': true ,'关闭': false }}); 
}
function windowOpen1(url)
{
	var openUrl = "";//弹出窗口的url
	var iWidth=300; //弹出窗口的宽度;
	var iHeight=150; //弹出窗口的高度;
	var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
	 jBox("iframe:"+url, { title: "上传",width: iWidth,height: iHeight,submit: myfunc ,
         buttons: {}}); 
}
function show(id){
	//alert(1);
	//this.dialog("option","height","400");
	windowOpen('${ctx }/tCustomerController/update/'+id+".do")
	//window.open('${ctx }/customer/update/'+id,'_blank','width=600px,height=600px',autoIncludeParameters='false')
	//$.dialog({id:'updateProject',title:'修改客户信息',content: 'url:${ctx }/customer/update/'+id,cancelVal: '关闭',cancel: true,width: '900px',height: 500 });
}
/* function del(customerId){	
	if(confirm('确认删除？')){
		windowOpen('${ctx }/carType/delete/'+customerId);
		alert("删除成功");
	}
} */
var myfunc = function (v, h, f) {

    if (v== true ){    //选择清空时，返回false.然后清空。
    	h.find("form").submit();
    }

};
var submit1 = function (v, h, f) {
    if (v == 'ok')
    {
	   	 var url = '${ctx }/tCustomerController/delete/'+cartypeid+".do";
	   	 xmlhttp.open("GET", url, true);
	     xmlhttp.onreadystatechange = callback1;
	     xmlhttp.send(null);
        }
    return true; //close
};
function del(carTypeId){
	cartypeid = carTypeId;
	jBox.confirm("确定吗？", "确认删除？将删除店铺的相关信息", submit1);
		
	}

function showCustomer(id){
	windowOpen('${ctx }/customer/update/'+id)
}
function addTCustomer(){
	windowOpen('${ctx }/tCustomerController/add.do')
}
function download(){
	windowOpen('${ctx }/download/downLoad/1450165813296')
}
function importexcel(){
	windowOpen1('${ctx }/import/uploadExcel.do')
}

$(function(){
   	// 注册点击检索按钮事件函数
   	$("#searchButton").click(function(){
   	   	var nameValue = $("#name").val();
   	   	var phoneValue = $("#phone").val();

   	   	var tCustomer= new Object();
   	 	tCustomer.name=nameValue;
   	 	tCustomer.phone=phoneValue;
   	 	
   	 	
   	   	var url = "<%=request.getContextPath() %>/tCustomerController/selectTCustomer.do?";
   	 	var json=stringify(tCustomer);
	    window.location.href=url+"data="+json;
   	   //	$.get(url, {data :stringify(car)}, function(result){
   	   		
   	   //	});
   	});
   	
    function stringify(json,space)
   	{
   		if(typeof(space)=='undefined')
   		{
   			return JSON.stringify(json);
   		}
   		else
   		{
   			return JSON.stringify(json,undefined,2);
   		}
   	}
});
function loaded()
{
	if (window.parent && !window.parent.closed) {
		window.parent.jBox.close();
	}
	
}
</script>
</head>
<body class="no-skin" onload="loaded()">
	<div class="main-content-inner">
		<!-- #section:basics/content.breadcrumbs -->
		<div class="breadcrumbs" id="breadcrumbs">
			<ul class="breadcrumb">
				<li>
					<i class="ace-icon fa fa-home home-icon"></i>
					<a href="#">客户管理</a>
				</li> 
				<li class="active">客户信息管理</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		<div class="page-content">
	
				客户名：<input type="text" name="name" id="name" value="${name}"/>&nbsp;&nbsp;
				客户电话：<input type="text" name="phone" id="phone" value="${phone}"/>&nbsp;&nbsp;
	                 <img src="<%=request.getContextPath() %>/resources/upload/chaxun.png" onclick=" submit()" id="searchButton" width="60" height="35">
	
	    		<a href="<%=request.getContextPath() %>/download/downLoad/WeiXinTemplet.do">
				<input type="button" name="uploadexcel" value="下载模板" id="downloadexcel"  width="30" height="30"/>
				</a>
				</a>
													
												
				<a onclick="importexcel()">
				<input type="button" name="uploadexcel" value="上传" id="uploadexcel"  width="30" height="30"/>
				</a>
	    
							
	    </div>
		<div class="clear"></div>
		<div class="page-content">
			<div class="row">
				<div class="col-xs-12">
					<!-- PAGE CONTENT BEGINS -->
					<div class="row">
						<div class="col-xs-12">
							<table id="sample-table-1" class="table table-striped table-bordered table-hover">
								<thead>
									<tr>								
										<th>客户名字</th>
										<th>客户电话</th>								
										<th>客户邮箱</th>
										
										<!-- <th>所属州市</th>
										<th>客户单位</th>
										<th>所属部门</th>
										
										
										<th>所属职务</th>
										<th>单位地址</th>
										<th>客户类型</th>
										
										<th>客户负责范围</th>
										<th>回访是否成功</th>
										<th>客户是否有回馈</th>
										
										<th>问卷总平均分</th>
										<th>红包类型</th>
										<th>客户状态</th> -->
										
										<th>操作</th>
									</tr>
								</thead>

								<tbody>								
									<c:forEach items="${listTCustomer.datas}" var="customer">
										<tr>									
											<td>${customer.name }</td>
											<td>${customer.phone }</td>
											<td>${customer.email }</td>		
											
											<%-- <td>${customer.adress }</td>
											<td>${customer.company }</td>
											<td>${customer.department }</td>	
																
											<td>${customer.duty }</td>
											<td>${customer.companyadress }</td>
											<td>${customer.type }</td>	
											
											<td>${customer.jobrange}</td>
											<td>
												<c:if test="${customer.visitsuccess eq 1}">
													<Label>成功</Label>
												</c:if>
												<c:if test="${customer.visitsuccess eq 2}">
													<Label>不成功</Label>
												</c:if>
											</td>
											<td>${customer.visitsuccess }</td>
											<td>${customer.customerfeedback }</td>	
											<td>
												<c:if test="${customer.customerfeedback eq 1}">
													<Label>有反馈</Label>
												</c:if>
												<c:if test="${customer.customerfeedback eq 2}">
													<Label>无反馈</Label>
												</c:if>
											</td>
											
											
											
											<td>${customer.average }</td>						
											<td>${customer.redPacket }</td>						
											<td>
												<c:if test="${customer.status eq 1 }">
													<label>有效</label>
												</c:if>
												<c:if test="${customer.status eq 2 }">
													<label>无效</label>
												</c:if>
											</td>	 --%>					
											<td>																							
													<a class="btn btn-xs btn-info" onclick="show('${customer.id}')" title="编辑">
															<i class="ace-icon fa fa-pencil bigger-120"></i>
													</a>
													
													<a class="btn btn-xs btn-info" href="<%=request.getContextPath() %>/questionAndQuestionResultViewController/selectResult/${customer.id}.do" title="查看详情">
															<i><img src="<%=request.getContextPath() %>/resources/upload/xiangqing.png" width="14" height="14"></img></i>
													</a>
													
													<%-- <a class="btn btn-xs btn-danger" href="delete/${carType.cartypeid }" title="删除"> --%>
														<a class="btn btn-xs btn-danger" onclick="del('${customer.id }')" title="删除">
														<i class="ace-icon fa fa-trash-o bigger-120"></i>
													</a>
																						
											</td>											
										</tr>
									</c:forEach>
										
								</tbody>
							</table>
							<div class="page-header position-relative">
								<table style="width: 100%;">
									<tbody>
										<tr>
											<td style="vertical-align: top;">
											<a class="btn btn-info fa" onclick="addTCustomer()" title="添加客户">+</a>
											<a href="<%=request.getContextPath() %>/tCustomerController/customer.do" style="color:#FFF;text-decoration:none;" class="btn btn-info fa fa-refresh" title="刷新列表"></a>
											</td>
											<td style="vertical-align: top;">
												 <c:if test="${listTCustomer.total > 0}">
													<jsp:include page="/pager.jsp">
														<jsp:param value="${listTCustomer.total }" name="totalRecord"/>
														<jsp:param value="selectTCustomer.do" name="url"/>
													</jsp:include>
												</c:if> 
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div><!-- /.span -->
					</div><!-- /.row -->
				</div><!-- /.col -->
			</div><!-- /.row -->
		</div>
	</div>
<%@ include file="../common/common_js.jsp"%>

<script src="<%=request.getContextPath() %>/resources/ace/assets/js/jquery.dataTables.js"></script>
<script src="<%=request.getContextPath() %>/resources/ace/assets/js/jquery.dataTables.bootstrap.js"></script>

</body>
</html>