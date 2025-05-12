package com.HireFire.HireFireBackend;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IntroductionController
{
    @PostMapping("/introduction")
    public IntroductionResponse HelloWorldFunPost(@RequestBody IntroductionRequest body)
    {
        String intro = "Welcome, ".concat(body.name()).concat(".");
        
        //an object of IntroductionResponse
        return new IntroductionResponse(intro);
    }
}