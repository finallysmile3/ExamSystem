package com.internet.cms.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
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
import com.internet.cms.model.Student;
import com.internet.cms.model.StudentExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.ClassService;
import com.internet.cms.service.StudentService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.MD5;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("studentController")
public class StudentController extends BaseController{
	
	private Student studentStatic = new Student();
	private StudentExample studentExample = new StudentExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	
	@Autowired
	private StudentService studnetService;
	@Autowired
	private ClassService classService;
	private ClassesExample classesExample = new ClassesExample();
	
	@RequestMapping(value="all" , method = RequestMethod.GET)
	public String getAll(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		studentStatic = null;
		//清空搜索条件
		studentExample.clear();
		//设置页面大小
		studentExample.setPageSize(SystemContext.getPageSize());
		//设置页码
		studentExample.setPageNumber(SystemContext.getPageOffset());
		//计算一共有多少学生
		int count = studnetService.countByExample(studentExample);
		List<Student> listStudent = studnetService.selectByExample(studentExample);
		Pager<Student> studentList = new Pager<Student>(count,listStudent);
		classesExample.clear();
		classesExample.setPageNumber(0);
		classesExample.setPageSize(Integer.MAX_VALUE);
		classesExample.createCriteria().andClassStateEqualTo(0);
		List<Classes> classList = classService.selectByExample(classesExample);
		model.addAttribute("classList", classList);
		model.addAttribute("studentList", studentList);
		return "student/list";
	}
	
