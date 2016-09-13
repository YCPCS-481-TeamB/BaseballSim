CREATE TABLE users (id SERIAL, username VARCHAR(255), password VARCHAR(255), firstname VARCHAR(255), lastname VARCHAR(255), email VARCHAR(255), date_created TIMESTAMP DEFAULT NOW());

CREATE TYPE player_position AS ENUM ('pitcher', 'catcher', 'first_baseman', 'second_baseman', 'third_baseman','shortstop', 'left_fielder', 'center_fielder', 'right_fielder');

CREATE TYPE dominant_arm AS ENUM ('left', 'right');

CREATE TABLE players (
    id SERIAL, firstname VARCHAR (255), lastname VARCHAR(255), position player_position,
	--Stats
	technique INTEGER, pitch_speed INTEGER, endurance INTEGER,
	contact INTEGER, swing_speed INTEGER, bat_power INTEGER,
	catching INTEGER, throwing INTEGER, awareness INTEGER,
	speed INTEGER, clutch INTEGER, arm dominant_arm,
	team_id INTEGER
);

CREATE TABLE teams (id SERIAL, name VARCHAR(255), league_id INTEGER);

CREATE TABLE leagues (id PRIMARY KEY, name VARCHAR(255));

--CREATES PERMISSIONS TABLE FOR OWNERSHIP AND VIEW RIGHTS FOR FIELDS (ALLOWS CO-OWNERSHIP OF ITEMS)
CREATE TABLE permissions (id SERIAL, user_id INTEGER, item_type VARCHAR(255) NOT NULL, item_id INTEGER NOT NULL);