package kltn.manageService.models;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import kltn.manageService.enums.GridInputType;
import kltn.manageService.enums.GridType;
import kltn.manageService.ids.GridId;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "grids")
@IdClass(GridId.class)
public class Grid {
    @Id
    private String tableName;
    @Id
    private String columnName;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private GridType columnType = GridType.STRING;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private GridInputType inputType = GridInputType.text;
    @Column(nullable = false)
    private String label;
    private Boolean editable = true;
    private String dataSource;
    private Boolean isDisplayTable = true;
    private Boolean isDisplayForm = true;
    private String regex;
    private String regexMessage;
    private Integer position;

}
