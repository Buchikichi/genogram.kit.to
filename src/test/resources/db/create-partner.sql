-- Table: partner

-- DROP TABLE partner;

CREATE TABLE partner(
	id varchar(36) NOT NULL DEFAULT gen_random_uuid(),
	personId varchar(36) NOT NULL,
	targetId varchar(36) NOT NULL,
	created date NOT NULL DEFAULT now(),
	updated date NOT NULL DEFAULT now(),
	PRIMARY KEY (id)
);
COMMENT ON COLUMN partner.id IS 'ID';
COMMENT ON COLUMN partner.personId IS '自分';
COMMENT ON COLUMN partner.targetId IS '配偶者';
COMMENT ON COLUMN partner.created IS '作成日';
COMMENT ON COLUMN partner.updated IS '更新日';
