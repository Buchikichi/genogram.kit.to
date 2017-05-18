-- Table: diagram

-- DROP TABLE diagram;

CREATE TABLE diagram(
	id varchar(36) NOT NULL,
	document_id varchar(100) NOT NULL,
	person_id varchar(36) NOT NULL,
	description varchar(200),
	image clob,
	created date NOT NULL WITH DEFAULT,
	updated date NOT NULL WITH DEFAULT,
	PRIMARY KEY (id)
)
;

COMMENT ON COLUMN diagram.id IS 'ID';
COMMENT ON COLUMN diagram.document_id IS 'ドキュメントID';
COMMENT ON COLUMN diagram.person_id IS '中心人物';
COMMENT ON COLUMN diagram.description IS '説明';
COMMENT ON COLUMN diagram.image IS '画像';
COMMENT ON COLUMN diagram.created IS '作成日';
COMMENT ON COLUMN diagram.updated IS '更新日';
