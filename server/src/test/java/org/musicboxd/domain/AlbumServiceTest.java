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

    private Album makeAlbum() {
        Album album = new Album();
        album.setFirstReleaseDate(Date.valueOf("2020-01-01"));
        album.setTitle("Title");
        album.setArtist("Artist");
        album.setArtUrl("URL");
        return album;
    }
}
