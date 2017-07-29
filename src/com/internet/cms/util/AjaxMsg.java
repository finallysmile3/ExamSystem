package com.internet.cms.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.internet.cms.util.ConstantEnum.MsgType;



/**
 * Ajax请求返回格式封装
 * @author luokun
 */
public class AjaxMsg extends HashMap<String, Object> {

	private static final long serialVersionUID = -5360500144068113866L;
	private static final String CODE = "code";
	private static final String MESSAGE = "message";
	private static final String DATA = "data";
	private static final String HEADER = "header"; //返回头信息
	private static final String _HASMORE = "haveMore"; 
	private static final String _COUNT = "count";
	private MsgType currentType = MsgType.SUCCESS;
	private static Gson gson = new GsonBuilder().serializeNulls().create();
	
	private AjaxMsg() {}
	/**
	 * 创建一个成功类型的返回消息
	 * 
	 * @return
	 */
	public static AjaxMsg newInstance() {
		return new AjaxMsg();
	}
	
	/**
	 * 创建一个成功类型的返回消息
	 * 
	 * @return
	 */
	public static AjaxMsg newSuccess() {
		return new AjaxMsg(MsgType.SUCCESS);
	}

	/**
	 * 创建一个错误类型的返回消息
	 * 
	 * @return
	 */
	public static AjaxMsg newError() {
		return new AjaxMsg(MsgType.ERROR);
	}

	/**
	 * 创建一个警告类型的返回消息
	 * 
	 * @return
	 */
	public static AjaxMsg newWarn() {
		return new AjaxMsg(MsgType.WARN);
	}

	private AjaxMsg(MsgType state) {
		put(CODE, state.toString());
		currentType = state;
	}

	/**
	 * 添加消息到消息对象中<br/>
	 * 如果没有指定状态，则默认按照当前的消息类型<br/>
	 * 消息存储在 .message.[error/success/warn]中
	 * 
	 * @param message
	 */
	public AjaxMsg addMessage(String message) {
		addMessage(currentType, message);
		return this;
	}

	/**
	 * 添加一条相应状态的消息到消息集合中(成功/失败/警告)<br/>
	 * 可添加多条消息，多种类型；<br/>
	 * 消息存储在 .message.[error/success/warn]中
	 * 
	 * @param state
	 * @param message
	 */
	@SuppressWarnings("unchecked")
	public AjaxMsg addMessage(MsgType state, String message) {
		// 获取存储消息的Map列表
		Map<MsgType, List<String>> messagePool = (Map<MsgType, List<String>>) get(MESSAGE);
		if (messagePool == null || messagePool.isEmpty()) {
			messagePool = Maps.newHashMap();
			put(MESSAGE, messagePool);
		}

		// 获取对应类型的List.没有就创建新的。
		List<String> msgs = messagePool.get(state);
		if (msgs==null || msgs.isEmpty()) {
			msgs = Lists.newArrayList();
			messagePool.put(state, msgs);
		}
		msgs.add(message);
		return this;
	}
	
	/**
	 * 添加一个返回数据<br/>
	 * 可添加多个
	 * 
	 * @param obj
	 */
	@SuppressWarnings("unchecked")
	public  AjaxMsg addHeader(MsgType msgType, String message) {
		// 获取存储数据的Map列表
		Map<String, Object> objectPool = (Map<String, Object>) get(HEADER);
		if (objectPool == null || objectPool.isEmpty()) {
			objectPool = Maps.newHashMap();
		}

		objectPool.put(CODE,msgType.toString());
		objectPool.put(MESSAGE, message);
		put(HEADER, objectPool);
		return this;
	}
	
	/**
	 * 添加一个返回数据<br/>
	 * 可添加多个
	 * 
	 * @param obj
	 */
	@SuppressWarnings("unchecked")
	public AjaxMsg addData(String key, Object obj) {
		// 获取存储数据的Map列表
		Map<String, Object> objectPool = (Map<String, Object>) get(DATA);
		if (objectPool == null || objectPool.isEmpty()) {
			objectPool = Maps.newHashMap();
		}

		objectPool.put(key, obj);
		put(DATA, objectPool);
		return this;
	}

