package org.musicboxd.controllers;

import org.musicboxd.domain.Result;
import org.musicboxd.domain.ResultType;
import org.musicboxd.domain.UserService;
import org.musicboxd.models.User;
import org.musicboxd.models.UserRole;
import org.musicboxd.security.JwtConverter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/user")
public class UserController {
    private final UserService service;

    // Security Components
    private final AuthenticationManager authenticationManager;
    private final JwtConverter converter;

    public UserController(UserService service, AuthenticationManager authenticationManager, JwtConverter converter) {
        this.service = service;
        this.authenticationManager = authenticationManager;
        this.converter = converter;
    }

    @GetMapping
    public List<User> findAll() {
        return service.findAll();
    }

    @GetMapping("{userId}")
    public User findById(@PathVariable int userId) {
        return service.findById(userId);
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable int userId) {
        User user = service.findById(userId);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user.getFollowing(), HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody Map<String, String> userData) {
        User user = new User(0, userData.get("userName"), userData.get("password"), userData.get("email"),
                userData.get("firstName"), userData.get("lastName"), List.of(UserRole.USER));

        Result<User> result = service.add(user);

        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }

        return ErrorResponse.build(result);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<Object> update(@PathVariable int userId, @RequestBody Map<String, String> userData) {
        User user = new User(Integer.parseInt(userData.get("userId")), userData.get("userName"), userData.get("password"), userData.get("email"),
                userData.get("firstName"), userData.get("lastName"), List.of(UserRole.USER));

        if (userId != user.getUserId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Result<User> result = service.update(user);
        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return ErrorResponse.build(result);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deleteById(@PathVariable int userId) {
        Result<User> result = service.deleteById(userId);
        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/follow/{userId}")
    public ResponseEntity<Object> followUserById(@PathVariable int userId, @RequestBody Map<String, String> toFollow) {
        int followId = Integer.parseInt(toFollow.get("userId"));

        Result<User> result = service.followUserById(findById(userId), followId);

        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/unfollow/{userId}")
    public ResponseEntity<Object> unfollowUserById(@PathVariable int userId, @RequestBody Map<String, String> toUnfollow) {
        int unfollowId = Integer.parseInt(toUnfollow.get("userId"));

        Result<User> result = service.unfollowUserById(findById(userId), unfollowId);

        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{userId}/following/{targetUserId}")
    public ResponseEntity<Map<String, Boolean>> isFollowing(@PathVariable int userId, @PathVariable int targetUserId) {
        boolean isFollowing = service.isFollowing(userId, targetUserId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFollowing", isFollowing);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // AUTHENTICATION

    // This is the "login" request - we log in to retrieve our JWT token to be used in any mappings that require authentication.
    // Here, we only want the username & password for authentication.
    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, String>> authenticate(@RequestBody Map<String, String> credentials) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(credentials.get("username"), credentials.get("password"));

        try {
            Authentication authentication = authenticationManager.authenticate(authToken);

            if (authentication.isAuthenticated()) {
                String jwtToken = converter.getTokenFromUser((org.springframework.security.core.userdetails.User) authentication.getPrincipal());

                HashMap<String, String> map = new HashMap<>();
                map.put("jwt_token", jwtToken);

                User getId = findAll().stream()
                        .filter(u -> u.getUserName().equals(credentials.get("username")))
                        .findFirst()
                        .orElse(null);

                map.put("id", Integer.toString(getId.getUserId()));

                // Return the generated JWT Token to the client for future authentication requests
                return new ResponseEntity<>(map, HttpStatus.OK);
            }
        } catch (AuthenticationException e) {
            System.out.println(e);
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}