package to.kit.genogram.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.genogram.entity.Diagram;

/**
 * ダイアグラムリポジトリー.
 * @author H.Sasai
 */
public interface DiagramRepository extends JpaRepository<Diagram, String> {
	/**
	 * ドキュメントIDをもとに、ダイアグラムを取得.
	 * @param documentId ドキュメントID
	 * @return ダイアグラム
	 */
	Diagram findByDocumentId(String documentId);
}
