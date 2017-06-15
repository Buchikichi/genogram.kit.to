package to.kit.genogram.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.genogram.entity.Shapes;

/**
 * シェイプリポジトリー.
 * @author H.Sasai
 */
public interface ShapesRepository extends JpaRepository<Shapes, String> {
	/**
	 * ダイアグラム内のシェイプを取得.
	 * @param diagramId ダイアグラムID
	 * @return シェイプ一覧
	 */
	List<Shapes> findByDiagramId(String diagramId);
}
