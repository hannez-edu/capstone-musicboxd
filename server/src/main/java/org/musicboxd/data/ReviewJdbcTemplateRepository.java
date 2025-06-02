package org.musicboxd.data;

import org.musicboxd.data.mappers.AlbumMapper;
import org.musicboxd.data.mappers.ReviewMapper;
import org.musicboxd.data.mappers.UserMapper;
import org.musicboxd.models.Album;
import org.musicboxd.models.Review;
import org.musicboxd.models.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
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
    @Transactional
    public Review findById(int reviewId, int currentUserId) {
        final String sql = "select review_id, album_id, user_id, `content`, stars " +
                "from reviews " +
                "where review_id = ?;";

        Review review = jdbcTemplate.query(sql, new ReviewMapper(), reviewId)
                .stream().findFirst().orElse(null);

        if (review != null) {
            joinUser(review);
            joinLikes(review);
            joinLikedByCurrentUser(review, currentUserId);
            joinAlbum(review);
        }

        return review;
    }

    @Override
    @Transactional
    public List<Review> findByUserId(int reviewerId, int currentUserId) {
        final String userSql = "select user_id, password_hash, user_name, email, first_name, last_name " +
                "from users " +
                "where user_id = ?;";

        User user = jdbcTemplate.query(userSql, new UserMapper(), reviewerId)
                .stream().findFirst().orElse(null);

        if (user == null) {
            return null;
        }

        final String reviewSql = "select review_id, album_id, user_id, `content`, stars " +
                "from reviews " +
                "where user_id = ?;";

        List<Review> reviews = jdbcTemplate.query(reviewSql, new ReviewMapper(), user.getUserId());

        for (Review review : reviews) {
            review.setUser(user);
            joinLikes(review);
            joinLikedByCurrentUser(review, currentUserId);
            joinAlbum(review);
        }

        return reviews;
    }

    @Override
    public Review add(Review review) {
        final String sql = "insert into reviews (album_id, user_id, content, stars) values (?,?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, review.getAlbumId());
            ps.setInt(2, review.getUserId());
            ps.setString(3, review.getContent());
            ps.setInt(4, review.getStars());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0 || keyHolder.getKey() == null) {
            return null;
        }

        review.setReviewId(keyHolder.getKey().intValue());
        return review;
    }

    @Override
    public boolean update(Review review) {
        final String sql = "update reviews set " +
                "content = ?, " +
                "stars = ? " +
                "where review_id = ?;";

        return jdbcTemplate.update(sql, review.getContent(), review.getStars(), review.getReviewId()) > 0;
    }

    @Override
    @Transactional
    public boolean deleteById(int reviewId) {
        jdbcTemplate.update("delete from review_likes where review_id = ?;", reviewId);
        return jdbcTemplate.update("delete from reviews where review_id = ?;", reviewId) > 0;
    }

    @Override
    public boolean updateLike(int reviewId, int userId) {
        return false;
    }

    private void joinUser(Review review) {
        final String sql = "select user_id, password_hash, user_name, email, first_name, last_name " +
                "from users " +
                "where user_id = ?;";

        User user = jdbcTemplate.query(sql, new UserMapper(), review.getUserId())
                .stream().findFirst().orElse(null);

        if (user != null) {
            user.setPassword(null);
        }

        review.setUser(user);
    }

    private void joinLikes(Review review) {
        final String sql = "select count(distinct user_id) as likes " +
                "from review_likes " +
                "where review_id = ? " +
                "group by review_id;";

        int likes = jdbcTemplate.query(sql, (resultSet, i) -> resultSet.getInt("likes"), review.getReviewId())
                .stream().findFirst().orElse(-1);

        review.setLikes(likes);
    }

    private void joinLikedByCurrentUser(Review review, int userId) {
        if (userId == 0) {
            // 0 will be used for when there is no user id.
            // This means we skip the check for if the review was liked by the user
            review.setLikedByCurrentUser(false);
            return;
        }

        final String sql = "select review_id " +
                "from review_likes " +
                "where review_id = ? and user_id = ?;";

        int reviewId = jdbcTemplate.query(sql, (resultSet, i) -> resultSet.getInt("review_id"), review.getReviewId(), userId)
                .stream().findFirst().orElse(0);

        review.setLikedByCurrentUser(reviewId != 0);
    }

    private void joinAlbum(Review review) {
        final String sql = "select album_id, artist, title, release_date, art_url " +
                "from albums " +
                "where album_id = ?;";

        Album album = jdbcTemplate.query(sql, new AlbumMapper(), review.getAlbumId())
                .stream().findFirst().orElse(null);

        review.setAlbum(album);
    }
}
