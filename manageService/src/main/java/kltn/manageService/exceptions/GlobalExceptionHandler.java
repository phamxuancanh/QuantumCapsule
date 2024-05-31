package kltn.manageService.exceptions;


import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.models.Response;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ItemNotFoundException.class)
    public Response handleItemNotFoundException(ItemNotFoundException ex) {
        Response response = Response.error(ResponseMessage.ITEM_NOT_FOUND.getMessage());
        return response;
    }

}
