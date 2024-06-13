package kltn.manageService.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.models.Storage;
import kltn.manageService.models.DTO.Response;
import kltn.manageService.services.StorageService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/storages")
public class StorageController{
    @Autowired
    private StorageService storageService;
    @PostMapping("/test")
    public Response getMethodName() {
        return Response.success(ResponseMessage.SUCCESS.getMessage(), "Test success");
    }
    

    @GetMapping("/findAll")
    public Response findAll() {
        return storageService.findAll();
    }
    @GetMapping("/findById")
    public Response findById(@RequestParam(name = "id") String id) {
        return storageService.findById(id);
    }
    @PostMapping("/create")
    public Response create(@RequestBody Storage entity) {
        System.out.println(entity);
        return storageService.create(entity);
    }
    @DeleteMapping("/delete")
    public Response delete(@RequestParam(name = "id") String id) {
        return storageService.delete(id);  
    }
    @PutMapping("/update")
    public Response update(@RequestBody Storage entity) {
        return storageService.update(entity); 
    }
    
    @GetMapping("/getDirections")
    public Response getDirections() {
        return storageService.getDirections();
    }

}
