package com.internet.cms.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;












import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.bean.listener.ILoader;
import com.internet.cms.util.StringUtil;

//import com.internet.cms.basic.util.StringUtil;



public abstract class BaseController {
	
	protected static final String ENCODEDING="UTF-8";
	//验证码存入session中的值
	protected static final String CODENUM="CODENUM";
	
	protected static final String COMMONPATH = "/messages/common.properties";
	
	protected static final String SYSTYPEERROR = "app系统类型错误";
	public static final String OK = "ok";
	public static final String REDIRECT_URL = "redirect:/loginController/redirect.do";
	
	protected static Log log = LogFactory.getLog(BaseController.class);
	protected HttpServletResponse response;  
    protected HttpSession session;  
    protected HttpServletRequest request; 
  /*  private ILoader loader;
    {   
    	if(loader==null)
    	{
    	loader = new ConfigLoader();
    	loader.loading();
    	}
    }*/
    @ModelAttribute  
    public void setReqAndRes(HttpServletRequest request, HttpServletResponse response){  
        this.request = request;  
        this.response = response;  
        this.session = request.getSession();  
    }  
	/**
	 * 错误信息
	 */
	
	protected final String MSG = "msg";
	/**
	 * 错误信息
	 */
	protected final String ERROR_MSG = "errorMsg";
	
	/**
	 * JAXA返回状态
	 */
	protected final String STATUS = "status";
	
	/**
	 * JAXA返回错误
	 */
	protected final String ERROR_500 = "500";
	
	/**
	 * JAXA返回正确
	 */
	protected final String SUCCESS_200 = "200";	
	
	/**
	 * 存放消息文件的根目录
	 */
	public static final String MESSAGE_ROOT = "/messages/";
	
	private static Map<String, Properties> messageResources = new ConcurrentHashMap<String, Properties>();
	
	/**
	 * 加载消息文件，如果已经加载则忽略
	 * @param uri
	 */
	private void loadMessage(String uri) {
		if (messageResources.get(uri) == null) {
			// 没有加载则加载
			InputStream is = this.getClass().getResourceAsStream(uri);
			if (is == null) {
				throw new IllegalArgumentException("Resource [" + uri + "] not found");
			}
			Properties prop = new Properties();
			try {
				prop.load(is);
			} catch (IOException e) {
				throw new IllegalArgumentException(e);
			}
			messageResources.put(uri, prop);
		}
	}
	/**
	 * 验证系统类型
	 * @param appType
	 * @return
	 */
	public  boolean validAppType(Object appType){
		if(StringUtil.isEmpty(appType))
			return false;
		if(String.valueOf(appType).toLowerCase().compareTo("ios") == 0){
			return true;
		}else if(String.valueOf(appType).toLowerCase().compareTo("android") == 0){
			return true;
		}
		return false;
	}
	/**
	 * 请求任意页面如果缓存里没有登录信息，则直接跳转到登录页面，否则完成本次的请求
	 * @param sessionOne
	 * @return
	 */
	public static String getJspToSession(HttpSession sessionOne){
		if(sessionOne.getAttribute("username")==null){
			return "redirect:/loginController/index.do";
		}
		return OK;
	}
}
