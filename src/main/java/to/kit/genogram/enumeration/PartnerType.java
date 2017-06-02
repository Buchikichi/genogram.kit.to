package to.kit.genogram.enumeration;

import to.kit.genogram.entity.Partner;

/**
 * パートナーとの関係.
 * @see Partner
 * @author H.Sasai
 */
public enum PartnerType {
	/** 婚姻. */
	Marriage,
	/** 別居. */
	Separated,
	/** 離婚. */
	Divorced,
	/** 同棲. */
	Concubinage,
}
