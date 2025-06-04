package org.musicboxd.data.mappers;

import org.musicboxd.models.Catalog;
import org.musicboxd.models.CatalogStatus;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CatalogMapper implements RowMapper<Catalog> {
    @Override
    public Catalog mapRow(ResultSet rs, int rowNum) throws SQLException {
        Catalog catalog = new Catalog();
        catalog.setCatalogEntryId(rs.getInt("catalog_entry_id"));
        catalog.setUserId(rs.getInt("user_id"));
        catalog.setAlbumId(rs.getInt("album_id"));
        catalog.setStatus(CatalogStatus.valueOf(rs.getString("status")));
        return catalog;
    }
}
