package to.kit.genogram.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;

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
	private String description;
	private String image;
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
}
