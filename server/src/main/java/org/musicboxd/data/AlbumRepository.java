package org.musicboxd.data;

import org.musicboxd.models.Album;

import java.util.List;

public interface AlbumRepository {
    public List<Album> findAll();

    public Album findById(int albumId);

    public Album add(Album album);

    public boolean deleteById(int albumId);
}
