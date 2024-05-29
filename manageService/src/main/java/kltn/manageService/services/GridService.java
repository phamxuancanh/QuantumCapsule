package kltn.manageService.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kltn.manageService.exceptions.SuccessRespone;
import kltn.manageService.ids.GridId;
import kltn.manageService.models.Grid;
import kltn.manageService.repositories.GridRepository;

@Service
public class GridService {
    @Autowired
    private GridRepository gridRepository;

    public List<Grid> findAll() {
        return gridRepository.findAll();
    }


    public Grid create(Grid grid) {
        return gridRepository.save(grid);
    }

    public Grid update(Grid grid) {
        return gridRepository.save(grid);
    }

    public SuccessRespone delete(String tableName, String columnName) {
        gridRepository.deleteById(new GridId(tableName, columnName));
        return new SuccessRespone(200, "Delete success");
    }

    public List<Grid> filterByTableName(String table) {
        return gridRepository.findByTableName(table);
    }
}
