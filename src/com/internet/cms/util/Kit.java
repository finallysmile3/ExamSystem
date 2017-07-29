/**
 *  Copyright(c) 2007 SC TianYi. All rights reserved.
 */
package com.internet.cms.util;

import java.awt.Graphics;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.HeadlessException;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.PixelGrabber;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;
import javax.imageio.ImageReadParam;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;



/**
 * Comment for Kit
 * 
 * <p>
 * <a href="Kit.java.html"><i>View Source</i></a>
 * </p>
 * 
 * @author <a href="mailto:leiyangsam@sina.com">Yang Lei</a>
 * @version 2007-10-29:下午09:25:15
 */
public class Kit {

	private static final String regex1 = "<\\/?[^>]+>";

	private static final String regex2 = "\\s|&nbsp;";
	
	private static final String blank = "!@#";

	private static final Pattern p1 = Pattern.compile(regex1);

	private static final Pattern p2 = Pattern.compile(regex2);

	private static final String DEFAULT_STYLE = "font:'宋体',style:'normal',background:'transparent',color:'#000000',fontsize:'1'";
	
	
	
		

	public static String autoRename(String fileName) {
		Random rd = new Random();
		Date date = new Date();

		StringBuffer newName = new StringBuffer();
		newName.append(date.getTime());
		newName.append((char) (Math.random() * 26 + 'a'));
		newName.append(rd.nextInt(100));
		newName.append(rd.nextInt(100));
		newName.append(rd.nextInt(100));
		int index = fileName.lastIndexOf(".");
		newName.append(fileName.substring(index));

		return newName.toString();
	}

	// 去掉空格、回车、大小写
	public static String dealStr(String str) {
		String returnStr = "";
		if (null != str && !"".equals(str)) {
			returnStr = str.toLowerCase().replaceAll("'", "").replaceAll("\n", "").replaceAll("-", "").replaceAll(" ",
					"").trim();
		}
		return returnStr;
	}

	// 去掉逗号
	public static String dealComma(String str) {
		String returnStr = "";
		if (null != str && !"".equals(str)) {
			for (int i = 0; i < str.length(); i++) {
				String temp = str.substring(i, i + 1);
				if (!temp.equals(",")) {
					returnStr += temp;
				}
			}
		}
		return returnStr;
	}

	// 去掉逗号
	public static String[] getTempStr(String str) {
		int j = 0;
		int k = 0;
		String tempRtr[] = new String[3];
		if (!"".equals(str) && null != str) {
			for (int i = 0; i < str.length(); i++) {
				String temp = str.substring(i, i + 1);
				if (temp.equals(",")) {
					tempRtr[k] = str.subSequence(j, i).toString();
					// System.out.println("the str is:"+tempRtr[k]+"=="+k);
					j = i + 1;
					++k;
				}
			}
		}
		return tempRtr;
	}

	//构造公司地址
	public static String getCompanyAdd(String add){
		String address = "";
		if(add!=null && !"".equals(add)){
			String addTemp[] = add.split(",");
			for(int j=0;j<3;j++){
				if(j==0){
					for(int i=0;i<addTemp.length;i++){
						if(addTemp[i].indexOf("商务地址省市自治区")>=0){
							address = address+addTemp[i].substring(9,addTemp[i].length());
							break;
						}
					}
				}else if(j==1){
					for(int i=0;i<addTemp.length;i++){
						if(addTemp[i].indexOf("商务地址市县")>=0){
							address = address+addTemp[i].substring(6,addTemp[i].length());
							break;
						}
					}
				}else{
					for(int i=0;i<addTemp.length;i++){
						if(addTemp[i].indexOf("商务地址街道")>=0){
							address = address+addTemp[i].substring(6,addTemp[i].length());
							break;
						}
					}
				}				
			}			
		}
		return address;
	}
	// 把null转换成空白

	public static String getObjStr(Object obj) {
		if (obj == null) {
			return "";

		} else {
			return obj.toString();
		}
	}

