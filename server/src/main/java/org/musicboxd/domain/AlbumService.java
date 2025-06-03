package org.musicboxd.domain;

import org.musicboxd.data.AlbumRepository;
import org.musicboxd.models.Album;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class AlbumService {

    private final AlbumRepository repository;

    public AlbumService(AlbumRepository repository) {
        this.repository = repository;
    }

    public List<Album> findAll() {
        return repository.findAll();
    }

    public Album findById(int albumId, int currentUserId) {
        return repository.findById(albumId, currentUserId);
    }

    public Result<Album> add(Album album) {
        Result<Album> result = validate(album);

        if (result.getType() != ResultType.SUCCESS) {
            return result;
        }

        Album added = repository.add(album);
        result.setPayload(added);
        return result;
    }

    public boolean deleteById(int albumId) {
        return repository.deleteById(albumId);
    }

    private Result<Album> validate(Album album) {
        Result<Album> result = new Result<>();

        if (album == null) {
            result.addMessage("Album cannot be null.", ResultType.INVALID);
            return result;
        }

        if (album.getArtist() == null || album.getArtist().isBlank()) {
            result.addMessage("Artist is required.", ResultType.INVALID);
        }

        if (album.getTitle() == null || album.getTitle().isBlank()) {
            result.addMessage("Title is required.", ResultType.INVALID);
        }

        if (album.getFirstReleaseDate() == null) {
            result.addMessage("Release date is required.", ResultType.INVALID);
        } else if (album.getFirstReleaseDate().after(new Date())) {
            result.addMessage("Release date cannot be in the future.", ResultType.INVALID);
        }

        return result;
    }
}
