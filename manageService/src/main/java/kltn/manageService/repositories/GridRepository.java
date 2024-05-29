package kltn.manageService.repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import kltn.manageService.ids.GridId;
import kltn.manageService.models.Grid;
import java.util.List;

public interface GridRepository extends JpaRepository<Grid, GridId>{
    List<Grid> findByTableName(String tableName);
}
