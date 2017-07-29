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

import com.internet.cms.model.EssayQuestion;
import com.internet.cms.model.EssayQuestionExample;
import com.internet.cms.model.Point;
import com.internet.cms.model.PointExample;
import com.internet.cms.model.Subject;
import com.internet.cms.model.SubjectExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.EssayQuestionService;
import com.internet.cms.service.PointService;
import com.internet.cms.service.SubjectService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("essayQuestionController")
public class EssayQuestionController extends BaseController{
	
	private EssayQuestion essayQuestionStatic = new EssayQuestion();
	private EssayQuestionExample essayQuestionExample = new EssayQuestionExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	@Autowired
	private EssayQuestionService essayQuestionService;
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
		essayQuestionStatic = null;
		essayQuestionExample.clear();
		essayQuestionExample.setPageSize(SystemContext.getPageSize());
		essayQuestionExample.setPageNumber(SystemContext.getPageOffset());
		int count = essayQuestionService.countByExample(essayQuestionExample);
		List<EssayQuestion> listEssayQuestion = essayQuestionService.selectByExample(essayQuestionExample);
		Pager<EssayQuestion> essayQuestionList = new Pager<EssayQuestion>(count,listEssayQuestion);
		subjectExample.clear();
		subjectExample.setPageNumber(0);
		subjectExample.setPageSize(Integer.MAX_VALUE);
		subjectExample.createCriteria().andSubjectStateEqualTo(0);
		List<Subject> subjectList = subjectService.selectByExample(subjectExample);
		model.addAttribute("subjectList", subjectList);
		model.addAttribute("essayQuestionList", essayQuestionList);
		return "essayquestion/list";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		EssayQuestion essayQuestion;
		if(id > 0){
			essayQuestion = essayQuestionService.selectByPrimaryKey(id);
		}else{
			essayQuestion = new EssayQuestion();
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
		model.addAttribute("essayQuestion", essayQuestion);
		return "essayquestion/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid EssayQuestion essayQuestion,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "essayquestion/add";
		}
		essayQuestion.setPointName(pointService.selectByPrimaryKey(essayQuestion.getPointId()).getPointName());
		essayQuestion.setSubjectName(subjectService.selectByPrimaryKey(essayQuestion.getSubjectId()).getSubjectName());
		if(id > 0){
			essayQuestion.setQuestionId(id);
			essayQuestionService.updateByPrimaryKey(essayQuestion);
		}else{
			essayQuestionService.insert(essayQuestion);
		}
		return "redirect://essayQuestionController/all.do";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteUser(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		EssayQuestion essayQuestion;
		if(id > 0){
			essayQuestion = essayQuestionService.selectByPrimaryKey(id);
			if(essayQuestion.getQuestionState() == 1){
				essayQuestionService.deleteByPrimaryKey(id);
				ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
			}else{
				essayQuestion.setQuestionId(id);
				essayQuestion.setQuestionState(1);
				essayQuestionService.updateByPrimaryKeySelective(essayQuestion);
				ajaxMsg.addHeader(MsgType.WARN, "已经将题目状态设为不可用，再次删除将彻底删除！");
			}
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
			essayQuestionExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				EssayQuestion essayQuestionRequest = (EssayQuestion) JsonUtilTool.json2Object(data, EssayQuestion.class);
				//String setting = Kit.ISOToUTF8(essayQuestionRequest.getName());
				essayQuestionStatic = essayQuestionRequest;
				if (essayQuestionRequest != null) {
					String questionName = Kit.ISOToUTF8(essayQuestionRequest.getQuestionName());
					essayQuestionExample.clear();
					essayQuestionExample.setPageNumber(ParameterConstants.ZERO);
					essayQuestionExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					EssayQuestionExample.Criteria criteria = essayQuestionExample.createCriteria();
					if (questionName != null && questionName.length() > 0) {
						criteria.andQuestionNameLike("%" + questionName + "%");
					}
					if (essayQuestionRequest.getSubjectId() != null) {
						criteria.andSubjectIdEqualTo(essayQuestionRequest.getSubjectId());
					}
					if (essayQuestionRequest.getQuestionState() != null) {
						criteria.andQuestionStateEqualTo(essayQuestionRequest.getQuestionState());
					}
				}
			}
			if (essayQuestionStatic != null) {
				String questionName = Kit.ISOToUTF8(essayQuestionStatic.getQuestionName());
				EssayQuestionExample.Criteria criteria = essayQuestionExample.createCriteria();
				if (questionName != null && questionName.length() > 0) {
					criteria.andQuestionNameLike("%" + questionName + "%");
				}
				if (essayQuestionStatic.getSubjectId() != null) {
					criteria.andSubjectIdEqualTo(essayQuestionStatic.getSubjectId());
				}
				if (essayQuestionStatic.getQuestionState() != null) {
					criteria.andQuestionStateEqualTo(essayQuestionStatic.getQuestionState());
				}
				model.addAttribute("questionName", questionName);
				model.addAttribute("subjectId", essayQuestionStatic.getSubjectId());
				model.addAttribute("questionState", essayQuestionStatic.getQuestionState());
			}
			essayQuestionExample.setPageNumber(SystemContext.getPageOffset());
			essayQuestionExample.setPageSize(SystemContext.getPageSize());
			int count = essayQuestionService.countByExample(essayQuestionExample);
			List<EssayQuestion> listUser = essayQuestionService.selectByExample(essayQuestionExample);
			Pager<EssayQuestion> essayQuestionList = new Pager<EssayQuestion>(count,listUser);
			essayQuestionExample.clear();
			subjectExample.clear();
			subjectExample.setPageNumber(0);
			subjectExample.setPageSize(Integer.MAX_VALUE);
			subjectExample.createCriteria().andSubjectStateEqualTo(0);
			List<Subject> subjectList = subjectService.selectByExample(subjectExample);
			model.addAttribute("subjectList", subjectList);
			model.addAttribute("essayQuestionList", essayQuestionList);
			return "essayquestion/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "essayquestion/list";
	}
}
