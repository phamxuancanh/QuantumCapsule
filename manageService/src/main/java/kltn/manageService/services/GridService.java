package kltn.manageService.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.exceptions.ItemNotFoundException;
import kltn.manageService.ids.GridId;
import kltn.manageService.models.Grid;
import kltn.manageService.models.DTO.Response;
import kltn.manageService.repositories.GridRepository;

@Service
public class GridService {
    @Autowired
    private GridRepository gridRepository;

    public Response findAll() {
        return Response.success(ResponseMessage.SUCCESS.getMessage(), gridRepository.findAll());
    }


    public Response create(Grid grid) {
        try {
            Grid data = gridRepository.save(grid);
            return Response.success(ResponseMessage.CREATE_SUCCESS.getMessage(), data);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    public Response update(Grid grid) {
        try {
            GridId id = new GridId(grid.getTableName(), grid.getColumnName());
            if (!gridRepository.existsById(id)) {
                throw new ItemNotFoundException();
            }
            return Response.success(ResponseMessage.UPDATE_SUCCESS.getMessage(), gridRepository.save(grid));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    public Response delete(String tableName, String columnName) {
        try {
            GridId id = new GridId(tableName, columnName);
            if (!gridRepository.existsById(id)) {
                throw new ItemNotFoundException();
            }
            gridRepository.deleteById(id);
            return Response.success(ResponseMessage.DELETE_SUCCESS.getMessage(), null);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    public Response filterByTableName(String table) {
        try {
            return Response.success(ResponseMessage.SUCCESS.getMessage(), gridRepository.findByTableName(table));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
}
