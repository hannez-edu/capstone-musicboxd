package org.musicboxd.data;

import org.musicboxd.models.Album;

import java.util.List;

public interface AlbumRepository {
    public List<Album> findAll() throws DataException;
    public Album findById(int albumId) throws DataException;

    public Album add(Album album) throws DataException;
    public boolean deleteById(int albumId) throws DataException;
}
