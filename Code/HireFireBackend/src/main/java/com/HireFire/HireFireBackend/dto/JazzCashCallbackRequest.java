package com.HireFire.HireFireBackend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Setter
@Getter
public class JazzCashCallbackRequest {
    private Map<String, String> parameters;

    public JazzCashCallbackRequest() {
    }

    public JazzCashCallbackRequest(Map<String, String> parameters) {
        this.parameters = parameters;
    }

    public String getParameter(String key) {
        return parameters.get(key);
    }
}