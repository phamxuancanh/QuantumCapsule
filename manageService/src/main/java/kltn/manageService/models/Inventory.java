package kltn.manageService.models;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import kltn.manageService.enums.InventoryStatus;
import kltn.manageService.models.DTO.InventoryDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "inventories")
public class Inventory {
    @Id
    private String id;
    private String name;
    private Double price;
    private Integer quantity;
    @ManyToOne(fetch = FetchType.LAZY)
    private Storage storage;
    private String category;
    private String unit;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    @Enumerated(EnumType.STRING)
    private InventoryStatus status = InventoryStatus.ENABLED;

    public Inventory(InventoryDTO inventoryDTO) {
        Storage storage = new Storage();
        storage.setId(inventoryDTO.getStorageId());

        this.id = inventoryDTO.getId();
        this.name = inventoryDTO.getName();
        this.price = inventoryDTO.getPrice();
        this.quantity = inventoryDTO.getQuantity();
        this.storage = storage;
        this.category = inventoryDTO.getCategory();
        this.unit = inventoryDTO.getUnit();
        this.createdDate = inventoryDTO.getCreatedDate();
        this.updatedDate = inventoryDTO.getUpdatedDate();
        this.status = inventoryDTO.getStatus();
    }

    @PrePersist
    protected void onCreate() {
        String uuid = UUID.randomUUID().toString();
        this.id = "IN_" + uuid;
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}
