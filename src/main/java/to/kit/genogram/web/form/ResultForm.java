package to.kit.genogram.web.form;

import java.io.Serializable;

import lombok.Data;

/**
 * 結果フォーム.
 * @author H.Sasai
 */
@Data
public class ResultForm implements Serializable {
	/** serialVersionUID. */
	private static final long serialVersionUID = -509479544387867796L;

	private boolean ok;
	private Object info;
}
