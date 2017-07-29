package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.ChoiceErrorMapper;
import com.internet.cms.model.ChoiceError;
import com.internet.cms.model.ChoiceErrorExample;
import com.internet.cms.service.ChoiceErrorService;
@Service("choiceErrorService")
public class ChoiceErrorServiceImpl implements ChoiceErrorService {
	@Autowired
	private ChoiceErrorMapper choiceErrorMapper;
	@Override
	public int countByExample(ChoiceErrorExample example) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(ChoiceErrorExample example) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer questionId) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.deleteByPrimaryKey(questionId);
	}

	@Override
	public int insert(ChoiceError record) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.insert(record);
	}

	@Override
	public int insertSelective(ChoiceError record) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.insertSelective(record);
	}

	@Override
	public List<ChoiceError> selectByExample(ChoiceErrorExample example) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.selectByExample(example);
	}

	@Override
	public ChoiceError selectByPrimaryKey(Integer questionId) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.selectByPrimaryKey(questionId);
	}

	@Override
	public int updateByExampleSelective(ChoiceError record, ChoiceErrorExample example) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(ChoiceError record, ChoiceErrorExample example) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(ChoiceError record) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(ChoiceError record) {
		// TODO Auto-generated method stub
		return choiceErrorMapper.updateByPrimaryKey(record);
	}

}
