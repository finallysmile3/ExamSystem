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

import com.internet.cms.model.JudgeQuestion;
import com.internet.cms.model.JudgeQuestionExample;
import com.internet.cms.model.Point;
import com.internet.cms.model.PointExample;
import com.internet.cms.model.Subject;
import com.internet.cms.model.SubjectExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.JudgeQuestionService;
import com.internet.cms.service.PointService;
import com.internet.cms.service.SubjectService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("judgeQuestionController")
public class JudgeQuestionController extends BaseController{
	private JudgeQuestion judgeQuestionStatic = new JudgeQuestion();
	private JudgeQuestionExample judgeQuestionExample = new JudgeQuestionExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	@Autowired
	private JudgeQuestionService judgeQuestionService;
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
		judgeQuestionStatic = null;
		judgeQuestionExample.clear();
		judgeQuestionExample.setPageSize(SystemContext.getPageSize());
		judgeQuestionExample.setPageNumber(SystemContext.getPageOffset());
		int count = judgeQuestionService.countByExample(judgeQuestionExample);
		List<JudgeQuestion> listJudgeQuestion = judgeQuestionService.selectByExample(judgeQuestionExample);
		Pager<JudgeQuestion> judgeQuestionList = new Pager<JudgeQuestion>(count,listJudgeQuestion);
		subjectExample.clear();
		subjectExample.setPageNumber(0);
		subjectExample.setPageSize(Integer.MAX_VALUE);
		subjectExample.createCriteria().andSubjectStateEqualTo(0);
		List<Subject> subjectList = subjectService.selectByExample(subjectExample);
		model.addAttribute("subjectList", subjectList);
		model.addAttribute("judgeQuestionList", judgeQuestionList);
		return "judgeQuestion/list";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		JudgeQuestion JudgeQuestion;
		if(id > 0){
			JudgeQuestion = judgeQuestionService.selectByPrimaryKey(id);
		}else{
			JudgeQuestion = new JudgeQuestion();
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
		model.addAttribute("judgeQuestion", JudgeQuestion);
		return "judgeQuestion/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid JudgeQuestion JudgeQuestion,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "judgeQuestion/add";
		}
		JudgeQuestion.setPointName(pointService.selectByPrimaryKey(JudgeQuestion.getPointId()).getPointName());
		JudgeQuestion.setSubjectName(subjectService.selectByPrimaryKey(JudgeQuestion.getSubjectId()).getSubjectName());
		if(id > 0){
			JudgeQuestion.setQuestionId(id);
			judgeQuestionService.updateByPrimaryKey(JudgeQuestion);
		}else{
			judgeQuestionService.insert(JudgeQuestion);
		}
		return "redirect://judgeQuestionController/all.do";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteUser(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		if(id > 0){
			judgeQuestionService.deleteByPrimaryKey(id);
			ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
			
		} else {
			ajaxMsg.addHeader(MsgType.ERROR, "该题目信息有误,不能删除");
		}
		return ajaxMsg;
	}
	
	@RequestMapping(value = "search" , method = RequestMethod.GET)
	public String selectUser(HttpServletRequest request,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		try {
			Map<String, Object> params = FrontHelper.transfParams(request);
			judgeQuestionExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				JudgeQuestion JudgeQuestionRequest = (JudgeQuestion) JsonUtilTool.json2Object(data, JudgeQuestion.class);
				//String setting = Kit.ISOToUTF8(JudgeQuestionRequest.getName());
				judgeQuestionStatic = JudgeQuestionRequest;
				if (JudgeQuestionRequest != null) {
					String questionName = Kit.ISOToUTF8(JudgeQuestionRequest.getQuestionName());
					judgeQuestionExample.clear();
					judgeQuestionExample.setPageNumber(ParameterConstants.ZERO);
					judgeQuestionExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					JudgeQuestionExample.Criteria criteria = judgeQuestionExample.createCriteria();
					if (questionName != null && questionName.length() > 0) {
						criteria.andQuestionNameLike("%" + questionName + "%");
					}
					if (JudgeQuestionRequest.getSubjectId() != null) {
						criteria.andSubjectIdEqualTo(JudgeQuestionRequest.getSubjectId());
					}
				}
			}
			if (judgeQuestionStatic != null) {
				String questionName = Kit.ISOToUTF8(judgeQuestionStatic.getQuestionName());
				JudgeQuestionExample.Criteria criteria = judgeQuestionExample.createCriteria();
				if (questionName != null && questionName.length() > 0) {
					criteria.andQuestionNameLike("%" + questionName + "%");
				}
				if (judgeQuestionStatic.getSubjectId() != null) {
					criteria.andSubjectIdEqualTo(judgeQuestionStatic.getSubjectId());
				}
				model.addAttribute("questionName", questionName);
				model.addAttribute("subjectId", judgeQuestionStatic.getSubjectId());
			}
			judgeQuestionExample.setPageNumber(SystemContext.getPageOffset());
			judgeQuestionExample.setPageSize(SystemContext.getPageSize());
			int count = judgeQuestionService.countByExample(judgeQuestionExample);
			List<JudgeQuestion> listUser = judgeQuestionService.selectByExample(judgeQuestionExample);
			Pager<JudgeQuestion> JudgeQuestionList = new Pager<JudgeQuestion>(count,listUser);
			judgeQuestionExample.clear();
			subjectExample.clear();
			subjectExample.setPageNumber(0);
			subjectExample.setPageSize(Integer.MAX_VALUE);
			subjectExample.createCriteria().andSubjectStateEqualTo(0);
			List<Subject> subjectList = subjectService.selectByExample(subjectExample);
			model.addAttribute("subjectList", subjectList);
			model.addAttribute("judgeQuestionList", JudgeQuestionList);
			return "judgeQuestion/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "judgeQuestion/list";
	}
}
