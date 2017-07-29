package com.internet.cms.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.internet.cms.model.ChoiceError;
import com.internet.cms.model.ChoiceErrorExample;
import com.internet.cms.model.ChoiceQuestion;
import com.internet.cms.model.ChoiceQuestionExample;
import com.internet.cms.model.Classes;
import com.internet.cms.model.ClassesExample;
import com.internet.cms.model.EssayQuestion;
import com.internet.cms.model.EssayQuestionExample;
import com.internet.cms.model.Exam;
import com.internet.cms.model.ExamExample;
import com.internet.cms.model.JudgeQuestion;
import com.internet.cms.model.JudgeQuestionExample;
import com.internet.cms.model.Point;
import com.internet.cms.model.Room;
import com.internet.cms.model.RoomExample;
import com.internet.cms.model.Score;
import com.internet.cms.model.ScoreExample;
import com.internet.cms.model.Student;
import com.internet.cms.model.StudentExample;
import com.internet.cms.model.Subject;
import com.internet.cms.model.SubjectExample;
import com.internet.cms.model.User;
import com.internet.cms.model.UserExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.ChoiceErrorService;
import com.internet.cms.service.ChoiceQuestionService;
import com.internet.cms.service.ClassService;
import com.internet.cms.service.EssayQuestionService;
import com.internet.cms.service.ExamService;
import com.internet.cms.service.JudgeQuestionService;
import com.internet.cms.service.RoomService;
import com.internet.cms.service.ScoreService;
import com.internet.cms.service.StudentService;
import com.internet.cms.service.SubjectService;
import com.internet.cms.service.UserService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("examController")
public class ExamController extends BaseController{

	private Exam examStatic = new Exam();
	private ExamExample examExample = new ExamExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	@Autowired
	private ExamService examService;
	@Autowired
	private ClassService classService;
	private ClassesExample classesExample = new ClassesExample();
	@Autowired
	private SubjectService subjectService;
	private SubjectExample subjectExample = new SubjectExample();
	@Autowired
	private RoomService roomService;
	private RoomExample roomExample = new RoomExample();
	@Autowired
	private UserService userService;
	private UserExample userExamppe = new UserExample();
	@Autowired
	private StudentService studentService;
	private StudentExample studentExample = new StudentExample();
	@Autowired
	private ScoreService scoreService;
	private ScoreExample scoreExample = new ScoreExample();
	@Autowired
	private ChoiceQuestionService choiceQuestionService;
	private ChoiceQuestionExample choiceQuestionExample = new ChoiceQuestionExample();
	@Autowired
	private JudgeQuestionService judgeQuestionService;
	private JudgeQuestionExample judgeQuestionExample = new JudgeQuestionExample();
	@Autowired
	private EssayQuestionService essayQuestionService;
	private EssayQuestionExample essayQuestionExample = new EssayQuestionExample();
	@Autowired
	private ChoiceErrorService choiceErrorService;
	private ChoiceErrorExample choiceErrorExample = new ChoiceErrorExample();
	
