package kltn.manageService.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import kltn.manageService.enums.VoucherStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "vouchers")
public class Voucher {
    @Id
    private String id;
    private String coupon;
    private Double totalAmount = 0.0;
    private Double amount = 0.0;
    private Double discount = 0.0;
    @Enumerated(EnumType.STRING)
    private VoucherStatus status = VoucherStatus.PENDING;
    private LocalDate createdDate;
    private LocalDate paymentDate;
    @PrePersist
    protected void onCreate() {
        String uuid = UUID.randomUUID().toString();
        String date = LocalDateTime.now().toString();
        this.id = "Vch_"+ date + "_" + uuid;
        this.createdDate = LocalDate.now();
    }

}
