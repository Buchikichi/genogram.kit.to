package to.kit.genogram.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import to.kit.genogram.entity.Diagram;
import to.kit.genogram.entity.Partner;
import to.kit.genogram.entity.Person;
import to.kit.genogram.entity.Relationship;
import to.kit.genogram.repository.DiagramRepository;
import to.kit.genogram.repository.PartnerRepository;
import to.kit.genogram.repository.PersonRepository;
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
	private PersonRepository personRepository;
	@Autowired
	private PartnerRepository partnerRepository;
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

	private void preparePerson(Diagram diagram) {
		for (Person person : diagram.getPersonList()) {
			Partner parents = person.getParents();

			person.setDiagram(diagram);
			person.setUpdated(new Date());
			if (parents != null) {
				parents.setDiagram(diagram);
				parents.setUpdated(new Date());
			}
		}
	}

	private void prepareRelationship(Diagram diagram) {
		for (Relationship relationship: diagram.getRelationshipList()) {
			relationship.setDiagram(diagram);
			relationship.setUpdated(new Date());
		}
	}

	private void savePairs(Diagram diagram, List<Partner> pairList) {
		for (Partner pair : pairList) {
			pair.setDiagram(diagram);
			pair.setUpdated(new Date());
			this.partnerRepository.save(pair);
		}
	}

	private void deleteUnusedPerson(Diagram diagram) {
		Set<String> valid = new HashSet<>();
		List<Person> allList = this.personRepository.findByDiagramId(diagram.getId());

		for (Person person : diagram.getPersonList()) {
			valid.add(person.getId());
		}
		for (Person person : allList) {
			if (!valid.contains(person.getId())) {
				this.personRepository.delete(person);
			}
		}
	}

	private void deleteUnusedPair(Diagram diagram) {
		Set<String> valid = new HashSet<>();
		List<Partner> allList = this.partnerRepository.findByDiagramId(diagram.getId());

		for (Person person : diagram.getPersonList()) {
			Partner parents = person.getParents();

			if (parents != null) {
				valid.add(parents.getId());
			}
		}
		for (Partner pair : diagram.getPartnerList()) {
			valid.add(pair.getId());
		}
		for (Partner pair : allList) {
			if (!valid.contains(pair.getId())) {
				this.partnerRepository.delete(pair);
			}
		}
	}

	private void deleteUnuserdRelationship(Diagram diagram) {
		Set<String> valid = new HashSet<>();
		List<Relationship> allList = this.relationshipRepository.findByDiagramId(diagram.getId());

		for (Relationship relationship : diagram.getRelationshipList()) {
			valid.add(relationship.getId());
		}
		for (Relationship relationship : allList) {
			if (!valid.contains(relationship.getId())) {
				this.relationshipRepository.delete(relationship);
			}
		}
	}

	/**
	 * 未使用レコードを削除.
	 * @param diagram ダイアグラム
	 */
	@Transactional
	public void clearUnused(Diagram diagram) {
		deleteUnusedPair(diagram);
		deleteUnuserdRelationship(diagram);
		// Personは最後
		deleteUnusedPerson(diagram);
	}

	/**
	 * 保存.
	 * @param diagram エンティティ
	 * @return 保存後のエンティティ
	 */
	@Transactional
	public Diagram save(Diagram diagram) {
		String id = diagram.getId();
		List<Partner> pairList = new ArrayList<>(diagram.getPartnerList());

		if (id == null || id.isEmpty()) {
			diagram.setId(UUID.randomUUID().toString());
		}
		diagram.getPartnerList().clear();
		diagram.setUpdated(new Date());
		preparePerson(diagram);
		prepareRelationship(diagram);
		Diagram saved = this.diagramRepository.saveAndFlush(diagram);

		if (saved == null) {
			return null;
		}
		savePairs(diagram, pairList);
		return saved;
	}
}