	@RequestMapping(value="all" , method = RequestMethod.GET)
	public String getAll(Model model){
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
		//是否可以添加考试信息 0.可以； 1.不行
		if(user.getSubjectId() != null){
			model.addAttribute("canAdd", 0);
		}else{
			model.addAttribute("canAdd", 1);
		}
		examStatic = null;
		examExample.clear();
		examExample.setPageSize(SystemContext.getPageSize());
		examExample.setPageNumber(SystemContext.getPageOffset());
		examExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId());
		int count = examService.countByExample(examExample);
		List<Exam> listExam = examService.selectByExample(examExample);
		//是否可以编辑删除：0.可以 1.不行
		for(Exam exam : listExam){
			if(exam.getUserId() != user.getUserId()){
				exam.setEdit(1);
			}else{
				exam.setEdit(0);
			}
		}
		Pager<Exam> examList = new Pager<Exam>(count,listExam);
		classesExample.clear();
		classesExample.setPageNumber(0);
		classesExample.setPageSize(Integer.MAX_VALUE);
		classesExample.createCriteria().andClassStateEqualTo(0);
		List<Classes> classList = classService.selectByExample(classesExample);
		model.addAttribute("classList", classList);
		model.addAttribute("examList", examList);
		return "exam/list";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
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
		Exam exam;
		if(id > 0){
			exam = examService.selectByPrimaryKey(id);
			if(exam.getExamDate() != null){
				String examDate = new SimpleDateFormat("yyyy-MM-dd")
				.format(exam.getExamDate());
				exam.setExamDateTemp(examDate);
				String start = new SimpleDateFormat("HH:mm:ss")
						.format(exam.getStartTime());
				exam.setStart(start);
				String end = new SimpleDateFormat("HH:mm:ss")
						.format(exam.getEndTime());
				exam.setEnd(end);
			}
		}else{
			exam = new Exam();
		}
		classesExample.clear();
		classesExample.setPageNumber(0);
		classesExample.setPageSize(Integer.MAX_VALUE);
		classesExample.createCriteria().andClassStateEqualTo(0);
		List<Classes> classList = classService.selectByExample(classesExample);
		model.addAttribute("classList", classList);
		roomExample.clear();
		roomExample.setPageNumber(0);
		roomExample.setPageSize(Integer.MAX_VALUE);
		roomExample.createCriteria().andRoomStateEqualTo(0);
		List<Room> roomList = roomService.selectByExample(roomExample);
		model.addAttribute("roomList", roomList);
		//单选题数量
		choiceQuestionExample.clear();
		choiceQuestionExample.setPageNumber(0);
		choiceQuestionExample.setPageSize(Integer.MAX_VALUE);
		choiceQuestionExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId()).andQuestionStateEqualTo(0).andQuestionTypeEqualTo(0);
		List<ChoiceQuestion> radio = choiceQuestionService.selectByExample(choiceQuestionExample);
		//多选题数量
		choiceQuestionExample.clear();
		choiceQuestionExample.setPageNumber(0);
		choiceQuestionExample.setPageSize(Integer.MAX_VALUE);
		choiceQuestionExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId()).andQuestionStateEqualTo(0).andQuestionTypeEqualTo(1);
		List<ChoiceQuestion> check = choiceQuestionService.selectByExample(choiceQuestionExample);
		//判断题数量
		judgeQuestionExample.clear();
		judgeQuestionExample.setPageNumber(0);
		judgeQuestionExample.setPageSize(Integer.MAX_VALUE);
		judgeQuestionExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId());
		List<JudgeQuestion> judge = judgeQuestionService.selectByExample(judgeQuestionExample);
		//简答题数量
		essayQuestionExample.clear();
		essayQuestionExample.setPageNumber(0);
		essayQuestionExample.setPageSize(Integer.MAX_VALUE);
		essayQuestionExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId()).andQuestionStateEqualTo(0);
		List<EssayQuestion> essay = essayQuestionService.selectByExample(essayQuestionExample);
		
		//传到前台简答题的题型
		switch (user.getSubjectId()) {
		case 1:
			model.addAttribute("essaytype", "编程题");
			break;
		case 2:
			model.addAttribute("essaytype", "问答题");
			break;
		case 3:
			model.addAttribute("essaytype", "问答题");
			break;
		case 4:
			model.addAttribute("essaytype", "编程题");
			break;
		case 5:
			model.addAttribute("essaytype", "翻译题");
			break;
		case 6:
			model.addAttribute("essaytype", "问答题");
			break;
		case 7:
			model.addAttribute("essaytype", "设计题");
			break;
		default:
			model.addAttribute("essaytype", "简答题");
			break;
		}
		
		model.addAttribute("radionumber", radio.size());
		model.addAttribute("checknumber", check.size());
		model.addAttribute("judgenumber", judge.size());
		model.addAttribute("essaynumber", essay.size());
		model.addAttribute("exam", exam);
		return "exam/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid Exam exam,BindingResult br) throws ParseException{
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "exam/add";
		}
		if(exam.getExamDateTemp() != null && exam.getExamDateTemp().length()>0){
			exam.setExamDate(new SimpleDateFormat("yyyy-MM-dd").parse(exam.getExamDateTemp()));
		}
		if(exam.getStart() != null && exam.getStart().length()>0){
			exam.setStartTime(new SimpleDateFormat("HH:mm:ss").parse(exam.getStart()));
		}
		if(exam.getEnd() != null && exam.getEnd().length()>0){
			exam.setEndTime(new SimpleDateFormat("HH:mm:ss").parse(exam.getEnd()));
		}
		exam.setClassName(classService.selectByPrimaryKey(exam.getClassId()).getClassName());
		exam.setRoomName(roomService.selectByPrimaryKey(exam.getRoomId()).getRoomName());
		
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
		if(id > 0){
			//修改
			exam.setExamId(id);
			exam.setUserId(examService.selectByPrimaryKey(id).getUserId());
			exam.setUserName(examService.selectByPrimaryKey(id).getUserName());
			exam.setSubjectId(examService.selectByPrimaryKey(id).getSubjectId());
			exam.setSubjectName(examService.selectByPrimaryKey(id).getSubjectName());
			examService.updateByPrimaryKey(exam);
		}else{
			//添加
			exam.setUserId(user.getUserId());
			exam.setUserName(user.getUserName());
			exam.setSubjectId(user.getSubjectId());
			exam.setSubjectName(user.getSubjectName());
			examService.insert(exam);
		}
		return "redirect://examController/all.do";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteUser(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		Exam exam;
		if(id > 0){
			exam = examService.selectByPrimaryKey(id);
			if(exam.getExamState() == 1){
				examService.deleteByPrimaryKey(id);
				ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
			}else{
				exam = new Exam();
				exam.setExamId(id);
				exam.setExamState(1);
				examService.updateByPrimaryKeySelective(exam);
				ajaxMsg.addHeader(MsgType.WARN, "已经将考试状态设为作废，再次删除将彻底删除！");
			}
		} else {
			ajaxMsg.addHeader(MsgType.ERROR, "该考试信息有误,不能删除");
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
			examExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				Exam examRequest = (Exam) JsonUtilTool.json2Object(data, Exam.class);
				//String setting = Kit.ISOToUTF8(examRequest.getName());
				examStatic = examRequest;
				if (examRequest != null) {
					String examName = Kit.ISOToUTF8(examRequest.getExamName());
					examExample.clear();
					examExample.setPageNumber(ParameterConstants.ZERO);
					examExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					ExamExample.Criteria criteria = examExample.createCriteria();
					if(examName != null && examName.length()>0){
						criteria.andExamNameLike("%"+examName+"%");
					}
					if (examRequest.getSubjectId() != null) {
						criteria.andSubjectIdEqualTo(examRequest.getSubjectId());
					}
					if (examRequest.getClassId() != null) {
						criteria.andClassIdEqualTo(examRequest.getClassId());
					}
				}
			}
			if (examStatic != null) {
				String examName = Kit.ISOToUTF8(examStatic.getExamName());
				ExamExample.Criteria criteria = examExample.createCriteria();
				if (examStatic.getSubjectId() != null) {
					criteria.andSubjectIdEqualTo(examStatic.getSubjectId());
				}
				if(examName != null && examName.length()>0){
					criteria.andExamNameLike("%"+examName+"%");
				}
				if (examStatic.getClassId() != null) {
					criteria.andClassIdEqualTo(examStatic.getClassId());
				}
				model.addAttribute("examName", examName);
				model.addAttribute("subjectId", examStatic.getSubjectId());
				model.addAttribute("classId", examStatic.getClassId());
			}
			
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
			examExample.setPageNumber(SystemContext.getPageOffset());
			examExample.setPageSize(SystemContext.getPageSize());
			examExample.createCriteria().andSubjectIdEqualTo(user.getSubjectId());
			int count = examService.countByExample(examExample);
			List<Exam> listExam = examService.selectByExample(examExample);
			
			//是否可以添加考试信息 0.可以； 1.不行
			if(user.getSubjectId() != null){
				model.addAttribute("canAdd", 0);
			}else{
				model.addAttribute("canAdd", 1);
			}
			//是否可以编辑删除：0.可以 1.不行
			for(Exam exam : listExam){
				if(exam.getUserId() != user.getUserId()){
					exam.setEdit(1);
				}else{
					exam.setEdit(0);
				}
			}
			Pager<Exam> examList = new Pager<Exam>(count,listExam);
			examExample.clear();
			classesExample.clear();
			classesExample.setPageNumber(0);
			classesExample.setPageSize(Integer.MAX_VALUE);
			classesExample.createCriteria().andClassStateEqualTo(0);
			List<Classes> classList = classService.selectByExample(classesExample);
			model.addAttribute("classList", classList);
//			subjectExample.clear();
//			subjectExample.setPageNumber(0);
//			subjectExample.setPageSize(Integer.MAX_VALUE);
//			subjectExample.createCriteria().andSubjectStateEqualTo(0);
//			List<Subject> subjectList = subjectService.selectByExample(subjectExample);
//			model.addAttribute("subjectList", subjectList);
			model.addAttribute("examList", examList);
			return "exam/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "exam/list";
	}
	
	//以下为学生的部分
	
	@RequestMapping(value="studentExam" , method = RequestMethod.GET)
	public String getExamByStudent(Model model) throws ParseException{
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		examStatic = null;
		examExample.clear();
		examExample.setPageSize(Integer.MAX_VALUE);
		examExample.setPageNumber(0);
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
		examExample.createCriteria().andClassIdEqualTo(student.getClassId()).andExamStateEqualTo(0);
		List<Exam> examList = examService.selectByExample(examExample);
		for(Exam exam : examList){
			//new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
			Date dateNow = new Date();
			String date = new SimpleDateFormat("yyyy-MM-dd").format(exam.getExamDate());
			String timebefore = new SimpleDateFormat("HH:mm:ss").format(exam.getStartTime());
			String timeend = new SimpleDateFormat("HH:mm:ss").format(exam.getEndTime());
			Date datetime1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date+" "+timebefore);
			Date datetime2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date+" "+timeend);
			if(dateNow.before(datetime1)){
				exam.setState(0);
			}else if(dateNow.before(datetime2)){
				scoreExample.clear();
				scoreExample.setPageSize(Integer.MAX_VALUE);
				scoreExample.setPageNumber(0);
				scoreExample.createCriteria().andStudentIdEqualTo(student.getStudentId()).andExamIdEqualTo(exam.getExamId());
				List<Score> scoreList = scoreService.selectByExample(scoreExample);
				if(scoreList.size() == 0){
					exam.setState(1);
				}else{
					exam.setState(2);
				}
			}else{
				exam.setState(3);
			}
			
		}
		model.addAttribute("examList", examList);
		return "studentexam/list";
	}
	
	@RequestMapping(value = "startExam/{id}",method = RequestMethod.GET)
	public String startExam(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		String orderby = "rand()";
		Exam exam = new Exam();
		if(id > 0){
			exam = examService.selectByPrimaryKey(id);
		}
		//随机出单选题
		choiceQuestionExample.clear();
		choiceQuestionExample.setPageNumber(0);
		choiceQuestionExample.setPageSize(exam.getRadioNum());
		choiceQuestionExample.setOrderByClause(orderby);
		choiceQuestionExample.createCriteria().andQuestionTypeEqualTo(0).andQuestionStateEqualTo(0).andSubjectIdEqualTo(exam.getSubjectId());
		List<ChoiceQuestion> radioList = choiceQuestionService.selectByExample(choiceQuestionExample);
		model.addAttribute("radioList", radioList);
		
		//随机出多选题
		choiceQuestionExample.clear();
		choiceQuestionExample.setPageNumber(0);
		choiceQuestionExample.setPageSize(exam.getCheckNum());
		choiceQuestionExample.setOrderByClause(orderby);
		choiceQuestionExample.createCriteria().andQuestionTypeEqualTo(1).andQuestionStateEqualTo(0).andSubjectIdEqualTo(exam.getSubjectId());
		List<ChoiceQuestion> checkList = choiceQuestionService.selectByExample(choiceQuestionExample);
		model.addAttribute("checkList", checkList);
		
		//随机出判断题
		judgeQuestionExample.clear();
		judgeQuestionExample.setPageNumber(0);
		judgeQuestionExample.setPageSize(exam.getJudgeNum());
		judgeQuestionExample.setOrderBy(orderby);
		judgeQuestionExample.createCriteria().andSubjectIdEqualTo(exam.getSubjectId());
		List<JudgeQuestion> judgeList = judgeQuestionService.selectByExample(judgeQuestionExample);
		model.addAttribute("judgeList", judgeList);
		
		//随机出简答题
		essayQuestionExample.clear();
		essayQuestionExample.setPageNumber(0);
		essayQuestionExample.setPageSize(exam.getEssayNum());
		essayQuestionExample.setOrderByClause(orderby);
		essayQuestionExample.createCriteria().andQuestionStateEqualTo(0).andSubjectIdEqualTo(exam.getSubjectId());
		List<EssayQuestion> essayList = essayQuestionService.selectByExample(essayQuestionExample);
		model.addAttribute("essayList", essayList);
		
		//传到前台简答题的题型
			switch (essayList.get(0).getSubjectId()) {
			case 1:
				model.addAttribute("essaytype", "编程题");
				break;
			case 2:
				model.addAttribute("essaytype", "问答题");
				break;
			case 3:
				model.addAttribute("essaytype", "问答题");
				break;
			case 4:
				model.addAttribute("essaytype", "编程题");
				break;
			case 5:
				model.addAttribute("essaytype", "翻译题");
				break;
			case 6:
				model.addAttribute("essaytype", "问答题");
				break;
			case 7:
				model.addAttribute("essaytype", "设计题");
				break;
			default:
				model.addAttribute("essaytype", "简答题");
				break;
			}
		
		model.addAttribute("exam", exam);
		return "studentexam/list2";
	}
	
	@RequestMapping(value = "startExam/{id}",method = RequestMethod.POST)
	public String startExamPost(@PathVariable("id") int id,String[] count1,String[] count2,String[] count3,String[] count4){
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
		int score = 0;
		Exam exam = new Exam();
		Score scoreobject = new Score();
		if(id > 0){
			exam = examService.selectByPrimaryKey(id);
		}
		if(count1 != null && count1.length != 0){
			//计算单选题的分数
			for(String radioId : count1){
				String radioanswer = request.getParameter(radioId);
				ChoiceQuestion radio = choiceQuestionService.selectByPrimaryKey(Integer.parseInt(radioId));
				if(radio.getCorrectOption().equals(radioanswer)){
					score += exam.getRadioScore();
				}else{
					//添加到错题集
					ChoiceError choiceError = new ChoiceError();
					choiceError.setQuestionName(radio.getQuestionName());
					choiceError.setQuestionType(radio.getQuestionType());
					choiceError.setQuestionOptionA(radio.getQuestionOptionA());
					choiceError.setQuestionOptionB(radio.getQuestionOptionB());
					choiceError.setQuestionOptionC(radio.getQuestionOptionC());
					choiceError.setQuestionOptionD(radio.getQuestionOptionD());
					choiceError.setCorrectOption(radio.getCorrectOption());
					choiceError.setPointId(radio.getPointId());
					choiceError.setPointName(radio.getPointName());
					choiceError.setSubjectId(radio.getSubjectId());
					choiceError.setSubjectName(radio.getSubjectName());
					choiceError.setStudentId(student.getStudentId());
					choiceError.setStudentName(student.getStudentName());
					choiceErrorService.insert(choiceError);
				}
			}
		}
		
		if(count2 != null && count2.length != 0){
			//计算多选题分数
			for(String checkId : count2){
				String[] checkarray = request.getParameterValues(checkId);
				String checkanswer = StringUtils.join(checkarray,",");
				ChoiceQuestion check = choiceQuestionService.selectByPrimaryKey(Integer.parseInt(checkId));
				//全对的情况
				if(check.getCorrectOption().equals(checkanswer)){
					score += exam.getCheckScore();
				}else{
					//添加到错题集
					ChoiceError choiceError = new ChoiceError();
					choiceError.setQuestionName(check.getQuestionName());
					choiceError.setQuestionType(check.getQuestionType());
					choiceError.setQuestionOptionA(check.getQuestionOptionA());
					choiceError.setQuestionOptionB(check.getQuestionOptionB());
					choiceError.setQuestionOptionC(check.getQuestionOptionC());
					choiceError.setQuestionOptionD(check.getQuestionOptionD());
					choiceError.setCorrectOption(check.getCorrectOption());
					choiceError.setPointId(check.getPointId());
					choiceError.setPointName(check.getPointName());
					choiceError.setSubjectId(check.getSubjectId());
					choiceError.setSubjectName(check.getSubjectName());
					choiceError.setStudentId(student.getStudentId());
					choiceError.setStudentName(student.getStudentName());
					choiceErrorService.insert(choiceError);
					
					if(checkarray != null){
						Boolean is = false;
						String answer = check.getCorrectOption();
						for(String character : checkarray){
							if(answer.indexOf(character) == -1){
								//有错的话is为true,漏选情况的话is为false
								is = true;
							}
						}
						if(is == false){
							score = score + exam.getCheckScore()/2;
						}
					}
				
				}
			}
		}
		
		//计算判断题分数
		if(count3 != null && count3.length != 0){
			//计算单选题的分数
			for(String judgeId : count3){
				StringBuffer sb = new StringBuffer(judgeId);
				sb.deleteCharAt(0);
				String judgeIdString = sb.toString();
				String judgeanswer = request.getParameter(judgeId);
				JudgeQuestion judge = judgeQuestionService.selectByPrimaryKey(Integer.parseInt(judgeIdString));
				if(judge.getCorrectAnswer().equals(judgeanswer)){
					score += exam.getRadioScore();
				}
			}
		}
		
		//获取简答题写的答案 存入数据库
		if(count4 != null && count4.length != 0){
			StringBuffer sb = new StringBuffer();
			sb.append("简答题一共"+exam.getEssayNum()+"道，每道题"+exam.getEssayScore()+"分。<p>");
			for(String essayId : count4){
				StringBuffer bbb = new StringBuffer(essayId);
				bbb.deleteCharAt(0);
				String aaa = bbb.toString();
				String essayanswer = request.getParameter(essayId);
				EssayQuestion essay = essayQuestionService.selectByPrimaryKey(Integer.parseInt(aaa));
				sb.append(essay.getQuestionName()+"<p>");
				sb.append("答："+essayanswer+"<p>");
				sb.append("参考答案：<p>"+essay.getQuestionAnswer()+"<p><p>");
			}
			String essayquestion = sb.toString();
			//简答题的回答存入对象中
			scoreobject.setEssayQuestion(essayquestion);
		}
		scoreobject.setScoreChoice(score);
		scoreobject.setEssayState(0);
		scoreobject.setScoreSum(score);
		scoreobject.setStudentId(student.getStudentId());
		scoreobject.setStudentNo(student.getStudentNo());
		scoreobject.setStudentName(student.getStudentName());
		scoreobject.setExamId(exam.getExamId());
		scoreobject.setExamName(exam.getExamName());
		scoreobject.setSubjectId(exam.getSubjectId());
		scoreobject.setSubjectName(exam.getSubjectName());
		scoreobject.setClassId(exam.getClassId());
		scoreobject.setClassName(exam.getClassName());
		scoreobject.setSubmitTime(new Date());
		scoreService.insertSelective(scoreobject);
		return "redirect://examController/studentExam.do";
	}
}
