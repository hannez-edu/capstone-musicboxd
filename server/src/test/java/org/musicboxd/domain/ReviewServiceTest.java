package org.musicboxd.domain;

import org.junit.jupiter.api.Test;
import org.musicboxd.data.ReviewRepository;
import org.musicboxd.models.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
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