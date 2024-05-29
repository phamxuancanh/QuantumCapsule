package kltn.manageService.exceptions;

public class ItemNotFoundException extends RuntimeException{
    public ItemNotFoundException() {
        super("Item not found");
    }
    public ItemNotFoundException(String message) {
        super(message);
    }
}
