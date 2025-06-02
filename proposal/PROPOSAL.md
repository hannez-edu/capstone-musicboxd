# Capstone Project Planning

## Deliverables 

* Proposal 
* Wireframes
* Database Schema

## Problem Statement


Context: Briefly describe the context or environment in which the problem exists. Who are the primary users or groups affected? What is the scope of the issue?

>There are several ways for people to share their thoughts on media such as movies. For example, Rotten Tomatoes and letterboxd both provide platforms for people to review and keep track of movies. We decided to create a similar platform specifically for music. This will provide users the ability to track albums that they have listened to, review albums, and view other people's reviews of albums.


Core Problem: What specific, unmet need or challenge does this project address? Explain in simple terms what is currently missing, difficult, or ineffective for users.

>This project addresses the need for users to be able to keep track of music they've listened to, intend on listening to, as well as share their thoughts with other users on a particular album. Many solutions exist for listening to music, but none really focus entirely on cataloging & sharing thoughts. This project aims to fill the niche of users that want to keep track of music & share opinions on it while separating one's preferred method of listening to music entirely.


Impact on Users: Describe how this problem affects the users or stakeholders. What pain points do they experience as a result of this issue? What specific frustrations, inefficiencies, or missed opportunities arise from the current situation?

>Although there are methods to create reviews and share thoughts on music, it generally requires using other social media through mediums such as creating posts. This does allow people to express themselves, but it does not provide particularly intuitive ways to compile and keep track of others' opinions. This project will provide users a platform specifically for cataloging and reviewing music, which allows the focus of the project to be providing a platform for that specific purpose as opposed to a more general social media platform.


Opportunity for Solution: Why is solving this problem meaningful for your intended audience? How would a solution add value to their experience or address their needs in a unique way?

>Solving this problem is meaningful for the intended audience because it allows them to focus entirely on the cataloging & social aspects of managing the music they've listened to or intend on listening to without necessarily feeling like their being pushed into listening to music through a particular means. Users are free to continue to listen to music in their favorite way (streaming, local library, physical releases, etc.) while having a central place to catalog music & share their opinions.

## Technical Solution


Overview of the Solution: Describe the high-level approach you plan to take to solve the problem outlined in your Problem Statement. What kind of application or system will you create? How will it address the core problem?

>To solve the problems outlined, we will create a web application that allows users to select albums they've listened to or intend on listening to & provide reviews. Users will also be able to see what other user's reviews for a particular album are. The albums available for selection & review are managed by the Admin/API, which will make the albums, their covers, and other relevant information available within the application.


Key Features and Functionalities: List and describe the main features of the application. What are the critical functionalities that users will need to perform in order to effectively interact with the system?

* Creating Albums (User/Admin/API): Users and admins will be able to create albums that users can use for playlists and reviews. The external API is used to fetch information about the album, and the user/admin would view the retrieved information before sending it to the backend.
* Moderating Content (Admin): In order to ensure the platform does not stray from its intended use, admins will be able to moderate content by restricting users and deleting reviews.
* Creating Catalogs (User): Users will be able to create playlists/catalogs of albums based on their preferences.
* Creating Reviews (User): Users will be able to review albums through text and leaving a numeric amount of stars from 1-5.
* View Other User's Reviews (User): In order to properly provide a platform for users to review music, they must be able to view other reviews. This includes being able to leave simple feedback on a review by liking a review.


User Scenarios: Explain how the technical solution will support different user needs. Provide two to three specific use cases or scenarios that illustrate how users (e.g., runners, club admins) will interact with the system and what value they will gain from each interaction.

1. Scenario: Bob, someone who frequently listens to all kinds of music, leaves reviews on recently released albums to share his thoughts. He also views reviews on albums in his playlists to gain new perspectives on music he enjoys.
2. Scenario: Steve, someone who prefers indie music, leaves and views reviews albums according to his preferences. This helps him find more obscure albums that he might like as well as share lesser known albums.