	// 通用上传文件方式，自带zip释放功能 Constant.UPLOAD_DIR
	

	// int类型转化为String
	public static String intToStr(int i) {
		return new Integer(i).toString();
		//
	}

	// String类型转化为int
	public static int strToInt(String str) {
		if (str == null)
			return 0;
		try {
			return new Integer(str).intValue();
		} catch (Exception e) {
			// MyLogger.debug("strToInt Error");
			return 0;
		}
		//
	}

	// 得到obj的int
	public static int getObjInt(Object obj) {
		int rtValue = 0;
		if (obj != null) {
			try {
				rtValue = Integer.parseInt(obj.toString());
			} catch (Exception ex) {

			}
		}
		return rtValue;
	}

	// 得到obj的Long
	public static Long getObjLong(Object obj) {
		Long rtValue = new Long(0);
		if (obj != null) {
			try {
				rtValue = new Long(Long.parseLong(obj.toString()));
			} catch (Exception ex) {

			}
		}
		return rtValue;
	}

	// 得到当前时间
	public static String getCurrentTime() {
		Calendar cl = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat();
		sdf.applyPattern("yyyy-MM-dd HH:mm:ss");
		return sdf.format(cl.getTime());
	}

	// 得到当前年月日

	public static String getTodayTime() {
		Calendar cl = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat();
		sdf.applyPattern("yyyy-MM-dd");
		return sdf.format(cl.getTime());
	}

	// 得到当前年

	public static String getYear() {
		Calendar cl = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat();
		sdf.applyPattern("yyyy");
		return sdf.format(cl.getTime());
	}

	// 得到当前月

	public static String getMonth() {
		Calendar cl = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat();
		sdf.applyPattern("MM");
		return sdf.format(cl.getTime());
	}

	// 得到时间
	public static long getTime() {
		Calendar cl = Calendar.getInstance();
		return cl.getTimeInMillis();
	}

	// 根据字符串得到时间

	public static long getTime(String dateStr) {
		SimpleDateFormat sdf = new SimpleDateFormat();
		sdf.applyPattern("yyyy-MM-dd");
		try {
			return sdf.parse(dateStr).getTime();
		} catch (ParseException pEx) {
			return -1L;
		}
	}

	// 给字符串加着重号
	public static String convertToSpecialStr(String sourceString,
			String keyWords) {
		return sourceString.replaceAll(keyWords, "<strong><font color='red'>"
				+ keyWords + "</font></strong>");
	}

	/**
	 * yyyy年MM月dd日
	 * 
	 * 
	 */
	private static final DateFormat DF_DATE_1 = new SimpleDateFormat(
			"yyyy年MM月dd日");

	/**
	 * yyyy-MM-dd
	 */
	private static final DateFormat DF_DATE_2 = new SimpleDateFormat(
			"yyyy-MM-dd");

	/**
	 * yyyy/MM/dd
	 */
	private static final DateFormat DF_DATE_3 = new SimpleDateFormat(
			"yyyy/MM/dd");

	/**
	 * yyyy年M月d日
	 * 
	 * 
	 */
	private static final DateFormat DF_DATE_4 = new SimpleDateFormat(
			"yyyy年M月d日");

	/**
	 * yyyy年MM月dd日 HH:mm:ss
	 */
	private static final DateFormat DF_FULL_1 = new SimpleDateFormat(
			"yyyy年MM月dd日 HH:mm:ss");

	/**
	 * yyyy-MM-dd HH:mm:ss
	 */
	private static final DateFormat DF_FULL_2 = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");

	/**
	 * HH:mm:ss
	 */
	private static final DateFormat DF_TIME_1 = new SimpleDateFormat("HH:mm:ss");

	/**
	 * 星期几
	 * 
	 * 
	 */
	private static final DateFormat DF_WEEK_1 = new SimpleDateFormat("EEEE");

	/**
	 * 保留小数点后两位的DecimalFormat
	 */
	private static final DecimalFormat ROUND = new DecimalFormat("0.00");

