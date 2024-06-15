package kltn.manageService.services;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.exceptions.ItemNotFoundException;
import kltn.manageService.models.Storage;
import kltn.manageService.models.DTO.Direction;
import kltn.manageService.models.DTO.Response;
import kltn.manageService.repositories.StorageRepository;
import kltn.manageService.utils.PropertyUtils;

@Service
public class StorageService {
    @Autowired
    private StorageRepository storageRepository;
    
    public Response findAll() {
        try {
            return Response.success(ResponseMessage.SUCCESS.getMessage(), storageRepository.findAll());
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response findById(String id) {
        try {
            Storage data = storageRepository.findById(id).orElse(null);
            return Response.success(ResponseMessage.SUCCESS.getMessage(), data);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response create(Storage entity) {
        try {
            Storage data = storageRepository.save(entity);
            return Response.success(ResponseMessage.CREATE_SUCCESS.getMessage(), data);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response update(Storage entity) {
        try {
            Storage data = storageRepository.findById(entity.getId()).orElseThrow(ItemNotFoundException::new);
            PropertyUtils.copyNonNullProperties(entity::getName, data::setName);
            PropertyUtils.copyNonNullProperties(entity::getAddress, data::setAddress);
            
            return Response.success(ResponseMessage.UPDATE_SUCCESS.getMessage(), storageRepository.save(data));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response delete(String id) {
        try {
            Storage data = storageRepository.findById(id).orElseThrow(ItemNotFoundException::new);
            storageRepository.delete(data);
            return Response.success(ResponseMessage.DELETE_SUCCESS.getMessage(), null);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response getDirections() {
        try {
            List<Direction<String>> directions = new ArrayList<>();
            List<Storage> list = storageRepository.findAll();
            for (Storage item : list) {
                directions.add(new Direction<String>(item.getName(), item.getId()));
            }
            return Response.success(ResponseMessage.SUCCESS.getMessage(), directions);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
}
