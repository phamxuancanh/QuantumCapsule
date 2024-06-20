package kltn.manageService.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import kltn.manageService.models.Inventory;
import java.util.List;



public interface InventoryRepository extends JpaRepository<Inventory, String>{
    List<Inventory> findByNameIgnoreCaseContaining(String name);
    List<Inventory> findByCategoryIgnoreCaseContaining(String category);
    @Query("SELECT i FROM Inventory i ORDER BY i.createdDate DESC limit 50")
    List<Inventory> findLatest();
}
