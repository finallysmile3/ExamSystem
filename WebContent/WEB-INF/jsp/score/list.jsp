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
<%-- <script src="<%=request.getContextPath() %>/resources/js/dialogc/jquery-1.4.2.min.js"></script> --%>
<%-- <script src="<%=request.getContextPath() %>/resources/js/dialog/jquery.jBox-2.3.min.js"></script> --%>
<%-- <script src="<%=request.getContextPath() %>/resources/js/dialog/jquery.jBox-zh-CN.js"></script> --%>
<%-- <link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/js/dialog/jbox.css" />  --%>
<script type="text/javascript" src="<%=request.getContextPath() %>/resources/ueditor/ueditor.config.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resources/ueditor/ueditor.all.js"></script>

<script type="text/javascript">

// function windowOpen(url)
// {
// 	var openUrl = "";//弹出窗口的url
// 	var iWidth=850; //弹出窗口的宽度;
// 	var iHeight=450; //弹出窗口的高度;
// 	var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
// 	var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
// 	 jBox("get:"+url, { title: "题目",width: iWidth,height: iHeight,submit: myfunc ,
//          buttons: { '确定': true ,'关闭': false }}); 
// }
// function windowOpen1(url)
// {
// 	var openUrl = "";//弹出窗口的url
// 	var iWidth=300; //弹出窗口的宽度;
// 	var iHeight=400; //弹出窗口的高度;
// 	var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
// 	var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
// 	 jBox("iframe:"+url, { title: "题目",width: iWidth,height: iHeight,submit: myfunc ,
//          buttons: {}}); 
// }
// function show(id){
// 	windowOpen('${ctx }/scoreController/addOrUpdate/'+id+".do")
// }
function show(id){
	layer.open({
	  type: 2,
	  title: '批阅试卷',
// 	  maxmin: true,
	  shadeClose: true,
	  shade: 0.8,
	  area: ['100%', '100%'],
	  content: '${ctx }/scoreController/addOrUpdate/'+id+".do"
	});

}
// var myfunc = function (v, h, f) {

//     if (v== true ){    //选择清空时，返回false.然后清空。
//     	h.find("form").submit();
//     }else{
<%--     	var url = "<%=request.getContextPath() %>/scoreController/all.do"; --%>
//     	window.location.href=url;
//     }

// };
// var submit1 = function (v, h, f) {
//     if (v == 'ok')
//     {
// 	   	 var url = '${ctx }/scoreController/delete/'+cartypeid+".do";
// 	   	 xmlhttp.open("GET", url, true);
// 	     xmlhttp.onreadystatechange = callback1;
// 	     xmlhttp.send(null);
//         }
//     return true; //close
// };

// $(function(){
//    	// 注册点击检索按钮事件函数
//    	$("#searchButton").click(function(){
//    	   	var scoreNoValue = $("#examName").val();
//    	   	var scoreNameValue = $("#classId").val();
//    	   	var score= new Object();
// 	   	score.examName=scoreNoValue;
// 	   	score.classId=scoreNameValue;
   	 	
<%--    	   	var url = "<%=request.getContextPath() %>/scoreController/search.do?"; --%>
//    	 	var json=stringify(score);
// 	    window.location.href=url+"data="+json;
//    	});
   	
//     function stringify(json,space)
//    	{
//    		if(typeof(space)=='undefined')
//    		{
//    			return JSON.stringify(json);
//    		}
//    		else
//    		{
//    			return JSON.stringify(json,undefined,2);
//    		}
//    	}
// });
// function loaded()
// {
// 	if (window.parent && !window.parent.closed) {
// 		window.parent.jBox.close();
// 		window.location.reload();
// 	}
	
// }

</script>
</head>
<body class="no-skin" >
	<div class="main-content-inner">
		<!-- #section:basics/content.breadcrumbs -->
		<div class="breadcrumbs" id="breadcrumbs">
			<ul class="breadcrumb">
				<li>
					<i class="ace-icon fa fa-home home-icon"></i>
					<a href="#">考试管理</a>
				</li> 
				<li class="active">未批试卷</li>
			</ul><!-- /.breadcrumb -->
		</div>
		<div class="page-content">
				考试名称：<input type="text" name="examName" id="examName" value="${examName}"/>&nbsp;&nbsp;
				班级：<select id="classId" style="width:120px">
							<option value="">--选择班级--</option>
							<c:forEach items="${classList }" var="classes">
								<option value="${classes.classId }" <c:if test="${classes.classId == classId}">selected="selected"</c:if>>${classes.className }</option>
							</c:forEach>
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
										<th>考试名称</th>
										<th>班级名称</th>															
										<th>学生姓名</th>
										<th>客观题分数</th>
										<th>简答题分数</th>
										<th>批改状态</th>
										<th>总分</th>
										<th>提交时间</th>															
										<th>操作</th>
									</tr>
								</thead>

								<tbody>								
									<c:forEach items="${scoreList.datas}" var="score">
										<tr>
											<td>${score.examName}</td>
											<td>${score.className}</td>
											<td>${score.studentName}</td>
											<td>${score.scoreChoice}</td>	
											<td>${score.scoreEssay}</td>
											<td>
											<c:if test="${score.essayState eq 0}">
													<Label>未批阅</Label>
												</c:if>
												<c:if test="${score.essayState eq 1}">
													<Label>已批阅</Label>
												</c:if>
											</td>
											<td>${score.scoreSum}</td>	
											<td><fmt:formatDate value="${score.submitTime}"
													pattern="yyyy-MM-dd HH:mm:ss" /></td>
											<td>																							
													<a class="btn btn-xs btn-info" onclick="show('${score.scoreId}')" title="批阅">
															<i class="ace-icon fa fa-pencil bigger-120"></i>
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
											<a href="<%=request.getContextPath() %>/scoreController/toread.do" style="color:#FFF;text-decoration:none;" class="btn btn-info fa fa-refresh" title="刷新列表"></a>
<!-- 											<a class="btn btn-info fa" style="margin-left: 30px" onclick="forward()" title="跳转部门页面">查看部门信息</a> -->
											</td>
											<td style="vertical-align: top;">
												 <c:if test="${scoreList.total > 0}">
													<jsp:include page="/pager.jsp">
														<jsp:param value="${scoreList.total }" name="totalRecord"/>
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