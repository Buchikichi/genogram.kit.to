-- Table: children

-- DROP TABLE children;

CREATE TABLE children(
	id varchar(36) NOT NULL DEFAULT gen_random_uuid(),
	personId varchar(36) NOT NULL,
	childId varchar(36) NOT NULL,
	created date NOT NULL DEFAULT now(),
	updated date NOT NULL DEFAULT now(),
	PRIMARY KEY (id)
);
COMMENT ON COLUMN children.id IS 'ID';
COMMENT ON COLUMN children.personId IS '自分';
COMMENT ON COLUMN children.childId IS '子';
COMMENT ON COLUMN children.created IS '作成日';
COMMENT ON COLUMN children.updated IS '更新日';
