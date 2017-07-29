package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.ChoiceQuestionMapper;
import com.internet.cms.model.ChoiceQuestion;
import com.internet.cms.model.ChoiceQuestionExample;
import com.internet.cms.service.ChoiceQuestionService;

@Service("choiceQuestionService")
public class ChoiceQuestionServiceImpl implements ChoiceQuestionService {

	@Autowired
	private ChoiceQuestionMapper choiceQuestionMapper;
	@Override
	public int countByExample(ChoiceQuestionExample example) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(ChoiceQuestionExample example) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer questionId) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.deleteByPrimaryKey(questionId);
	}

	@Override
	public int insert(ChoiceQuestion record) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.insert(record);
	}

	@Override
	public int insertSelective(ChoiceQuestion record) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.insertSelective(record);
	}

	@Override
	public List<ChoiceQuestion> selectByExample(ChoiceQuestionExample example) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.selectByExample(example);
	}

	@Override
	public ChoiceQuestion selectByPrimaryKey(Integer questionId) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.selectByPrimaryKey(questionId);
	}

	@Override
	public int updateByExampleSelective(ChoiceQuestion record, ChoiceQuestionExample example) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(ChoiceQuestion record, ChoiceQuestionExample example) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(ChoiceQuestion record) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(ChoiceQuestion record) {
		// TODO Auto-generated method stub
		return choiceQuestionMapper.updateByPrimaryKey(record);
	}

}
