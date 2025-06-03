package org.musicboxd.domain;

import org.junit.jupiter.api.Test;
import org.musicboxd.data.AlbumRepository;
import org.musicboxd.models.Album;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.sql.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class AlbumServiceTest {

    @Autowired
    AlbumService service;

    @MockBean
    AlbumRepository repository;

    /* FindAll */

    @Test
    public void shouldFindAll() {
        when(repository.findAll()).thenReturn(List.of(makeAlbum(), makeAlbum()));

        List<Album> all = service.findAll();

        assertNotNull(all);
        assertEquals(2, all.size());
    }

    /* FindById */

    @Test
    public void shouldFindById() {
        when(repository.findById(anyInt(), anyInt())).thenReturn(makeAlbum());

        Album album = service.findById(1, 1);

        assertNotNull(album);
    }

    @Test
    public void shouldNotFindNonexistentId() {
        when(repository.findById(anyInt(), anyInt())).thenReturn(null);

        Album album = service.findById(1, 1);

        assertNull(album);
    }

    /* Add */

    @Test
    public void shouldAdd() {
        Album expected = makeAlbum();
        expected.setAlbumId(1);

        when(repository.add(any())).thenReturn(expected);

        Result<Album> result = service.add(makeAlbum());

        assertEquals(ResultType.SUCCESS, result.getType());
        assertEquals(expected.getAlbumId(), result.getPayload().getAlbumId());
    }

    /* DeleteById */

    @Test
    public void shouldDeleteById() {
        when(repository.deleteById(anyInt())).thenReturn(true);

        assertTrue(service.deleteById(1));
    }

    @Test
    public void shouldNotDeleteNonexistentId() {
        when(repository.deleteById(anyInt())).thenReturn(false);

        assertFalse(service.deleteById(1));
    }

    /* Validation */

    @Test
    public void shouldNotAddNull() {
        Result<Album> result = service.add(null);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("null"));
    }

    @Test
    public void shouldNotAddNullArtist() {
        Album bad = makeAlbum();
        bad.setArtist(null);

        Result<Album> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    public void shouldNotAddEmptyArtist() {
        Album bad = makeAlbum();
        bad.setArtist(" ");

        Result<Album> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    public void shouldNotAddNullTitle() {
        Album bad = makeAlbum();
        bad.setTitle(null);

        Result<Album> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    public void shouldNotAddEmptyTitle() {
        Album bad = makeAlbum();
        bad.setTitle(" ");

        Result<Album> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    public void shouldNotAddNullReleaseDate() {
        Album bad = makeAlbum();
        bad.setFirstReleaseDate(null);

        Result<Album> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("required"));
    }

    @Test
    public void shouldNotAddFutureReleaseDate() {
        Album bad = makeAlbum();
        bad.setFirstReleaseDate(Date.valueOf("9999-01-01"));

        Result<Album> result = service.add(bad);

        assertEquals(ResultType.INVALID, result.getType());
        assertTrue(result.getMessages().get(0).contains("future"));
    }

    private Album makeAlbum() {
        Album album = new Album();
        album.setFirstReleaseDate(Date.valueOf("2020-01-01"));
        album.setTitle("Title");
        album.setArtist("Artist");
        album.setArtUrl("URL");
        return album;
    }
}
