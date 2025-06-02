package org.musicboxd.data;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.musicboxd.models.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ReviewJdbcTemplateRepositoryTest {

    @Autowired
    private ReviewJdbcTemplateRepository repository;

    @Autowired
    private KnownGoodState state;

    @BeforeEach
    public void setup() {
        state.set();
    }

    /*
    Test Plan

    Review with id 1 will not be changed. album id = 1, user id = 1.
    Review with id 2 will be updated. album id = 3, user id = 7.
    Review with id 3 will be deleted. album id = 5, user id = 12.

    There may be other reviews.
     */

    /* FindAll */

    @Test
    public void shouldFindAll() {
        List<Review> all = repository.findAll();

        assertNotNull(all);
        assertTrue(all.size() >= 2);
    }
}
