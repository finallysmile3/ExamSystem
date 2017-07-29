package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.RoomMapper;
import com.internet.cms.model.Room;
import com.internet.cms.model.RoomExample;
import com.internet.cms.service.RoomService;

@Service("roomService")
public class RoomServiceImpl implements RoomService {

	@Autowired
	private RoomMapper roomMapper;
	@Override
	public int countByExample(RoomExample example) {
		// TODO Auto-generated method stub
		return roomMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(RoomExample example) {
		// TODO Auto-generated method stub
		return roomMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer roomId) {
		// TODO Auto-generated method stub
		return roomMapper.deleteByPrimaryKey(roomId);
	}

	@Override
	public int insert(Room record) {
		// TODO Auto-generated method stub
		return roomMapper.insert(record);
	}

	@Override
	public int insertSelective(Room record) {
		// TODO Auto-generated method stub
		return roomMapper.insertSelective(record);
	}

	@Override
	public List<Room> selectByExample(RoomExample example) {
		// TODO Auto-generated method stub
		return roomMapper.selectByExample(example);
	}

	@Override
	public Room selectByPrimaryKey(Integer roomId) {
		// TODO Auto-generated method stub
		return roomMapper.selectByPrimaryKey(roomId);
	}

	@Override
	public int updateByExampleSelective(Room record, RoomExample example) {
		// TODO Auto-generated method stub
		return roomMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(Room record, RoomExample example) {
		// TODO Auto-generated method stub
		return roomMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(Room record) {
		// TODO Auto-generated method stub
		return roomMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Room record) {
		// TODO Auto-generated method stub
		return roomMapper.updateByPrimaryKey(record);
	}

}
