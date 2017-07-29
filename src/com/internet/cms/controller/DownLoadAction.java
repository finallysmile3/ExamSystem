package com.internet.cms.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.internet.cms.util.Kit;
@Controller
@RequestMapping("/download/")
public class DownLoadAction extends BaseController {

	/**
	 * 分数导出文件下载
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/downLoad/{id}", method = RequestMethod.GET)
	public @ResponseBody Object downLoad(@PathVariable String id)
			throws Exception {
		id=Kit.ISOToUTF8(id);
		try {
			String filePath = "/score/upload/";
			String pathTemp = id;
			String path = filePath+pathTemp;
	        BufferedInputStream bis = null;
	        BufferedOutputStream bos = null;
	        OutputStream fos = null;
	        InputStream fis = null;
	        
	        //如果是从服务器上取就用这个获得系统的绝对路径方法。  
	        String filepath = request.getSession().getServletContext().getRealPath("/" + path+".xls");
	        //String  filepath=path;
	        System.out.println("文件路径:"+filepath);
	        File uploadFile = new File(filepath);
	        fis = new FileInputStream(uploadFile);
	        bis = new BufferedInputStream(fis);
	        fos = response.getOutputStream();
	        bos = new BufferedOutputStream(fos);
	        //弹出下载对话框

	        response.setContentType("bin");
	        response.setHeader("Content-disposition",
	                           "attachment;filename=" +
	                           URLEncoder.encode(pathTemp, "utf-8")+".xls");
	        int bytesRead = 0;
	        //用输入流进行先读，然后用缓冲输入输出流去写
	        byte[] buffer = new byte[8192];
	        while ((bytesRead = bis.read(buffer, 0, 8192)) != -1) {
	            bos.write(buffer, 0, bytesRead);
	        }
	        bos.flush();
	        fis.close();
	        bis.close();
	        fos.close();
	        bos.close();
		} catch (Exception e) {
			
		}
		return null;
	}
	

	/**
	 * 传题的excel模板下载
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/downLoadm/{id}", method = RequestMethod.GET)
	public @ResponseBody Object downLoadmodel(@PathVariable String id)
			throws Exception {
		try {
			String filePath = "/resources/upload/";
			String pathTemp = id;
			String path = filePath+pathTemp;
	        BufferedInputStream bis = null;
	        BufferedOutputStream bos = null;
	        OutputStream fos = null;
	        InputStream fis = null;
	        
	        //如果是从服务器上取就用这个获得系统的绝对路径方法。  
	        String filepath = request.getSession().getServletContext().getRealPath("/" + path+".xls");
	        //String  filepath=path;
	        System.out.println("文件路径:"+filepath);
	        File uploadFile = new File(filepath);
	        fis = new FileInputStream(uploadFile);
	        bis = new BufferedInputStream(fis);
	        fos = response.getOutputStream();
	        bos = new BufferedOutputStream(fos);
	        //弹出下载对话框

	        response.setContentType("bin");
	        response.setHeader("Content-disposition",
	                           "attachment;filename=" +
	                           URLEncoder.encode(pathTemp, "utf-8")+".xls");
	        int bytesRead = 0;
	        //用输入流进行先读，然后用缓冲输入输出流去写
	        byte[] buffer = new byte[8192];
	        while ((bytesRead = bis.read(buffer, 0, 8192)) != -1) {
	            bos.write(buffer, 0, bytesRead);
	        }
	        bos.flush();
	        fis.close();
	        bis.close();
	        fos.close();
	        bos.close();
		} catch (Exception e) {
			
		}
		return null;
	}
}

