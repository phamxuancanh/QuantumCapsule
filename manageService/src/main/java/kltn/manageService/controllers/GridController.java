package kltn.manageService.controllers;

import org.springframework.web.bind.annotation.RestController;

import kltn.manageService.models.Grid;
import kltn.manageService.models.DTO.Response;
import kltn.manageService.services.GridService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/grids")
public class GridController {
    @Autowired
    private GridService gridService;
    // create
    @PostMapping("/create")
    public Response create(@RequestBody Grid entity) {
        return gridService.create(entity);
    }
    // update
    @PutMapping("/update")
    public Response update(@RequestBody Grid entity) {
        return gridService.update(entity);
    }
    // delete
    @DeleteMapping("delete")
    public Response delete(@RequestParam String tableName, @RequestParam String columnName) {
        return gridService.delete(tableName, columnName);
    }
    // // filterByTable
    @GetMapping("/filterByTableName")
    public Response filterByTableName(@RequestParam(name = "tableName") String table) {
        return gridService.filterByTableName(table);
    }
    @GetMapping("/findAll")
    public Response findAll() {
        return gridService.findAll();
    }
    
}
