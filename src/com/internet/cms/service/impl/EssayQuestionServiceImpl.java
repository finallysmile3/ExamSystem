package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.EssayQuestionMapper;
import com.internet.cms.model.EssayQuestion;
import com.internet.cms.model.EssayQuestionExample;
import com.internet.cms.service.EssayQuestionService;

@Service("essayQuestionService")
public class EssayQuestionServiceImpl implements EssayQuestionService {

	@Autowired
	private EssayQuestionMapper essayQuestionMapper;
	@Override
	public int countByExample(EssayQuestionExample example) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(EssayQuestionExample example) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer questionId) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.deleteByPrimaryKey(questionId);
	}

	@Override
	public int insert(EssayQuestion record) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.insert(record);
	}

	@Override
	public int insertSelective(EssayQuestion record) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.insertSelective(record);
	}

	@Override
	public List<EssayQuestion> selectByExample(EssayQuestionExample example) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.selectByExample(example);
	}

	@Override
	public EssayQuestion selectByPrimaryKey(Integer questionId) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.selectByPrimaryKey(questionId);
	}

	@Override
	public int updateByExampleSelective(EssayQuestion record, EssayQuestionExample example) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(EssayQuestion record, EssayQuestionExample example) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(EssayQuestion record) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(EssayQuestion record) {
		// TODO Auto-generated method stub
		return essayQuestionMapper.updateByPrimaryKey(record);
	}

}
