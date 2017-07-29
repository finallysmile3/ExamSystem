package com.internet.cms.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.mysql.jdbc.StringUtils;
/**
 * 判定及截取
 * 手机，邮箱，身份证...
 * @author luokun
 */
public class FormatUtils {
	
	/**
	 * 判断该号码是否是手机号码
	 * @param phoneNum
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static Boolean isPhoneNum(String phoneNum){
		//手机号正则表达式匹配
		String regex = "^[1][0-9]{10}$";
		Pattern p = Pattern.compile(regex);
		return p.matches(regex, phoneNum);
	}
	
	/**
	 * 判断该字符串是否是邮箱
	 * @author bo.xie
	 * @param email
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static Boolean isEmail(String email){
		String regex = "^([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\\.][A-Za-z]{2,3}([\\.][A-Za-z]{2})?$";
		Pattern p = Pattern.compile(regex);
		return p.matches(regex, email);
	}
	
	/**
	 * 判定该字符串是否是身份证
	 * @param cardNo
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static Boolean isIdCard(String cardNo){
		String regex = "";
		if(cardNo.length()==15){
			regex = "^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$";
		}else if(cardNo.length()==18){
			regex = "^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{4}$";
		}
		
		Pattern p = Pattern.compile(regex);
		return p.matches(regex, cardNo);
	}
	
	/**
	 * 隐藏邮箱
	 * @param email
	 * @return
	 */
	public static String hiddenEmail(String email){
		if (StringUtils.isNullOrEmpty(email)) {
			return "";
		} else if (email.length() < 5) {
			return email;
		} else {
			StringBuffer buffer = new StringBuffer(email);
			int num = email.indexOf("@");
			buffer.replace(2, num, "****");
			return buffer.toString();
		}
	}
	
	/**
	 * 隐藏身份证号
	 * 
	 * @param idCard
	 * @return
	 */
	public static String hiddenIdCard(String idCard) {
		if (StringUtils.isNullOrEmpty(idCard)) {
			return "";
		} else if (idCard.length() < 8) {// 小于6位的不方便截取，直接返回
			return idCard;
		} else {
			StringBuffer buffer = new StringBuffer(idCard);
			String patch = new StringTypes("").patchChar('*',
					idCard.length() - 6);
			buffer.replace(4, idCard.length() - 4, patch);
			return buffer.toString();
		}
	}
	
	/**
	 * 隐藏银行卡
	 * 
	 * @param idCard
	 * @return
	 */
	public static String hiddenBankCard(String bankCard) {
		if (StringUtils.isNullOrEmpty(bankCard)) {
			return "";
		} else if (bankCard.length() < 10) {
			return bankCard;
		} else {
			StringBuffer buffer = new StringBuffer(bankCard);
			String patch = new StringTypes("").patchChar('*',
					bankCard.length() - 6);
			buffer.replace(4, bankCard.length() - 4, patch);
			return buffer.toString();
		}
	}

	/**
	 * 隐藏电话号码
	 * 
	 * @param mobile
	 * @return
	 */
	public static String hiddenMobile(String mobile) {
		if (StringUtils.isNullOrEmpty(mobile)) {
			return "";
		} else if (mobile.length() < 5) {
			return mobile;
		} else {
			StringBuffer buffer = new StringBuffer(mobile);
			String patch = new StringTypes("").patchChar('*',
					mobile.length() - 5);
			buffer.replace(3, mobile.length() - 2, patch);
			return buffer.toString();
		}
	}
	
	/**
	 * 隐藏公司名称
	 * @param email
	 * @return
	 */
	public static String hiddenCompany(String comName){
		if (StringUtils.isNullOrEmpty(comName)) {
			return "";
		} else if (comName.length() < 5) {
			return comName;
		} else {
			StringBuffer buffer = new StringBuffer(comName);
			buffer.replace(2,comName.length()-3, "*******");
			return buffer.toString();
		}
	}
	
	/**
	 * 判断该字符是否是正整数
	 * @param phoneNum
	 * @return
	 */
	public static boolean isNumeric(String str){ 
	   Pattern pattern = Pattern.compile("[0-9]*"); 
	   Matcher isNum = pattern.matcher(str);
	   if( !isNum.matches() ){
	       return false; 
	   } 
	   return true; 
	}
}
