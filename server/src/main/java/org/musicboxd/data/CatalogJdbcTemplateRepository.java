package org.musicboxd.data;

import org.musicboxd.data.mappers.CatalogMapper;
import org.musicboxd.models.Catalog;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class CatalogJdbcTemplateRepository implements CatalogRepository {
    private final JdbcTemplate jdbcTemplate;

    public CatalogJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    @Override
    public List<Catalog> findAll() {
        final String sql = "select catalog_entry_id, user_id, album_id, status " +
                "from catalog_entry limit 1000;";
        return jdbcTemplate.query(sql, new CatalogMapper());
    }

    @Override
    public Catalog findById(int catalogId) {
        final String sql = "select catalog_entry_id, user_id, album_id, status " +
                "from catalog_entry " +
                "where catalog_entry_id = ?;";

        return jdbcTemplate.query(sql, new CatalogMapper(), catalogId)
                .stream()
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Catalog> findByUserId(int userId) {
        final String sql = "select catalog_entry_id, user_id, album_id, status " +
                "from catalog_entry " +
                "where user_id = ?;";

        return jdbcTemplate.query(sql, new CatalogMapper(), userId);
    }

    @Override
    public Catalog add(Catalog catalog) {
        final String sql = "insert into catalog_entry (user_id, album_id, status) values (?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, catalog.getUserId());
            ps.setInt(2, catalog.getAlbumId());
            ps.setString(3, catalog.getStatus().name());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        catalog.setCatalogEntryId(keyHolder.getKey().intValue());
        return catalog;
    }

    @Override
    public boolean update(Catalog catalog) {
        // Only allow status updates to avoid unique constraint issues
        final String sql = "update catalog_entry set status = ? where catalog_entry_id = ?;";

        return jdbcTemplate.update(sql,
                catalog.getStatus().name(),
                catalog.getCatalogEntryId()) > 0;
    }

    @Override
    public boolean deleteById(int catalogId) {
        return jdbcTemplate.update("delete from catalog_entry where catalog_entry_id = ?;", catalogId) > 0;
    }
}