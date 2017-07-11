CREATE DATABASE collection_db;
USE collection_db;					

CREATE TABLE books (
	id int NOT NULL AUTO_INCREMENT,
	title varchar(255) NOT NULL,
	issue int (11),
	publish_date year,
	publisher varchar(255),
	synopsis text,
	role varchar(255),
	img_url text,
	characters text,
	teams text,
	PRIMARY KEY (id)
);																		

CREATE TABLE artwork (
	id int NOT NULL AUTO_INCREMENT,
  books_id int,
	format varchar(255),
	page_num varchar(255),
	img_url text,
	description text,
	feature text,
	PRIMARY KEY (id),
	FOREIGN KEY (books_id) REFERENCES books(id)
);