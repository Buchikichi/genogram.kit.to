-- Table: diagram

-- DROP TABLE diagram;

CREATE TABLE diagram(
	id varchar(36) NOT NULL,
	document_id varchar(100) NOT NULL,
	person_id varchar(36) NOT NULL,
	description varchar(200),
	image clob,
	show_grid int NOT NULL default 0,
	grid_size int NOT NULL default 0,
	show_name char(1) NOT NULL default '0',
	name_size int NOT NULL default 0,
	created date NOT NULL WITH DEFAULT,
	updated date NOT NULL WITH DEFAULT,
	PRIMARY KEY (id)
)
IN GENOGRAM
;

COMMENT ON COLUMN diagram.id IS 'ID';
COMMENT ON COLUMN diagram.document_id IS 'ドキュメントID';
COMMENT ON COLUMN diagram.person_id IS '中心人物';
COMMENT ON COLUMN diagram.description IS '説明';
COMMENT ON COLUMN diagram.image IS '画像';
COMMENT ON COLUMN diagram.show_grid IS 'グリッド表示';
COMMENT ON COLUMN diagram.grid_size IS 'グリッドサイズ';
COMMENT ON COLUMN diagram.show_name IS '名前表示';
COMMENT ON COLUMN diagram.name_size IS '名前サイズ';
COMMENT ON COLUMN diagram.created IS '作成日';
COMMENT ON COLUMN diagram.updated IS '更新日';

-- DB2 --
-- ALTER TABLE diagram ALTER COLUMN description SET DATA TYPE vargraphic(200);
