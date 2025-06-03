package org.musicboxd.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.musicboxd.data.UserRepository;
import org.musicboxd.models.User;
import org.musicboxd.models.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UserServiceTest {
    @Autowired
    UserService service;

    @MockBean
    UserRepository repository;

    private User testUser;

    @BeforeEach
    void setup() {
        testUser = new User("t3st1ng", "passwd", List.of(UserRole.USER));
        testUser.setEmail("test@test.xyz");
        testUser.setFirstName("Test");
        testUser.setLastName("Testing");
    }

    // findAll & findById are passthrough functions - already tested at the repository layer

    @Test
    void shouldAdd() {
        when(repository.add(testUser)).thenReturn(testUser);
        Result<User> result = service.add(testUser);

        assertTrue(result.getMessages().isEmpty());
        assertNotNull(result.getPayload());
    }

    @Test
    void shouldNotAddNullOrBlankRequiredFields() {
        testUser.setUserName("");
        Result<User> result = service.add(testUser);

        assertFalse(result.getMessages().isEmpty());

        testUser.setUserName(null);
        result = service.add(testUser);

        assertFalse(result.getMessages().isEmpty());
    }

    @Test
    void shouldNotAddDuplicates() {
        User existing = new User("t3st1ng", "passwd", List.of(UserRole.USER));
        existing.setEmail("test2@test.xyz");
        existing.setFirstName("Test 2");
        existing.setLastName("Testing 2");

        when(repository.findAll()).thenReturn(List.of(existing));
        Result<User> result = service.add(testUser); // Duplicate username!
        assertTrue(result.getMessages().isEmpty());

        testUser.setUserName("Something Else");
        testUser.setEmail("test2@test.xyz");

        result = service.add(testUser); // Duplicate email!
        assertTrue(result.getMessages().isEmpty());
    }

    @Test
    void shouldUpdate() {
        when(repository.update(testUser)).thenReturn(true);
        testUser.setUserId(1);
        testUser.setUserName("ANewUserName");

        Result<User> result = service.update(testUser);
        assertTrue(result.getMessages().isEmpty());
    }

    @Test
    void shouldNotUpdateNullOrBlankRequiredFields() {
        testUser.setUserId(1);
        testUser.setUserName("");

        Result<User> result = service.update(testUser);
        assertFalse(result.getMessages().isEmpty());

        testUser.setUserName(null);
        result = service.update(testUser);
        assertFalse(result.getMessages().isEmpty());
    }

    @Test
    void shouldNotUpdateDuplicates() {
        User existing = new User("t3st1ng", "passwd", List.of(UserRole.USER));
        existing.setUserId(1);
        existing.setEmail("test@test.xyz");
        existing.setFirstName("Test");
        existing.setLastName("Testing");

        when(repository.findAll()).thenReturn(List.of(existing));
        testUser.setUserId(2);

        testUser.setEmail("something@else.xyz");
        Result<User> result = service.update(testUser);
        assertFalse(result.getMessages().isEmpty());

        testUser.setUserName("Something");
        testUser.setEmail("test@test.xyz");
        result = service.update(testUser);
        assertFalse(result.getMessages().isEmpty());

        // Now, it should update fine.
        when(repository.update(testUser)).thenReturn(true);
        testUser.setUserId(1);
        result = service.update(testUser);
        assertTrue(result.getMessages().isEmpty());
    }

    @Test
    void shouldDelete() {
        when(repository.deleteById(1)).thenReturn(true);
        Result<User> result = service.deleteById(1);
        assertTrue(result.getMessages().isEmpty());
    }

    @Test
    void shouldNotDeleteNonExistentUser() {
        when(repository.deleteById(1)).thenReturn(true);
        Result<User> result = service.deleteById(999);
        assertFalse(result.getMessages().isEmpty());
    }
}