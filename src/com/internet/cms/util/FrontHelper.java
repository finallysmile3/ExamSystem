package com.internet.cms.util;

/**
 * FrontHelper 实体转换工具类
 * @author lk
 * 2015年3月11日 上午11:17
 */
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;




import com.google.common.collect.Maps;


public class FrontHelper {
	
    public static boolean isAbbr = true; //是否进行实体反射
    
    public static String TABLE_NAME="";
	
	/**
	 * ip地址转化为十进制整数
	 * @param ipItem
	 * @return
	 */
	public static long ipToLong(String ipItem)
	{
		if(ipItem == null || ipItem.indexOf(".") < 0) return 0;
		long[] ip = new long[4];
		int position1 = ipItem.indexOf(".");
		int position2 = ipItem.indexOf(".", position1 + 1);
		int position3 = ipItem.indexOf(".", position2 + 1);
		ip[0] = Long.parseLong(ipItem.substring(0, position1));
		ip[1] = Long.parseLong(ipItem.substring(position1+1, position2));
		ip[2] = Long.parseLong(ipItem.substring(position2+1, position3));
		ip[3] = Long.parseLong(ipItem.substring(position3+1));
		return (ip[0] << 24) + (ip[1] << 16) + (ip[2] << 8) + ip[3];
	}
	
	/**
	 * 集合转化为实体对象集
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("all")
	public static List<?> convertArray(Class<?> cs,List<Map<String,Object>> mapResult)throws Exception
	{ 
		List list = new ArrayList();
		for (Map<String, Object> result : mapResult) 
		{
			Object obj = cs.newInstance();
			FrontHelper.packData(result,obj);
			list.add(obj);
		}
		return list;
	} 
	
	/**
	 * 将实体转化为Map对象
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public static Map<String,Object> convertJSON(Object obj) throws Exception
	{
		Map<String,Object> map = new HashMap<String, Object>();
		Class cs = obj.getClass();
		Field[] fields = cs.getDeclaredFields();
		for (Field field : fields) 
		{
			String modefy =  Modifier.toString(field.getModifiers());
			if(modefy.indexOf("static")>=0 || modefy.indexOf("final")>=0)
			{
				continue;
			}else{
				 Method fieldmethod=cs.getMethod("get"+field.getName().substring(0,1).toUpperCase()+field.getName().substring(1),null);
				 Object objValue = fieldmethod.invoke(obj);
				 if(!StringUtil.isEmpty(objValue))map.put(field.getName(),objValue);
			}
		}
		return map;
	}	
	
	/**
	 * 数据传递封装
	 * @param map(key值必须等于属性名)
	 * @param obj
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public static void packData(Map<String,Object> map,Object obj)throws Exception
	{
		Class cs = obj.getClass();
		Field[] fields = cs.getDeclaredFields();
		for (Field field : fields)
		{
			String modefy =  Modifier.toString(field.getModifiers());
			if(modefy.indexOf("static")>=0 || modefy.indexOf("final")>=0)
			{
				continue;
			}else{
				Method method = cs.getMethod("set"+field.getName().substring(0,1).toUpperCase()+field.getName().substring(1), field.getType());
				if(map.get(field.getName())!=null)
				{
					if(field.getType().getName().compareTo("java.lang.String")==0 
						 || field.getType().getName().compareTo("java.util.Date")==0
					   || field.getType().getName().compareTo("java.math.BigDecimal")==0
					   || field.getType().getName().compareTo("java.text.DecimalFormat")==0
					   )
					{
						method.invoke(obj,map.get(field.getName()));
					}else{
						Class parse =  field.getType();
						Method mth =  parse.getMethod("valueOf",String.class);
						method.invoke(obj,mth.invoke(new Object(), map.get(field.getName()).toString()));
					}
				}
			}		
		}
	}
	
	/**
	 * 数据传递封装
	 * @param map(key值必须等于属性名)
	 * @param obj
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public static void packDataEX(Map<String,Object> map,Object obj)throws Exception
	{
		Class cs = obj.getClass();
		Field[] fields = cs.getDeclaredFields();
		for (Field field : fields)
		{
			String modefy =  Modifier.toString(field.getModifiers());
			if(modefy.indexOf("static")>=0 || modefy.indexOf("final")>=0)
			{
				continue;
			}else{
				Method method = cs.getMethod("set"+field.getName().substring(0,1).toUpperCase()+field.getName().substring(1), field.getType());
				if(map.get(field.getName())!=null)
				{
					if(field.getType().getName().indexOf("java.util")>=0)continue;
					if(field.getType().getName().compareTo("java.lang.String")==0)
					{
						method.invoke(obj,((String[]) map.get(field.getName()))[0]);
					}else{
						Class parse =  field.getType();
						Method mth =  parse.getMethod("valueOf",String.class);
						method.invoke(obj,mth.invoke(new Object(), ((String[]) map.get(field.getName()))[0].toString()));
					}
				}
			}		
		}
	}
	/**
	 * 封装页面数据
	 * @param requirMap
	 * @param request
	 */
	public static void laodRequest(Map<String,String> requir,HttpServletRequest request)
	{
		if(requir!=null)
		{
			for (Map.Entry<String,String> map : requir.entrySet())
			{
				 request.setAttribute(map.getKey(),map.getValue());
			}
		}
	}
	
	/**
	 * 读取页面数据
	 * @param strs
	 * @param request
	 * @return
	 */
	public static Map<String,String> readRequest(String[] strs,HttpServletRequest request)
	{
		if(strs==null)
		{
			return new HashMap<String, String>();
		}else{
			Map<String,String> strMap = new HashMap<String, String>();
			for(String str:strs)
			{
				strMap.put(str,request.getParameter(str));
			}
			return strMap;
		}
	}
	/**
	 * 数据请求参数转化
	 * @param request
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static Map<String,Object> transfParams(HttpServletRequest request){
		Map<String,Object> params = Maps.newHashMap();
		Map requestParams=request.getParameterMap();
		for(Iterator iter=requestParams.keySet().iterator(); iter.hasNext();){	
			String name=(String)iter.next();			
			String[] values=(String[])requestParams.get(name);			
			String valueStr="";			
			for(int i=0;i<values.length;i++){
				valueStr=(i == values.length-1) ? valueStr + values[i]: valueStr + values[i] + ",";		
			}
			params.put(name, valueStr);
		}
		return params;
	}
	 
}
