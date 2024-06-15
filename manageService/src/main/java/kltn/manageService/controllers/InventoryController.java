package kltn.manageService.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.exceptions.ItemNotFoundException;
import kltn.manageService.models.Inventory;
import kltn.manageService.models.DTO.InventoryDTO;
import kltn.manageService.models.DTO.Response;
import kltn.manageService.services.InventoryService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/inventories")
public class InventoryController{
    @Autowired
    private InventoryService inventoryService;
    @PostMapping("/test")
    public Response getMethodName() {
        return Response.success(ResponseMessage.SUCCESS.getMessage(), "Test success");
    }
    

    @GetMapping("/findAll")
    public Response findAll() {
        return inventoryService.findAll();
    }
    @GetMapping("/findById")
    public Response findById(@RequestParam(name = "id") String id) {
        return inventoryService.findById(id);
    }
    @PostMapping("/create")
    public Response create(@RequestBody InventoryDTO entity) {
        return inventoryService.create(entity);
    }
    @DeleteMapping("/delete")
    public Response delete(@RequestParam(name = "id") String id) {
        return inventoryService.delete(id);  
    }
    @PutMapping("/update")
    public Response update(@RequestBody InventoryDTO entity) {
        System.out.println(entity);
        return inventoryService.update(entity); 
    }
    
    @GetMapping("/filter")
    public Response getMethodName(
        @RequestParam(name = "name", required = false) String  name,
        @RequestParam(name = "category", required = false) String  category
    ) {
        List<Inventory> list = new ArrayList<>();
        if(name != null)
            list = inventoryService.filterByName(list, name);
        if(category != null)
            list = inventoryService.filterByCategory(list, category);
        if (list.isEmpty()) {
            throw new ItemNotFoundException();
        }
        return Response.success(ResponseMessage.SUCCESS.getMessage(), list);
    }
    @GetMapping("/getStatusDirections")
    public Response getStatusDirections() {
        return inventoryService.getStatusDirections();
    }
    

}
