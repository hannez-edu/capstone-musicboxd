package org.musicboxd.domain;

import org.musicboxd.data.AlbumRepository;
import org.musicboxd.models.Album;
import org.springframework.stereotype.Service;

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
}
