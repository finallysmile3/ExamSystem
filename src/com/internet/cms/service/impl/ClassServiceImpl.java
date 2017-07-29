package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.ClassesMapper;
import com.internet.cms.model.Classes;
import com.internet.cms.model.ClassesExample;
import com.internet.cms.service.ClassService;

@Service("classService")
public class ClassServiceImpl implements ClassService {

	@Autowired
	private ClassesMapper classesMapper;
	@Override
	public int countByExample(ClassesExample example) {
		// TODO Auto-generated method stub
		return classesMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(ClassesExample example) {
		// TODO Auto-generated method stub
		return classesMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer classId) {
		// TODO Auto-generated method stub
		return classesMapper.deleteByPrimaryKey(classId);
	}

	@Override
	public int insert(Classes record) {
		// TODO Auto-generated method stub
		return classesMapper.insert(record);
	}

	@Override
	public int insertSelective(Classes record) {
		// TODO Auto-generated method stub
		return classesMapper.insertSelective(record);
	}

	@Override
	public List<Classes> selectByExample(ClassesExample example) {
		// TODO Auto-generated method stub
		return classesMapper.selectByExample(example);
	}

	@Override
	public Classes selectByPrimaryKey(Integer classId) {
		// TODO Auto-generated method stub
		return classesMapper.selectByPrimaryKey(classId);
	}

	@Override
	public int updateByExampleSelective(Classes record, ClassesExample example) {
		// TODO Auto-generated method stub
		return classesMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(Classes record, ClassesExample example) {
		// TODO Auto-generated method stub
		return classesMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(Classes record) {
		// TODO Auto-generated method stub
		return classesMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Classes record) {
		// TODO Auto-generated method stub
		return classesMapper.updateByPrimaryKey(record);
	}

}
