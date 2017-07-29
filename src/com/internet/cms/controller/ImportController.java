package com.internet.cms.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.internet.cms.model.ChoiceQuestion;
import com.internet.cms.model.ChoiceQuestionExample;
import com.internet.cms.service.ChoiceQuestionService;
import com.internet.cms.service.IRfidImportService;

@Controller
@RequestMapping("importController")
public class ImportController extends BaseController{
	
	@Autowired
	private IRfidImportService rfidImportService;
	@Autowired
	private ChoiceQuestionService choiceQuestionService;
	/**
	 * 导入选择题
	 * 
	 * @param request
	 * @param response
	 * @throws IllegalStateException
	 * @throws IOException
	 */
	@RequestMapping(method=RequestMethod.POST, value="/importRfid")
    public void importRfid(HttpServletRequest request, HttpServletResponse response) throws IllegalStateException, IOException {
		  MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		  MultipartFile multipartFile = multipartRequest.getFile("file1");
		  String sourceName = multipartFile.getOriginalFilename(); // 原始文件名
		  if(sourceName !=""){
			  String base = request.getSession().getServletContext().getRealPath("/") + "rfid" + File.separator + "uploadedExcel";
			  File file = new File(base);
			  if(!file.exists()){
				  file.mkdirs();
			  }
			  String path=base + File.separator + sourceName;
			   
			  multipartFile.transferTo(new File(path));
			  Map<String, ChoiceQuestion> map = null;
			  try {
				map = rfidImportService.readExcelFile(path);
			  }catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return;
			  }
			  boolean message=importCheck(map);
			  if(message){
				  String url=request.getContextPath();
				   String result= "<script language='javascript'> alert('全部导入成功!');window.location.href='"+url+"/choiceQuestionController/all.do'; </script>";
				  //response.getWriter().print("全部导入成功!");
				   response.getWriter().print(result);
			  }
		  }
		  else{
			  response.getWriter().print("请选择上传文件");
		  }
	}
	
	public boolean importCheck(Map<String,ChoiceQuestion> map){
		boolean result=false;
		try{
		Object s[] = map.keySet().toArray();		
			for(int i = 0; i <map.size(); i++) {	   
				ChoiceQuestion transactons=map.get(s[i]);
					choiceQuestionService.insertSelective(transactons);	
			   }	
			result=true;
			
		}catch(Exception ex)
		{
			result=false;
		}
		return result;
	}
}
