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

import com.internet.cms.model.Classes;
import com.internet.cms.model.ClassesExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.ClassService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("classController")
public class ClassController extends BaseController{
	
	private Classes classStatic = new Classes();
	private ClassesExample classesExample = new ClassesExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	@Autowired
	private ClassService classService;
	
	@RequestMapping(value="all" , method = RequestMethod.GET)
	public String getAll(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		classStatic = null;
		classesExample.clear();
		classesExample.setPageSize(SystemContext.getPageSize());
		classesExample.setPageNumber(SystemContext.getPageOffset());
		int count = classService.countByExample(classesExample);
		List<Classes> listClass = classService.selectByExample(classesExample);
		Pager<Classes> classList = new Pager<Classes>(count,listClass);
		model.addAttribute("classList", classList);
		return "class/list";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		Classes classes;
		if(id > 0){
			classes = classService.selectByPrimaryKey(id);
		}else{
			classes = new Classes();
		}
		model.addAttribute("classes", classes);
		return "class/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid Classes classes,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "class/add";
		}
		if(id > 0){
			classes.setClassId(id);
			classService.updateByPrimaryKey(classes);
		}else{
			classService.insert(classes);
		}
		return "redirect://classController/all.do";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteUser(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		Classes classes;
		if(id > 0){
			classes = classService.selectByPrimaryKey(id);
			if(classes.getClassState() == 1){
				classService.deleteByPrimaryKey(id);
				ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
			}else{
				classes = new Classes();
				classes.setClassId(id);
				classes.setClassState(1);
				classService.updateByPrimaryKeySelective(classes);
				ajaxMsg.addHeader(MsgType.WARN, "已经将班级状态设为已毕业，再次删除将彻底删除！");
			}
		} else {
			ajaxMsg.addHeader(MsgType.ERROR, "该班级信息有误,不能删除");
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
			classesExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				Classes userRequest = (Classes) JsonUtilTool.json2Object(data, Classes.class);
				//String setting = Kit.ISOToUTF8(userRequest.getName());
				classStatic = userRequest;
				if (userRequest != null) {
					String className = Kit.ISOToUTF8(userRequest.getClassName());
					String classDate = Kit.ISOToUTF8(userRequest.getClassDate());
					String classMajor = Kit.ISOToUTF8(userRequest.getClassMajor());
					classesExample.clear();
					classesExample.setPageNumber(ParameterConstants.ZERO);
					classesExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					ClassesExample.Criteria criteria = classesExample.createCriteria();
					if (className != null && className.length() > 0) {
						criteria.andClassNameLike("%" + className + "%");
					}
					if (classDate != null && classDate.length() > 0) {
						criteria.andClassDateLike("%" + classDate + "%");
					}
					if (classMajor != null && classMajor.length() > 0) {
						criteria.andClassMajorLike("%" + classMajor + "%");
					}
					if (userRequest.getClassState() != null) {
						criteria.andClassStateEqualTo(userRequest.getClassState());
					}
				}
			}
			if (classStatic != null) {
				String className = Kit.ISOToUTF8(classStatic.getClassName());
				String classDate = Kit.ISOToUTF8(classStatic.getClassDate());
				String classMajor = Kit.ISOToUTF8(classStatic.getClassMajor());
				ClassesExample.Criteria criteria = classesExample.createCriteria();
				if (className != null && className.length() > 0) {
					criteria.andClassNameLike("%" + className + "%");
				}
				if (classDate != null && classDate.length() > 0) {
					criteria.andClassDateLike("%" + classDate + "%");
				}
				if (classMajor != null && classMajor.length() > 0) {
					criteria.andClassMajorLike("%" + classMajor + "%");
				}
				if (classStatic.getClassState() != null) {
					criteria.andClassStateEqualTo(classStatic.getClassState());
				}
				model.addAttribute("className", className);
				model.addAttribute("classDate", classDate);
				model.addAttribute("classMajor", classMajor);
				model.addAttribute("classState", classStatic.getClassState());
			}
			classesExample.setPageNumber(SystemContext.getPageOffset());
			classesExample.setPageSize(SystemContext.getPageSize());
			int count = classService.countByExample(classesExample);
			List<Classes> listUser = classService.selectByExample(classesExample);
			Pager<Classes> classList = new Pager<Classes>(count,listUser);
			classesExample.clear();
			model.addAttribute("classList", classList);
			return "class/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "class/list";
	}
}
