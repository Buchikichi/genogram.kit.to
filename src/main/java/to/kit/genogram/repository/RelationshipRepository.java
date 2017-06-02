package to.kit.genogram.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.genogram.entity.Relationship;

/**
 * リレーションシップリポジトリー.
 * @author H.Sasai
 */
public interface RelationshipRepository extends JpaRepository<Relationship, String> {
	/**
	 * ダイアグラム内のリレーションシップを取得.
	 * @param diagramId ダイアグラムID
	 * @return リレーションシップ一覧
	 */
	List<Relationship> findByDiagramId(String diagramId);
}
