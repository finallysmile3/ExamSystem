package com.internet.cms.util;


import java.lang.reflect.Array;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @Title: StringUtil.java
 * @Package: com.kykj.cczc.sys.util
 * @Description: 字符串工具类
 * @author luokun
 * @see 
 * @since 
 */
public class StringUtil {
	/**
	 * 数组是否包含指定的元素
	 * 
	 * @param fields
	 *            ,名称
	 * @param name
	 *            ，元素
	 * @return boolean, yes or no
	 */
	public static boolean contains(String[] fields, String name) {
		if (getIndex(fields, name) == -1) { return false; }
		return true;
	}

	/**
	 * 在数组中查找指定的串，如果找到，则返回索引，否则返回-1
	 * 
	 * @param name
	 *            ，索引名称
	 * @return int, 索引号 不成功返回 -1
	 */
	public static int getIndex(String[] fields, String name) {
		if ((fields == null) || (name == null)) { return -1; }
		for (int i = 0; i < fields.length; i++) {
			if (name.equalsIgnoreCase(fields[i])) { return i; }
		}
		return -1;
	}

	/**
	 * 将普通文本字符串过滤成含 < br>
	 * 的超文本字串
	 * 
	 * @param src
	 *            , 输入源串
	 * @return String, 返回过滤结果
	 */
	public static String strFilter(String src) {
		String ret = src.replaceAll("<", "&lt;");
		ret = ret.replaceAll(">", "&gt;");
		ret = ret.replaceAll("<", "&lt;");
		ret = ret.replaceAll("\r\n", "<br>");
		return ret;
	}

	/**
	 * 将DATE转换为String类型 format "yyyy-MM-dd"
	 * 
	 * @param date
	 * @return
	 */
	public static String dateToString(java.sql.Date date) {
		java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd");
		String s = "";
		if (date != null) {
			s = format.format(date);
		}
		return s;
	}

	/**
	 * 将DATE转换为String类型 format "yyyy-MM-dd"
	 * 
	 * @param date
	 * @return
	 */
	public static String dateToString(java.util.Date date) {
		java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd");
		String s = "";
		if (date != null) {
			s = format.format(date);
		}
		return s;
	}

	/**
	 * 将DATE转换为String类型 format "yyyyMMdd"
	 * 
	 * @param date
	 * @return
	 */
	public static String dateToString_yyyyMMdd(java.util.Date date) {
		java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyyMMdd");
		String s = "";
		if (date != null) {
			s = format.format(date);
		}
		return s;
	}

	/**
	 * 将DATE转换为String类型 format 自定义 如 "yyyy-MM-dd hh:mm:ss"
	 * 
	 * @param date
	 * @return
	 */
	public static String dateToString(java.sql.Date date, String formatType) {
		java.text.SimpleDateFormat format = new java.text.SimpleDateFormat(formatType);
		String s = "";
		if (date != null) {
			s = format.format(date);
		}
		return s;
	}

	/**
	 * 替换空字符串
	 * 
	 * @param sStr
	 * @return
	 */
	public static String nullToSpace(String sStr) {
		return sStr == null ? "" : sStr;
	}

	public static String nullToSpace(Object sStr) {
		return sStr == null ? "" : String.valueOf(sStr);
	}

	/**
	 * 判断对象是否为空<br>
	 * 1,字符串(null或者"")都返回true<br>
	 * 2,数字类型(null或者0)都返回true<br>
	 * 3,集合类型(null或者不包含元素都返回true)<br>
	 * 4,数组类型不包含元素返回true(包含null元素返回false)<br>
	 * 5,其他对象仅null返回true
	 * 
	 * @param obj
	 * @return
	 */
	public static boolean isEmpty(Object obj) {
		if (obj == null) { return true; }
		if (obj instanceof Number) {
			Number num = (Number) obj;
			if (num.intValue() == 0) {
				return true;
			} else {
				return false;
			}
		} else if (obj instanceof String) {
			String str = (String) obj;
			if ((str == null) || str.equals("")) {
				return true;
			} else {
				return false;
			}
		} else if (obj instanceof Collection<?>) {
			Collection<?> c = (Collection<?>) obj;
			return c.isEmpty();
		} else if (obj instanceof Map<?, ?>) {
			Map<?, ?> m = (Map<?, ?>) obj;
			return m.isEmpty();
		} else if (obj.getClass().isArray()) {
			int length = Array.getLength(obj);
			return length == 0 ? true : false;
		} else {
			return false;
		}
	}

