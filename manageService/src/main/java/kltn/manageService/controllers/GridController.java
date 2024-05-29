package kltn.manageService.controllers;

import org.springframework.web.bind.annotation.RestController;

import kltn.manageService.exceptions.SuccessRespone;
import kltn.manageService.models.Grid;
import kltn.manageService.services.GridService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/grid")
public class GridController {
    @Autowired
    private GridService gridService;
    // create
    @PostMapping("/create")
    public Grid create(@RequestBody Grid entity) {
        return gridService.create(entity);
    }
    // update
    @PostMapping("/update")
    public Grid update(@RequestBody Grid entity) {
        return gridService.update(entity);
    }
    // delete
    @PostMapping("delete")
    public SuccessRespone delete(@RequestParam String tableName, @RequestParam String columnName) {
        return gridService.delete(tableName, columnName);
    }
    // // filterByTable
    @PostMapping("/filterByTableName")
    public List<Grid> filterByTableName(@RequestBody String table) {
        return gridService.filterByTableName(table);
    }
    
}
