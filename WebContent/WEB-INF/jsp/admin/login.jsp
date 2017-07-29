<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
<jsp:include page="../common/common_login.jsp"></jsp:include>
<script src="<%=request.getContextPath() %>/resources/jquery.js"></script>
<style type="text/css">
body { background: url("<%=request.getContextPath() %>/resources/img/bbb.jpg") }
</style>
<script type="text/javascript">

$(function(){
	
// 	$("#myForm").submit(function(){
// 		var user = $("input[name='user']:checked").val();
<%-- 		var path = "<%=request.getContextPath() %>/loginController/index/"+user+".do"; --%>
// 	    $('#myForm').attr("action", path);
// 	});
	
});

</script>
</head>

<body class="login-layout" <%-- background="<%=request.getContextPath() %>/resources/css/admin/img/backgroud.png" --%>>
	
	<div class="login-container">
		<div class="center">
			<h1>
				<i class="ace-icon fa fa-leaf green"></i>
				<span class="black">在线考试管理系统</span>
				<span class="white" id="id-text2"></span>
			</h1>
			<h4 class="blue" id="id-company-text"></h4>
		</div>

		<div class="space-6"></div>

		<div class="position-relative">
			<div id="login-box" class="login-box visible widget-box no-border">
				<div class="widget-body">
					<div class="widget-main">
						<form method="post" id="myForm" action="">
						<h4 class="header blue lighter bigger">
							<i class="ace-icon fa fa-coffee green"></i>
							请输入您的账号信息
						</h4>

						<div class="space-6"></div>

						
							<fieldset>
								<label class="block clearfix">
									<span class="block input-icon input-icon-right">
										<input type="text" class="form-control" placeholder="用户名"  name="username" value="${name }"/>
										<i class="ace-icon fa fa-user"></i>
									</span>
								</label>

								<label class="block clearfix">
									<span class="block input-icon input-icon-right">
										<input type="password" class="form-control" placeholder="密码"  name="password" value=""/>
										<i class="ace-icon fa fa-lock"></i>
									</span>
								</label>
								
								<label class="block clearfix">
									<span class="block input-icon input-icon-right">
										<input class="form-control" placeholder="验证码" name="checkcode"/>
										<span style="cursor:pointer"> <img src="drawCheckCode.do" onclick="reCheckcode(this)" /></span>
									</span>
								</label>
								
								<span class="block input-icon input-icon-right">
									<input type="radio" id="teacher" name="usert" value="0"><label for="teacher">管理员/教师</label>&nbsp;&nbsp;
									<input type="radio" id="student" name="usert" value="1" checked="checked"><label for="student">学生</label>
								</span>

								<div class="space"></div>

								<div class="clearfix">
									
									<span>${error }</span>
									<button type="submit" class="width-35 pull-right btn btn-sm btn-primary">
										<i class="ace-icon fa fa-key"></i>
										<span class="bigger-110">登录</span>
									</button>
								</div>

								<div class="space-4"></div>
							</fieldset>
						</form>
								
						<div class="navbar-fixed-top align-right">
							<br />
							&nbsp;
							<a id="btn-login-dark" href="#">Dark</a>
							&nbsp;
							<span class="blue">/</span>
							&nbsp;
							<a id="btn-login-blur" href="#">Blur</a>
							&nbsp;
							<span class="blue">/</span>
							&nbsp;
							<a id="btn-login-light" href="#">Light</a>
							&nbsp; &nbsp; &nbsp;
						</div>
					</div>
				</div><!-- /.col -->
			</div><!-- /.row -->
		</div><!-- /.main-content -->
	</div><!-- /.main-container -->

<!-- basic scripts -->

<!--[if !IE]> -->
<script type="text/javascript">
	window.jQuery || document.write("<script src='<%=request.getContextPath() %>/resources/ace/assets/js/jquery.js'>"+"<"+"/script>");
</script>

<!-- <![endif]-->

<!--[if !IE]> -->
<script type="text/javascript">
 window.jQuery || document.write("<script src='<%=request.getContextPath() %>/resources/ace/assets/js/jquery1x.js'>"+"<"+"/script>");
</script>
<!-- <![endif]-->
		<script type="text/javascript">
			if('ontouchstart' in document.documentElement) document.write("<script src='<%=request.getContextPath() %>/resources/assets/js/jquery.mobile.custom.js'>"+"<"+"/script>");
		</script>

		<!-- inline scripts related to this page -->
		<script type="text/javascript">
			jQuery(function($) {
			 $(document).on('click', '.toolbar a[data-target]', function(e) {
				e.preventDefault();
				var target = $(this).data('target');
				$('.widget-box.visible').removeClass('visible');//hide others
				$(target).addClass('visible');//show target
			 });
			});
			
			
			
			//you don't need this, just used for changing background
			jQuery(function($) {
			 $('#btn-login-dark').on('click', function(e) {
				$('body').attr('class', 'login-layout');
				$('#id-text2').attr('class', 'white');
				$('#id-company-text').attr('class', 'blue'); 
				
				e.preventDefault();
			 });
			 $('#btn-login-light').on('click', function(e) {
				$('body').attr('class', 'login-layout light-login');
				$('#id-text2').attr('class', 'grey');
				$('#id-company-text').attr('class', 'blue'); 
				
				e.preventDefault();
			 });
			 $('#btn-login-blur').on('click', function(e) {
				$('body').attr('class', 'login-layout blur-login');
				$('#id-text2').attr('class', 'white');
				$('#id-company-text').attr('class', 'light-blue'); 
				
				e.preventDefault();
			 });
			 
			});
		</script>
		
		<script type="text/javascript">
			function reCheckcode(img) {
				img.src = "drawCheckCode.do?" + Math.random();
			}
		</script>
	</body>
</html>
