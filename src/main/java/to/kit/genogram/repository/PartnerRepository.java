package to.kit.genogram.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.genogram.entity.Partner;

/**
 * パートナーリポジトリー.
 * @author H.Sasai
 */
public interface PartnerRepository extends JpaRepository<Partner, String> {
	/**
	 * ダイアグラム内のパートナーを取得.
	 * @param diagramId ダイアグラムID
	 * @return パートナー一覧
	 */
	List<Partner> findByDiagramId(String diagramId);
}
