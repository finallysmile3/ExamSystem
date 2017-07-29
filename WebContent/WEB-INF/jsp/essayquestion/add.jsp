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
<script src="<%=request.getContextPath() %>/resources/uploadPlug/upload.js"></script>
<script>
$('#startTime').datetimepicker({lang:'ch',validateOnBlur: false,});
$('#endTime').datetimepicker({lang:'ch',validateOnBlur: false,});

</script>

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
					<a href="#">简答题管理</a>
				</li>
				<li class="active">简答题信息</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		
		<div class="page-content">
			<div class="row">
				<div class="col-xs-12">
				<!-- PAGE CONTENT BEGINS -->
				<sf:form method="post" modelAttribute="essayQuestion" id="addForm" cssClass="form-horizontal" role="form" enctype="multipart/form-data">
					<!-- #section:elements.form -->
					
					<table style="border-collapse:separate; border-spacing:10px;" >
						<tr >									
							<td width="100"><label>题目名称: </label></td>					
							<td>
								<div>
									<sf:input path="questionName" style="width:258px"  placeholder="题目名称"/>
									<sf:errors  path="questionName"/>
								</div>
							</td>
							<td width="100"><label>题目状态: </label></td>					
							<td>
								<div>
									<sf:select path="questionState" style="width:200px">
										<option value="0" <c:if test="${essayQuestion.questionState eq 0}">selected="selected"</c:if>>可用</option>
										<option value="1" <c:if test="${essayQuestion.questionState eq 1}">selected="selected"</c:if>>不可用</option>
									</sf:select>
									<sf:errors  path="questionState"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>参考答案: </label></td>					
							<td>
								<div>
									<sf:input path="questionAnswer" style="width:258px"  placeholder="参考答案"/>
									<sf:errors  path="questionAnswer"/>
								</div>
							</td>
							<td width="100"><label>涉及知识点 :</label></td>
							<td>
								<div>
									<sf:select path="pointId" style="width:200px">
										<c:forEach items="${pointList }" var="point">
											<option value="${point.pointId }" <c:if test="${point.pointId eq essayQuestion.pointId}">selected="selected"</c:if>>${point.pointName }</option>
										</c:forEach>
									</sf:select>
									<sf:errors  path="pointId"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>科目: </label></td>
							<td>
								<div>
									<sf:select path="subjectId" style="width:200px">
										<c:forEach items="${subjectList }" var="subject">
											<option value="${subject.subjectId }" <c:if test="${subject.subjectId eq essayQuestion.subjectId}">selected="selected"</c:if>>${subject.subjectName }</option>
										</c:forEach>
									</sf:select>
									<sf:errors  path="subjectId"/>
								</div>
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
$(function(){
	$("#addForm").cmsvalidate();
});
</script>

</body>
</html>