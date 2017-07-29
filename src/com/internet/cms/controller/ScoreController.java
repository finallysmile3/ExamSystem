package com.internet.cms.controller;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
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
import com.internet.cms.model.Exam;
import com.internet.cms.model.ExamExample;
import com.internet.cms.model.Score;
import com.internet.cms.model.ScoreExample;
import com.internet.cms.model.Student;
import com.internet.cms.model.StudentExample;
import com.internet.cms.model.User;
import com.internet.cms.model.UserExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.ClassService;
import com.internet.cms.service.ExamService;
import com.internet.cms.service.ScoreService;
import com.internet.cms.service.StudentService;
import com.internet.cms.service.UserService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.ParameterConstants;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;

@Controller
@RequestMapping("scoreController")
public class ScoreController extends BaseController{
	
	private Score scoreStatic = new Score();
	private Score scoreStatic1 = new Score();
	private ScoreExample scoreExample = new ScoreExample();
	@Autowired
	private ScoreService scoreService;
	@Autowired
	private UserService userService;
	private UserExample userExamppe = new UserExample();
	@Autowired
	private StudentService studentService;
	private StudentExample studentExample = new StudentExample();
	@Autowired
	private ClassService classService;
	private ClassesExample classesExample = new ClassesExample();
	@Autowired
	private ExamService examService;
	private ExamExample examExample = new ExamExample();
	
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	
	/**
	 * 学生查看自己考试的分数
	 * @param model
	 * @return
	 */
	@RequestMapping(value="studentall" , method = RequestMethod.GET)
	public String getAllstudent(Model model){
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
		scoreStatic = null;
		scoreStatic1 = null;
		scoreExample.clear();
		scoreExample.setPageSize(Integer.MAX_VALUE);
		scoreExample.setPageNumber(0);
		scoreExample.createCriteria().andStudentIdEqualTo(student.getStudentId());
		List<Score> scoreList = scoreService.selectByExample(scoreExample);
		model.addAttribute("scoreList", scoreList);
		return "score/studentscore";
	}
	
