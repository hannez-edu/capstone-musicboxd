package org.musicboxd.data;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.musicboxd.models.Album;
import org.musicboxd.models.Review;
import org.musicboxd.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.DateFormat;
import java.time.LocalDate;
import java.util.Date;
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

    Likes for review 1 should not be changed from 3.

    There may be other reviews.
     */

    /* FindAll */

    @Test
    public void shouldFindAll() {
        List<Review> all = repository.findAll();

        assertNotNull(all);
        assertTrue(all.size() >= 2);
    }

    /* FindById */

    @Test
    public void shouldFindById() {
        Review review = repository.findById(1, 0);

        assertNotNull(review);

        assertEquals(1, review.getUserId());
        assertEquals(1, review.getAlbumId());

        // Check content
        assertEquals("Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.", review.getContent());

        // Check stars
        assertEquals(4, review.getStars());
    }

    /*
    Join Tests

    FindById is used to test if the joins are working as it uses all
    the joins.
     */

    @Test
    public void shouldJoinUser() {
        Review review = repository.findById(1, 0);

        assertNotNull(review);
        assertNotNull(review.getUser());

        User user = review.getUser();

        assertEquals(1, user.getUserId());
        assertEquals("khatrey0", user.getUserName());
        assertEquals("khatrey0@webmd.com", user.getEmail());
        assertEquals("Kristine", user.getFirstName());
        assertEquals("Hatrey", user.getLastName());
    }

    @Test
    public void shouldJoinLikes() {
        Review review = repository.findById(1, 0);

        assertNotNull(review);

        assertEquals(3, review.getLikes());
    }

    @Test
    public void shouldShowIfUserLikedReview() {
        Review review = repository.findById(1, 1);

        assertNotNull(review);

        assertTrue(review.isLikedByCurrentUser());
    }

    @Test
    public void shouldShowIfUserDidNotLikeReview() {
        Review review = repository.findById(1, 4);

        assertNotNull(review);

        assertFalse(review.isLikedByCurrentUser());
    }

    @Test
    public void shouldJoinAlbum() {
        Review review = repository.findById(1, 0);

        assertNotNull(review);

        Album album = review.getAlbum();

        assertNotNull(album);
        assertEquals(1, album.getAlbumId());
        assertEquals("Ward-Hackett", album.getArtist());
        assertEquals("Heirloom, The (Zhai Ban)", album.getTitle());
        assertEquals("1969-02-15", album.getFirstReleaseDate().toString());
        assertEquals("http://dummyimage.com/100x100.png/cc0000/ffffff", album.getArtUrl());
    }
}
