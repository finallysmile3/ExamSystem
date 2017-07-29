package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.ExamMapper;
import com.internet.cms.model.Exam;
import com.internet.cms.model.ExamExample;
import com.internet.cms.service.ExamService;

@Service("examService")
public class ExamServiceImpl implements ExamService {

	@Autowired
	private ExamMapper examMapper;
	@Override
	public int countByExample(ExamExample example) {
		// TODO Auto-generated method stub
		return examMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(ExamExample example) {
		// TODO Auto-generated method stub
		return examMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer examId) {
		// TODO Auto-generated method stub
		return examMapper.deleteByPrimaryKey(examId);
	}

	@Override
	public int insert(Exam record) {
		// TODO Auto-generated method stub
		return examMapper.insert(record);
	}

	@Override
	public int insertSelective(Exam record) {
		// TODO Auto-generated method stub
		return examMapper.insertSelective(record);
	}

	@Override
	public List<Exam> selectByExample(ExamExample example) {
		// TODO Auto-generated method stub
		return examMapper.selectByExample(example);
	}

	@Override
	public Exam selectByPrimaryKey(Integer examId) {
		// TODO Auto-generated method stub
		return examMapper.selectByPrimaryKey(examId);
	}

	@Override
	public int updateByExampleSelective(Exam record, ExamExample example) {
		// TODO Auto-generated method stub
		return examMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(Exam record, ExamExample example) {
		// TODO Auto-generated method stub
		return examMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(Exam record) {
		// TODO Auto-generated method stub
		return examMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Exam record) {
		// TODO Auto-generated method stub
		return examMapper.updateByPrimaryKey(record);
	}

}