Technology Stack: Briefly mention the key technologies, frameworks, and tools you will use to build the application. Why did you choose these tools, and how will they help you achieve your solution?

* Database: MySQL daemon via the public MySQL Docker image
* Backend: Spring Boot, Spring MVC, JDBC
* Security: JWT with Spring Security for user login & roles
* Frontend: React
* Testing: JUnit, Mockito
* External APIs: Spotify/MusicBrainz public API to fetch album information

## Glossary

* User
    A registered member of MusicBoxd who can create reviews, lists, and follow other users. Users have profiles showcasing their musical taste and activity.
* Album
    The primary musical content unit in MusicBoxd. Albums contain metadata like title, artist, release date, cover art, and user-generated content like reviews and ratings.
* Artist
    Musicians or bands who create albums. Artists have profile pages showing their discography and aggregated user ratings/reviews.
* Review
    A user's written evaluation of an album, including a star rating (1-5), written content, and optional tags. 
* Admin
    Users with elevated privileges who can moderate content, manage reported reviews, and maintain the platform's community standards.
* Catalog
    A record of albums a user has reviewed, listened to or wants to listen to, creating a personal music diary.
* Following
    A social relationship where one user subscribes to another user's activity. Following someone adds their reviews, lists, and listening activity to your social feed.

## High Level Requirements

### Manage 4-7 Database Tables

We will design & implement a database schema containing 4-7 independent entities representing different concepts within the application. We will include the following tables in our schema:

Major tables
 - Users
 - Artists
 - Albums
 - Reviews
 - Catalog
Lesser tables
- User roles (lookup)
- User review likes (bridge) (Additional Stretch Goal)
- Following (bridge)


### MySQL for Data Management

We will use MySQL as the relational DB management system for our application's means of storing & retrieving data. Our schema will be well-designed in order to properly represent the relationships between our entities & all queries made will maintain data integrity. We will use JDBC with MySQL to perform our CRUD operations in the backend.


### Spring Boot, MVC, JDBC, Testing, React

We will implement the backend of our application using Spring Boot & Spring MVC while adhering to the MVC architecture for organizing the application's overall structure. JDBC will be used as our means of interacting with our database. The backend's data & domain layers will have full test suites written utilizing JUnit & Spring testing strategies. As for the front end, we will build out the UI utilizing React.


### HTML & CSS UI Built with React

We will create our application's UI using React, HTML, and CSS, ensuring that our UI design is flexible & user-friendly. The layout will be intuitive to use and responsive to different device formats.


### Sensible Layering & Pattern Choices

We will follow best practices for maintaining an MVC-architecture application, ensuring strict separation of concerns between layers. We will minimally use repositories, services, and controllers to organize our logical layers for the application.


### Full Test Suite Covering Domain & Data Layers

We will use a test database along with a stored procedure to set the database to a known good state for repository/data layer tests.

We will use Mockito to create mock data components when testing domain components.


### At Least 2 Roles

We will implement role-based access using Spring Security, and plan on having both User & Admin roles implemented. Users will be able to perform basic cataloging & reviewing/social features, while admin will have the ability to moderate posted content & delete albums from the system.

## User Stories

* Creating Albums
    * Goal: As a user, I want to add an album.
    * Plan to meet requirement: I will design a form where admins can create a new album. Relevant album information will be fetched & added to the system using an external API.
    * Precondition: The user is logged in.
    * Postcondition: An album is added to the system.



* Deleting Albums (ADMIN)
    * Goal: As an admin, I want to be able to delete a particular album from the system & all its associated content
    * Plan to meet requirement: We will implement a feature in the album selection page where if the user has the ADMIN role, they are permitted to delete a particular album.
    * Precondition: The user is logged in with the ADMIN role.
    * Postcondition: The album & all associated information (reviews, presence in user catalogs, etc) is removed from the system.



