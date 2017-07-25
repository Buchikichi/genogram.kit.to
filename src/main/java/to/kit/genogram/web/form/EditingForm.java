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
}
