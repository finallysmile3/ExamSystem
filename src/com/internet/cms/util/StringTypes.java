package com.internet.cms.util;

import java.math.BigDecimal;
import java.math.BigInteger;

import com.google.common.base.Strings;

/**
 * 原始类型的转换
 * @author luokun
 */
public class StringTypes {

	private String content;

	public StringTypes(String content) {
		this.content = Strings.nullToEmpty(content);
	}

	/**
	 * 转换字符串成为真假类型，其中Y/N YES/NO都会进行转换。剩余的按照Boolean.parseBoolean(String)结果返回
	 * 
	 * @param value
	 * @return
	 */
	public static Boolean toBoolean(String value) {
		value = Strings.nullToEmpty(value).trim().toLowerCase();
		if ("y".equals(value)) {
			return Boolean.TRUE;
		} else if ("yes".equals(value)) {
			return Boolean.TRUE;
		} else if ("n".equals(value)) {
			return Boolean.FALSE;
		} else if ("no".equals(value)) {
			return Boolean.FALSE;
		} else {
			return Boolean.parseBoolean(value);
		}
	}

	@SuppressWarnings("unchecked")
	public static <T> T convert(Class<T> cls, String value) {
		StringTypes type = new StringTypes(value);
		Object o = null;
		if (cls.equals(Boolean.class) || cls.equals(boolean.class)) {
			o = type.boolValue();
		} else if (cls.equals(String.class)) {
			o = type.stringValue();
		} else if (cls.equals(Integer.class) || cls.equals(int.class)) {
			o = type.intValue();
		} else if (cls.equals(Long.class) || cls.equals(long.class)) {
			o = type.longValue();
		} else if (cls.equals(Double.class) || cls.equals(double.class)) {
			o = type.doubleValue();
		} else if (cls.equals(Float.class) || cls.equals(float.class)) {
			o = type.floatValue();
		} else if (cls.equals(BigDecimal.class)) {
			o = type.decimalValue();
		} else if (cls.equals(BigInteger.class)) {
			o = type.bigintValue();
		}
		return (T) o;
	}

	/**
	 * 返回一个空字符串表示的StringTypes
	 * 
	 * @return
	 */
	public static StringTypes empty() {
		return new StringTypes("");
	}

	public static Integer toInt(String value) {
		String str = Strings.nullToEmpty(value).trim();
		return Integer.valueOf(str);
	}

	public Boolean boolValue() {
		return StringTypes.toBoolean(content);
	}

	public String stringValue() {
		return content;
	}

	public Integer intValue() {
		return StringTypes.toInt(content);
	}

	public Long longValue() {
		return Long.valueOf(content);
	}

	public Double doubleValue() {
		return Double.valueOf(content);
	}

	public Float floatValue() {
		return Float.valueOf(content);
	}

	public BigDecimal decimalValue() {
		return new BigDecimal(content);
	}

	public BigInteger bigintValue() {
		return new BigInteger(content);
	}

	@Override
	public String toString() {
		return content;
	}

	/**
	 * 在前面补充0
	 * 
	 * @param toLength
	 *            目标长度
	 * @return
	 */
	public String patchZero(Integer toLength) {
		StringBuilder sb = new StringBuilder();
		Integer to = toLength - content.length();
		for (Integer i = 0; i < to; i++) {
			sb.append('0');
		}
		sb.append(content);
		return sb.toString();
	}

	/**
	 * 补充指定个数的字符
	 * 
	 * @param prefix
	 * @param c
	 * @param length
	 * @return
	 */
	public String patchChar(char c, Integer length) {
		StringBuilder sb = new StringBuilder(content);
		for (Integer i = 0; i < length; i++) {
			sb.append(c);
		}
		return sb.toString();
	}
}