	/**
	 * 将list转换成string 替换掉里面的所有空格和 [] 可用于 sql语句中的 in 里面
	 * 
	 * @param list
	 * @return
	 */
	public static String listToString(List list) {
		String rtn = list.toString();
		rtn = rtn.replaceAll("\\[", "");
		rtn = rtn.replaceAll("\\]", "");
		rtn = rtn.replaceAll(" ", "");
		return rtn;
	}

	/**
	 * 得到当前日期 yyyy-MM-dd
	 * 
	 * @return
	 */
	public static String getNowDate() {
		java.util.Date date = new java.util.Date();
		String s = dateToString(date);
		return s;
	}

	/**
	 * 得到当前时间 hh:mm:ss
	 * 
	 * @return
	 */
	public static String getNowTime() {
		java.util.Date date = new java.util.Date();
		String s = new SimpleDateFormat("hh:mm:ss").format(date);
		return s;
	}

	/**
	 * 得到当前时间 yyyy-MM-dd HH:mm:ss
	 * 
	 * @return
	 */
	public static String getNow() {
		java.util.Date date = new java.util.Date();
		String s = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
		return s;
	}

	/**
	 * 自己制定格式得到当前时间
	 * 
	 * @format "yyyy-MM-dd hh:mm:ss" 方式的格式
	 * @return
	 */
	public static String getNow(String format) {
		java.util.Date date = new java.util.Date();
		String s = new SimpleDateFormat(format).format(date);
		return s;
	}

	/**
	 * 判断日期类型
	 * 
	 * @param strDate
	 *            成功返回date类型，失败返回null
	 * @return
	 */
	public static java.util.Date isDate(String strDate) {
		java.util.Date returnDate = null;
		try {
			DateFormat df = DateFormat.getDateInstance();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			String cDate = sdf.format(df.parse(strDate)).toString();
			returnDate = df.parse(cDate);
		} catch (Exception e) {
			return null;
		}
		return returnDate;
	}

