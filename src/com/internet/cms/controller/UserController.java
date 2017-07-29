package com.internet.cms.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.internet.cms.model.Subject;
import com.internet.cms.model.SubjectExample;
import com.internet.cms.model.User;
import com.internet.cms.model.UserExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.SubjectService;
import com.internet.cms.service.UserService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.MD5;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("userController")
public class UserController extends BaseController{

	private User userStatic = new User();
	private UserExample userExample = new UserExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	@Autowired
	private UserService userService;
	@Autowired
	private SubjectService subjectService;
	private SubjectExample subjectExample = new SubjectExample();
	
	@RequestMapping(value = "login", method = RequestMethod.GET)
	public String getTCustomer() {
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		return "admin/index";
	}
	
	@RequestMapping(value = "customer", method = RequestMethod.GET)
	public String customer(Model model,HttpServletRequest request) {
		model.addAttribute("osname", System.getProperty("os.name"));
		model.addAttribute("osversion", System.getProperty("os.version"));
		model.addAttribute("osarch", System.getProperty("os.arch"));
		model.addAttribute("httpversion", request.getProtocol());
		model.addAttribute("port", request.getRemotePort());
		model.addAttribute("ipaddress", request.getLocalAddr());
		model.addAttribute("localname", request.getLocalName());
		model.addAttribute("method", request.getMethod());
		return "admin/list";
	}
	
	@RequestMapping(value = "information", method = RequestMethod.GET)
	public String information(Model model,HttpSession session){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		User user;
		String loginName = (String)session.getAttribute("username");
		if(loginName != null &&loginName.length() > 0){
			userExample.clear();
			userExample.setPageSize(Integer.MAX_VALUE);
			userExample.setPageNumber(0);
			userExample.createCriteria().andLoginNameEqualTo(loginName);
			List<User> userList = userService.selectByExample(userExample);
			user = userList.get(0);
		}else{
			user = new User();
		}
		model.addAttribute("user", user);
		return "personal/information";
	}
	
