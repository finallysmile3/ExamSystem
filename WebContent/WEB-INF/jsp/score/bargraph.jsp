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
<script src="<%=request.getContextPath() %>/resources/js/echarts.js"></script>
<script type="text/javascript">


$(function(){
   	// 注册点击检索按钮事件函数
   	$("#searchButton").click(function(){
   	   	var scoreNoValue = $("#examId").val();
   	   	var scoreNameValue = $("#classId").val();
   	   	var score= new Object();
	   	score.examId=scoreNoValue;
	   	score.classId=scoreNameValue;
   	 	
   	   	var url = "<%=request.getContextPath() %>/scoreController/tobarso.do?";
   	 	var json=stringify(score);
		$.get(url+"data="+json,function(date){
			var list = date.data.date;
			if(list != null){
				$("#main").html("");
				var name = $("#examId").find("option:selected").text();
				var a = 0;
				var b = 0;
				var c = 0;
				var d = 0;
				var e = 0;
				var f = 0;
				var sum = 0;
				for(var i = 0;i<list.length;i++){
					if(list[i].scoreSum < 50){
						a++;
					}else if(list[i].scoreSum < 60){
						b++;
					}else if(list[i].scoreSum < 85){
						c++;
					}else{
						d++;
					}
					if(list[i].scoreSum < 60){
						f++;
					}
					sum = sum+list[i].scoreSum;
				}
				if(list.length > 0){
					e = sum/list.length;
					name = list[0].examName;
				}
				var myChart = echarts.init(document.getElementById('main'));

		        // 指定图表的配置项和数据
		        var option = {
		            title: {
		                text: name
		            },
		            tooltip: {},
		            xAxis: {
		                data: ["50分以下","50~60分","60~85分","85~100","不及格人数","平均分"]
		            },
		            yAxis: {},
		            series: [{
		                name: '',
		                type: 'bar',
		                data: [a,b,c,d,f,e],
		            	
			            itemStyle: {
			                //通常情况下：
			                normal:{
			                    color: function (params){
			                        var colorList = ['rgb(164,205,238)','rgb(164,205,238)','rgb(164,205,238)','rgb(164,205,238)','rgb(164,205,238)','rgb(42,170,227)'];
			                        return colorList[params.dataIndex];
			                    }
			                }
			            },
		            	
		            }]
		        };

		        // 使用刚指定的配置项和数据显示图表。
		        myChart.setOption(option);
			}
		},"json")
	    
   	});
   	
    function stringify(json,space)
   	{
   		if(typeof(space)=='undefined')
   		{
   			return JSON.stringify(json);
   		}
   		else
   		{
   			return JSON.stringify(json,undefined,2);
   		}
   	}
});


</script>
</head>
<body class="no-skin" >
	<div class="main-content-inner">
		<!-- #section:basics/content.breadcrumbs -->
		<div class="breadcrumbs" id="breadcrumbs">
			<ul class="breadcrumb">
				<li>
					<i class="ace-icon fa fa-home home-icon"></i>
					<a href="#">考试管理</a>
				</li> 
				<li class="active">班级成绩情况</li>
			</ul><!-- /.breadcrumb -->
		</div>
		<div class="page-content">
				考试名称：<select id="examId">
							<c:forEach items="${examList }" var="exam">
								<option value="${exam.examId }" <c:if test="${exam.examId == examId}">selected="selected"</c:if>>${exam.examName }</option>
							</c:forEach>
						</select>&nbsp;&nbsp;
				选择班级：<select id="classId" style="width:120px">
							<c:forEach items="${classList }" var="classes">
								<option value="${classes.classId }" <c:if test="${classes.classId == classId}">selected="selected"</c:if>>${classes.className }</option>
							</c:forEach>
						</select>
	        <img src="<%=request.getContextPath() %>/resources/upload/chaxun.png" id="searchButton" width="60" height="35">	    							
	    </div>
		<div id="main" style="width: 600px;height:400px;"></div>
    <script type="text/javascript">
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '${scoreList[0].examName}'
            },
            tooltip: {},
            xAxis: {
                data: ["50分以下","50~60分","60~85分","85~100","不及格人数","平均分"]
            },
            yAxis: {},
            series: [{
                name: '',
                type: 'bar',
                data: ['${a}','${b}','${c}','${d}','${f}','${e}'],
            	
	            itemStyle: {
	                //通常情况下：
	                normal:{
	                    color: function (params){
	                        var colorList = ['rgb(164,205,238)','rgb(164,205,238)','rgb(164,205,238)','rgb(164,205,238)','rgb(164,205,238)','rgb(42,170,227)'];
	                        return colorList[params.dataIndex];
	                    }
	                }
	            },
            	
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    </script>
	</div>
<%@ include file="../common/common_js.jsp"%>

<script src="<%=request.getContextPath() %>/resources/ace/assets/js/jquery.dataTables.js"></script>
<script src="<%=request.getContextPath() %>/resources/ace/assets/js/jquery.dataTables.bootstrap.js"></script>

</body>
</html>