package kltn.manageService.models;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import kltn.manageService.enums.InventoryStatus;
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
    private double price;
    private int quantity;
    private String storage;
    private String category;
    private String unit;
    private LocalDate createdDate;
    private LocalDate updatedDate;
    @Enumerated(EnumType.STRING)
    private InventoryStatus status = InventoryStatus.ENABLED;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String uuid = UUID.randomUUID().toString();
            this.id = "IN_" + currentDate + "_" + uuid;
        }
        this.createdDate = LocalDate.now();
        this.updatedDate = LocalDate.now();
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDate.now();
    }
}
