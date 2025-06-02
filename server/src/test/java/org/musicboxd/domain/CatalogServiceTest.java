package org.musicboxd.domain;

import org.junit.jupiter.api.Test;
import org.musicboxd.data.CatalogRepository;
import org.musicboxd.models.Catalog;
import org.musicboxd.models.CatalogStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class CatalogServiceTest {

    @Autowired
    CatalogService service;

    @MockBean
    CatalogRepository repository;
}
