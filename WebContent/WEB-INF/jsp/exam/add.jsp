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
<script src="<%=request.getContextPath() %>/resources/uploadPlug/upload.js"></script>
<script>

$('#examDateTemp').datetimepicker({
	timepicker: false,
	format : "Y-m-d",
	lang : 'ch',
	validateOnBlur: false,
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
					<a href="#">考试安排</a>
				</li>
				<li class="active">考试信息</li>
			</ul><!-- /.breadcrumb -->			
		</div>
		
		<div class="page-content">
			<div class="row">
				<div class="col-xs-12">
				<!-- PAGE CONTENT BEGINS -->
				<sf:form method="post" modelAttribute="exam" id="addForm" cssClass="form-horizontal" role="form" enctype="multipart/form-data">
					<!-- #section:elements.form -->
					
					<table style="border-collapse:separate; border-spacing:10px;" >
						<tr >									
							<td width="100"><label>考试编号: </label></td>					
							<td>
								<div>
									<sf:input path="examNo" style="width:258px"  placeholder="考试编号"/>
									<sf:errors  path="examNo"/>
								</div>
							</td>
							<td width="100"><label>考试名称: </label></td>					
							<td>
								<div>
									<sf:input path="examName" style="width:258px"  placeholder="考试名称"/>
									<sf:errors  path="examName"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>单选题数量: </label></td>					
							<td>
								<div>
									<sf:input path="radioNum" style="width:100px"  placeholder="单选题数量"/>
									<span style="font-size: 14px">(题库中总共有${radionumber }道题)</span>
									<sf:errors  path="radioNum"/>
								</div>
							</td>
							<td width="100"><label>单选题分数 :</label></td>
							<td>
								<div>
									<sf:input path="radioScore" style="width:258px"  placeholder="单选题分数"/>
									<sf:errors  path="radioScore"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>多选题数量: </label></td>					
							<td>
								<div>
									<sf:input path="checkNum" style="width:100px"  placeholder="多选题数量"/>
									<span style="font-size: 14px">(题库中总共有${checknumber }道题)</span>
									<sf:errors  path="checkNum"/>
								</div>
							</td>
							<td width="100"><label>多选题分数 :</label></td>
							<td>
								<div>
									<sf:input path="checkScore" style="width:258px"  placeholder="多选题分数"/>
									<sf:errors  path="checkScore"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>判断题数量: </label></td>					
							<td>
								<div>
									<sf:input path="judgeNum" style="width:100px"  placeholder="判断题数量"/>
									<span style="font-size: 14px">(题库中总共有${judgenumber }道题)</span>
									<sf:errors  path="judgeNum"/>
								</div>
							</td>
							<td width="100"><label>判断题分数 :</label></td>
							<td>
								<div>
									<sf:input path="judgeScore" style="width:258px"  placeholder="判断题分数"/>
									<sf:errors  path="judgeScore"/>
								</div>
							</td>
						</tr>
						
						<tr >									
							<td width="100"><label>${essaytype }数量: </label></td>					
							<td>
								<div>
									<sf:input path="essayNum" style="width:100px"  placeholder="${essaytype }数量"/>
									<span style="font-size: 14px">(题库中总共有${essaynumber }道题)</span>
									<sf:errors  path="essayNum"/>
								</div>
							</td>
							<td width="100"><label>${essaytype }分数 :</label></td>
							<td>
								<div>
									<sf:input path="essayScore" style="width:258px"  placeholder="${essaytype }分数"/>
									<sf:errors  path="essayScore"/>
								</div>
							</td>
						</tr>
						<tr >									
							<td width="100"><label>班级: </label></td>
							<td>
								<div>
									<sf:select path="classId" style="width:200px">
										<c:forEach items="${classList }" var="classes">
											<option value="${classes.classId }" <c:if test="${classes.classId == exam.classId}">selected="selected"</c:if>>${classes.className }</option>
										</c:forEach>
									</sf:select>
									<sf:errors  path="classId"/>
								</div>
							</td>
							<td width="100"><label>教室: </label></td>					
							<td>
								<div>
									<sf:select path="roomId" style="width:200px">
										<c:forEach items="${roomList }" var="room">
											<option value="${room.roomId }" <c:if test="${room.roomId eq exam.roomId}">selected="selected"</c:if>>${room.roomName }</option>
										</c:forEach>
									</sf:select>
									<sf:errors  path="roomId"/>
								</div>
							</td>
						</tr>
						
						<tr >
							<td width="100"><label>考试日期: </label></td>					
							<td>
								<div>
									<sf:input path="examDateTemp" readonly="true" style="width:258px"  placeholder="考试时间"/>
									<sf:errors  path="examDateTemp"/>
								</div>
							</td>
							<td width="100"><label>考试时长(分钟): </label></td>					
							<td>
								<div>
									<sf:input path="examTime" style="width:258px"  placeholder="时长"/>
									<sf:errors  path="examTime"/>
								</div>
							</td>
						</tr>
						
						<tr >
							<td width="100"><label>开始时间: </label></td>
							<td>
								<div>
									<sf:input path="start" style="width:258px" placeholder="例：13:00:00"/>
									<sf:errors  path="start"/>
								</div>
							</td>
							<td width="100"><label>结束时间: </label></td>					
							<td>
								<div>
									<sf:input path="end" style="width:258px" placeholder="例：15:00:00"/>
									<sf:errors  path="end"/>
								</div>
							</td>
						</tr>
						
						<tr>
									
							<td width="100"><label>考试状态: </label></td>					
							<td>
								<div>
									<sf:select path="examState" style="width:200px">
										<option value="0" <c:if test="${exam.examState eq 0}">selected="selected"</c:if>>正常</option>
										<option value="1" <c:if test="${exam.examState eq 1}">selected="selected"</c:if>>作废</option>
									</sf:select>
									<sf:errors  path="examState"/>
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

</body>
</html>