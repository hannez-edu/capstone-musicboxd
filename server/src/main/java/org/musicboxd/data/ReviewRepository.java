package org.musicboxd.data;

import org.musicboxd.models.Review;

import java.util.List;

public interface ReviewRepository {
    public List<Review> findAll() throws DataException;
    public Review findById(int reviewId) throws DataException;
    public List<Review> findByUserId(int userId) throws DataException;

    public Review add(Review review) throws DataException;
    public boolean update(Review review) throws DataException;
    public boolean deleteById(int reviewId) throws DataException;
    public boolean updateLike(int reviewId, int userId) throws DataException;
}
