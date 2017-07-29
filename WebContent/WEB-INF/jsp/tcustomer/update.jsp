<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="sf" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ include file="../common/common_css.jsp"%>
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
					<a href="#">客户管理</a>
				</li>
				<li class="active">客户信息管理</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		
		<div class="page-content">
			<div class="row">
				<div class="col-xs-12">
				<!-- PAGE CONTENT BEGINS -->
				<sf:form method="post" modelAttribute="tCustomer" id="addForm" cssClass="form-horizontal" role="form">
					<!-- #section:elements.form -->
					<table style="border-collapse:separate; border-spacing:10px;" >
						<tr >				
							<td width="100"><label>姓名: </label></td>					
							<td>
								<div>
									<sf:input path="name" style="width:258px"  placeholder="姓名"/>
									<sf:errors  path="name"/>
								</div>
							</td>
							<td ><label>电话号码: </label></td>					
							<td>
								<div>
									<sf:input path="phone" style="width:258px"  placeholder="电话号码"/>
									<sf:errors  path="phone"/>
								</div>
							</td>
						</tr>
						<tr >				
							<td width="100"><label>邮箱: </label></td>					
							<td>
								<div>
									<sf:input path="email" style="width:258px"  placeholder="邮箱"/>
									<sf:errors  path="email"/>
								</div>
							</td>
							<td ><label>所属州市: </label></td>					
							<td>
								<div>
									<sf:input path="adress" style="width:258px"  placeholder="所属州市"/>
									<sf:errors  path="adress"/>
								</div>
							</td>
						</tr>
						<tr >				
							<td width="100"><label>客户单位: </label></td>					
							<td>
								<div>
									<sf:input path="company" style="width:258px"  placeholder="客户单位"/>
									<sf:errors  path="company"/>
								</div>
							</td>
							<td ><label>所属部门: </label></td>					
							<td>
								<div>
									<sf:input path="department" style="width:258px"  placeholder="所属部门"/>
									<sf:errors  path="department"/>
								</div>
							</td>
						</tr>
						<tr >				
							<td width="100"><label>所属职务: </label></td>					
							<td>
								<div>
									<sf:input path="duty" style="width:258px"  placeholder="所属职务"/>
									<sf:errors  path="duty"/>
								</div>
							</td>
							<td ><label>单位地址: </label></td>					
							<td>
								<div>
									<sf:input path="companyadress" style="width:258px"  placeholder="单位地址"/>
									<sf:errors  path="companyadress"/>
								</div>
							</td>
						</tr>
						<tr >				
							<td width="100"><label>客户类型: </label></td>					
							<td>
								<div>
									<select path="type" style="width:258px" name="type">
										<option value="${tCustomer.type }">${tCustomer.type }</option>
										<c:forEach items="${TypeList }" var="list" >
											<c:if test="${tCustomer.type ne list }">
												<option value="${list}">${list}</option>
											</c:if>												
										</c:forEach>								
									</select>
									
									
									
									<%-- <sf:input path="type" style="width:258px"  placeholder="客户类型"/>
									<sf:errors  path="type"/> --%>
								</div>
							</td>
							<td ><label>客户负责范围: </label></td>					
							<td>
								<div>
									<select path="jobrange" style="width:258px" name="jobrange">
										<option value="${tCustomer.jobrange }">${tCustomer.jobrange }</option>
										<c:forEach items="${JobRangeList }" var="list" >
											<c:if test="${tCustomer.jobrange ne list }">
												<option value="${list}">${list}</option>
											</c:if>												
										</c:forEach>								
									</select>
								
									<%-- <sf:input path="jobrange" style="width:258px"  placeholder="客户负责范围"/>
									<sf:errors  path="jobrange"/> --%>
								</div>
							</td>
						</tr>
						<tr >				
							<td width="100"><label>回访是否成功: </label></td>					
							<td>
								<div>
									<select path="visitsuccess" style="width:258px" name="visitsuccess">
										<c:forEach items="${VisitSuccessList }" var="list" >
											<c:if test="${tCustomer.visitsuccess eq list.index }">
												<option value="${list.index}">${list.name}</option>
											</c:if>
										</c:forEach>
										<c:forEach items="${VisitSuccessList }" var="list" >
											<c:if test="${tCustomer.visitsuccess ne list.index }">
												<option value="${list.index}">${list.name}</option>
											</c:if>											
										</c:forEach>								
									</select>
										
									<!-- <select path="visitsuccess" style="width:258px" name="visitsuccess">
											<option value="1">成功</option>	
											<option value="2">不成功</option>								
									</select> -->
									<%-- <sf:input path="visitsuccess" style="width:258px"  placeholder="回访是否成功"/>
									<sf:errors  path="visitsuccess"/> --%>
								</div>
							</td>
							<td ><label>客户是否有回馈: </label></td>					
							<td>
								<div>
									<select path="customerfeedback" style="width:258px" name="customerfeedback">
										<c:forEach items="${CustomerFeedbackList }" var="list" >
											<c:if test="${tCustomer.customerfeedback eq list.index }">
												<option value="${list.index}">${list.name}</option>
											</c:if>
											
										</c:forEach>
										<c:forEach items="${CustomerFeedbackList }" var="list" >
											<c:if test="${tCustomer.customerfeedback ne list.index }">
												<option value="${list.index}">${list.name}</option>
											</c:if>
										</c:forEach>								
									</select>
								
									<%-- <sf:input path="customerfeedback" style="width:258px"  placeholder="客户是否有回馈"/>
									<sf:errors  path="customerfeedback"/> --%>
								</div>
							</td>
						</tr>
						<tr>		
							<td width="100"><label> 问卷总平均分: </label></td>
							<td>
								<div>
									<sf:input path="average" style="width:258px" placeholder="问卷总平均分"/>
									<sf:errors  path="average"/>
								</div>
							</td>
							<td ><label>红包类型: </label></td>					
							<td>
								<div>
									<select path="redPacket" style="width:258px" name="redPacket">
										<option value="${tCustomer.redPacket}">${tCustomer.redPacket}</option>
										<c:forEach items="${RedPacketList }" var="list" >
											<c:if test="${tCustomer.redPacket.equals(list.redPacketName) ne true}">
												<option value="${list.redPacketName}">${list.redPacketName}</option>
											</c:if>								
										</c:forEach>								
									</select>
									<%-- <sf:input path="redPacket" style="width:258px"  placeholder="红包类型"/>
									<sf:errors  path="redPacket"/> --%>
								</div>
							</td>
						</tr>	
						
						
						<tr>		
							<td width="100"><label> 回访类型: </label></td>
							<td>
								<div>
									<sf:input path="visittype" style="width:258px" placeholder="回访类型"/>
									<sf:errors  path="visittype"/>
								</div>
							</td>
							<%-- <td ><label>类型时间: </label></td>					
							<td>
								<div>								
									<sf:input path="visittimetype" style="width:258px"  placeholder="类型时间"/>
									<sf:errors  path="visittimetype"/>
								</div>
							</td>
						</tr>	
						
						<tr>		
							<td width="100"><label> 请选择数据记账年限: </label></td>
							<td>
								<div>
									<sf:input path="writedatatime" style="width:258px" placeholder="数据记账年限"/>
									<sf:errors  path="writedatatime"/>
								</div>
							</td> --%>
							<td ><label>备注说明: </label></td>					
							<td>
								<div>								
									<sf:input path="remark" style="width:258px"  placeholder="备注说明"/>
									<sf:errors  path="remark"/>
								</div>
							</td>
						</tr>	
						
						<tr>		
							<td width="100"><label> 信息提供部门: </label></td>
							<td>
								<div>
									<sf:input path="infodepartment" style="width:258px" placeholder="信息提供部门"/>
									<sf:errors  path="infodepartment"/>
								</div>
							</td>
							<td ><label>负责客户经理: </label></td>					
							<td>
								<div>								
									<sf:input path="customermanager" style="width:258px"  placeholder="负责客户经理"/>
									<sf:errors  path="customermanager"/>
								</div>
							</td>
						</tr>	
						
						<tr>		
							<td width="100"><label> 售前有效性: </label></td>
							<td>
								<div>
									<sf:input path="preSales" style="width:258px" placeholder="售前有效性"/>
									<sf:errors  path="preSales"/>
								</div>
							</td>
							<td ><label>售中有效性: </label></td>					
							<td>
								<div>								
									<sf:input path="middleSales" style="width:258px"  placeholder="售中有效性"/>
									<sf:errors  path="middleSales"/>
								</div>
							</td>
						</tr>	
						<tr>		
							<td width="100"><label>售后有效性: </label></td>
							<td>
								<div>
									<sf:input path="afterSales" style="width:258px" placeholder="售后有效性"/>
									<sf:errors  path="afterSales"/>
								</div>
							</td>
							<td ><label>客户的微信id： </label></td>					
							<td>
								<div>								
									<sf:input path="openid" style="width:258px"  placeholder="客户的微信id"/>
									<sf:errors  path="openid"/>
								</div>
							</td>
						</tr>	
						
						
						<tr>		
							<td width="100"><label>类型时间: </label></td>
							<td>
								<div>
									<sf:input path="visittimetype" style="width:258px" placeholder="类型时间"/>
									<sf:errors  path="visittimetype"/>
								</div>
							</td>
							<td ><label>数据记账年限： </label></td>					
							<td>
								<div>								
									<sf:input path="writedatatime" style="width:258px"  placeholder="数据记账年限"/>
									<sf:errors  path="writedatatime"/>
								</div>
							</td>
						</tr>	
						
						
						<tr>		
							<td width="100"><label> 客户状态: </label></td>
							<td>
								<div>
									<select path="status" style="width:258px" name="status">
										<c:forEach items="${StatusList }" var="list" >
											<c:if test="${tCustomer.status eq list.index }">
												<option value="${list.index}">${list.name}</option>
											</c:if>											
										</c:forEach>
										<c:forEach items="${StatusList }" var="list" >
											<c:if test="${tCustomer.status ne list.index }">
												<option value="${list.index}">${list.name}</option>
											</c:if>											
										</c:forEach>								
									</select>
									
									<%-- <sf:input path="status" style="width:258px" placeholder="客户状态"/>
									<sf:errors  path="status"/> --%>
								</div>
							</td>
							
						</tr>
						
															
					</table>
					
					
					
					
					
					
					
					
					
					<%-- <div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 车类型名: </label>
						<div class="col-sm-9">				
							<sf:input path="carTypename" size="30" cssClass="col-xs-10 col-sm-5" placeholder="车类型名"/>
							<sf:errors cssClass="errorContainer" path="carTypename"/>
						</div>
					</div>

					<div class="space-4"></div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 车品牌: </label>
						<div class="col-sm-9">
							<sf:select path="carLogoName"><sf:options items="${CarLogoNameList }"/></sf:select>
						</div>
					</div>
					
					<div class="space-4"></div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 进/出口: </label>
						<div class="col-sm-9">
							<sf:select path="productCountry" tbindex="1">
								<sf:option value="1">国产</sf:option>
								<sf:option value="2">进口</sf:option>
							</sf:select>
						</div>
					</div>
					

					<div class="space-4"></div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> 排量: </label>
						<div class="col-sm-9">
							<sf:input path="centimetres" size="30" cssClass="col-xs-10 col-sm-5" placeholder="排量"/>
							<sf:errors cssClass="errorContainer" path="centimetres"/>
						</div>
					</div>		 --%>
					
<!-- 					<div class="clearfix form-actions">
						<div class="col-md-offset-3 col-md-9">
							<button class="btn btn-info" type="submit">
								<i class="ace-icon fa fa-check bigger-110"></i>
								提交
							</button>
							&nbsp; &nbsp; &nbsp;
							<button class="btn" type="reset">
								<i class="ace-icon fa fa-undo bigger-110"></i>
								重置
							</button>
						</div>
					</div> -->
				</sf:form>
				</div>
			</div><!-- /.row -->
		</div>
	</div>
<%@ include file="../common/common_js.jsp"%>

<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/css/validate/main.css"/>
<script type="text/javascript" src="<%=request.getContextPath() %>/resources/js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resources/js/jquery.validate.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resources/js/core/jquery.cms.validate.js"></script>
<script type="text/javascript">
$(function(){
	$("#addForm").cmsvalidate();
});
</script>

</body>
</html>