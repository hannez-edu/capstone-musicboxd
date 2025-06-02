package org.musicboxd.domain;

import org.junit.jupiter.api.Test;
import org.musicboxd.data.ReviewRepository;
import org.musicboxd.models.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ReviewServiceTest {

    @Autowired
    ReviewService service;

    @MockBean
    ReviewRepository repository;

    /* FindAll */

    @Test
    public void shouldFindAll() {
        when(repository.findAll()).thenReturn(List.of(makeReview(), makeReview()));

        List<Review> all = service.findAll();

        assertNotNull(all);
        assertEquals(2, all.size());
    }

    /* FindById */

    @Test
    public void shouldFindById() {
        when(repository.findById(anyInt(), anyInt())).thenReturn(makeReview());

        Review review = service.findById(1, 1);

        assertNotNull(review);
    }

    /* FindByUserId */

    @Test
    public void shouldFindByUserId() {
        when(repository.findByUserId(anyInt(), anyInt())).thenReturn(List.of(makeReview(), makeReview()));

        List<Review> all = service.findByUserId(1, 1);

        assertNotNull(all);
        assertEquals(2, all.size());
    }

    /* Add */

    @Test
    public void shouldAdd() {
        Review expected = makeReview();
        expected.setReviewId(2);

        when(repository.add(any())).thenReturn(expected);

        Result<Review> result = service.add(makeReview());

        assertEquals(ResultType.SUCCESS, result.getType());
        assertEquals(2, result.getPayload().getReviewId());
    }

    @Test
    public void shouldNotAddWhenUserHasReview() {
        when(repository.add(any())).thenThrow(new DuplicateKeyException(""));

        Result<Review> result = service.add(makeReview());

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("already has a review"));
    }

    @Test
    public void shouldNotAddWhenInvalidForeignKey() {
        when(repository.add(any())).thenThrow(new DataIntegrityViolationException(""));

        Result<Review> result = service.add(makeReview());

        assertEquals(ResultType.NOT_FOUND, result.getType());
        assertTrue(result.getMessages().get(0).contains("do not exist"));
    }

    /* Update */

    @Test
    public void shouldUpdate() {
        when(repository.update(any())).thenReturn(true);

        Result<Review> result = service.update(makeReview());

        assertEquals(ResultType.SUCCESS, result.getType());
    }

    @Test
    public void shouldNotUpdateNonexistent() {
        when(repository.update(any())).thenReturn(false);

        Result<Review> result = service.update(makeReview());

        assertEquals(ResultType.NOT_FOUND, result.getType());
    }

    /* UpdateLike */

    @Test
    public void shouldUpdateLikeByAddingLike() {
        when(repository.updateLike(anyInt(), anyInt())).thenReturn(true);

        Result<Boolean> result = service.updateLike(1, 1);

        assertEquals(ResultType.SUCCESS, result.getType());
        assertTrue(result.getPayload());
    }

    @Test
    public void shouldUpdateLikeByRemovingLike() {
        when(repository.updateLike(anyInt(), anyInt())).thenReturn(false);

        Result<Boolean> result = service.updateLike(1, 1);

        assertEquals(ResultType.SUCCESS, result.getType());
        assertFalse(result.getPayload());
    }

    @Test
    public void shouldNotUpdateLikeForBadUserOrReview() {
        when(repository.updateLike(anyInt(), anyInt())).thenThrow(new DataIntegrityViolationException(""));

        Result<Boolean> result = service.updateLike(1, 1);

        assertEquals(ResultType.NOT_FOUND, result.getType());
    }

    /* DeleteById */

    @Test
    public void shouldDeleteById() {
        when(repository.deleteById(anyInt())).thenReturn(true);

        assertTrue(service.deleteById(1));
    }

    @Test
    public void shouldNotDeleteNonexistent() {
        when(repository.deleteById(anyInt())).thenReturn(false);

        assertFalse(service.deleteById(1));
    }

    /* Validation */

    @Test
    public void shouldNotAddNullReview() {
        Result<Review> result = service.add(null);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("null"));
    }

    @Test
    public void shouldNotAddBadUserId() {
        Review bad = makeReview();
        bad.setUserId(-1);

        Result<Review> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("User ID"));
    }

    @Test
    public void shouldNotAddBadAlbumId() {
        Review bad = makeReview();
        bad.setAlbumId(-1);

        Result<Review> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("Album ID"));
    }

    @Test
    public void shouldNotAddNullContent() {
        Review bad = makeReview();
        bad.setContent(null);

        Result<Review> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    public void shouldNotAddEmptyContent() {
        Review bad = makeReview();
        bad.setContent(" ");

        Result<Review> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    public void shouldNotAddLowStars() {
        Review bad = makeReview();
        bad.setStars(-1);

        Result<Review> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("between"));
    }

    @Test
    public void shouldNotAddHighStars() {
        Review bad = makeReview();
        bad.setStars(6);

        Result<Review> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("between"));
    }

    @Test
    public void shouldNotUpdateNullReview() {
        Result<Review> result = service.update(null);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("null"));
    }

    @Test
    public void shouldNotUpdateBadUserId() {
        Review bad = makeReview();
        bad.setUserId(-1);

        Result<Review> result = service.update(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("User ID"));
    }

    @Test
    public void shouldNotUpdateBadAlbumId() {
        Review bad = makeReview();
        bad.setAlbumId(-1);

        Result<Review> result = service.update(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("Album ID"));
    }

    @Test
    public void shouldNotUpdateNullContent() {
        Review bad = makeReview();
        bad.setContent(null);

        Result<Review> result = service.update(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    public void shouldNotUpdateEmptyContent() {
        Review bad = makeReview();
        bad.setContent(" ");

        Result<Review> result = service.update(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    public void shouldNotUpdateLowStars() {
        Review bad = makeReview();
        bad.setStars(-1);

        Result<Review> result = service.update(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("between"));
    }

    @Test
    public void shouldNotUpdateHighStars() {
        Review bad = makeReview();
        bad.setStars(6);

        Result<Review> result = service.update(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("between"));
    }

    private Review makeReview() {
        Review review = new Review();
        review.setReviewId(1);
        review.setAlbumId(1);
        review.setUserId(1);
        review.setContent("Valid");
        review.setStars(1);
        return review;
    }
}