package org.musicboxd.domain;

import org.musicboxd.data.ReviewRepository;
import org.musicboxd.models.Review;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
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

        try {
            Review added = repository.add(review);
            result.setPayload(added);
        } catch (DuplicateKeyException ex) {
            result.addMessage("User already has a review for the album.", ResultType.INVALID);
        } catch (DataIntegrityViolationException ex) {
            result.addMessage("User ID or album ID do not exist.", ResultType.NOT_FOUND);
        }

        return result;
    }

    public Result<Review> update(Review review) {
        Result<Review> result = validate(review);

        if (result.getType() != ResultType.SUCCESS) {
            return result;
        }

        if (repository.update(review)) {
            result.setPayload(review);
        } else {
            result.addMessage("Could not find review.", ResultType.NOT_FOUND);
        }

        return result;
    }

    public boolean deleteById(int reviewId) {
        return repository.deleteById(reviewId);
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
