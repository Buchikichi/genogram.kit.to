-- Table: diagram

-- DROP TABLE diagram;

CREATE TABLE diagram(
	id varchar(36) NOT NULL DEFAULT gen_random_uuid(),
	personId varchar(36) NOT NULL,
	created date NOT NULL DEFAULT now(),
	updated date NOT NULL DEFAULT now(),
	PRIMARY KEY (id)
);
COMMENT ON COLUMN diagram.id IS 'ID';
COMMENT ON COLUMN diagram.personId IS '中心人物';
COMMENT ON COLUMN diagram.created IS '作成日';
COMMENT ON COLUMN diagram.updated IS '更新日';
