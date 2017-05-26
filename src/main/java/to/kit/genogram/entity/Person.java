package to.kit.genogram.entity;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;

/**
 * パーソンエンティティ.
 * @author H.Sasai
 */
@Entity
@Data
public class Person {
	@Id
	private String id;
	private String name;
	private String description;
	private float dx;
	private float dy;
	private String gender;
	private String dob;
	private String dod;
	private String attr;
	@Column(insertable = false, updatable = false)
	private Date created;
	@Column(insertable = false)
	private Date updated;

	@ManyToOne
	@JsonBackReference
	private Diagram diagram;

	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@NotFound(action = NotFoundAction.IGNORE)
	@JsonManagedReference
	private Partner parents;

//	@OneToMany(fetch = FetchType.LAZY, mappedBy = "person", cascade = CascadeType.ALL)
//	@NotFound(action = NotFoundAction.IGNORE)
//	@JsonManagedReference
//	private List<Partner> partnerList;
}
