package to.kit.genogram.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;
import to.kit.genogram.enumeration.ShowNameType;
import to.kit.genogram.enumeration.ShowNameTypeCoverter;

/**
 * ダイアグラムエンティティ.
 * @author H.Sasai
 */
@Entity
@Data
public class Diagram {
	@Id
	private String id;
	private String documentId;
	private String personId;
	@Column(length = 200)
	private String description;
	private String image;
	private int showGrid;
	private int gridSize;
	@Convert(converter = ShowNameTypeCoverter.class)
	private ShowNameType showName;
	private int nameSize;
	@Column(insertable = false, updatable = false)
	private Date created;
	@Column(insertable = false)
	private Date updated;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "diagram", cascade = CascadeType.ALL)
	@NotFound(action = NotFoundAction.IGNORE)
	@JsonManagedReference
	private List<Person> personList;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "diagram", cascade = CascadeType.ALL)
	@NotFound(action = NotFoundAction.IGNORE)
	@JsonManagedReference
	private List<Partner> partnerList;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "diagram", cascade = CascadeType.ALL)
	@NotFound(action = NotFoundAction.IGNORE)
	@JsonManagedReference
	private List<Relationship> relationshipList;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "diagram", cascade = CascadeType.ALL)
	@NotFound(action = NotFoundAction.IGNORE)
	@JsonManagedReference
	private List<Shapes> shapesList;
}
