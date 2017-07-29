<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
<%@ include file="../common/common_css.jsp"%>
</head>
<body class="no-skin">

	<div class="main-content-inner">
		<!-- #section:basics/content.breadcrumbs -->
		<div class="breadcrumbs" id="breadcrumbs">
			<script type="text/javascript">
				try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
			</script>

			<ul class="breadcrumb">
				<li>
					<i class="ace-icon fa fa-home home-icon"></i>
					<a href="#">首页</a>
				</li>
				<li class="active">后台管理</li>
			</ul><!-- /.breadcrumb -->

			<!-- #section:basics/content.searchbox -->
			<div class="nav-search" id="nav-search">
				<form class="form-search">
					<span class="input-icon">
						<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" />
						<i class="ace-icon fa fa-search nav-search-icon"></i>
					</span>
				</form>
			</div><!-- /.nav-search -->

			<!-- /section:basics/content.searchbox -->
		</div>

		<!-- /section:basics/content.breadcrumbs -->
		<div class="page-content">
			<!-- /section:settings.box -->
			<div class="page-header">
				<!-- <h1>
					欢迎使用明捷易汽车快保管理平台
				</h1> -->
			</div><!-- /.page-header -->

			<div class="row">
				<div class="col-xs-12">
					<!-- PAGE CONTENT BEGINS -->
							<div class="alert alert-block alert-success">
								<button type="button" class="close" data-dismiss="alert">
									<i class="ace-icon fa fa-times"></i>
								</button>

								<i class="ace-icon fa fa-check green"></i>

								<!-- 项目内容：
								<strong class="green">
									 明捷易以汽车快速保养服务端基础，集保养预约，上门取车，上门维护，视频监控四大模块，配套web端信息管理软件，手机APP软件，自动提醒车主维修保养，为车主提供非常优惠的全国连锁的一站式的服务
								</strong> -->
							</div>

							<div class="row">
								<div class="space-6"></div>

								<div class="col-sm-7 infobox-container">
									<!-- #section:pages/dashboard.infobox -->
							<div class="infobox infobox-green">
								<div class="infobox-icon">
									<i class="ace-icon fa fa-comments"></i>
								</div>

								<div class="infobox-data">
									<span class="infobox-data-number">32</span>
									<div class="infobox-content">评论 + 2</div>
								</div>

								<!-- #section:pages/dashboard.infobox.stat -->
								<div class="stat stat-success">8%</div>

								<!-- /section:pages/dashboard.infobox.stat -->
							</div>

							<div class="infobox infobox-blue">
								<div class="infobox-icon">
									<i class="ace-icon fa fa-twitter"></i>
								</div>

								<div class="infobox-data">
									<span class="infobox-data-number">11</span>
									<div class="infobox-content">关注</div>
								</div>

								<div class="badge badge-success">
									+32%
									<i class="ace-icon fa fa-arrow-up"></i>
								</div>
							</div>

							<div class="infobox infobox-pink">
								<div class="infobox-icon">
									<i class="ace-icon fa fa-shopping-cart"></i>
								</div>

								<div class="infobox-data">
									<span class="infobox-data-number">8</span>
									<div class="infobox-content">新订单</div>
								</div>
								<div class="stat stat-important">4%</div>
							</div>

							<div class="infobox infobox-red">
								<div class="infobox-icon">
									<i class="ace-icon fa fa-flask"></i>
								</div>

								<div class="infobox-data">
									<span class="infobox-data-number">7</span>
									<div class="infobox-content">任务调度</div>
								</div>
							</div>

							<div class="infobox infobox-orange2">
								<!-- #section:pages/dashboard.infobox.sparkline -->
								<div class="infobox-chart">
									<span class="sparkline" data-values="196,128,202,177,154,94,100,170,224"></span>
								</div>

								<!-- /section:pages/dashboard.infobox.sparkline -->
								<div class="infobox-data">
									<span class="infobox-data-number">6,251</span>
									<div class="infobox-content">访问量</div>
								</div>

								<div class="badge badge-success">
									7.2%
									<i class="ace-icon fa fa-arrow-up"></i>
								</div>
							</div>

							<div class="infobox infobox-blue2">
								<div class="infobox-progress">
									<!-- #section:pages/dashboard.infobox.easypiechart -->
									<div class="easy-pie-chart percentage" data-percent="42" data-size="46">
										<span class="percent">42</span>%
									</div>

									<!-- /section:pages/dashboard.infobox.easypiechart -->
								</div>

								<div class="infobox-data">
									<span class="infobox-text">42</span>

									<div class="infobox-content">
										<span class="bigger-110">~</span>
										待完成
									</div>
								</div>
							</div>

							<!-- /section:pages/dashboard.infobox -->
							<div class="space-6"></div>

							<!-- #section:pages/dashboard.infobox.dark -->
							<div class="infobox infobox-green infobox-small infobox-dark">
								<div class="infobox-progress">
									<!-- #section:pages/dashboard.infobox.easypiechart -->
									<div class="easy-pie-chart percentage" data-percent="61" data-size="39">
										<span class="percent">61</span>%
									</div>

									<!-- /section:pages/dashboard.infobox.easypiechart -->
								</div>

								<div class="infobox-data">
									<div class="infobox-content">任务</div>
									<div class="infobox-content">完成率</div>
								</div>
							</div>

							<div class="infobox infobox-blue infobox-small infobox-dark">
								<!-- #section:pages/dashboard.infobox.sparkline -->
								<div class="infobox-chart">
									<span class="sparkline" data-values="3,4,2,3,4,4,2,2"></span>
								</div>

								<!-- /section:pages/dashboard.infobox.sparkline -->
								<div class="infobox-data">
									<div class="infobox-content">Earnings</div>
									<div class="infobox-content">$32,000</div>
								</div>
							</div>

							<div class="infobox infobox-grey infobox-small infobox-dark">
								<div class="infobox-icon">
									<i class="ace-icon fa fa-download"></i>
								</div>

								<div class="infobox-data">
									<div class="infobox-content">下载</div>
									<div class="infobox-content">1,205</div>
								</div>
							</div>

							<!-- /section:pages/dashboard.infobox.dark -->
						</div>

						<div class="vspace-12-sm"></div>

						<div class="col-sm-5">
							<div class="widget-box">
								<div class="widget-header widget-header-flat widget-header-small">
									<h5 class="widget-title">
										<i class="ace-icon fa fa-signal"></i>
										信息来源
									</h5>

									<div class="widget-toolbar no-border">
										<div class="inline dropdown-hover">
											<button class="btn btn-minier btn-primary">
												本周
												<i class="ace-icon fa fa-angle-down icon-on-right bigger-110"></i>
											</button>

											<ul class="dropdown-menu dropdown-menu-right dropdown-125 dropdown-lighter dropdown-close dropdown-caret">
												<li class="active">
													<a href="#" class="blue">
														<i class="ace-icon fa fa-caret-right bigger-110">&nbsp;</i>
														本周
													</a>
												</li>

												<li>
													<a href="#">
														<i class="ace-icon fa fa-caret-right bigger-110 invisible">&nbsp;</i>
														最近一周
													</a>
												</li>

												<li>
													<a href="#">
														<i class="ace-icon fa fa-caret-right bigger-110 invisible">&nbsp;</i>
														本月
													</a>
												</li>

												<li>
													<a href="#">
														<i class="ace-icon fa fa-caret-right bigger-110 invisible">&nbsp;</i>
														最近一个月
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>

								<div class="widget-body">
									<div class="widget-main">
										<!-- #section:plugins/charts.flotchart -->
										<div id="piechart-placeholder"></div>

										<!-- /section:plugins/charts.flotchart -->
										<div class="hr hr8 hr-double"></div>

										<div class="clearfix">
											<!-- #section:custom/extra.grid -->
											<div class="grid3">
												<span class="grey">
													<i class="ace-icon fa fa-facebook-square fa-2x blue"></i>
													&nbsp; likes
												</span>
												<h4 class="bigger pull-right">1,255</h4>
											</div>

											<div class="grid3">
												<span class="grey">
													<i class="ace-icon fa fa-twitter-square fa-2x purple"></i>
													&nbsp; tweets
												</span>
												<h4 class="bigger pull-right">941</h4>
											</div>

											<div class="grid3">
												<span class="grey">
													<i class="ace-icon fa fa-pinterest-square fa-2x red"></i>
													&nbsp; pins
												</span>
												<h4 class="bigger pull-right">1,050</h4>
											</div>

											<!-- /section:custom/extra.grid -->
										</div>
									</div><!-- /.widget-main -->
								</div><!-- /.widget-body -->
							</div><!-- /.widget-box -->
						</div><!-- /.col -->
					</div><!-- /.row -->

					<!-- #section:custom/extra.hr -->
					<div class="hr hr32 hr-dotted"></div>

					<!-- /section:custom/extra.hr -->
					<div class="row">
						<div class="col-sm-5">
							<div class="widget-box transparent">
								<div class="widget-header widget-header-flat">
									<h4 class="widget-title lighter">
										<i class="ace-icon fa fa-star orange"></i>
										网站排名
									</h4>

									<div class="widget-toolbar">
										<a href="#" data-action="collapse">
											<i class="ace-icon fa fa-chevron-up"></i>
										</a>
									</div>
								</div>

								<div class="widget-body">
									<div class="widget-main no-padding">
										<table class="table table-bordered table-striped">
											<thead class="thin-border-bottom">
												<tr>
													<th>
														<i class="ace-icon fa fa-caret-right blue"></i>name
													</th>

													<th>
														<i class="ace-icon fa fa-caret-right blue"></i>view
													</th>

													<th class="hidden-480">
														<i class="ace-icon fa fa-caret-right blue"></i>status
													</th>
												</tr>
											</thead>

											<tbody>
												<tr>
													<td>internet.net</td>

													<td>
														<b class="green">10000</b>
													</td>

													<td class="hidden-480">
														<span class="label label-info arrowed-right arrowed-in">normal</span>
													</td>
												</tr>

												<tr>
													<td>online.com</td>

													<td>
														<b class="blue">9999</b>
													</td>

													<td class="hidden-480">
														<span class="label label-success arrowed-in arrowed-in-right">normal</span>
													</td>
												</tr>

												<tr>
													<td>newnet.com</td>

													<td>
														<b class="blue">8888</b>
													</td>

													<td class="hidden-480">
														<span class="label label-danger arrowed">normal</span>
													</td>
												</tr>

												<tr>
													<td>web.com</td>

													<td>
														<b class="green">7777</b>
													</td>

													<td class="hidden-480">
														<span class="label arrowed">
															<s>out of stock</s>
														</span>
													</td>
												</tr>

												<tr>
													<td>domain.com</td>

													<td>
														<b class="blue">6666</b>
													</td>

													<td class="hidden-480">
														<span class="label label-warning arrowed arrowed-right">normal</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div><!-- /.widget-main -->
								</div><!-- /.widget-body -->
							</div><!-- /.widget-box -->
						</div><!-- /.col -->

						<div class="col-sm-7">
							<div class="widget-box transparent">
								<div class="widget-header widget-header-flat">
									<h4 class="widget-title lighter">
										<i class="ace-icon fa fa-signal"></i>
										访问量
									</h4>

									<div class="widget-toolbar">
										<a href="#" data-action="collapse">
											<i class="ace-icon fa fa-chevron-up"></i>
										</a>
									</div>
								</div>

								<div class="widget-body">
									<div class="widget-main padding-4">
										<div id="sales-charts"></div>
									</div><!-- /.widget-main -->
								</div><!-- /.widget-body -->
							</div><!-- /.widget-box -->
						</div><!-- /.col -->
					</div><!-- /.row -->

					<div class="hr hr32 hr-dotted"></div>

					<div class="row">
						<div class="col-sm-6">
							<div class="widget-box transparent" id="recent-box">
								<div class="widget-header">
									<h4 class="widget-title lighter smaller">
										<i class="ace-icon fa fa-rss orange"></i>最近
									</h4>

									<div class="widget-toolbar no-border">
										<ul class="nav nav-tabs" id="recent-tab">
											<li class="active">
												<a data-toggle="tab" href="#task-tab">我的任务</a>
											</li>

											<li>
												<a data-toggle="tab" href="#member-tab">团队成员</a>
											</li>

											<li>
												<a data-toggle="tab" href="#comment-tab">评论管理</a>
											</li>
										</ul>
									</div>
								</div>

								<div class="widget-body">
									<div class="widget-main padding-4">
										<div class="tab-content padding-8">
											<div id="task-tab" class="tab-pane active">
												<h4 class="smaller lighter green">
													<i class="ace-icon fa fa-list"></i>
													任务列表
												</h4>

												<!-- #section:pages/dashboard.tasks -->
												<ul id="tasks" class="item-list">
													<li class="item-orange clearfix">
														<label class="inline">
															<input type="checkbox" class="ace" />
															<span class="lbl"> 这是一条测试任务，请您反馈进度~</span>
														</label>

														<div class="pull-right easy-pie-chart percentage" data-size="30" data-color="#ECCB71" data-percent="42">
															<span class="percent">42</span>%
														</div>
													</li>

													<li class="item-red clearfix">
														<label class="inline">
															<input type="checkbox" class="ace" />
															<span class="lbl"> 这是一条测试任务，请您反馈进度~</span>
														</label>

														<!-- #section:custom/extra.action-buttons -->
														<div class="pull-right action-buttons">
															<a href="#" class="blue">
																<i class="ace-icon fa fa-pencil bigger-130"></i>
															</a>

															<span class="vbar"></span>

															<a href="#" class="red">
																<i class="ace-icon fa fa-trash-o bigger-130"></i>
															</a>

															<span class="vbar"></span>

															<a href="#" class="green">
																<i class="ace-icon fa fa-flag bigger-130"></i>
															</a>
														</div>

														<!-- /section:custom/extra.action-buttons -->
													</li>

													<li class="item-default clearfix">
														<label class="inline">
															<input type="checkbox" class="ace" />
															<span class="lbl"> 这是一条测试任务，请您反馈进度~</span>
														</label>

														<!-- #section:elements.dropdown.hover -->
														<div class="inline pull-right position-relative dropdown-hover">
															<button class="btn btn-minier bigger btn-primary">
																<i class="ace-icon fa fa-cog icon-only bigger-120"></i>
															</button>

															<ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-caret dropdown-close dropdown-menu-right">
																<li>
																	<a href="#" class="tooltip-success" data-rel="tooltip" title="Mark&nbsp;as&nbsp;done">
																		<span class="green">
																			<i class="ace-icon fa fa-check bigger-110"></i>
																		</span>
																	</a>
																</li>

																<li>
																	<a href="#" class="tooltip-error" data-rel="tooltip" title="Delete">
																		<span class="red">
																			<i class="ace-icon fa fa-trash-o bigger-110"></i>
																		</span>
																	</a>
																</li>
															</ul>
														</div>

														<!-- /section:elements.dropdown.hover -->
													</li>

													<li class="item-blue clearfix">
														<label class="inline">
															<input type="checkbox" class="ace" />
															<span class="lbl"> 这是一条测试任务，请您反馈进度~</span>
														</label>
													</li>

													<li class="item-grey clearfix">
														<label class="inline">
															<input type="checkbox" class="ace" />
															<span class="lbl"> 这是一条测试任务，请您反馈进度~</span>
														</label>
													</li>

													<li class="item-green clearfix">
														<label class="inline">
															<input type="checkbox" class="ace" />
															<span class="lbl"> 这是一条测试任务，请您反馈进度~</span>
														</label>
													</li>

													<li class="item-pink clearfix">
														<label class="inline">
															<input type="checkbox" class="ace" />
															<span class="lbl"> 这是一条测试任务，请您反馈进度~</span>
														</label>
													</li>
												</ul>

												<!-- /section:pages/dashboard.tasks -->
											</div>

											<div id="member-tab" class="tab-pane">
												<!-- #section:pages/dashboard.members -->
												<div class="clearfix">
													<div class="itemdiv memberdiv">
														<div class="user">
															<img alt="Bob Doe's avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/user.jpg" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Bob Doe</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="green">20 min</span>
															</div>

															<div>
																<span class="label label-warning label-sm">pending</span>

																<div class="inline position-relative">
																	<button class="btn btn-minier btn-yellow btn-no-border dropdown-toggle" data-toggle="dropdown" data-position="auto">
																		<i class="ace-icon fa fa-angle-down icon-only bigger-120"></i>
																	</button>

																	<ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">
																		<li>
																			<a href="#" class="tooltip-success" data-rel="tooltip" title="Approve">
																				<span class="green">
																					<i class="ace-icon fa fa-check bigger-110"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-warning" data-rel="tooltip" title="Reject">
																				<span class="orange">
																					<i class="ace-icon fa fa-times bigger-110"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-error" data-rel="tooltip" title="Delete">
																				<span class="red">
																					<i class="ace-icon fa fa-trash-o bigger-110"></i>
																				</span>
																			</a>
																		</li>
																	</ul>
																</div>
															</div>
														</div>
													</div>

													<div class="itemdiv memberdiv">
														<div class="user">
															<img alt="Joe Doe's avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar2.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Joe Doe</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="green">1 hour</span>
															</div>

															<div>
																<span class="label label-warning label-sm">pending</span>

																<div class="inline position-relative">
																	<button class="btn btn-minier btn-yellow btn-no-border dropdown-toggle" data-toggle="dropdown" data-position="auto">
																		<i class="ace-icon fa fa-angle-down icon-only bigger-120"></i>
																	</button>

																	<ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">
																		<li>
																			<a href="#" class="tooltip-success" data-rel="tooltip" title="Approve">
																				<span class="green">
																					<i class="ace-icon fa fa-check bigger-110"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-warning" data-rel="tooltip" title="Reject">
																				<span class="orange">
																					<i class="ace-icon fa fa-times bigger-110"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-error" data-rel="tooltip" title="Delete">
																				<span class="red">
																					<i class="ace-icon fa fa-trash-o bigger-110"></i>
																				</span>
																			</a>
																		</li>
																	</ul>
																</div>
															</div>
														</div>
													</div>

													<div class="itemdiv memberdiv">
														<div class="user">
															<img alt="Jim Doe's avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Jim Doe</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="green">2 hour</span>
															</div>

															<div>
																<span class="label label-warning label-sm">pending</span>

																<div class="inline position-relative">
																	<button class="btn btn-minier btn-yellow btn-no-border dropdown-toggle" data-toggle="dropdown" data-position="auto">
																		<i class="ace-icon fa fa-angle-down icon-only bigger-120"></i>
																	</button>

																	<ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">
																		<li>
																			<a href="#" class="tooltip-success" data-rel="tooltip" title="Approve">
																				<span class="green">
																					<i class="ace-icon fa fa-check bigger-110"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-warning" data-rel="tooltip" title="Reject">
																				<span class="orange">
																					<i class="ace-icon fa fa-times bigger-110"></i>
																				</span>
																			</a>
																		</li>

																		<li>
																			<a href="#" class="tooltip-error" data-rel="tooltip" title="Delete">
																				<span class="red">
																					<i class="ace-icon fa fa-trash-o bigger-110"></i>
																				</span>
																			</a>
																		</li>
																	</ul>
																</div>
															</div>
														</div>
													</div>

													<div class="itemdiv memberdiv">
														<div class="user">
															<img alt="Alex Doe's avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar5.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Alex Doe</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="green">3 hour</span>
															</div>

															<div>
																<span class="label label-danger label-sm">blocked</span>
															</div>
														</div>
													</div>

													<div class="itemdiv memberdiv">
														<div class="user">
															<img alt="Bob Doe's avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar2.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Bob Doe</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="green">6 hour</span>
															</div>

															<div>
																<span class="label label-success label-sm arrowed-in">approved</span>
															</div>
														</div>
													</div>

													<div class="itemdiv memberdiv">
														<div class="user">
															<img alt="Susan's avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar3.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Susan</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="green">yesterday</span>
															</div>

															<div>
																<span class="label label-success label-sm arrowed-in">approved</span>
															</div>
														</div>
													</div>

													<div class="itemdiv memberdiv">
														<div class="user">
															<img alt="Phil Doe's avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar4.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Phil Doe</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="green">2 days ago</span>
															</div>

															<div>
																<span class="label label-info label-sm arrowed-in arrowed-in-right">online</span>
															</div>
														</div>
													</div>

													<div class="itemdiv memberdiv">
														<div class="user">
															<img alt="Alexa Doe's avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar1.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Alexa Doe</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="green">3 days ago</span>
															</div>

															<div>
																<span class="label label-success label-sm arrowed-in">approved</span>
															</div>
														</div>
													</div>
												</div>

												<div class="space-4"></div>

												<div class="center">
													<i class="ace-icon fa fa-users fa-2x green middle"></i>

													&nbsp;
													<a href="#" class="btn btn-sm btn-white btn-info">
														See all members &nbsp;
														<i class="ace-icon fa fa-arrow-right"></i>
													</a>
												</div>

												<div class="hr hr-double hr8"></div>

												<!-- /section:pages/dashboard.members -->
											</div><!-- /.#member-tab -->

											<div id="comment-tab" class="tab-pane">
												<!-- #section:pages/dashboard.comments -->
												<div class="comments">
													<div class="itemdiv commentdiv">
														<div class="user">
															<img alt="Bob Doe's Avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Bob Doe</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="green">6 min</span>
															</div>

															<div class="text">
																<i class="ace-icon fa fa-quote-left"></i>
																Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis &hellip;
															</div>
														</div>

														<div class="tools">
															<div class="inline position-relative">
																<button class="btn btn-minier bigger btn-yellow dropdown-toggle" data-toggle="dropdown">
																	<i class="ace-icon fa fa-angle-down icon-only bigger-120"></i>
																</button>

																<ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">
																	<li>
																		<a href="#" class="tooltip-success" data-rel="tooltip" title="Approve">
																			<span class="green">
																				<i class="ace-icon fa fa-check bigger-110"></i>
																			</span>
																		</a>
																	</li>

																	<li>
																		<a href="#" class="tooltip-warning" data-rel="tooltip" title="Reject">
																			<span class="orange">
																				<i class="ace-icon fa fa-times bigger-110"></i>
																			</span>
																		</a>
																	</li>

																	<li>
																		<a href="#" class="tooltip-error" data-rel="tooltip" title="Delete">
																			<span class="red">
																				<i class="ace-icon fa fa-trash-o bigger-110"></i>
																			</span>
																		</a>
																	</li>
																</ul>
															</div>
														</div>
													</div>

													<div class="itemdiv commentdiv">
														<div class="user">
															<img alt="Jennifer's Avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar1.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Jennifer</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="blue">15 min</span>
															</div>

															<div class="text">
																<i class="ace-icon fa fa-quote-left"></i>
																Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis &hellip;
															</div>
														</div>

														<div class="tools">
															<div class="action-buttons bigger-125">
																<a href="#">
																	<i class="ace-icon fa fa-pencil blue"></i>
																</a>

																<a href="#">
																	<i class="ace-icon fa fa-trash-o red"></i>
																</a>
															</div>
														</div>
													</div>

													<div class="itemdiv commentdiv">
														<div class="user">
															<img alt="Joe's Avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar2.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Joe</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="orange">22 min</span>
															</div>

															<div class="text">
																<i class="ace-icon fa fa-quote-left"></i>
																Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis &hellip;
															</div>
														</div>

														<div class="tools">
															<div class="action-buttons bigger-125">
																<a href="#">
																	<i class="ace-icon fa fa-pencil blue"></i>
																</a>

																<a href="#">
																	<i class="ace-icon fa fa-trash-o red"></i>
																</a>
															</div>
														</div>
													</div>

													<div class="itemdiv commentdiv">
														<div class="user">
															<img alt="Rita's Avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar3.png" />
														</div>

														<div class="body">
															<div class="name">
																<a href="#">Rita</a>
															</div>

															<div class="time">
																<i class="ace-icon fa fa-clock-o"></i>
																<span class="red">50 min</span>
															</div>

															<div class="text">
																<i class="ace-icon fa fa-quote-left"></i>
																Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis &hellip;
															</div>
														</div>

														<div class="tools">
															<div class="action-buttons bigger-125">
																<a href="#">
																	<i class="ace-icon fa fa-pencil blue"></i>
																</a>

																<a href="#">
																	<i class="ace-icon fa fa-trash-o red"></i>
																</a>
															</div>
														</div>
													</div>
												</div>

												<div class="hr hr8"></div>

												<div class="center">
													<i class="ace-icon fa fa-comments-o fa-2x green middle"></i>

													&nbsp;
													<a href="#" class="btn btn-sm btn-white btn-info">
														See all comments &nbsp;
														<i class="ace-icon fa fa-arrow-right"></i>
													</a>
												</div>

												<div class="hr hr-double hr8"></div>

												<!-- /section:pages/dashboard.comments -->
											</div>
										</div>
									</div><!-- /.widget-main -->
								</div><!-- /.widget-body -->
							</div><!-- /.widget-box -->
						</div><!-- /.col -->

						<div class="col-sm-6">
							<div class="widget-box">
								<div class="widget-header">
									<h4 class="widget-title lighter smaller">
										<i class="ace-icon fa fa-comment blue"></i>
										我的话题
									</h4>
								</div>

								<div class="widget-body">
									<div class="widget-main no-padding">
										<!-- #section:pages/dashboard.conversations -->
										<div class="dialogs">
											<div class="itemdiv dialogdiv">
												<div class="user">
													<img alt="Alexa's Avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar1.png" />
												</div>

												<div class="body">
													<div class="time">
														<i class="ace-icon fa fa-clock-o"></i>
														<span class="green">4 sec</span>
													</div>

													<div class="name">
														<a href="#">Alexa</a>
													</div>
													<div class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis.</div>

													<div class="tools">
														<a href="#" class="btn btn-minier btn-info">
															<i class="icon-only ace-icon fa fa-share"></i>
														</a>
													</div>
												</div>
											</div>

											<div class="itemdiv dialogdiv">
												<div class="user">
													<img alt="John's Avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar.png" />
												</div>

												<div class="body">
													<div class="time">
														<i class="ace-icon fa fa-clock-o"></i>
														<span class="blue">38 sec</span>
													</div>

													<div class="name">
														<a href="#">John</a>
													</div>
													<div class="text">Raw denim you probably haven&#39;t heard of them jean shorts Austin.</div>

													<div class="tools">
														<a href="#" class="btn btn-minier btn-info">
															<i class="icon-only ace-icon fa fa-share"></i>
														</a>
													</div>
												</div>
											</div>

											<div class="itemdiv dialogdiv">
												<div class="user">
													<img alt="Bob's Avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/user.jpg" />
												</div>

												<div class="body">
													<div class="time">
														<i class="ace-icon fa fa-clock-o"></i>
														<span class="orange">2 min</span>
													</div>

													<div class="name">
														<a href="#">Bob</a>
														<span class="label label-info arrowed arrowed-in-right">admin</span>
													</div>
													<div class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo massa sed ipsum porttitor facilisis.</div>

													<div class="tools">
														<a href="#" class="btn btn-minier btn-info">
															<i class="icon-only ace-icon fa fa-share"></i>
														</a>
													</div>
												</div>
											</div>

											<div class="itemdiv dialogdiv">
												<div class="user">
													<img alt="Jim's Avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar4.png" />
												</div>

												<div class="body">
													<div class="time">
														<i class="ace-icon fa fa-clock-o"></i>
														<span class="grey">3 min</span>
													</div>

													<div class="name">
														<a href="#">Jim</a>
													</div>
													<div class="text">Raw denim you probably haven&#39;t heard of them jean shorts Austin.</div>

													<div class="tools">
														<a href="#" class="btn btn-minier btn-info">
															<i class="icon-only ace-icon fa fa-share"></i>
														</a>
													</div>
												</div>
											</div>

											<div class="itemdiv dialogdiv">
												<div class="user">
													<img alt="Alexa's Avatar" src="<%=request.getContextPath() %>/resources/ace/assets/avatars/avatar1.png" />
												</div>

												<div class="body">
													<div class="time">
														<i class="ace-icon fa fa-clock-o"></i>
														<span class="green">4 min</span>
													</div>

													<div class="name">
														<a href="#">Alexa</a>
													</div>
													<div class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>

													<div class="tools">
														<a href="#" class="btn btn-minier btn-info">
															<i class="icon-only ace-icon fa fa-share"></i>
														</a>
													</div>
												</div>
											</div>
										</div>

										<!-- /section:pages/dashboard.conversations -->
										<form>
											<div class="form-actions">
												<div class="input-group">
													<input placeholder="Type your message here ..." type="text" class="form-control" name="message" />
													<span class="input-group-btn">
														<button class="btn btn-sm btn-info no-radius" type="button">
															<i class="ace-icon fa fa-share"></i>
															Send
														</button>
													</span>
												</div>
											</div>
										</form>
									</div><!-- /.widget-main -->
								</div><!-- /.widget-body -->
							</div><!-- /.widget-box -->
						</div><!-- /.col -->
					</div><!-- /.row -->

					<!-- PAGE CONTENT ENDS -->
				</div><!-- /.col -->
			</div><!-- /.row -->
		</div><!-- /.page-content -->
	</div>
<!-- /.main-content -->
<%@ include file="../common/common_js.jsp"%>
</body>
</html>
