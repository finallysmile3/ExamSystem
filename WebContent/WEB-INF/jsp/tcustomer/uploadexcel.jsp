<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>上传车型文件</title>
</head>
<body>  
<form action="<%=request.getContextPath() %>/import/uploadExcel.do" method="post" enctype="multipart/form-data">  
<table><tr><td><input type="file" name="Filedata" value="浏览"/></td><td><input type="submit" value="上传" /></td></tr></table></form>  
</body> 
</html>