* Moderating Content (ADMIN)
    * Goal: As an admin, I want to be able to delete any user's written review.
    * Plan to meet requirement: We will implement user role checks for the review deletion page that specifically permit administrators to delete reviews made by any user.
    * Precondition: The user is logged in with the ADMIN role.
    * Postcondition: The selected review to be deleted is removed from the system.



* View Albums
    * Goal: As a user, I want to be able to view albums.
    * Plan to meet requirement: We will implement an interface that allows users to view a list of albums. 
    * Precondition: The user may add specific terms to search for such as title or artist.
    * Postcondition: Albums relevant to the search terms (if any) will be displayed.



* View Other User's Content
    * Goal: As a user, I want to be able to browse other users' libraries & reviews.
    * Plan to meet requirement: We will implement an interface that allows users to view a particular user's library contents, as well as an interface that allows one to view user reviews associated with a particular album.
    * Precondition: None
    * Postcondition: None



* Creating Reviews 
    * Goal: As a user, I want to be able to create a review for a particular album.
    * Plan to meet requirement: We will implement a form interface in which a user can provide both a numerical rating & provide a short written review.
    * Precondition: The user is logged in so we can associate the review with a particular user
    * Postcondition: The review is created & associated with both an album & a user



* Editing Reviews
    * Goal: As a user, I want to be able to edit my previous review for a particular album.
    * Plan to meet requirement: We will implement a modified interface based on the review creation interface that allows the user to make edits to the review they previously posted & update it.
    * Precondition: The user is logged in so they're only allowed to edit their own reviews
    * Postcondition: The review belonging to the user is updated with new information



* Deleting Reviews
    * Goal: As a user, I want to be able to delete one of my previous reviews for a particular album.
    * Plan to meet requirement: We will implement a means of a user selecting one of their own written reviews to be deleted from the system.
    * Precondition: The user is logged in so they're only allowed to delete their own reviews.
    * Postcondition: The selected review is deleted from the system



* Catalog Albums
    * Goal: As a user, I want to be able to add albums to my personal listening library.
    * Plan to meet requirement: We will create an interface in which users can select from a list of albums (or search for one) to select & add to their personal library.
    * Precondition: The user must be logged in.
    * Postcondition: The selected album is added to that user's library.



* Liking Reviews (Additional Stretch Goal)
    * Goal: As a user, I want to be able to like reviews to show my agreement with the review.
    * Plan to meet requirement: We would utilize a bridge table between users and reviews to keep track of which reviews a user liked. This would also be used to show the user if they have already liked a review.
    * Precondition: The user must be logged in.
    * Postcondition: The bridge_likes table would be updated.

## Learning Goal

Learning Goal: Integrate and manage a live external music API, handling authentication, rate limiting, data synchronization and error messages.

Application: The live API provides real-time fetchable album metadata and cover art that the user can search. Once a user or admin has interacted with the album in some way (rated or adding to Listening History, or manually added by admin) then it will be added to the app's database.

**Research & Resources:**
- Discogs https://www.discogs.com/developers
- Spotify https://developer.spotify.com/documentation/web-api
- MusicBrainz https://developer.spotify.com/documentation/web-api

Explore documentation for rate limits and authentication handling.

Challenges: API rate limiting, managing authentication, synchronizing data with local database. Potential solutions could be caching strategies along with thorough testing.

Success Criteria: Users can seamlessly search for albums with real-time results, see up-to-date album info with cover art, and the system handles failures without breaking the user experience. The integration feels invisible to the user.

## Class Diagrams (Separate File)

* Should Include: Classes, their fields, methods, and relationships

## Class List

App

* public static void main(String[]) -- Application entrypoint instantiating required classes & running the application


Models

* Album - Represents an album that users can view and review
    * private int albumId 
    * private int artistId
    * private String id
    * private String title
    * private Date firstReleaseDate
    * private String albumArtUrl
    * private Artist artist -- Retrieved in AlbumRepository
    * private List<Review> reviews -- Retrieved in AlbumRepository. Should be null unless finding by id
    * Full getters & setters
