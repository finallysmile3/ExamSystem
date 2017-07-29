package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.PointMapper;
import com.internet.cms.model.Point;
import com.internet.cms.model.PointExample;
import com.internet.cms.service.PointService;

@Service("pointService")
public class PointServiceImpl implements PointService {

	@Autowired
	private PointMapper pointMapper;
	@Override
	public int countByExample(PointExample example) {
		// TODO Auto-generated method stub
		return pointMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(PointExample example) {
		// TODO Auto-generated method stub
		return pointMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer pointId) {
		// TODO Auto-generated method stub
		return pointMapper.deleteByPrimaryKey(pointId);
	}

	@Override
	public int insert(Point record) {
		// TODO Auto-generated method stub
		return pointMapper.insert(record);
	}

	@Override
	public int insertSelective(Point record) {
		// TODO Auto-generated method stub
		return pointMapper.insertSelective(record);
	}

	@Override
	public List<Point> selectByExample(PointExample example) {
		// TODO Auto-generated method stub
		return pointMapper.selectByExample(example);
	}

	@Override
	public Point selectByPrimaryKey(Integer pointId) {
		// TODO Auto-generated method stub
		return pointMapper.selectByPrimaryKey(pointId);
	}

	@Override
	public int updateByExampleSelective(Point record, PointExample example) {
		// TODO Auto-generated method stub
		return pointMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(Point record, PointExample example) {
		// TODO Auto-generated method stub
		return pointMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(Point record) {
		// TODO Auto-generated method stub
		return pointMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Point record) {
		// TODO Auto-generated method stub
		return pointMapper.updateByPrimaryKey(record);
	}

}
