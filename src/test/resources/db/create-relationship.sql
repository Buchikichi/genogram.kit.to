-- Table: relationship

-- DROP TABLE relationship;

CREATE TABLE relationship(
	id varchar(36) NOT NULL,
	diagram_id varchar(36) NOT NULL,
	person_id varchar(36) NOT NULL,
	other_id varchar(36) NOT NULL,
	emotion varchar(16) NOT NULL,
	created date NOT NULL WITH DEFAULT,
	updated date NOT NULL WITH DEFAULT,
	PRIMARY KEY (id)
)
IN GENOGRAM
;

COMMENT ON COLUMN relationship.id IS 'ID';
COMMENT ON COLUMN relationship.diagram_id IS 'ダイアグラムID';
COMMENT ON COLUMN relationship.person_id IS '自分';
COMMENT ON COLUMN relationship.other_id IS '相手先';
COMMENT ON COLUMN relationship.emotion IS '感情の種類';
COMMENT ON COLUMN relationship.created IS '作成日';
COMMENT ON COLUMN relationship.updated IS '更新日';
