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
<script src="<%=request.getContextPath() %>/resources/uploadPlug/upload.js"></script>
<script>

<%-- $(function(){
	
	$("#loginName").blur(function(){
		var login = $("#loginName").val();
		var id = '${user.userId}';
		if(login == null || login == ''){
			layer.tips('工号不能为空！' , '#loginName' , {
				  tips: [3, '#3595CC'],
				  time: 2000
				});
		}else if(isNaN(login) || (login.length > 20)){
			$("#loginName").val("");
			layer.tips('工号只能为20位以内纯数字！' , '#loginName' , {
				  tips: [3, '#3595CC'],
				  time: 2000
				});
		}else{
			var url = "<%=request.getContextPath() %>/userController/checkLogin/"+login+'/'+id+".do";
			$.get(url,function(date){
				var code = date.header.code;
				var message = date.header.message;
				if(code == 500){
					layer.tips(message , '#loginName' , {
						  tips: [3, '#3595CC'],
						  time: 2000
						});
					$("#loginName").val("");
				}
			},"json")
		}
		
	})
});

function check(){
	var login = $("#loginName").val();
	if(login == null || login == ''){
		layer.tips("工号不能为空！" , '#loginName' , {
			  tips: [3, '#3595CC'],
			  time: 2000
			});
		return false;
	}
} --%>

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
					<a href="#">用户管理</a>
				</li>
				<li class="active">个人信息</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		
		<div class="page-content">
			<div class="row">
				<div class="col-xs-12">
				<!-- PAGE CONTENT BEGINS -->
				<sf:form method="post" modelAttribute="user" id="addForm" cssClass="form-horizontal" role="form" enctype="multipart/form-data">
					<!-- #section:elements.form -->
					
					<table style="border-collapse:separate; border-spacing:10px;" >
						<tr >									
							<td width="100"><label>工号: </label></td>					
							<td>
								<div>
									<sf:input path="loginName" style="width:258px"  placeholder="工号" readonly="true"/>
									<sf:errors  path="loginName"/>
								</div>
							</td>
							<td width="100"><label>姓名: </label></td>					
							<td>
								<div>
									<sf:input path="userName" style="width:258px"  placeholder="姓名"/>
									<sf:errors  path="userName"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>性别: </label></td>
							<td>
								<div>
									<sf:select path="userSex" style="width:200px">
										<option value="0" <c:if test="${userSex eq 0}">selected="selected"</c:if>>男</option>
										<option value="1" <c:if test="${userSex eq 1}">selected="selected"</c:if>>女</option>
									</sf:select>
									<sf:errors  path="userSex"/>
								</div>
							</td>
							<td width="100"><label>电话 :</label></td>
							<td>
								<div>
									<sf:input path="userPhone" style="width:258px"  placeholder="电话号码"/>
									<sf:errors  path="userPhone"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>邮箱: </label></td>
							<td>
								<div>
									<sf:input path="userEmail" style="width:258px"  placeholder="邮箱"/>
									<sf:errors  path="userEmail"/>
								</div>
							</td>
							<td width="100"><label>用户描述: </label></td>					
							<td>
								<div>
									<sf:input path="userDetail" style="width:258px"  placeholder="备注"/>
									<sf:errors  path="userDetail"/>
								</div>
							</td>
						</tr>
						
						<tr>
							<td>
								<div>
									<sf:input path="userId" style="width:258px" type="hidden" placeholder="备注"/>
									<sf:errors  path="userId"/>
								</div>
							</td>
						</tr>
						<tr>
							<td colspan="4">
								<center><button class="btn btn-info fa" type="submit" id="button1">修改</button></center>
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