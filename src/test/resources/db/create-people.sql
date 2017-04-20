-- Table: people

-- DROP TABLE people;

CREATE TABLE people(
	id varchar(36) NOT NULL DEFAULT gen_random_uuid(),
	name text NOT NULL,
	description text,
	gender integer NOT NULL DEFAULT 0,
	dob date,
	fatherId varchar(36) NOT NULL,
	motherId varchar(36) NOT NULL,
	created date NOT NULL DEFAULT now(),
	updated date NOT NULL DEFAULT now(),
	PRIMARY KEY (id)
);
COMMENT ON COLUMN people.id IS 'ID';
COMMENT ON COLUMN people.name IS '名前';
COMMENT ON COLUMN people.description IS '説明';
COMMENT ON COLUMN people.gender IS '性別';
COMMENT ON COLUMN people.dob IS '生年月日';
COMMENT ON COLUMN people.fatherId IS '父';
COMMENT ON COLUMN people.motherId IS '母';
COMMENT ON COLUMN people.created IS '作成日';
COMMENT ON COLUMN people.updated IS '更新日';
