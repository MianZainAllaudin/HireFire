package com.HireFire.HireFireBackend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

@Getter
@Configuration
public class JazzCashConfig {

    @Value("${jazzcash.merchant.id}")
    private String merchantId;

    @Value("${jazzcash.password}")
    private String password;

    @Value("${jazzcash.return.url}")
    private String returnUrl;

    @Value("${jazzcash.api.url}")
    private String apiUrl;

    @Value("${jazzcash.hash.key}")
    private String hashKey;

    @Value("${jazzcash.integritySalt}")
    private String integritySalt;

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(15000);
        factory.setReadTimeout(15000);
        return new RestTemplate(factory);
    }
}
