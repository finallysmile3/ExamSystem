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

import com.internet.cms.model.ChoiceQuestion;
import com.internet.cms.model.ChoiceQuestionExample;
import com.internet.cms.model.Point;
import com.internet.cms.model.PointExample;
import com.internet.cms.model.Subject;
import com.internet.cms.model.SubjectExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.ChoiceQuestionService;
import com.internet.cms.service.PointService;
import com.internet.cms.service.SubjectService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("choiceQuestionController")
public class ChoiceQuestionController extends BaseController{

	private ChoiceQuestion choiceQuestionStatic = new ChoiceQuestion();
	private ChoiceQuestionExample choiceQuestionExample = new ChoiceQuestionExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	
	@Autowired
	private ChoiceQuestionService choiceQuestionService;
	@Autowired
	private PointService pointService;
	private PointExample pointExample = new PointExample();
	@Autowired
	private SubjectService subjectService;
	private SubjectExample subjectExample = new SubjectExample();
	
	@RequestMapping(value="all" , method = RequestMethod.GET)
	public String getAll(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		choiceQuestionStatic = null;
		choiceQuestionExample.clear();
		choiceQuestionExample.setPageSize(SystemContext.getPageSize());
		choiceQuestionExample.setPageNumber(SystemContext.getPageOffset());
		int count = choiceQuestionService.countByExample(choiceQuestionExample);
		List<ChoiceQuestion> listChoiceQuestion = choiceQuestionService.selectByExample(choiceQuestionExample);
		Pager<ChoiceQuestion> choiceQuestionList = new Pager<ChoiceQuestion>(count,listChoiceQuestion);
		subjectExample.clear();
		subjectExample.setPageNumber(0);
		subjectExample.setPageSize(Integer.MAX_VALUE);
		subjectExample.createCriteria().andSubjectStateEqualTo(0);
		List<Subject> subjectList = subjectService.selectByExample(subjectExample);
		model.addAttribute("subjectList", subjectList);
		model.addAttribute("choiceQuestionList", choiceQuestionList);
		return "choicequestion/list";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateChoiceQuestion(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ChoiceQuestion choiceQuestion;
		if(id > 0){
			choiceQuestion = choiceQuestionService.selectByPrimaryKey(id);
		}else{
			choiceQuestion = new ChoiceQuestion();
		}
		subjectExample.clear();
		subjectExample.setPageNumber(0);
		subjectExample.setPageSize(Integer.MAX_VALUE);
		subjectExample.createCriteria().andSubjectStateEqualTo(0);
		List<Subject> subjectList = subjectService.selectByExample(subjectExample);
		model.addAttribute("subjectList", subjectList);
		pointExample.clear();
		pointExample.setPageNumber(0);
		pointExample.setPageSize(Integer.MAX_VALUE);
		List<Point> pointList = pointService.selectByExample(pointExample);
		model.addAttribute("pointList", pointList);
		model.addAttribute("choiceQuestion", choiceQuestion);
		return "choicequestion/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateChoiceQuestionPost(@PathVariable("id") int id,Model model,@Valid ChoiceQuestion choiceQuestion,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "choicequestion/add";
		}
		if(id > 0){
			choiceQuestion.setQuestionId(id);
			choiceQuestion.setPointName(pointService.selectByPrimaryKey(choiceQuestion.getPointId()).getPointName());
			choiceQuestion.setSubjectName(subjectService.selectByPrimaryKey(choiceQuestion.getSubjectId()).getSubjectName());
			choiceQuestionService.updateByPrimaryKey(choiceQuestion);
		}else{
			choiceQuestion.setPointName(pointService.selectByPrimaryKey(choiceQuestion.getPointId()).getPointName());
			choiceQuestion.setSubjectName(subjectService.selectByPrimaryKey(choiceQuestion.getSubjectId()).getSubjectName());
			choiceQuestionService.insert(choiceQuestion);
		}
		return "redirect://choiceQuestionController/all.do";
	}
	
	@RequestMapping(value = "addOrUpdate1/{id}",method = RequestMethod.GET)
	public String addOrUpdateChoiceQuestion1(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ChoiceQuestion choiceQuestion;
		if(id > 0){
			choiceQuestion = choiceQuestionService.selectByPrimaryKey(id);
		}else{
			choiceQuestion = new ChoiceQuestion();
		}
		subjectExample.clear();
		subjectExample.setPageNumber(0);
		subjectExample.setPageSize(Integer.MAX_VALUE);
		subjectExample.createCriteria().andSubjectStateEqualTo(0);
		List<Subject> subjectList = subjectService.selectByExample(subjectExample);
		model.addAttribute("subjectList", subjectList);
		pointExample.clear();
		pointExample.setPageNumber(0);
		pointExample.setPageSize(Integer.MAX_VALUE);
		List<Point> pointList = pointService.selectByExample(pointExample);
		model.addAttribute("pointList", pointList);
		model.addAttribute("choiceQuestion", choiceQuestion);
		return "choicequestion/add2";
	}
	
