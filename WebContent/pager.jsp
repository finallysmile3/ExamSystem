<%@page import="com.internet.cms.page.SystemContext"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="pg" uri="http://jsptags.com/tags/navigation/pager" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<pg:pager export="curPage=pageNumber" 
	items="${param.totalRecord }" 
	maxPageItems="<%=SystemContext.getPageSize() %>"
	url="${param.url }">
	<pg:param name="title" value="${param.mytitle}"/>
		<c:forEach items="${param.params }" var="p">
			<pg:param name="${p}" value="${p}"/>
		</c:forEach>
		
<div class="dataTables_paginate paging_simple_numbers" id="sample-table-2_paginate">
	
		<ul class="pagination">
			<li>
				<a>共<pg:last><font color="red">${pageNumber }</font> 页</a>
				<a>每页显示<font color="red"><%=SystemContext.getPageSize() %></font>条</pg:last></a>
			</li>
			
			
			<pg:first>
				<li>
					<a href="${pageUrl }">首页</a>
				</li>
			</pg:first>
			<pg:prev>
				<li>
					<a href="${pageUrl }">上一页</a>
				</li>
			</pg:prev>
			
			<pg:pages>
				<c:if test="${curPage eq pageNumber }">
					<li><a><font color="red">${pageNumber } </font></a></li>
				</c:if>
				<c:if test="${curPage != pageNumber }">
					<li><a href="${pageUrl }">${pageNumber }</a></li>
				</c:if>
			</pg:pages>
			
			<pg:next>
				<li>
					<a href="${pageUrl }">下一页</a>
				</li>
			</pg:next>
			<pg:last>
				<li>
					<a href="${pageUrl }">尾页</a>
				</li>
			</pg:last>
			
			<li>
				<a>共<font color="red">${param.totalRecord }</font>条记录</a>
			</li>
		</ul>
	</div>
</pg:pager>