	@RequestMapping(value = "checkstudentno/{id}/{studentId}", method = RequestMethod.GET)
	public @ResponseBody Object checkLoginName(@PathVariable String id,@PathVariable Integer studentId) {
		ajaxMsg.clear();
		studentExample.clear();
		studentExample.createCriteria().andStudentNoEqualTo(id);
		studentExample.setPageNumber(0);
		studentExample.setPageSize(Integer.MAX_VALUE);
		List<Student> list = studnetService.selectByExample(studentExample);
		if (studentId==null && list.size() > 0) {
			ajaxMsg.addHeader(MsgType.ERROR, "该学号已经存在！");
		}
		if (studentId == list.get(0).getStudentId() && list.size() > 1) {
			ajaxMsg.addHeader(MsgType.ERROR, "该学号已经存在！");
		}
		if (studentId != list.get(0).getStudentId() && list.size() > 0) {
			ajaxMsg.addHeader(MsgType.ERROR, "该学号已经存在！");
		}
		return ajaxMsg;
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		Student student;
		if(id > 0){
			student = studnetService.selectByPrimaryKey(id);
			if (student.getStudentBirth() != null) {
				String studentBirth = new SimpleDateFormat("yyyy-MM-dd")
						.format(student.getStudentBirth());
				model.addAttribute("studentBirth", studentBirth);
			}
		}else{
			student = new Student();
		}
		classesExample.clear();
		classesExample.setPageNumber(0);
		classesExample.setPageSize(Integer.MAX_VALUE);
		List<Classes> classList = classService.selectByExample(classesExample);
		model.addAttribute("classList", classList);
		model.addAttribute("student", student);
		return "student/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid Student student,BindingResult br) throws ParseException{
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "student/add";
		}
		if(id > 0){
			//修改信息
			student.setStudentId(id);
			student.setStudentPass(studnetService.selectByPrimaryKey(id).getStudentPass());
			if(student.getBirth() != null && student.getBirth().length()>0){
				student.setStudentBirth(new SimpleDateFormat("yyyy-MM-dd").parse(student.getBirth()));
			}
			student.setClassName(classService.selectByPrimaryKey(student.getClassId()).getClassName());
			studnetService.updateByPrimaryKey(student);
		}else{
			//添加信息
			student.setStudentPass(MD5.encode(student.getStudentPass()));
			if(student.getBirth() != null && student.getBirth().length()>0){
				student.setStudentBirth(new SimpleDateFormat("yyyy-MM-dd").parse(student.getBirth()));
			}
			student.setClassName(classService.selectByPrimaryKey(student.getClassId()).getClassName());
			studnetService.insert(student);
		}
		return "redirect://studentController/all.do";
	}
	
	@RequestMapping(value = "changeKey/{id}",method = RequestMethod.GET)
	public String changeKey(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		Student studentChange = studnetService.selectByPrimaryKey(id);
		model.addAttribute("student", new Student());
		model.addAttribute("studentChange", studentChange);
		return "student/key";
	}
	
	@RequestMapping(value = "changeKey/{id}",method = RequestMethod.POST)
	public String changeKeyPost(@PathVariable("id") int id,Model model,@Valid Student student,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "user/key";
		}
		if(id > 0){
			student.setStudentId(id);
			student.setStudentPass(MD5.encode(student.getStudentPass()));
			studnetService.updateByPrimaryKeySelective(student);
		}
		return "redirect://studentController/all.do";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteUser(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		Student student;
		if(id > 0){
			student = studnetService.selectByPrimaryKey(id);
			if(student.getStudentState() == 1){
				studnetService.deleteByPrimaryKey(id);
				ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
			}else{
				student = new Student();
				student.setStudentId(id);
				student.setStudentState(1);
				studnetService.updateByPrimaryKeySelective(student);
				ajaxMsg.addHeader(MsgType.WARN, "已经将学生状态设为不可用，再次删除将彻底删除！");
			}
		} else {
			ajaxMsg.addHeader(MsgType.ERROR, "该用户信息有误,不能删除");
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
			studentExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				Student studentRequest = (Student) JsonUtilTool
						.json2Object(data, Student.class);
				studentStatic = studentRequest;
				if (studentRequest != null) {
					String studentNo = Kit.ISOToUTF8(studentRequest.getStudentNo());
					String setting = Kit.ISOToUTF8(studentRequest.getStudentName());
					studentExample.clear();
					studentExample.setPageNumber(ParameterConstants.ZERO);
					studentExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					StudentExample.Criteria criteria = studentExample.createCriteria();
					if (studentNo != null && studentNo.length() > 0) {
						criteria.andStudentNoLike("%" + studentNo + "%");
					}
					if (setting != null && setting.length() > 0) {
						criteria.andStudentNameLike("%" + setting + "%");
					}
					if (studentRequest.getStudentSex() != null) {
						criteria.andStudentSexEqualTo(studentRequest.getStudentSex());
					}
					if (studentRequest.getStudentState() != null) {
						criteria.andStudentStateEqualTo(studentRequest.getStudentState());
					}
					if(studentRequest.getClassId() != null){
						criteria.andClassIdEqualTo(studentRequest.getClassId());
					}
				}
			}
			if (studentStatic != null) {
				String studentNo = Kit.ISOToUTF8(studentStatic.getStudentNo());
				String setting = Kit.ISOToUTF8(studentStatic.getStudentName());
				StudentExample.Criteria criteria = studentExample.createCriteria();
				if (studentNo != null && studentNo.length() > 0) {
					criteria.andStudentNoLike("%" + studentNo + "%");
				}
				if (setting != null && setting.length() > 0) {
					criteria.andStudentNameLike("%" + setting + "%");
				}
				if (studentStatic.getStudentSex() != null) {
					criteria.andStudentSexEqualTo(studentStatic.getStudentSex());
				}
				if (studentStatic.getStudentState() != null) {
					criteria.andStudentStateEqualTo(studentStatic.getStudentState());
				}
				if(studentStatic.getClassId() != null){
					criteria.andClassIdEqualTo(studentStatic.getClassId());
				}
				model.addAttribute("userNo", studentNo);
				model.addAttribute("userName", setting);
				model.addAttribute("userSex", studentStatic.getStudentSex());
				model.addAttribute("userState", studentStatic.getStudentState());
				model.addAttribute("classId", studentStatic.getClassId());
			}
			studentExample.setPageNumber(SystemContext.getPageOffset());
			studentExample.setPageSize(SystemContext.getPageSize());
			int count = studnetService.countByExample(studentExample);
			List<Student> listStudent = studnetService.selectByExample(studentExample);
			Pager<Student> studentList = new Pager<Student>(count,listStudent);
			studentExample.clear();
			classesExample.clear();
			classesExample.setPageNumber(0);
			classesExample.setPageSize(Integer.MAX_VALUE);
			classesExample.createCriteria().andClassStateEqualTo(0);
			List<Classes> classList = classService.selectByExample(classesExample);
			model.addAttribute("classList", classList);
			model.addAttribute("studentList", studentList);
			return "student/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "student/list";
	}
	
}
