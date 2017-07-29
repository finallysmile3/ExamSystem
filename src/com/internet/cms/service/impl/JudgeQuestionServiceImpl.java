package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.JudgeQuestionMapper;
import com.internet.cms.model.JudgeQuestion;
import com.internet.cms.model.JudgeQuestionExample;
import com.internet.cms.service.JudgeQuestionService;
@Service("judgeQuestionService")
public class JudgeQuestionServiceImpl implements JudgeQuestionService {

	@Autowired
	private JudgeQuestionMapper judgeQuestionMapper;

	@Override
	public int countByExample(JudgeQuestionExample example) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(JudgeQuestionExample example) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer questionId) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.deleteByPrimaryKey(questionId);
	}

	@Override
	public int insert(JudgeQuestion record) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.insert(record);
	}

	@Override
	public int insertSelective(JudgeQuestion record) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.insertSelective(record);
	}

	@Override
	public List<JudgeQuestion> selectByExample(JudgeQuestionExample example) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.selectByExample(example);
	}

	@Override
	public JudgeQuestion selectByPrimaryKey(Integer questionId) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.selectByPrimaryKey(questionId);
	}

	@Override
	public int updateByExampleSelective(JudgeQuestion record, JudgeQuestionExample example) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(JudgeQuestion record, JudgeQuestionExample example) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(JudgeQuestion record) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(JudgeQuestion record) {
		// TODO Auto-generated method stub
		return judgeQuestionMapper.updateByPrimaryKey(record);
	}
	
}
