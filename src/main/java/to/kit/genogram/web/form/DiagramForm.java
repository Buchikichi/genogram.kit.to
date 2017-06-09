package to.kit.genogram.web.form;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import to.kit.genogram.entity.Partner;
import to.kit.genogram.entity.Person;
import to.kit.genogram.entity.Relationship;
import to.kit.genogram.enumeration.ShowNameType;

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
	private int showGrid;
	private int gridSize;
	private ShowNameType showName;
	private int nameSize;

	private List<Person> personList;
	private List<Partner> partnerList = new ArrayList<>();
	private List<Relationship> relationshipList = new ArrayList<>();
}
