package org.musicboxd.data.mappers;

import org.musicboxd.models.Review;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReviewMapper implements RowMapper<Review> {

    @Override
    public Review mapRow(ResultSet resultSet, int i) throws SQLException {

        Review review = new Review();
        review.setReviewId(resultSet.getInt("review_id"));
        review.setAlbum(null);
        review.setAlbumId(resultSet.getInt("album_id"));
        review.setContent(resultSet.getString("content"));
        review.setLikes(-1);
        review.setLikedByCurrentUser(false);
        review.setStars(resultSet.getInt("stars"));
        review.setUserId(resultSet.getInt("user_id"));
        review.setUser(null);
        return review;
    }
}
