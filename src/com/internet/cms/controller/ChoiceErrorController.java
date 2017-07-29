package com.internet.cms.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.internet.cms.model.ChoiceError;
import com.internet.cms.model.ChoiceErrorExample;
import com.internet.cms.model.Student;
import com.internet.cms.model.StudentExample;
import com.internet.cms.model.Subject;
import com.internet.cms.model.SubjectExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.ChoiceErrorService;
import com.internet.cms.service.StudentService;
import com.internet.cms.service.SubjectService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("choiceErrorController")
public class ChoiceErrorController extends BaseController{
	
	private ChoiceError choiceErrorStatic = new ChoiceError();
	private ChoiceErrorExample choiceErrorExample = new ChoiceErrorExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	@Autowired
	private ChoiceErrorService choiceErrorService;
	
	@Autowired
	private SubjectService subjectService;
	private SubjectExample subjectExample = new SubjectExample();
	@Autowired
	private StudentService studentService;
	private StudentExample studentExample = new StudentExample();
	
	@RequestMapping(value="all" , method = RequestMethod.GET)
	public String getAll(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		//获取当前登录的学生
		Student student = new Student();
		String studentNo = (String)session.getAttribute("username");
		if(studentNo != null && studentNo.length() > 0){
			studentExample.clear();
			studentExample.setPageSize(Integer.MAX_VALUE);
			studentExample.setPageNumber(0);
			studentExample.createCriteria().andStudentNoEqualTo(studentNo);
			List<Student> userList = studentService.selectByExample(studentExample);
			student = userList.get(0);
		}
		choiceErrorStatic = null;
		choiceErrorExample.clear();
		choiceErrorExample.setPageSize(SystemContext.getPageSize());
		choiceErrorExample.setPageNumber(SystemContext.getPageOffset());
		choiceErrorExample.createCriteria().andStudentIdEqualTo(student.getStudentId());
		int count = choiceErrorService.countByExample(choiceErrorExample);
		List<ChoiceError> listChoiceError = choiceErrorService.selectByExample(choiceErrorExample);
		Pager<ChoiceError> choiceErrorList = new Pager<ChoiceError>(count,listChoiceError);
		subjectExample.clear();
		subjectExample.setPageNumber(0);
		subjectExample.setPageSize(Integer.MAX_VALUE);
		subjectExample.createCriteria().andSubjectStateEqualTo(0);
		List<Subject> subjectList = subjectService.selectByExample(subjectExample);
		model.addAttribute("subjectList", subjectList);
		model.addAttribute("choiceErrorList", choiceErrorList);
		return "choiceError/list";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateChoiceError(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ChoiceError choiceError = new ChoiceError();
		if(id > 0){
			choiceError = choiceErrorService.selectByPrimaryKey(id);
		}
		model.addAttribute("choiceError", choiceError);
		return "choiceError/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateChoiceErrorPost(@PathVariable("id") int id,Model model,@Valid ChoiceError ChoiceError,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		
		return "redirect://choiceErrorController/all.do";
	}
	
	
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteChoiceError(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		if(id > 0){
			choiceErrorService.deleteByPrimaryKey(id);
			ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
		} else {
			ajaxMsg.addHeader(MsgType.ERROR, "该题目信息有误,不能删除");
		}
		return ajaxMsg;
	}
	
	@RequestMapping(value = "search" , method = RequestMethod.GET)
	public String selectChoiceError(HttpServletRequest request,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		//获取当前登录的学生
		Student student = new Student();
		String studentNo = (String)session.getAttribute("username");
		if(studentNo != null && studentNo.length() > 0){
			studentExample.clear();
			studentExample.setPageSize(Integer.MAX_VALUE);
			studentExample.setPageNumber(0);
			studentExample.createCriteria().andStudentNoEqualTo(studentNo);
			List<Student> userList = studentService.selectByExample(studentExample);
			student = userList.get(0);
		}
		try {
			Map<String, Object> params = FrontHelper.transfParams(request);
			choiceErrorExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				ChoiceError ChoiceErrorRequest = (ChoiceError) JsonUtilTool.json2Object(data, ChoiceError.class);
				choiceErrorStatic = ChoiceErrorRequest;
				if (ChoiceErrorRequest != null) {
					String setting = Kit.ISOToUTF8(ChoiceErrorRequest.getQuestionName());
					choiceErrorExample.clear();
					choiceErrorExample.setPageNumber(ParameterConstants.ZERO);
					choiceErrorExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					ChoiceErrorExample.Criteria criteria = choiceErrorExample.createCriteria();
					criteria.andStudentIdEqualTo(student.getStudentId());
					if (setting != null && setting.length() > 0) {
						criteria.andQuestionNameLike("%" + setting + "%");
					}
					if (ChoiceErrorRequest.getQuestionType() != null) {
						criteria.andQuestionTypeEqualTo(ChoiceErrorRequest.getQuestionType());
					}
					if (ChoiceErrorRequest.getSubjectId() != null) {
						criteria.andSubjectIdEqualTo(ChoiceErrorRequest.getSubjectId());
					}
				}
			}
			if (choiceErrorStatic != null) {
				String setting = Kit.ISOToUTF8(choiceErrorStatic.getQuestionName());
				ChoiceErrorExample.Criteria criteria = choiceErrorExample.createCriteria();
				criteria.andStudentIdEqualTo(student.getStudentId());
				if (setting != null && setting.length() > 0) {
					criteria.andQuestionNameLike("%" + setting + "%");
				}
				if (choiceErrorStatic.getQuestionType() != null) {
					criteria.andQuestionTypeEqualTo(choiceErrorStatic.getQuestionType());
				}
				if (choiceErrorStatic.getSubjectId() != null) {
					criteria.andSubjectIdEqualTo(choiceErrorStatic.getSubjectId());
				}
				model.addAttribute("questionName", setting);
				model.addAttribute("questionType", choiceErrorStatic.getQuestionType());
				model.addAttribute("subjectId", choiceErrorStatic.getSubjectId());
			}
			choiceErrorExample.setPageNumber(SystemContext.getPageOffset());
			choiceErrorExample.setPageSize(SystemContext.getPageSize());
			int count = choiceErrorService.countByExample(choiceErrorExample);
			List<ChoiceError> listChoiceError = choiceErrorService.selectByExample(choiceErrorExample);
			Pager<ChoiceError> choiceErrorList = new Pager<ChoiceError>(count,listChoiceError);
			choiceErrorExample.clear();
			subjectExample.clear();
			subjectExample.setPageNumber(0);
			subjectExample.setPageSize(Integer.MAX_VALUE);
			subjectExample.createCriteria().andSubjectStateEqualTo(0);
			List<Subject> subjectList = subjectService.selectByExample(subjectExample);
			model.addAttribute("subjectList", subjectList);
			model.addAttribute("choiceErrorList", choiceErrorList);
			return "choiceError/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "choiceError/list";
	}
}
