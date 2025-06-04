package org.musicboxd.data;

import org.musicboxd.models.Album;

import java.util.List;

public interface AlbumRepository {
    public List<Album> findAll();

    public Album findById(int albumId, int currentUserId);

    public Album add(Album album);

    public boolean deleteById(int albumId);
}
