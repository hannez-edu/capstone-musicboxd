package org.musicboxd.data;

import org.musicboxd.data.mappers.ReviewMapper;
import org.musicboxd.models.Review;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReviewJdbcTemplateRepository implements ReviewRepository {

    private final JdbcTemplate jdbcTemplate;

    public ReviewJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Review> findAll() {
        final String sql = "select review_id, album_id, user_id, `content`, stars " +
                "from reviews;";

        return jdbcTemplate.query(sql, new ReviewMapper());
    }

    @Override
    public Review findById(int reviewId) {
        return null;
    }

    @Override
    public List<Review> findByUserId(int userId) {
        return List.of();
    }

    @Override
    public Review add(Review review) {
        return null;
    }

    @Override
    public boolean update(Review review) {
        return false;
    }

    @Override
    public boolean deleteById(int reviewId) {
        return false;
    }

    @Override
    public boolean updateLike(int reviewId, int userId) {
        return false;
    }

    private Review joinUser(Review review) {
        return review;
    }

    private Review joinLikes(Review review) {
        return review;
    }

    private Review joinLikedByCurrentUser(Review review, int userId) {
        return review;
    }

    private Review joinAlbum(Review review) {
        return review;
    }
}
