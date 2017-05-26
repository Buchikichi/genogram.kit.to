package to.kit.genogram.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Data;

/**
 * パートナーエンティティ.
 * @author H.Sasai
 */
@Entity
@Data
public class Partner {
	@Id
	private String id;
	private String type;
	@Column(insertable = false, updatable = false)
	private Date created;
	@Column(insertable = false)
	private Date updated;

	@ManyToOne
	@JsonBackReference
	private Diagram diagram;

	@OneToOne
	@NotFound(action = NotFoundAction.IGNORE)
	private Person person;

	@OneToOne
	@NotFound(action = NotFoundAction.IGNORE)
	private Person other;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "parents")
	@JsonBackReference
//	@JsonManagedReference
	private List<Person> children;
}
