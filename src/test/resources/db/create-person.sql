-- Table: person

-- DROP TABLE person;

CREATE TABLE person(
	id varchar(36) NOT NULL,
	diagram_id varchar(36) NOT NULL,
	name varchar(40),
	description varchar(200),
	dx float NOT NULL DEFAULT 0,
	dy float NOT NULL DEFAULT 0,
	gender varchar(1) NOT NULL DEFAULT '0',
	dob varchar(8),
	dod varchar(8),
	attr varchar(100),
	parents_id varchar(36),
	created date NOT NULL WITH DEFAULT,
	updated date NOT NULL WITH DEFAULT,
	PRIMARY KEY (id)
)
;

COMMENT ON COLUMN person.id IS 'ID';
COMMENT ON COLUMN person.diagram_id IS 'ダイアグラムID';
COMMENT ON COLUMN person.name IS '名前';
COMMENT ON COLUMN person.description IS '説明';
COMMENT ON COLUMN person.dx IS '説明dx';
COMMENT ON COLUMN person.dy IS '説明dy';
COMMENT ON COLUMN person.gender IS '性別';
COMMENT ON COLUMN person.dob IS '生年月日';
COMMENT ON COLUMN person.dod IS '死亡日';
COMMENT ON COLUMN person.attr IS '属性';
COMMENT ON COLUMN person.parents_id IS '両親';
COMMENT ON COLUMN person.created IS '作成日';
COMMENT ON COLUMN person.updated IS '更新日';
