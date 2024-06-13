package kltn.manageService.models.DTO;

import kltn.manageService.enums.StatusResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @ToString
public class Response {
    private int code;
    private String message;
    private StatusResponse status;
    private Object data;

    public static Response success(String message, Object data) {
        return new Response(200, message, StatusResponse.SUCCESS, data);
    }

    public static Response error(String message) {
        return new Response(400, message, StatusResponse.ERROR, null);
    }

    public static Response custom(int code, String message, StatusResponse status, Object data) {
        return new Response(code, message, status, data);
    }
}
