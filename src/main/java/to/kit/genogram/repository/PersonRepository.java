package to.kit.genogram.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.genogram.entity.Person;

/**
 * パーソンリポジトリー.
 * @author H.Sasai
 */
public interface PersonRepository extends JpaRepository<Person, String> {
	/**
	 * ダイアグラム内のパーソンを取得.
	 * @param diagramId ダイアグラムID
	 * @return パーソン一覧
	 */
	List<Person> findByDiagramId(String diagramId);
}
