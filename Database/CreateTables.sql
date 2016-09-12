CREATE TABLE users (id PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), firstname VARCHAR(255), lastname VARCHAR(255), email VARCHAR(255));

CREATE TYPE player_position AS ENUM ('pitcher', 'catcher', 'first_baseman', 'second_baseman', 'third_baseman','shortstop', 'left_fielder', 'center_fielder', 'right_fielder');

CREATE TABLE players (
    id PRIMARY KEY, firstname VARCHAR (255), lastname (255), position player_position
);

CREATE TABLE teams (id PRIMARY KEY, name VARCHAR(255));

--CREATE TABLE leagues;

--CREATES PERMISSIONS TABLE FOR OWNERSHIP AND VIEW RIGHTS FOR FIELDS (ALLOWS CO-OWNERSHIP OF ITEMS)
CREATE TABLE permissions (id PRIMARY KEY, user_id INTEGER, item_type VARCHAR(255) NOT NULL, item_id INTEGER NOT NULL);