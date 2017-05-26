package to.kit.genogram.service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import to.kit.genogram.entity.Diagram;
import to.kit.genogram.entity.Partner;
import to.kit.genogram.entity.Person;
import to.kit.genogram.repository.DiagramRepository;

/**
 * ダイアグラムサービス.
 * @author H.Sasai
 */
@Service
public class DiagramService {
	@Autowired
	private DiagramRepository diagramRepository;

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
		return this.diagramRepository.findOne(id);
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
		Diagram saved = this.diagramRepository.saveAndFlush(diagram);

//		savePersonlist(saved, personList);
		return saved;
	}
}
