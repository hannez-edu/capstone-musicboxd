drop database if exists musicboxd_test;
create database musicboxd_test;
use musicboxd_test;

create table users (
user_id int auto_increment primary key,
user_name varchar(100) not null,
email varchar(255) unique not null,
password_hash varchar(50) not null,
first_name varchar(50) null,
last_name varchar(50) null
);

create table roles (
role_id int auto_increment primary key,
name varchar(50) not null
);

create table user_role (
user_role_id int auto_increment primary key,
user_id int not null,
role_id int not null,

constraint fk_user_role_user foreign key (user_id) references users(user_id),
constraint fk_user_role_role foreign key (role_id) references roles(role_id)
);

create table albums (
album_id int auto_increment primary key,
artist varchar(255) not null,
title varchar(255) not null,
release_date date not null,
art_url varchar(500) null
);

create table reviews (
review_id int auto_increment primary key,
album_id int not null,
user_id int not null,
content text not null,
stars tinyint not null,

constraint fk_review_album foreign key (album_id) references albums(album_id),
constraint fk_review_user foreign key (user_id) references users(user_id),

unique key unique_user_album_review (user_id, album_id) -- one review per album per user
);

create table review_likes (
review_like_id int auto_increment primary key,
user_id int not null,
review_id int not null,

constraint fk_review_like_user foreign key (user_id) references users(user_id),
constraint fk_review_like_review foreign key (review_id) references reviews(review_id),

unique key unique_user_review_like (user_id, review_id) -- one like per review per user
);

create table `following` (
following_id int auto_increment primary key,
followed_id int not null,
follower_id int not null,

constraint fk_following_follower foreign key (follower_id) references users(user_id),
constraint fk_following_followed foreign key (followed_id) references users(user_id),

unique key unique_follow (follower_id, followed_id), -- one follow per follower-user per followed-user

check (follower_id != followed_id) -- user cannot follow self
);

create table catalog_entry (
catalog_entry_id int auto_increment primary key,
user_id int not null,
album_id int not null,
status enum('LISTENED, NO_INTEREST, WANT_TO_LISTEN') not null,

constraint fk_catalog_entry_user foreign key (user_id) references users(user_id),
constraint fk_catalog_entry_album foreign key (album_id) references albums(album_id),

unique key unique_user_album (user_id, album_id) -- one catalog entry per user per album
);

delimiter //
create procedure set_known_good_state()
begin

delete from users;
alter table users auto_increment = 1;
delete from roles;
alter table roles auto_increment = 1;
delete from albums;
alter table albums auto_increment = 1;
delete from reviews;
alter table reviews auto_increment = 1;
delete from catalog_entry;
alter table catalog_entry auto_increment = 1;
delete from user_role;
alter table user_role auto_increment = 1;
delete from review_likes;
alter table review_likes auto_increment = 1;
delete from `following`;
alter table `following` auto_increment = 1;

insert into users (user_id, user_name, email, first_name, last_name, password_hash) values
	(1, 'khatrey0', 'khatrey0@webmd.com', 'Kristine', 'Hatrey', '$2a$04$kYGG1DTPvd4N5Vlkup.Y9uzOH12nwz5blC5vZ0vG3vYhJrn3yb7LG'),
	(2, 'kprati1', 'kprati1@pinterest.com', 'Kristos', 'Prati', '$2a$04$xrRJZL4tocY22gAxojBhHuW8DGR4wqzteyh.vzLTwsTaQN3ALCCe2'),
	(3, 'swilding2', 'swilding2@wikipedia.org', 'Shalom', 'Wilding', '$2a$04$XN9dh2JY1k437oKEUiv/7ONaPOm/UQnXuT9szUiib2UeFSmZ28ipS'),
	(4, 'ccammoile3', 'ccammoile3@newsvine.com', 'Conrad', 'Cammoile', '$2a$04$DbXjZSZIA.4W/9tTw/k0XOT.qFR8pvnr5PqdxDpSiaY9lvaW5kurK'),
	(5, 'knickels4', 'knickels4@1688.com', 'Kordula', 'Nickels', '$2a$04$GcvsdSzggafPDaUOZ4cule83kNP2L4wfqeBWIVA3HvDAMS4nZjUzK'),
	(6, 'rmanske5', 'rmanske5@feedburner.com', 'Ramsey', 'Manske', '$2a$04$tbG2yzNQQKuCJUXFL7KI9.ew5CYuynkMg05YlVb3eoVVq4BLQir1i'),
	(7, 'smillson6', 'smillson6@macromedia.com', 'Sterne', 'Millson', '$2a$04$77JT0uP7jXZ5Kc3nmMYEoujlhWl8PAkMKaVjjVb7IsYpvtuBEhdE.'),
	(8, 'rgerred7', 'rgerred7@imdb.com', 'Reynard', 'Gerred', '$2a$04$OClHfA/GlPjrcwKs2xAc1OCFGZmn0AuVOh1QHw5vppL0wf9qsYmv.'),
	(9, 'bmactrustrie8', 'bmactrustrie8@discovery.com', 'Billie', 'MacTrustrie', '$2a$04$azShl9GmGgVsSzYZVa2JVOopbPQxHAUKBjK7CkpInbiBKHa.zjEvK'),
	(10, 'etatteshall9', 'etatteshall9@com.com', 'Enoch', 'Tatteshall', '$2a$04$iIGOL.XFfAZml9i3BQsl3u7yMbr2o2VBvpO3VTBrVw0rj7eoKrMRm');

