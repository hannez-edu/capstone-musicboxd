package org.musicboxd.domain;

import org.musicboxd.data.UserRepository;
import org.musicboxd.models.User;
import org.springframework.stereotype.Service;

import java.util.List;

// TODO: When implementing security, this should also implement UserDetailService's required methods.
@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
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
}
