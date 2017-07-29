package com.internet.cms.web;

public enum OrderStatus {
	/*//订单状态 
	//1下单未付款 
	2 已经付款 
	3 接单 
	4出库 
	5修理中 
	6修理完毕 
	7.确认完成 
	8完毕
	9评价
	 // 成员变量
*/    
	 ORDERED("下单未付款", 1), PAY("已经付款", 2), MAKE_ORDER("接单", 3), Warehouse("出库", 4), 
	 RepairIng("修理中", 5), RepairEd("修理完毕", 6),Confirm("确认完成 ", 7), Completed("完毕", 8), 
	 Evaluate("评价完毕", 9), CANCEL("取消订单", 10),NO_PAY_EXPIRE("未支付过期", 11),PAY_EXPIRE("已支付过期", 12),ALREADAY_NOTIFY("已经通知", 13);
	 public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	private String name;
	 private int index;
	 // 构造方法
     private OrderStatus(String name, int index) {
         this.name = name;
         this.index = index;
     }

     // 覆盖方法
     @Override
     public String toString() {
         return this.index + "_" + this.name;
     }
}
