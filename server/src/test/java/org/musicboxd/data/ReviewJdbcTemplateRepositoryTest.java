package org.musicboxd.data;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.musicboxd.models.Album;
import org.musicboxd.models.Review;
import org.musicboxd.models.User;
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

    Review id 1 will not be changed at all. album id = 1, user id = 1.
    Review id 2 will be updated. album id = 3, user id = 7.
    Review id 3 will have its likes/dislikes changed. initially liked by user ids 1, 3.
    Review id 5 will be deleted. album id = 9, user id = 10.

    User id 1 has 1 review.
    User id 2 has 2 reviews.

    User id 4 will create a review.

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

    @Test
    public void shouldFindNullForNonexistentId() {
        Review review = repository.findById(99999, 0);

        assertNull(review);
    }

    /* FindByUserId */

    @Test
    public void shouldFindByUserId() {
        List<Review> reviews = repository.findByUserId(2, 0);

        assertNotNull(reviews);
        assertEquals(2, reviews.size());

        assertTrue(reviews.stream().anyMatch(r -> r.getReviewId() == 3));
        assertTrue(reviews.stream().anyMatch(r -> r.getReviewId() == 4));
    }

    @Test
    public void shouldFindEmptyListForUserWithNoReviews() {
        List<Review> reviews = repository.findByUserId(5, 0);

        assertNotNull(reviews);
        assertEquals(0, reviews.size());
    }

    @Test
    public void shouldFindNullForNonexistentUser() {
        List<Review> reviews = repository.findByUserId(99999, 0);

        assertNull(reviews);
    }

    /* Add */

    @Test
    public void shouldAdd() {
        Review review = new Review();
        review.setUserId(4);
        review.setAlbumId(1);
        review.setContent("New Review");
        review.setStars(3);

        Review actual = repository.add(review);

        assertNotNull(actual);
        assertEquals(6, actual.getReviewId());
        assertEquals(1, actual.getAlbumId());
        assertEquals("New Review", actual.getContent());
        assertEquals(3, actual.getStars());
    }

    /* Update */

    @Test
    public void shouldUpdate() {
        Review review = new Review();
        review.setReviewId(2);
        review.setStars(3);
        review.setContent("Updated");

        assertTrue(repository.update(review));

        Review updated = repository.findById(2, 0);

        assertEquals("Updated", updated.getContent());
        assertEquals(3, updated.getStars());
    }

    @Test
    public void shouldNotUpdateNonexistent() {
        Review review = new Review();
        review.setReviewId(99999);
        review.setStars(3);
        review.setContent("Updated");

        assertFalse(repository.update(review));
    }

    /* DeleteById */

    @Test
    public void shouldDeleteById() {
        assertTrue(repository.deleteById(5));

        Review nonexistent = repository.findById(5, 0);

        assertNull(nonexistent);
    }

    @Test
    public void shouldNotDeleteNonexistent() {
        assertFalse(repository.deleteById(99999));
    }

    /* UpdateLike */

    @Test
    public void shouldUpdateLikeByAddingLike() {
        assertTrue(repository.updateLike(2, 2));

        Review review = repository.findById(2, 2);

        assertNotNull(review);
        assertTrue(review.isLikedByCurrentUser());
    }

    @Test
    public void shouldUpdateByRemovingLike() {
        assertFalse(repository.updateLike(2, 3));

        Review review = repository.findById(2, 3);

        assertNotNull(review);
        assertFalse(review.isLikedByCurrentUser());
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
