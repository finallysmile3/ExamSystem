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
import com.internet.cms.model.EssayQuestion;
import com.internet.cms.model.EssayQuestionExample;
import com.internet.cms.model.JudgeQuestion;
import com.internet.cms.model.JudgeQuestionExample;
import com.internet.cms.model.Point;
import com.internet.cms.model.PointExample;
import com.internet.cms.model.Subject;
import com.internet.cms.model.SubjectExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.ChoiceQuestionService;
import com.internet.cms.service.EssayQuestionService;
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
@RequestMapping("subjectController")
public class SubjectController extends BaseController{
	
	private Subject subjectStatic = new Subject();
	private SubjectExample subjectExample = new SubjectExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	@Autowired
	private SubjectService subjectService;
	@Autowired
	private ChoiceQuestionService ChoiceQuestionService;
	private ChoiceQuestionExample ChoiceQuestionExample = new ChoiceQuestionExample();
	@Autowired
	private JudgeQuestionService JudgeQuestionService;
	private JudgeQuestionExample JudgeQuestionExample = new JudgeQuestionExample();
	@Autowired
	private EssayQuestionService EssayQuestionService;
	private EssayQuestionExample EssayQuestionExample = new EssayQuestionExample();
	@Autowired
	private PointService PointService;
	private PointExample PointExample = new PointExample();
	
	@RequestMapping(value="all" , method = RequestMethod.GET)
	public String getAll(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		subjectStatic = null;
		subjectExample.clear();
		subjectExample.setPageSize(SystemContext.getPageSize());
		subjectExample.setPageNumber(SystemContext.getPageOffset());
		int count = subjectService.countByExample(subjectExample);
		List<Subject> listSubject = subjectService.selectByExample(subjectExample);
		Pager<Subject> subjectList = new Pager<Subject>(count,listSubject);
		model.addAttribute("subjectList", subjectList);
		return "subject/list";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		Subject subject;
		if(id > 0){
			subject = subjectService.selectByPrimaryKey(id);
		}else{
			subject = new Subject();
		}
		model.addAttribute("subject", subject);
		return "subject/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid Subject subject,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "subject/add";
		}
		if(id > 0){
			subject.setSubjectId(id);
			subjectService.updateByPrimaryKey(subject);
		}else{
			subjectService.insert(subject);
		}
		return "redirect://subjectController/all.do";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteUser(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		Subject subject;
		if(id > 0){
			subject = subjectService.selectByPrimaryKey(id);
			if(subject.getSubjectState() == 1){
				subjectService.deleteByPrimaryKey(id);
				ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
			}else{
				ChoiceQuestionExample.clear();
				ChoiceQuestionExample.setPageNumber(0);
				ChoiceQuestionExample.setPageSize(Integer.MAX_VALUE);
				List<ChoiceQuestion> choice = ChoiceQuestionService.selectByExample(ChoiceQuestionExample);
				
				JudgeQuestionExample.clear();
				JudgeQuestionExample.setPageNumber(0);
				JudgeQuestionExample.setPageSize(Integer.MAX_VALUE);
				List<JudgeQuestion> judge = JudgeQuestionService.selectByExample(JudgeQuestionExample);
				
				EssayQuestionExample.clear();
				EssayQuestionExample.setPageNumber(0);
				EssayQuestionExample.setPageSize(Integer.MAX_VALUE);
				List<EssayQuestion> essay = EssayQuestionService.selectByExample(EssayQuestionExample);
				
				PointExample.clear();
				PointExample.setPageNumber(0);
				PointExample.setPageSize(Integer.MAX_VALUE);
				List<Point> point = PointService.selectByExample(PointExample);
				
				if(choice.size() != 0){
					ajaxMsg.addHeader(MsgType.WARN, "该科目下面还有选择题，不能删除！");
				}else if(judge.size() != 0){
					ajaxMsg.addHeader(MsgType.WARN, "该科目下面还有判断题，不能删除！");
				}else if(essay.size() != 0){
					ajaxMsg.addHeader(MsgType.WARN, "该科目下边还有简答题，不能删除！");
				}else if(point.size() != 0){
					ajaxMsg.addHeader(MsgType.WARN, "该科目下面还有知识点，不能删除！");
				}else{
					subject = new Subject();
					subject.setSubjectId(id);
					subject.setSubjectState(1);
					subjectService.updateByPrimaryKeySelective(subject);
					ajaxMsg.addHeader(MsgType.WARN, "已经将科目状态设为不可用，再次删除将彻底删除！");
				}
			}
		} else {
			ajaxMsg.addHeader(MsgType.ERROR, "该科目信息有误,不能删除");
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
			subjectExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				Subject subjectRequest = (Subject) JsonUtilTool.json2Object(data, Subject.class);
				//String setting = Kit.ISOToUTF8(subjectRequest.getName());
				subjectStatic = subjectRequest;
				if (subjectRequest != null) {
					String setting = Kit.ISOToUTF8(subjectRequest.getSubjectName());
					subjectExample.clear();
					subjectExample.setPageNumber(ParameterConstants.ZERO);
					subjectExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					SubjectExample.Criteria criteria = subjectExample.createCriteria();
					if (setting != null && setting.length() > 0) {
						criteria.andSubjectNameLike("%" + setting + "%");
					}
					if (subjectRequest.getSubjectState() != null) {
						criteria.andSubjectStateEqualTo(subjectRequest.getSubjectState());
					}
				}
			}
			if (subjectStatic != null) {
				String setting = Kit.ISOToUTF8(subjectStatic.getSubjectName());
				SubjectExample.Criteria criteria = subjectExample.createCriteria();
				if (setting != null && setting.length() > 0) {
					criteria.andSubjectNameLike("%" + setting + "%");
				}
				if (subjectStatic.getSubjectState() != null) {
					criteria.andSubjectStateEqualTo(subjectStatic.getSubjectState());
				}
				model.addAttribute("subjectName", setting);
				model.addAttribute("subjectState", subjectStatic.getSubjectState());
			}
			subjectExample.setPageNumber(SystemContext.getPageOffset());
			subjectExample.setPageSize(SystemContext.getPageSize());
			int count = subjectService.countByExample(subjectExample);
			List<Subject> listSubject = subjectService.selectByExample(subjectExample);
			Pager<Subject> subjectList = new Pager<Subject>(count,listSubject);
			subjectExample.clear();
			model.addAttribute("subjectList", subjectList);
			return "subject/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "subject/list";
	}
}
