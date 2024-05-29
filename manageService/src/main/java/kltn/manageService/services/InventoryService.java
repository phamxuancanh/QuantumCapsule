package kltn.manageService.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kltn.manageService.enums.InventoryStatus;
import kltn.manageService.exceptions.ItemNotFoundException;
import kltn.manageService.models.Inventory;
import kltn.manageService.repositories.InventoryRepository;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;
    
    public List<Inventory> findAll() {
        return inventoryRepository.findAll();
    }
    public Optional<Inventory> findById(String id) {
        return inventoryRepository.findById(id);
    }
    public Inventory create(Inventory entity) {
        return inventoryRepository.save(entity);
    }
    public Inventory update(Inventory entity) {
        Inventory found = inventoryRepository.findById(entity.getId()).orElseThrow(ItemNotFoundException::new);
        if(entity.getName() != null) {
            found.setName(entity.getName());
        }
        if(entity.getPrice() != 0) {
            found.setPrice(entity.getPrice());
        }
        if(entity.getQuantity() != 0) {
            found.setQuantity(entity.getQuantity());
        }
        if(entity.getStorage() != null) {
            found.setStorage(entity.getStorage());
        }
        if(entity.getCategory() != null) {
            found.setCategory(entity.getCategory());
        }
        return inventoryRepository.save(found);
    }
    public Inventory delete(String id) {
        Inventory found = inventoryRepository.findById(id).orElseThrow(ItemNotFoundException::new);
        found.setStatus(InventoryStatus.DISABLED);
        inventoryRepository.save(found);
        return found;
    }
    public List<Inventory> filterByName(List<Inventory> list, String name) {
        if (list.isEmpty()) {
            return inventoryRepository.findByNameIgnoreCaseContaining(name);
        }
        return list.stream().filter(item -> item.getName().toLowerCase().contains(name.toLowerCase())).toList();
    }
    public List<Inventory> filterByCategory(List<Inventory> list, String category) {
        if (list.isEmpty()) {
            return inventoryRepository.findByCategoryIgnoreCaseContaining(category);
        }
        return list.stream().filter(item -> item.getCategory().toLowerCase().contains(category.toLowerCase())).toList();
    }
}