	/**
	 * 将值字符串中的空格删除;
	 * 
	 * @param str -
	 *            需要删除空格的字符串
	 * 
	 * 
	 * @return 删除空格后的字符串
	 * 
	 * 
	 */
	public static String dealEmpty(String str) {
		String returnStr = "";
		for (int i = 0; i < str.length(); i++) {
			String temp = str.substring(i, i + 1);
			if (!temp.equals(" ")) {
				returnStr += temp;
			}
		}
		return returnStr;
	}

	public static Object dealNull(Object obj) {
		if (obj == null) {
			return (Object) ("");
		}
		return obj;
	}

	public static Object dealDateNull(Object obj) {
		if (obj == null) {
			return (Object) ("");
		}
		if (obj.toString().length() > 10) {
			return (Object) obj.toString().substring(0, 10);
		}
		return obj;
	}

	/**
	 * 将值为null的字符串转换成"";
	 * 
	 * @param str -
	 *            需要转换的字符串
	 * 
	 * 
	 * @return 转换后的字符串
	 * 
	 * 
	 */
	public static String dealNull(String str) {
		if (str == null) {
			return "";
		}
		return str;
	}

	/**
	 * 解决中文问题，GBK转ISO编码
	 * 
	 * @param str
	 *            原始文本
	 * @return 转换后文本
	 * 
	 * 
	 */
	public static String GBKToISO(String str) {
		try {
			return new String(str.getBytes("GBK"), "ISO8859_1");
		} catch (Exception ex) {
			return null;
		}
	}

	/**
	 * 解决中文问题，ISO转为GBK编码，用于POST，GET方式取得数据
	 * 
	 * @param str -
	 *            需要转换的字符串
	 * 
	 * 
	 * @return 转换后的字符串
	 * 
	 * 
	 */
	public static String ISOToGBK(String str) {
		try {
			return new String(str.getBytes("ISO8859_1"), "GBK");
		} catch (Exception ex) {
			return null;
		}
	}

	public static String ISOToUTF8(String str) {
		try {
			if (null != str && !"".equals(str)) {
				return new String(str.getBytes("ISO8859_1"), "UTF-8");
			} else {
				return null;
			}
		} catch (Exception ex) {
			return null;
		}
	}
	
	public static String UTF8ToGB2312(String str) {
		try {
			if (null != str && !"".equals(str)) {
				return new String(str.getBytes("UTF-8"), "gb2312");
			} else {
				return null;
			}
		} catch (Exception ex) {
			return null;
		}
	}

	public static Integer StringToInteger(String str) {
		try {
			return new Integer(Integer.parseInt(str));
		} catch (Exception ex) {
			return null;
		}
	}

	/*
	 * 方法 formatDateTime,提供几种全格式的日期格式化 @param date @param formattype <li>formattype =
	 * 1 -- YYYY-MM-DD hh:mm:ss</li> <li>formattype = 2 -- YYYY年MM月DD日
	 * 
	 * 
	 * hh:mm:ss</li> @return
	 */
	public static String formatDateTime(Date date, int formattype) {
		switch (formattype) {
		case 2:
			return DF_FULL_1.format(date);
		default:
			return DF_FULL_2.format(date);
		}
	}

	/**
	 * 方法 formatDate， 提供几种日期格式化
	 * 
	 * 
	 * 
	 * @param date
	 * @param formattype
	 *            <li>formattype = 1 -- YYYY年MM月DD日</li>
	 *            <li>formattype = 2 -- YYYY-MM-DD</li>
	 *            <li>formattype = 3 -- YYYY/MM/DD</li>
	 * @return
	 */
	public static String formatDate(Date date, int formattype) {
		switch (formattype) {
		case 2:
			return DF_DATE_2.format(date);
		case 3:
			return DF_DATE_3.format(date);
		default:
			return DF_DATE_1.format(date);
		}
	}

	/** Fomart double type number */
	public String formatDouble(double src) {
		return ROUND.format(src);
	}

