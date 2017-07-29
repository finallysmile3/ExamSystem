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
<script src="<%=request.getContextPath() %>/resources/layer/layer.js"></script>
<script src="<%=request.getContextPath() %>/resources/jquery.datetimepicker.js"></script>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/jquery.datetimepicker.css"/>
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
//             	  window.location.reload();
            	  setTimeout("window.location.reload()",1000);
            	  }
              else if(code == "warn"){
            	  jBox.tip(message);
            	  setTimeout("window.location.reload()",2000);
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
	var iWidth=850; //弹出窗口的宽度;
	var iHeight=450; //弹出窗口的高度;
	var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
	 jBox("get:"+url, { title: "学生",width: iWidth,height: iHeight,submit: myfunc ,
         buttons: { '确定': true ,'关闭': false }}); 
}
function windowOpen1(url)
{
	var openUrl = "";//弹出窗口的url
	var iWidth=850; //弹出窗口的宽度;
	var iHeight=450; //弹出窗口的高度;
	var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
	 jBox("get:"+url, { title: "学生",width: iWidth,height: iHeight,submit: myfunc1 ,
         buttons: { '确定': true ,'关闭': false }}); 
}
function show(id){
	windowOpen('${ctx }/studentController/addOrUpdate/'+id+".do")
}
function change(id){
	windowOpen1('${ctx }/studentController/changeKey/'+id+".do")
}
/* function del(customerId){	
	if(confirm('确认删除？')){
		windowOpen('${ctx }/carType/delete/'+customerId);
		alert("删除成功");
	}
} */
var myfunc = function (v, h, f) {

    if (v== true ){    //选择清空时，返回false.然后清空。
    	var pass = $("#studentPass").val();
    	var login = $("#studentNo").val();
    	if(login == null || login == ''){
    		jBox.tip('学号不能为空！');
    		return false;
    	}
    	var userid = $("input:hidden").val();
    	if(userid == null || userid == ''){
	    	if(pass == null || pass == ''){
	    		jBox.tip('密码不能为空！');
	    		return false;
	    	}
    	}
    	h.find("form").submit();
    }else{
    	var url = "<%=request.getContextPath() %>/studentController/all.do";
    	window.location.href=url;
    }

};
var myfunc1 = function (v, h, f) {

    if (v== true ){    //选择清空时，返回false.然后清空
    	var pass = $("#studentPass").val();
    	var rePass = $("#restudentPass").val();
    	if(pass == null || pass == ''){
    		jBox.tip('密码不能为空！');
    		return false;
    	}
    	if(pass != rePass){
    		jBox.tip('两次密码不一样！');
    		return false;
    	}
    	h.find("form").submit();
    }else{
    	var url = "<%=request.getContextPath() %>/studentController/all.do";
    	window.location.href=url;
    }

};
var submit1 = function (v, h, f) {
    if (v == 'ok')
    {
	   	 var url = '${ctx }/studentController/delete/'+cartypeid+".do";
	   	 xmlhttp.open("GET", url, true);
	     xmlhttp.onreadystatechange = callback1;
	     xmlhttp.send(null);
        }
    return true; //close
};
function del(carTypeId){
	cartypeid = carTypeId;
	jBox.confirm("确定吗？", "确认删除？将删除学生的相关信息", submit1);
		
	}

function showCustomer(id){
	windowOpen('${ctx }/customer/update/'+id)
}
function addQuestion(){
	windowOpen('${ctx }/studentController/addOrUpdate/'+0+'.do')
}
function download(){
	windowOpen('${ctx }/download/downLoad/1450165813296')
}
function importexcel(){
	windowOpen1('${ctx }/import/uploadExcel.do')
}

function forward(){
	var url = "<%=request.getContextPath() %>/department/findAll.do";
	window.location.href = url;
}

