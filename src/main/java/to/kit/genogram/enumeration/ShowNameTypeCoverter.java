package to.kit.genogram.enumeration;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

/**
 * ShowNameコンバーター.
 * @author H.Sasai
 */
@Converter
public class ShowNameTypeCoverter implements AttributeConverter<ShowNameType, String>  {
	@Override
	public String convertToDatabaseColumn(ShowNameType attribute) {
		if (attribute == null) {
			return ShowNameType.Off.getCh();
		}
		return attribute.getCh();
	}

	@Override
	public ShowNameType convertToEntityAttribute(String ch) {
		return ShowNameType.convert(ch);
	}
}
