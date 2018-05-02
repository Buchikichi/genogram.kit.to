-- Table: shapes

-- DROP TABLE shapes;

CREATE TABLE shapes(
	id varchar(36) NOT NULL,
	diagram_id varchar(36) NOT NULL,
	parent_id varchar(36),
	type int NOT NULL DEFAULT 0,
	seq int NOT NULL DEFAULT 0,
	x float NOT NULL DEFAULT 0,
	y float NOT NULL DEFAULT 0,
	line_color varchar(7) NULL DEFAULT 'black',
	line_style int  NOT NULL DEFAULT 0,
	created date NOT NULL WITH DEFAULT,
	updated date NOT NULL WITH DEFAULT,
	PRIMARY KEY (id)
)
IN GENOGRAM
;

COMMENT ON COLUMN shapes.id IS 'ID';
COMMENT ON COLUMN shapes.diagram_id IS 'ダイアグラムID';
COMMENT ON COLUMN shapes.parent_id IS '親ID';
COMMENT ON COLUMN shapes.type IS 'タイプ';
COMMENT ON COLUMN shapes.seq IS '順序';
COMMENT ON COLUMN shapes.x IS 'X座標';
COMMENT ON COLUMN shapes.y IS 'Y座標';
COMMENT ON COLUMN shapes.line_style IS 'スタイル';
COMMENT ON COLUMN shapes.created IS '作成日';
COMMENT ON COLUMN shapes.updated IS '更新日';
