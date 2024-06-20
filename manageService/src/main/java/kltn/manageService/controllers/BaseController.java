package kltn.manageService.controllers;

import org.springframework.web.bind.annotation.RestController;

import kltn.manageService.models.DTO.Response;
import kltn.manageService.utils.ResponseUtils;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;



@RestController
@RequestMapping("/base")
public class BaseController {
    @GetMapping("/getBooleanDirections")
    public Response getBooleanDirections() {
        return ResponseUtils.booleanDirections();
    }
    
}
