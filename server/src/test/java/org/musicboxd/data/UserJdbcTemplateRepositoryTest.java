package org.musicboxd.data;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.musicboxd.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserJdbcTemplateRepositoryTest {
    @Autowired
    UserJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    private User testUser;

    @BeforeEach
    void setup() {
        knownGoodState.set();

        testUser = new User();
        testUser.setUserName("t3st1ng");
        testUser.setEmail("test@test.xyz");
        testUser.setFirstName("Test");
        testUser.setLastName("Testing");
        testUser.setPassword("$2a$04$tbG2yzNQQKuCJUXFL7KI9.ew5CYuynkMg05YlVb3eoVVq4BLQir1i");
    }

    @Test
    void shouldFindAll() {
        List<User> users = repository.findAll();
        assertNotNull(users);
        assertEquals(10, users.size());
    }

    @Test
    void shouldFindById() {
        // Check that we also have this user's role & follower/followed lists.
        int id = 1;
        String name = "khatrey0";
        User user = repository.findById(id);
        assertEquals(name, user.getUserName()); // Ensure we get the correct user

        // Ensure our Join operations populate the user's fields correctly
        assertFalse(user.getRoles().isEmpty());
        assertFalse(user.getFollowers().isEmpty());
        assertFalse(user.getFollowing().isEmpty());
    }

    @Test
    void shouldNotFindByNonExistentId() {
        int id = 999;
        User user = repository.findById(id);
        assertNull(user);
    }

    @Test
    void shouldAdd() {
        User actual = repository.add(testUser);
        assertNotNull(actual);
        assertEquals(11, actual.getUserId());
    }

    @Test
    void shouldUpdate() {
        // Using a different ID from 11 so we override a user currently in the users table
        int id = 5;
        testUser.setUserId(id);
        String name = "upd4t3d_t3st1ng";
        testUser.setUserName(name);
        assertTrue(repository.update(testUser));
        assertEquals(name, repository.findById(id).getUserName());
    }

    @Test
    void shouldDelete() {
        int id = 11;
        assertTrue(repository.deleteById(id));
        assertNull(repository.findById(11));
    }

    @Test
    void shouldNotDeleteNonExistentUser() {
        int id = 999;
        assertFalse(repository.deleteById(id));
        assertEquals(10, repository.findAll().size()); // Ensure size didn't change
    }
}
