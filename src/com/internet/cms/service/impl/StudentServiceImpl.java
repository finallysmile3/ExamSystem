package com.internet.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.internet.cms.dao.StudentMapper;
import com.internet.cms.model.Student;
import com.internet.cms.model.StudentExample;
import com.internet.cms.service.StudentService;

@Service("studentService")
public class StudentServiceImpl implements StudentService {

	@Autowired
	private StudentMapper studentMapper;
	@Override
	public int countByExample(StudentExample example) {
		// TODO Auto-generated method stub
		return studentMapper.countByExample(example);
	}

	@Override
	public int deleteByExample(StudentExample example) {
		// TODO Auto-generated method stub
		return studentMapper.deleteByExample(example);
	}

	@Override
	public int deleteByPrimaryKey(Integer studentId) {
		// TODO Auto-generated method stub
		return studentMapper.deleteByPrimaryKey(studentId);
	}

	@Override
	public int insert(Student record) {
		// TODO Auto-generated method stub
		return studentMapper.insert(record);
	}

	@Override
	public int insertSelective(Student record) {
		// TODO Auto-generated method stub
		return studentMapper.insertSelective(record);
	}

	@Override
	public List<Student> selectByExample(StudentExample example) {
		// TODO Auto-generated method stub
		return studentMapper.selectByExample(example);
	}

	@Override
	public Student selectByPrimaryKey(Integer studentId) {
		// TODO Auto-generated method stub
		return studentMapper.selectByPrimaryKey(studentId);
	}

	@Override
	public int updateByExampleSelective(Student record, StudentExample example) {
		// TODO Auto-generated method stub
		return studentMapper.updateByExampleSelective(record, example);
	}

	@Override
	public int updateByExample(Student record, StudentExample example) {
		// TODO Auto-generated method stub
		return studentMapper.updateByExample(record, example);
	}

	@Override
	public int updateByPrimaryKeySelective(Student record) {
		// TODO Auto-generated method stub
		return studentMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Student record) {
		// TODO Auto-generated method stub
		return studentMapper.updateByPrimaryKey(record);
	}

}