	/** 方法 getDayOfWeek ，返回今天是星期几 */
	public static String getDayOfWeek() {
		return DF_WEEK_1.format(new Date());
	}

	/**
	 * 得到JAVA格式的文件路径
	 * 
	 * 
	 * 
	 * @param srcpath
	 *            String
	 * @return String
	 */
	public String getJavaStylePath(String srcpath) {
		String jpath = "";
		int line = srcpath.indexOf("\\");
		while (line != -1) {
			jpath += srcpath.substring(0, line + 1).replace('\\', '/');

			srcpath = srcpath.substring(line + 1);
			line = srcpath.indexOf("\\");
			if (line == -1) {
				jpath += srcpath;
				break;
			}
		}

		return jpath;
	}

	/**
	 * 处理中文乱码问题
	 * 
	 * @param src
	 *            String
	 * @return String
	 */
	public String getRightString(String src) {
		String rightStr = "";
		try {
			rightStr = new String(src.getBytes("ISO8859_1"));
		} catch (Exception e) {
		}

		return rightStr;
	}

	/** Get now [HH:MM:SS] */
	public String getTime2() {
		return DF_TIME_1.format(new Date());
	}

	/** Get now [YYYY-MM-DD] */
	public static String getToday() {
		return DF_DATE_2.format(new Date());
	}

	/**
	 * 得到当天的格式化日期
	 * 
	 * @param style
	 *            <li>1:yyyy年MM月dd日</li>
	 *            <li>2:yyyy-MM-dd</li>
	 *            <li>3:yyyy/MM/dd</li>
	 *            <li>4:yyyy年M月d日</li>
	 * @return
	 */
	public String getToday(int style) {
		switch (style) {
		case 1:
			return DF_DATE_1.format(new Date());
		case 2:
			return DF_DATE_2.format(new Date());
		case 3:
			return DF_DATE_3.format(new Date());
		case 4:
			return DF_FULL_1.format(new Date());
		default:
			return DF_DATE_4.format(new Date());
		}
	}

	/**
	 * 获得指定的日期
	 * 
	 * 
	 * 
	 * @param str
	 */
	public static Date parseDate(String str, int type) {
		Date return_date = null;
		if (str == null || str.equals(""))
			return null;
		try {
			String format = "";
			if (type == 1)
				format = "yyyy-MM-dd HH:mm:ss";
			else if (type == 2)
				format = "yyyy-MM-dd HH:mm";
			else
				format = "yyyy-MM-dd";

			SimpleDateFormat sdf = new SimpleDateFormat(format);
			return_date = sdf.parse(str);
		} catch (ParseException ex) {
			System.out.println("日期格式转换错误");
		}
		return return_date;
	}

	/**
	 * 把字符转化成日期
	 * 
	 * @param style
	 * 
	 * @return Date
	 */

