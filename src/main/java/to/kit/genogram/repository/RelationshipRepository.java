package to.kit.genogram.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.genogram.entity.Relationship;

/**
 * リレーションシップリポジトリー.
 * @author H.Sasai
 */
public interface RelationshipRepository extends JpaRepository<Relationship, String> {
	/**
	 * リレーションシップを削除.
	 * @param diagramId ダイアグラムID
	 * @return 削除件数
	 */
	int deleteByDiagramId(String diagramId);
}
