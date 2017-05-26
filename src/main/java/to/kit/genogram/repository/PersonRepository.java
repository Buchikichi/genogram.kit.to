package to.kit.genogram.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.genogram.entity.Person;

/**
 * パーソンリポジトリー.
 * @author H.Sasai
 */
public interface PersonRepository extends JpaRepository<Person, String> {
	// nop
}
