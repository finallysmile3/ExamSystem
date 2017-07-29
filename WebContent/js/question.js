 $(function()
{
	 
	init();
	 
	$("input[type='radio']").click(function(){
	//var id = $(this).attr("id");
	//var name = $(this).attr("name");
	var value = $(this).attr("value");
	
	var ary = value.split("_");
	var type = ary[1];
	setQuestionAnswer(ary[0],type,ary[2],ary[3],ary[4]);
	setEffective(ary[0]);
	var aq;
	for(var o in aqList)
	{
		aq = aqList[o];
		for(var i in aq.types)
		{
			if(aq.types[i] == type)
			{
				$("#average_"+aq.type).html(getAverage(aq.type));
				break;
			}
		}
	}
	
	$("#average_0").html(getAverage(0));
	
	});
	
	
});
 
 




function setQuestionAnswer(qRange,qType,qId,aId,aScore)
{
  	var aq;
  	for(var o in aqList)
  	{
  		aq = aqList[o];
  		if(aq.range == qRange && aq.type == qType)
  		{
  			var isIn = false;
  			for(var k in aq.scores)
  			{
  				if(aq.scores[k].qId == qId)
		  		{	
		  			aq.scores[k].aId = aId;
		  			aq.scores[k].aScore = aScore;
		  			isIn = true;
		  			break;
		  		}
  			}
  			if(!isIn)
		  	{
		  		var a = new Object();
		  		a.qId = qId;
		  		a.aId = aId;
		  		a.aScore = aScore;
		  		aq.scores.push(a);
		  	}
  			break;
  		}
  	}
  	
  	
  	
  }
  function getTypesByAverage(type)
  {
  	var aq;
  	for(var o in aqList)
  	{
  		aq = aqList[o];
  		if(aq.type == type)
  		{
  			return aq.types;
  		}
  	}
  }
  function getAverage(type)
  {
  	var aq;
  	var types = new Array();
  	if(type == 0)//计算所有的
  	{
  		for(var k in aqList)
  		{
  			types.push(aqList[k].type);
  		}
  	}
  	else
  	{
  		types = getTypesByAverage(type);
  	}
  	var score = 0;
  	var count = 0;
  	//fujia
  	var ext_count = 0;
  	for(var i in types)
  	{
  		for(var o in aqList)
	  	{
	  		aq = aqList[o];
	  		if(aq.type == types[i])
	  		{
			  	for(var k in aq.scores)
			  	{
			  		if(parseInt(aq.scores[k].aScore) > 0)
			  			score = score + parseInt(aq.scores[k].aScore);
			  		else if(parseInt(aq.scores[k].aScore) < 0)
			  			ext_count -= 1;
			  	}
			  	count = count + parseInt(aq.count);
	  		}
	  	}
  	}
  	var a = count+ext_count<=0?0:Math.round(score/(count+ext_count) * 100) / 100;
  	if(type == 0)
  	{
  	 	totalAverage = a;
  	}
  	else
  	{
  		for(var o in aqList)
		{
		 	if(aqList[o].type == type)
		 	{
		 		aqList[o].average = a;
		 		break;
		 	}
		}
  	}
  	return a;
  }
  
 



 function answerQuestion()
  {
	$("#confirmBtn").css("cursor","default");
  	$("#confirmBtn").attr("href","#");
  	if(confirm("确认所有问题回答完毕?"))
  	{
  		var aqArr = [];
  		var averageArr = [];
  		var feedbackArr = [];
  		var tempArr = [];
  		var aq;
  		for(var o in aqList)
  		{
  			aq = aqList[o];
  			averageArr.push({type:aq.type,average:aq.average});
  			for(var k in aq.scores)
  			{
  				aqArr.push({qId:aq.scores[k].qId,aId:aq.scores[k].aId,aValue:aq.scores[k].aScore});
  			}
  			if(tempArr.indexOf(aq.range) == -1)
  			{
  				var fb = $("#feedback_"+aq.range).val();
  				var ec = $("#effective_"+aq.range).text();
  				 
  				feedbackArr.push({range:aq.range,feedback:fb,effective:ec});
  				tempArr.push(aq.range);
  			}
  		}
  		averageArr.push({type:0,average:totalAverage});
  		
  		$.ajax({
  			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  			url:"tCustomerController/saveOrUpdateQuestionResult.do",
  			data:{
  				answerData:JSON.stringify(aqArr),
  				averageData:JSON.stringify(averageArr),
  				feedbackData:JSON.stringify(feedbackArr)
  			},
  			success:function(res)
  			{
  				var data = JSON.parse(res);
  				if(data.header.code == 200)
  				{
  					window.location.href = "reward.jsp?rewardState="+data.data.rewardState;
  					$("#confirmBtn").css("cursor","hand");
  			  		$("#confirmBtn").attr("href","javascript:answerQuestion();");
  				}
  				else
  				{
  					alert(data.header.message);
  					$("#confirmBtn").css("cursor","hand");
  			  		$("#confirmBtn").attr("href","javascript:answerQuestion();");
  				}
  			},
  			error:function()
  			{
  				alert("请求异常");
  				$("#confirmBtn").css("cursor","hand");
  		  		$("#confirmBtn").attr("href","javascript:answerQuestion();");
  			}
  		});
  	}
  	else
  	{
  		$("#confirmBtn").css("cursor","hand");
  		$("#confirmBtn").attr("href","javascript:answerQuestion();");
  	}
  }
  
