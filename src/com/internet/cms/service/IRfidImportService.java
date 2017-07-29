package com.internet.cms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.internet.cms.model.ChoiceQuestion;

public interface IRfidImportService {
	public class importExcelException extends Exception
	{
		/**
		 * 
		 */
		private static final long serialVersionUID = 11L;
		public List<String> errorlist=new ArrayList<String>();

		public List<String> getErrorlist() {
			return errorlist;
		}
        public importExcelException(List<String> errorlist)
        {
        	this.errorlist=errorlist;
        }
		public void setErrorlist(List<String> errorlist) {
			this.errorlist = errorlist;
		}
	}
	public  Map<String, ChoiceQuestion> readExcelFile(String fileName) throws Exception;
}
