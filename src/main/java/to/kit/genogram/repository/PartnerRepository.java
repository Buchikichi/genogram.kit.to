package to.kit.genogram.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import to.kit.genogram.entity.Partner;

/**
 * パートナーリポジトリー.
 * @author H.Sasai
 */
public interface PartnerRepository extends JpaRepository<Partner, String> {
	// nop
}
