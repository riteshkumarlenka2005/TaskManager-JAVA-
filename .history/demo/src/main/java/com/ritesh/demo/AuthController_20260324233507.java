package com.ritesh.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
private JwtUtil jwtUtil;

    // Register
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // Login
    @PostMapping("/login")
public String login(@RequestBody User user) {
    User loggedUser = userService.login(user.getUsername(), user.getPassword());

    return jwtUtil.generateToken(loggedUser.getUsername());
}
}