* Review
    * private int reviewId
    * private int albumId  -- Album id of the album being reviewed
    * private int userId  -- User id of the reviewer
    * private String reviewContent
    * private int stars
    * private int likes -- (Additional Stretch Goal) Retrieved in ReviewRepository.    Determined by a call to the likes bridge database
    * private boolean likedByCurrentUser -- (Additional Stretch Goal) Retrieved in ReviewRepository. Determined by a call to the likes bridge database
    * private User user -- Retrieved in ReviewRepository
    * private Album album -- Retrieved in ReviewRepository
    * Full getters & setters
* User
    * private int userId
    * private String username
    * private String email
    * private String firstName
    * private String lastName
    * private List<UserRoles> roles -- Retrieved in UserRepository. Roles of the user. Used when finding by Id
    * private List<User> following -- Users the user is following (only finds id, username, and email). Used when finding by Id
    * private List<User> followers -- Users following the user (only finds id, username, and email). Used when finding by Id
    * Full getters & setters
* Catalog
    * private int catalogEntryId
    * private int userId -- User id of the owner of the catalog
    * private int albumId
    * private CatalogStatus status 
    * Full getters & setters
* Artist
    * private int artistId
    * private String id
    * private String name
    * private String sortName
    * private List<Album> albums -- Retrieved in ArtistRepository. Albums released by this artist.
    * Full getters & setters
* CatalogStatus (enum)
    * LISTENED
    * NO_INTEREST
    * WANT_TO_LISTEN
* UserRoles (enum)
    * USER
    * ADMIN


Data

* mappers (all implement RowMapper<T>)
    * AlbumMapper: public Album mapRow(ResultSet, int)  -- Row mapper for DB interaction
    * ReviewMapper: public Review mapRow(ResultSet, int)  -- Row mapper for DB interaction
    * UserMapper: public User mapRow(ResultSet, int)  -- Row mapper for DB interaction
    * CatalogMapper: public Catalog mapRow(ResultSet, int)  -- Row mapper for DB interaction
    * ArtistMapper: public Artist mapRow(ResultSet, int)  -- Row mapper for DB interaction
* DataException - Custom data-layer exception type
    * public DataException(String, Throwable) -- Constructor
* AlbumRepository
    * public List<Album> findAll() -- Find all albums
    * public Album findById(int) -- Find album by album ID
    * public Album add(Album)  -- Add an album
    * public boolean deleteById(int)  -- Delete an album from the system
    * private Album joinArtist(Album) -- Joins an Artist object to the Album and returns the Album
    * private Album joinReviews(Album) -- Joins reviews to the Album. Should only be called during findById
* ReviewRepository
    * public List<Review> findAll()  -- Find all reviews
    * public Review findById(int) -- Find review by review ID
    * public List<Review> findByUserId(int) -- Find reviews by user ID
    * public Review add(Review)  -- Add a review
    * public boolean update(Review)  -- Update an review
    * public boolean deleteById(int)  -- Delete a review from the system
    * public boolean updateLike(Review, int) -- (Additional Stretch Goal) Update if a review is liked by a user
    * private Review joinLikes(Review)  -- (Additional Stretch Goal) Sets likes based on count in the likes bridge table
    * private Review joinLikedByCurrentUser(Review, int) -- (Additional Stretch Goal) Sets likedByCurrentUser based on the inputted id as well as the likes bridge table
    * private Review joinUser(Review) -- Joins the reviewer as a user to the review. Only needs to retrieve userId, username, and email. Should not be called in findAll
    * private Review joinAlbum(Review) -- Joins the review to its album. Should not be called in findAll
