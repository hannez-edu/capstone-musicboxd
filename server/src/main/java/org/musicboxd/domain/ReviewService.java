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

    public List<Review> findByUserId(int reviewerId, int currentUserId) {
        return repository.findByUserId(reviewerId, currentUserId);
    }

    public Result<Review> add(Review review) {
        Result<Review> result = validate(review);

        if (result.getType() != ResultType.SUCCESS) {
            return result;
        }

        Review added = repository.add(review);
        result.setPayload(added);
        return result;
    }

    private Result<Review> validate(Review review) {
        Result<Review> result = new Result<>();

        if (review == null) {
            result.addMessage("Review cannot be null.", ResultType.INVALID);
            return result;
        }

        if (review.getUserId() <= 0) {
            result.addMessage("User ID is required.", ResultType.INVALID);
        }

        if (review.getAlbumId() <= 0) {
            result.addMessage("Album ID is required.", ResultType.INVALID);
        }

        if (review.getContent() == null || review.getContent().isBlank()) {
            result.addMessage("Content in review is required.", ResultType.INVALID);
        }

        if (review.getStars() < 1 || 5 < review.getStars()) {
            result.addMessage("Stars must be between 1 and 5 inclusive.", ResultType.INVALID);
        }

        return result;
    }
}
