package org.musicboxd.data.mappers;

import org.musicboxd.models.Album;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class AlbumMapper implements RowMapper<Album> {

    @Override
    public Album mapRow(ResultSet resultSet, int i) throws SQLException {

        Album album = new Album();
        album.setAlbumId(resultSet.getInt("album_id"));
        album.setArtist(resultSet.getString("artist"));
        album.setId(resultSet.getString("id"));
        album.setFirstReleaseDate(resultSet.getDate("first_released_date"));
        album.setTitle(resultSet.getString("title"));
        album.setArtUrl(resultSet.getString("art_url"));
        album.setReviews(null);
        return album;
    }
}
