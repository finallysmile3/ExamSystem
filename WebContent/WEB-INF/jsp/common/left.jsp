<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- #section:basics/sidebar -->
			<div id="sidebar" class="sidebar responsive">
				<ul class="nav nav-list">
					<li class="active">
						<a href="#">
							<i class="menu-icon fa fa-desktop"></i>
							<span class="menu-text"> 查看首页 </span>
						</a>

						<b class="arrow"></b>
					</li>
					<c:if test="${typeuser < 2}">
					<li class="">
						<a href="#" class="dropdown-toggle">
							<i class="menu-icon fa glyphicon-user fa-user"></i>
							<span class="menu-text">
								用户管理
							</span>
							<b class="arrow fa fa-angle-down"></b>
						</a>
						<b class="arrow"></b>
						<ul class="submenu">
							<c:if test="${typeuser == 0}">
							<li class="">
								<a href="<%=request.getContextPath() %>/userController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										管理员/教师
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/studentController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										学生管理
								</a>
							</li>
							</c:if>
							<li class="">
								<a href="<%=request.getContextPath() %>/userController/information.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										个人信息
								</a>
							</li>
						</ul>													
					</li>
					<c:if test="${typeuser == 0}">
					<li class="">
						<a href="#" class="dropdown-toggle">
							<i class="menu-icon fa glyphicon-user fa-bars"></i>
							<span class="menu-text">
								内容管理
							</span>
							<b class="arrow fa fa-angle-down"></b>
						</a>
						<b class="arrow"></b>
						<ul class="submenu">
							<li class="">
								<a href="<%=request.getContextPath() %>/subjectController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										科目管理
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/choiceQuestionController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										选择题管理
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/judgeQuestionController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										判断题管理
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/essayQuestionController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										简答题管理
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/pointController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										知识点管理
								</a>
							</li>
						</ul>													
					</li>
					
					<li class="">
						<a href="#" class="dropdown-toggle">
							<i class="menu-icon fa glyphicon-user fa-users"></i>
							<span class="menu-text">
								班级管理
							</span>
							<b class="arrow fa fa-angle-down"></b>
						</a>
						<b class="arrow"></b>
						<ul class="submenu">
							<li class="">
								<a href="<%=request.getContextPath() %>/classController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										班级管理
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/roomController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										教室管理
								</a>
							</li>
						</ul>													
					</li>
					</c:if>
					<c:if test="${typeuser == 1}">
					<li class="">
						<a href="#" class="dropdown-toggle">
							<i class="menu-icon fa glyphicon-user fa-file"></i>
							<span class="menu-text">
								考试管理
							</span>
							<b class="arrow fa fa-angle-down"></b>
						</a>
						<b class="arrow"></b>
						<ul class="submenu">
							<li class="">
								<a href="<%=request.getContextPath() %>/examController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										考试安排
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/scoreController/toread.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										未批试卷
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/scoreController/readed.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										已批试卷
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/scoreController/tobar.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										分数柱状图
								</a>
							</li>
						</ul>													
					</li>
					</c:if>
					</c:if>
					<c:if test="${typeuser == 2}">
					<li class="">
						<a href="#" class="dropdown-toggle">
							<i class="menu-icon fa glyphicon-user fa-file"></i>
							<span class="menu-text">
								选择操作
							</span>
							<b class="arrow fa fa-angle-down"></b>
						</a>
						<b class="arrow"></b>
						<ul class="submenu">
							<li class="">
								<a href="<%=request.getContextPath() %>/examController/studentExam.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										进行考试
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/scoreController/studentall.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										查看分数
								</a>
							</li>
							<li class="">
								<a href="<%=request.getContextPath() %>/choiceErrorController/all.do" target="mainFrame">
									<i class="menu-icon fa fa-caret-right"></i>
										错题集
								</a>
							</li>
						</ul>													
					</li>
					</c:if>
				</ul><!-- /.nav-list -->

				<!-- #section:basics/sidebar.layout.minimize -->
				<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
					<i class="ace-icon fa fa-angle-double-left" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>
				</div>

				<!-- /section:basics/sidebar.layout.minimize -->
				<script type="text/javascript">
					try{ace.settings.check('sidebar' , 'collapsed')}catch(e){}
				</script>
			</div>