package kltn.manageService.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kltn.manageService.enums.InventoryStatus;
import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.exceptions.ItemNotFoundException;
import kltn.manageService.models.Inventory;
import kltn.manageService.models.Storage;
import kltn.manageService.models.DTO.Direction;
import kltn.manageService.models.DTO.InventoryDTO;
import kltn.manageService.models.DTO.Response;
import kltn.manageService.repositories.InventoryRepository;
import kltn.manageService.repositories.StorageRepository;
import kltn.manageService.utils.PropertyUtils;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private StorageRepository storageRepository;
    
    public Response findAll() {
        try {
            List<Inventory> list = inventoryRepository.findLatest();
            List<InventoryDTO> data = new ArrayList<>();
            list.forEach(item -> data.add(new InventoryDTO(item)));
            return Response.success(ResponseMessage.SUCCESS.getMessage(), data);
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
    public Response create(InventoryDTO entity) {
        try {
            System.out.println(entity);
            Inventory data = new Inventory(entity);
            Storage storage = storageRepository.findById(entity.getStorageId()).orElseThrow(ItemNotFoundException::new);
            data.setStorage(storage);
            InventoryDTO dto = new InventoryDTO(inventoryRepository.save(data));
            return Response.success(ResponseMessage.CREATE_SUCCESS.getMessage(), dto);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response update(InventoryDTO entity) {
        try {
            Inventory data = inventoryRepository.findById(entity.getId()).orElseThrow(ItemNotFoundException::new);
            PropertyUtils.copyNonNullProperties(entity::getName, data::setName);
            PropertyUtils.copyNonNullProperties(entity::getCategory, data::setCategory);
            PropertyUtils.copyNonNullProperties(entity::getPrice, data::setPrice);
            PropertyUtils.copyNonNullProperties(entity::getQuantity, data::setQuantity);
            if(entity.getStorageId()!=null) data.setStorage(new Storage(entity.getStorageId()));
            Storage storage = storageRepository.findById(entity.getStorageId()).orElseThrow(ItemNotFoundException::new);
            data.setStorage(storage);
            InventoryDTO dto = new InventoryDTO(inventoryRepository.save(data));
            return Response.success(ResponseMessage.UPDATE_SUCCESS.getMessage(), dto);
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
    public Response getStatusDirections() {
        List<Direction<String>> list = new ArrayList<>();
        for (InventoryStatus status : InventoryStatus.values()) {
            list.add(new Direction<String>(status.name(), status.name()));
        }
        return Response.success(ResponseMessage.SUCCESS.getMessage(), list);
    }
}
