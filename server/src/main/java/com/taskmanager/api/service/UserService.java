package com.taskmanager.api.service;

import com.taskmanager.api.dto.AuthRequest;
import com.taskmanager.api.dto.AuthResponse;
import com.taskmanager.api.model.User;
import com.taskmanager.api.repository.UserRepository;
import com.taskmanager.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        // Load explicitly as UserDetails
        org.springframework.security.core.userdetails.UserDetails userDetails = 
          new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new java.util.ArrayList<>());
          
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token, user.getUsername());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        org.springframework.security.core.userdetails.UserDetails userDetails = 
          new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new java.util.ArrayList<>());
          
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token, user.getUsername());
    }
}
