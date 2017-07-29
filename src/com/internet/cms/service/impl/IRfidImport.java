package com.internet.cms.service.impl;

import java.io.FileInputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.internet.cms.model.ChoiceQuestion;
import com.internet.cms.service.IRfidImportService;
@Service("rfidImportService")
public class IRfidImport implements IRfidImportService {

	public static String readValue(Cell cell) {
		String value = "";
		if (cell == null) {
			return "NULL";
		}

		int rowType = cell.getCellType();
		if (rowType == Cell.CELL_TYPE_STRING) {
			value = cell.getStringCellValue();
		} else if (rowType == Cell.CELL_TYPE_NUMERIC) {
			if (HSSFDateUtil.isCellDateFormatted(cell)) {
				SimpleDateFormat sdf = new SimpleDateFormat(
						"yyyy-MM-dd HH:mm:ss");
				String date = sdf.format(
						HSSFDateUtil.getJavaDate(cell.getNumericCellValue()))
						.toString();
				value = date.toString();
			} else {
				Number v = cell.getNumericCellValue();
				// 如果是身份证(第三列)（因为身份证全是数字）则把小数部分去掉
				if (cell.getColumnIndex() == 0) {
					double va = Double.valueOf(v.toString());
					int val = (int) va;
					value = String.valueOf(val);

				} else if (cell.getColumnIndex() == 5) {
					value = v.toString();
					BigDecimal bd = new BigDecimal(value);
					value = bd.toPlainString();
				} else {
					value = v.toString();
				}
			}
		}
		return value;
	}
	
	
	
	@Override
	public Map<String, ChoiceQuestion> readExcelFile(String fileName) throws Exception {
		//存放选择题对象
		HashMap<String, ChoiceQuestion> map = new HashMap<String, ChoiceQuestion>();
		try {
			FileInputStream in = new FileInputStream(fileName);
			// 创建对Excel工作薄文件的引用
			Workbook wb;
			if (fileName.endsWith(".xls")) {
				// Excel2003
				wb = new HSSFWorkbook(in);
			} else {
				// Excel 2007
				wb = new XSSFWorkbook(in);
			}
			// 创建对工作表的引用
			Sheet sheet = wb.getSheetAt(0);
			// 遍历所有单元格，读取单元格
			int row_num = sheet.getLastRowNum();

			if (sheet.getLastRowNum() != 0) {
				for (int i = 1; i <= row_num; i++) {
					Row row = sheet.getRow(i);
					// String carLogoName=null;
					// CarType carType = new CarType();
					ChoiceQuestion pro = new ChoiceQuestion();
					
					String questionname = readValue(row.getCell(0)).trim();
					pro.setQuestionName(questionname.trim());
					
					String type = readValue(row.getCell(1)).trim();
					double typeint= Double.valueOf(type);
					pro.setQuestionType((int)typeint);
					
					String optiona = readValue(row.getCell(2)).trim();
					pro.setQuestionOptionA(optiona.trim());
					
					String optionb = readValue(row.getCell(3)).trim();
					pro.setQuestionOptionB(optionb.trim());
					
					String optionc = readValue(row.getCell(4)).trim();
					pro.setQuestionOptionC(optionc.trim());
					
					String optiond = readValue(row.getCell(5)).trim();
					pro.setQuestionOptionD(optiond.trim());
					
					String correct = readValue(row.getCell(6)).trim();
					pro.setCorrectOption(correct.trim());
					
					String subjectname = readValue(row.getCell(7)).trim();
					pro.setSubjectName(subjectname.trim());
					
					pro.setQuestionState(0);
					map.put(String.valueOf(i), pro);
				}
			}

		}catch (Exception e) {
			throw e;
		}
		return map;
	}
}