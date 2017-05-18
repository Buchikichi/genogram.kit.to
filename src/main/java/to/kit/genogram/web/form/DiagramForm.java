package to.kit.genogram.web.form;

import lombok.Data;

/**
 * ダイアグラムフォーム.
 * @author H.Sasai
 */
@Data
public class DiagramForm {
	private String id;
	private String documentId;
	private String personId;
	private String description;
}
