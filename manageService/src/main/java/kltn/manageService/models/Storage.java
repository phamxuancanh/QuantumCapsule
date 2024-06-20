package kltn.manageService.models;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "storages")
public class Storage {
    @Id
    private String id;
    private String name;
    private String address;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    // @OneToMany(mappedBy = "storage", fetch = FetchType.EAGER)
    // private List<Inventory> inventories;

    public Storage(String id){
        this.id = id;
    }
    public Storage(String id, String name){
        this.id = id;
        this.name = name;
    }
    @PrePersist
    protected void onCreate() {
        String uuid = UUID.randomUUID().toString().substring(0, 5);
        this.id = "ST_"+ uuid;
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}
