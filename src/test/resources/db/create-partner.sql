-- Table: partner

-- DROP TABLE partner;

CREATE TABLE partner(
	id varchar(36) NOT NULL,
	diagram_id varchar(36) NOT NULL,
	person_id varchar(36) NOT NULL,
	other_id varchar(36) NOT NULL,
	type char(1) NOT NULL,
	created date NOT NULL WITH DEFAULT,
	updated date NOT NULL WITH DEFAULT,
	PRIMARY KEY (id)
)
;

COMMENT ON COLUMN partner.id IS 'ID';
COMMENT ON COLUMN partner.diagram_id IS 'ダイアグラムID';
COMMENT ON COLUMN partner.person_id IS '自分';
COMMENT ON COLUMN partner.other_id IS '配偶者';
COMMENT ON COLUMN partner.type IS '種類';
COMMENT ON COLUMN partner.created IS '作成日';
COMMENT ON COLUMN partner.updated IS '更新日';
