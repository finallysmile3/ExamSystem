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
<script src="<%=request.getContextPath() %>/resources/layer/layer.js"></script>
<script src="<%=request.getContextPath() %>/resources/jquery.datetimepicker.js"></script>
<script>
// $('#startTime').datetimepicker({lang:'ch',validateOnBlur: false,});
// $('#endTime').datetimepicker({lang:'ch',validateOnBlur: false,});
$(function() {
	
	$('#birth').datetimepicker({
		timepicker: false,
		format : "Y-m-d",
		lang : 'ch',
 		validateOnBlur: false,
	});
	
	$("#studentPass").blur(function(){
		var pass = $("#studentPass").val();
		//要求6-20位,只能有大小写字母和数字,并且大小写字母和数字都要有
		var reg = /^(?=.*\d)((?=.*[a-z])|(?=.*[A-Z]))[a-zA-Z\d]{6,20}$/;
		var r = pass.match(reg);
		if(r == null){
			$("#studentPass").val("");
			layer.tips('密码必须6-20位,且有字母和数字！' , '#studentPass' , {
				  tips: [3, '#3595CC'],
				  time: 2000
				});
		}
	});
	
	$("#studentNo").blur(function(){
		var login = $("#studentNo").val();
		var id = '${student.studentId}';
		if(login == null || login == ''){
			layer.tips('学号不能为空！' , '#studentNo' , {
				  tips: [3, '#3595CC'],
				  time: 2000
				});
		}else if(isNaN(login) || (login.length > 20)){
			$("#studentNo").val("");
			layer.tips('学号只能为20位以内纯数字！' , '#studentNo' , {
				  tips: [3, '#3595CC'],
				  time: 2000
				});
		}else{
			var url = "<%=request.getContextPath() %>/studentController/checkstudentno/"+login+'/'+id+".do";
			$.get(url,function(date){
				var code = date.header.code;
				var message = date.header.message;
				if(code == 500){
					layer.tips(message , '#studentNo' , {
						  tips: [3, '#3595CC'],
						  time: 2000
						});
					$("#studentNo").val("");
				}
			},"json")
		}
	});
});
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
					<a href="#">学生管理</a>
				</li>
				<li class="active">学生信息</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		
		<div class="page-content">
			<div class="row">
				<div class="col-xs-12">
				<!-- PAGE CONTENT BEGINS -->
				<sf:form method="post" modelAttribute="student" id="addForm" cssClass="form-horizontal" role="form" enctype="multipart/form-data">
					<!-- #section:elements.form -->
					
					<table style="border-collapse:separate; border-spacing:10px;" >
						<tr >									
							<td width="100"><label>学号: </label></td>					
							<td>
								<div>
									<sf:input path="studentNo" style="width:258px"  placeholder="学号"/>
									<sf:errors  path="studentNo"/>
								</div>
							</td>
							<td width="100"><label>姓名: </label></td>					
							<td>
								<div>
									<sf:input path="studentName" style="width:258px"  placeholder="姓名"/>
									<sf:errors  path="studentName"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>性别: </label></td>
							<td>
								<div>
									<sf:select path="studentSex" style="width:200px">
										<option value="0" <c:if test="${studentSex eq 0}">selected="selected"</c:if>>男</option>
										<option value="1" <c:if test="${studentSex eq 1}">selected="selected"</c:if>>女</option>
									</sf:select>
									<sf:errors  path="studentSex"/>
								</div>
							</td>
							<c:if test="${student.studentId eq null || student.studentId eq '' }">
								<td width="100"><label>密码 :</label></td>
								<td>
									<div>
										<sf:input path="studentPass" style="width:258px" type="password" placeholder="密码"/>
										<sf:errors  path="studentPass"/>
									</div>
								</td>
							</c:if>
							<c:if test="${student.studentId != null && student.studentId != ''}">
							<input type="hidden" id="studentPass" value = "coushu123">
							</c:if>
							</tr>
						
							<tr >
							<td width="100"><label>电话 :</label></td>
							<td>
								<div>
									<sf:input path="studentPhone" style="width:258px"  placeholder="电话号码"/>
									<sf:errors  path="studentPhone"/>
								</div>
							</td>
															
							<td width="100"><label>邮箱: </label></td>
							<td>
								<div>
									<sf:input path="studentEmail" style="width:258px"  placeholder="邮箱"/>
									<sf:errors  path="studentEmail"/>
								</div>
							</td>
							</tr>
						
							<tr >
							<td width="100"><label>生日：</label></td>	
							<td>
								<div>
									<sf:input path="birth" style="width:258px" readonly="true" value="${studentBirth }" placeholder="生日"/>
									<sf:errors  path="birth"/>
								</div>
							</td>
						
							<td width="100"><label>所在班级: </label></td>
							<td>
								<div>
									<sf:select path="classId" style="width:200px">
										<c:forEach items="${classList }" var="classes">
											<option value="${classes.classId }" <c:if test="${classes.classId == student.classId}">selected="selected"</c:if>>${classes.className }</option>
										</c:forEach>
									</sf:select>
									<sf:errors  path="classId"/>
								</div>
							</td>
							</tr>
						
							<tr >
							<td width="100"><label>学生状态: </label></td>
							<td>
								<div>
									<sf:select path="studentState" style="width:200px">
										<option value="0" <c:if test="${student.studentState eq 0}">selected="selected"</c:if>>在校</option>
										<option value="1" <c:if test="${student.studentState eq 1}">selected="selected"</c:if>>离校</option>
									</sf:select>
									<sf:errors  path="studentState"/>
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