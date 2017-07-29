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
<script type="text/javascript">
$(function(){
	
	 
})
</script>
</head>
<body class="no-skin" >
	<div class="main-content-inner">
		<div class="page-content" style="height: 550px">&nbsp;&nbsp;&nbsp;&nbsp;
			<span style="font-size: 30px;font-family:隶书">欢迎使用多题型在线考试管理系统！</span>
			<div class="col-xs-12">
				<table id="sample-table-1" class="table table-striped table-bordered table-hover">
					<thead>
						<tr>	
							<th colspan="2">服务器信息</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td style="width: 300px">系统名称</td>
							<td>${osname }</td>
						</tr>
						<tr>
							<td>系统版本</td>
							<td>${osversion }</td>
						</tr>
						<tr>
							<td>系统位数</td>
							<td>${osarch }</td>
						</tr>
						<tr>
							<td>HTTP协议版本</td>
							<td>${httpversion }</td>
						</tr>
						<tr>
							<td>网络端口号</td>
							<td>${port }</td>
						</tr>
						<tr>
							<td>IP地址</td>
							<td>${ipaddress }</td>
						</tr>
						<tr>
							<td>主机名</td>
							<td>${localname }</td>
						</tr>
						<tr>
							<td>请求方式</td>
							<td>${method }</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
<%@ include file="../common/common_js.jsp"%>

</body>
</html>