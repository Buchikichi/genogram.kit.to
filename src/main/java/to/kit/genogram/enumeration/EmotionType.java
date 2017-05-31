package to.kit.genogram.enumeration;

import to.kit.genogram.entity.Relationship;

/**
 * 感情の種類.
 * @see Relationship
 * @author H.Sasai
 */
public enum EmotionType {
	/** 融合. */
	Fused,
	/** 親密. */
	Close,
	/** 疎遠. */
	Distant,
	/** 敵対. */
	Hostile,
	/** 融合し敵対. */
	FusedHostile,
	/** 親密で敵対. */
	CloseHostile,
	/** 遮断. */
	CutOff,
	/** 強い関心/干渉. */
	Focused,
	/** 性的虐待. */
	SexualAbuse,
	/** 身体的虐待. */
	PhysicalAbuse,
}
