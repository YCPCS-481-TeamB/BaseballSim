CREATE TYPE player_position AS ENUM ('pitcher', 'catcher', 'first_baseman', 'second_baseman', 'third_baseman','shortstop', 'left_fielder', 'center_fielder', 'right_fielder');

CREATE TYPE dominant_arm AS ENUM ('left', 'right');

CREATE TYPE permission_type AS ENUM ('owner', 'edit', 'view', 'delete');

CREATE TYPE approval_status AS ENUM ('approved', 'declined', 'pending');

CREATE TYPE game_action_type AS ENUM ('start', 'end', 'home_run', 'triple', 'double', 'single', 'ball', 'strike', 'foul', 'strike_out', 'out', 'walk');

CREATE TABLE users (id SERIAL, username VARCHAR(255), password VARCHAR(255), firstname VARCHAR(255), lastname VARCHAR(255), email VARCHAR(255), date_created TIMESTAMP DEFAULT NOW());

CREATE TABLE user_tokens (id SERIAL, user_id INTEGER, token TEXT, date_created TIMESTAMP DEFAULT NOW());

--PLAYERS STUFF
CREATE TABLE players (
	id SERIAL, firstname VARCHAR (255), lastname VARCHAR(255), position player_position, team_id INTEGER, date_created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE attributes (
	id SERIAL, player_id INTEGER,
		--Pitching attributes
	technique INTEGER, pitch_speed INTEGER, endurance INTEGER,
		--Batting attributes
	contact INTEGER, swing_speed INTEGER, bat_power INTEGER,
		--Fielding attributes
	catching INTEGER, throwing INTEGER, awareness INTEGER,
		--Misc attributes
	speed INTEGER, clutch INTEGER, arm dominant_arm
);

CREATE TABLE stats (
    id SERIAL,
	player_id INTEGER,
		--Fieldplayer Stats
	hits INTEGER, doubles INTEGER, games_played INTEGER, at_bats INTEGER,
	runs INTEGER, triples INTEGER, homeruns INTEGER, runs_batted_in INTEGER,
	stolen_bases INTEGER, on_base_percentage REAL, batting_average REAL,
	strikeouts INTEGER, walks INTEGER,
		--Pitching Stats
	wins INTEGER, losses INTEGER, hits_allowed INTEGER, innings_pitched REAL,
	runs_allowed INTEGER, walks_allowed INTEGER, earned_runs INTEGER,
	earned_run_average REAL, strikeouts_thrown INTEGER, saves INTEGER
);

CREATE TABLE player_names (id SERIAL, name VARCHAR(255), isLast BOOLEAN);

CREATE TABLE teams (id SERIAL, name VARCHAR(255), league_id INTEGER, date_created TIMESTAMP DEFAULT NOW());

CREATE TABLE fields (id SERIAL, name VARCHAR(255), team_id INTEGER, date_created TIMESTAMP DEFAULT NOW());

CREATE TABLE leagues (id SERIAL, name VARCHAR(255), date_created TIMESTAMP DEFAULT NOW());

CREATE TABLE lineups (id SERIAL, team_id INTEGER, game_id INTEGER, date_created TIMESTAMP DEFAULT NOW());
CREATE TABLE lineup_items (id SERIAL, lineup_id INTEGER, player_id INTEGER, lineup_index INTEGER, already_played BOOLEAN DEFAULT FALSE, date_created TIMESTAMP DEFAULT NOW());

--FOR SCHEDULE OF GAMES
CREATE TABLE schedule (id SERIAL, league_id INTEGER, date_created TIMESTAMP DEFAULT NOW());
CREATE TABLE schedule_item (id SERIAL, schedule_id INTEGER, start_time TIMESTAMP, date_created TIMESTAMP DEFAULT NOW());

--GAMES STUFF
CREATE TABLE games (id SERIAL, team1_id INTEGER, team2_id INTEGER, field_id INTEGER, league_id INTEGER, date_created TIMESTAMP DEFAULT NOW());
CREATE TABLE game_action (id SERIAL, game_id INTEGER, team_at_bat INTEGER, team1_score INTEGER DEFAULT 0, team2_score INTEGER DEFAULT 0, balls INTEGER DEFAULT 0, strikes INTEGER DEFAULT 0, outs INTEGER DEFAULT 0, inning INTEGER DEFAULT 1, type game_action_type, message VARCHAR(255), date_created TIMESTAMP DEFAULT NOW());
--TODO: Finish player position table
CREATE TABLE game_player_positions (id SERIAL, game_action_id INTEGER, onfirst_id INTEGER DEFAULT 0, onsecond_id INTEGER DEFAULT 0, onthird_id INTEGER DEFAULT 0, date_created TIMESTAMP DEFAULT NOW());

--CREATES PERMISSIONS TABLE FOR OWNERSHIP AND VIEW RIGHTS FOR FIELDS (ALLOWS CO-OWNERSHIP OF ITEMS)
CREATE TABLE permissions (id SERIAL, user_id INTEGER, item_type VARCHAR(255) NOT NULL, item_id INTEGER NOT NULL, type permission_type NOT NULL DEFAULT 'view', date_created TIMESTAMP DEFAULT NOW());

CREATE TABLE approvals (id SERIAL, approved approval_status DEFAULT 'pending', approver_user_id INTEGER, item_type VARCHAR(255) NOT NULL, item_id INTEGER NOT NULL, auto_approved BOOLEAN NOT NULL DEFAULT false, date_created TIMESTAMP DEFAULT NOW());

INSERT INTO player_names (name, isLast) VALUES ('Brandon', 'n');
INSERT INTO player_names (name, isLast) VALUES ('Walton', 'y');