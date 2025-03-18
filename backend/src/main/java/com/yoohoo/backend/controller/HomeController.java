package com.yoohoo.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index"; // index.html을 렌더링
    }

    @GetMapping("/home")
    public String home() {
        return "home"; // home.html을 렌더링
    }
}