package com.internet.cms.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.internet.cms.model.Student;
import com.internet.cms.model.StudentExample;
import com.internet.cms.model.User;
import com.internet.cms.model.UserExample;
import com.internet.cms.service.StudentService;
import com.internet.cms.service.UserService;
import com.internet.cms.util.Captcha;
import com.internet.cms.util.CmsSessionContext;
import com.internet.cms.util.MD5;
@Controller
@RequestMapping("loginController")

public class LoginController extends BaseController{
	private UserExample userExample = new UserExample();
	@Autowired
	private UserService userService;
	@Autowired
	private StudentService studentService;
	private StudentExample studentExample = new StudentExample();
	
	@RequestMapping("/logout")
	public String logout(HttpSession session) {
		CmsSessionContext.removeSession(session);
		session.invalidate();
		return "redirect:/loginController/index.do";
	}
	
	@RequestMapping("/redirect")
	public String redirect(HttpSession session) {
		return "admin/redirect";
	}
	
	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String login() {
		return "admin/login";
	}

	@RequestMapping(value = "/index", method = RequestMethod.POST)
	public String login(String username, String password, String checkcode,int usert,
			Model model, HttpSession session) {
		String cc = (String) session.getAttribute("cc");
		if (!checkcode.equals(cc)) {
			model.addAttribute("name", username);
			model.addAttribute("error", "验证码出错，请重新输入");
			return "admin/login";
		}
		if(username == null || username.length() == 0){
			model.addAttribute("name", username);
			model.addAttribute("error", "用户名为空，请重新输入");
			return "admin/login";
		}
		if(password == null || password.length() == 0){
			model.addAttribute("name", username);
			model.addAttribute("error", "密码为空，请重新输入");
			return "admin/login";
		}
		if(usert == 0){
			//管理员、老师登录
			userExample.clear();
			userExample.setPageNumber(0);
			userExample.setPageSize(Integer.MAX_VALUE);
			userExample.createCriteria().andLoginNameEqualTo(username);
			List<User> userList = userService.selectByExample(userExample);
			if(userList.size() == 0){
				model.addAttribute("name", username);
				model.addAttribute("error", "用户名不存在，请重新输入");
				return "admin/login";
			}else{
				String userPass = MD5.encode(password);
				if(!userPass.equals(userList.get(0).getUserPass())){
					model.addAttribute("name", username);
					model.addAttribute("error", "密码错误，请重新输入");
					return "admin/login";
				}else if(userList.get(0).getUserState() == 1){
					model.addAttribute("name", username);
					model.addAttribute("error", "该用户已经失效，请联系管理员");
					return "admin/login";
				}
			}
			session.removeAttribute("cc");
			session.setAttribute("username", username);
			//标记为管理员为0、老师为1
			session.setAttribute("typeuser", userList.get(0).getUserType());
			String loginname = userList.get(0).getUserName();
			session.setAttribute("loginname", loginname);
		}else{
			///学生登录
			studentExample.clear();
			studentExample.setPageNumber(0);
			studentExample.setPageSize(Integer.MAX_VALUE);
			studentExample.createCriteria().andStudentNoEqualTo(username);
			List<Student> studentList = studentService.selectByExample(studentExample);
			if(studentList.size() == 0){
				model.addAttribute("name", username);
				model.addAttribute("error", "用户名不存在，请重新输入");
				return "admin/login";
			}else{
				String userPass = MD5.encode(password);
				if(!userPass.equals(studentList.get(0).getStudentPass())){
					model.addAttribute("name", username);
					model.addAttribute("error", "密码错误，请重新输入");
					return "admin/login";
				}else if(studentList.get(0).getStudentState() == 1){
					model.addAttribute("name", username);
					model.addAttribute("error", "该学生已经失效，请联系管理员");
					return "admin/login";
				}
			}
			session.removeAttribute("cc");
			session.setAttribute("username", username);
			//标记为学生
			session.setAttribute("typeuser", 2);
			String loginname = studentList.get(0).getStudentName();
			session.setAttribute("loginname", loginname);
		}
		CmsSessionContext.addSessoin(session);
		return "redirect://userController/login.do";
	}
	@RequestMapping("/drawCheckCode")
	public void drawCheckCode(HttpServletResponse resp, HttpSession session)
			throws IOException {
		resp.setContentType("image/jpg");
		int width = 200;
		int height = 30;
		Captcha c = Captcha.getInstance();
		c.set(width, height);
		String checkcode = c.generateCheckcode();
		session.setAttribute("cc", checkcode);
		OutputStream os = resp.getOutputStream();
		ImageIO.write(c.generateCheckImg(checkcode), "jpg", os);
	}
	
	
	/***
	 * //生成随机字符串
	 * @return
	 */
		public String randString()
		{
		   String result="";
		   Random r = new Random();
			  while(true){
			  	int x = r.nextInt(999999);
			  if(x > 99999){
				  result=String.valueOf(x);
				  break;
			  }
			  }
			  return result;
		}
}
