<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/admin/page/common/common.jsp" %>
<!DOCTYPE html>
<html>
<head>
<title>主页</title>
</head>
<script type="text/javascript">
	$(function(){
		Page.parse(document);
	});
</script>
<body class="easyui-layout">
<div id="NothPanel" region="north" split="false" border="false" style="height:90px;overflow:hidden; background: #48a0df;" href="${ctx}/page/common/header.html">
</div>
<div id="CenterPanel" region="center" style="overflow:hidden;">
	<div id="Tabs" class="easyui-tabs" fit="true" border="false" data-options="onContextMenu:Tab.onContextMenu">
	</div>
</div>
<div id="LeftPanel" region="west" border="false" style="overflow:hidden;width:220px;" href="${ctx}/page/common/left_menu.html" title="管理目录" iconCls="icon-th-list">
</div>
</body>
</html>