	/**
	 * 老师跳转未阅试卷页面
	 * @param model
	 * @return
	 */
	@RequestMapping(value="toread" , method = RequestMethod.GET)
	public String toRead(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		//获取当前登录用户
		User user = new User();
		String loginName = (String)session.getAttribute("username");
		if(loginName != null &&loginName.length() > 0){
			userExamppe.clear();
			userExamppe.setPageSize(Integer.MAX_VALUE);
			userExamppe.setPageNumber(0);
			userExamppe.createCriteria().andLoginNameEqualTo(loginName);
			List<User> userList = userService.selectByExample(userExamppe);
			user = userList.get(0);
		}
		scoreStatic = null;
		scoreStatic1 = null;
		scoreExample.clear();
		scoreExample.setPageSize(SystemContext.getPageSize());
		scoreExample.setPageNumber(SystemContext.getPageOffset());
		scoreExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId()).andEssayStateEqualTo(0);
		int count = scoreService.countByExample(scoreExample);
		List<Score> listUser = scoreService.selectByExample(scoreExample);
		Pager<Score> scoreList = new Pager<Score>(count,listUser);
		classesExample.clear();
		classesExample.setPageNumber(0);
		classesExample.setPageSize(Integer.MAX_VALUE);
		classesExample.createCriteria().andClassStateEqualTo(0);
		List<Classes> classList = classService.selectByExample(classesExample);
		model.addAttribute("classList", classList);
		model.addAttribute("scoreList", scoreList);
		return "score/list";
	}
	
	/**
	 * 老师跳转已阅试卷页面
	 * 
	 * @param model
	 * @return
	 */
	@RequestMapping(value="readed" , method = RequestMethod.GET)
	public String readed(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		//获取当前登录用户
		User user = new User();
		String loginName = (String)session.getAttribute("username");
		if(loginName != null &&loginName.length() > 0){
			userExamppe.clear();
			userExamppe.setPageSize(Integer.MAX_VALUE);
			userExamppe.setPageNumber(0);
			userExamppe.createCriteria().andLoginNameEqualTo(loginName);
			List<User> userList = userService.selectByExample(userExamppe);
			user = userList.get(0);
		}
		scoreStatic = null;
		scoreStatic1 = null;
		scoreExample.clear();
		scoreExample.setPageSize(SystemContext.getPageSize());
		scoreExample.setPageNumber(SystemContext.getPageOffset());
		scoreExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId()).andEssayStateEqualTo(1);
		int count = scoreService.countByExample(scoreExample);
		List<Score> listUser = scoreService.selectByExample(scoreExample);
		Pager<Score> scoreList = new Pager<Score>(count,listUser);
		classesExample.clear();
		classesExample.setPageNumber(0);
		classesExample.setPageSize(Integer.MAX_VALUE);
		classesExample.createCriteria().andClassStateEqualTo(0);
		List<Classes> classList = classService.selectByExample(classesExample);
		model.addAttribute("classList", classList);
		model.addAttribute("scoreList", scoreList);
		return "score/list1";
	}
	
	@RequestMapping(value="tobar" , method = RequestMethod.GET)
	public String tobar(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		//获取当前登录用户
		User user = new User();
		String loginName = (String)session.getAttribute("username");
		if(loginName != null &&loginName.length() > 0){
			userExamppe.clear();
			userExamppe.setPageSize(Integer.MAX_VALUE);
			userExamppe.setPageNumber(0);
			userExamppe.createCriteria().andLoginNameEqualTo(loginName);
			List<User> userList = userService.selectByExample(userExamppe);
			user = userList.get(0);
		}
		scoreExample.clear();
		scoreExample.setPageSize(Integer.MAX_VALUE);
		scoreExample.setPageNumber(0);
		scoreExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId()).andEssayStateEqualTo(1).andClassIdEqualTo(1).andExamIdEqualTo(1);
		int count = scoreService.countByExample(scoreExample);
		List<Score> scoreList = scoreService.selectByExample(scoreExample);
		//定义50分一下的
		int a = 0;
		
		//定义50——60的
		int b = 0;
		
		//定义60——85的
		int c = 0;
		
		//定义85-100的
		int d = 0;
		
		//平均分
		int e = 0;
		int sum = 0;
		
		//不及格人数
		int f = 0;
		for(Score score : scoreList){
			if(score.getScoreSum() < 50){
				a++;
			}else if(score.getScoreSum() < 60){
				b++;
			}else if(score.getScoreSum() < 85){
				c++;
			}else{
				d++;
			}
			if(score.getScoreSum() < 60){
				f++;
			}
			sum = sum+score.getScoreSum();
		}
		if(count > 0){
			e = sum/count;
		}
		model.addAttribute("a", a);
		model.addAttribute("b", b);
		model.addAttribute("c", c);
		model.addAttribute("d", d);
		model.addAttribute("e", e);
		model.addAttribute("f", f);
		classesExample.clear();
		classesExample.setPageNumber(0);
		classesExample.setPageSize(Integer.MAX_VALUE);
		classesExample.createCriteria().andClassStateEqualTo(0);
		List<Classes> classList = classService.selectByExample(classesExample);
		model.addAttribute("classList", classList);
		examExample.clear();
		examExample.setPageNumber(0);
		examExample.setPageSize(Integer.MAX_VALUE);
		examExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId()).andExamStateEqualTo(0);
		List<Exam> examList = examService.selectByExample(examExample);
		model.addAttribute("examList", examList);
		model.addAttribute("scoreList", scoreList);
		return "score/bargraph";
	}
	
	@RequestMapping(value="tobarso" , method = RequestMethod.GET)
	public @ResponseBody Object tobarso(HttpServletRequest request,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		//获取当前登录用户
		User user = new User();
		String loginName = (String)session.getAttribute("username");
		if(loginName != null &&loginName.length() > 0){
			userExamppe.clear();
			userExamppe.setPageSize(Integer.MAX_VALUE);
			userExamppe.setPageNumber(0);
			userExamppe.createCriteria().andLoginNameEqualTo(loginName);
			List<User> userList = userService.selectByExample(userExamppe);
			user = userList.get(0);
		}
		ajaxMsg.clear();
		try {
			Map<String, Object> params = FrontHelper.transfParams(request);
			scoreExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				Score scoreRequest = (Score) JsonUtilTool.json2Object(data, Score.class);
				scoreExample.clear();
				scoreExample.setPageSize(Integer.MAX_VALUE);
				scoreExample.setPageNumber(0);
				scoreExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId()).andEssayStateEqualTo(1).andClassIdEqualTo(scoreRequest.getClassId()).andExamIdEqualTo(scoreRequest.getExamId());
				List<Score> scoreList = scoreService.selectByExample(scoreExample);
				ajaxMsg.addData("date", scoreList);
				return ajaxMsg;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return ajaxMsg;
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		Score score;
		if(id > 0){
			score = scoreService.selectByPrimaryKey(id);
		}else{
			score = new Score();
		}
		model.addAttribute("score", score);
		return "score/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid Score score,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "score/add";
		}
		if(id > 0){
			Score scoreTemp = new Score();
			scoreTemp.setScoreId(id);
			scoreTemp.setScoreEssay(score.getScoreEssay());
			scoreTemp.setEssayState(1);
			int i = scoreService.selectByPrimaryKey(id).getScoreSum();
			scoreTemp.setScoreSum(i+score.getScoreEssay());
			scoreService.updateByPrimaryKeySelective(scoreTemp);
		}
		return "redirect://scoreController/toread.do";
	}
	
	/**
	 * 未批阅试卷页面的搜索
	 * 
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "search" , method = RequestMethod.GET)
	public String selectUser(HttpServletRequest request,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		//获取当前登录用户
		User user = new User();
		String loginName = (String)session.getAttribute("username");
		if(loginName != null &&loginName.length() > 0){
			userExamppe.clear();
			userExamppe.setPageSize(Integer.MAX_VALUE);
			userExamppe.setPageNumber(0);
			userExamppe.createCriteria().andLoginNameEqualTo(loginName);
			List<User> userList = userService.selectByExample(userExamppe);
			user = userList.get(0);
		}
		try {
			Map<String, Object> params = FrontHelper.transfParams(request);
			scoreExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				Score scoreRequest = (Score) JsonUtilTool.json2Object(data, Score.class);
				//String setting = Kit.ISOToUTF8(scoreRequest.getName());
				scoreStatic = scoreRequest;
				if (scoreRequest != null) {
					String examName = Kit.ISOToUTF8(scoreRequest.getExamName());
					scoreExample.clear();
					scoreExample.setPageNumber(ParameterConstants.ZERO);
					scoreExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					ScoreExample.Criteria criteria = scoreExample.createCriteria();
					criteria.andSubjectIdEqualTo(user.getSubjectId()).andEssayStateEqualTo(0);
					if (examName != null && examName.length()>0) {
						criteria.andExamNameLike("%"+examName+"%");
					}
					if (scoreRequest.getClassId() != null) {
						criteria.andClassIdEqualTo(scoreRequest.getClassId());
					}
				}
			}
			if (scoreStatic != null) {
				String examName = Kit.ISOToUTF8(scoreStatic.getExamName());
				ScoreExample.Criteria criteria = scoreExample.createCriteria();
				criteria.andSubjectIdEqualTo(user.getSubjectId()).andEssayStateEqualTo(0);
				if (examName != null && examName.length()>0) {
					criteria.andExamNameLike("%"+examName+"%");
				}
				if (scoreStatic.getClassId() != null) {
					criteria.andClassIdEqualTo(scoreStatic.getClassId());
				}
				model.addAttribute("examName", examName);
				model.addAttribute("classId", scoreStatic.getClassId());
			}
			scoreExample.setPageNumber(SystemContext.getPageOffset());
			scoreExample.setPageSize(SystemContext.getPageSize());
			int count = scoreService.countByExample(scoreExample);
			List<Score> listUser = scoreService.selectByExample(scoreExample);
			Pager<Score> scoreList = new Pager<Score>(count,listUser);
			scoreExample.clear();
			classesExample.clear();
			classesExample.setPageNumber(0);
			classesExample.setPageSize(Integer.MAX_VALUE);
			classesExample.createCriteria().andClassStateEqualTo(0);
			List<Classes> classList = classService.selectByExample(classesExample);
			model.addAttribute("classList", classList);
			model.addAttribute("scoreList", scoreList);
			return "score/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "score/list";
	}
	
	/**
	 * 已批阅试卷页面的搜索
	 * 
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "search1" , method = RequestMethod.GET)
	public String selectUser1(HttpServletRequest request,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		//获取当前登录用户
		User user = new User();
		String loginName = (String)session.getAttribute("username");
		if(loginName != null &&loginName.length() > 0){
			userExamppe.clear();
			userExamppe.setPageSize(Integer.MAX_VALUE);
			userExamppe.setPageNumber(0);
			userExamppe.createCriteria().andLoginNameEqualTo(loginName);
			List<User> userList = userService.selectByExample(userExamppe);
			user = userList.get(0);
		}
		try {
			Map<String, Object> params = FrontHelper.transfParams(request);
			scoreExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				Score scoreRequest = (Score) JsonUtilTool.json2Object(data, Score.class);
				//String setting = Kit.ISOToUTF8(scoreRequest.getName());
				scoreStatic1 = scoreRequest;
				if (scoreRequest != null) {
					String examName = Kit.ISOToUTF8(scoreRequest.getExamName());
					scoreExample.clear();
					scoreExample.setPageNumber(ParameterConstants.ZERO);
					scoreExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					ScoreExample.Criteria criteria = scoreExample.createCriteria();
					criteria.andSubjectIdEqualTo(user.getSubjectId()).andEssayStateEqualTo(1);
					if (examName != null && examName.length()>0) {
						criteria.andExamNameLike("%"+examName+"%");
					}
					if (scoreRequest.getClassId() != null) {
						criteria.andClassIdEqualTo(scoreRequest.getClassId());
					}
				}
			}
			if (scoreStatic1 != null) {
				String examName = Kit.ISOToUTF8(scoreStatic1.getExamName());
				ScoreExample.Criteria criteria = scoreExample.createCriteria();
				criteria.andSubjectIdEqualTo(user.getSubjectId()).andEssayStateEqualTo(1);
				if (examName != null && examName.length()>0) {
					criteria.andExamNameLike("%"+examName+"%");
				}
				if (scoreStatic1.getClassId() != null) {
					criteria.andClassIdEqualTo(scoreStatic1.getClassId());
				}
				model.addAttribute("examName", examName);
				model.addAttribute("classId", scoreStatic1.getClassId());
			}
			scoreExample.setPageNumber(SystemContext.getPageOffset());
			scoreExample.setPageSize(SystemContext.getPageSize());
			int count = scoreService.countByExample(scoreExample);
			List<Score> listUser = scoreService.selectByExample(scoreExample);
			Pager<Score> scoreList = new Pager<Score>(count,listUser);
			scoreExample.clear();
			classesExample.clear();
			classesExample.setPageNumber(0);
			classesExample.setPageSize(Integer.MAX_VALUE);
			classesExample.createCriteria().andClassStateEqualTo(0);
			List<Classes> classList = classService.selectByExample(classesExample);
			model.addAttribute("classList", classList);
			model.addAttribute("scoreList", scoreList);
			return "score/list1";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "score/list1";
	}
	
	 @RequestMapping(value = "download", method = RequestMethod.GET)
     public String download(HttpServletRequest request, Model model) throws UnsupportedEncodingException {
     		if (getJspToSession(this.request.getSession()) != OK) {
     			return REDIRECT_URL;
     		}// Session超时判断
     		//获取当前登录用户
    		User user = new User();
    		String loginName = (String)session.getAttribute("username");
    		if(loginName != null &&loginName.length() > 0){
    			userExamppe.clear();
    			userExamppe.setPageSize(Integer.MAX_VALUE);
    			userExamppe.setPageNumber(0);
    			userExamppe.createCriteria().andLoginNameEqualTo(loginName);
    			List<User> userList = userService.selectByExample(userExamppe);
    			user = userList.get(0);
    		}
			// 缓存查询条件
			if (scoreStatic1 != null) {
				String examName = Kit.ISOToUTF8(scoreStatic1.getExamName());
				scoreExample.clear();
				scoreExample.setPageNumber(ParameterConstants.ZERO);
				scoreExample.setPageSize(ParameterConstants.PageSizeConstantMin);
				ScoreExample.Criteria criteria = scoreExample.createCriteria();
				criteria.andSubjectIdEqualTo(user.getSubjectId()).andEssayStateEqualTo(1);
				if (examName != null && examName.length()>0) {
					criteria.andExamNameLike("%"+examName+"%");
				}
				if (scoreStatic1.getClassId() != null) {
					criteria.andExamIdEqualTo(scoreStatic1.getClassId());
				}
				
			}
			scoreExample.setPageNumber(0);
			scoreExample.setPageSize(Integer.MAX_VALUE);
			scoreExample.setOrderByClause("student_no asc");
     		String name="分数统计"+new SimpleDateFormat("yyyy-MM-dd").format(new Date());
     		String sourceName2 =name+"-"+new SimpleDateFormat("yyyy.MM.dd").format(new Date());
     		String sourceName =name+"-"+new SimpleDateFormat("yyyy.MM.dd").format(new Date())+ ".xls";
     		String base = request.getSession().getServletContext().getRealPath("/")
     				+ "score" + File.separator + "upload";
     		List<Score> downTableList = scoreService.selectByExample(scoreExample);
     
     		File file = new File(base);
     		if (!file.exists()) {
     			file.mkdirs();
     		}
     		try {
     			String path = base + File.separator + sourceName;
     			File f = new File(path);
     			WritableWorkbook write = Workbook.createWorkbook(f);
     			WritableSheet sheet = write.createSheet("1", 0);
     
     			Label zeroLabel = new Label(0, 0, "班级");
     			Label oneLabel = new Label(1, 0, "学号");
     			Label twoLabel = new Label(2, 0, "姓名");
     			Label threeLabel = new Label(3, 0, "客观题得分");
     			Label fourLabel = new Label(4, 0, "简答题得分");
     			Label fiveLabel = new Label(5, 0, "总分");
     
     			sheet.addCell(zeroLabel);
     			sheet.addCell(oneLabel);
     			sheet.addCell(twoLabel);
     			sheet.addCell(threeLabel);
     			sheet.addCell(fourLabel);
     			sheet.addCell(fiveLabel);
     			//总分
     			int sum = 0;
     			int bujige = 0;
     			if (downTableList.size() > 0) {
     				for (int i = 0; i < downTableList.size(); i++) {
     					sheet.setColumnView(0, 15);
     					sheet.setColumnView(1, 15);
     					sheet.setColumnView(2, 15);
     					sheet.setColumnView(3, 15);
     					sheet.setColumnView(4, 15);
     					sheet.setColumnView(5, 15);
     					Score downTable = downTableList.get(i);
     					sum += downTable.getScoreSum();
     					if(downTable.getScoreSum() < 60){
     						bujige++;
     					}
     					if (downTable.getClassName() != null&&downTable.getClassName() !="") {
     						Label allMonth = new Label(0, i + 1,downTable.getClassName());
     						sheet.addCell(allMonth);
     					}
     					if (downTable.getStudentNo() != null) {
     						Label countNum = new Label(1, i + 1,downTable.getStudentNo());
     						sheet.addCell(countNum);
     					}
     					if (downTable.getStudentName() != null) {
     						Label countNum = new Label(2, i + 1,downTable.getStudentName());
     						sheet.addCell(countNum);
     					}
     					if (downTable.getScoreChoice() != null) {
     						Label countNum = new Label(3, i + 1,downTable.getScoreChoice().toString());
     						sheet.addCell(countNum);
     					}
     					if (downTable.getScoreEssay() != null) {
     						Label countNum = new Label(4, i + 1,downTable.getScoreEssay().toString());
     						sheet.addCell(countNum);
     					}
     					if (downTable.getScoreSum() != null) {
     						Label countNum = new Label(5, i + 1,downTable.getScoreSum().toString());
     						sheet.addCell(countNum);
     					}
     					//平均分
     					Label average = new Label(4, downTableList.size() + 1,"平均分：");
 						sheet.addCell(average);
 						int aaa = sum/downTableList.size();
 						Label averagescore = new Label(5, downTableList.size() + 1,String.valueOf(aaa));
 						sheet.addCell(averagescore);
 						//不及格人数计算
 						Label notpass = new Label(4, downTableList.size() + 2,"不及格人数：");
 						sheet.addCell(notpass);
 						Label nopass = new Label(5, downTableList.size() + 2,String.valueOf(bujige));
 						sheet.addCell(nopass);
     				}
     			}
     			write.write();
     			write.close();
     			return "redirect:/download/downLoad/" + URLEncoder.encode(sourceName2,"UTF-8") + ".do";
     
     		} catch (RowsExceededException e) {
     			e.printStackTrace();
     		} catch (WriteException e) {
     			e.printStackTrace();
     		} catch (IOException e) {
     			e.printStackTrace();
     		}
     		return "redirect:/download/downLoad/" + URLEncoder.encode(sourceName2,"UTF-8") + ".do";
		}
}
