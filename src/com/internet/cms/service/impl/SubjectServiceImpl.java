package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.SubjectMapper;
import com.internet.cms.model.Subject;
import com.internet.cms.model.SubjectExample;
import com.internet.cms.service.SubjectService;

@Service("subjectService")
public class SubjectServiceImpl implements SubjectService {

	@Autowired
	private SubjectMapper subjectMapper;
	@Override
	public int countByExample(SubjectExample example) {
		// TODO Auto-generated method stub
		return subjectMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(SubjectExample example) {
		// TODO Auto-generated method stub
		return subjectMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer subjectId) {
		// TODO Auto-generated method stub
		return subjectMapper.deleteByPrimaryKey(subjectId);
	}

	@Override
	public int insert(Subject record) {
		// TODO Auto-generated method stub
		return subjectMapper.insert(record);
	}

	@Override
	public int insertSelective(Subject record) {
		// TODO Auto-generated method stub
		return subjectMapper.insertSelective(record);
	}

	@Override
	public List<Subject> selectByExample(SubjectExample example) {
		// TODO Auto-generated method stub
		return subjectMapper.selectByExample(example);
	}

	@Override
	public Subject selectByPrimaryKey(Integer subjectId) {
		// TODO Auto-generated method stub
		return subjectMapper.selectByPrimaryKey(subjectId);
	}

	@Override
	public int updateByExampleSelective(Subject record, SubjectExample example) {
		// TODO Auto-generated method stub
		return subjectMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(Subject record, SubjectExample example) {
		// TODO Auto-generated method stub
		return subjectMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(Subject record) {
		// TODO Auto-generated method stub
		return subjectMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Subject record) {
		// TODO Auto-generated method stub
		return subjectMapper.updateByPrimaryKey(record);
	}

}
