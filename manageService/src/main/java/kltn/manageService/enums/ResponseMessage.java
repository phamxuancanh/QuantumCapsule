package kltn.manageService.enums;

public enum ResponseMessage {
    CREATE_SUCCESS("Create success"),
    UPDATE_SUCCESS("Update success"),
    DELETE_SUCCESS("Delete success"),
    ITEM_NOT_FOUND("Item not found"),
    INTERNAL_SERVER_ERROR("Internal server error"),
    PAY_SUCCESS("Pay success"),
    PAY_FAILED("Pay failed"),
    CANCEL_SUCCESS("Cancel success"),
    SUCCESS("Success");

    private String message;

    ResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
