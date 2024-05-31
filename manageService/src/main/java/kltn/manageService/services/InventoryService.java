package kltn.manageService.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.exceptions.ItemNotFoundException;
import kltn.manageService.models.Inventory;
import kltn.manageService.models.Response;
import kltn.manageService.repositories.InventoryRepository;
import kltn.manageService.utils.PropertyUtils;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;
    
    public Response findAll() {
        try {
            return Response.success(ResponseMessage.SUCCESS.getMessage(), inventoryRepository.findAll());
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response findById(String id) {
        try {
            Inventory data = inventoryRepository.findById(id).orElse(null);
            return Response.success(ResponseMessage.SUCCESS.getMessage(), data);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response create(Inventory entity) {
        try {
            Inventory data = inventoryRepository.save(entity);
            return Response.success(ResponseMessage.CREATE_SUCCESS.getMessage(), data);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response update(Inventory entity) {
        try {
            Inventory data = inventoryRepository.findById(entity.getId()).orElseThrow(ItemNotFoundException::new);
            PropertyUtils.copyNonNullProperties(entity::getName, data::setName);
            PropertyUtils.copyNonNullProperties(entity::getCategory, data::setCategory);
            PropertyUtils.copyNonNullProperties(entity::getPrice, data::setPrice);
            PropertyUtils.copyNonNullProperties(entity::getQuantity, data::setQuantity);
            
            return Response.success(ResponseMessage.UPDATE_SUCCESS.getMessage(), inventoryRepository.save(data));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response delete(String id) {
        try {
            Inventory data = inventoryRepository.findById(id).orElseThrow(ItemNotFoundException::new);
            inventoryRepository.delete(data);
            return Response.success(ResponseMessage.DELETE_SUCCESS.getMessage(), null);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
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
