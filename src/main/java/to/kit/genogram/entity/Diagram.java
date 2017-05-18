package to.kit.genogram.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

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
}