	public static Date getDateByString(String dateString) {

		Date day = null;
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		try {
			day = df.parse(dateString);

		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return day;
	}

	public static Date getDateByString(String dateString, String format) {

		Date day = null;
		SimpleDateFormat df = new SimpleDateFormat(format);
		try {
			day = df.parse(dateString);

		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return day;
	}

	/**
	 * 处理POI控制EXCEL乱码问题
	 * 
	 * @param src
	 *            String
	 * @return String
	 */
	public String getXlsString(String src) {
		String rightStr = "";
		try {
			rightStr = new String(src.getBytes("UTF-16BE"));
		} catch (Exception e) {
		}

		return rightStr;
	}

	// 格式化字符串
	public String getFormatStr(String str, int formatLenght) {
		try {
			int len = str.length();
			if (len < formatLenght) {
				for (int i = 0; i < (formatLenght - len); i++) {
					str = "0" + str;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return str;
	}

	/**
	 * sql特殊字符去除函数
	 * 
	 * @param str
	 * @return
	 */
	public static String sqlStrchop(String str) {
		String reStr = "";
		if (str != null && !str.equals("")) {
			reStr = str.replaceAll("\"", "“");
			reStr = reStr.replaceAll("'", "’");
		}
		return reStr;
	}

	/**
	 * 中文处理函数(加入sql特殊字符去除函数)
	 * 
	 * @param str
	 * @return
	 */
	public static String getStr(String str) {
		try {
			String temp_p = str;
			String temp = new String(temp_p.getBytes("ISO8859_1"), "GBK");
			temp = sqlStrchop(temp);
			return temp;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 文件名时间格式化函数
	 * 
	 * @return
	 */
	public static String getDateTimefile() {
		SimpleDateFormat simpledateformat = new SimpleDateFormat(
				"yyyyMMddHHmmss");
		String s = simpledateformat.format(new Date());
		return s;
	}

	public static String getDateTimefile(Date date) { // 文件名时间格式化函数
		SimpleDateFormat simpledateformat = new SimpleDateFormat(
				"yyyyMMddHHmmss");
		String s = simpledateformat.format(date);
		return s;
	}

	/**
	 * 生成随机字符串，由数字组成。
	 * 
	 * 
	 * 
	 * @param 随机数字字符串的长度。
	 * 
	 * 
	 * @return 指定长度的随机字符串，由数字组成。
	 * 
	 * 
	 */
	public static final String genRandomStr(int length) {
		String sRand = "";
		Random random = new Random();
		for (int i = 0; i < length; i++) {
			String rand = String.valueOf(random.nextInt(10));
			sRand += rand;
		}
		return sRand;
	}


	// 检查文件是否存在

	public static boolean fileExist(String path, String fileName) {
		File file = new File(path, fileName);
		if (file.exists()) {// 检查是否存在

			return true;
		} else {
			return false;
		}

	}

	/**
	 * 字符串比较
	 * 
	 * 
	 * 
	 * @param a
	 * @param b
	 * @return int 0：a<b 1:a>b 2 a=b
	 */
	public static int compareString(String a, String b) {
		char[] ac = a.toCharArray();
		char[] bc = b.toCharArray();
		for (int i = 0; i < ((a.length() < b.length()) ? a.length() : b
				.length()); i++) {
			if (ac[i] < bc[i]) {
				return 0;
			} else if (ac[i] > bc[i]) {
				return 1;
			}
		}
		if (a.length() > b.length()) {
			return 1;
		} else if (a.length() < b.length()) {
			return 0;
		}
		return 2;
	}

	/**
	 * 首页静态页面生成方法
	 * 
	 * 
	 * 
	 * @param urlString
	 * @param para
	 * @return
	 */
	public String getDocumentAt(String urlString, String para) {
		StringBuffer document = new StringBuffer();
		URL url;
		try {
			url = new URL(urlString);
			HttpURLConnection huc = (HttpURLConnection) url.openConnection();
			// 此处用于设置以post方式连接，并对话
			huc.setDoOutput(true);
			OutputStreamWriter out = new OutputStreamWriter(huc
					.getOutputStream(), "GBK");
			// 下面的4个参数参照: TrackBack技术规范上的说明

			out.write(para);
			out.flush();
			out.close();
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					huc.getInputStream()));
			String line = null;
			while ((line = reader.readLine()) != null) {
				document.append(line + "\n");
			}
			reader.close();
			huc.disconnect();
		} catch (MalformedURLException e) {
			System.out.println("Unable to connect to URL: " + urlString);
		} catch (IOException e) {
			System.out.println("IOException when connecting to URL: "
					+ urlString);
		}
		return document.toString();
	}

	/**
	 * 建立静态页面
	 * 
	 * 
	 * 
	 * @param resoureUrl
	 * @param targetUrl
	 */
	public void creatStaticPage(String resoureUrl, String targetUrl) {
		try {
			String path = Kit.class.getResource("Kit.class").getPath();
			int count = path.indexOf("WEB-INF");
			path = path.substring(0, count);
			path = path + targetUrl;

			String fileStr = getDocumentAt(resoureUrl, "");
			File f = new File(path);
			if (f.exists()) {
				f.delete();
			}
			FileWriter fw = new FileWriter(path);
			fw.write(fileStr);

			fw.close();
		} catch (IOException e) {
			e.getStackTrace();
		}
	}

	/**
	 * 获得指定日期的间隔天数
	 * 
	 * 
	 * 
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public static int getIntervalDays(Date startDate, Date endDate) {
		return getIntervalDays(dateToCal(startDate), dateToCal(endDate));
	}

	/**
	 * 得到时间间隔天数
	 * 
	 * @param g1
	 *            GregorianCalendar
	 * @param g2
	 *            GregorianCalendar
	 * @return int
	 */
	public static int getIntervalDays(GregorianCalendar g1, GregorianCalendar g2) {
		int elapsed = 0;
		GregorianCalendar gc1;
		GregorianCalendar gc2;
		if (g2.after(g1)) {
			gc2 = (GregorianCalendar) g2.clone();
			gc1 = (GregorianCalendar) g1.clone();
		} else {
			gc2 = (GregorianCalendar) g1.clone();
			gc1 = (GregorianCalendar) g2.clone();
		}
		gc1.clear(14);
		gc1.clear(13);
		gc1.clear(12);
		gc1.clear(11);
		gc2.clear(14);
		gc2.clear(13);
		gc2.clear(12);
		gc2.clear(11);
		while (gc1.before(gc2)) {
			gc1.add(5, 1);
			elapsed++;
		}
		return elapsed;
	}

	/**
	 * 获得指定日期的数值
	 * 
	 * 
	 * 
	 * @param date
	 * @return
	 */
	private static GregorianCalendar dateToCal(Date date) {
		return new GregorianCalendar(Integer.parseInt(getAppointDate(date,
				"yyyy")), Integer.parseInt(getAppointDate(date, "MM")) - 1,
				Integer.parseInt(getAppointDate(date, "dd")), Integer
						.parseInt(getAppointDate(date, "HH")), Integer
						.parseInt(getAppointDate(date, "mm")), Integer
						.parseInt(getAppointDate(date, "ss")));
	}

	/**
	 * 获得指定日期的格式
	 * 
	 * 
	 * 
	 * @param date
	 * @param dateformat
	 * @return
	 */
	public static String getAppointDate(Date date, String dateformat) {
		SimpleDateFormat simpledateformat = new SimpleDateFormat(dateformat);
		String s = simpledateformat.format(date);
		return s;
	}

	/**
	 * 长字符串转化为长度为小于size个的短字符，用“……”补齐
	 * 
	 * 
	 * @param str
	 * @return
	 */
	public static String getShort(String str, int size) {
		if (str.length() < size) {
			return str;
		} else {
			return str.substring(0, size) + "...";
		}
	}

	/**
	 * 长字符串转化为长度为小于size个的短字符，用“……”补齐
	 * 
	 * 
	 * @param str
	 * @return
	 */
	public static String getShort(String str) {
		if (str.length() < 7) {
			return str;
		} else {
			return str.substring(0, 7) + "...";
		}
	}

	// 线程池管理

	static int NowUseThreadCount = 0;

	/*
	 * public static synchronized boolean setThread(int iThreadNo, String
	 * method) { if (method.equals("-")) { NowUseThreadCount--; return true; }
	 * if (NowUseThreadCount < ActionConstants.MAX_THREAD_COUNT) {
	 * NowUseThreadCount++; return true; } return false; }
	 */

	/**
	 * 格式化时间字符串,如:2008-03-18 14:14:42.0,格式化后2008-03-18 14:14:42
	 * 
	 * @param dateString
	 * @return
	 */
	public static String formatDateString(String dateString) {
		String temp = dateString.substring(0, 19);
		return temp;
	}

	/**
	 * ----------------------------------------- 通过校验电话号码验证手机号码是否异网
	 * 主要是客户端添加离线人员的时候
	 * 
	 * -----------------------------------------
	 * 
	 * @param checkMobileNum
	 *            校验异网电话号码 NOT NULL -----------------------------------------
	 *            result{0,1,2} 2:错误 1:异网 0:本网 remark 信息描述
	 *            -----------------------------------------
	 * @author yanglei 2008-04-28 -----------------------------------------
	 */
	

	/**
	 * 去掉字符串中的html标签
	 * 
	 * @param str
	 * @return
	 */
	public static String excludeHTMLChar(String str) {
		if (str == null || str.trim().equals(""))
			return "";
		Matcher m = p1.matcher(str);
		str = m.replaceAll("");
		m = p2.matcher(str);
		str = m.replaceAll("");
		return str;
	}

	
	
	

	/**
	 * 删除文件夹里面的所有文件

	 * @param path String 文件夹路径 如 c:/fqf
	 */
	public  static void delAllFile(String path) {
		File file = new File(path);
		if (!file.exists()) {
			return;
		}
		if (!file.isDirectory()) {
			return;
		}
		String[] tempList = file.list();
		File temp = null;
		for (int i = 0; i < tempList.length; i++) {
			if (path.endsWith(File.separator)) {
				temp = new File(path + tempList[i]);
			} else {
				temp = new File(path + File.separator + tempList[i]);
			}
			if (temp.isFile()) {
				temp.delete();
			}
			if (temp.isDirectory()) {
				delAllFile(path + "/" + tempList[i]);//先删除文件夹里面的文件
			}
		}
	}

	/***
	 * RGB颜色转换:十六进制(00-FF)转换为十进制(0-255)
	 * */
	public static int[] convertHexToDec(String hexString){
		String temp ="";
		int decInt = 0;
		int decTemp = 0;
		int [] decString = new int[3];
		if(hexString!=null && !"".equals(hexString)){
			for(int i=1;i<hexString.length();i++){
				temp = hexString.substring(i,i+1);	
				if(temp.equalsIgnoreCase("A")){
					decInt = 10;
				}else if(temp.equalsIgnoreCase("B")){
					decInt = 11;
				}else if(temp.equalsIgnoreCase("C")){
					decInt = 12;
				}else if(temp.equalsIgnoreCase("D")){
					decInt = 13;
				}else if(temp.equalsIgnoreCase("E")){
					decInt = 14;
				}else if(temp.equalsIgnoreCase("F")){
					decInt = 15;
				}else{
					decInt = Integer.parseInt(temp);
				}
				if(i % 2==1){//该条件为十六进制转十进制需*16的位数(十六进:#A00000)
					decTemp =decInt * 16;
				}else{
					decTemp =decTemp+decInt;
					decString[i/2-1] = decTemp;
					decTemp = 0;
				}
			}
		}
		return decString;
	}
	
	public static boolean hasAlpha(Image image) {
        // If buffered image, the color model is readily available
        if (image instanceof BufferedImage) {
            BufferedImage bimage = (BufferedImage)image;
            return bimage.getColorModel().hasAlpha();
        }
    
        // Use a pixel grabber to retrieve the image's color model;
        // grabbing a single pixel is usually sufficient
         PixelGrabber pg = new PixelGrabber(image, 0, 0, 1, 1, false);
        try {
            pg.grabPixels();
        } catch (InterruptedException e) {
        }
    
        // Get the image's color model
        ColorModel cm = pg.getColorModel();
        return cm.hasAlpha();
    }

	
	

	public static void cropImage(String srcPath, String desPath, int x, int y, int width, int height) throws IOException{ 
        FileInputStream is = null ;
        ImageInputStream iis =null ;
        try{   
            //读取图片文件
            is = new FileInputStream(srcPath); 
            /**
             * 返回包含所有当前已注册 ImageReader 的 Iterator，这些 ImageReader 
             * 声称能够解码指定格式。 参数：formatName - 包含非正式格式名称 .
             *（例如 "jpeg" 或 "tiff"）等 。 
             */
            Iterator<ImageReader> it = ImageIO.getImageReadersByFormatName("jpg");  
            ImageReader reader = it.next(); 
            //获取图片流 
            iis = ImageIO.createImageInputStream(is);
            /**
             * <p>iis:读取源.true:只向前搜索 </p>.将它标记为 ‘只向前搜索’。
             * 此设置意味着包含在输入源中的图像将只按顺序读取，可能允许 reader
             *  避免缓存包含与以前已经读取的图像关联的数据的那些输入部分。
             */
            reader.setInput(iis,true) ;
            /**
             * <p>描述如何对流进行解码的类<p>.用于指定如何在输入时从 Java Image I/O 
             * 框架的上下文中的流转换一幅图像或一组图像。用于特定图像格式的插件
             * 将从其 ImageReader 实现的 getDefaultReadParam 方法中返回 
             * ImageReadParam 的实例。  
             */
            ImageReadParam param = reader.getDefaultReadParam(); 
            /**
             * 图片裁剪区域。Rectangle 指定了坐标空间中的一个区域，通过 Rectangle 对象
             * 的左上顶点的坐标（x，y）、宽度和高度可以定义这个区域。 
             */ 
            Rectangle rect = new Rectangle(x, y, width, height); 
            //提供一个 BufferedImage，将其用作解码像素数据的目标。 
            param.setSourceRegion(rect); 
            /**
             * 使用所提供的 ImageReadParam 读取通过索引 imageIndex 指定的对象，并将
             * 它作为一个完整的 BufferedImage 返回。
             */
            BufferedImage bi = reader.read(0,param);                
            //保存新图片 
            ImageIO.write(bi, "jpg", new File(desPath));     
        }
        finally{
            if(is!=null)
               is.close() ;       
            if(iis!=null)
               iis.close();  
        } 
    }

	
	
	//构造返回数据字符串
	//对象封装格式：modelId!@#modelName!@#modelUrl
	//数据封装格式:对象1%$#对象2
	
	
	/**
	 * 构造返回数据字符串
	 * 对象封装格式：cardId!@#cardName!@#cardUrl
	 * 数据封装格式:对象1%$#对象2
	 * 
	 * */
	
	
	
	
	
	
	
	
	//从xml中获取并设置各个字段style的值
	
	
	public static void main(String[] args) {
		
		//Element xname = new Element("Activitie");
		/*xname.setAttribute("id", "4");
		xname.setAttribute("type", "NODE");
		xname.setAttribute("name", "xname");*/
		//setStyle(xname);
		//System.out.println(xname.getAttributeValue("style"));
		//Kit ki=new Kit();
		//ki.setStyle(xname);
		//System.out.println(getStyle("xname").toString());
		/*String basePath = Parameter.ECARD_ORDERROOTWINDOWS + "18908191059"
		+ ActionConstants.BASE_XML_PATH+"22.xml";
		
		SAXBuilder builder = new SAXBuilder();
        Document read_doc;
		try {
			read_doc = builder.build(basePath);
			Element root = read_doc.getRootElement();
	        java.util.List   list   =   root.getChildren();   
	        for(int i = 0;i < list.size();i++)
	        {
	            Element e = (Element)list.get(i);
	            
	            System.out.println("name="+e.getName());
	            System.out.println("value=" +  e.getValue());
	            if(e.getName().equals("Activities"))
	            {
	            	java.util.List li=e.getChildren();
	            	for(int j=0;j<li.size();j++)
	            	{
	            		Element et = (Element)li.get(j);
	            		 System.out.println("childname="+e.getName());
	                     System.out.println("childvalue=" +  e.getValue());
	                     System.out.println("childpro"+et.getAttribute("id").toString());
	            	}
	            }
	            
	        }       
		} catch (JDOMException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}*/
        
		// TODO Auto-generated method stub
		// SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		// try {
		// Date return_date = sdf.parse("2008-03-13");
		// System.out.println("uuuu=" + return_date);
		// } catch (ParseException e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// }

	}
}
