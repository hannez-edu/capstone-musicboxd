package org.musicboxd.data;

import org.musicboxd.data.mappers.UserMapper;
import org.musicboxd.models.User;
import org.musicboxd.models.UserRole;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.util.List;

@Repository
public class UserJdbcTemplateRepository implements UserRepository {
    private final JdbcTemplate jdbcTemplate;

    public UserJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<User> findAll() {
        final String sql = "select user_id, user_name, email, password_hash, first_name, last_name "
                + "from users;";

        return jdbcTemplate.query(sql, new UserMapper());
    }

    @Override
    public User findById(int userId) {
        final String sql = "select user_id, user_name, email, password_hash, first_name, last_name "
                + "from users "
                + "where user_id = ?; ";

        User result = jdbcTemplate.query(sql, new UserMapper(), userId).stream().findFirst().orElse(null);

        // If we're searching for a particular user, we should get more detailed info
        if (result != null) {
            joinRole(result);
            joinFollowers(result);
            joinFollowing(result);
        }

        return result;
    }

    @Override
    public User add(User user) {
        final String sql = "insert into users (user_name, email, password_hash, first_name, last_name) "
                + "values (?,?,?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUserName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getFirstName());
            ps.setString(5, user.getLastName());
            return ps;
        }, keyHolder);

        // Add failed
        if (rowsAffected <= 0) {
            return null;
        }

        user.setUserId(keyHolder.getKey().intValue());
        return user;
    }

    @Override
    public boolean update(User user) {
        final String sql = "update users set "
                + "user_name = ?, "
                + "email = ?, "
                + "password_hash = ?, "
                + "first_name = ?, "
                + "last_name = ? "
                + "where user_id = ?;";

        return jdbcTemplate.update(sql,
                user.getUserName(),
                user.getEmail(),
                user.getPassword(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserId()) > 0;
    }

    @Override
    @Transactional
    public boolean deleteById(int userId) {
        // Review & likes
        jdbcTemplate.update("delete from review_likes where user_id = ?;", userId);
        jdbcTemplate.update("delete from reviews where user_id = ?;", userId);
        // Handle both follow directions in the following table
        jdbcTemplate.update("delete from following where followed_id = ?;", userId);
        jdbcTemplate.update("delete from following where follower_id = ?;", userId);

        jdbcTemplate.update("delete from catalog_entry where user_id = ?;", userId);
        jdbcTemplate.update("delete from user_role where user_id = ?;", userId);

        return jdbcTemplate.update("delete from users where user_id = ?;", userId) > 0;
    }

    // TODO: Might want some function to update the Roles for this user when we update/add the user *******************************************
        // Will implement this alongside the Security implementation.

    // TODO: Might also want to add a means of adding a followed user for this user. *****

    // Should set the user's role list
    private void joinRole(User user) {
        RowMapper<UserRole> rowMapper = (rs, rowNum) -> UserRole.valueOf(rs.getString("name").toUpperCase());
        final String sql = "select name from roles " +
                "inner join user_role on roles.role_id = user_role.role_id " +
                "where user_role.user_id = ?;";

        user.setRoles(jdbcTemplate.query(sql, rowMapper, user.getUserId()));
    }

    // This should join-in the users that are following the given user. (To the follower's list)
    private void joinFollowers(User user) {
        final String sql = "select user_id, user_name, email, password_hash, first_name, last_name from users " +
                "inner join `following` on `following`.followed_id = ?;";

        List<User> followers = jdbcTemplate.query(sql, new UserMapper(), user.getUserId());
        user.setFollowers(followers);
    }

    // This should join-in the users that the inputted user is following.
    private void joinFollowing(User user) {
        RowMapper<Integer> rowMapper = (rs, rowNum) -> rs.getInt("follower_id");

        final String sql = "select user_id, user_name, email, password_hash, first_name, last_name from users " +
                "inner join `following` on `following`.follower_id = ?;";

        List<User> following = jdbcTemplate.query(sql, new UserMapper(), user.getUserId());
        user.setFollowing(following);
    }
}
