package com.internet.cms.web;

public class SendSMSConstants {
    
	//你好,本次验证码为###,请妥善保管
	public static final String REG_CONTENT="你好,本次验证码为#,请妥善保管";
	//你好 你的爱车订单号###已经生成,保养地点为###,保养时间为###,保养工位为###,请妥善保管
	public static final String CREATE_ORDER_CONTENT="你好 你的爱车订单号%s已经生成,保养地点为%s,保养时间为%s,保养工位为%s,请妥善保管";
	//你好 你的爱车订单号###已经生成,将在1小时后取消,请尽快支付,请妥善保管
    public static final String NO_PAY_ALTER_CONTENT="你好 你的爱车订单号%s已经生成,将在1小时后取消,请尽快支付,请妥善保管";   
    //你好 你的爱车订单号%s,保养地点为%s,保养时间为%s,保养工位为%s,已经过期,请重新预约时间
    public static final String PAY_ALTER_CONTENT="你好 你的爱车订单号%s,保养地点为%s,保养时间为%s,保养工位为%s,已经过期,请重新预约时间";
    //你好 你的爱车订单号%s,保养地点为%s,保养时间为%s,保养工位为%s,1个小时后将快保,请注意预约时间
    public static final String NOTIFY_PAY_CONTENT="你好 你的爱车订单号%s,保养地点为%s,保养时间为%s,保养工位为%s,1个小时后将快保,请注意预约时间";
  //你好 你的爱车订单号%s,保养地点为%s,保养时间为%s,保养工位为%s,1个小时后将快保,请注意预约时间
    public static final String NO_PAY_NOTIFY_PAY_CONTENT="你好 你的爱车订单号%s,保养地点为%s,保养时间为%s,保养工位为%s,已经过期,请重新预约时间";
	//你好 你的购买的产品###,已经###
	public static final String ORDER_STATUS="你好 你的购买的产品###,已经###";
	
	public static final String REPLACE_SIGN="#";
}
