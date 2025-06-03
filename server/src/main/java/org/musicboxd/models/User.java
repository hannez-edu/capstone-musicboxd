package org.musicboxd.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class User extends org.springframework.security.core.userdetails.User {
    private int userId;
    private String userName;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private List<UserRole> roles;
    private List<User> following;
    private List<User> followers;

    // Minimally required information to register a User in our authentication scheme
    public User(String userName, String password, List<UserRole> roles) {
        super(userName, password, true, true, true, true, convertRolesToAuthorities(roles));
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<UserRole> getRoles() {
        return roles;
    }

    public void setRoles(List<UserRole> roles) {
        this.roles = roles;
    }

    public List<User> getFollowing() {
        return following;
    }

    public void setFollowing(List<User> following) {
        this.following = following;
    }

    public List<User> getFollowers() {
        return followers;
    }

    public void setFollowers(List<User> followers) {
        this.followers = followers;
    }

    // Convert roles between forms we may need

    public static List<GrantedAuthority> convertRolesToAuthorities(List<UserRole> roles) {
        // Default role every user should have.
        if (roles.isEmpty()) {
            roles.add(UserRole.USER);
        }

        List<GrantedAuthority> authorities = new ArrayList<>(roles.size());

        for (UserRole role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.toString()));
        }

        return authorities;
    }

    public static List<UserRole> convertAuthoritiesToRoles(Collection<GrantedAuthority> authorities) {
        return authorities.stream()
                .map(a -> UserRole.valueOf(a.getAuthority().substring("ROLE_".length())))
                .collect(Collectors.toList());
    }
}