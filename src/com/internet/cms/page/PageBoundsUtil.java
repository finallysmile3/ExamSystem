package com.internet.cms.page;

import com.github.miemiedev.mybatis.paginator.domain.Order;
import com.github.miemiedev.mybatis.paginator.domain.PageBounds;

/**
 * 再次封装PageBounds分页对象
 * @author 邵震
 *
 */
public class PageBoundsUtil {
	/**
	 * 再次封装Mybatis PageBounds分页对象
	 * @return PageBounds分页对象
	 */
	public static PageBounds PageBoundsExtend() {
		Integer pageSize = SystemContext.getPageSize();
		Integer pageOffset = SystemContext.getPageOffset();
		if(null == pageOffset || pageOffset<0) pageOffset = 0;
		if(null == pageSize || pageSize<0) pageSize = 10;
		PageBounds pageBounds = new PageBounds(pageOffset/pageSize +1 , pageSize);
		return pageBounds;
	}
	
	/**
	 * 再次封装Mybatis PageBounds分页对象
	 * @return PageBounds分页对象
	 */
	public static PageBounds PageBoundsOrderExtend(String order) {
		Integer pageSize = SystemContext.getPageSize();
		Integer pageOffset = SystemContext.getPageOffset();
		if(null == pageOffset || pageOffset<0) pageOffset = 0;
		if(null == pageSize || pageSize<0) pageSize = 10;
		PageBounds pageBounds = new PageBounds(pageOffset/pageSize +1 , pageSize , Order.formString(order));
		return pageBounds;
	}
	
	public static PageBounds PageBoundsUserExtend() {
		Integer pageSize = 1;
		Integer pageOffset = 1000;
		if(null == pageOffset || pageOffset<0) pageOffset = 0;
		if(null == pageSize || pageSize<0) pageSize = 10;
		PageBounds pageBounds = new PageBounds(pageOffset/pageSize +1 , pageSize);
		return pageBounds;
	}
}
