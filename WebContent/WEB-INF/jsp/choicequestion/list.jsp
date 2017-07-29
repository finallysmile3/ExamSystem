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
<script src="<%=request.getContextPath() %>/resources/js/ui/jquery.ui.dialog.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/dialog/jquery-1.4.2.min.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/dialog/jquery.jBox-2.3.min.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/dialog/jquery.jBox-zh-CN.js"></script>
<%-- <link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/h-ui/css/H-ui.min.css" />  --%>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/js/dialog/jbox.css" /> 
<style>
#upload .btn-upload {
    position: relative;
    display: inline-block;
    height: 35px;
    overflow: hidden;
    vertical-align: middle;
    cursor: pointer;
}
#upload input[type="text"]{
    border-radius: 0 !important;
    color: #858585;
    background-color: #ffffff;
    border: 1px solid #d5d5d5;
    padding: 5px 4px 6px;
    font-size: 12px;
    font-family: inherit;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    -webkit-transition-duration: 0.1s;
    transition-duration: 0.1s;
}
#upload .upload-url {
    cursor: pointer;
    width: 300px;
}
#upload input {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}
#upload a .btn{
    line-height: 21px;
}
#upload .btn-primary {
    color: #fff;
    background-color: #5a98de;
    border-color: #5a98de;
}
#upload .btn {
    display: inline-block;
    box-sizing: border-box;
    cursor: pointer;
    text-align: center;
    font-weight: 400;
    white-space: nowrap;
    vertical-align: middle;
    -moz-padding-start: npx;
    -moz-padding-end: npx;
    border: solid 1px #ddd;
    background-color: #fff;
    width: auto;
    -webkit-transition: background-color .1s linear;
    -moz-transition: background-color .1s linear;
    -o-transition: background-color .1s linear;
    transition: background-color .1s linear;
}
#upload .btn, #upload .btn #upload  .size-M {
    padding: 6px 12px;
}
#upload .input-text, #upload .btn, #upload .input-text.size-M,#upload  .btn.size-M {
    font-size: 12px;
    height: 35px;
    line-height: 1.42857;
    padding: 6px;
}
#upload .btn-primary, #upload .btn-primary:focus {
    background-color: #428bca !important;
    border-color: #428bca;
}
#upload .input-file {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    z-index: 1;
    font-size: 30em;
    opacity: 0;
    filter: alpha(opacity = 0);
}
</style>
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
	 jBox("get:"+url, { title: "选择题",width: iWidth,height: iHeight,submit: myfunc ,
         buttons: { '确定': true ,'关闭': false }}); 
}
function windowOpen1(url)
{
	var openUrl = "";//弹出窗口的url
	var iWidth=300; //弹出窗口的宽度;
	var iHeight=400; //弹出窗口的高度;
	var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
	 jBox("iframe:"+url, { title: "选择题",width: iWidth,height: iHeight,submit: myfunc ,
         buttons: {}}); 
}
function show(id){
	windowOpen('${ctx }/choiceQuestionController/addOrUpdate/'+id+".do")
}
function show1(id){
	windowOpen('${ctx }/choiceQuestionController/addOrUpdate1/'+id+".do")
}

var myfunc = function (v, h, f) {

    if (v== true ){    //选择清空时，返回false.然后清空。
    	h.find("form").submit();
    }else{
    	var url = "<%=request.getContextPath() %>/choiceQuestionController/all.do";
    	window.location.href=url;
    }

};
var submit1 = function (v, h, f) {
    if (v == 'ok')
    {
	   	 var url = '${ctx }/choiceQuestionController/delete/'+cartypeid+".do";
	   	 xmlhttp.open("GET", url, true);
	     xmlhttp.onreadystatechange = callback1;
	     xmlhttp.send(null);
        }
    return true; //close
};
function del(carTypeId){
	cartypeid = carTypeId;
	jBox.confirm("确定吗？", "确认删除？将删除题目的相关信息", submit1);
		
	}

