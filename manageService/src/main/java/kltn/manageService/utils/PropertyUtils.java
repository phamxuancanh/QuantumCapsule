package kltn.manageService.utils;

import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Supplier;

public class PropertyUtils  {
    public static <T> void copyNonNullProperties(Supplier<T> getter, Consumer<T> setter) {
        Optional.ofNullable(getter.get()).ifPresent(setter);
    }
}
