<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="sf" uri="http://www.springframework.org/tags/form" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<%@ include file="../common/common_css.jsp"%>
<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/jquery.datetimepicker.css"/>
<script src="<%=request.getContextPath() %>/resources/jquery.js"></script>
<script src="<%=request.getContextPath() %>/resources/jquery.datetimepicker.js"></script>
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
					<a href="#">选择题管理</a>
				</li>
				<li class="active">多选题信息</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		
		<div class="page-content">
			<div class="row">
				<div class="col-xs-12">
				<!-- PAGE CONTENT BEGINS -->
				<sf:form method="post" modelAttribute="choiceQuestion" id="addForm" cssClass="form-horizontal" role="form" enctype="multipart/form-data">
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
							<td width="100"><label>题目类别: </label></td>					
							<td>
								<div>
									<sf:select path="questionType" style="width:200px">
										<option value="1">多选题</option>
									</sf:select>
									<sf:errors  path="questionType"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>题目状态: </label></td>					
							<td>
								<div>
									<sf:select path="questionState" style="width:200px">
										<option value="0" <c:if test="${choiceQuestion.questionState eq 0}">selected="selected"</c:if>>可用</option>
										<option value="1" <c:if test="${choiceQuestion.questionState eq 1}">selected="selected"</c:if>>不可用</option>
									</sf:select>
									<sf:errors  path="questionState"/>
								</div>
							</td>
							<td width="100"><label>选项A :</label></td>
							<td>
								<div>
									<sf:input path="questionOptionA" style="width:258px"  placeholder="选项A"/>
									<sf:errors  path="questionOptionA"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>选项B: </label></td>
							<td>
								<div>
									<sf:input path="questionOptionB" style="width:258px"  placeholder="选项B"/>
									<sf:errors  path="questionOptionB"/>
								</div>
							</td>
							<td width="100"><label>选项C：</label></td>	
							<td>
								<div>
									<sf:input path="questionOptionC" style="width:258px"  placeholder="选项C"/>
									<sf:errors  path="questionOptionC"/>
								</div>
							</td>
						</tr>
						
						<tr >
							<td width="100"><label>选项D: </label></td>					
							<td>
								<div>
									<sf:input path="questionOptionD" style="width:258px"  placeholder="选项D"/>
									<sf:errors  path="questionOptionD"/>
								</div>
							</td>
							
						</tr>
						
						<tr>
							
							<td width="100"><label>正确答案: </label></td>
							<td>
								<div>
									<c:if test="${fn:contains(choiceQuestion.correctOption, 'A') }">
									<sf:checkbox path="correctOption" value="A" checked="checked"/>A&nbsp;&nbsp;
									</c:if>
									<c:if test="${!fn:contains(choiceQuestion.correctOption, 'A') }">
									<sf:checkbox path="correctOption" value="A"/>A&nbsp;&nbsp;
									</c:if>
									
									<c:if test="${fn:contains(choiceQuestion.correctOption, 'B') }">
									<sf:checkbox path="correctOption" value="B" checked="checked"/>B&nbsp;&nbsp;
									</c:if>
									<c:if test="${!fn:contains(choiceQuestion.correctOption, 'B') }">
									<sf:checkbox path="correctOption" value="B"/>B&nbsp;&nbsp;
									</c:if>
									
									<c:if test="${fn:contains(choiceQuestion.correctOption, 'C') }">
									<sf:checkbox path="correctOption" value="C" checked="checked"/>C&nbsp;&nbsp;
									</c:if>
									<c:if test="${!fn:contains(choiceQuestion.correctOption, 'C') }">
									<sf:checkbox path="correctOption" value="C"/>C&nbsp;&nbsp;
									</c:if>
									
									<c:if test="${fn:contains(choiceQuestion.correctOption, 'D') }">
									<sf:checkbox path="correctOption" value="D" checked="checked"/>D
									</c:if>
									<c:if test="${!fn:contains(choiceQuestion.correctOption, 'D') }">
									<sf:checkbox path="correctOption" value="D"/>D
									</c:if>
									<sf:errors  path="correctOption"/>
								</div>
							</td>
							<td width="100"><label>涉及知识点: </label></td>					
							<td>
								<div>
									<sf:select path="pointId" style="width:200px">
										<c:forEach items="${pointList }" var="point">
											<option value="${point.pointId }" <c:if test="${point.pointId eq choiceQuestion.pointId}">selected="selected"</c:if>>${point.pointName }</option>
										</c:forEach>
									</sf:select>
									<sf:errors  path="pointId"/>
								</div>
							</td>
						</tr>
						<tr>
							<td width="100"><label>科目: </label></td>
							<td>
								<div>
									<sf:select path="subjectId" style="width:200px">
										<c:forEach items="${subjectList }" var="subject">
											<option value="${subject.subjectId }" <c:if test="${subject.subjectId eq choiceQuestion.subjectId}">selected="selected"</c:if>>${subject.subjectName }</option>
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