function showCustomer(id){
	windowOpen('${ctx }/customer/update/'+id)
}
function addQuestion(){
	windowOpen('${ctx }/choiceQuestionController/addOrUpdate/'+0+'.do')
}
function addQuestion1(){
	windowOpen('${ctx }/choiceQuestionController/addOrUpdate1/'+0+'.do')
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
   	   	var choiceQuestionNamevalue = $("#choiceQuestionName").val();
   	   	var choiceQuestionTypevalue = $("#choiceQuestionType").val();
   		var choiceQuestionStatevalue = $("#choiceQuestionState").val();
   		var subjectIdvalue = $("#subjectId").val();
   	   	var choiceQuestion= new Object();
	   	choiceQuestion.questionName=choiceQuestionNamevalue;
	   	choiceQuestion.questionType=choiceQuestionTypevalue;
	   	choiceQuestion.questionState=choiceQuestionStatevalue;
	   	choiceQuestion.subjectId=subjectIdvalue;
   	 	
   	   	var url = "<%=request.getContextPath() %>/choiceQuestionController/search.do?";
   	 	var json=stringify(choiceQuestion);
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
function upload(){
	var filename = $("#file1").val();
	if(filename != null && filename != ""){
		if(!/\.(xls|xlsx)$/.test(filename))
	    {
	      alert("文件类型必须是excel表格,请重新上传！");
	      $("#file1").val("");
	      $("#uploadfile1").val("");
	      return false;
	    }
		return true;
	}
	alert("请选择上传的文件！");
	return false;
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
					<a href="#">内容管理</a>
				</li> 
				<li class="active">选择题管理</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		<div class="page-content">
				题目名称：<input type="text" name="choiceQuestionName" id="choiceQuestionName" value="${questionName}"/>&nbsp;&nbsp;
				题目类型：<select id="choiceQuestionType" name="choiceQuestionType" style="140px">
							<option value="">--选择类型--</option>
							<option value="0" <c:if test="${questionType eq 0}">selected="selected"</c:if>>单选题</option>
							<option value="1" <c:if test="${questionType eq 1}">selected="selected"</c:if>>多选题</option>
						</select>&nbsp;&nbsp;
				题目状态:<select id="choiceQuestionState" name="choiceQuestionState" style="140px">
							<option value="">--选择状态--</option>
							<option value="0" <c:if test="${questionState eq 0}">selected="selected"</c:if>>可用</option>
							<option value="1" <c:if test="${questionState eq 1}">selected="selected"</c:if>>不可用</option>
						</select>&nbsp;&nbsp;
				科目:<select id="subjectId" name="subjectId" style="140px">
					<option value="">--选择科目--</option>
					<c:forEach items="${subjectList }" var="subject">
						<option value="${subject.subjectId }" <c:if test="${subject.subjectId eq subjectId}">selected="selected"</c:if>>${subject.subjectName }</option>
					</c:forEach>
				</select>
	        <img src="<%=request.getContextPath() %>/resources/upload/chaxun.png" id="searchButton" width="60" height="35"><br><br>
	        <form id="myform" method="post" action="<%=request.getContextPath()%>/importController/importRfid.do" onsubmit="return upload()" enctype="multipart/form-data">
				<table id="upload">
				 <tr>
				 <td><a class="btn btn-info fa" href="<%=request.getContextPath()%>/download/downLoadm/rfid.do"
												 class="btn btn-info fa fa-refresh">下载模板</a>&nbsp;&nbsp;</td>
				  <td>
				   <span class="btn-upload">
						<input class="input-text upload-url" type="text" name="uploadfile1" id="uploadfile1" style="width:200px">
						<a href="javascript:void();" class="btn btn-primary upload-btn">浏览文件</a>
						<input type="file" id="file1" name="file1" class="input-file">&nbsp;&nbsp;
				</span>
			  </td>
			  <td>
			   <button type="submit" id="ruButton" class="btn btn-info fa" title="导入">文件导入</button>
			  </td>
			 </tr>
			</table>
			</form>    							
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
										<th style="width: 565px">题目名称</th>
										<th>题目类别</th>
										<th>正确答案</th>
										<th>涉及知识点</th>
										<th>科目</th>
										<th>题目状态</th>
										<th style="width: 81px">操作</th>
									</tr>
								</thead>

								<tbody>								
									<c:forEach items="${choiceQuestionList.datas}" var="choiceQuestion">
										<tr>
											<td>${choiceQuestion.questionName}</td>
											<td>
											<c:if test="${choiceQuestion.questionType eq 0}">
													<Label>单选题</Label>
												</c:if>
												<c:if test="${choiceQuestion.questionType eq 1}">
													<Label>多选题</Label>
												</c:if>
											</td>
											<td>${choiceQuestion.correctOption}</td>
											<td>${choiceQuestion.pointName}</td>
											<td>${choiceQuestion.subjectName}</td>
											<td>
											<c:if test="${choiceQuestion.questionState eq 0}">
													<Label>可用</Label>
												</c:if>
												<c:if test="${choiceQuestion.questionState eq 1}">
													<Label>不可用</Label>
												</c:if>											
											</td>
											<td>
												<c:if test="${choiceQuestion.questionType eq 0 }">
													<a class="btn btn-xs btn-info" onclick="show('${choiceQuestion.questionId}')" title="编辑">
															<i class="ace-icon fa fa-pencil bigger-120"></i>
													</a>
												</c:if>
												<c:if test="${choiceQuestion.questionType eq 1 }">
													<a class="btn btn-xs btn-info" onclick="show1('${choiceQuestion.questionId}')" title="编辑">
															<i class="ace-icon fa fa-pencil bigger-120"></i>
													</a>
												</c:if>
													<a class="btn btn-xs btn-danger" onclick="del('${choiceQuestion.questionId }')" title="删除">
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
											<a class="btn btn-info fa" onclick="addQuestion()" title="添加单选题
											">添加单选题</a>
											<a class="btn btn-info fa" onclick="addQuestion1()" title="添加多选题
											">添加多选题</a>
											<a href="<%=request.getContextPath() %>/choiceQuestionController/all.do" style="color:#FFF;text-decoration:none;" class="btn btn-info fa fa-refresh" title="刷新列表"></a>
<!-- 											<a class="btn btn-info fa" style="margin-left: 30px" onclick="forward()" title="跳转部门页面">查看部门信息</a> -->
											</td>
											<td style="vertical-align: top;">
												 <c:if test="${choiceQuestionList.total > 0}">
													<jsp:include page="/pager.jsp">
														<jsp:param value="${choiceQuestionList.total }" name="totalRecord"/>
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