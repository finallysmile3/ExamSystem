package com.bean.listener;


import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class ServerListener implements ServletContextListener  
{

	@Override
	public void contextDestroyed(ServletContextEvent arg0) 
	{
		System.out.println("服务器关闭");
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0)
	{
		System.out.println("开启服务器!!!!!!!");
	
	}

}