$(function(){
   	// 注册点击检索按钮事件函数
   	$("#searchButton").click(function(){
   	   	var userNoValue = $("#userNo").val();
   	   	var userNameValue = $("#userName").val();
   		var userSexValue = $("#userSex").val();
   		var userStateValue = $("#userState").val();
   		var classIdValue = $("#classId").val();
   	   	var user= new Object();
	   	 user.studentNo=userNoValue;
	   	 user.studentName=userNameValue;
	   	 user.studentSex=userSexValue;
	   	 user.studentState=userStateValue;
	   	 user.classId = classIdValue;
   	 	
   	   	var url = "<%=request.getContextPath() %>/studentController/search.do?";
   	 	var json=stringify(user);
	    window.location.href=url+"data="+json;
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
		window.location.reload();
	}
	
}
$(function(){
   	// 注册上传按钮事件函数
   	$("#updateButton").click(function(){
   		$("#form1").submit();
		
//    		$.ajax({
// 			type: "post",
<%-- 			url: "<%=request.getContextPath() %>/roomController/upload.do", --%>
// 			data: $("#form1").serialize(),
// 			success: function(data){
// 				alert("chenggong");
// 			}
// 		});
   	});
   	
   	$("#file1").change(function(){
   		var s=this.value;
   		s=s.substr(s.lastIndexOf('\\')+1);
   		$("#uploadfile1").val(s);
   	});
   	
});
</script>
</head>
<body class="no-skin" >
	<div class="main-content-inner">
		<!-- #section:basics/content.breadcrumbs -->
		<div class="breadcrumbs" id="breadcrumbs">
			<ul class="breadcrumb">
				<li>
					<i class="ace-icon fa fa-home home-icon"></i>
					<a href="#">用户管理</a>
				</li> 
				<li class="active">学生管理</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		<div class="page-content">
	
				学号：<input type="text" name="userNo" id="userNo" value="${userNo}"/>&nbsp;&nbsp;
				姓名：<input type="text" name="userName" id="userName" value="${userName}"/>&nbsp;&nbsp;
				性别：<select id="userSex" name="userSex" style="width:120px">
							<option value="">--选择性别--</option>
							<option value="0" <c:if test="${userSex eq 0}">selected="selected"</c:if>>男</option>
							<option value="1" <c:if test="${userSex eq 1}">selected="selected"</c:if>>女</option>
						</select>&nbsp;&nbsp;
				班级：<select id="classId" style="width:120px">
							<option value="">--选择班级--</option>
							<c:forEach items="${classList }" var="classes">
								<option value="${classes.classId }" <c:if test="${classes.classId == classId}">selected="selected"</c:if>>${classes.className }</option>
							</c:forEach>
						</select>&nbsp;&nbsp;
				学生状态:<select id="userState" name="userState" style="width:120px">
							<option value="">--选择状态--</option>
							<option value="0" <c:if test="${userState eq 0}">selected="selected"</c:if>>在校</option>
							<option value="1" <c:if test="${userState eq 1}">selected="selected"</c:if>>离校</option>
						</select>
	        <img src="<%=request.getContextPath() %>/resources/upload/chaxun.png" id="searchButton" width="60" height="35">	    							
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
										<th>学号</th>
										<th>姓名</th>
										<th>性别</th>
										<th>生日</th>
										<th>电话</th>
										<th>邮箱</th>
										<th>所在班级</th>
										<th>学生状态</th>
										<th>操作</th>
									</tr>
								</thead>

								<tbody>								
									<c:forEach items="${studentList.datas}" var="student">
										<tr>
											<td>${student.studentNo}</td>
											<td>${student.studentName}</td>
											<td>
											<c:if test="${student.studentSex eq 0}">
													<Label>男</Label>
												</c:if>
												<c:if test="${student.studentSex eq 1}">
													<Label>女</Label>
												</c:if>
											</td>
											<td><fmt:formatDate value="${student.studentBirth}"
													pattern="yyyy-MM-dd" /></td>	
											<td>${student.studentPhone}</td>	
											<td>${student.studentEmail }</td>
											<td>${student.className }</td>
											<td>
											<c:if test="${student.studentState eq 0}">
													<Label>在校</Label>
												</c:if>
												<c:if test="${student.studentState eq 1}">
													<Label>离校</Label>
												</c:if>
											</td>
											<td>																							
													<a class="btn btn-xs btn-info" onclick="show('${student.studentId}')" title="编辑">
															<i class="ace-icon fa fa-pencil bigger-120"></i>
													</a>
													
													<a class="btn btn-xs btn-info" onclick="change('${student.studentId}')" title="修改密码">
															<i class="ace-icon fa fa-key bigger-120"></i>
													</a>
														
													<a class="btn btn-xs btn-danger" onclick="del('${student.studentId }')" title="删除">
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
											<a class="btn btn-info fa" onclick="addQuestion()" title="添加学生
											">添加学生</a>
											<a href="<%=request.getContextPath() %>/studentController/all.do" style="color:#FFF;text-decoration:none;" class="btn btn-info fa fa-refresh" title="刷新列表"></a>
<!-- 											<a class="btn btn-info fa" style="margin-left: 30px" onclick="forward()" title="跳转部门页面">查看部门信息</a> -->
											</td>
											<td style="vertical-align: top;">
												 <c:if test="${studentList.total > 0}">
													<jsp:include page="/pager.jsp">
														<jsp:param value="${studentList.total }" name="totalRecord"/>
														<jsp:param value="search.do" name="url"/>
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