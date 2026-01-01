package com.matehub.xyspring.controller;

import com.matehub.xyspring.domain.user.User;
import com.matehub.xyspring.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@CrossOrigin // Allow cross-origin requests from frontend
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return loginService.login(user);
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return loginService.register(user);
    }
}
