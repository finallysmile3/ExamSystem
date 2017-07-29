package com.internet.cms.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.internet.cms.model.Room;
import com.internet.cms.model.RoomExample;
import com.internet.cms.page.Pager;
import com.internet.cms.page.SystemContext;
import com.internet.cms.service.RoomService;
import com.internet.cms.util.AjaxMsg;
import com.internet.cms.util.ConstantEnum.MsgType;
import com.internet.cms.util.FrontHelper;
import com.internet.cms.util.JsonUtilTool;
import com.internet.cms.util.Kit;
import com.internet.cms.util.ParameterConstants;

@Controller
@RequestMapping("roomController")
public class RoomController extends BaseController{
	
	private Room roomStatic = new Room();
	private RoomExample roomExample = new RoomExample();
	private AjaxMsg ajaxMsg = AjaxMsg.newInstance();
	@Autowired
	private RoomService roomService;
	
	@RequestMapping(value="all" , method = RequestMethod.GET)
	public String getAll(Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		roomStatic = null;
		roomExample.clear();
		roomExample.setPageSize(SystemContext.getPageSize());
		roomExample.setPageNumber(SystemContext.getPageOffset());
		int count = roomService.countByExample(roomExample);
		List<Room> listUser = roomService.selectByExample(roomExample);
		Pager<Room> roomList = new Pager<Room>(count,listUser);
		model.addAttribute("roomList", roomList);
		return "room/list";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.GET)
	public String addOrUpdateUser(@PathVariable int id,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		Room room;
		if(id > 0){
			room = roomService.selectByPrimaryKey(id);
		}else{
			room = new Room();
		}
		model.addAttribute("room", room);
		return "room/add";
	}
	
	@RequestMapping(value = "addOrUpdate/{id}",method = RequestMethod.POST)
	public String addOrUpdateUserPost(@PathVariable("id") int id,Model model,@Valid Room room,BindingResult br){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		if(br.hasErrors()){
			return "user/add";
		}
		if(id > 0){
			room.setRoomId(id);
			roomService.updateByPrimaryKey(room);
		}else{
			roomService.insert(room);
		}
		return "redirect://roomController/all.do";
	}
	
	@RequestMapping(value = "delete/{id}" , method = RequestMethod.GET)
	public @ResponseBody Object deleteUser(@PathVariable int id){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		ajaxMsg.clear();
		Room room;
		if(id > 0){
			room = roomService.selectByPrimaryKey(id);
			if(room.getRoomState() == 1){
				roomService.deleteByPrimaryKey(id);
				ajaxMsg.addHeader(MsgType.SUCCESS, "删除成功");
			}else{
				room = new Room();
				room.setRoomId(id);
				room.setRoomState(1);
				roomService.updateByPrimaryKeySelective(room);
				ajaxMsg.addHeader(MsgType.WARN, "已经将教室状态设为不可用，再次删除将彻底删除！");
			}
		} else {
			ajaxMsg.addHeader(MsgType.ERROR, "该教室信息有误,不能删除");
		}
		return ajaxMsg;
	}
	
	@RequestMapping(value = "search" , method = RequestMethod.GET)
	public String selectUser(HttpServletRequest request,Model model){
		if (getJspToSession(this.request.getSession()) != OK) {
			return REDIRECT_URL;
		}// Session超时判断
		try {
			Map<String, Object> params = FrontHelper.transfParams(request);
			roomExample.clear();
			if (params.get(ParameterConstants.DATA) != null) {
				String data = params.get(ParameterConstants.DATA).toString();
				Room roomRequest = (Room) JsonUtilTool.json2Object(data, Room.class);
				//String setting = Kit.ISOToUTF8(roomRequest.getName());
				roomStatic = roomRequest;
				if (roomRequest != null) {
					String roomName = Kit.ISOToUTF8(roomRequest.getRoomName());
					roomExample.clear();
					roomExample.setPageNumber(ParameterConstants.ZERO);
					roomExample.setPageSize(ParameterConstants.PageSizeConstantMax);
					RoomExample.Criteria criteria = roomExample.createCriteria();
					if (roomName != null && roomName.length() > 0) {
						criteria.andRoomNameLike("%" + roomName + "%");
					}
					if (roomRequest.getRoomState() != null) {
						criteria.andRoomStateEqualTo(roomRequest.getRoomState());
					}
				}
			}
			if (roomStatic != null) {
				String roomName = Kit.ISOToUTF8(roomStatic.getRoomName());
				RoomExample.Criteria criteria = roomExample.createCriteria();
				if (roomName != null && roomName.length() > 0) {
					criteria.andRoomNameLike("%" + roomName + "%");
				}
				if (roomStatic.getRoomState() != null) {
					criteria.andRoomStateEqualTo(roomStatic.getRoomState());
				}
				model.addAttribute("roomName", roomName);
				model.addAttribute("roomState", roomStatic.getRoomState());
			}
			roomExample.setPageNumber(SystemContext.getPageOffset());
			roomExample.setPageSize(SystemContext.getPageSize());
			int count = roomService.countByExample(roomExample);
			List<Room> listUser = roomService.selectByExample(roomExample);
			Pager<Room> roomList = new Pager<Room>(count,listUser);
			roomExample.clear();
			model.addAttribute("roomList", roomList);
			return "room/list";
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			FrontHelper.isAbbr = true;
		}
		return "room/list";
	}
}
