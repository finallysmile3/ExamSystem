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
<script src="<%=request.getContextPath() %>/resources/js/dialog/jquery-1.4.2.min.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/dialog/jquery.jBox-2.3.min.js"></script>
<script src="<%=request.getContextPath() %>/resources/js/dialog/jquery.jBox-zh-CN.js"></script>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/js/dialog/jbox.css" /> 
<script type="text/javascript" src="<%=request.getContextPath() %>/resources/ueditor/ueditor.config.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resources/ueditor/ueditor.all.js"></script>

<script type="text/javascript">
window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;
function onbeforeunload_handler(){
    var warning="确认提交试卷?";
    return warning;
}

function onunload_handler(){
    node = document.getElementById("btnOK");
    node.click();
    $("#form1").submit();
} 

$(function(){
	var m = ${exam.examTime}-1;//传个分钟数到这里
	var s = 59;
	function showtime(){
		node = document.getElementById("btnOK")
		document.getElementById('m').innerHTML = m;
		document.getElementById('s').innerHTML = s;
		s = s-1;
		if(s==0){
			m = m -1;
			s = 60
		}if(m==-1){
			node.click();
		}
	}
	clearInterval(settime); 
	var settime = setInterval(function(){
		showtime();
	},1000);
});
</script>
<style>
.Countdown{ padding-top: 0px; padding-bottom: 0px; font-size:30px; font-family: tahoma,arial,simsun; color: #4A4A4A; text-align:center;}
.Countdown span{ display:inline-block;*display:inline;*zoom:1; width:55px;line-height:55px;text-align:center; background-color:#fff; margin-left:2px;}
.Countdown .bd{ width:16px; background-image:none;}
:root .Countdown span{}
form button { border: 1px solid #f0882c; background: #fb9337; color: #fff; cursor: pointer; padding: 7px 10px; font-weight: bold; }
button { 
	background: #f0801d url(../resources/img/btngrad.png) repeat-x top left; border: 0; padding: 15px 0; text-align: center; 
	font-family: 'RobotoCondensed', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: normal; width: 8%; text-transform: uppercase;  
	-moz-border-radius: 2px; -webkit-border-radius: 2px; border-radius: 2px; -moz-box-shadow: 0 1px 2px rgba(0,0,0,0.4); 
	-webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.4); box-shadow: 0 1px 2px rgba(0,0,0,0.4);
}
</style>
</head>
<body class="no-skin" >
	<div class="main-content-inner">
		<div class="breadcrumbs" id="breadcrumbs">
		<center><span style="font-size: 24px">${exam.examName }</span></center>
		</div>
		<div class="page-content">
		<div class="Countdown" id="time">
		    <h3 align="center">距离考试结束还有</h3>
		    <span id="m"></span><span class="bd">:</span><span id="s"></span>
		</div>
			<div class="row">
				<div class="col-xs-12">
					<!-- PAGE CONTENT BEGINS -->
					<div class="row">
						<div class="col-xs-12">
						
						<form action="" method="post" id="form1" name="form1" onsubmit="">
							<c:if test="${radioList.size() != 0}">
							<div class="clear">
						    	<h4 class="l">单选题（共有：<strong>${radioList.size() }</strong> 题，每小题<strong>${exam.radioScore }</strong>分）</h4>
						  	</div>
							<table id="sample-table-1" class="table table-bg table-striped">
								<c:forEach items="${radioList}" var="question" varStatus="status1">
							      <thead>
							        <tr class="text-l">
							          <th style="font-size: 16px;font-weight:normal">&nbsp;&nbsp;${status1.index + 1}.&nbsp;&nbsp;${question.questionName }</th>
							        </tr>
							      </thead>
							      <tbody>
							        <tr class="text-l">
							          <td>&nbsp;&nbsp;&nbsp;&nbsp;
							          	<input type="radio" name="${question.questionId }" id="optionA${question.questionId }" value="A">
							          	<label for="optionA${question.questionId }">A、${question.questionOptionA }</label>
							          </td>
							         </tr>	
							         
							         <tr class="text-l">
							          <td>&nbsp;&nbsp;&nbsp;&nbsp;
							          	<input type="radio" name="${question.questionId }" id="optionB${question.questionId }" value="B">
							          	<label for="optionB${question.questionId }">B、${question.questionOptionB }</label>
							          </td>
							        </tr>
							        
							        <tr class="text-l">
							          <td>&nbsp;&nbsp;&nbsp;&nbsp;
							          	<input type="radio" name="${question.questionId }" id="optionC${question.questionId }" value="C">
							          	<label for="optionC${question.questionId }">C、${question.questionOptionC }</label>
							          </td>
							        </tr>
							        
							        <tr class="text-l">
							          <td>&nbsp;&nbsp;&nbsp;&nbsp;
							          	<input type="radio" name="${question.questionId }" id="optionD${question.questionId }" value="D">
							          	<label for="optionD${question.questionId }">D、${question.questionOptionD }</label>
							          	<input type="hidden" name="count1" value="${question.questionId}">
							          </td>
							        </tr>
							      </tbody>
							    </c:forEach>
							</table>
							</c:if>
							
							<c:if test="${checkList.size() != 0}">
							<div class="clear">
							  <h4 class="l">多选题（共有：<strong>${checkList.size() }</strong> 题，每小题<strong>${exam.checkScore }</strong>分，错选不得分，漏选得一半）</h4>
							</div>
						    <table class="table table-bg table-striped">
						      <c:forEach items="${checkList}" var="question" varStatus="status2">
						      <thead>
						        <tr class="text-l">
						          <th style="font-size: 16px;font-weight:normal">&nbsp;&nbsp;${ status2.index + 1}.&nbsp;&nbsp;${question.questionName }</th>
						        </tr>
						      </thead>
						      <tbody>
						        <tr class="text-l">
						          <td>&nbsp;&nbsp;&nbsp;&nbsp;
						          	<input type="checkbox" name="${question.questionId }" id="checkA${question.questionId }" value="A">
						          	<label for="checkA${question.questionId }">A、${question.questionOptionA }</label>
						          </td>
						        </tr>
						        
						        <tr class="text-l">
						          <td>&nbsp;&nbsp;&nbsp;&nbsp;
						          	<input type="checkbox" name="${question.questionId }" id="checkB${question.questionId }" value="B">
						          	<label for="checkB${question.questionId }">B、${question.questionOptionB }</label>
						          </td>         
						        </tr>
						        
						        <tr class="text-l">
						          <td>&nbsp;&nbsp;&nbsp;&nbsp;
						          	<input type="checkbox" name="${question.questionId }" id="checkC${question.questionId }" value="C">
						          	<label for="checkC${question.questionId }">C、${question.questionOptionC }</label>
						          </td>
						        </tr>
						        
						        <tr class="text-l">
						          <td>&nbsp;&nbsp;&nbsp;&nbsp;
						          	<input type="checkbox" name="${question.questionId }" id="checkD${question.questionId }" value="D">
						          	<label for="checkD${question.questionId }">D、${question.questionOptionD }</label>
						          	<input type="hidden" name="count2" value="${question.questionId }">
						          </td>       
						        </tr>  
						      </tbody>
						      </c:forEach>
						    </table>
						    </c:if>
						    
						    <c:if test="${judgeList.size() != 0}">
							<div class="clear">
						    	<h4 class="l">判断题（共有：<strong>${judgeList.size() }</strong> 题，每小题<strong>${exam.judgeScore }</strong>分）</h4>
						  	</div>
							<table id="sample-table-1" class="table table-bg table-striped">
								<c:forEach items="${judgeList}" var="question" varStatus="status1">
							      <thead>
							        <tr class="text-l">
							          <th style="font-size: 16px;font-weight:normal">&nbsp;&nbsp;${status1.index + 1}.&nbsp;&nbsp;${question.questionName }</th>
							        </tr>
							      </thead>
							      <tbody>
							        <tr class="text-l">
							          <td>&nbsp;&nbsp;&nbsp;&nbsp;
							          	<input type="radio" name="a${question.questionId }" id="T${question.questionId }" value="T">
							          	<label for="T${question.questionId }">正确</label>&nbsp;&nbsp;&nbsp;&nbsp;
							          	
							          	<input type="radio" name="a${question.questionId }" id="F${question.questionId }" value="F">
							          	<label for="F${question.questionId }">错误</label>
							          	<input type="hidden" name="count3" value="a${question.questionId }">
							          </td>
							        </tr>
							      </tbody>
							    </c:forEach>
							</table>
							</c:if>
							
							<c:if test="${essayList.size() != 0}">
							<div class="clear">
						    	<h4 class="l">${essaytype }（共有：<strong>${essayList.size() }</strong> 题，每小题<strong>${exam.essayScore }</strong>分）</h4>
						  	</div>
							<table id="sample-table-1" class="table table-bg table-striped">
								<c:forEach items="${essayList}" var="question" varStatus="status1">
							      <thead>
							        <tr class="text-l">
							          <th style="font-size: 16px;font-weight:normal">&nbsp;&nbsp;${status1.index + 1}.&nbsp;&nbsp;${question.questionName }</th>
							        </tr>
							      </thead>
							      <tbody>
							        <tr class="text-l">
							          <td>
<%-- 							          	<textarea name="${question.questionId }" id="" style="height:120px;width:50%"></textarea> --%>
							          	<script id="editor${question.questionId }" name="e${question.questionId }" type="text/plain" style="width:1024px;height:500px;"></script>
							          	<input type="hidden" name="count4" value="e${question.questionId }">
							          </td>
							        </tr>
							      </tbody>
							    </c:forEach>
							</table>
							</c:if>
						    <button type="submit" id="btnOK">提交</button>
						</form>
						</div><!-- /.span -->
					</div><!-- /.row -->
				</div><!-- /.col -->
			</div><!-- /.row -->
		</div>
	</div>
<%@ include file="../common/common_js.jsp"%>
<script type="text/javascript">
<c:forEach items="${essayList}" var="question" varStatus="status1">
    var ue = UE.getEditor('editor'+'${question.questionId }');
    
</c:forEach>
</script>
<script src="<%=request.getContextPath() %>/resources/ace/assets/js/jquery.dataTables.js"></script>
<script src="<%=request.getContextPath() %>/resources/ace/assets/js/jquery.dataTables.bootstrap.js"></script>

</body>
</html>