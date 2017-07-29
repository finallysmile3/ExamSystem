package com.internet.cms.page;

import java.util.List;

/**
 * 分页对象
 * @author 邵震
 * @param <T> 传递的泛型对象
 */
public class Pager<T> {
	/**
	 * 每页显示条数
	 */
	private int size;
	/**
	 * 分页的起始页
	 */
	private int offset;
	/**
	 * 查询的总数
	 */
	private long total;
	/**
	 * 分页的结果数据
	 */
	private List<T> datas;
	
	public Pager(){}
	
	public Pager(int total,List<T> datas) {
		this.total = total;
		this.datas = datas;
	}
	public int getSize() {
		return size;
	}
	public void setSize(int size) {
		this.size = size;
	}
	public int getOffset() {
		return offset;
	}
	public void setOffset(int offset) {
		this.offset = offset;
	}
	public long getTotal() {
		return total;
	}
	public void setTotal(long total) {
		this.total = total;
	}
	public List<T> getDatas() {
		return datas;
	}
	public void setDatas(List<T> datas) {
		this.datas = datas;
	}
}
