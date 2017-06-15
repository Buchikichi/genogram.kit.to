package to.kit.genogram.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Data;
import to.kit.genogram.enumeration.LineStyleType;
import to.kit.genogram.enumeration.ShapeType;

/**
 * シェイプエンティティ.
 * @author H.Sasai
 */
@Entity
@Data
public class Shapes {
	@Id
	private String id;
	private String parentId;
	private ShapeType type;
	private float x;
	private float y;
	private LineStyleType lineStyle;
	@Column(insertable = false, updatable = false)
	private Date created;
	@Column(insertable = false)
	private Date updated;

	@ManyToOne
	@JsonBackReference
	private Diagram diagram;
}
