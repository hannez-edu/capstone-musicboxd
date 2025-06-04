package org.musicboxd.controllers;

import org.musicboxd.domain.AlbumService;
import org.musicboxd.domain.Result;
import org.musicboxd.domain.ResultType;
import org.musicboxd.models.Album;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/albums")
public class AlbumController {

    private final AlbumService service;

    public AlbumController(AlbumService service) {
        this.service = service;
    }

    @GetMapping
    public List<Album> findAll() {
        return service.findAll();
    }

    @GetMapping("/album={albumId}&user={currentUserId}")
    public ResponseEntity<Album> findById(@PathVariable int albumId, @PathVariable int currentUserId) {
        Album album = service.findById(albumId, currentUserId);

        if (album == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(album, HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Album album) {
        Result<Album> result = service.add(album);

        if (result.getType() == ResultType.SUCCESS) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        } else {
            return ErrorResponse.build(result);
        }
    }

    @DeleteMapping("/{albumId}")
    public ResponseEntity<Void> deleteById(@PathVariable int albumId) {
        boolean isSuccess = service.deleteById(albumId);

        if (isSuccess) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