	/**
	 * 字符编码自定义转换类型
	 * 
	 * @param str
	 * @param fEncode
	 * @param tEncode
	 * @return
	 */
	public static String convertEncode(String str, String fEncode, String tEncode) {
		if (str == null) {
			return str;
		} else {
			try {
				return new String(str.getBytes(fEncode), tEncode);
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}
	}

	/**
	 * 转换GBK 到 utf-8
	 * 
	 * @param str
	 * @return
	 */
	public static String cGBK2UTF8(String str) {
		if (str == null) {
			return str;
		} else {
			try {
				/*
				 * 如果 页面为UTF-8的页面 但是用GBK进行编码了 将已经遍成为GBK的按照GBK取出成BYTE 转换为原始页面的编码
				 */
				return new String(str.getBytes("GBK"), "UTF-8");
			} catch (Exception e) {
				// System.out.println("PubUnit.ConverttoGBK:" + e.toString());
				e.printStackTrace();
				return null;
			}
		}

	}
	
	public static String  cISO2UTF8(String str)
	{
		return convertEncode(str, "ISO-8859-1", "UTF-8");
	}

	/**
	 * 转换ISO8859-1 到 GB2312
	 * 
	 * @param str
	 * @return
	 */
	public static String cISO2GB2312(String str) {
		if (str == null) {
			return str;
		} else {
			try {
				return new String(str.getBytes("ISO-8859-1"), "gb2312");
			} catch (Exception e) {
				System.out.println("PubUnit.ConverttoGBK:" + e.toString());
				return null;
			}
		}

	}

	/**
	 * 转换 GB2312 到 ISO8859-1
	 * 
	 * @param str
	 * @return
	 */
	public static String cGB23122ISO(String str) {
		if (str == null) {
			return str;
		} else {
			try {
				return new String(str.getBytes("gb2312"), "ISO-8859-1");
			} catch (Exception e) {
				System.out.println("PubUnit.Convertto8859:" + e.toString());
				return null;
			}
		}

	}

	/**
	 * 求a1 a2数组的交集
	 * 
	 * @param a1
	 * @param a2
	 * @return 返回交集数组
	 */
	public static String[] arrayIntersection(String[] a1, String[] a2) {

		List<String> list = Arrays.asList(a1);
		list.retainAll(Arrays.asList(a2)); // list 中的就是交集了.

		return list.toArray(new String[0]);
	}

	/**
	 * union all 将两个StringArray 组合成一个StringArray
	 * 
	 * @param a1
	 * @param a2
	 * @return
	 */
	public static String[] arrayUnionAll(String[] a1, String[] a2) {
		String[] a3 = new String[a1.length + a2.length];
		System.arraycopy(a1, 0, a3, 0, a1.length);
		System.arraycopy(a2, 0, a3, a1.length, a2.length);
		return a3;
	}

	/**
	 * 将两个StringArray求 并集
	 * 
	 * @param a
	 * @return
	 */
	public static String[] arrayUnion(String[] a1, String[] a2) {
		String[] a3 = arrayUnionAll(a1, a2);
		HashSet set = new HashSet();
		set.addAll(Arrays.asList(a3));
		String[] strs2 = (String[]) set.toArray(new String[0]);
		return strs2;
	}

	/**
	 * 从 a1 中移除包含在指定 a2 中的所有元素
	 * 
	 * @param a1
	 * @param a2
	 * @return
	 */
	public static String[] removeAll(String[] a1, String[] a2) {
		List<String> list = Arrays.asList(a1);
		list.removeAll(Arrays.asList(a2)); // list 中的就是交集了.
		return list.toArray(new String[0]);
	}

	/**
	 * 去掉string前后空格
	 * 
	 * @param parameter
	 * @return
	 */
	public static String trim(String parameter) {
		return parameter.trim();
	}

	/**
	 * 限制字符长度 截取前charCount个汉字 英文占两个字符
	 * 
	 * @param bt
	 * @param bytesCount
	 * @return
	 */
	public static String limitChar(String str, int charCount) {
		int bytesCount = charCount * 2;
		byte[] bytes = str.getBytes();
		if (bytesCount >= bytes.length) { return str; }
		char[] chars = new String(bytes, 0, bytesCount).toCharArray();
		char[] charsPlus = new String(bytes, 0, bytesCount + 1).toCharArray();

		if (chars.length == charsPlus.length) { return new String(	bytes,
																	0,
																	bytesCount - 1); }

		return new String(bytes, 0, bytesCount);

	}

	/**
	 * 将字符串转换为整数 如果转换失败返回0
	 * 
	 * @param str
	 * @return
	 */
	public static final int getInt(String str) {
		return getInt(str, 0);
	}

	/**
	 * 将字符串转换为整数 转换失败返回 @defaultvalue
	 * 
	 * @param str
	 * @return
	 */
	public static final int getInt(String strName, int defaultvalue) {
		if (strName == null) { return defaultvalue; }
		try {
			return Integer.parseInt(strName.trim());
		} catch (Exception e) {
			return defaultvalue;
		}
	}

	/**
	 * 将中文字符转换为简拼
	 * 
	 * @param c
	 * @return
	 */
	public static String toJP(String c) {

		char[] chars = c.toCharArray();

		StringBuffer sb = new StringBuffer("");

		for (int i = 0; i < chars.length; i++) {
			sb.append(getJP(chars[i]));
		}

		// return sb.toString().toUpperCase();
		return sb.toString();
	}

	public static String getJP(char c) {
		byte[] array = new byte[2];
		array = String.valueOf(c).getBytes();
		if (array.length < 2) { return String.valueOf(c); }
		int i = (short) (array[0] - '\0' + 256) * 256
				+ (short) (array[1] - '\0' + 256);
		if (i < 0xB0A1) { return String.valueOf(c); }
		if (i < 0xB0C5) { return "a"; }
		if (i < 0xB2C1) { return "b"; }
		if (i < 0xB4EE) { return "c"; }
		if (i < 0xB6EA) { return "d"; }
		if (i < 0xB7A2) { return "e"; }
		if (i < 0xB8C1) { return "f"; }
		if (i < 0xB9FE) { return "g"; }
		if (i < 0xBBF7) { return "h"; }
		if (i < 0xBFA6) { return "j"; }
		if (i < 0xC0AC) { return "k"; }
		if (i < 0xC2E8) { return "l"; }
		if (i < 0xC4C3) { return "m"; }
		if (i < 0xC5B6) { return "n"; }
		if (i < 0xC5BE) { return "o"; }
		if (i < 0xC6DA) { return "p"; }
		if (i < 0xC8BB) { return "q"; }
		if (i < 0xC8F6) { return "r"; }
		if (i < 0xCBFA) { return "s"; }
		if (i < 0xCDDA) { return "t"; }
		if (i < 0xCEF4) { return "w"; }
		if (i < 0xD1B9) { return "x"; }
		if (i < 0xD4D1) { return "y"; }
		if (i < 0xD7FA) { return "z"; }
		return String.valueOf(c);
	}

	/**
	 * 将数组转换成串，串以","分隔
	 * 
	 * @param str
	 *            ， 输入串
	 * @return 串数组
	 */
	public final static String arrayToString(String[] arrays) {
		return arrayToString(arrays, false);
	}

	/**
	 * 去掉字符串的前后空格,字符串中的制表符,回车符,null原样返回
	 * 
	 * @param str
	 * @return
	 */
	public final static String trimTab(String str) {
		if (str != null) {
			str = str.trim().replaceAll("\t", "").replaceAll("\n", "");
		}
		return str;
	}

	/**
	 * 将数组转换成串，串以","分隔
	 * 
	 * @param str
	 *            ， 输入串
	 * @param isString
	 *            ， 是否给每个参数加入引号
	 * @return 串数组
	 */
	public final static String arrayToString(Object[] arrays, boolean isString) {
		StringBuffer ret = new StringBuffer("");
		if ((arrays == null) || (arrays.length == 0)) { return ""; }
		for (int i = 0; i < arrays.length; i++) {
			if (i > 0) {
				ret.append(",");
			}
			if (isString) {
				ret.append("'");
			}
			ret.append(arrays[i]);
			if (isString) {
				ret.append("'");
			}
		}
		return ret.toString();
	}

	/**
	 * 将数组转换成串，串以" "分隔
	 * 
	 * @param str
	 *            ， 输入串
	 * @param isString
	 *            ， 是否给每个参数加入引号
	 * @return 串数组
	 */
	public final static String arrayToStr_Space(String[] arrays,
												boolean isString) {
		StringBuffer ret = new StringBuffer("");
		if (arrays == null) { return ""; }
		for (int i = 0; i < arrays.length; i++) {
			if (i > 0) {
				ret.append(" ");
			}
			if (isString) {
				ret.append("'");
			}
			ret.append(arrays[i]);
			if (isString) {
				ret.append("'");
			}
		}
		return ret.toString();
	}

	/**
	 * 转换字符串首字母为大写
	 * 
	 * @param str
	 * @return
	 */
	public final static String firstCharToUpper(String str) {
		char c = str.charAt(0);
		if (!Character.isLetter(c)) {
			return str;
		} else if (Character.isUpperCase(c)) {
			return str;
		} else if (Character.isLowerCase(c)) {
			return (char) (c - 32) + str.substring(1);
		} else {
			return str;
		}
	}

	/**
	 * 将逗号隔开的字符串分别加上单引号
	 * 
	 * @param str
	 * @return
	 */
	public final static String formatSqlIn(String str) {
		String[] ss = str.split(",");
		return arrayToString(ss, true);
	}

	/**
	 * 判断object1是否是object2的子集
	 * 
	 * @param object1
	 *            object数组
	 * @param object2
	 *            object数组
	 * @return true/false
	 */
	public static boolean arraySubset(Object[] object1, Object[] object2) {
		List<Object> list1 = Arrays.asList(object1);
		List<Object> list2 = Arrays.asList(object2);
		return list1.containsAll(list2);
	}

	/**
	 * 将小写金额转换为大写
	 * 
	 * @param amount
	 *            110.00
	 * @return 壹佰壹拾圆整
	 */
	public static String amountToUpper(String amount) throws Exception {
		// String[] lowerAmount = { "0", "1", "2", "3", "4", "5", "6", "7", "8",
		// "9" };
		String[] upperAmount = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
				"玖" };
		String[] unit = { "分", "角", "圆", "拾", "佰", "仟", "萬", "亿" };
		String wholeUnit = "整";
		StringBuffer result = new StringBuffer();

		if (StringUtil.isEmpty(amount)) { return ""; }
		// 为0
		if (Double.valueOf(amount) == 0) { return upperAmount[0]; }
		// 去掉开头和结尾的0
		amount = amount.replaceAll("^0*", "");
		if (amount.startsWith(".")) {
			amount = "0" + amount;
		}
		if (amount.indexOf(".") > -1) {
			amount = amount.replaceAll("0*$|\\.0{1,2}$", "");
		}
		// 判断格式
		Pattern p = Pattern.compile("\\d{1,12}(\\.\\d{1,2})?");
		Matcher m = p.matcher(amount);
		if (!m.matches()) { throw new Exception("金额格式不正确! "); }
		// 分成整数和小数分别读
		String whole = "";
		String integral = "";
		if (amount.indexOf(".") > -1) {
			whole = amount.split("\\.")[0];
			integral = amount.split("\\.")[1];
		} else {
			whole = amount;
		}
		// 整数读法
		StringBuffer sceAmount = new StringBuffer(whole);
		if (sceAmount.length() > 4) { // 每4位用逗号分隔
			int count = sceAmount.length() / 4;
			for (int i = 0; i <= count; i++) {
				if (i == 1) {
					sceAmount.insert(sceAmount.length() - 4 * i, ",");
				} else if (i > 1) {
					sceAmount.insert(sceAmount.length() - 4 * i - 1, ",");
				}
			}
		}
		String[] sce = sceAmount.toString().split(",");
		for (int i = sce.length - 1; i >= 0; i--) { // 每4位循环读
			StringBuffer oneComma = new StringBuffer();
			if (Pattern.compile("\\d{1,4}").matcher(sce[i]).matches()) {
				if (Pattern.compile("[1-9]{4}").matcher(sce[i]).matches()) { // 不含有0
					int t = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 千位
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 百位
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 十位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(3))); // 个位
					oneComma.append(upperAmount[t])
							.append(unit[5])
							.append(upperAmount[h])
							.append(unit[4])
							.append(upperAmount[d])
							.append(unit[3])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("0{1}[1-9]{1}0{1}[1-9]{1}")
									.matcher(sce[i])
									.matches()) {
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 百位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(3))); // 个位
					oneComma.append(upperAmount[0])
							.append(upperAmount[h])
							.append(unit[4])
							.append(upperAmount[0])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("0{1,3}[1-9]{1}")
									.matcher(sce[i])
									.matches()) {
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(3))); // 个位
					oneComma.append(upperAmount[0]).append(upperAmount[e]);
				} else if (Pattern	.compile("0{1,2}[1-9]{1}0{1}")
									.matcher(sce[i])
									.matches()) {
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 十位
					oneComma.append(upperAmount[0])
							.append(upperAmount[d])
							.append(unit[3]);
				} else if (Pattern	.compile("0{1}[1-9]{1}0{2}")
									.matcher(sce[i])
									.matches()) {
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 百位
					oneComma.append(upperAmount[0])
							.append(upperAmount[h])
							.append(unit[4]);
				} else if (Pattern	.compile("[1-9]{1}0{3}")
									.matcher(sce[i])
									.matches()) {
					int t = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 千位
					oneComma.append(upperAmount[t]).append(unit[5]);
				} else if (Pattern	.compile("[1-9]{2}0{2}")
									.matcher(sce[i])
									.matches()) {
					int t = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 千位
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 百位
					oneComma.append(upperAmount[t])
							.append(unit[5])
							.append(upperAmount[h])
							.append(unit[4]);
				} else if (Pattern	.compile("[1-9]{1}0{1}[1-9]{1}0{1}")
									.matcher(sce[i])
									.matches()) {
					int t = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 千位
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 十位
					oneComma.append(upperAmount[t])
							.append(unit[5])
							.append(upperAmount[0])
							.append(upperAmount[d])
							.append(unit[3]);
				} else if (Pattern	.compile("[1-9]{1}0{2}[1-9]{1}")
									.matcher(sce[i])
									.matches()) {
					int t = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 千位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(3))); // 个位
					oneComma.append(upperAmount[t])
							.append(unit[5])
							.append(upperAmount[0])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("0{1}[1-9]{2}0{1}")
									.matcher(sce[i])
									.matches()) {
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 百位
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 十位
					oneComma.append(upperAmount[0])
							.append(upperAmount[h])
							.append(unit[4])
							.append(upperAmount[d])
							.append(unit[3]);
				} else if (Pattern	.compile("0{1,2}[1-9]{2}")
									.matcher(sce[i])
									.matches()) {
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 十位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(3))); // 个位
					oneComma.append(upperAmount[0])
							.append(upperAmount[d])
							.append(unit[3])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("[1-9]{3}0{1}")
									.matcher(sce[i])
									.matches()) {
					int t = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 千位
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 百位
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 十位
					oneComma.append(upperAmount[t])
							.append(unit[5])
							.append(upperAmount[h])
							.append(unit[4])
							.append(upperAmount[d])
							.append(unit[3]);
				} else if (Pattern	.compile("[1-9]{2}0{1}[1-9]{1}")
									.matcher(sce[i])
									.matches()) {
					int t = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 千位
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 百位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(3))); // 个位
					oneComma.append(upperAmount[t])
							.append(unit[5])
							.append(upperAmount[h])
							.append(unit[4])
							.append(upperAmount[0])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("0{1}[1-9]{3}")
									.matcher(sce[i])
									.matches()) { // 四位
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 百位
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 十位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(3))); // 个位
					oneComma.append(upperAmount[0])
							.append(upperAmount[h])
							.append(unit[4])
							.append(upperAmount[d])
							.append(unit[3])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("[1-9]{1}0{1}[1-9]{2}")
									.matcher(sce[i])
									.matches()) {
					int t = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 千位
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 十位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(3))); // 个位
					oneComma.append(upperAmount[t])
							.append(unit[5])
							.append(upperAmount[0])
							.append(upperAmount[d])
							.append(unit[3])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("[1-9]{3}")
									.matcher(sce[i])
									.matches()) { // 三位
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 百位
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 十位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 个位
					oneComma.append(upperAmount[h])
							.append(unit[4])
							.append(upperAmount[d])
							.append(unit[3])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("[1-9]{1}0{2}")
									.matcher(sce[i])
									.matches()) { // 三位
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 百位
					oneComma.append(upperAmount[h]).append(unit[4]);
				} else if (Pattern	.compile("[1-9]{1}0{1}[1-9]{1}")
									.matcher(sce[i])
									.matches()) {
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 百位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(2))); // 个位
					oneComma.append(upperAmount[h])
							.append(unit[4])
							.append(upperAmount[0])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("[1-9]{2}0{1}")
									.matcher(sce[i])
									.matches()) {
					int h = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 百位
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 十位
					oneComma.append(upperAmount[h])
							.append(unit[4])
							.append(upperAmount[d])
							.append(unit[3]);
				} else if (Pattern	.compile("[1-9]{1}")
									.matcher(sce[i])
									.matches()) {
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 个位
					oneComma.append(upperAmount[e]);
				} else if (Pattern	.compile("[1-9]{2}")
									.matcher(sce[i])
									.matches()) { // 两位
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 十位
					int e = Integer.valueOf(String.valueOf(sce[i].charAt(1))); // 个位
					oneComma.append(upperAmount[d])
							.append(unit[3])
							.append(upperAmount[e]);
				} else if (Pattern	.compile("[1-9]{1}0{1}")
									.matcher(sce[i])
									.matches()) {
					int d = Integer.valueOf(String.valueOf(sce[i].charAt(0))); // 十位
					oneComma.append(upperAmount[d]).append(unit[3]);
				}
			}
			if (sce.length == 3) {
				if (i == 2) {
					result.insert(0, oneComma.toString()).append(unit[2]);
				} else if (i == 1) {// 有一个逗号(包含万位单位)
					oneComma.append(unit[6]);
					result.insert(0, oneComma.toString());
				} else if (i == 0) { // 有两个逗号(包含亿位单位)
					oneComma.append(unit[7]);
					result.insert(0, oneComma.toString());
				}
			} else if (sce.length == 2) {
				if (i == 1) {
					result.insert(0, oneComma.toString()).append(unit[2]);
				} else if (i == 0) {// 有一个逗号(包含万位单位)
					oneComma.append(unit[6]);
					result.insert(0, oneComma.toString());
				}
			} else if (sce.length == 1) {// 没有逗号,最大单位为千
				result.insert(0, oneComma.toString()).append(unit[2]);
			}
		}
		// 小数读法
		if (integral.length() == 1) { // 只带角
			result	.append(upperAmount[0])
					.append(upperAmount[Integer.valueOf(integral)])
					.append(unit[1]);
		} else if (integral.length() == 2) {
			if (!integral.startsWith("0")) {// 有角有分
				result	.append(upperAmount[0])
						.append(upperAmount[Integer.valueOf(String.valueOf(integral.charAt(0)))])
						.append(unit[1])
						.append(upperAmount[Integer.valueOf(String.valueOf(integral.charAt(1)))])
						.append(unit[0]);
			} else {// 只有分
				result	.append(upperAmount[0])
						.append(upperAmount[Integer.valueOf(String.valueOf(integral.charAt(1)))])
						.append(unit[0]);
			}
		} else if (integral.equals("")) {
			result.append(wholeUnit);
		}
		return result.toString();
	}

	/**
	 * 
	 * 
	 * @param str
	 * @param bytesCount
	 * @return
	 */
	public static String cut(String str, int bytesCount) {

		byte[] bytes = str.getBytes();
		if (bytes.length <= bytesCount) { return str; }
		char[] chars = new String(bytes, 0, bytesCount).toCharArray();
		char[] charsPlus = new String(bytes, 0, bytesCount + 1).toCharArray();

		if (chars.length == charsPlus.length) { return new String(	bytes,
																	0,
																	bytesCount - 1); }

		return new String(bytes, 0, bytesCount);

	}

	public static String[] capital = { "零", "一", "二", "三", "四", "五", "六", "七",
			"八", "九" };

	/**
	 * 年转换成中文 "2010"->二零一零
	 * 
	 * @param date
	 * @return
	 */
	public static String getCapsYear(int year) {
		String strYear = year + "";
		try {
			return capital[strYear.charAt(0) - '0'] + capital[strYear.charAt(1) - '0']
					+ capital[strYear.charAt(2) - '0']
					+ capital[strYear.charAt(3) - '0'];
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 月（日）转换成中文 "12"->十二
	 * 
	 * @param date
	 * @return
	 */
	public static String getCaspsMonth(int num) {
		if (num >= 10) {
			if (num % 10 != 0) {
				if (num / 10 > 1) {
					return capital[num / 10] + "十" + capital[num % 10];
				} else {
					return "十" + capital[num % 10];
				}
			} else {
				if (num / 10 > 1) {
					return capital[num / 10] + "十";
				} else {
					return "十";
				}
			}
		} else {
			return capital[num];
		}
	}
	
	/**
	 * 替换字符
	 * @param regex
	 * 			表达式
	 * @param param
	 * 			替换的字符
	 * @param info
	 * 			被替换的字符
	 * @return
	 */
	public static String replaceStr(String regex, String param, String info) {
		if(!isEmpty(param)) {
			info = info.replaceAll(regex, param);
		} else {
			info = info.replaceAll(regex, "");
		}
		return info;
	}
	/**
	 * 按指定字符拆分字符串
	 * @param str
	 *     原字符串
	 * @param param
	 *     拆分符号
	 * @return
	 */
	public static String[] splitStr(String str,String param)
	{
		if(!isEmpty(str)&&!isEmpty(param))
		{
			String[] spStr = str.split(param);
			for (int i = 0;i<spStr.length;i++) {
				String strx = spStr[i];
				if(!StringUtil.isEmpty(strx))
				{
					spStr[i] = strx.trim();
				}				
			}
			return spStr;
		}
		return null;
	}
    
	/**
	 * 
	 * @param str
	 *      字符串数组
	 * @param param
	 *      前拼接符号
	 * @param paramx
	 *      后拼接符号
	 * @return
	 */
	public static String joinStr(String[] str,String param,String paramx)
	{
		if(!isEmpty(str))
		{
			StringBuffer buff = new StringBuffer();
            for (String strx : str) {
            	strx = strx.trim();
            	if(!StringUtil.isEmpty(strx))
            	{     
            		strx = finalSplit(strx);
    				buff.append(param).append(strx).append(paramx);
            	}
			}
            return buff.toString();
		}
		return null;
	}
	/**
	 * 发布车辆信息格式保存
	 * @param str
	 * @param param
	 * @return
	 */
	public static String validStr(String str)
	{
		if(!isEmpty(str))
		{
			str = finalSplit(str);
			if(str.indexOf("\r\n") >= 0)
			{
				return joinStr(splitStr(str, "\r\n"), "<p>", "</p>");
			}
		}
		return str;
	}
	
	public static void main(String[] agrs) throws Exception {
		Map<String, String> map = new HashMap<String, String>();
		List<Object> list = new ArrayList<Object>();
		list.add(null);
		map.put("a", null);
		System.out.println(map.isEmpty());
		System.out.println(map.size());
		System.out.println(list.isEmpty());
		System.out.println(list.size());
	}
	/**
	 * 去除字符串前边空格（仅当trim()无效时）
	 * @param str
	 * @return
	 */
	public static String finalSplit(String str)
	{		
		str = str.replaceAll("^[ | ]*", "");
		return str.trim();
	}
	/**
	 * 字符串反转
	 * @param str
	 * @return
	 */
    public static String reverse(String str){  
        char[] charsOld = str.toCharArray();  
          
        char[] charsNew = new char[charsOld.length];  
          
        int index = charsOld.length-1;  
          
        for (int i = 0; i < charsOld.length ; i++) {  
              
            charsNew[i] = charsOld[index - i];  
        }  
          
        return String.valueOf(charsNew);
    }
    
    public static int[] stringToIntAry(String str)
    {
    	String[] strs = str.split(",");
    	int[] result = new int[strs.length];
    	for (int i = 0; i < strs.length; i++) 
    	{
			result[i] = Integer.parseInt(strs[i]);
		}
    	return result;
    }
}

