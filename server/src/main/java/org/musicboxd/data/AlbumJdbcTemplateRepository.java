package org.musicboxd.data;

import org.musicboxd.data.mappers.AlbumMapper;
import org.musicboxd.models.Album;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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
    public Album findById(int albumId) {
        return null;
    }

    @Override
    public Album add(Album album) {
        return null;
    }

    @Override
    public boolean deleteById(int albumId) {
        return false;
    }
}
