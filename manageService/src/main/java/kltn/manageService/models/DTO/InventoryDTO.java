package kltn.manageService.models.DTO;

import java.time.LocalDateTime;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import kltn.manageService.enums.InventoryStatus;
import kltn.manageService.models.Inventory;
import kltn.manageService.models.Storage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class InventoryDTO {
    private String id;
    private String name;
    private Double price;
    private Integer quantity;
    private String storageName;
    private String storageId;
    private String category;
    private String unit;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private InventoryStatus status;

    public InventoryDTO(Inventory inventory) {
        this.id = inventory.getId();
        this.name = inventory.getName();
        this.price = inventory.getPrice();
        this.quantity = inventory.getQuantity();
        this.storageName = inventory.getStorage().getName();
        this.storageId = inventory.getStorage().getId();
        this.category = inventory.getCategory();
        this.unit = inventory.getUnit();
        this.createdDate = inventory.getCreatedDate();
        this.updatedDate = inventory.getUpdatedDate();
        this.status = inventory.getStatus();
    }
    
}
