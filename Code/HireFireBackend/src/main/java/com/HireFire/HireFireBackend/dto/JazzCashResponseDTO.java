package com.HireFire.HireFireBackend.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JazzCashResponseDTO {

    // Getters and Setters
    private String pp_ResponseCode;
    private String pp_ResponseMessage;
    private String pp_TxnRefNo;
    private String pp_Amount;
    private String pp_TxnDateTime;
    private String pp_TxnType;
    private String pp_MerchantID;
    private String pp_SecureHash;
    private String pp_BillReference;
    private String pp_RetrievalReferenceNo;

}


