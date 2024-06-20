package kltn.manageService.utils;

import java.util.ArrayList;
import java.util.List;

import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.models.DTO.Direction;
import kltn.manageService.models.DTO.Response;

public class ResponseUtils {
    public static Response booleanDirections() {
        List<Direction<Boolean>> list = new ArrayList<>();
        list.add(new Direction<Boolean>("true", true));
        list.add(new Direction<Boolean>("false", false));

        return Response.success(ResponseMessage.SUCCESS.getMessage(), list);
    }
}