insert into roles (role_id, `name`) values
	(1, 'USER'),
    (2, 'ADMIN');
    
insert into user_role (user_id, role_id) values
	(1, 2),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 1),
    (6, 1),
    (7, 1),
    (8, 1),
    (9, 1),
    (10, 1);

insert into albums (artist, title, release_date, art_url) values
	('Ward-Hackett', 'Heirloom, The (Zhai Ban)', '1969-02-15', 'http://dummyimage.com/100x100.png/cc0000/ffffff'),
	('Powlowski and Sons', 'First Monday in October', '1903-10-22', 'http://dummyimage.com/100x100.png/ff4444/ffffff'),
	('Stark-Gleason', 'From Beyond', '1901-09-28', 'http://dummyimage.com/100x100.png/dddddd/000000'),
	('Rippin, Collier and Bednar', 'Other Side of Heaven, The', '1936-07-11', 'http://dummyimage.com/100x100.png/5fa2dd/ffffff'),
	('Sanford-Jerde', 'Pete''s Dragon', '1940-04-27', 'http://dummyimage.com/100x100.png/ff4444/ffffff'),
	('Crona Inc', 'Private Life of Sherlock Holmes, The', '1993-12-05', 'http://dummyimage.com/100x100.png/5fa2dd/ffffff'),
	('Simonis-Brekke', 'Mickey''s Twice Upon a Christmas', '1926-08-12', 'http://dummyimage.com/100x100.png/dddddd/000000'),
	('Ankunding, Bahringer and Rodriguez', 'Ghoul, The', '2017-11-08', 'http://dummyimage.com/100x100.png/cc0000/ffffff'),
	('Hauck-Murray', 'Hachiko: A Dog''s Story (a.k.a. Hachi: A Dog''s Tale)', '1992-08-07', 'http://dummyimage.com/100x100.png/cc0000/ffffff'),
	('O''Kon-Hauck', 'All or Nothing', '1967-08-17', 'http://dummyimage.com/100x100.png/cc0000/ffffff'),
	('Bradtke and Sons', 'Lost Reels of Pancho Villa, The (Los rollos perdidos de Pancho Villa)', '1958-12-24', 'http://dummyimage.com/100x100.png/dddddd/000000'),
	('Hayes, McDermott and Nader', 'Mad Ron''s Prevues from Hell', '2002-08-06', 'http://dummyimage.com/100x100.png/dddddd/000000'),
	('Bogan, Conroy and Kozey', 'Sea Gull, The', '1936-04-24', 'http://dummyimage.com/100x100.png/dddddd/000000'),
	('Conn Inc', 'Chains (Catene)', '1914-06-29', 'http://dummyimage.com/100x100.png/dddddd/000000'),
	('Feeney and Sons', 'Torment', '1971-04-19', 'http://dummyimage.com/100x100.png/ff4444/ffffff'),
	('Jast-Emmerich', 'Singing Marine, The', '1949-02-11', 'http://dummyimage.com/100x100.png/ff4444/ffffff'),
	('Ratke, Bailey and Stamm', 'Inside The X-files', '1904-02-05', 'http://dummyimage.com/100x100.png/dddddd/000000'),
	('Kling-Bruen', 'Miss Minoes', '1928-01-05', 'http://dummyimage.com/100x100.png/dddddd/000000'),
	('Schimmel-Homenick', 'Walk to Remember, A', '1908-09-02', 'http://dummyimage.com/100x100.png/dddddd/000000'),
	('Kris Inc', 'Prince of Pennsylvania, The', '1920-02-19', 'http://dummyimage.com/100x100.png/5fa2dd/ffffff');
    
insert into reviews (album_id, user_id, content, stars) values
	(1, 1, "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.", 4),
	(3, 7, "Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.", 1),
	(5, 12, "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum.", 2),
	(2, 2, "Nullam molestie nibh in lectus. Pellentesque at nulla.", 5),
	(9, 10, "Sed ante. Vivamus tortor.", 1);
    
insert into review_likes (user_id, review_id) values
	(1, 1),
    (1, 2),
    (1, 3),
    (2, 1),
    (3, 2),
    (3, 5),
    (6, 5),
    (7, 3),
    (7, 4),
    (8, 1),
    (10, 2);
    
insert into catalog_entry (user_id, album_id, `status`) values
	(1, 1, 'LISTENED'),
    (9, 12, 'WANT_TO_LISTEN'),
    (3, 9, 'NO_INTEREST'),
    (1, 2, 'LISTENED'),
    (10, 2, 'LISTENED'),
    (6, 9, 'NO_INTEREST'),
    (1, 8, 'LISTENED'),
    (3, 15, 'NO_INTEREST'),
    (3, 4, 'NO_INTEREST'),
    (1, 4, 'LISTENED'),
    (9, 1, 'WANT_TO_LISTEN'),
    (3, 19, 'NO_INTEREST'),
    (1, 11, 'LISTENED'),
    (2, 4, 'WANT_TO_LISTEN'),
    (7, 16, 'NO_INTEREST');
    
insert into `following` (followed_id, follower_id) values
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (2, 1),
    (2, 4),
    (3, 9),
    (5, 9),
    (9, 1);

end //
delimiter ;

