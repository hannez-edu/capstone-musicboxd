package org.musicboxd.data;

import org.musicboxd.models.Review;

import java.util.List;

public interface ReviewRepository {
    public List<Review> findAll();

    public Review findById(int reviewId);

    public List<Review> findByUserId(int userId);

    public Review add(Review review);

    public boolean update(Review review);

    public boolean deleteById(int reviewId);

    public boolean updateLike(int reviewId, int userId);
}
