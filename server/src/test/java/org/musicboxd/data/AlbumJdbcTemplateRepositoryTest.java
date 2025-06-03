package org.musicboxd.data;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.musicboxd.models.Album;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class AlbumJdbcTemplateRepositoryTest {

    @Autowired
    private AlbumJdbcTemplateRepository repository;

    @Autowired
    private KnownGoodState state;

    @BeforeEach
    public void setup() {
        state.set();
    }

    /*
    Test Plan

    Album id 1 will not be changed.
    Album id 2 will be edited.
    Album id 3 will be deleted.

    There may be more albums.
     */

    /* FindAll */

    @Test
    public void shouldFindAll() {
        List<Album> all = repository.findAll();

        assertNotNull(all);
        assertTrue(all.size() >= 2);
    }
}
