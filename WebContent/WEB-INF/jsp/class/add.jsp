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
					<a href="#">班级管理</a>
				</li>
				<li class="active">班级信息</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		
		<div class="page-content">
			<div class="row">
				<div class="col-xs-12">
				<!-- PAGE CONTENT BEGINS -->
				<sf:form method="post" modelAttribute="classes" id="addForm" cssClass="form-horizontal" role="form" enctype="multipart/form-data">
					<!-- #section:elements.form -->
					
					<table style="border-collapse:separate; border-spacing:10px;" >
						<tr >									
							<td width="100"><label>班级名称: </label></td>					
							<td>
								<div>
									<sf:input path="className" style="width:258px"  placeholder="班级名称"/>
									<sf:errors  path="className"/>
								</div>
							</td>
							<td width="100"><label>入学年份: </label></td>					
							<td>
								<div>
									<sf:input path="classDate" style="width:258px"  placeholder="入学年份"/>
									<sf:errors  path="classDate"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>专业: </label></td>
							<td>
								<div>
									<sf:input path="classMajor" style="width:258px"  placeholder="专业"/>
									<sf:errors  path="classMajor"/>
								</div>
							</td>
						
							<td width="100"><label>班级状态: </label></td>					
							<td>
								<div>
									<sf:select path="classState" style="width:200px">
										<option value="0" <c:if test="${classes.classState eq 0}">selected="selected"</c:if>>未毕业</option>
										<option value="1" <c:if test="${classes.classState eq 1}">selected="selected"</c:if>>毕业</option>
									</sf:select>
									<sf:errors  path="classState"/>
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