package org.musicboxd.domain;

import org.musicboxd.data.UserRepository;
import org.musicboxd.models.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository repository;
    // Authentication
    private final PasswordEncoder encoder;

    public UserService(UserRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public List<User> findAll() {
        return repository.findAll();
    }

    public User findById(int userId) {
        return repository.findById(userId);
    }

    public Result<User> add(User user) {
        Result<User> result = validate(user);

        // Validation failed!
        if (!result.getMessages().isEmpty()) {
            return result;
        }

        // Encode the user's password for storage
        user.setPassword(encoder.encode(user.getPassword()));

        User added = repository.add(user);
        if (added == null) {
            result.addMessage("Add failed!", ResultType.INVALID);
        }

        result.setPayload(user);
        return result;
    }

    public Result<User> update(User user) {
        Result<User> result = validate(user);

        // Validation failed!
        if (!result.getMessages().isEmpty()) {
            return result;
        }

        // Only fails due to this user having an invalid ID
        if (!repository.update(user)) {
            result.addMessage(String.format("User with ID %s does not exist!", user.getUserId()), ResultType.NOT_FOUND);
        }

        return result;
    }

    public Result<User> deleteById(int userId) {
        Result<User> result = new Result<>();

        if (!repository.deleteById(userId)) {
            result.addMessage(String.format("User with ID %s does not exist!", userId), ResultType.NOT_FOUND);
        }

        return result;
    }

    public Result<User> followUserById(User user, int userId) {
        Result<User> result = new Result<>();

        // User we want to follow doesn't exist!
        if (!findAll().stream().anyMatch(u -> u.getUserId() == userId)) {
            result.addMessage(String.format("User with ID %s does not exist!", user.getUserId()), ResultType.NOT_FOUND);
            return result;
        }

        if (!repository.followUserById(user, userId)) {
            result.addMessage("Could not follow requested user!", ResultType.INVALID);
        }

        return result;
    }

    // Ensure required fields aren't missing, and that values that should be unique are.
    private Result<User> validate(User user) {
        Result<User> result = new Result<>();

        if (user == null) {
            result.addMessage("A user is required.", ResultType.INVALID);
            return result;
        }

        // Check for required fields (username, email, password)
        if (isNullOrBlank(user.getUserName())) {
            result.addMessage("A username is required.", ResultType.INVALID);
        }
        if (isNullOrBlank(user.getEmail())) {
            result.addMessage("An email is required.", ResultType.INVALID);
        }
        if (isNullOrBlank(user.getPassword())) {
            result.addMessage("A password is required.", ResultType.INVALID);
        }

        // Early return to avoid duplicate checks if a field is missing.
        if (!result.getMessages().isEmpty()) {
            return result;
        }

        List<User> all = repository.findAll();

        boolean dupUsername = all.stream()
                .anyMatch(u -> u.getUserName().equals(user.getUserName()) && u.getUserId() != user.getUserId());

        if (dupUsername) {
            result.addMessage("Username cannot be duplicate.", ResultType.INVALID);
        }

        boolean dupEmail = all.stream()
                .anyMatch(u -> u.getEmail().equals(user.getEmail()) && u.getUserId() != user.getUserId());

        if (dupEmail) {
            result.addMessage("Email cannot be duplicate.", ResultType.INVALID);
        }

        return result;
    }

    private boolean isNullOrBlank(String str) {
        return str == null || str.isBlank();
    }

    // AUTHENTICATION

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findAll().stream()
                .filter(u -> u.getUserName().equals(username))
                .findFirst()
                .orElse(null);

        if (user == null) {
            throw new UsernameNotFoundException(username + "not found!");
        }

        return user;
    }
}