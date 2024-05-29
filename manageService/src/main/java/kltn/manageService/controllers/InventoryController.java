package kltn.manageService.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kltn.manageService.exceptions.ItemNotFoundException;
import kltn.manageService.models.Inventory;
import kltn.manageService.services.InventoryService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/inventory")
public class InventoryController{
    @Autowired
    private InventoryService inventoryService;
    @PostMapping("/test")
    public String getMethodName() {
        return "inventory";
    }
    

    @GetMapping("/findAll")
    public List<Inventory> findAll() {
        return inventoryService.findAll();
    }
    @GetMapping("/findById")
    public ResponseEntity<Inventory> findById(@RequestParam(name = "id") String id) {
        Inventory found = inventoryService.findById(id).orElseThrow(ItemNotFoundException::new);
        return ResponseEntity.ok(found);
    }
    @PostMapping("/create")
    public Inventory create(@RequestBody Inventory entity) {
        return inventoryService.create(entity);
    }
    @DeleteMapping("/delete")
    public Inventory delete(@RequestParam(name = "id") String id) {
        return inventoryService.delete(id);  
    }
    @PutMapping("/update")
    public Inventory update(@RequestBody Inventory entity) {
        return inventoryService.update(entity); 
    }
    
    @GetMapping("/filter")
    public ResponseEntity<List<Inventory>> getMethodName(
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
        return ResponseEntity.ok(list);
    }
    

}
