package org.musicboxd.data;

import org.musicboxd.data.mappers.AlbumMapper;
import org.musicboxd.data.mappers.ReviewMapper;
import org.musicboxd.models.Album;
import org.musicboxd.models.Review;
import org.musicboxd.models.User;
import org.musicboxd.models.UserRole;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class AlbumJdbcTemplateRepository implements AlbumRepository {
    private final JdbcTemplate jdbcTemplate;

    public AlbumJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Album> findAll() {
        final String sql = "select album_id, artist, title, release_date, art_url " +
                "from albums;";

        return jdbcTemplate.query(sql, new AlbumMapper());
    }

    @Override
    @Transactional
    public Album findById(int albumId, int currentUserId) {
        final String sql = "select album_id, artist, title, release_date, art_url " +
                "from albums " +
                "where album_id = ?;";

        Album album = jdbcTemplate.query(sql, new AlbumMapper(), albumId)
                .stream().findFirst().orElse(null);

        if (album != null) {
            joinReviews(album, currentUserId);
        }

        return album;
    }

    @Override
    public Album add(Album album) {
        final String sql = "insert into albums (artist, title, release_date, art_url) values (?,?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, album.getArtist());
            ps.setString(2, album.getTitle());
            ps.setDate(3, new java.sql.Date(album.getFirstReleaseDate().getTime()));
            ps.setString(4, album.getArtUrl());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0 || keyHolder.getKey() == null) {
            return null;
        }

        album.setAlbumId(keyHolder.getKey().intValue());
        return album;
    }

    @Override
    @Transactional
    public boolean deleteById(int albumId) {
        jdbcTemplate.update("delete from catalog_entry where album_id = ?;", albumId);

        List<Review> reviews = jdbcTemplate.query("select review_id, album_id, user_id, content, stars from reviews where album_id = ?;", new ReviewMapper(), albumId);

        for (Review review : reviews) {
            jdbcTemplate.update("delete from review_likes where review_id = ?;", review.getReviewId());
            jdbcTemplate.update("delete from reviews where review_id = ?;", review.getReviewId());
        }

        return jdbcTemplate.update("delete from albums where album_id = ?;", albumId) > 0;
    }

    private void joinReviews(Album album, int currentUserId) {
        final String reviewSql = "select r.user_id, r.review_id, r.stars, r.content, u.user_name " +
                "from albums as a " +
                "inner join reviews r on a.album_id = r.album_id " +
                "inner join users u on r.user_id = u.user_id " +
                "where a.album_id = ?;";

        List<Review> reviews = jdbcTemplate.query(reviewSql, (resultSet, i) -> {
            Review review = new Review();
            review.setReviewId(resultSet.getInt("review_id"));
            review.setContent(resultSet.getString("content"));
            review.setStars(resultSet.getInt("stars"));

            // Create a User object with the minimal constructor
            User user = new User(
                    resultSet.getString("user_name"),
                    "", // We don't have the password in the result set
                    List.of(UserRole.USER) // Default role
            );
            user.setUserId(resultSet.getInt("user_id"));

            review.setUser(user);
            review.setAlbum(null);
            review.setAlbumId(album.getAlbumId());
            review.setUserId(user.getUserId());

            ReviewJdbcTemplateRepository.joinLikes(review, jdbcTemplate);
            ReviewJdbcTemplateRepository.joinLikedByCurrentUser(review, currentUserId, jdbcTemplate);

            return review;
        }, album.getAlbumId());

        album.setReviews(reviews);
    }
}