* UserRepository
    * public List<User> findAll() -- Find all users
    * public User findById(int) -- Find user by user ID
    * public User add(User)  -- Add a user
    * public boolean update(User)  -- Update a user
    * public boolean deleteById(int)  -- Delete a user from the system
    * private User joinFollowers(User) -- Joins users following the inputted user. Should only set the userId, username, and email of followers
    * private User joinFollowing(User) -- Joins the users that the inputted user is following. Should only set the userId, username, and email of those following users
* CatalogRepository
    * public List<Catalogs> findAll() -- Find all catalogs
    * public Catalog findById(int) -- Find catalog by catalog ID
    * public List<Catalog> findByUserId(int) -- Find a list of catalogs from a user ID
    * public Catalog add(Catalog)  -- Add a catalog
    * public boolean update(Catalog)  -- Update a catalog
    * public boolean deleteById(int)  -- Delete a catalog from the system
* ArtistRepository
    * public List<Artist> findAll() -- Find all artists
    * public Artist findById(int) -- Find artist by artist ID
    * public Artist add(Atrist)  -- Add a artist
    * public Artist update(Artist)  -- Update a artist
    * public boolean deleteById(int)  -- Delete an artist from the system
    * private Artist joinAlbums(Artist) -- Joins the albums that were made by the artist. Should only be called during findById


Domain

* AlbumService
    * private AlbumRepository repository  -- Data dependency
    * public AlbumService(AlbumRepository)  -- Constructor
    * public List<Album> findAll()  -- Passthrough
    * public Album findById(int)  -- Passthrough
    * public Result add(Album)  -- Validate then add to repository
    * public Result deleteById(int)  -- Passthrough
    * private Result validate(Album)  -- Validation
* ReviewService
    * private ReviewRepository repository  -- Data dependency
    * public ReviewService(ReviewRepository)  -- Constructor
    * public List<Review> findAll()  -- Passthrough
    * public Review findById(int)  -- Passthrough
    * public List<Review> findByUserId(int) -- Passthrough
    * public Result add(Review)  -- Validate then add to repository
    * public Result update(Review)  -- Validate, then update
    * public Result deleteById(int)  -- Passthrough
    * public Result updateLike(Review, int) -- (Additional Stretch Goal) Update if a review was liked by a user
    * private Result validate(Review)  -- Validation
* UserService
    * private UserRepository repository  -- Data dependency
    * private PasswordEncoder encoder  -- Security dependency
    * public UserService(UserRepository)  -- Constructor
    * public List<User> findAll()  -- Passthrough
    * public User findById(int)  -- Passthrough
    * public Result add(User)  -- Validate then add to repository
    * public Result update(User)  -- Validate, then update
    * public Result deleteById(int)  -- Passthrough
    * private Result validate(User)  -- Validation
    * private void ensureAdmin()  -- Ensures we bootstrap w/ an admin-role user
* CatalogService
    * private CatalogRepository repository  -- Data dependency
    * public CatalogService(CatalogRepository)  -- Constructor
    * public List<Catalog> findAll()  -- Passthrough
    * public Catalog findById(int)  -- Passthrough
    * public List<Catalog> findByUserId(int) -- Passthrough
    * public Result add(Catalog)  -- Validate then add to repository
    * public Result update(Catalog)  -- Validate, then update
    * public Result deleteById(int)  -- Passthrough
    * private Result validate(Catalog)  -- Validation
* ArtistService
    * private ArtistRepository repository  -- Data dependency
    * public ArtistService(ArtistRepository)  -- Constructor
    * public List<Artist> findAll()  -- Passthrough
    * public Artist findById(int)  -- Passthrough
    * public Result add(Artist)  -- Validate then add to repository
    * public Result update(Artist)  -- Validate, then update
    * public Result deleteById(int)  -- Passthrough
    * private Result validate(Artist)  -- Validation
* Result
    * private ArrayList<String> messages  -- Validation messages
    * private ResultType type  -- Result's type (from ResultType enum)
    * private T payload -- Result payload (for add methods)
* ResultType (enum - later mapped to HTTP statuses)
    * SUCCESS
    * INVALID
    * NOT_FOUND


