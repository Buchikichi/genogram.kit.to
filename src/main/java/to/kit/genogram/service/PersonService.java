package to.kit.genogram.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import to.kit.genogram.entity.Person;
import to.kit.genogram.repository.PersonRepository;

@Service
public class PersonService {
	@Autowired
	private PersonRepository personRepository;

	@Transactional
	public boolean save(List<Person> personList) {
		List<Person> resultList = this.personRepository.save(personList);

		return true;
	}
}
