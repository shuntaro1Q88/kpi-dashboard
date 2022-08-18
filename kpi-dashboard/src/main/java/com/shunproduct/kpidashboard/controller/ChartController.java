package com.shunproduct.kpidashboard.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.shunproduct.kpidashboard.common.CSVFileNameConst;
import com.shunproduct.kpidashboard.service.CSVTo2DArrayService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class ChartController {
	
	private final CSVTo2DArrayService csvTo2DArray;
	
	// 受注実績
	@GetMapping("/order")
	public String order(Model model,HttpServletRequest request) {

		// 月次累積
		model.addAttribute("monthlyAccumulationOrder", csvTo2DArray.csvTo2DArray(CSVFileNameConst.MONTHLY_ACCUMULATION_ORDER));
		// 月次実績
		model.addAttribute("monthlyRecordOrder", csvTo2DArray.csvTo2DArray(CSVFileNameConst.MONTHLY_RECORD_ORDER));
		// 年次実績
		model.addAttribute("annualRecordOrder", csvTo2DArray.csvTo2DArray(CSVFileNameConst.ANNUAL_RECORD_ORDER));
		
		return "order-chart";
	}

}
