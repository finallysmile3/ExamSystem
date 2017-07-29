<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="sf" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<%@ include file="../common/common_css.jsp"%>
<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/jquery.datetimepicker.css"/>
<script src="<%=request.getContextPath() %>/resources/jquery.js"></script>
<script src="<%=request.getContextPath() %>/resources/jquery.datetimepicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resources/ueditor/ueditor.config.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resources/ueditor/ueditor.all.js"></script>

</head>
<body class="no-skin">
	<div class="main-content-inner">
		<!-- #section:basics/content.breadcrumbs -->
		<div class="breadcrumbs" id="breadcrumbs">
			<script type="text/javascript">
				try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
			</script>

			<ul class="breadcrumb">
				<li>
					<i class="ace-icon fa fa-home home-icon"></i>
					<a href="#">未批试卷</a>
				</li>
				<li class="active">试卷信息</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		
		<div class="page-content">
			<div class="row">
				<div class="col-xs-12">
				<!-- PAGE CONTENT BEGINS -->
				<sf:form method="post" modelAttribute="score" id="addForm" cssClass="form-horizontal" role="form" enctype="multipart/form-data">
					<!-- #section:elements.form -->
					
					<table style="border-collapse:separate; border-spacing:10px;" >
						<tr >									
							<td width="100"><label>学生姓名: </label></td>					
							<td>
								<div>
									<sf:input path="studentName" style="width:258px"  placeholder=""/>
									<sf:errors  path="studentName"/>
								</div>
							</td>
						</tr>
						
						<tr >
							<td width="100"><label>题目回答情况: </label></td>
							<td colspan="2">
								<div>
<%-- 									<sf:textarea path="essayQuestion" style="height:120px;width:300px;word-break:break-all;word-wrap:break-word;"  placeholder=""/> --%>
									<script id="editor" type="text/plain" style="width:800px;height:500px;"></script>
									<sf:errors  path="essayQuestion"/>
								</div>
							</td>
						</tr>
						
						<tr >
							<td width="100"><label>题目给的分数 :</label></td>
							<td>
								<div>
									<sf:input path="scoreEssay" style="width:258px"  placeholder=""/>
									<sf:errors  path="scoreEssay"/>
								</div>
							</td>
						</tr>
						<tr >
							<td colspan="2" align="center">
								<button type="submit" class="btn btn-info fa" id="btnOK">提交</button>		
							</td>
						</tr>
					</table>	
				</sf:form>
				</div>
			</div><!-- /.row -->
		</div>
	</div>
<%@ include file="../common/common_js.jsp"%>
<script type="text/javascript">
    var ue = UE.getEditor('editor');
    ue.ready(function() {//编辑器初始化完成再赋值  
        ue.setContent('${score.essayQuestion}');  //赋值给UEditor  
    });
</script>

</body>
</html>