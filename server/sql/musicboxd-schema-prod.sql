drop database if exists musicboxd;
create database musicboxd;
use musicboxd;

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
`name` varchar(50) not null
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
`status` enum('LISTENED, NO_INTEREST, WANT_TO_LISTEN') not null,

constraint fk_catalog_entry_user foreign key (user_id) references users(user_id),
constraint fk_catalog_entry_album foreign key (album_id) references albums(album_id),

unique key unique_user_album (user_id, album_id) -- one catalog entry per user per album
);