CREATE TYPE role_type AS ENUM ('admin', 'user');

CREATE TABLE users(
	id serial primary key,
	name varchar(80) not null unique,
	password varchar(80) not null,
	user_role role_type not null default('user')
);

CREATE TABLE restaurant(
	id serial primary key,
	name varchar(200) not null,
	address varchar(300) not null
);

CREATE TABLE menu_of_day(
	res_id integer,
	menu_date date,
	menu varchar(300) not null,
	foreign key(res_id) references restaurant(id),
	primary key(res_id, menu_date)
);

CREATE TABLE votes(
	user_id integer,
	vote_date date,
	res_id integer,
	foreign key(res_id) references restaurant(id),
	foreign key(user_id) references users(id),
	primary key(res_id, vote_date)
);