	@RequestMapping(value = "information" , method = RequestMethod.POST)
	public String information(@Valid User user,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "personal/information";
		}
		if(user.getUserId() > 0){
			user.setLoginName(userService.selectByPrimaryKey(user.getUserId()).getLoginName());
			user.setUserPass(userService.selectByPrimaryKey(user.getUserId()).getUserPass());
			user.setUserState(userService.selectByPrimaryKey(user.getUserId()).getUserState());
			user.setUserType(userService.selectByPrimaryKey(user.getUserId()).getUserType());
			user.setSubjectId(userService.selectByPrimaryKey(user.getUserId()).getSubjectId());
			user.setSubjectName(userService.selectByPrimaryKey(user.getUserId()).getSubjectName());
			userService.updateByPrimaryKey(user);
		}
		return "redirect://userController/information.do";
	}
	
	@RequestMapping(value="all" , method = RequestMethod.GET)
	public String getAll(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		userStatic = null;
		userExample.clear();
		userExample.setPageSize(SystemContext.getPageSize());
		userExample.setPageNumber(SystemContext.getPageOffset());
		int count = userService.countByExample(userExample);
		List<User> listUser = userService.selectByExample(userExample);
		Pager<User> userList = new Pager<User>(count,listUser);
		model.addAttribute("userList", userList);
		return "user/list";
	}
	
	@RequestMapping(value = "checkLogin/{id}/{realId}", method = RequestMethod.GET)
	public @ResponseBody Object checkLoginName(@PathVariable String id,@PathVariable Integer realId) {
		ajaxMsg.clear();
		userExample.clear();
		userExample.createCriteria().andLoginNameEqualTo(id);
		userExample.setPageNumber(0);
		userExample.setPageSize(Integer.MAX_VALUE);
		List<User> list = userService.selectByExample(userExample);
		if (realId == null && list.size() > 0) {
			ajaxMsg.addHeader(MsgType.ERROR, "该工号已经存在！");
		}
		if (realId == list.get(0).getUserId() && list.size() > 1) {
			ajaxMsg.addHeader(MsgType.ERROR, "该工号已经存在！");
		}
		if (realId != list.get(0).getUserId() && list.size() > 0) {
			ajaxMsg.addHeader(MsgType.ERROR, "该工号已经存在！");
		}
		return ajaxMsg;
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		User user;
		if(id > 0){
			user = userService.selectByPrimaryKey(id);
		}else{
			user = new User();
		}
		subjectExample.clear();
		subjectExample.setPageNumber(0);
		subjectExample.setPageSize(Integer.MAX_VALUE);
		subjectExample.createCriteria().andSubjectStateEqualTo(0);
		List<Subject> subjectList = subjectService.selectByExample(subjectExample);
		model.addAttribute("subjectList", subjectList);
		model.addAttribute("user", user);
		return "user/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid User user,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "user/add";
		}
		if(user.getSubjectId() != null){
			user.setSubjectName(subjectService.selectByPrimaryKey(user.getSubjectId()).getSubjectName());
		}
		if(id > 0){
			//修改信息
			user.setUserId(id);
			user.setUserPass(userService.selectByPrimaryKey(id).getUserPass());
			userService.updateByPrimaryKey(user);
		}else{
			//添加信息
			user.setUserPass(MD5.encode(user.getUserPass()));
			userService.insert(user);
		}
		return "redirect://userController/all.do";
	}
	
	@RequestMapping(value = "changeKey/{id}",method = RequestMethod.GET)
	public String changeKey(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		User userChange = userService.selectByPrimaryKey(id);
		model.addAttribute("user", new User());
		model.addAttribute("userChange", userChange);
		return "user/key";
	}
	
	@RequestMapping(value = "changeKey/{id}",method = RequestMethod.POST)
	public String changeKeyPost(@PathVariable("id") int id,Model model,@Valid User user,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "user/key";
		}
		if(id > 0){
			user.setUserId(id);
			user.setUserPass(MD5.encode(user.getUserPass()));
			userService.updateByPrimaryKeySelective(user);
		}
		return "redirect://userController/all.do";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteUser(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		User user;
		if(id > 0){
			user = userService.selectByPrimaryKey(id);
			if(user.getUserState() == 1){
				userService.deleteByPrimaryKey(id);
				ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
			}else{
				user = new User();
				user.setUserId(id);
				user.setUserState(1);
				userService.updateByPrimaryKeySelective(user);
				ajaxMsg.addHeader(MsgType.WARN, "已经将用户状态设为不可用，再次删除将彻底删除！");
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
			userExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				User userRequest = (User) JsonUtilTool.json2Object(data, User.class);
				//String setting = Kit.ISOToUTF8(userRequest.getName());
				userStatic = userRequest;
				if (userRequest != null) {
					String loginName = Kit.ISOToUTF8(userRequest.getLoginName());
					String setting = Kit.ISOToUTF8(userRequest.getUserName());
					userExample.clear();
					userExample.setPageNumber(ParameterConstants.ZERO);
					userExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					UserExample.Criteria criteria = userExample.createCriteria();
					if (loginName != null && loginName.length() > 0) {
						criteria.andLoginNameLike("%" + loginName + "%");
					}
					if (setting != null && setting.length() > 0) {
						criteria.andUserNameLike("%" + setting + "%");
					}
					if (userRequest.getUserSex() != null) {
						criteria.andUserSexEqualTo(userRequest.getUserSex());
					}
					if (userRequest.getUserType() != null) {
						criteria.andUserTypeEqualTo(userRequest.getUserType());
					}
					if (userRequest.getUserState() != null) {
						criteria.andUserStateEqualTo(userRequest.getUserState());
					}
				}
			}
			if (userStatic != null) {
				String loginName = Kit.ISOToUTF8(userStatic.getLoginName());
				String setting = Kit.ISOToUTF8(userStatic.getUserName());
				UserExample.Criteria criteria = userExample.createCriteria();
				if (loginName != null && loginName.length() > 0) {
					criteria.andLoginNameLike("%" + loginName + "%");
				}
				if (setting != null && setting.length() > 0) {
					criteria.andUserNameLike("%" + setting + "%");
				}
				if (userStatic.getUserSex() != null) {
					criteria.andUserSexEqualTo(userStatic.getUserSex());
				}
				if (userStatic.getUserType() != null) {
					criteria.andUserTypeEqualTo(userStatic.getUserType());
				}
				if (userStatic.getUserState() != null) {
					criteria.andUserStateEqualTo(userStatic.getUserState());
				}
				model.addAttribute("userNo", loginName);
				model.addAttribute("userName", setting);
				model.addAttribute("userSex", userStatic.getUserSex());
				model.addAttribute("userType", userStatic.getUserType());
				model.addAttribute("userState", userStatic.getUserState());
			}
			userExample.setPageNumber(SystemContext.getPageOffset());
			userExample.setPageSize(SystemContext.getPageSize());
			int count = userService.countByExample(userExample);
			List<User> listUser = userService.selectByExample(userExample);
			Pager<User> userList = new Pager<User>(count,listUser);
			userExample.clear();
			model.addAttribute("userList", userList);
			return "user/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "user/list";
	}
}
