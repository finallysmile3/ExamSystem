package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.ScoreMapper;
import com.internet.cms.model.Score;
import com.internet.cms.model.ScoreExample;
import com.internet.cms.service.ScoreService;

@Service("scoreService")
public class ScoreServiceImpl implements ScoreService {

	@Autowired
	private ScoreMapper scoreMapper;
	@Override
	public int countByExample(ScoreExample example) {
		// TODO Auto-generated method stub
		return scoreMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(ScoreExample example) {
		// TODO Auto-generated method stub
		return scoreMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer scoreId) {
		// TODO Auto-generated method stub
		return scoreMapper.deleteByPrimaryKey(scoreId);
	}

	@Override
	public int insert(Score record) {
		// TODO Auto-generated method stub
		return scoreMapper.insert(record);
	}

	@Override
	public int insertSelective(Score record) {
		// TODO Auto-generated method stub
		return scoreMapper.insertSelective(record);
	}

	@Override
	public List<Score> selectByExample(ScoreExample example) {
		// TODO Auto-generated method stub
		return scoreMapper.selectByExample(example);
	}

	@Override
	public Score selectByPrimaryKey(Integer scoreId) {
		// TODO Auto-generated method stub
		return scoreMapper.selectByPrimaryKey(scoreId);
	}

	@Override
	public int updateByExampleSelective(Score record, ScoreExample example) {
		// TODO Auto-generated method stub
		return scoreMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(Score record, ScoreExample example) {
		// TODO Auto-generated method stub
		return scoreMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(Score record) {
		// TODO Auto-generated method stub
		return scoreMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Score record) {
		// TODO Auto-generated method stub
		return scoreMapper.updateByPrimaryKey(record);
	}

}