	/**
	 * 添加一个返回数据<br/>
	 * 可添加多个
	 * 
	 * @param obj
	 */
	@SuppressWarnings("unchecked")
	public AjaxMsg addMap(Object obj) {
		put(DATA, obj);
		return this;
	}
	
	
	/**
	 * 添加一个返回数据<br/>
	 * 可添加多个
	 * 
	 * @param obj
	 */
	@SuppressWarnings("unchecked")
	public AjaxMsg addHashMap(String key,Object value) {
		put(key, value);
		return this;
	}
	
	
	
	/**
	 * 添加一个返回数据<br/>
	 * 可添加多个
	 * 
	 * @param obj
	 */
	@SuppressWarnings("unchecked")
	public AjaxMsg addCount(Object obj) {
		put(_COUNT, obj);
		return this;
	}
	
	/**
	 * 添加一个返回数据<br/>
	 * 可添加多个
	 * 
	 * @param obj
	 */
	@SuppressWarnings("unchecked")
	public AjaxMsg addMore(Object obj) {
		put(_HASMORE, obj);
		return this;
	}
	/**
	 * 将对象转换成Json格式返回
	 * 
	 * @param obj
	 * @return
	 */
	public static String toJson(Object obj) {
		if (obj == null) {
			return "";
		}

		return gson.toJson(obj);
	}

	/**
	 * 将对象转换成Json格式返回
	 * 
	 * @return
	 */
	public String toJson() {
		return gson.toJson(this);
	}

	/**
	 * 返回当前的消息类型[成功/错误/警告]
	 * 
	 * @return
	 */
	public MsgType getType() {
		return currentType;
	}

	/**
	 * 返回当前执行是否成功
	 * 
	 * @return
	 */
	public Boolean isSuccess() {
		if (currentType.equals(MsgType.SUCCESS)) {
			return Boolean.TRUE;
		} else {
			return Boolean.FALSE;
		}
	}

	/**
	 * 返回当前执行是否是错误
	 * 
	 * @return
	 */
	public Boolean isError() {
		if (currentType.equals(MsgType.ERROR)) {
			return Boolean.TRUE;
		} else {
			return Boolean.FALSE;
		}
	}

	/**
	 * 返回当前执行是否是警告
	 * 
	 * @return
	 */
	public Boolean isWarn() {
		if (currentType.equals(MsgType.WARN)) {
			return Boolean.TRUE;
		} else {
			return Boolean.FALSE;
		}
	}

	/**
	 * 返回消息集合中包含的数据信息，如果未找到返回null
	 * 
	 * @param key
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Object getData(String key) {
		Map<String, Object> objectPool = (Map<String, Object>) get(DATA);
		if (objectPool == null) {
			return null;
		}
		Object data = objectPool.get(key);
		return data;
	}

	/**
	 * 获取消息
	 * @param type
	 * @return
	 */
	public List<String> getMessages(MsgType type) {
		// 获取存储消息的Map列表
		Map<MsgType, List<String>> messagePool = (Map<MsgType, List<String>>) get(MESSAGE);
		if (messagePool == null || messagePool.isEmpty()) {
			return Lists.newArrayList();
		}

		// 获取对应类型的List.没有就创建新的。
		List<String> msgs = messagePool.get(type);
		if (msgs.isEmpty()) {
			return Lists.newArrayList();
		} else {
			return msgs;
		}
	}
	
	/**
	 * 得到错误消息
	 * @return
	 */
	public List<String> getErrorMessages(){
		return getMessages(MsgType.ERROR);
	}
	
	/**
	 * 得到警告消息
	 * @return
	 */
	public List<String> getWarnMessages(){
		return getMessages(MsgType.WARN);
	}
	
	/**
	 * 得到成功消息
	 * @return
	 */
	public List<String> getSuccessMessages(){
		return getMessages(MsgType.SUCCESS);
	}

}

