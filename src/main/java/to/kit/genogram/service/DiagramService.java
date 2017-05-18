package to.kit.genogram.service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import to.kit.genogram.entity.Diagram;
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
		Diagram entity = null;

		if (id == null || id.isEmpty()) {
			diagram.setId(UUID.randomUUID().toString());
		} else {
			entity = this.diagramRepository.findOne(id);
			if (entity != null) {
				diagram.setCreated(entity.getCreated());
				diagram.setUpdated(new Date());
			}
		}
		return this.diagramRepository.saveAndFlush(diagram);
	}
}
