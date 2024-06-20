package kltn.manageService.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import kltn.manageService.models.Voucher;

public interface VoucherRepository extends JpaRepository<Voucher, String>{
    
}
