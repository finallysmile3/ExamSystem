<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
<%@ include file="../common/common_css.jsp"%>
<title>多题型在线考试管理系统</title>
</head>
<body class="no-skin">
	<!-- header -->
	<jsp:include page="../common/top.jsp"></jsp:include>
	<div class="main-container" id="main-container">
		<script type="text/javascript">
			try{ace.settings.check('main-container' , 'fixed')}catch(e){}
		</script>
		<jsp:include page="../common/left.jsp"></jsp:include>
		<div class="main-content"><%-- <%=request.getContextPath() %>/home.jsp --%>
		    <iframe name="mainFrame" id="mainFrame" frameborder="0" src="<%=request.getContextPath() %>/userController/customer.do" style="margin:0 auto;width:100%;height:100%;"></iframe>
		</div>
	</div>
	<jsp:include page="../common/foot.jsp"></jsp:include>
	<%@ include file="../common/common_js.jsp"%>
	<script>
	function loginFrame(){
			var mainFrame = document.getElementById("mainFrame");
			var bheight = document.documentElement.clientHeight;
			mainFrame.style.width = '100%';
			mainFrame.style.height = (bheight  - 51) + 'px';
			
		}
		loginFrame();
		window.onresize=function(){  
			loginFrame();
		}
	</script>
</body>
</html>