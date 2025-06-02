package org.musicboxd.domain;

import org.musicboxd.data.ReviewRepository;
import org.musicboxd.models.Review;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository repository;

    public ReviewService(ReviewRepository repository) {
        this.repository = repository;
    }

    public List<Review> findAll() {
        return repository.findAll();
    }

    public Review findById(int reviewId, int currentUserId) {
        return repository.findById(reviewId, currentUserId);
    }
}
