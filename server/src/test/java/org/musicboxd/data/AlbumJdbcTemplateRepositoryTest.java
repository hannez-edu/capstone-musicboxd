package org.musicboxd.data;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.musicboxd.models.Album;
import org.musicboxd.models.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class AlbumJdbcTemplateRepositoryTest {

    @Autowired
    private AlbumJdbcTemplateRepository repository;

    @Autowired
    private KnownGoodState state;

    @BeforeEach
    public void setup() {
        state.set();
    }

    /*
    Test Plan

    Album id 1 will not be changed.
    Album id 2 will be edited.
    Album id 3 will be deleted.

    There may be more albums.
     */

    /* FindAll */

    @Test
    public void shouldFindAll() {
        List<Album> all = repository.findAll();

        assertNotNull(all);
        assertTrue(all.size() >= 2);
    }

    /* FindById */

    @Test
    public void shouldFindById() {
        Album album = repository.findById(1, 0);

        assertNotNull(album);
        assertNotNull(album.getReviews());
        assertNotNull(album.getReviews().get(0).getUser());
    }

    @Test
    public void shouldNotFindNonexistent() {
        assertNull(repository.findById(99999, 0));
    }

    @Test
    public void shouldJoinReviews() {
        Album album = repository.findById(1, 0);

        assertNotNull(album);

        List<Review> reviews = album.getReviews();

        assertNotNull(reviews);
        assertEquals(1, reviews.size());

        Review review = reviews.get(0);

        assertEquals("Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.", review.getContent());
        assertEquals(4, review.getStars());
        assertEquals(3, review.getLikes());
        assertFalse(review.isLikedByCurrentUser());
        assertNotNull(review.getUser());
    }

    @Test
    public void shouldJoinEmptyReviews() {
        Album album = repository.findById(10, 0);

        assertNotNull(album);
        assertNotNull(album.getReviews());
        assertEquals(0, album.getReviews().size());
    }

    /* Add */

    @Test
    public void shouldAdd() {
        Album expected = new Album();
        expected.setTitle("New Album");
        expected.setArtUrl("URL");
        expected.setArtist("Artist");
        expected.setFirstReleaseDate(new Date());

        Album actual = repository.add(expected);

        assertNotNull(actual);
        assertEquals(21, actual.getAlbumId());
        assertEquals(expected.getTitle(), actual.getTitle());
        assertEquals(expected.getArtUrl(), actual.getArtUrl());
        assertEquals(expected.getArtist(), actual.getArtist());
    }
}
