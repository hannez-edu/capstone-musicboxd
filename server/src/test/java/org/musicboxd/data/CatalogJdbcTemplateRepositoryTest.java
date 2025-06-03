package org.musicboxd.data;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.musicboxd.models.Catalog;
import org.musicboxd.models.CatalogStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class CatalogJdbcTemplateRepositoryTest {
    @Autowired
    CatalogJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setUp() {knownGoodState.set();}

    @Test
    void shouldFindAll() {
        List<Catalog> catalogs = repository.findAll();

        assertNotNull(catalogs);
        assertEquals(15, catalogs.size());
    }

    @Test
    void shouldFindById() {
        // user 1, album 1, LISTENED
        Catalog catalog = repository.findById(1);

        assertNotNull(catalog);
        assertEquals(1, catalog.getCatalogEntryId());
        assertEquals(1, catalog.getUserId());
        assertEquals(1, catalog.getAlbumId());
        assertEquals(CatalogStatus.LISTENED, catalog.getStatus());
    }

    @Test
    void shouldReturnNullWhenFindByIdNotFound() {
        Catalog catalog = repository.findById(999);
        assertNull(catalog);
    }

    @Test
    void shouldFindByUserId() {
        // User 1 has 5 catalog entries
        List<Catalog> catalogs = repository.findByUserId(1);

        assertNotNull(catalogs);
        assertEquals(5, catalogs.size());

        // Verify all entries belong to user 1
        assertTrue(catalogs.stream().allMatch(c -> c.getUserId() == 1));

        // Verify user 1 has only LISTENED entries
        assertTrue(catalogs.stream().allMatch(c -> c.getStatus() == CatalogStatus.LISTENED));
    }

    @Test
    void shouldFindByUserIdForUserWithMixedStatuses() {
        // User 3 has 4 catalog entries, all NO_INTEREST
        List<Catalog> catalogs = repository.findByUserId(3);

        assertNotNull(catalogs);
        assertEquals(4, catalogs.size());
        assertTrue(catalogs.stream().allMatch(c -> c.getStatus() == CatalogStatus.NO_INTEREST));
    }

    @Test
    void shouldFindByUserIdForUserWithWantToListen() {
        // User 9 has 2 catalog entries: both WANT_TO_LISTEN
        List<Catalog> catalogs = repository.findByUserId(9);

        assertNotNull(catalogs);
        assertEquals(2, catalogs.size());
        assertTrue(catalogs.stream().allMatch(c -> c.getStatus() == CatalogStatus.WANT_TO_LISTEN));
    }

    @Test
    void shouldReturnEmptyListForUserWithNoCatalogEntries() {
        // User 4 has no catalog entries in test data
        List<Catalog> catalogs = repository.findByUserId(5);

        assertNotNull(catalogs);
        assertTrue(catalogs.isEmpty());
    }

    @Test
    void shouldAddCatalogEntry() {
        Catalog newCatalog = new Catalog();
        newCatalog.setUserId(4); // User with no existing entries
        newCatalog.setAlbumId(5); // Album that exists
        newCatalog.setStatus(CatalogStatus.WANT_TO_LISTEN);

        Catalog result = repository.add(newCatalog);

        assertNotNull(result);
        assertTrue(result.getCatalogEntryId() > 0);
        assertEquals(4, result.getUserId());
        assertEquals(5, result.getAlbumId());
        assertEquals(CatalogStatus.WANT_TO_LISTEN, result.getStatus());

        // Verify it was actually saved
        Catalog found = repository.findById(result.getCatalogEntryId());
        assertNotNull(found);
        assertEquals(result.getCatalogEntryId(), found.getCatalogEntryId());
    }

    @Test
    void shouldNotAddDuplicateUserAlbumEntry() {
        // Try to add entry for user 1, album 1 (already exists)
        Catalog duplicate = new Catalog();
        duplicate.setUserId(1);
        duplicate.setAlbumId(1);
        duplicate.setStatus(CatalogStatus.NO_INTEREST);

        // Should throw exception due to unique constraint
        assertThrows(Exception.class, () -> repository.add(duplicate));
    }

    @Test
    void shouldUpdateCatalogEntry() {
        // Get existing entry (user 9, album 12, WANT_TO_LISTEN)
        Catalog catalog = repository.findById(2);
        assertNotNull(catalog);
        assertEquals(CatalogStatus.WANT_TO_LISTEN, catalog.getStatus());

        // Update status to LISTENED
        catalog.setStatus(CatalogStatus.LISTENED);
        boolean updated = repository.update(catalog);

        assertTrue(updated);

        // Verify update
        Catalog updatedCatalog = repository.findById(2);
        assertNotNull(updatedCatalog);
        assertEquals(CatalogStatus.LISTENED, updatedCatalog.getStatus());
    }

    @Test
    void shouldReturnFalseWhenUpdateNonExistentEntry() {
        Catalog nonExistent = new Catalog();
        nonExistent.setCatalogEntryId(999);
        nonExistent.setUserId(1);
        nonExistent.setAlbumId(1);
        nonExistent.setStatus(CatalogStatus.LISTENED);

        boolean result = repository.update(nonExistent);

        assertFalse(result);
    }

    @Test
    void shouldDeleteById() {
        // Delete entry with ID 15 (last entry)
        Catalog original = repository.findById(15);
        assertNotNull(original);

        boolean deleted = repository.deleteById(15);

        assertTrue(deleted);

        // Verify deletion
        Catalog deletedEntry = repository.findById(15);
        assertNull(deletedEntry);
    }

    @Test
    void shouldReturnFalseWhenDeleteNonExistentId() {
        boolean result = repository.deleteById(999);
        assertFalse(result);
    }
}
