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

import com.internet.cms.model.Point;
import com.internet.cms.model.PointExample;
import com.internet.cms.model.Subject;
import com.internet.cms.model.SubjectExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.PointService;
import com.internet.cms.service.SubjectService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("pointController")
public class PointController extends BaseController{
	
	private Point pointStatic = new Point();
	private PointExample pointExample = new PointExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	@Autowired
	private PointService pointService;
	@Autowired
	private SubjectService subjectService;
	private SubjectExample subjectExample = new SubjectExample();
	
	@RequestMapping(value="all" , method = RequestMethod.GET)
	public String getAll(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		pointStatic = null;
		pointExample.clear();
		pointExample.setPageSize(SystemContext.getPageSize());
		pointExample.setPageNumber(SystemContext.getPageOffset());
		int count = pointService.countByExample(pointExample);
		List<Point> listPoint = pointService.selectByExample(pointExample);
		Pager<Point> pointList = new Pager<Point>(count,listPoint);
		subjectExample.clear();
		subjectExample.setPageNumber(0);
		subjectExample.setPageSize(Integer.MAX_VALUE);
		subjectExample.createCriteria().andSubjectStateEqualTo(0);
		List<Subject> subjectList = subjectService.selectByExample(subjectExample);
		model.addAttribute("subjectList", subjectList);
		model.addAttribute("pointList", pointList);
		return "point/list";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		Point point;
		if(id > 0){
			point = pointService.selectByPrimaryKey(id);
		}else{
			point = new Point();
		}
		subjectExample.clear();
		subjectExample.setPageNumber(0);
		subjectExample.setPageSize(Integer.MAX_VALUE);
		subjectExample.createCriteria().andSubjectStateEqualTo(0);
		List<Subject> subjectList = subjectService.selectByExample(subjectExample);
		model.addAttribute("subjectList", subjectList);
		model.addAttribute("point", point);
		return "point/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid Point point,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "user/add";
		}
		if(id > 0){
			point.setPointId(id);
			point.setSubjectName(subjectService.selectByPrimaryKey(point.getSubjectId()).getSubjectName());
			pointService.updateByPrimaryKey(point);
		}else{
			point.setSubjectName(subjectService.selectByPrimaryKey(point.getSubjectId()).getSubjectName());
			pointService.insert(point);
		}
		return "redirect://pointController/all.do";
	}
	
	@RequestMapping(value = "show/{id}",method = RequestMethod.GET)
	public String show(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		Point point;
		if(id > 0){
			point = pointService.selectByPrimaryKey(id);
		}else{
			point = new Point();
		}
		model.addAttribute("point", point);
		return "choiceError/add";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteUser(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		if(id > 0){
			pointService.deleteByPrimaryKey(id);
			ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
		} else {
			ajaxMsg.addHeader(MsgType.ERROR, "该知识点信息有误,不能删除");
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
			pointExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				Point pointRequest = (Point) JsonUtilTool.json2Object(data, Point.class);
				//String setting = Kit.ISOToUTF8(pointRequest.getName());
				pointStatic = pointRequest;
				if (pointRequest != null) {
					String pointName = Kit.ISOToUTF8(pointRequest.getPointName());
					pointExample.clear();
					pointExample.setPageNumber(ParameterConstants.ZERO);
					pointExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					PointExample.Criteria criteria = pointExample.createCriteria();
					if (pointName != null && pointName.length() > 0) {
						criteria.andPointNameLike("%" + pointName + "%");
					}
					if (pointRequest.getSubjectId() != null) {
						criteria.andSubjectIdEqualTo(pointRequest.getSubjectId());
					}
				}
			}
			if (pointStatic != null) {
				String pointName = Kit.ISOToUTF8(pointStatic.getPointName());
				PointExample.Criteria criteria = pointExample.createCriteria();
				if (pointName != null && pointName.length() > 0) {
					criteria.andPointNameLike("%" + pointName + "%");
				}
				if (pointStatic.getSubjectId() != null) {
					criteria.andSubjectIdEqualTo(pointStatic.getSubjectId());
				}
				model.addAttribute("pointName", pointName);
				model.addAttribute("subjectId", pointStatic.getSubjectId());
			}
			pointExample.setPageNumber(SystemContext.getPageOffset());
			pointExample.setPageSize(SystemContext.getPageSize());
			int count = pointService.countByExample(pointExample);
			List<Point> listUser = pointService.selectByExample(pointExample);
			Pager<Point> pointList = new Pager<Point>(count,listUser);
			pointExample.clear();
			subjectExample.clear();
			subjectExample.setPageNumber(0);
			subjectExample.setPageSize(Integer.MAX_VALUE);
			List<Subject> subjectList = subjectService.selectByExample(subjectExample);
			model.addAttribute("subjectList", subjectList);
			model.addAttribute("pointList", pointList);
			return "point/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "point/list";
	}
}
