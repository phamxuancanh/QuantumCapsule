package kltn.manageService.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import kltn.manageService.models.Storage;

import java.util.List;



public interface StorageRepository extends JpaRepository<Storage, String>{

    @Query("SELECT st FROM Storage st ORDER BY st.createdDate DESC limit 50")
    List<Storage> findLatest();
}
