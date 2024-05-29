package kltn.manageService.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import kltn.manageService.models.Inventory;
import java.util.List;


public interface InventoryRepository extends JpaRepository<Inventory, String>{
    List<Inventory> findByNameIgnoreCaseContaining(String name);
    List<Inventory> findByCategoryIgnoreCaseContaining(String category);
}
