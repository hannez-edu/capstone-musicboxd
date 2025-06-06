package org.musicboxd.controllers;

import org.musicboxd.domain.Result;
import org.musicboxd.domain.ResultType;
import org.musicboxd.domain.ReviewService;
import org.musicboxd.models.Review;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @GetMapping
    public List<Review> findAll() {
        return service.findAll();
    }

    @GetMapping("/latestCount={latestCount}&user={currentUserId}")
    public ResponseEntity<List<Review>> findLatest(@PathVariable int latestCount, @PathVariable int currentUserId) {
        List<Review> latest = service.findLatest(latestCount, currentUserId);

        if (latest == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(latest, HttpStatus.OK);
        }
    }

    @GetMapping("/review={reviewId}&user={currentUserId}")
    public ResponseEntity<Review> findById(@PathVariable int reviewId, @PathVariable int currentUserId) {
        Review review = service.findById(reviewId, currentUserId);

        if (review == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(review, HttpStatus.OK);
        }
    }

    @GetMapping("/reviewer={reviewerId}&user={currentUserId}")
    public ResponseEntity<List<Review>> findByUserId(@PathVariable int reviewerId, @PathVariable int currentUserId) {
        List<Review> reviews = service.findByUserId(reviewerId, currentUserId);

        if (reviews == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(reviews, HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Review review) {
        Result<Review> result = service.add(review);

        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        } else {
            return ErrorResponse.build(result);
        }
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Object> update(@PathVariable int reviewId, @RequestBody Review review) {
        if (reviewId != review.getReviewId()) {
            return new ResponseEntity<>("Review ID does not match.", HttpStatus.CONFLICT);
        }

        Result<Review> result = service.update(review);

        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return ErrorResponse.build(result);
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteById(@PathVariable int reviewId) {
        boolean isSuccess = service.deleteById(reviewId);

        if (isSuccess) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/review={reviewId}&user={currentUserId}")
    public ResponseEntity<Object> updateLike(@PathVariable int reviewId, @PathVariable int currentUserId) {
        Result<Boolean> result = service.updateLike(reviewId, currentUserId);

        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
        } else {
            return ErrorResponse.build(result);
        }
    }
}
