package to.kit.genogram.web;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import to.kit.genogram.entity.Diagram;
import to.kit.genogram.entity.Partner;
import to.kit.genogram.entity.Person;
import to.kit.genogram.service.DiagramService;

/**
 * Hello.
 * @author H.Sasai
 */
@Controller
public class HelloController {
	@Autowired
	private DiagramService diagramService;

	/**
	 * hello.
	 * @return 文字列
	 */
	@RequestMapping("/hello")
	@ResponseBody
	public String hello() {
		Diagram diagram = new Diagram();
		List<Person> personList = new ArrayList<>();

		Person father = new Person();
		father.setId(UUID.randomUUID().toString());
		father.setName("Father");
		father.setGender("m");
		father.setDiagram(diagram);
		personList.add(father);

		Person mother = new Person();
		mother.setId(UUID.randomUUID().toString());
		mother.setName("Mother");
		mother.setGender("f");
		mother.setDiagram(diagram);
		personList.add(mother);

		Partner parents = new Partner();
		Person p1 = new Person();
		p1.setId(UUID.randomUUID().toString());
		p1.setName("P1");
		p1.setGender("m");
		p1.setDiagram(diagram);
		p1.setParents(parents);
		personList.add(p1);

		parents.setId(UUID.randomUUID().toString());
		parents.setDiagram(diagram);
		parents.setType("m");
		parents.setPerson(father);
		parents.setOther(mother);

		diagram.setId(UUID.randomUUID().toString());
		diagram.setDocumentId("d");
		diagram.setPersonId("p");
		diagram.setPersonList(personList);
		this.diagramService.save(diagram);
		return "Welcome!!!";
	}
}
