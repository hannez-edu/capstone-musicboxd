package org.musicboxd.data.mappers;

import org.musicboxd.models.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserMapper implements RowMapper<User> {
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setUserId(rs.getInt("user_id"));
        user.setUserName(rs.getString("user_name"));
        user.setPassword(rs.getString("password_hash"));
        user.setEmail(rs.getString("email"));
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        return user;
    }
}