	@RequestMapping(value = "addOrUpdate1/{id}",method = RequestMethod.POST)
	public String addOrUpdateChoiceQuestionPost1(@PathVariable("id") int id,Model model,@Valid ChoiceQuestion choiceQuestion,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "choicequestion/add2";
		}
		if(id > 0){
			choiceQuestion.setQuestionId(id);
			choiceQuestion.setPointName(pointService.selectByPrimaryKey(choiceQuestion.getPointId()).getPointName());
			choiceQuestion.setSubjectName(subjectService.selectByPrimaryKey(choiceQuestion.getSubjectId()).getSubjectName());
			choiceQuestionService.updateByPrimaryKey(choiceQuestion);
		}else{
			choiceQuestion.setPointName(pointService.selectByPrimaryKey(choiceQuestion.getPointId()).getPointName());
			choiceQuestion.setSubjectName(subjectService.selectByPrimaryKey(choiceQuestion.getSubjectId()).getSubjectName());
			choiceQuestionService.insert(choiceQuestion);
		}
		return "redirect://choiceQuestionController/all.do";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteChoiceQuestion(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		ChoiceQuestion choiceQuestion;
		if(id > 0){
			choiceQuestion = choiceQuestionService.selectByPrimaryKey(id);
			if(choiceQuestion.getQuestionState() == 1){
				choiceQuestionService.deleteByPrimaryKey(id);
				ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
			}else{
				choiceQuestion = new ChoiceQuestion();
				choiceQuestion.setQuestionId(id);
				choiceQuestion.setQuestionState(1);
				choiceQuestionService.updateByPrimaryKeySelective(choiceQuestion);
				ajaxMsg.addHeader(MsgType.WARN, "已经将题目状态设为不可用，再次删除将彻底删除！");
			}
		} else {
			ajaxMsg.addHeader(MsgType.ERROR, "该选择题信息有误,不能删除");
		}
		return ajaxMsg;
	}
	
	@RequestMapping(value = "search" , method = RequestMethod.GET)
	public String selectChoiceQuestion(HttpServletRequest request,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		try {
			Map<String, Object> params = FrontHelper.transfParams(request);
			choiceQuestionExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				ChoiceQuestion choiceQuestionRequest = (ChoiceQuestion) JsonUtilTool.json2Object(data, ChoiceQuestion.class);
				//String setting = Kit.ISOToUTF8(choiceQuestionRequest.getName());
				choiceQuestionStatic = choiceQuestionRequest;
				if (choiceQuestionRequest != null) {
					String setting = Kit.ISOToUTF8(choiceQuestionRequest.getQuestionName());
					choiceQuestionExample.clear();
					choiceQuestionExample.setPageNumber(ParameterConstants.ZERO);
					choiceQuestionExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					ChoiceQuestionExample.Criteria criteria = choiceQuestionExample.createCriteria();
					if (setting != null && setting.length() > 0) {
						criteria.andQuestionNameLike("%" + setting + "%");
					}
					if (choiceQuestionRequest.getQuestionType() != null) {
						criteria.andQuestionTypeEqualTo(choiceQuestionRequest.getQuestionType());
					}
					if (choiceQuestionRequest.getQuestionState() != null) {
						criteria.andQuestionStateEqualTo(choiceQuestionRequest.getQuestionState());
					}
					if (choiceQuestionRequest.getSubjectId() != null) {
						criteria.andSubjectIdEqualTo(choiceQuestionRequest.getSubjectId());
					}
					
				}
			}
			if (choiceQuestionStatic != null) {
				String setting = Kit.ISOToUTF8(choiceQuestionStatic.getQuestionName());
				ChoiceQuestionExample.Criteria criteria = choiceQuestionExample.createCriteria();
				if (setting != null && setting.length() > 0) {
					criteria.andQuestionNameLike("%" + setting + "%");
				}
				if (choiceQuestionStatic.getQuestionType() != null) {
					criteria.andQuestionTypeEqualTo(choiceQuestionStatic.getQuestionType());
				}
				if (choiceQuestionStatic.getQuestionState() != null) {
					criteria.andQuestionStateEqualTo(choiceQuestionStatic.getQuestionState());
				}
				if (choiceQuestionStatic.getSubjectId() != null) {
					criteria.andSubjectIdEqualTo(choiceQuestionStatic.getSubjectId());
				}
				model.addAttribute("questionName", setting);
				model.addAttribute("questionType", choiceQuestionStatic.getQuestionType());
				model.addAttribute("questionState", choiceQuestionStatic.getQuestionState());
				model.addAttribute("subjectId", choiceQuestionStatic.getSubjectId());
			}
			choiceQuestionExample.setPageNumber(SystemContext.getPageOffset());
			choiceQuestionExample.setPageSize(SystemContext.getPageSize());
			int count = choiceQuestionService.countByExample(choiceQuestionExample);
			List<ChoiceQuestion> listChoiceQuestion = choiceQuestionService.selectByExample(choiceQuestionExample);
			Pager<ChoiceQuestion> choiceQuestionList = new Pager<ChoiceQuestion>(count,listChoiceQuestion);
			choiceQuestionExample.clear();
			subjectExample.clear();
			subjectExample.setPageNumber(0);
			subjectExample.setPageSize(Integer.MAX_VALUE);
			subjectExample.createCriteria().andSubjectStateEqualTo(0);
			List<Subject> subjectList = subjectService.selectByExample(subjectExample);
			model.addAttribute("subjectList", subjectList);
			model.addAttribute("choiceQuestionList", choiceQuestionList);
			return "choicequestion/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "choicequestion/list";
	}
}
