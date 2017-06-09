package to.kit.genogram.enumeration;

import lombok.Getter;
import to.kit.genogram.entity.Diagram;

/**
 * 名前表示.
 * @see Diagram
 * @author H.Sasai
 */
@Getter
public enum ShowNameType {
	/** 非表示. */
	Off("0"),
	/** 上. */
	Top("t"),
	/** 中. */
	Middle("m"),
	/** 下. */
	Bottom("b"),
	;
	private String ch;

	private ShowNameType(String ch) {
		this.ch = ch;
	}

	/**
	 * 文字から変換.
	 * @param ch
	 * @return 変換後の値
	 */
	public static ShowNameType convert(String ch) {
		ShowNameType result = Off;

		for (ShowNameType type : values()) {
			if (type.ch.equals(ch)) {
				result = type;
				break;
			}
		}
		return result;
	}
}
