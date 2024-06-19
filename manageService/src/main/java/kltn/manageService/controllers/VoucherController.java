package kltn.manageService.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.models.Voucher;
import kltn.manageService.models.DTO.Response;
import kltn.manageService.services.VoucherService;

@RestController
@RequestMapping("/vouchers")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;

    @PostMapping("/test")
    public Response getMethodName() {
        return Response.success(ResponseMessage.SUCCESS.getMessage(), "Test success");
    }
    
    @GetMapping("/findAll")
    public Response findAll() {
        return voucherService.findAll();
    }
    @GetMapping("/findById")
    public Response findById(@RequestParam(name = "id") String id) {
        return voucherService.findById(id);
    }
    @PostMapping("/create")
    public Response create(@RequestBody Voucher entity) {
        return voucherService.create(entity);
    }
    @DeleteMapping("/delete")
    public Response delete(@RequestParam(name = "id") String id) {
        return voucherService.delete(id);  
    }
    @PutMapping("/update")
    public Response update(@RequestBody Voucher entity) {
        return voucherService.update(entity); 
    }
    @PutMapping("/pay")
    public Response pay(@RequestParam(name = "id") String id) {
        return voucherService.pay(id);  
    }
    @PutMapping("/cancel")
    public Response cancel(@RequestParam(name = "id") String id) {
        return voucherService.cancel(id); 
    }
    
}