Controller

* AlbumController
    * private AlbumService albumService  -- Service dependency
    * public AlbumController(AlbumService)  -- Constructor
    * public List<Album> findAll()  -- Get all albums
    * public ResponseEntity<Album> findById(int)  -- Get album by ID
    * public ResponseEntity<Object> add(Album)  -- Add album
    * public ResponseEntity<Void> deleteById(int)  -- Delete album
* ReviewController
    * private ReviewService reviewService  -- Service dependency
    * public ReviewController(ReviewService)  -- Constructor
    * public List<Review> findAll()  -- Get all reviews
    * public ResponseEntity<Review> findById(int)  -- Get review by ID
    * public ResponseEntity<Object> add(Review)  -- Add review
    * public ResponseEntity<Object> update(Review)  -- Update review
    * public ResponseEntity<Void> deleteById(int)  -- Delete review by ID
* UserController
    * private UserService userService  -- Service dependency
    * public UserController(UserService)  -- Constructor
    * public List<User> findAll()  -- Get all users
    * public ResponseEntity<User> findById(int)  -- Get user by ID
    * public ResponseEntity<Object> add(User)  -- Add user
    * public ResponseEntity<Object> update(User)  -- Update user
    * public ResponseEntity<Void> deleteById(int)  -- Delete user by ID
* CatalogController
    * private CatalogService catalogService  -- Service dependency
    * public CatalogController(CatalogService)  -- Constructor
    * public List<Catalog> findAll()  -- Get all catalogs
    * public ResponseEntity<Catalog> findById(int)  -- Get catalog by ID
    * public ResponseEntity<List<Catalog>> findByUserId(int) -- Get catalogs that belong to the user ID
    * public ResponseEntity<Object> add(Catalog)  -- Add catalog
    * public ResponseEntity<Object> update(Catalog)  -- Update catalog
    * public ResponseEntity<Void> deleteById(int)  -- Delete catalog by ID
* ArtistController
    * private ArtistService artistService  -- Service dependency
    * public ArtistController(ArtistService)  -- Constructor
    * public List<Artist> findAll()  -- Get all artists
    * public ResponseEntity<Artist> findById(int)  -- Get artist by ID
    * public ResponseEntity<Object> add(Artist)  -- Add artist
    * public ResponseEntity<Object> update(Artist)  -- Update artist
    * public ResponseEntity<Void> deleteById(int)  -- Delete artist by ID
* GlobalExceptionHandler
    * Will handle exceptions to ensure no sensitive error data is exposed
* ErrorResponse
    * private final LocalDateTime timestamp
    * private final String message
    * Getters for all fields
    * public static ResponseEntity<ErrorResponse> build(String) -- Create a ResponseEntity using a string as the message
    * public static <T> ResponseEntity<ErrorResponse> build(Result<T>) -- Create a ResponseEntity using a Result object to create the message


Security

* JwtConverter
    * private Key key  -- Signing key
    * private String ISSUER  -- Issuer
    * private int EXPIRATION -- Token expiration time
    * public String getTokenFromUser(User)  -- Given a User, returns a JWT token
    * public User getUserFromToken(String)  -- Given a Token, returns the corresponding User
* AuthController
    * public AuthController()  -- Constructor
    * public ResponseEntity<Map<String, String>> authenticate(Map<String, String>)  -- Handles authentication requests
* SecurityConfig
    * protected void configure(HttpSecurity http) 
    * public PasswordEncoder getEncoder()  -- Returns a password encoder
* JwtRequestFilter
    * public JwtRequestFilter()  -- Constructor
    * protected void doFilterInternal(HttpServletRequest, HttpServeltResponse, FilterChain)  -- Intercepts HTTP requests & performs authentication & authorization checks
* UserDetailsService (Later, the UserService will implement this)
    * public UserDetails loadUserByUsername(String)  -- Loads a user by their username
