/**
 * 
 */
package com.sprinapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.model.StudentVO;

/**
 * @author vvukoti
 *
 */
@Controller
public class HomeController {
	@RequestMapping(value="/home.htm",method=RequestMethod.GET)
	public String homepage() {
		return "index";
	}
	
}
