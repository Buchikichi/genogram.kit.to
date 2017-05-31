package to.kit.genogram.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import to.kit.genogram.entity.Diagram;
import to.kit.genogram.entity.Partner;
import to.kit.genogram.entity.Person;
import to.kit.genogram.entity.Relationship;
import to.kit.genogram.repository.DiagramRepository;
import to.kit.genogram.repository.RelationshipRepository;

/**
 * ダイアグラムサービス.
 * @author H.Sasai
 */
@Service
public class DiagramService {
	@Autowired
	private DiagramRepository diagramRepository;
	@Autowired
	private RelationshipRepository relationshipRepository;

	/**
	 * 一覧取得.
	 * @return 一覧
	 */
	@Transactional
	public List<Diagram> list() {
		return this.diagramRepository.findAll();
	}

	/**
	 * 一件取得.
	 * @param id ダイアグラムID
	 * @return レコード
	 */
	@Transactional
	public Diagram select(String id) {
		Diagram diagram = this.diagramRepository.findOne(id);
		List<Person> personList = diagram.getPersonList();

		Collections.sort(personList, new Comparator<Person>() {
			@Override
			public int compare(Person o1, Person o2) {
				return o1.getSeq() - o2.getSeq();
			}
		});
		return diagram;
	}

	/**
	 * 一件取得(ドキュメントID指定).
	 * @param documentId ドキュメントID
	 * @return レコード
	 */
	public Diagram detail(String documentId) {
		return this.diagramRepository.findByDocumentId(documentId);
	}

	/**
	 * 保存.
	 * @param diagram エンティティ
	 * @return 保存後のエンティティ
	 */
	@Transactional
	public Diagram save(Diagram diagram) {
		String id = diagram.getId();

		if (id == null || id.isEmpty()) {
			diagram.setId(UUID.randomUUID().toString());
		}
		diagram.setUpdated(new Date());
		for (Person person : diagram.getPersonList()) {
			Partner parents = person.getParents();

			person.setDiagram(diagram);
			person.setUpdated(new Date());
			if (parents != null) {
				parents.setDiagram(diagram);
				parents.setUpdated(new Date());
			}
		}
		this.relationshipRepository.deleteByDiagramId(id);
		for (Relationship relationship: diagram.getRelationshipList()) {
			relationship.setDiagram(diagram);
			relationship.setUpdated(new Date());
		}
		Diagram saved = this.diagramRepository.saveAndFlush(diagram);

		return saved;
	}
}
