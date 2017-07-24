package to.kit.genogram.web.form;

import lombok.Data;

/**
 * 編集フォーム.
 * @author H.Sasai
 */
@Data
public class EditingForm {
	private String id;
	private String name;
	private String gender;
	private String dob;
}
