package kltn.manageService.services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kltn.manageService.enums.ResponseMessage;
import kltn.manageService.enums.VoucherStatus;
import kltn.manageService.exceptions.ItemNotFoundException;
import kltn.manageService.models.Voucher;
import kltn.manageService.models.DTO.Response;
import kltn.manageService.repositories.VoucherRepository;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;

    public Response findAll() {
        return Response.success(ResponseMessage.SUCCESS.getMessage(), voucherRepository.findAll());
    }

    public Response findById(String id) {
        try {
            return Response.success(ResponseMessage.SUCCESS.getMessage(), voucherRepository.findById(id));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    
    public Response create(Voucher entity) {
        try {
            Voucher data = voucherRepository.save(entity);
            return Response.success(ResponseMessage.CREATE_SUCCESS.getMessage(), data);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response delete(String id) {
        try {
            if (!voucherRepository.existsById(id)) {
                throw new ItemNotFoundException();
            }
            return Response.success(ResponseMessage.DELETE_SUCCESS.getMessage(), null);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
    public Response update(Voucher entity) {
        try {
            if (!voucherRepository.existsById(entity.getId())) {
                throw new ItemNotFoundException();
            }
            return Response.success(ResponseMessage.UPDATE_SUCCESS.getMessage(), voucherRepository.save(entity));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    public Response pay(String id) {
        try {
            Voucher voucher = voucherRepository.findById(id).orElseThrow(ItemNotFoundException::new);
            voucher.setStatus(VoucherStatus.PAID);
            voucher.setPaymentDate(LocalDate.now());
            return Response.success(ResponseMessage.PAY_SUCCESS.getMessage(), voucherRepository.save(voucher));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    public Response cancel(String id) {
        try {
            Voucher voucher = voucherRepository.findById(id).orElseThrow(ItemNotFoundException::new);
            voucher.setStatus(VoucherStatus.CANCELLED);
            return Response.success(ResponseMessage.CANCEL_SUCCESS.getMessage(), voucherRepository.save(voucher));
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    
    
}
