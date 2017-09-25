package to.kit.genogram.web.form;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.Data;

/**
 * 編集フォーム.
 * @author H.Sasai
 */
@Data
public class EditingForm {
	@NotEmpty
	private String id;
	private String name;
	private String gender;
	private String dob;
	private String filename;
	private String scale;

	/**
	 * スケール値取得.
	 * @return スケール値
	 */
	public double getScaleValue() {
		double result = 1.0;
		String value = this.scale;

		if (value == null || value.isEmpty()) {
			value = System.getProperty("genogram.scale", "1");
		}
		try {
			result = Double.parseDouble(value);
		} catch(@SuppressWarnings("unused") Exception ex) {
			// nop
		}
		return result;
	}
}
