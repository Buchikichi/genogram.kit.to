package to.kit.genogram.web.form;

import java.util.List;

import lombok.Data;
import to.kit.genogram.entity.Person;

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
	private String image;

	private List<Person> personList;
}
