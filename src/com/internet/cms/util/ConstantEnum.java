package com.internet.cms.util;


public class ConstantEnum {

	
	/**
	 * 表示系统中执行请求后返回信息的状态类型
	 */
	public enum MsgType {
		/**
		 * 警告信息
		 */
		WARN("warn"),
		/**
		 * 系统异常
		 */
		ERROR("500"),
		/**
		 * 成功标志
		 */
		SUCCESS("200"),
		/**
		 * 未指明系统类型
		 */
		SYSTYPEERROR("201"),
		/**
		 * 手机号码为空
		 */
		PHONENULL("501"),
		/**
		 * 手机号码错误
		 */
		PHONEERROR("502"),
		/**
		 * 手机号码已注册
		 */
		PHONEREPECT("503"),
		/**
		 * 用户密码不能为空
		 */
		PASSWORDNULL("504"),
		/**
		 * 验证码不能为空
		 */
		CODENULL("505"),
		/**
		 * 验证码错误
		 */
		CODEERROR("506"),
		/**
		 * 手机号码验证失败
		 */
		SENDERROR("507"),
		/**
		 * 请传入当前页数
		 */
		CURRENTPAGE("508"),
		/**
		 * 请传入每页显示数量
		 */
		PAGESIZE("509"),
		/**
		 * 请传入用户ID
		 */
		LOGINIDNULL("510"),
		/**
		 * 请开通账户
		 */
		USERACCOUNT("511"),
		/**
		 * 请输入搜索内容
		 */
		SEARCHVAL("512"),
		/**
		 * 不能重复申请该商品
		 */
		GOODSAPPLYREP("513"),
		/**
		 * 请传入正确的商品ID
		 */
		GOODSIDNULL("514"),
		/**
		 * 厂商信息不存在
		 */
		PRODUCER("515"),
		/**
		 * 商品库存数量不足
		 */
		GOODSINVY("516"),
		/**
		 * 无效的参数
		 */
		INVALIDATA("600"),
		/**
		 * 重复登录
		 */
		REPEATE_LOGIN("601"),
		/**
		 * 当前用户不存在
		 */
		USERISNOTEXISTING("602"),
		/**
		 * 电话号码不存在
		 */
		PHONENOTEXISTING("603"),
		/**
		 * 修改密码失败
		 */
		CHANGEPASSWORDFAILED("604"),
		/**
		 * 删除收藏商品失败
		 */
		DELETEFAVOURITEFAILED("605"),
		/**
		 * 超过了推荐人数
		 */
		RECOMMENDETIONBYHAND("606"),
		/**
		 * 没有找到
		 */
		NOTFOUND("607"),
		/**
		 * token无效
		 */
		TOKENFAILED("608"),
		/**
		 * 订单状态
		 */
		ORDERSTATUS("609"),
		/**
		 * 更新订单状态失败
		 */
		UPDATEORDERFAILED("610"),
		/**
		 * 订单不存在
		 */
		ORDERNOTEXISTING("611");

		private String key = "";

		private MsgType(String key) {
			this.key = key;
		}

		@Override
		public String toString() {
			return this.key;
		}
	}
}
