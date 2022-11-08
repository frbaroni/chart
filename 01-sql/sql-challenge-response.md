This challenge was ran on https://www.db-fiddle.com with `PostgreSQL v15 (beta)`

Schema SQL:
```
	-- schema
	CREATE TABLE users (
		id serial PRIMARY KEY,
		username VARCHAR(50) UNIQUE NOT NULL,
		email VARCHAR(255) NOT NULL,
		created_at DATE NOT NULL
	);

	CREATE TABLE artists (
		id serial PRIMARY KEY,
		user_id INT,
		artist_name VARCHAR(100),
		tagline VARCHAR(255) NOT NULL,
		FOREIGN KEY (user_id) REFERENCES users (id)
	);

	CREATE TABLE tracks (
		id serial PRIMARY KEY,
		artist_id INT NOT NULL,
		name VARCHAR(255) NOT NULL,
		isrc VARCHAR(12),
		FOREIGN KEY (artist_id) REFERENCES artists (id)
	);

	-- data
	INSERT INTO users (username, email, created_at) VALUES 
		('fernandobaroni', 'fernando@baroni.tech', now()),
		('arminvanbuuren', 'armin@astateoftrance.com', now()),
		('sandervandoorn', 'sander@van.doorn.com', now()),
		('beyonce', 'beyonce@singer.com', now());

	INSERT INTO artists (user_id, artist_name, tagline) VALUES 
		((SELECT id FROM users WHERE username = 'arminvanbuuren'), 'armin van buuren', 'trance'),
		((SELECT id FROM users WHERE username = 'sandervandoorn'), 'sander van doorn', 'eletronic, trance'),
		((SELECT id FROM users WHERE username = 'beyonce'), 'beyonce', 'popular');

	INSERT INTO tracks (artist_id, name, isrc) VALUES 
		((SELECT id FROM artists WHERE artist_name = 'armin van buuren'), 'shivers', 'isrc1'),
		((SELECT id FROM artists WHERE artist_name = 'armin van buuren'), 'bla bla bla', 'isrc2'),
		((SELECT id FROM artists WHERE artist_name = 'sander van doorn'), 'feels like summer', 'isrc3');
```

Query SQL to show all data:
```
	SELECT * FROM users;
	SELECT * FROM artists;
	SELECT * FROM tracks;
```

Query SQL to generate the desired challenge results
```
SELECT
	user_id, username, email,
    artists.id as artist_id, tagline,
    tracks.name as track_name, tracks.isrc as track_isrc
FROM
	artists
    INNER JOIN users ON users.id = artists.user_id
    LEFT JOIN tracks ON tracks.artist_id = artists.id	
```

Output
```
user_id 	username 	email 	artist_id 	tagline 	track_name 	track_isrc
2 	arminvanbuuren 	armin@astateoftrance.com 	1 	trance 	shivers 	isrc1
2 	arminvanbuuren 	armin@astateoftrance.com 	1 	trance 	bla bla bla 	isrc2
3 	sandervandoorn 	sander@van.doorn.com 	2 	eletronic, trance 	feels like summer 	isrc3
4 	beyonce 	beyonce@singer.com 	3 	popular 	null 	null
```

